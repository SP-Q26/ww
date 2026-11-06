# WWJ · full audit — SEO, meta, i18n, flow, blog (2026-11-06)

**Site:** https://www.whisperingwoodsweddings.com  
**Repo:** `SP-Q26/ww` · branch **`journal`**  
**Catalog:** `public/wwj-posts.json` · **46** guides · lead `november-estate-dispatch`

---

## Executive summary

| Area | Grade | Blocker |
|------|-------|---------|
| **Runtime / feed / guides** | **Green** (post `ba4e160` prod deploy) | Keep Vercel on latest `journal` |
| **SEO / meta (technical)** | **Red → fix in this commit** | `robots.txt` / `sitemap.xml` pointed at **WeWeb preview**; sitemap had **1 URL** |
| **SEO / meta (articles)** | **Amber → fix in this commit** | Article HTML uses **generic** title/description for every `/p/:slug` |
| **i18n** | **Green (en-only by design)** | No second locale; fix hreflang **URLs** via production sitemap |
| **User flow** | **Green** with smoke checklist | Tour modal + subscribe env optional |
| **Blog / catalog** | **Green** | Git-first feed; refresh via catalog JSON + `build-public` rail |

---

## 1. Blog / catalog update

| Check | Status |
|-------|--------|
| Post count | **46** in `public/wwj-posts.json` |
| Source of truth | `docs/journal/JOURNAL_POSTS_WITH_SERIES_2026-10-22.json` (editorial) |
| Lead story | `november-estate-dispatch` (rolling `{{WWJ_WEEK_OF_MONDAY}}` in body) |
| Deploy path | Edit catalog JSON → rebuild `wwj-posts.json` → push `journal` → Vercel |
| WeWeb variable | **Do not** MCP `editVariable` on `journal_posts` — hydrate from JSON |

**Recommended cadence:** Weekly field-notes / dispatch refresh in catalog; bump `wwj-boot-manifest.json` `runtimeVersion` when Head cache-bust needed.

**Post fields used for SEO (git):** `slug`, `title`, `listTitle`, `dek`, `hook`, `published`, `tags`, `pillar`, `cta_url` — no per-post `image` in catalog today (falls back to site favicon OG image).

---

## 2. SEO sweep

### P0 — Fixed in git (deploy to apply)

| Issue | Before (live) | After |
|-------|----------------|-------|
| `robots.txt` Sitemap line | `49bf8d2b-….weweb-preview.io/sitemap.xml` | `https://www.whisperingwoodsweddings.com/sitemap.xml` |
| `sitemap.xml` | **1** URL (preview host) | **47** URLs (home + **46** `/p/:slug`) |
| Generator | WeWeb export static | `scripts/generate-wwj-seo-static.mjs` in **`vercel-build.sh`** + **postbuild** copy to `dist/` |

### P1 — Article meta (client belt)

WeWeb article shell (`7f21e17b…`) serves the **same** `<title>` and meta description on every guide (generic “Wedding & Estate Portrait Tips”).

**Fix:** `public/wwj-article-seo.js` — after hydrate, sets `document.title`, `description`, Open Graph, and Twitter from catalog by `pageParameters.slug` / path. Load from Project Head (`?v=18`).

**Long-term (canvas):** Bind article page meta to formulas on `journal_posts` + `globalContext.pageParameters.slug` (no MCP loops on bulk posts).

### P2 — Home / shell meta (OK baseline)

Home `vite.config.js` / template: title, description, keywords, `og:site_name`, `twitter:card`, `robots` index — aligned with Harvard / Lake Geneva estate positioning.

### P2 — Canonical

Project Head inline canonical + `og:url` on history navigation — **good**. Article paths should canonical to `https://www.whisperingwoodsweddings.com/p/{slug}` (no trailing slash).

### P3 — Structured data

No `Article` JSON-LD on guides yet — optional follow-up.

### Smoke after deploy

```bash
curl -s https://www.whisperingwoodsweddings.com/robots.txt | tail -1
curl -s https://www.whisperingwoodsweddings.com/sitemap.xml | grep -c whisperingwoodsweddings.com/p/
# View-source on /p/great-white-heron-east-shallows — title should include post title (after article-seo.js + Head paste)
```

---

## 3. i18n audit

| Item | Finding |
|------|---------|
| WeWeb langs | **`en` only** (`window.wwg_designInfo.langs`) |
| `html lang` | `en` |
| `og:locale` | `en_US` |
| hreflang | Single locale — **en** + **x-default** appropriate |
| Export alternates in built HTML | Still reference **preview host** in some prerender shells — **sitemap/robots fix** uses production URLs; republish v19+ after Head paste |
| Spanish / ES | **Not configured** — intentional unless product asks for `es` page clone |

**Verdict:** **English-only site** — no missing translation files; focus on **correct production URLs** in discoverability files, not multi-locale expansion.

---

## 4. Flow audit (user journeys)

| Flow | Expected | Verify |
|------|----------|--------|
| Land `/` or `/home` | 46-story deck, wildlife marquee | Hard refresh |
| Click guide card | `/p/{slug}` article, not “Guide Not Found” | Non-lead slug |
| Browser back | 46 stories + scrolling wildlife | SPA return |
| Trailing slash `/p/slug/` | **301/308** → no slash | curl -I |
| **Tour grounds** | WWE Calendly drawer | Head: `ww-tour-modal.js` + bridge |
| Subscribe | POST `/api/subscribe` | 503 if webhook unset — see `SUBSCRIBE_API.md` |
| External CTAs | `cta_url` on posts → whisperingwoodsevents.com UTM | Spot-check in catalog |

**Runtime deps (Project Head):** `wwj-root-router.js`, `wwj-posts-hydrate.js`, `wwj-wildlife-train.js`, tour pack, **`wwj-article-seo.js`** (new).

Paste map: `docs/journal/JOURNAL_PROJECT_HEAD_PASTE.html`.

---

## 5. Meta checklist (on-point)

| Meta | Home | Article (target) |
|------|------|------------------|
| `<title>` | Journal + geo | `{post.title} · Whispering Woods Journal` |
| `meta description` | Estate / 40 acres | Post `dek` (≤160 chars) |
| `og:title` / `og:description` | Set | Per post via `wwj-article-seo.js` |
| `og:type` | website | **article** on guides |
| `og:image` | favicon asset | favicon until hero images in catalog |
| `twitter:card` | summary_large_image | summary_large_image |
| `link rel=canonical` | `/` | `/p/{slug}` |
| `robots` | index, follow | index, follow |

---

## 6. Ship checklist

1. Merge/push this commit on **`journal`**.  
2. Vercel **production** deploy (confirm SHA ≥ SEO commit).  
3. WeWeb: paste **`JOURNAL_PROJECT_HEAD_PASTE.html`** → publish (includes `wwj-article-seo.js`).  
4. Search Console: submit `https://www.whisperingwoodsweddings.com/sitemap.xml`.  
5. Smoke flows in §4.

---

## References

- [`DOMAIN_CANON.md`](DOMAIN_CANON.md)
- [`SUBSCRIBE_API.md`](SUBSCRIBE_API.md)
- [`SWARM_FINAL_PRE_PUBLISH_2026-10-22.md`](SWARM_FINAL_PRE_PUBLISH_2026-10-22.md)
- [`JOURNAL_PROJECT_HEAD_PASTE.html`](JOURNAL_PROJECT_HEAD_PASTE.html)
