# Luxe welcome splash (preview branch only)

**Sequence (≤1.5s total):**

1. **Pine green** full viewport + **skeleton tree** SVG (`#ww-critical-splash`).
2. **~380ms:** green **background fades to transparent**; **tree stays** visible.
3. **~900ms:** tree **fades out**; canvas hero / landing reveals.
4. **1200ms:** remove overlay; **1500ms hard cap** sets `data-ww-hero-video-ready=1`.

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
