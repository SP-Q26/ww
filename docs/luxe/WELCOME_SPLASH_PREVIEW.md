# Luxe welcome splash (preview branch only)

**Canon:** `SPLASH_SKELETON_CANON.md` · **Hero vocab:** `HERO_BRAND_REVEAL.md`

**Sequence (1.6s wall, signed off 2026-09-18):**

1. Pine + brief skellie (`#app` locked).
2. **Predrawn static tree** (52% inside rings) + **CSS rings** — single `<img>` (`heirloom-splash-tree-static.svg`).
3. **~420ms** on tree + rings after `img` load; green-out never before **~780ms** from splash start → **cross-dissolve** to canvas hero (`__wwLuxeWelcomePending` gate).

**Reduced motion:** static tree, 400ms.

**Canvas hero (prod):** **Hero Sprout Loader** + **cross-dissolve** when `data-ww-hero-video-ready` flips.

**Production `main`:** same welcome inject as **`preview`** (promoted 2026-09-19).

## Test

```bash
git push origin preview
```

Smoke: tree + rings readable on pine, no flash on warm cache, hero within wall, no reload loop.

Promote to `main` only after `PRE_PROD_PUBLISH_CHECKLIST.md`.
