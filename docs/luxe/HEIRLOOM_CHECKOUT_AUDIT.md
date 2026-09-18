# Heirloom checkout audit · parity with `POST wwl/book`

**Modal (works):** `wwl-booking-checkout.js` → Xano `04-wwl-book-post.xs` → Stripe `line_items[n][price]` + guest tax params.

**Heirloom:** `wwluxe-order.js` → Vercel `POST /api/wwluxe/keepsake-checkout` → same Stripe shape.

## Root causes fixed (2026-09-18)

| Issue | Heirloom (before) | Modal (`04` audit) |
|--------|-------------------|---------------------|
| `customer_update` on guest checkout | Sent when tax on | **Forbidden** — use `billing_address_collection=required` |
| Line items | `price_data` + `tax_behavior` on line | Catalog **`price_`** IDs from `wwl_stripe_sku` / `WWLUXE_STRIPE_IDS_LIVE` |
| Spread cart | One line, wrong SKU suffix (`×n`), wrong amount vs price | Decomposed 5-packs + singles (each maps to a `price_`) |
| Stripe errors in UI | `checkout_failed` only | `message` from API (Stripe text) |
| Extra session fields | `phone_number_collection`, `custom_text`, `client_reference_id` | Minimal guest session (email + tax + lines) |

## Code map

| Piece | Path |
|--------|------|
| Guest tax/address law | `lib/mmi/stripe-guest-checkout.mjs` |
| Line items (price vs price_data) | `lib/mmi/keepsake-checkout-lines.mjs` |
| Live `price_` table | `WWLUXE_STRIPE_IDS_LIVE` in `lib/mmi/wwluxe-stripe-products.mjs` · `docs/luxe/STRIPE_IDS_LIVE.md` |
| API handler | `api/wwluxe/keepsake-checkout.js` (+ slice copy under `sites/luxe/api/`) |
| Client | `sites/luxe/public/.../assets/wwluxe-order.js` |

## Env (Vercel)

| Variable | Role |
|----------|------|
| `STRIPE_SECRET_KEY` or `WWLUXE_STRIPE_SECRET_KEY` | Must be `sk_live_…` with live `price_` rows (same account as modal) |
| `WWLUXE_STRIPE_AUTOMATIC_TAX` | Set `false` only to debug without Stripe Tax |
| `WWLUXE_ALLOW_PROMOTION_CODES` | Unset for launch (modal law) |

## Smoke

```bash
curl -sS -X POST "https://whisperingwoodsluxe.com/api/wwluxe/keepsake-checkout" \
  -H "Content-Type: application/json" \
  -d '{"lines":[{"sku":"WWL-SPREAD-1-55","amount_cents":5500}],"contact":{"email":"test+wwl@whisperingwoodsluxe.com","name":"Test Parent"}}'
```

Expect `checkout_url` + `session_id`. Stripe request log must **not** include `customer_update`.
