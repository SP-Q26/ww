# Stripe Live · P0 walkthrough (before real money)

**Mode:** Dashboard top-right → **Live** (not Test).  
**Account:** MMI live `acct_1UG5yZ02CkQBMWtC`.

You said **webhook** and **Xano keys** are set — use §1 and §6 to verify; do §2–§5 if not already green.

---

## 1 · Webhook (you did this — verify)

1. **Developers → Webhooks** (Live).
2. Endpoint URL must be exactly:
   ```text
   https://xfog-zdyr-rbyx.n7e.xano.io/api:E6ai6f3e/wwl/stripe/webhook
   ```
3. **Events:** at minimum **`checkout.session.completed`** (test endpoint also had async payment + expired — optional).
4. Open the endpoint → **Signing secret** → **Reveal** → copy `whsec_…`.
5. Xano → **Settings → Environment variables** → `WWL_STRIPE_WEBHOOK_SECRET` = that **live** `whsec` (not test).
6. **Send test webhook** from Stripe (if offered) or complete a **live** Checkout once and check Xano logs / slot status.

**Fail if:** Xano still has test `whsec` or `sk_test_` while Checkout is live.

---

## 2 · Tax registrations (WY + IL)

1. **Settings → Tax** (or **Tax → Registrations**).
2. **Add registration** (or **Start collecting**).
3. **United States → Wyoming**
   - Type: **State sales tax** (Stripe Tax registration).
   - **Start date:** today (or CPA-approved date).
   - Save.
4. Repeat: **United States → Illinois** → State sales tax → Save.

**Match test:** test mode should show two active US registrations (WY + IL). Live should mirror that.

**Why:** Without IL, estate services performed in Harvard/McHenry may not calculate IL tax correctly. Without WY, digital/ship-from-WY sourcing is incomplete.

---

## 3 · Tax defaults (exclusive + services)

1. **Settings → Tax** → **Tax settings** / **Defaults** (wording varies).
2. **Default tax behavior:** **Exclusive** (prices exclude tax; tax added at Checkout).  
   - Not *Inclusive* and not *Inferred by currency*.
3. **Default product tax code:** **General - Services** (`txcd_20030000`) or “General services” — aligns with estate lines and Terms copy.  
   - Individual products already have correct codes from copy-to-live; this fixes the account default (live was `txcd_10000000` digital + inferred).

Save. Re-open Checkout preview on a deposit line — subtotal should be $710.00 before tax.

---

## 4 · IL performance (deposit + balance only)

**Address (canon):** 14518 O'Brien Rd, Harvard, IL 60033, US

**Dashboard (per product):**

1. **Product catalog** (Live) → open **Whispering Woods Luxe · Non-refundable deposit…** (`WWL-DEPOSIT-710`).
2. Find **Tax** / **Tax details** / **Where the service is performed** (Stripe Tax on product).
3. Set **Performance location** (or service performed at) to the Harvard address above.
4. Repeat for **Estate experience remainder** (`WWL-ESTATE-BALANCE-710`).

**Do not** set performance location on heirloom ship/digital SKUs (WY origin + ship-to handles those).

**Alternative (Xano):** paste `WWL_TAX_IL_PERFORMANCE_JSON` in Xano env and extend `04` line items — only if Dashboard product fields are unavailable. Dashboard on the two products is simpler.

---

## 5 · Product images (after Vercel deploy)

See [`STRIPE_PRODUCT_IMAGES.md`](./STRIPE_PRODUCT_IMAGES.md) in this folder.

Base URL (pick the host moms use for smoke):

```text
https://luxe-omega.vercel.app/heirloom/assets/stripe-products/<file>.png
```

After DNS:

```text
https://whisperingwoodsluxe.com/heirloom/assets/stripe-products/<file>.png
```

For each live product → **Edit** → **Image** → paste URL (or upload PNG from the same folder if you export PNGs locally).

Optional: run from repo (with `sk_live_…` in env only on your machine):

```bash
cd ~/ww
STRIPE_SECRET_KEY=sk_live_… node scripts/patch-stripe-live-product-images.mjs
```

---

## 6 · Xano checklist (keys you set)

| Variable | Live? |
|----------|--------|
| `WWL_STRIPE_SECRET_KEY` | `sk_live_…` |
| `WWL_STRIPE_WEBHOOK_SECRET` | live `whsec_…` |
| `WWL_PUBLIC_ORIGIN` | Vercel or apex (same host as booking) |
| `wwl_stripe_sku` rows | live `price_…` from [`wwl_stripe_sku_seed.live.json`](../../xano-pastes/wwl_stripe_sku_seed.live.json) |

---

## 7 · Smoke

1. Open site on **`WWL_PUBLIC_ORIGIN`** (not WeWeb-only URL unless `/booked` routes to Vercel).
2. Book one slot · complete **live** Checkout.
3. Stripe → Payment succeeded.
4. Xano → webhook 200 · slot not `open`.
5. Browser → `/booked?ref=…`.

```bash
PREVIEW_HOST=https://luxe-omega.vercel.app bash sites/luxe/scripts/smoke-luxe-swarm.sh
```
