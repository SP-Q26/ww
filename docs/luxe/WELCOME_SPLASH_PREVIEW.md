# Luxe welcome splash (preview branch only)

**Sequence (≤1.5s total):**

1. **Pine green** full viewport + **heirloom splash tree** (same SVG as `/booked` and `/heirloom` order — `heirloom-splash-tree.svg`, ~50% larger than first preview pass).
2. **~520ms:** green **background layer** fades (`.ww-welcome__bg`); **tree stays** on its own layer (no parent opacity jank).
3. **~1080ms:** tree fades like `.wwl-splash.is-out` (0.55s ease).
4. **~1380ms:** remove overlay; **1500ms hard cap** sets `data-ww-hero-video-ready=1`.

Orchestrator runs on `DOMContentLoaded` so the tree markup exists before timers fire.

**Implementation:** `scripts/inject-luxe-critical-boot.mjs` when `VERCEL_GIT_COMMIT_REF=preview`.

**Production `main`:** postbuild **uninject** — no Vercel overlay (incident 2026-09-18).

## Test on preview

```bash
git push origin preview
# Vercel Preview URL for branch preview (not whisperingwoodsluxe.com)
```

Smoke:

- No reload loop (`cacheVersion` = `wwg_cacheVersion`)
- Tree visible briefly, then hero video
- Mobile hero CTA readable

Promote to `main` only after operator sign-off.
