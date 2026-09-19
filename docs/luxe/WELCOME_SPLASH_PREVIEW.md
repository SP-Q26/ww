# Luxe welcome splash (preview branch only)

**Canon:** `SPLASH_SKELETON_CANON.md`

**Sequence (≤1200ms wall):**

1. Pine + brief skellie (`#app` locked).
2. **Predrawn static tree** (52% inside rings) + **CSS rings** — single `<img>`.
3. **~420ms** on tree + rings after load; fades never start before **~780ms** from first paint → hero (`__wwLuxeWelcomePending` gate). Wall **1.6s**.

**Reduced motion:** static tree, 400ms.

**Production `main`:** postbuild **uninject**.

## Test

```bash
git push origin preview
```

Smoke: full tree draw, no quarter-frames, hero ≤2s after load, no reload loop.

Promote to `main` only after operator sign-off.
