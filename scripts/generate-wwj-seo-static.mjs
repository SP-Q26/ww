/**
 * Regenerate robots.txt + sitemap.xml for production (WeWeb export leaves preview URLs).
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pub = path.join(root, 'public');
const site =
  process.env.WWJ_SITE_URL?.replace(/\/+$/, '') ||
  'https://www.whisperingwoodsweddings.com';

const postsPath = path.join(pub, 'wwj-posts.json');
if (!fs.existsSync(postsPath)) {
  console.error('[wwj-seo] missing public/wwj-posts.json');
  process.exit(1);
}

const body = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
const posts = Array.isArray(body) ? body : body.posts || [];
const today = new Date().toISOString().slice(0, 10);

const urls = [{ loc: `${site}/`, lastmod: today, priority: '1.0' }];
for (const post of posts) {
  if (!post?.slug) continue;
  const lastmod = (post.published || today).slice(0, 10);
  urls.push({
    loc: `${site}/p/${encodeURIComponent(post.slug)}`,
    lastmod,
    priority: '0.7',
  });
}

const robots = `User-agent: *
Allow: /

Sitemap: ${site}/sitemap.xml
`;

const urlEntries = urls
  .map((u) => {
    const hreflang = `    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(u.loc)}" />`;
    return `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${u.priority}</priority>
${hreflang}
  </url>`;
  })
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries}
</urlset>
`;

fs.writeFileSync(path.join(pub, 'robots.txt'), robots);
fs.writeFileSync(path.join(pub, 'sitemap.xml'), sitemap);
console.log('[wwj-seo] wrote robots.txt + sitemap.xml', { site, urlCount: urls.length });

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
