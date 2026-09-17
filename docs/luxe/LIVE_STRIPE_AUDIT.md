# WWLuxe · Live Stripe audit (MCP read-only)

**Account:** `acct_1UG5yZ02CkQBMWtC` · **livemode:** true  
**Audited:** 2026-09-17 · **Reference test:** `acct_1UG5yw0biIaEI74i`

This is a **read-only** snapshot. Live writes (tax defaults, registrations, webhooks, product seed) were **not** applied via MCP; use Dashboard or approved MCP writes / `scripts/seed-mmi-wwluxe-stripe-test.mjs` with `sk_live_…`.

---

## Executive summary

**Update 2026-09-17 (post copy-to-live):** Catalog **OK** — 12 WWLuxe products, tax codes + shippable flags match canon. IDs in [`STRIPE_IDS_LIVE.md`](./STRIPE_IDS_LIVE.md) · Xano import [`xano-pastes/wwl_stripe_sku_seed.live.json`](./xano-pastes/wwl_stripe_sku_seed.live.json).

| Area | Live | Test (expected) | Severity |
|------|------|-----------------|----------|
| Products / prices | **12** | **12** WWLuxe SKUs (11 active + 1 inactive reference) | OK |
| Webhooks | **0** | 1 → Xano `wwl/stripe/webhook` | **P0** |
| Tax registrations | **0** | WY + IL active | **P0** |
| Tax defaults | `inferred_by_currency` · default code `txcd_10000000` | `exclusive` · `txcd_20030000` | **P0** |
| Tax head office | WY Sheridan (30 N Gould St Ste R 82801) · status **active** | Same | OK |
| Brand / Checkout UI | Default Stripe blues · no logo | — | P2 |

**You cannot run a real booking or heirloom checkout on live until:** catalog seeded, Xano `wwl_stripe_sku` updated with live `price_…`, live `sk_live_…` + `whsec_…` in Xano, and tax registrations + exclusive defaults match test.

---

## 1 · Catalog

**Live:** `GET /v1/products` and `GET /v1/prices` return **empty** lists. Search `metadata['mmi_brand']:'wwluxe'` → **no hits**.

**Test:** 12 products with `mmi_brand: wwluxe`, canonical amounts (e.g. deposit `71000`, balance `71000`), `tax_code` per `lib/mmi/stripe-product-tax.mjs`, shippable flags set.

**Required live SKUs** (from `lib/mmi/wwluxe-stripe-products.mjs`):

| SKU | Amount (¢) | Notes |
|-----|------------|--------|
| WWL-DEPOSIT-710 | 71000 | Estate checkout line 1 |
| WWL-ESTATE-BALANCE-710 | 71000 | Estate checkout line 2 |
| WWL-ESTATE-1420 | 142000 | **inactive** reference only |
| WWL-CHALET-PREORDER-1420 | 142000 | |
| WWL-ALBUM-HEIRLOOM-955 | 95500 | shippable |
| WWL-DIGITAL-395 | 39500 | |
| WWL-FRAME-425 | 42500 | shippable |
| WWL-RETOUCH-7-195 | 19500 | |
| WWL-UPGRADE-FINEART-395 | 39500 | |
| WWL-MINI-PARENT-345 | 34500 | shippable |
| WWL-SPREAD-1-55 | 5500 | |
| WWL-SPREAD-5-255 | 25500 | |

**Remediation:**

```bash
cd ~/ww
STRIPE_SECRET_KEY=sk_live_… node scripts/seed-mmi-wwluxe-stripe-test.mjs
```

Then sync Xano `wwl_stripe_sku` from `docs/luxe/xano-pastes/wwl_stripe_sku_seed.live.json` (created by seed).

**Performance location (IL estate):** On live **after** seed, set on `WWL-DEPOSIT-710` and `WWL-ESTATE-BALANCE-710` (Dashboard product tax / performance, or Checkout line override in `04-wwl-book-post.xs`):

