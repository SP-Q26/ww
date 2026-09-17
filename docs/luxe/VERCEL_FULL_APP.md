# Luxe · full app on Vercel (`luxe-omega`)

**One project:** repo **root** `SP-Q26/ww` · branch **`luxe`** · **not** `sites/luxe` alone.

| Vercel setting | Value |
|----------------|--------|
| Root Directory | **`.`** (empty / repo root) |
| Production branch | **`luxe`** |
| Install | `npm ci` |
| Build | `bash scripts/vercel-build.sh` |
| Output | **`dist`** |

Build runs WeWeb Vite export, then copies `sites/luxe/public` + `api/` into `dist` (heirloom + Stripe).

**Preview:** https://luxe-omega.vercel.app/ (home funnel at `/`)

**Smoke:**

```bash
PREVIEW_HOST=https://luxe-omega.vercel.app bash sites/luxe/scripts/smoke-luxe-swarm.sh
PREVIEW_HOST=https://luxe-omega.vercel.app bash sites/luxe/scripts/smoke-paths.sh
```

Publish audit: `LUXE_PUBLISH_AUDIT_v25_vvv_2026-09-15.md` · swarm log: `LUXE_SWARM_AUDIT_v25_2026-09-15.md`

**Env (checkout):** `STRIPE_SECRET_KEY`, `WWLUXE_SITE_ORIGIN` on project **luxe**.

**CLI (from repo root):**

```bash
cd ~/ww
npx vercel deploy --prod
```
