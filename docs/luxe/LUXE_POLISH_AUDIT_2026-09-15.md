# LUXE polish audit · 2026-09-15 (pre-deploy)

**Doctrine:** Canvas = truth. Project Head = config + gallery + SEO bridge only (hero crop **not** required in Head after this batch).

---

## Hero / video (canvas) — enacted

| Layer | UID / asset | Status |
|-------|-------------|--------|
| Hero block | `68072bf6…` | `100svh`, pine `#141f19`, overflow hidden |
| Video frame | `0189df0a…` | Absolute fill, **opacity 1**, overflow hidden, no muddy tint |
| YouTube | `63c3ad17…` | Autoplay/mute/loop, **controls off**, desktop **opacity 1** |
| Load splash | `17f047b4…` + **Hero Sprout Loader** `1b928beb…` | **Branded preloader** · rings + sprout-to-tree SVG (~1.1s); min **1.2s** then **cross-dissolve** to hero video · `hero-splash-tree.svg` · `HERO_BRAND_REVEAL.md` |
| Variable | `heroVideoReady` `dafc47f7…` | Drives splash opacity / pointer-events |
| Workflow | **Home · Hero video boot** `a8f3c2e1-hero-video-boot-home` | Page `onload` · git mirror `docs/luxe/canvas/hero-video-boot.js` |

**Behavior:** Injects uniform **cover** crop (scale 1.16 desktop, 1.2 tablet, 1.26 mobile), gold inset frame, hides iframe until **PLAYING/BUFFERING** (YT API) or 3.2s cap, patches embed query params.

**Preview smoke:**

```js
document.getElementById('ww-hero-canvas-crop') // style tag present
variables['dafc47f7-259a-4c95-a431-e28e229c6b46'] // true after ~1s
document.documentElement.getAttribute('data-ww-hero-video-ready') // '1'
```

Hard-refresh `/home` at 390px and 1024px — no title bar, no progress scrubber, no gray letterbox flash.

---

## Layout / shell (canvas) — prior batch

- Section inners **1024px** (FAQ **860px**).
- Legal **pill nav** + `/privacypolicy` route.
- Dead modals / vars removed.

---

## Head (minimal paste)

Keep **v27** bridge for: `WW_SITE_CONFIG`, gallery drawer, season, site-bridge legal/JSON-LD.

**Optional next Head trim:** delete `bridge-hero-youtube` CSS + `wwHeroVideoReady` script blocks (canvas supersedes).

---

## Still P0 / post-deploy

| Item | Owner |
|------|--------|
| Xano `REPLACE_WITH_YOUR_XANO_INSTANCE` | Canvas booking workflow + env |
| WeWeb **Publish** | Operator |
| Vercel `sites/luxe` redeploy | Git push `luxe` or CLI |
| Gallery drawer CTA | Confirm “View full gallery” opens drawer (Head JS) |
| Duplicate `selectedDate` | Delete one after modal calendar binding check |

---

## Deploy checklist

1. WeWeb editor **Preview** — hero splash → video crossfade, no YouTube chrome.
2. WeWeb **Publish** to production host.
3. `cd ~/ww && git add docs/luxe && git commit` (when ready) on branch **`luxe`**.
4. Push → Vercel project root **`sites/luxe`**.
5. `PREVIEW_HOST=https://luxe-omega.vercel.app bash sites/luxe/scripts/smoke-paths.sh`
6. Spot-check apex: `/home`, `/terms`, `/privacypolicy`, booking modal legal links.

---

## Breakpoint QA (5 min)

| Width | Hero | Sticky | Legal |
|-------|------|--------|-------|
| ~1440 | Frame + splash | Transparent pill | — |
| **1024** | Crop scale 1.2 | Touch targets | — |
| ~390 | Crop scale 1.26 | Safe area | Pill nav tappable |