`14518 O'Brien Rd, Harvard, IL 60033`

(Test catalog also shows `performance_location: null` on products; confirm IL is set at Checkout or product level before relying on IL estate tax.)

---

## 2 · Webhooks

**Live:** no endpoints.

**Test:** `we_1UGA1s0biIaEI74iOuaFGxkx` →  
`https://xfog-zdyr-rbyx.n7e.xano.io/api:E6ai6f3e/wwl/stripe/webhook`  
Events include `checkout.session.completed` (plus async payment + expired).

**Remediation (Live mode in Dashboard):**

1. Add endpoint with same URL.
2. Subscribe at minimum: `checkout.session.completed` (match test set if you want parity).
3. Copy **live** `whsec_…` → Xano `WWL_STRIPE_WEBHOOK_SECRET` (do not reuse test secret).

---

## 3 · Stripe Tax

| Setting | Live | Test |
|---------|------|------|
| Status | active | active |
| Head office | WY Sheridan | WY Sheridan |
| `defaults.tax_behavior` | **inferred_by_currency** | **exclusive** |
| `defaults.tax_code` | **txcd_10000000** (digital) | **txcd_20030000** (services) |
| Registrations | **none** | WY + IL `state_sales_tax` active |

**Why it matters:** Terms and site copy assume **tax-exclusive** list prices. Inferred-by-currency can disagree with checkout display. No IL registration means estate performance tax in Illinois will not match the test setup.

**Remediation (Dashboard → Tax):**

1. Defaults: **Tax behavior = Exclusive**; default product tax code **General services** (`txcd_20030000`) or leave per-product codes from seed.
2. Registrations: add **Wyoming** and **Illinois** sales tax (same as test).

---

## 4 · Keys and downstream (not in Stripe API audit)

Verify outside Stripe:

| System | Variable | Must be **live** |
|--------|----------|------------------|
| Xano | `WWL_STRIPE_SECRET_KEY` | `sk_live_…` |
| Xano | `WWL_STRIPE_WEBHOOK_SECRET` | live `whsec_…` |
| Xano | `WWL_PUBLIC_ORIGIN` | Vercel URL pre-DNS, then `https://whisperingwoodsluxe.com` |
| Vercel `luxe` | `STRIPE_SECRET_KEY` / `WWLUXE_STRIPE_SECRET_KEY` | `sk_live_…` |
| Xano `wwl_stripe_sku` | `stripe_price_id` | live `price_…` only |

**Never** use test `price_…` from `docs/luxe/STRIPE_IDS_TEST.md` with `sk_live_…`.

---

## 5 · Smoke order (after P0 fixes)

1. Seed + tax + webhook + Xano env + `wwl_stripe_sku`.
2. Book from **`https://luxe-omega.vercel.app`** (or host that serves `/booked`) — see `LIVE_STRIPE_FLIP.md`.
3. Confirm: Live payment · webhook 200 · slot not open · `/booked?ref=…`.
4. Refund in Dashboard if needed.

```bash
PREVIEW_HOST=https://luxe-omega.vercel.app bash sites/luxe/scripts/smoke-luxe-swarm.sh
```

---

## 6 · Optional polish (P2)

- **Brand settings:** add logo / brand colors for Checkout (`GetBrandSettings` shows defaults).
- **Webhook events:** live can mirror test’s async payment + expired events for ops visibility.

---

## MCP apply bundle (operator approval)

If you want Cursor to apply the same deltas as test in one approved batch:

1. `PostTaxSettings` → exclusive + `txcd_20030000`
2. `PostTaxRegistrations` → US WY + US IL
3. `PostWebhookEndpoints` → Xano URL + `checkout.session.completed`
4. Run local seed script for products (MCP product create is 12+ calls; seed script is canonical)

See `LIVE_STRIPE_FLIP.md` for the full flip checklist.
