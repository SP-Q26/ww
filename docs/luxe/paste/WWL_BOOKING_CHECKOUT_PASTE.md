# WWL booking checkout · WeWeb paste map (SPQ pattern)

## 1 · Home page onload — `Home · Hero video boot`

After existing `boot1`, chain **`boot_wwl_checkout`** (`custom-js`).

Paste body: `wwl-booking-checkout-active.js` prefixed with:

```javascript
if (typeof wwlBookingSubmitCheckout === 'function') { return true; }
```

Suffix: `return true;`

(Canvas already updated via MCP 2026-09-17 — verify action count = 2 on onload workflow.)

## 2 · Tour Booking Modal — form submit

**Workflow:** `wf_booking_form_submit` on **Booking Form Container** `384df8a6…`  
**Trigger:** submit  
**Single action** (`custom-js`):

```javascript
if (typeof wwlBookingSubmitCheckout !== 'function') {
  throw new Error('wwl_booking_checkout_not_loaded');
}
return await wwlBookingSubmitCheckout(event, context);
```

## 3 · Do not use

WeWeb **HTTP Request** to `wwl/book` on this form — causes JSON parse 500 on error responses.

## 4 · Git source of truth

`docs/luxe/paste/wwl-booking-checkout-active.js`
