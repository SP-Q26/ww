# Luxe · git sweep audit (2026-09-17 · v37 publish)

**Vercel project:** `luxe` → `https://luxe-omega.vercel.app`  
**Production branch:** `main`  
**WeWeb:** WhisperingWoodsLUXE · publish **v37** (font) → GitHub `main` after editor publish

---

## Slice routing · `/booked` vs `/heirloom` (parity)

Root **`vercel.json`** and **`sites/luxe/vercel.json`** use the **same rewrite pattern**:

| Public path | Serves from `dist` (after `postbuild` copy) |
|-------------|---------------------------------------------|
| `/booked`, `/booked/` | `/whispering-woods-luxe/booked/index.html` |
| `/heirloom`, `/heirloom/` | `/whispering-woods-luxe/order/index.html` |
| `/heirloom/assets/*` | `/whispering-woods-luxe/assets/*` |
| `/terms`, `/privacypolicy`, aliases | same in both files |

**Build path:** `npm run build` → `postbuild.js` → `scripts/copy-luxe-slice-into-dist.mjs` copies `sites/luxe/public/whispering-woods-luxe/**` into `dist/`.

**DNS not on apex yet:** Stripe `success_url` / `cancel_url` pointing at `whisperingwoodsluxe.com/booked` will **not load** until apex → Vercel. Until then:

- Set Xano **`WWL_PUBLIC_ORIGIN`** = `https://luxe-omega.vercel.app` for smoke, **or**
- Pass explicit `success_url` / `cancel_url` in `wwl/book` body to Vercel preview.

WeWeb **production** host has **no** `/booked` or `/heirloom` (marketing only) — those paths exist only on **full app** deploy (root repo on Vercel).

---

## Post–v37 GitHub publish checklist

1. Pull `main` after WeWeb export; confirm **`_wwcv=37`** in `index.html` and `cacheVersion` **37** in home `public/data/*.json`.
2. `CACHE_VER=37 bash scripts/prep-weweb-export-main.sh` — must pass (`postbuild.js` present).
3. Merge conflicts: **keep** `vercel.json`, `postbuild.js`, `scripts/inject-luxe-critical-boot.mjs`, `scripts/copy-luxe-slice-into-dist.mjs`, `api/wwluxe/*`, `sites/luxe/**`.
4. Push `main` → Vercel redeploy.
5. `PREVIEW_HOST=https://luxe-omega.vercel.app bash scripts/audit-luxe-deploy-sweep.sh`
6. `SMOKE_WEWEB=1 bash sites/luxe/scripts/smoke-luxe-swarm.sh`

---

## Xano (not in git deploy)

| Item | Status |
|------|--------|
| `04` guest Checkout (no `customer_update`, `billing_address_collection`) | Re-paste from git |
| Live `price_` in `wwl_stripe_sku` | Operator ✓ |
| `sk_live_`, `whsec_`, webhook `checkout.session.completed` | Operator ✓ |
| `WWL_PUBLIC_ORIGIN` | Match host moms use for `/booked` |

Canon: `docs/luxe/xano-pastes/04-wwl-book-AUDIT.md`

---

## Estate vs heirloom checkout

| Flow | API | Stripe |
|------|-----|--------|
| Tour modal | Xano `POST wwl/book` | Checkout Session (live ✓) |
| `/heirloom` kiosk | Vercel `POST /api/wwluxe/keepsake-checkout` | Needs `STRIPE_SECRET_KEY` on Vercel + fixed handler in `api/wwluxe/` |

---

## Sign-off

- [ ] Git `main` includes v37 export
- [ ] Vercel `/booked` + `/heirloom` 200 on `luxe-omega`
- [ ] Live book → Checkout → (optional $710) → `/booked` on **Vercel** host until DNS
- [ ] Webhook marks slot `deposit_paid` after pay
