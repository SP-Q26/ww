# WW Journal · final pre-publish audit (2026-10-22)

**Production:** https://www.whisperingwoodsweddings.com/ · **36 posts** · **Publish after paste + canvas sync**

## Scorecard

| Area | Score | Notes |
|------|------:|-------|
| **Catalog / copy** | **98** | 36 slugs · unique · all CTAs `utm_source=ww_journal` in git catalog |
| **SEO (site)** | **90** | Home + Article titles/descriptions/OG in WeWeb · JSON-LD → `www` (canvas) · per-post OG still template-level (P2) |
| **Favicon** | **95** | `favicon.ico/svg` + 48–512 PNG · prod **200** · WeWeb OG image on CDN |
| **Links** | **92** | Header/footer/tour on canvas → WWE Calendly modal · **6× `utm_source=wwj`** in last **export** (article sticky) — fixed on canvas; republish |
| **Hover** | **94** | 172 `_wwHover` hooks on Home export · nav/footer/tour/pills covered |
| **Breakpoints** | **91** | Header 44px tour · capture 16px/48px input · footer tightened · stack mobile padding |
| **Tour modal** | **93** | `ww-tour-modal.js` + `ww-journal-bridge.js` on git `journal` |
| **Subscribe** | **75** | Workflow OK · Vercel webhook env still required |

**Ship gate:** **≥ 90** after WeWeb publish + webhook env.

---

## SEO sweep (blogs)

| Check | Result |
|-------|--------|
| Post count | **36** |
| Duplicate slugs | **0** |
| Missing title/slug/dek | **0** |
| CTA UTM in `JOURNAL_POSTS_WITH_SERIES_2026-09-30.json` | **All `ww_journal`** |
| Article routes | `/p/{slug}` |
| Sitemap / robots (git) | `www.whisperingwoodsweddings.com` |
| Prerender | Home + Article **on** |

**P2 (post-launch):** Dynamic `og:title` / `og:description` per slug from `journal_posts` (workflow or head script).

---

## Link audit

| Target | Expect |
|--------|--------|
| WWE / WWL doors | `utm_source=ww_journal` |
| Tour CTAs | `calendly.com/whisperingwoodsinfo/private-venue-tour` → in-app drawer |
| AJ Nichols | `ajnichols.com?utm_source=ww_journal` |
| Internal | Home `/` · articles `/p/...` |

---

## Hover audit

Clickables with `_wwHover` + `transition` on default: header nav, tour button, footer links, filter pills, feed cards, capture submit, sticky bar, Below Deck tour.

**Spot-check:** wordmark link (internal home) — hover on text group only.

---

## Breakpoint audit

| Viewport | Pass |
|----------|------|
| **Mobile** | Header wrap · 44px tour · pills `16px` rail · capture panel padding |
| **Tablet** | Header `12px 20px` · main `36px 20px` |
| **Desktop** | `960px` max width · hero/stack spacing |

---

## Pre-push checklist

1. Paste **`docs/journal/JOURNAL_PROJECT_HEAD_PASTE.html`** → Project **Custom code → Head**
2. **WeWeb publish** → GitHub `journal`
3. Pull export · confirm `template.html` still has favicon + tour scripts (restore from git if stripped)
4. Confirm `<Analytics />` in `App.vue` if export removed it
5. Vercel: `JOURNAL_SUBSCRIBE_WEBHOOK_URL` (or WWE n8n fallback)
6. Smoke: `/` · `/p/october-estate-dispatch` · tour modal · one subscribe POST
