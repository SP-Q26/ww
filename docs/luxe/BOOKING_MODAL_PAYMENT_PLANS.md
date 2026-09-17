# WWLuxe · Tour Booking Modal · checkout options (canon)

**Status:** Documented for **next push** — canvas + Xano not yet wired.  
**Modal:** Tour Booking Modal (WeWeb) → Xano → Stripe Checkout on **MMI** account.  
**Code:** `lib/mmi/estate-checkout-lines.mjs` — line composition for Xano/Vercel.  
**Related:** `STRIPE_MCP_SWARM.md` · `MMI_STRIPE_METADATA_SCHEMA.md`

### Hard law · estate line items

**Every estate purchase includes a $710 line labeled non-refundable deposit** — whether they pay the rest today or at T−10.

| Rule | Detail |
|------|--------|
| **Never** one $1,420 Stripe line for estate | Use **`WWL-DEPOSIT-710`** + **`WWL-ESTATE-BALANCE-710`** |
| **Deposit line** | Always **$710** · display name **“Non-refundable deposit · Estate senior reservation”** |
| **Pay in full today** | Same deposit line + second line **“Estate experience remainder · paid in full today”** ($710) |
| **Reserve today** | Deposit line only at booking · balance line at **T−10** |
| **No BNPL / installments** | Deposit + purchase only |

**Operator (internal):** ~**$900** deliverable cost per senior — a $710 deposit still **does not cover** a no-show or refund; Terms + non-refundable labeling are **business protection**, not margin on the deposit alone.

`WWL-ESTATE-1420` stays a **reference SKU** ($1,420 marketing total) — **not** a Checkout line item.

---

## Modal choices (mom-facing)

| Choice | What they mean |
|--------|----------------|
| **Reserve** | $710 non-refundable deposit now · $710 balance at T−10 |
| **Pay estate in full** | $710 non-refundable deposit + $710 remainder **in one Checkout** |
| **+ Chalet** (optional) | Add third line `WWL-CHALET-PREORDER-1420` on same Checkout |

### Stripe line items at booking (canon)

| Selection | Lines charged **now** | Total now |
|-----------|---------------------|----------|
| Reserve | ① Non-refundable deposit $710 | **$710** |
| Reserve + Chalet | ① Deposit $710 · ② Chalet $1,420 | **$2,130** |
| Pay in full | ① Deposit $710 · ② Remainder paid in full $710 | **$1,420** |
| Pay in full + Chalet | ① Deposit $710 · ② Remainder $710 · ③ Chalet $1,420 | **$2,840** |

At **T−10** (deposit path only): charge **one** line — `WWL-ESTATE-BALANCE-710` · **“Estate experience balance · due 10 days before event”** · $710.

---

## T−10 program (all on)

**Anchor:** **10 calendar days before** the booked estate date. Everything below is **required**, not optional.

| When | Action |
|------|--------|
| **At booking** | Confirmation email · itemized lines (deposit always shown) · Terms version · balance due date · Chalet pre-order deadline |
| **T−14** (optional) | Reminder: balance + Chalet last-chance coming |
| **T−10** | **Email** to all active bookings: (1) charging **$710 balance** today or within 24h for `estate_payment_type=deposit`; (2) **final Chalet pre-order** thank-you if not purchased |
| **T−10** | **Charge** saved card for balance (`estate_payment_type=deposit` only) · receipt email · failed-card retry + pay link + grace per Terms |
| **T−10** | **`estate_payment_type=full`:** no estate charge · same email for **Chalet last-call** only |
| **After T−10** | Chalet at **retail** on `/heirloom` · no advertised pre-order courtesy |

**Authorization (deposit path):** modal + email state that **$710 non-refundable deposit** is charged now and **$710 balance** on `{balance_due_date}`.

---

## Stripe session metadata (Xano)

| Key | Values |
|-----|--------|
| `mmi_lane` | `wwluxe_estate_booking` |
| `mmi_event_key` | e.g. `luxe-estate-2026-oct` |
| `estate_payment_type` | `deposit` \| `full` |
| `includes_chalet` | `true` \| `false` |
| `terms_version` | e.g. `2026-09-09` |
| `balance_due_date` | ISO date (T−10) |
| `deposit_line_cents` | `71000` (always when estate in cart) |

Use `lib/mmi/estate-checkout-lines.mjs` → `linesForModalSelection(type, chalet)` to build line list; map each row to Stripe `price_…` or validated `price_data` with **display_name** from helper.

---

## Next push checklist (WeWeb + Xano)

- [ ] Modal: **Reserve** vs **Pay estate in full** + optional **Chalet**; show **$710 non-refundable deposit** in copy for both paths.
- [ ] Xano Checkout: **never** single $1,420 estate line; always deposit + balance composition per table above.
- [ ] Stripe Product rename (test/live): deposit name includes **Non-refundable deposit**.
- [ ] T−10 **cron/workflow**: email + balance charge + Chalet last-call (full program table).
- [ ] TOS checkbox · `setup_future_usage` on deposit-only first Checkout · Radar on · no BNPL.
- [ ] Smoke: 4 booking combos + T−10 balance charge on test booking.
- [ ] Do not restructure `wf_booking_form_submit` — extend only.

---

## Trust ribbon

*A **$710 non-refundable deposit** applies to every estate reservation. Pay the **$710 remainder** now or **10 days before** your estate day. That same date is your **last chance** for the **Chalet Collection** pre-order thank-you.*

---

## Chargeback protection

Itemized receipts must **always** show the **non-refundable deposit** line separately. Pay-in-full moms still see deposit + remainder on one receipt — not one ambiguous $1,420.

Evidence: Terms, metadata, emails, T−10 notice, attendance. See prior dispute table in git history; ops: **$900/senior** internal — deposit is policy protection.

---

## Version

| Date | Note |
|------|------|
| 2026-09-15 | Two-line estate canon; T−10 program fully on; `estate-checkout-lines.mjs` |
