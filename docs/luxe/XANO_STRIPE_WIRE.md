# WWLuxe · Xano + Stripe wire guide (operator P0)

**No secrets in git.** Paste URLs and keys in WeWeb env + Vercel only.

---

**Schema:** `docs/luxe/XANO_SCHEMA.md` (WWL-prefixed tables · batch API law)  
**Tax:** `docs/luxe/STRIPE_TAX_WYOMING.md` · env `WWLUXE_TAX_*_JSON` · `lib/mmi/stripe-checkout-tax-lines.mjs`

## Surfaces

| Flow | URL | Backend |
|------|-----|---------|
| Estate deposit | WeWeb home modal | Xano `POST /roster/book` → Stripe Checkout |
| Keepsake order | `/order` (git static) | `POST /api/wwluxe/keepsake-checkout` or `api.whisperingwoodsluxe.com` |
| Balance (10 days prior) | Xano cron / workflow | Stripe invoice or second Checkout |

---

## Xano placeholders to replace

Search WeWeb workflows for `REPLACE_WITH_YOUR_XANO_INSTANCE` and swap for your instance base, e.g. `https://xano.io/api:XXXX/`.

| Workflow | Purpose |
|----------|---------|
| Roster fetch | Experience weeks · spots remaining |
| Book | Create booking row · return `checkout_url` |
| Waitlist | Capture lead when sold out |

**Smoke:** WeWeb preview → open booking modal → submit → lands on Stripe test Checkout → return URL shows confirmation.

---

## Stripe · estate deposit

1. Create Product **Estate Senior Experience** · Price **$710** one-time (deposit).
2. Xano book endpoint creates Stripe Checkout Session (`mode: payment`) with metadata:
   - `wwluxe_product: estate_deposit`
   - `booking_email`, `senior_name`, `experience_week`
3. `success_url`: `https://whisperingwoodsluxe.com/?booked=1`
4. `cancel_url`: `https://whisperingwoodsluxe.com/#pricing`

Webhook → Xano: mark deposit paid · send confirmation email.

---

## Stripe · keepsake `/order`

Git ships **`api/wwluxe/keepsake-checkout.js`** on SPQ Vercel when env is set:

| Env var | Value |
|---------|--------|
| `STRIPE_SECRET_KEY` or `WWLUXE_STRIPE_SECRET_KEY` | `sk_live_…` or `sk_test_…` |
| `WWLUXE_SITE_ORIGIN` | `https://whisperingwoodsluxe.com` |

**DNS option A:** Route `whisperingwoodsluxe.com/order` to SPQ (Cloudflare) · same host hits `/api/wwluxe/keepsake-checkout`.

**DNS option B:** Deploy handler to `api.whisperingwoodsluxe.com` · keep `WWLUXE_CONFIG.checkoutApi` in `order/index.html`.

### Request shape (from `wwluxe-order.js`)

```json
{
  "contact": {
    "name": "Parent Name",
    "email": "parent@example.com",
    "senior": "Jane",
    "ref": "WWL-123",
    "notes": "Linen cover",
    "cover": "linen",
    "mode": "preorder"
  },
  "lines": [
    { "sku": "WWL-CHALET-PREORDER-1420", "label": "Chalet Collection", "amount_cents": 142000 }
  ],
  "total_cents": 142000,
  "terms_version": "2026-09-09",
  "source": "chalet_kiosk"
}
```

### Response

```json
{ "checkout_url": "https://checkout.stripe.com/...", "session_id": "cs_..." }
```

Webhook metadata keys: `wwluxe_email`, `wwluxe_name`, `wwluxe_ref`, line SKUs in PaymentIntent.

---

## Legal URLs (modal + `/order`)

| Page | URL |
|------|-----|
| Terms | `https://whisperingwoodsluxe.com/terms` |
| Privacy | `https://whisperingwoodsluxe.com/privacypolicy` |

WeWeb modal TOS links must match · see `LEGAL_LINKS_CANON.md`.

---

## P0 checklist

```
[ ] Xano connected in WeWeb integrations
[ ] Three workflow URLs replaced (no REPLACE_WITH placeholder)
[ ] Stripe test book → checkout_url works
[ ] STRIPE_SECRET_KEY on Vercel for keepsake API
[ ] Webhook → Xano booking status + email
[ ] E2E: modal → TOS → Stripe → confirmation
[ ] Canvas pricing grep clean (895, 350, 1670, 250 thank)
[ ] Publish WeWeb + DNS apex
```

**Do not touch:** `wf_booking_form_submit` structure without duplicate-first workflow law.
