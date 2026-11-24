import http from 'node:http';
import { createHash, timingSafeEqual } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { openDb } from './lib/db.js';
import { createRateLimiter } from './lib/rateLimit.js';
import { createMailer } from './lib/mail.js';
import { validateInquiry, STATUSES } from './lib/validate.js';
import { askAgent, cleanMessages } from './lib/agent.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const MAX_BODY = 20 * 1024;

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2', '.xml': 'application/xml',
};

const SITE_CSP = [
  "default-src 'self'", "script-src 'self'", "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com", "img-src 'self' data: blob:", "connect-src 'self'", "worker-src 'self' blob:",
  "base-uri 'self'", "form-action 'self' mailto:", "frame-ancestors 'none'",
].join('; ');
const ADMIN_CSP = "default-src 'self'; style-src 'self'; script-src 'self'; frame-ancestors 'none'";

export function loadConfig(env = process.env) {
  return {
    port: Number(env.PORT || 8787),
    host: env.HOST || '0.0.0.0',
    dataDir: env.DATA_DIR || path.join(here, 'data'),
    distDir: env.DIST_DIR || path.join(here, '..', 'dist'),
    adminToken: env.ADMIN_TOKEN || '',
    trustProxy: env.TRUST_PROXY === '1',
    allowedOrigin: env.ALLOWED_ORIGIN || '',
    ipSalt: env.IP_SALT || 'ryvqena',
    rateMax: Number(env.RATE_MAX || 5),
    rateWindowMs: Number(env.RATE_WINDOW_MS || 10 * 60 * 1000),
    resendKey: env.RESEND_API_KEY || '',
    mailFrom: env.MAIL_FROM || '',
    notifyTo: env.NOTIFY_TO || '',
    anthropicKey: env.ANTHROPIC_API_KEY || '',
    anthropicModel: env.ANTHROPIC_MODEL || 'claude-sonnet-5-5',
    agentMax: Number(env.AGENT_RATE_MAX || 20),
  };
}

const digest = (s) => createHash('sha256').update(String(s)).digest();
function tokenOk(given, expected) {
  if (!expected) return false;
  return timingSafeEqual(digest(given), digest(expected));
}

const csvCell = (v) => {
  let s = String(v ?? '');
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // stop spreadsheet formula injection
  return `"${s.replace(/"/g, '""')}"`;
};

