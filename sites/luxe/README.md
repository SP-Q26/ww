# WWLuxe · git slice (heirloom + legal + API)

**Git:** `SP-Q26/ww` · branch **`luxe`**.

**Production Vercel deploy uses repo root** — see `docs/luxe/VERCEL_FULL_APP.md`. This folder is **source** copied into `dist/` on build; it is **not** the Vercel Root Directory anymore.

## Legacy: slice-only deploy (deprecated)

| Setting | Value |
|---------|--------|
| Root Directory | `sites/luxe` (checkout-only preview — not the marketing site) |
| Framework Preset | **Other** (not Next.js) |
| Build Command | **empty** (no build) |
| Output Directory | default (`public` is served as static files) |
| Install Command | optional empty |

Wrong root (repo root) runs the WeWeb Vite app and **breaks** layout or serves nothing useful on `/`.

## Env

- `WWLUXE_SITE_ORIGIN` = `https://whisperingwoodsluxe.com`
- `STRIPE_SECRET_KEY` = `sk_test_…` or live (for `/api/wwluxe/keepsake-checkout`)

## DNS (apex stays WeWeb)

Path-split routes must hit **this** project:

- `/heirloom*`, `/keepsakes*`, `/order*`, `/terms*`, `/privacypolicy*`, `/api/wwluxe/*`
- **Or** include `/whispering-woods-luxe/*` if HTML uses that asset prefix

Static pages load CSS from **`/heirloom/assets/…`** (and `/terms/assets/…`) so a narrow `/heirloom*` rule still styles checkout.

**Do not** point `whisperingwoodsluxe.com` apex A/CNAME to Vercel only — marketing `/` is WeWeb.

## Preview URL (CLI deploy)

**https://luxe-omega.vercel.app/heirloom** — see `VERCEL_PREVIEW.md` for dashboard Root Directory + redeploy steps.

## Smoke

```bash
PREVIEW_HOST=https://luxe-omega.vercel.app bash scripts/smoke-luxe-swarm.sh
PREVIEW_HOST=https://luxe-omega.vercel.app bash scripts/smoke-paths.sh
```
