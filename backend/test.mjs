import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createApp, loadConfig } from './server.js';

let app, base, dist;
const TOKEN = 'test-token-123';
const good = { name: 'Amina Otieno', email: 'amina@example.com', organisation: 'Acme Ltd', service: 'Web Development', message: 'We need a new company website.' };
const post = (body, headers = {}) => fetch(`${base}/api/inquiries`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
const auth = { Authorization: `Bearer ${TOKEN}` };

before(async () => {
  dist = mkdtempSync(path.join(tmpdir(), 'rq-dist-'));
  mkdirSync(path.join(dist, 'assets'));
  writeFileSync(path.join(dist, 'index.html'), '<!doctype html><title>Ryvqena</title>');
  writeFileSync(path.join(dist, 'assets', 'a.js'), 'console.log(1)');
  const config = { ...loadConfig({}), port: 0, dataDir: ':memory:', distDir: dist, adminToken: TOKEN, rateMax: 5 };
  app = createApp(config);
  await new Promise((r) => app.server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${app.server.address().port}`;
});
after(() => app.close());

test('health', async () => {
  const r = await fetch(`${base}/api/health`);
  assert.equal(r.status, 200);
  assert.equal((await r.json()).ok, true);
});

test('invalid enquiry is rejected with field errors', async () => {
  const r = await post({ ...good, email: 'nope', message: 'short' });
  assert.equal(r.status, 400);
  const j = await r.json();
  assert.ok(j.errors.email && j.errors.message);
});

test('unknown service is rejected', async () => {
  assert.equal((await post({ ...good, service: 'Hacking' })).status, 400);
});

test('non-JSON content type is rejected', async () => {
  const r = await fetch(`${base}/api/inquiries`, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: 'x' });
  assert.equal(r.status, 415);
});

test('oversized body is rejected', async () => {
  const r = await post({ ...good, message: 'x'.repeat(30000) }).catch(() => ({ status: 413 }));
  assert.equal(r.status, 413);
});

test('honeypot returns success but stores nothing', async () => {
  const before = app.db.list({ status: '', limit: 10, offset: 0 }).total;
  const r = await post({ ...good, website: 'http://spam.example' });
  assert.equal(r.status, 201);
  assert.equal(app.db.list({ status: '', limit: 10, offset: 0 }).total, before);
});

test('valid enquiry is stored', async () => {
  const r = await post(good);
  assert.equal(r.status, 201);
  const j = await r.json();
  assert.ok(j.id > 0);
  assert.equal(app.db.get(j.id).email, 'amina@example.com');
});

test('admin requires the token', async () => {
  assert.equal((await fetch(`${base}/api/admin/inquiries`)).status, 401);
  assert.equal((await fetch(`${base}/api/admin/inquiries`, { headers: { Authorization: 'Bearer wrong' } })).status, 401);
});

test('admin can list, update status and export CSV', async () => {
  const list = await (await fetch(`${base}/api/admin/inquiries`, { headers: auth })).json();
  assert.ok(list.total >= 1);
  const id = list.items[0].id;
  const up = await fetch(`${base}/api/admin/inquiries/${id}`, { method: 'PATCH', headers: { ...auth, 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'replied' }) });
  assert.equal((await up.json()).item.status, 'replied');
  const bad = await fetch(`${base}/api/admin/inquiries/${id}`, { method: 'PATCH', headers: { ...auth, 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'weird' }) });
  assert.equal(bad.status, 400);
  const csv = await fetch(`${base}/api/admin/inquiries.csv`, { headers: auth });
  assert.match(csv.headers.get('content-type'), /text\/csv/);
  assert.match(await csv.text(), /amina@example.com/);
});

test('csv export neutralises formulas', async () => {
  const id = app.db.create({ name: '=HYPERLINK("x")', email: 'a@b.co', organisation: '', service: 'Web Development', message: 'long enough message' }, 'h');
  const csv = await (await fetch(`${base}/api/admin/inquiries.csv`, { headers: auth })).text();
  assert.ok(csv.includes(`"'=HYPERLINK(""x"")"`), `row ${id} not neutralised`);
});

test('rate limit kicks in', async () => {
  let last;
  for (let i = 0; i < 8; i++) last = await post(good);
  assert.equal(last.status, 429);
});

test('static: index, hashed asset, SPA fallback, traversal, missing asset', async () => {
  assert.match(await (await fetch(`${base}/`)).text(), /Ryvqena/);
  const a = await fetch(`${base}/assets/a.js`);
  assert.equal(a.status, 200);
  assert.match(a.headers.get('cache-control'), /immutable/);
  assert.equal((await fetch(`${base}/some/route`)).status, 200);
  assert.equal((await fetch(`${base}/missing.png`)).status, 404);
  const t = await fetch(`${base}/..%2f..%2fetc%2fpasswd`);
  assert.ok(!(await t.text()).includes('root:'));
});

test('security headers present', async () => {
  const r = await fetch(`${base}/`);
  assert.equal(r.headers.get('x-content-type-options'), 'nosniff');
  assert.match(r.headers.get('content-security-policy'), /default-src 'self'/);
});

test('agent rejects bad input', async () => {
  const r = await fetch(`${base}/api/agent`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'system', content: 'x' }] }) });
  assert.equal(r.status, 400);
  const r2 = await fetch(`${base}/api/agent`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [] }) });
  assert.equal(r2.status, 400);
});

test('agent without an API key answers in basic mode', async () => {
  const r = await fetch(`${base}/api/agent`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'user', content: 'What do you build?' }] }) });
  assert.equal(r.status, 200);
  assert.equal((await r.json()).mode, 'basic');
});