export function createApp(config) {
  const db = openDb(config.dataDir);
  const limiter = createRateLimiter({ max: config.rateMax, windowMs: config.rateWindowMs });
  const agentLimiter = createRateLimiter({ max: config.agentMax, windowMs: config.rateWindowMs });
  const mailer = createMailer({ apiKey: config.resendKey, from: config.mailFrom, to: config.notifyTo });

  const baseHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'DENY',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };

  function send(res, status, body, headers = {}) {
    const h = { ...baseHeaders, ...headers };
    if (config.allowedOrigin) {
      h['Access-Control-Allow-Origin'] = config.allowedOrigin;
      h['Vary'] = 'Origin';
    }
    res.writeHead(status, h);
    res.end(body);
  }
  const json = (res, status, obj, extra = {}) =>
    send(res, status, JSON.stringify(obj), { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra });

  function clientIp(req) {
    if (config.trustProxy) {
      const xf = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
      if (xf) return xf;
    }
    return req.socket.remoteAddress || 'unknown';
  }

  function readJson(req) {
    return new Promise((resolve, reject) => {
      const ct = String(req.headers['content-type'] || '');
      if (!ct.includes('application/json')) return reject({ status: 415, message: 'Send JSON (Content-Type: application/json).' });
      let size = 0;
      const chunks = [];
      req.on('data', (c) => {
        size += c.length;
        if (size > MAX_BODY) {
          reject({ status: 413, message: 'Request is too large.' });
          req.destroy();
          return;
        }
        chunks.push(c);
      });
      req.on('end', () => {
        try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); }
        catch { reject({ status: 400, message: 'Invalid JSON.' }); }
      });
      req.on('error', () => reject({ status: 400, message: 'Request failed.' }));
    });
  }

  function adminGuard(req, res) {
    if (!config.adminToken) { json(res, 503, { ok: false, message: 'Admin is disabled. Set ADMIN_TOKEN to enable it.' }); return false; }
    const m = /^Bearer (.+)$/.exec(String(req.headers.authorization || ''));
    if (!m || !tokenOk(m[1], config.adminToken)) { json(res, 401, { ok: false, message: 'Unauthorised.' }, { 'WWW-Authenticate': 'Bearer' }); return false; }
    return true;
  }

  async function handleApi(req, res, url) {
    const p = url.pathname;

    if (req.method === 'OPTIONS') {
      return send(res, 204, '', {
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '600',
      });
    }

    if (p === '/api/health' && req.method === 'GET') return json(res, 200, { ok: true, mail: mailer.enabled, admin: Boolean(config.adminToken), agent: Boolean(config.anthropicKey) });

    if (p === '/api/agent' && req.method === 'POST') {
      let body;
      try { body = await readJson(req); } catch (e) { return json(res, e.status || 400, { ok: false, message: e.message }); }
      const messages = cleanMessages(body && body.messages);
      if (!messages) return json(res, 400, { ok: false, message: 'Send a list of messages that ends with a question.' });
      if (!agentLimiter.take(clientIp(req))) return json(res, 429, { ok: false, message: 'Too many questions for now. Please try again later or contact us directly.' });
      // No key or the AI is down: say so, and the page answers from its built-in knowledge instead.
      const reply = await askAgent(messages, { apiKey: config.anthropicKey, model: config.anthropicModel });
      return json(res, 200, reply ? { ok: true, mode: 'ai', reply } : { ok: true, mode: 'basic' });
    }

    if (p === '/api/inquiries' && req.method === 'POST') {
      let body;
      try { body = await readJson(req); } catch (e) { return json(res, e.status || 400, { ok: false, message: e.message }); }
      if (body && typeof body.website === 'string' && body.website.trim()) return json(res, 201, { ok: true }); // honeypot: pretend success, store nothing
      const ip = clientIp(req);
      if (!limiter.take(ip)) return json(res, 429, { ok: false, message: 'Too many enquiries from your connection. Please try again later or email us.' }, { 'Retry-After': String(Math.ceil(config.rateWindowMs / 1000)) });
      const v = validateInquiry(body);
      if (!v.ok) return json(res, 400, { ok: false, message: 'Please check the highlighted fields.', errors: v.errors });
      const ipHash = createHash('sha256').update(config.ipSalt + ip).digest('hex').slice(0, 32);
      const id = db.create(v.value, ipHash);
      json(res, 201, { ok: true, id });
      // Email after responding so a slow provider never delays the visitor. Failure is logged, the enquiry is already saved.
      if (mailer.enabled) {
        mailer.notify({ ...v.value, id }).then(() => db.markNotified(id)).catch((err) => console.error(`[mail] enquiry #${id}: ${err.message}`));
      }
      return;
    }

    if (p === '/api/admin/inquiries' && req.method === 'GET') {
      if (!adminGuard(req, res)) return;
      const status = url.searchParams.get('status') || '';
      if (status && !STATUSES.includes(status)) return json(res, 400, { ok: false, message: 'Unknown status.' });
      const limit = Math.min(200, Math.max(1, Number(url.searchParams.get('limit')) || 50));
      const offset = Math.max(0, Number(url.searchParams.get('offset')) || 0);
      return json(res, 200, { ok: true, ...db.list({ status, limit, offset }) });
    }

    if (p === '/api/admin/inquiries.csv' && req.method === 'GET') {
      if (!adminGuard(req, res)) return;
      const { items } = db.list({ status: '', limit: 100000, offset: 0 });
      const head = ['id', 'created_at', 'status', 'name', 'email', 'organisation', 'service', 'message'];
      const rows = [head.join(','), ...items.map((r) => head.map((k) => csvCell(r[k])).join(','))];
      return send(res, 200, rows.join('\n'), { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="ryvqena-inquiries.csv"', 'Cache-Control': 'no-store' });
    }

    const m = /^\/api\/admin\/inquiries\/(\d+)$/.exec(p);
    if (m && req.method === 'PATCH') {
      if (!adminGuard(req, res)) return;
      let body;
      try { body = await readJson(req); } catch (e) { return json(res, e.status || 400, { ok: false, message: e.message }); }
      if (!STATUSES.includes(body?.status)) return json(res, 400, { ok: false, message: `Status must be one of: ${STATUSES.join(', ')}.` });
      if (!db.setStatus(Number(m[1]), body.status)) return json(res, 404, { ok: false, message: 'Not found.' });
      return json(res, 200, { ok: true, item: db.get(Number(m[1])) });
    }

    return json(res, 404, { ok: false, message: 'Not found.' });
  }

  async function serveFile(res, file, { immutable = false, csp = SITE_CSP } = {}) {
    const data = await readFile(file);
    const type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
    const h = { 'Content-Type': type, 'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache' };
    if (type.startsWith('text/html')) h['Content-Security-Policy'] = csp;
    send(res, 200, data, h);
  }

  async function handleStatic(req, res, url) {
    if (req.method !== 'GET' && req.method !== 'HEAD') return json(res, 405, { ok: false, message: 'Method not allowed.' });
    let rel;
    try { rel = decodeURIComponent(url.pathname); } catch { return json(res, 400, { ok: false, message: 'Bad path.' }); }

    if (rel === '/admin' || rel === '/admin/') return serveFile(res, path.join(here, 'admin', 'index.html'), { csp: ADMIN_CSP });
    if (rel === '/admin/admin.js' || rel === '/admin/admin.css') return serveFile(res, path.join(here, 'admin', path.basename(rel)));

    const root = path.resolve(config.distDir);
    const target = path.resolve(root, '.' + rel);
    if (target !== root && !target.startsWith(root + path.sep)) return json(res, 403, { ok: false, message: 'Forbidden.' });
    try {
      const st = await stat(target);
      if (st.isFile()) return serveFile(res, target, { immutable: rel.startsWith('/assets/') });
    } catch { /* fall through */ }
    if (path.extname(rel)) return json(res, 404, { ok: false, message: 'Not found.' });
    try { return await serveFile(res, path.join(root, 'index.html')); }
    catch { return send(res, 404, 'Site build not found. Run "npm run build" first.', { 'Content-Type': 'text/plain; charset=utf-8' }); }
  }

  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url || '/', 'http://localhost');
      if (url.pathname.startsWith('/api/')) return await handleApi(req, res, url);
      return await handleStatic(req, res, url);
    } catch (err) {
      console.error('[server]', err);
      if (!res.headersSent) json(res, 500, { ok: false, message: 'Something went wrong on our side.' });
      else res.end();
    }
  });
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;

  return {
    server,
    db,
    close: () => new Promise((r) => { limiter.close(); agentLimiter.close(); server.close(() => { db.close(); r(); }); server.closeAllConnections?.(); }),
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const config = loadConfig();
  const app = createApp(config);
  app.server.listen(config.port, config.host, () => {
    console.log(`Ryvqena Tech server on http://localhost:${config.port}`);
    console.log(`  database : ${path.join(config.dataDir, 'ryvqena.db')}`);
    console.log(`  admin    : ${config.adminToken ? '/admin (token set)' : 'disabled (set ADMIN_TOKEN)'}`);
    console.log(`  email    : ${config.resendKey && config.mailFrom && config.notifyTo ? 'enabled' : 'off (enquiries are saved only)'}`);
  });
  const stop = () => app.close().then(() => process.exit(0));
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
}
