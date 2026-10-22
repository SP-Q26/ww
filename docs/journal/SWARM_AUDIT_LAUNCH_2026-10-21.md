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

## DNS cutover audit (2026-10-21 evening)

| URL | Result |
|-----|--------|
| `https://ww-journal.vercel.app/` | **200** · prod `feaf961` · `cacheVersion` **10** |
| `https://ww-journal.vercel.app/favicon.ico` | **200** |
| `https://ww-journal.vercel.app/p/october-estate-dispatch` | **200** (SPA rewrite) |
| `POST /api/subscribe` | **503** `subscribe_not_configured` — set **`JOURNAL_SUBSCRIBE_WEBHOOK_URL`** on Vercel |
| `https://whisperingwoodsweddings.com/journal` | **301** → `whisperingwoodsevents.com/journal` (Squarespace) · **404** at destination |
| `https://www.whisperingwoodsweddings.com/journal` | **TLS cert mismatch** (hostname not on cert yet — finish Vercel domain + cert) |
| `journal.whisperingwoodsweddings.com` | **NXDOMAIN** |

**Canon paths for Journal app:** Vercel default **`ww-journal.vercel.app`** until apex `www` is attached to **`ww-journal`** (not Squarespace `/journal`).

---

## Pre-launch gates

1. **WeWeb publish** → GitHub `journal` (canvas logo / UTM / mobile — not in export until publish)
2. **Vercel** production on **`journal`** @ `feaf961` — favicons **200** ✓
3. **Custom domain:** add `www.whisperingwoodsweddings.com` (or chosen host) to **`ww-journal`** · wait for cert · optional path prefix `/journal` via Vercel rewrite or subdomain
4. **Vercel Web Analytics** on · smoke Home → article
5. **`JOURNAL_SUBSCRIBE_WEBHOOK_URL`** for capture form

---

## Open P1

- Squarespace **`/journal`** on events/weddings — point to Vercel or retire redirect
- Upload **WeWeb media library** 512 mark if preview breaks before export
- Article sticky bar device pass
