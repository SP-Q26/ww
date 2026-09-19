#!/usr/bin/env node
/**
 * Regenerate Journal static HTML + sitemap from sites/weddings/public/data/posts.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUB = path.join(ROOT, "sites/weddings/public");
const DATA_PATH = path.join(PUB, "data/posts.json");

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function jsonLd(obj) {
  return `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
}

function pillarLabel(pillar) {
  if (pillar === "luxe") return "Senior portraits";
  return "Weddings";
}

function headBlock({ title, description, canonical, type, published }) {
  const ogType = type === "article" ? "article" : "website";
  return `
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#f9f6f0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="${esc(canonical)}" />
  <meta property="og:site_name" content="Whispering Woods Journal" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta property="og:type" content="${ogType}" />
  <meta property="og:locale" content="en_US" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  ${published ? `<meta property="article:published_time" content="${esc(published)}" />` : ""}
  <link rel="stylesheet" href="/assets/ww-weddings.css" />
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />`;
}

function stickyBar() {
  return `
<nav class="ww-sticky" aria-label="Estate links">
  <a href="/go/tour" data-ww-out="tour">Tour</a>
  <a href="/go/venue" data-ww-out="venue">Venue</a>
  <a href="/go/luxe" data-ww-out="luxe">Seniors</a>
</nav>`;
}

function captureBlock() {
  return `
<section class="ww-panel ww-capture" id="tips">
  <p class="ww-eyebrow">Save ideas</p>
  <h2>Send me the next pin-worthy tip</h2>
  <p class="ww-dek">One email when we publish something worth screenshotting. Unsubscribe anytime.</p>
  <form id="ww-capture-form">
    <label class="ww-sr-only" for="ww-email">Email</label>
    <div class="ww-capture-row">
      <input id="ww-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required />
      <button class="ww-cta" type="submit">Send me ideas</button>
    </div>
    <small>Product emails only · unsubscribe anytime</small>
    <p id="ww-capture-msg" class="ww-msg" role="status"></p>
  </form>
</section>`;
}

function footerBlock() {
  return `
<footer class="ww-footer">
  <p><a href="/go/venue" data-ww-out="venue">Whispering Woods Events</a> · <a href="/go/luxe" data-ww-out="luxe">Whispering Woods Luxe</a> · <a href="https://whisperingwoodsluxe.com/home?utm_source=ww_journal&utm_medium=footer&utm_campaign=estate_rebrand_2026" rel="noopener noreferrer">Class of 2027 on Luxe</a></p>
</footer>`;
}

function readData() {
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
}

function writePost(site, post) {
  const origin = site.origin.replace(/\/$/, "");
  const canonical = `${origin}/p/${post.slug}/`;
  const title = `${post.title} | Whispering Woods Journal`;
  const description = post.dek;
  const ctaDest = post.cta?.dest || "venue";
  const ctaLabel = post.cta?.label || "Learn more";
  const paragraphs = (post.paragraphs || []).map((p) => `<p>${esc(p)}</p>`).join("\n");

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.dek,
    datePublished: post.published,
    dateModified: post.updated || post.published,
    author: { "@type": "Organization", name: "Whispering Woods Journal" },
    publisher: { "@type": "Organization", name: site.name, url: origin },
    mainEntityOfPage: canonical,
    url: canonical
  };

  const html = `<!DOCTYPE html>
<html lang="en" data-origin="${esc(origin)}">
<head>
${headBlock({ title, description, canonical, type: "article", published: post.published })}
${jsonLd(articleLd)}
</head>
<body class="ww-page-article">
  <div class="ww-wrap ww-wrap--article">
    <header class="ww-top ww-top--airy">
      <a class="ww-brand" href="/">Whispering Woods <em>Journal</em></a>
      <nav class="ww-nav ww-nav--text">
        <a href="/go/venue" data-ww-out="venue">Weddings</a>
        <a href="/go/luxe" data-ww-out="luxe">Senior portraits</a>
      </nav>
    </header>
    <article class="ww-panel">
      <p class="ww-eyebrow">${esc(pillarLabel(post.pillar))} · ${post.readMinutes || 3} min</p>
      <h1>${esc(post.title)}</h1>
      <p class="ww-dek">${esc(post.dek)}</p>
      <div class="ww-prose">${paragraphs}</div>
      <a class="ww-cta" href="/go/${esc(ctaDest)}" data-ww-out="${esc(ctaDest)}" data-ww-slug="${esc(post.slug)}">${esc(ctaLabel)}</a>
      <div class="ww-share">
        <a class="ww-pill" href="https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(canonical)}&description=${encodeURIComponent(post.title)}" target="_blank" rel="noopener noreferrer">Pin this</a>
        <a class="ww-pill ww-cta--ghost" href="/">More tips</a>
      </div>
    </article>
    ${footerBlock()}
  </div>
${stickyBar()}
  <script src="/assets/ww-weddings.js" defer></script>
</body>
</html>`;

  const dir = path.join(PUB, "p", post.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
}

function writeIndex(site, posts) {
  const origin = site.origin.replace(/\/$/, "");
  const title = `${site.name} · ${site.tagline}`;
  const description = site.description;
  const canonical = `${origin}/`;
  const heroLead = site.heroLead || site.description;

  const deckCards = posts
    .map((post, i) => {
      const hook = post.hook || post.dek;
      const listTitle = post.listTitle || post.title;
      return `<article class="ww-deck-card" id="ww-deck-card-${i}" data-slug="${esc(post.slug)}">
        <span class="ww-pillar">${esc(pillarLabel(post.pillar))}</span>
        <p class="ww-deck-hook">${esc(hook)}</p>
        <h2 class="ww-deck-title">${esc(listTitle)}</h2>
        <a class="ww-deck-open" href="/p/${esc(post.slug)}/">Read the full tip</a>
      </article>`;
    })
    .join("\n");

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: origin,
    description: site.description
  };
  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: site.name,
    description: site.description,
    url: origin
  };

  const html = `<!DOCTYPE html>
<html lang="en" data-origin="${esc(origin)}">
<head>
${headBlock({ title, description, canonical, type: "website" })}
${jsonLd(orgLd)}
${jsonLd(blogLd)}
</head>
<body class="ww-page-home">
  <div class="ww-wrap">
    <header class="ww-top ww-top--airy">
      <a class="ww-brand" href="/">Whispering Woods <em>Journal</em></a>
      <nav class="ww-nav ww-nav--text">
        <a href="/go/venue" data-ww-out="venue">Weddings</a>
        <a href="/go/luxe" data-ww-out="luxe">Senior portraits</a>
      </nav>
    </header>
    <section class="ww-hero ww-hero--airy">
      <p class="ww-eyebrow">Harvard, Illinois · 40 acres</p>
      <h1>${esc(site.tagline)}</h1>
      <p class="ww-hero-lead">${esc(heroLead)}</p>
    </section>
    ${captureBlock()}
    <div class="ww-deck-head">
      <h2 class="ww-deck-label">Swipe for ideas</h2>
      <p class="ww-deck-hint">Cards rotate every few seconds · tap Next or open an idea. The page stays put.</p>
      <div class="ww-deck-controls" aria-label="Deck navigation">
        <button type="button" class="ww-deck-nav" id="ww-deck-prev">Previous</button>
        <button type="button" class="ww-deck-nav" id="ww-deck-next">Next</button>
        <span class="ww-deck-counter" id="ww-deck-counter" aria-live="polite">1 / ${posts.length}</span>
      </div>
      <a class="ww-tour-link" href="/go/tour" data-ww-out="tour">Tour the estate</a>
    </div>
    <div class="ww-deck-rail" id="ww-deck" tabindex="0">${deckCards}</div>
    ${footerBlock()}
  </div>
${stickyBar()}
  <script src="/assets/ww-weddings.js" defer></script>
</body>
</html>`;

  fs.writeFileSync(path.join(PUB, "index.html"), html);
}

function writeSitemap(site, posts) {
  const origin = site.origin.replace(/\/$/, "");
  const urls = [
    { loc: `${origin}/`, lastmod: "2026-09-18" },
    ...posts.map((p) => ({
      loc: `${origin}/p/${p.slug}/`,
      lastmod: p.updated || p.published
    }))
  ];
  const body = urls
    .map(
      (u) => `  <url>
    <loc>${esc(u.loc)}</loc>
    <lastmod>${esc(u.lastmod)}</lastmod>
  </url>`
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
  fs.writeFileSync(path.join(PUB, "sitemap.xml"), xml);
}

function main() {
  const { site, posts } = readData();
  if (!site?.origin || !Array.isArray(posts)) {
    console.error("Invalid posts.json");
    process.exit(1);
  }
  posts.forEach((p) => writePost(site, p));
  writeIndex(site, posts);
  writeSitemap(site, posts);
  console.log(`Generated ${posts.length} posts + index + sitemap → ${PUB}`);
}

main();
