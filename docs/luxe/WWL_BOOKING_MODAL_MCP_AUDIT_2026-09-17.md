# WWLuxe · Tour Booking Modal · MCP audit (2026-09-17)

**Project:** WhisperingWoodsLUXE `1b8147da-2812-42a5-946e-f83c582d3071`  
**Component:** Tour Booking Modal `d39c36d0-9146-4920-a2dc-a3641cf44806`  
**Reference:** SPQ index pay flow — `custom-code/index-stripe-payment-active.js` (`fetch` + `parseCheckoutUrl` + `location.assign`, **not** WeWeb `http-request`).

---

## Symptom

Console **500** / `ERROR_FATAL` / **"Error parsing JSON: Syntax error"** on submit when using WeWeb **HTTP Request** to `POST …/wwl/book`.

## Root cause

| Layer | Issue |
|--------|--------|
| **WeWeb** | Native `http-request` tries to parse the response as JSON; Xano **4xx** or empty/non-JSON bodies surface as editor **500** with misleading "JSON parse" copy. |
| **Xano** (if `success_url` omitted) | Default success URL includes `slot_ref` with **·** — Stripe rejects unless `url_encode` on ref (`04-wwl-book-post.xs`). |
| **Form** (fixed earlier) | Required **Senior Email** blocked HTML5 submit before workflow ran. |

## Fix applied (canvas)

| Piece | Change |
|--------|--------|
| **Home · Hero video boot** `8dbbd8ba…` | Step `boot_wwl_checkout` registers `window.wwlBookingSubmitCheckout` (inline IIFE, git: `docs/luxe/paste/wwl-booking-checkout-active.js`). |
| **wf_booking_form_submit** | Single **custom-js**: `return await wwlBookingSubmitCheckout(event, context);` |
| **Pay CTA** | `disabled` when TOS + model release not checked (UX); legal gate also inside JS. |
| **Senior email** | Hidden + not required (API uses mom email only). |

## SPQ parity checklist

| SPQ | WWLuxe (now) |
|-----|----------------|
| `fetch` + `Accept: application/json` | Yes |
| `try/catch` on `res.json()` | Yes |
| `parseCheckoutUrl` | Yes (`checkout_url` / `checkoutUrl` / `url`) |
| `location.assign(url)` | Yes |
| Errors → user-visible state | `bookingSubmitted` banner on failure |
| Boot loads handler before click | Home **onload** `boot_wwl_checkout` |

## Git artifacts

- Paste source: `docs/luxe/paste/wwl-booking-checkout-active.js`
- Static deploy (optional CDN path): `sites/luxe/public/whispering-woods-luxe/assets/wwl-booking-checkout.js`
- Xano: re-paste `04-wwl-book-post.xs` (`slot_ref|url_encode` on default success URL)

## Smoke (preview)

1. Hard refresh home → open Secure My Spot.
2. Fill senior name, parent name, mom email, phone; deposit or full; both legal boxes.
3. Submit → **Network**: `POST …/wwl/book` **200** + `checkout_url` → redirect to `checkout.stripe.com`.
4. On failure → green fallback banner under button (not silent 500).

## Email v1 — what to do next

**Already done:** Stripe Dashboard receipts + `bookings@whisperingwoodsluxe.com` branding.

**Launch without building mail queue (acceptable v1):**

- **Stripe** = payment receipt (itemized lines).
- **`/booked`** + studio **manual** booking summary within ~1 business day (copy already on page).
- Terms already disclose email for confirmations / balance notices.

**Post-launch (recommended order):**

1. **Xano webhook `06` tail** → Resend (or SendGrid): template **Booking confirmed** — `slot_ref`, experience date, deposit vs full, Chalet flag, support `bookings@…`.
2. **`07` T−10 cron** → same provider: email with **balance Checkout link** from `charges[].checkout_url` (+ Chalet last-call line). Encode `ref` in URL (`url_encode`).
3. **`05` waitlist** → single **You're on the list** transactional (no spot assignment).
4. Optional: `metadata` on Checkout for Resend idempotency (`wwl_slot_id` + event type).

Do **not** duplicate Stripe receipt content in WWL mail — link to receipt + estate-specific logistics only.

---

## Operator

1. **Publish** WeWeb after this audit.
2. **Re-paste** Xano `04` if not already (`url_encode`).
3. Merge git `wwl-booking-checkout-active.js` + hero boot on next GitHub export prep.
