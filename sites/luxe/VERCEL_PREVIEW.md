# WWLuxe · Vercel (`luxe-omega`)

**Full marketing site + heirloom slice** deploys from **repo root** (`~/ww`), not this folder alone.

See **`docs/luxe/VERCEL_FULL_APP.md`** for dashboard settings (Root Directory **`.`**, branch **`luxe`**).

**Test URLs:**

- Home: https://luxe-omega.vercel.app/
- Heirloom: https://luxe-omega.vercel.app/heirloom
- Terms / privacy: `/terms`, `/privacypolicy`

```bash
cd ~/ww
npx vercel deploy --prod
PREVIEW_HOST=https://luxe-omega.vercel.app bash sites/luxe/scripts/smoke-paths.sh
```
