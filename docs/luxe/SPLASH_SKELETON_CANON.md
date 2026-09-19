# Luxe · splash & skeleton canon

**Goal:** One calm first paint. No competing overlays, no SMIL during Vue/WeWeb boot, no arbitrary timers without a minimum **and** a hard cap.

## Law

| Rule | Detail |
|------|--------|
| **One owner** | Per route: either canvas **or** git/Vercel critical — never two splash UIs + two `data-ww-hero-video-ready` clocks. |
| **Heavy app behind lock** | While welcome runs: `html.ww-welcome-lock #app { visibility: hidden }`. SPA still boots; user must not see partial layout. |
| **Tree asset** | Home preview: `heirloom-splash-tree-welcome.svg` (~18% slower draw, gold ring **one lap**). Static routes keep `heirloom-splash-tree.svg`. **`<img>`** + `rel=preload`. |
| **Draw mount** | CSS shimmer on pine → mount `<img>` after 2× `rAF` (preload warms cache). |
| **Timing** | **1320ms after img load** (full welcome draw + one gold ring lap) → fades. **Hard wall 1750ms**. Size **214px / 62vw** (−20% vs prior preview). |
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
