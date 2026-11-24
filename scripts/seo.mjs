// Usage: node scripts/seo.mjs https://yourdomain.com
// Writes public/sitemap.xml and public/robots.txt, and adds the canonical link, og:url,
// absolute og:image and the site URL to index.html. Run it once, then rebuild and redeploy.
import { readFileSync, writeFileSync } from 'node:fs';
const raw = process.argv[2];
if (!raw || !/^https:\/\/[^/\s]+/.test(raw)) { console.error('Give your https address, e.g. node scripts/seo.mjs https://example.com'); process.exit(1); }
const url = raw.replace(/\/+$/, '');
const today = new Date().toISOString().slice(0, 10);
writeFileSync('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${url}/</loc><lastmod>${today}</lastmod></url>\n</urlset>\n`);
writeFileSync('public/robots.txt', `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${url}/sitemap.xml\n`);
let h = readFileSync('index.html', 'utf8');
h = h.replace(/\s*<link rel="canonical"[^>]*>/, '').replace(/\s*<meta property="og:url"[^>]*>/, '');
h = h.replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${url}/images/hero-kicc.webp$2`);
h = h.replace('<link rel="icon"', `<link rel="canonical" href="${url}/" />\n  <meta property="og:url" content="${url}/" />\n  <link rel="icon"`);
h = h.replace(/"@type":"Organization",(?:"url":"[^"]*",)?/, `"@type":"Organization","url":"${url}/",`);
writeFileSync('index.html', h);
console.log('Done for', url);
