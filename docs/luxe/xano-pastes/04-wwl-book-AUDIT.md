# `POST wwl/book` (`04-wwl-book-post.xs`) · audit

**Canon paste:** [`04-wwl-book-post.xs`](./04-wwl-book-post.xs)

## Why test “worked” but live 400’d

**Not a test-vs-live Stripe rule.** `customer_update` with only `customer_email` is invalid in **both** modes.

| Likely what happened in test | What live did |
|------------------------------|---------------|
| Roster / Xano Run / DB checks without hitting **Checkout Session create** | First full path: `sk_live_` + live `price_` + **`POST /v1/checkout/sessions`** |
| `sk_test_` + test `price_` but **old stack** without `customer_update` | Same Xano stack after tax doc added `customer_update[address]=auto` (copied from customer-based flows) |
| Manual Stripe test Checkout in Dashboard | Estate flow always goes through `04` |

The failing live log (`req_JwqToEAdRj9Lue`) is **`invalid_request_error`**: `customer_update` can only be used with `customer`.

## Checkout Session params (guest estate booking)

| Param | Value | Notes |
|-------|--------|--------|
| `mode` | `payment` | |
| `customer_email` | parent email | Guest checkout — **no** `customer` id |
| `billing_address_collection` | `required` | Address for **automatic_tax** (replaces `customer_update`) |
| `shipping_address_collection` | US | Tangible / tax ship-to |
| `automatic_tax[enabled]` | `true` | Stripe Tax calculates; CPA configures registrations in Dashboard |
| `line_items[n][price]` | from `wwl_stripe_sku` | Live `price_…` when `WWL_STRIPE_SECRET_KEY` is `sk_live_…` |
| `success_url` / `cancel_url` | input or `WWL_PUBLIC_ORIGIN` + `/booked` | Default success uses **`slot_ref\|url_encode`** (· in ref) |
| **Do not send** | `customer_update` | Requires `customer=cus_…` |

## Stack order (slot hold)

1. Pick open slot (read-only) → consent row  
2. Build Stripe params → **api.request** Checkout Session  
3. Precondition `session_url` non-empty (surface `$stripe_err` in error text)  
4. **Then** `wwl_slot` → `pending_checkout` + PII (only if Session created)

Paid roster state: webhook **`06`** only (`deposit_paid` / `paid_in_full`).

## Env (Xano)

| Variable | Role |
|----------|------|
| `WWL_STRIPE_SECRET_KEY` | `sk_test_…` or `sk_live_…` — must match `price_` rows |
| `WWL_PUBLIC_ORIGIN` | Default return URLs (`https://whisperingwoodsluxe.com` or Vercel preview) |

Webhook / `whsec_` does **not** affect opening Checkout.

## Smoke

```bash
curl -sS -X POST "$WWL_XANO_BASE/wwl/book" -H "Content-Type: application/json" -d @- <<'JSON'
{
  "session_code": "01-Fall",
  "parent_name": "Test Parent",
  "parent_email": "test+wwl@whisperingwoodsluxe.com",
  "parent_phone": "5555550100",
  "senior_name": "Test Senior",
  "estate_payment_type": "deposit",
  "includes_chalet": false,
  "terms_version": "2026-09-09",
  "success_url": "https://whisperingwoodsluxe.com/booked",
  "cancel_url": "https://whisperingwoodsluxe.com/booked?cancelled=1"
}
JSON
```

Expect: `checkout_url`, `session_id`, `slot_ref`. Stripe log must **not** include `customer_update`.

## Live-only follow-ups (after Session creates)

- Stripe Tax registrations / product `tax_code` (CPA) — may affect **tax amount**, not guest-checkout param shape  
- IL `performance_location` on deposit/balance products (Dashboard) — see `STRIPE_TAX_WYOMING.md`
