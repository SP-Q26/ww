# Stripe live P0 · operator paste folder

| File | Use |
|------|-----|
| [`STRIPE_LIVE_P0_WALKTHROUGH.md`](./STRIPE_LIVE_P0_WALKTHROUGH.md) | Tax, webhook verify, IL performance, smoke |
| [`STRIPE_PRODUCT_IMAGES.md`](./STRIPE_PRODUCT_IMAGES.md) | **PNG upload map** (JPEG/PNG/WEBP for Stripe) |
| [`upload-for-stripe/`](./upload-for-stripe/) | Same PNGs copied for Finder drag-and-drop |
| [`../../xano-pastes/wwl_stripe_sku_seed.live.json`](../../xano-pastes/wwl_stripe_sku_seed.live.json) | Xano `stripe_price_id` |
| [`../../STRIPE_IDS_LIVE.md`](../../STRIPE_IDS_LIVE.md) | Live `prod_` / `price_` |

**PNG (Stripe upload):** `…/stripe-products/*.png` · **SVG sources:** `…/stripe-products-source/*.svg`

**Auto-attach images (optional):** deploy Vercel first, then:

```bash
WWLUXE_STRIPE_IMAGE_ORIGIN=https://luxe-omega.vercel.app \
STRIPE_SECRET_KEY=sk_live_… node scripts/patch-stripe-live-product-images.mjs
```
