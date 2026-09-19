# Luxe · splash & skeleton canon

**Goal:** One calm first paint. No competing overlays, no SMIL during Vue/WeWeb boot, no arbitrary timers without a minimum **and** a hard cap.

## Law

| Rule | Detail |
|------|--------|
| **One owner** | Per route: either canvas **or** git/Vercel critical — never two splash UIs + two `data-ww-hero-video-ready` clocks. |
| **Heavy app behind lock** | While welcome runs: `html.ww-welcome-lock #app { visibility: hidden }`. SPA still boots; user must not see partial layout. |
| **Home preview** | **CSS rings** + predrawn `heirloom-splash-tree-static.svg` (one `<img>`). No Lottie/SMIL on first paint. Booked/order: animated `heirloom-splash-tree.svg`. |
| **Mount** | Brief shimmer → idle ≤48ms → static tree + rings together. |
| **Timing** | **~72ms hold** after tree load (fade anchor = `onload`). **Hard wall 1100ms**. Frame **193px / 56vw**; tree **52%** inside rings. |
| **Hero ready** | Set `data-ww-hero-video-ready` only when welcome dismisses; block canvas boot from setting it early (`__wwLuxeWelcomePending`). |
| **Reduced motion** | `prefers-reduced-motion`: static img, **400ms** total, no draw wait. |
| **Branch** | Welcome inject: **`preview`** only until operator promotes. **`main`**: uninject (WeWeb owns hero). |
| **Cache** | `cacheVersion` = `wwg_cacheVersion` on every deploy. |

## Patterns by surface

| Surface | Pattern |
|---------|---------|
| **Home (preview)** | Vercel `inject-luxe-critical-boot.mjs` welcome gate |
| **Home (prod)** | WeWeb Hero Load Splash + `Home · Hero video boot` |
| **`/booked`** | CSS skeleton shimmer → static `<img>` tree, `MIN_SKELETON_MS` 500 |
| **`/heirloom` order** | Full-screen splash + `<img>` tree, `SPLASH_MIN_MS` 2200, dismiss on `window.load` |

## SPQ parallel

Terminal/index shells: same failures (skellie during stack boot) → **lock shell until stack var or lane ready**, one preload owner, hard cap + `prefers-reduced-motion`. See `spq-ops.mdc` funnel pole boot workflows.

## Promote checklist

- [ ] Preview: full tree draw visible on pine, no quarter-frames
- [ ] No reload loop (`verify-ww-cache-version.mjs`)
- [ ] Hero video + modal after dismiss ≤2s wall
- [ ] 4× CPU throttle smoke
