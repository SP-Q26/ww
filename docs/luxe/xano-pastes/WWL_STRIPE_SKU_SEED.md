# `wwl_stripe_sku` seed (paste bundle)

**Import file:** [`wwl_stripe_sku_seed.json`](./wwl_stripe_sku_seed.json)  
**Canon IDs:** [`STRIPE_IDS_TEST.md`](../STRIPE_IDS_TEST.md) · MMI sandbox `acct_1UG5yw0biIaEI74i`  
**Live IDs:** [`STRIPE_IDS_LIVE.md`](../STRIPE_IDS_LIVE.md) · [`wwl_stripe_sku_seed.live.json`](./wwl_stripe_sku_seed.live.json) · MMI live `acct_1UG5yZ02CkQBMWtC`  
**Table columns:** [`XANO_TABLES_BUILD_SHEET.md`](../XANO_TABLES_BUILD_SHEET.md) § `wwl_stripe_sku`

## Xano

1. Create table **`wwl_stripe_sku`** first (before `wwl_slot` / APIs).
2. **Database → `wwl_stripe_sku` → Import** (or add rows manually from JSON).
3. Set **`WWL_STRIPE_SECRET_KEY`** to the **same** Stripe account that owns these `price_…` IDs (`sk_test_…` for this file).

`display_name` is optional; copy from `lib/mmi/wwluxe-stripe-products.mjs` if you want receipt labels in DB.

## Estate booking minimum (3 rows)

If you only need modal checkout tonight, import at least:

| `sku` | `active` |
|-------|----------|
| `WWL-DEPOSIT-710` | true |
| `WWL-ESTATE-BALANCE-710` | true |
| `WWL-CHALET-PREORDER-1420` | true |

Without **`WWL-DEPOSIT-710`** + `active: true`, `POST wwl/book` returns `Missing active SKU row: WWL-DEPOSIT-710`.

## Live mode

Duplicate products/prices in Stripe **live**, update `stripe_price_id` + `amount_cents` on each row (or a second import file). Do not mix live `sk_live_…` with test `price_…` from this JSON.

## Checkout law

- Estate Checkout uses **`WWL-DEPOSIT-710`** + optional **`WWL-ESTATE-BALANCE-710`** (pay in full) + optional **`WWL-CHALET-PREORDER-1420`**.
- **`WWL-ESTATE-1420`** stays **`active: false`** — reference only; never a Checkout line (`estate-checkout-lines.mjs`).

## Stripe Tax

`04` / `07` set **`automatic_tax[enabled]=true`** when Stripe Tax is configured (head office + registrations). Product **`tax_code`** on each Stripe Product per [`stripe-product-tax.mjs`](../../../lib/mmi/stripe-product-tax.mjs) · [`STRIPE_TAX_WYOMING.md`](../STRIPE_TAX_WYOMING.md).
