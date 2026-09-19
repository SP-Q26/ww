# Luxe welcome splash (preview branch only)

**Canon:** `SPLASH_SKELETON_CANON.md`

**Sequence (≤1600ms wall):**

1. Pine + **CSS skellie** while Vue boots (`#app` locked).
2. After **idle ≤120ms**: **static tree** + **CSS ring lap** (compositor — no SMIL stroke draw on main thread).
3. **1100ms after live:** green fade → tree fade (0.4s).
4. Hero ready on dismiss (`__wwLuxeWelcomePending` gate).

**Why not SMIL on home:** Vue parse/hydration steals main-thread frames; stroke-dash looks like jerky “pieces.” Static tree + CSS motion reads as one clean welcome.

**Reduced motion:** static tree, 400ms.

**Production `main`:** postbuild **uninject**.

## Test

```bash
git push origin preview
```

Smoke: full tree draw, no quarter-frames, hero ≤2s after load, no reload loop.

Promote to `main` only after operator sign-off.
