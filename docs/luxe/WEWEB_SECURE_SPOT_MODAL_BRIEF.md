# WeWeb AI · Secure My Spot modal (paste brief)

**Project:** WhisperingWoodsLUXE · **Component:** Tour Booking Modal (Secure My Spot)  
**Do not** restructure or replace `wf_booking_form_submit` — UI + bindings + pass new fields into existing submit only.

## Terminology (hard law)

- Say **heirloom / heirlooms** — **never** “keepsake(s)” in customer copy, modal, emails, or Stripe-facing strings from WeWeb.
- **Chalet Collection** = pre-order **heirloom** bundle (album + digital + framed print).
- Estate = **Estate Senior Experience** ($1,420 total).

---

## Ask WeWeb AI to build (modal UI only)

### 1 · Payment choice (required, both visible)

Segmented control or two clear cards **above** the pay button:

| Option | Label (customer) | Subcopy |
|--------|------------------|---------|
| **A (default selected)** | **Reserve my spot · $710 non-refundable deposit** | Remaining **$710** due **10 days before** your estate day. |
| **B** | **Pay estate in full · $1,420** | **$710 non-refundable deposit** + **$710 remainder** today — one checkout. |

- **Never** imply monthly plans or BNPL.
- **Never** a single line “$1,420” without explaining deposit + remainder on pay-in-full.

### 2 · Add Chalet (one tap)

- **Checkbox or toggle** (off by default): **Add the Chalet Collection · $1,420**
- One line dek: *Heirloom album, digital gallery, and archival framed print — pre-order thank-you when you order by T−10.*
- When on, show **order total** that updates:
  - Deposit only → **$710**
  - Deposit + Chalet → **$2,130**
  - Pay in full → **$1,420**
  - Pay in full + Chalet → **$2,840**

### 3 · Trust strip (short, under total)

*Non-refundable deposit on every reservation. Balance due 10 days before your estate day. **Last chance for Chalet pre-order pricing** in that same email.*

Link **Terms** (existing legal URL).

### 4 · Primary button copy

- Reserve path: **Pay deposit — secure my spot**
- Pay-in-full path: **Pay in full — secure my spot**
- If Chalet on: append nothing extra (total already shows bundle).

### 5 · Pass to Xano on submit (new fields)

Existing booking fields unchanged; **add**:

| Field | Values |
|-------|--------|
| `estate_payment_type` | `deposit` \| `full` |
| `includes_chalet` | `true` \| `false` |

Xano builds Stripe Checkout line items (not WeWeb):

- Always `WWL-DEPOSIT-710` when estate is booked.
- If `full`: also `WWL-ESTATE-BALANCE-710` now.
- If `includes_chalet`: also `WWL-CHALET-PREORDER-1420`.

Canon: `docs/luxe/BOOKING_MODAL_PAYMENT_PLANS.md` · `lib/mmi/estate-checkout-lines.mjs`.

### 6 · Do not change on this pass

- Roster / `spotsRemaining` wiring unless already in scope.
- Calendly, waitlist logic, experience date field behavior.
- Workflow step count on `wf_booking_form_submit` (extend payload only).

---

## One-shot prompt for WeWeb AI

Copy below:

```text
WhisperingWoodsLUXE · Tour Booking Modal (“Secure My Spot”).

TERMINOLOGY: Customer copy uses heirloom/heirlooms only — never “keepsake(s)”.

UI: Add payment choice (1) Reserve with $710 non-refundable deposit (default) with $710 balance due 10 days before estate day, or (2) Pay estate in full $1,420 (deposit + remainder in one Stripe checkout). Add optional checkbox “Add Chalet Collection · $1,420” with live total ($710 / $2,130 / $1,420 / $2,840). Trust line: non-refundable deposit, T-10 balance, last chance for Chalet pre-order in that email. Terms link unchanged.

On submit, pass estate_payment_type (deposit|full) and includes_chalet (true|false) into existing wf_booking_form_submit — do NOT replace or truncate that workflow. Stripe line items are built in Xano, not on canvas.

**Form → Xano:** `parentName` → `parent_name` · Mom email → `parent_email` · senior name → `senior_name` · `session_code` `01-Fall` · `terms_version` `2026-09-09` in workflow body.

Match Luxe visual system; keep Experience Date and form fields as today.
```
