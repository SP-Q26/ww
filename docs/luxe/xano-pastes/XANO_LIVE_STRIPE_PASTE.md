# Xano · live Stripe paste bundle

**Stripe P0 walkthrough (tax, webhook verify, IL performance, images):**  
[`paste/stripe-live-p0/STRIPE_LIVE_P0_WALKTHROUGH.md`](../paste/stripe-live-p0/STRIPE_LIVE_P0_WALKTHROUGH.md)

After live catalog is in Stripe, do these in order. **Do not commit secrets.**

---

## 1 · `wwl_stripe_sku` (required)

**File:** [`wwl_stripe_sku_seed.live.json`](./wwl_stripe_sku_seed.live.json)  
**Canon:** [`STRIPE_IDS_LIVE.md`](../STRIPE_IDS_LIVE.md)

**If table already has test rows (same `sku`):**

1. Xano → **Database → `wwl_stripe_sku`**
2. For each row, edit **`stripe_price_id`** (and **`amount_cents`** if your schema has it) to match the live JSON.
3. Or export CSV, replace `price_1UG6…` test IDs with live `price_1UGd…` IDs, re-import (match on `sku`).

**If table is empty:**

- **Import** `wwl_stripe_sku_seed.live.json` (same columns as test seed).

**Booking minimum (modal checkout tonight):** at least `WWL-DEPOSIT-710` + `WWL-ESTATE-BALANCE-710` + `WWL-CHALET-PREORDER-1420` with live prices.

---

## 2 · Environment variables (required for live)

Xano → **Settings → Environment variables** (ops API group).

| Variable | Paste |
|----------|--------|
| `WWL_STRIPE_SECRET_KEY` | Your MMI **`sk_live_…`** (Developers → API keys, Live mode) |
| `WWL_STRIPE_WEBHOOK_SECRET` | Live **`whsec_…`** after you create the live webhook (see below) |
| `WWL_PUBLIC_ORIGIN` | Pre-DNS smoke: `https://luxe-omega.vercel.app` · production: `https://whisperingwoodsluxe.com` |
| `WWLUXE_ALLOW_PROMOTION_CODES` | **`true`** for operator smoke · re-paste `04-wwl-book-post.xs` · enter your live **Promotion code** at Checkout · **unset** before launch |

Leave `WWL_OPS_API_KEY` / `WWL_CRON_SECRET` as you already run them (unchanged for Stripe flip).

### Optional (only if you extend `04` to read JSON for line-item performance)

| Variable | One-line JSON value |
|----------|---------------------|
| `WWL_TAX_IL_PERFORMANCE_JSON` | `{"line1":"14518 O'Brien Rd","city":"Harvard","state":"IL","postal_code":"60033","country":"US"}` |
| `WWL_TAX_WY_ORIGIN_JSON` | `{"line1":"30 N Gould St","line2":"Ste R","city":"Sheridan","state":"WY","postal_code":"82801","country":"US"}` |

Estate booking already uses `automatic_tax` in `04`; IL performance can also be set on **live Stripe products** for deposit/balance (Dashboard).

---

## 3 · Stripe Dashboard (not Xano, still blocking)

| Item | Live status (2026-09-17 audit) |
|------|--------------------------------|
| Webhook → `…/wwl/stripe/webhook` | **Missing** — add + paste `whsec` into Xano |
| Tax registrations WY + IL | **Missing** |
| Tax defaults **exclusive** | Still **inferred_by_currency** — switch to **exclusive** |
| IL performance on deposit/balance products | **`performance_location` null** — set Harvard address |

---

## 4 · Smoke

```bash
# from ~/ww — set WWL_XANO_BASE if needed
bash docs/luxe/xano-pastes/smoke-wwl-xano.sh
```

Book from **`WWL_PUBLIC_ORIGIN`** host so `/booked` resolves.
