# Luxe · splash & skeleton canon

**Goal:** One calm first paint. No competing overlays, no SMIL during Vue/WeWeb boot, no arbitrary timers without a minimum **and** a hard cap.

## Law

| Rule | Detail |
|------|--------|
| **One owner** | Per route: either canvas **or** git/Vercel critical — never two splash UIs + two `data-ww-hero-video-ready` clocks. |
| **Heavy app behind lock** | While welcome runs: `html.ww-welcome-lock #app { visibility: hidden }`. SPA still boots; user must not see partial layout. |
| **Home preview** | **CSS rings** + predrawn `heirloom-splash-tree-static.svg` (one `<img>`). No Lottie/SMIL on first paint. Booked/order: animated `heirloom-splash-tree.svg`. |
| **Mount** | Brief shimmer → idle ≤48ms → static tree + rings together. |
| **Timing** | **~420ms hold** after tree paints; **≥780ms** from splash start before green-out (no flash on cached SVG). **Hard wall 1600ms**. Frame **193px / 56vw**; tree **52%** inside rings. |
| **Hero ready** | **Preview:** block boot until **green-out** (`__wwLuxeWelcomePending`); **queue** `data-ww-hero-video-ready` if boot fires early, **flush** on `releaseHandoff` (else ~1s dead pine until fallback). Green layer fades **before** tree (`GREEN_FADE_MS` then tree-out). Boot owns ready; fallback **1.8s**. Never force ready on critical dismiss only. |
| **Reduced motion** | `prefers-reduced-motion`: static img, **400ms** total, no draw wait. |
| **Branch** | Welcome inject: **`preview`** only until operator promotes. **`main`**: uninject (WeWeb owns hero). |
| **Cache** | `cacheVersion` = `wwg_cacheVersion` on every deploy. |

**Vocabulary (WeWeb hero tree + fade):** `HERO_BRAND_REVEAL.md` — **cross-dissolve** / **fade-through** on **Hero Load Splash** + **Hero Sprout Loader**.

**Reusable stack (other projects):** `docs/patterns/BRAND_ARRIVAL_CROSS_DISSOLVE.md` (**arrival dissolve**).

**Preview timing sign-off:** operator approved feel **2026-09-18** (`preview` @ `c119778`).

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

- [x] Preview welcome timing / feel (2026-09-18)
- [ ] Preview: static tree + rings on pine, no quarter-frames, no flash on warm cache
- [ ] No reload loop (`verify-ww-cache-version.mjs`)
- [ ] Hero video + modal after dismiss within wall
- [ ] 4× CPU throttle smoke
- [ ] WeWeb: hero spots copy removed · see `PRE_PROD_PUBLISH_CHECKLIST.md`
