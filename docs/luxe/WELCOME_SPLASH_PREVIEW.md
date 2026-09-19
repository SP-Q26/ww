# Luxe welcome splash (preview branch only)

**Canon:** `SPLASH_SKELETON_CANON.md`

**Sequence (≤1750ms wall):**

1. Pine green + **CSS skellie** (gold shimmer disc) while Vue/WeWeb boots (`#app` locked).
2. **`rel=preload`** + `<img src="/heirloom/assets/heirloom-splash-tree-welcome.svg">` after **2× rAF** (slower draw + one gold ring lap; booked keeps base SVG).
3. **1320ms after img load:** full draw on solid pine → green fade (0.45s). Tree **214px / 62vw** (−20%).
4. Tree fades (0.45s); dismiss; **`data-ww-hero-video-ready`** only then (`__wwLuxeWelcomePending` blocks canvas boot from early flag).

**Reduced motion:** static tree, 400ms.

**Production `main`:** postbuild **uninject**.

## Test

```bash
git push origin preview
```

Smoke: full tree draw, no quarter-frames, hero ≤2s after load, no reload loop.

Promote to `main` only after operator sign-off.
