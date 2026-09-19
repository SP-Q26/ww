# Luxe welcome splash (preview branch only)

**Sequence (≤2s total):**

1. **Pine green** + **heirloom splash tree** (`heirloom-splash-tree.svg`, `min(268px, 78vw)`).
2. **`#app` hidden** (`html.ww-welcome-lock`) while the SPA loads so partial hero/layout does not show through the fade.
3. **Double `requestAnimationFrame`**, then **clone/replace SVG** so the stroke draw starts on a clean frame (not mid-parse).
4. **~1100ms:** green background fades (after draw completes ~1.05s).
5. **~1500ms:** tree fades (0.55s ease).
6. **~1900ms:** remove overlay; **2000ms hard cap** sets `data-ww-hero-video-ready=1`.

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
