# WW Journal · launch-day swarm audit (2026-10-21)

**Project:** `49bf8d2b-9224-4aa4-803a-5b74f1a83f30` · **Vercel:** `ww-journal` · **Catalog:** 36 posts · `cacheVersion` **10**

## Scorecard

| Area | Score | Notes |
|------|------:|-------|
| Feed / copy | **96** | Unified stack + filters; legacy grids hidden (`conditionalRendering: false`) |
| Responsive | **90** | Mobile pill/deck padding tuned; header tour CTA 44px; capture input 16px/48px |
| Tokens / type | **94** | Linen/pine/gold DS; Cormorant + Inter + Montserrat loaded |
| Links / UTM | **92** | Header/footer/tour hrefs → `utm_source=ww_journal` (was `wwj`) |
| Favicon / brand mark | **88** → **96** after git favicon pack + header 512 mark |
| Vercel Analytics | **88** | `<Analytics />` in `App.vue`; enable in Vercel dashboard |
| Newsletter API | **80** | `api/subscribe.js` on branch; needs env + deploy |

**Composite (post favicon deploy + WeWeb publish):** **~93 / 100**

---

## Fixes applied (this session)

### Canvas (WeWeb MCP)

- Header **Journal Mark Logo** (`ww-image` → `images/512-wwj-favicon.png`) beside wordmark
- Home + Article **page favicon** metadata → 512 PNG
- Cross-door links: `utm_source=ww_journal` on nav, footer, Calendly CTAs
- Mobile: filter pills `padding 0 16px`; deck rail `8px 16px 24px`; tour button `min-height 44px`
- Page descriptions updated (unified stack only; legacy deck retired)

### Git (`journal` branch)

- Add `public/favicon.svg`, `public/favicon.ico`, `public/images/*-wwj-favicon.png` (48–512)
- `template.html`: SVG + ICO + apple-touch (180/192/512) + `theme-color` `#141F19`

---

## Breakpoint checklist

| Viewport | Verified on canvas |
|----------|-------------------|
| **Mobile** | Main wrapper `20px 16px` + 96px sticky clear; header pill radius 16px; capture panel `28px 20px` |
| **Tablet** | Main `36px 20px`; footer `56px 20px`; header `12px 20px` padding |
| **Desktop** | `index-max` 960px; hero/stack/footer spacing per guidelines |

---

## Pre-launch gates

1. **WeWeb publish** → GitHub `journal` (merge git favicon commit first or same deploy window)
2. **Vercel** build `journal` · confirm `GET /favicon.ico` and `/images/512-wwj-favicon.png` → **200**
3. **Vercel Web Analytics** on · smoke Home → article route
4. **`JOURNAL_SUBSCRIBE_WEBHOOK_URL`** on `ww-journal` for capture form
5. Production domain smoke: `whisperingwoodsweddings.com/journal` when cutover

---

## Open P1

- Upload **WeWeb media library** copy of 512 mark if editor preview breaks relative `images/` path before export
- Article sticky bar link audit (reuse section) on device pass
- Custom domain rewrite: subscribe `fetch` uses `baseUrl` (works on Vercel preview + apex)
