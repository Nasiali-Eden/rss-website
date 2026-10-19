// Renders every route to static HTML after `vite build` so pages load fast on
// slow connections, work without JavaScript, and are fully indexable.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const { render, routes, site } = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href);

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const plausible = process.env.PLAUSIBLE_DOMAIN
  ? `<script defer data-domain="${esc(process.env.PLAUSIBLE_DOMAIN)}" src="https://plausible.io/js/script.js"></script>`
  : '';

function headTags(h, noindex) {
  return [
    `<title>${esc(h.title)}</title>`,
    `<meta name="description" content="${esc(h.description)}" />`,
    `<link rel="canonical" href="${esc(h.canonical)}" />`,
    noindex ? '<meta name="robots" content="noindex" />' : '',
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(site.name)}" />`,
    `<meta property="og:title" content="${esc(h.title)}" />`,
    `<meta property="og:description" content="${esc(h.description)}" />`,
    `<meta property="og:url" content="${esc(h.canonical)}" />`,
    `<meta property="og:image" content="${esc(h.ogImage)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<script type="application/ld+json" id="ld-json">${JSON.stringify(h.jsonLd).replace(/</g, '\\u003c')}</script>`,
    plausible,
  ].filter(Boolean).join('\n    ');
}

const pages = [...routes.map((r) => ({ url: r, file: r === '/' ? 'index.html' : `${r.slice(1)}/index.html` })), { url: '/404', file: '404.html', noindex: true }];
const sitemapUrls = [];

for (const p of pages) {
  const { html, head } = render(p.url);
  const noindex = p.noindex || p.url.startsWith('/news');
  const out = template.replace('<!--head-->', headTags(head, noindex)).replace('<!--app-->', html);
  const file = path.join(dist, p.file);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, out);
  if (!noindex && !(p.url === '/team' && !html.includes('team-card'))) sitemapUrls.push(head.canonical);
  console.log('prerendered', p.url);
}

// sitemap.xml
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls
    .map((u) => `  <url><loc>${u}</loc></url>`)
    .join('\n')}\n</urlset>\n`
);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${site.url}/sitemap.xml\n`);

// Registration expiry: warn (never fail) within 60 days.
const days = (new Date(site.registration.validUntil) - new Date()) / 864e5;
if (days < 60) console.warn(`\n⚠ WARNING: RRC registration expires ${site.registration.validUntil} (${Math.round(days)} days). Renew and update src/content/site.json.\n`);

fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true });
console.log(`\nDone: ${pages.length} pages, sitemap with ${sitemapUrls.length} URLs.`);
