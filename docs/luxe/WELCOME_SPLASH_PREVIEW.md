# Luxe welcome splash (preview branch only)

**Canon:** `SPLASH_SKELETON_CANON.md`

**Sequence (≤1400ms wall):**

1. Pine + brief skellie (`#app` locked).
2. **Predrawn static tree** + **CSS rings** (one gold lap) together — single `<img>`, no Lottie.
3. **~520ms hold** → green fade → tree fade → hero (`__wwLuxeWelcomePending` gate).

**Reduced motion:** static tree, 400ms.

**Production `main`:** postbuild **uninject**.

## Test

```bash
git push origin preview
```

Smoke: full tree draw, no quarter-frames, hero ≤2s after load, no reload loop.

Promote to `main` only after operator sign-off.
