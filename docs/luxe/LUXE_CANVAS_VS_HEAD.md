# Luxe · Canvas vs Project Head (v27 doctrine)

Same split as **SPQ**: **WeWeb canvas = engine**. **Project Head + git = bridge** for what the engine cannot do.

## Canvas owns (fix in editor — source of truth)

| Area | Where |
|------|--------|
| **1024 shell** | Page layout: max width **1024px** on main column / sections wrapper; pine page background outside shell |
| **Hero** | Section + overlay div: `100svh`, padding, gradient, **Hero Video Frame** overflow, **Hero Load Splash** (tree mark), **Home · Hero video boot** page workflow (`docs/luxe/canvas/hero-video-boot.js`) |
| **Section backgrounds** | Each section’s **background color** (pine vs linen) — not Head `:has()` locks |
| **Typography & spacing** | Design system tokens + per-element styles |
| **Buttons / CTAs** | `ww-button` padding, min height 48px, gaps |
| **Sticky footer** | `#ww-sticky-nav` div: fixed position, pill width, safe-area — **no** Head fab/collapse CSS |
| **Chalet hover** | Parent states / workflows on **Chalet Image Wrapper** + **chalet hover image** |
| **Booking modal** | WeWeb popup styling (not Head popup hijack) |
| **Season look** | Bind accents to variables; optional conditions on `html[data-season]` **in DS classes**, not Head UID paint |

## Head owns (paste `WEWEB_PROJECT_HEAD_BRIDGE_v26.html` only — stamp **v27**)

| Module | Why |
|--------|-----|
| `WW_SITE_CONFIG` | URLs, email, legal URLs, tour link, env |
| `data-ww-head-version` | Smoke stamp (`2026.09.17.v28`) |
| **critical-first-paint** | Pine `#141f19` on `html/body/#app` + `theme-color` (before Vue / canvas splash) |
| **bridge-hero-youtube** | Hero iframe crop + `data-ww-hero-video-ready` gate CSS only — **ready flag is set by canvas** `Home · Hero video boot` (Head `wwHeroVideoReady` removed v28). |
| **season-mood.js** | Sets `data-season` + poetry line + tab clicks (no `--ww-section-deep` overrides) |
| **gallery-drawer.js** | Full gallery from variable/DOM; injects drawer DOM |
| **Drawer CSS** | Styles for injected gallery shell only |
| **site-bridge.js** | JSON-LD, mailto, tour delegation, footer legal URL guard, review inject |

## Removed from Head (do not paste v23–v25 monolith)

- `luxe-layout`, `responsive-luxe`, `mobile-parity-lock`, `luxe-motion`, `luxe-shell-v24/v25`
- Section `:has(.ww-element-…)` background and typography locks
- Hero iframe / `ww-in-view` hide / `content-visibility`
- **wwStickyExpand** (fab + `is-expanded`) — use canvas sticky as designed
- Popup → drawer CSS (style booking modal on canvas)
- `@import` Google Fonts (use WeWeb font manager)

## Paste steps

1. **Delete all** Project Head custom code.
2. Paste **only** `WEWEB_PROJECT_HEAD_BRIDGE_v26.html`.
3. **Publish** WeWeb.
4. Fix hero / sections / sticky / Chalet on **canvas** until preview matches.

## Git / Vercel (second project)

| Repo path | Role |
|-----------|------|
| `sites/luxe/` | `/heirloom`, legal static, Stripe API — **not** marketing home |
| `docs/luxe/legal/` | Static legal HTML source |

Marketing `/` never ships from Vercel slice alone.
