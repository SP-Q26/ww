# WWLuxe · payment order of operations

**Goal:** Protect the studio (non-refundable deposit, custom goods, chargeback defense) while giving moms a frictionless **tap to pay** experience on phone, tablet, and Chalet kiosk.

---

## What clients should expect

| Moment | Experience |
|--------|------------|
| **Estate booking** | WeWeb home → modal → TOS checkbox → **Stripe Checkout** ($710 deposit) → confirmation email |
| **Keepsakes (/order)** | QR or Chalet tablet → tap products → contact → TOS → **Stripe Checkout** (line items) → receipt |
| **Tap to pay** | Apple Pay / Google Pay / saved card via **Stripe Checkout** (not raw card fields in HTML) |

**You do not** embed Stripe secret keys in static HTML. The git page calls your **backend**; backend creates a **Checkout Session**; browser redirects to Stripe-hosted pay (PCI-safe, wallet buttons included).

### Ensuring tap to pay actually works

1. **Stripe Dashboard** → Settings → Payment methods → enable Apple Pay, Google Pay, Link.
2. **Checkout Session** (not Elements on static HTML): `mode: 'payment'`, `line_items` from server SKU prices.
3. **Apple Pay domain verification:** Stripe Dashboard → Apple Pay → add `whisperingwoodsluxe.com` (and git host if different).
4. **HTTPS only** — wallets refuse HTTP.
5. **User device:** Apple Pay requires Safari / iOS with Wallet set up; Google Pay on Chrome/Android.
6. **Chalet QR → mom's phone** is more reliable than iPad for Apple Pay (card on her phone, not shared tablet).
7. **success_url** / **cancel_url** back to `/order?paid=1` or thank-you page after webhook fires.

Without step 2–3 live, `/order` shows a friendly "connecting soon" alert and logs the draft payload to console.

---

## Recommended payment sequence (protects you best)

### Estate deposit (main funnel · WeWeb)

```
1. Client completes booking form (no card yet)
2. Client checks TOS / non-refundable deposit acceptance (logged)
3. Backend validates slot + creates Stripe Checkout Session (amount $710, metadata: booking_id, tos_version, consent_id)
4. Redirect to Stripe Checkout only after step 2
5. Stripe webhook payment_intent.succeeded → mark deposit_paid, send confirmation
6. Do NOT mark spot sold on client return alone; webhook is source of truth
7. Balance $710: scheduled Checkout or invoice 10 days before event (same webhook pattern)
```

**Why:** Consent before charge · server-side amount · webhook before fulfillment · audit trail for chargebacks.

### Keepsakes (/order · git static)

```
1. Client selects SKUs on /order (display only; prices not trusted)
2. Client enters email + booking ref
3. Client checks TOS + custom-goods acknowledgment
4. POST `/api/wwluxe/keepsake-checkout` (SPQ Vercel) or `api.whisperingwoodsluxe.com/v1/keepsake-checkout` with lines + contact + terms_version
5. Backend: verify booking email (optional v1: manual review if mismatch)
6. Backend: re-price from SKU table (ignore client amounts)
7. Backend: create Stripe Checkout Session (line_items[], metadata: order_id, skus, tos_version, source=chalet_kiosk|order_web)
8. Redirect to Stripe Checkout (Apple Pay / Google Pay / card)
9. Webhook succeeded → order status paid → trigger lab PO · email receipt
10. Production starts only after paid + design consult (keepsake terms §11)
```

**Why:** Custom goods paid upfront · no production before webhook · SKU table prevents tampering · kiosk and web share one API.

---

## Chalet tablet / QR setup

| Item | Value |
|------|-------|
| **URL** | `https://whisperingwoodsluxe.com/order?kiosk=1` |
| **QR** | Same URL on table tent |
| **Device** | iPad or Android tablet · Guided Access / kiosk browser |
| **Pay** | Customer taps through on device OR scans QR on their phone (preferred for Apple Pay on personal device) |

**Best practice:** QR to **mom's phone** for Apple Pay; tablet as backup for card entry.

---

## Stripe objects (when wiring Xano)

| Flow | Stripe product |
|------|----------------|
| Estate deposit | Checkout Session · mode payment · $710 |
| Estate balance | Checkout Session or Invoice · $710 · due T-10 |
| Keepsake order | Checkout Session · line_items per SKU Price ID |
| Webhook | `checkout.session.completed` → update Xano |

Create **Price IDs** in Stripe Dashboard matching `ORDER_SKU_CATALOG.md` SKUs.

---

## Legal coupling

| Page | Role |
|------|------|
| `/terms` | Deposit · weather · keepsake final sale · chargeback · kiosk |
| `/privacypolicy` | Booking + order data · Stripe · consent logs |
| Checkout checkbox | Links both · `terms_version: 2026-09-09` in metadata |

---

## DNS / hosting (git-owned paths)

WeWeb owns `/` (marketing). Git owns `/order`, `/terms`, `/privacypolicy`.

**Options:**

1. **Cloudflare (or DNS proxy):** path routes `/order`, `/terms`, `/privacypolicy` → Vercel/static host; rest → WeWeb
2. **Subdomain:** `order.whisperingwoodsluxe.com` on Vercel (simpler DNS)
3. **SPQ Vercel rewrites** (if apex points here): see root `vercel.json`

Files live in `public/whispering-woods-luxe/`.

---

## P0 before taking money on /order

- [ ] Stripe Price IDs for all SKUs
- [ ] `STRIPE_SECRET_KEY` on Vercel · git handler `api/wwluxe/keepsake-checkout.js` (or Xano mirror)
- [ ] Webhook handler marks orders paid
- [ ] Terms + privacy live at `/terms` and `/privacypolicy`
- [ ] WeWeb booking modal still uses separate estate deposit flow
