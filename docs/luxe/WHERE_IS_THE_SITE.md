# Where is the Luxe site?

You have **two deployables**, not one. Opening the wrong URL looks like “the site is missing.”

## 1. Marketing site (hero, video, FAQ, tour modal) — **this is “the site”**

| Where | URL |
|--------|-----|
| **WeWeb publish (use this to test today)** | https://1b8147da-2812-42a5-946e-f83c582d3071-production.weweb.io/ |
| WeWeb editor | Open project **WhisperingWoodsLUXE** → Preview |
| After custom domain + WeWeb DNS | `https://whisperingwoodsluxe.com/` (or `/home` once routing is fixed) |

After a **root** Vercel deploy, **`luxe-omega.vercel.app/`** is the full funnel + `/heirloom` slice (`VERCEL_FULL_APP.md`).

Home page route in WeWeb is `/home`, but publish may serve the funnel at **apex `/`**; if `/home/` 404s, use apex `/` until canvas routing is fixed.

## 2. Heirloom checkout + git legal pages + Stripe API

| Where | URL |
|--------|-----|
| Vercel project **`luxe`**, repo root **`.`** (full export) | https://luxe-omega.vercel.app/ (marketing) + `/heirloom` |
| Slice paths on same deploy | `/heirloom`, `/keepsakes`, `/order`, `/terms`, `/privacypolicy` |

## Full site on Vercel (preview + future DNS)

Repo root `~/ww` is the **WeWeb Vite export**. Deploy it with:

- **Root Directory:** `.` (repo root, **not** `sites/luxe`)
- **Build:** `npm ci && npm run build`
- **Output:** `dist`
- **Config:** `vercel.json` at repo root (includes heirloom rewrites into `sites/luxe/public`)

Single Vercel project **`luxe`** should use **Root Directory `.`** and branch **`luxe`** (`VERCEL_FULL_APP.md`). Do not point production at checkout-only `sites/luxe` unless intentionally isolating heirloom.

## DNS on Vercel (typical)

- **Marketing:** Vercel project from repo **root** → domain apex + `/home`
- **Or** apex on WeWeb + path `/heirloom*` on Vercel (`docs/luxe/KEEPSAKES_VERCEL_DNS.md`)

Do not expect `luxe-omega.vercel.app/` to show the hero until you deploy the **root** app to that hostname (or open the WeWeb URL above).
