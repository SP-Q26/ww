# WWLuxe · optional paste improves (non-blocking)

Use **after** Tier B is green. Re-paste whole files when noted — partial edits in Xano are OK if you match the blocks exactly.

---

## 1 · Webhook `06` — richer `wwl_payment_log` (recommended)

**Why:** Your first paid row had empty `lines_json` / IP / UA. New checkouts get them from consent + slot snapshot.

**Action:** Re-paste [`06-wwl-stripe-webhook-post.xs`](./06-wwl-stripe-webhook-post.xs) (adds consent lookup, `checkout_lines_json` → `lines_json`, debug `stripe_session_id` on response).

**Existing row id 1:** optional manual edit in Xano — set `lines_json` to `["WWL-DEPOSIT-710"]`, copy IP/UA from `wwl_consent_log` id **5**.

---

## 2 · Book `04` — metadata for ops / T−10

**Why:** Stripe Dashboard and webhook see explicit `product_type` on estate books (balance cron can use different value later).

**Action:** Re-paste [`04-wwl-book-post.xs`](./04-wwl-book-post.xs) **or** add one line to Checkout `metadata` in your live stack:

```text
metadata[product_type] = estate_checkout
```

No change to moms or line items.

---

## 3 · Post-payment page `/booked` (recommended)

Static luxe confirmation (tree, no upsell): see [`BOOKING_SUCCESS_PAGE.md`](../BOOKING_SUCCESS_PAGE.md).

Defaults in `04` after re-paste:

```text
https://whisperingwoodsluxe.com/booked?ref={slot_ref}
https://whisperingwoodsluxe.com/booked?cancelled=1
```

Deploy `sites/luxe` so `/booked` resolves on production.

---

## 4 · Stripe Dashboard (no code)

- Webhook endpoint: **only** `checkout.session.completed` for launch week (add `charge.refunded` later).
- Test mode: note **MMI** account `acct_1UG5yw0biIaEI74i` matches `wwl_stripe_sku` price IDs.
- Optional: Customer email receipts ON · branding URL `https://whisperingwoodsluxe.com`.

---

## 5 · Ops · stale `pending_checkout` seats

Abandoned books leave slots unusable. **Manual (launch week):**

1. Filter `wwl_slot`: `status` = `pending_checkout`, `updated_at` older than ~2 hours.
2. Set `status` = `open`, clear `stripe_session_id` if you want a clean re-book.

Automate with a cron + `POST wwl/schedule/t10` pattern later — not required for first 24 seats.

---

## 6 · Env (optional, not wired in `06` today)

| Var | When |
|-----|------|
| `WWL_STRIPE_WEBHOOK_SECRET` | Stripe signature verify on webhook (SPQ has this; WWL `06` still parses body like v3 without verify) |
| `WWL_TAX_IL_PERFORMANCE_JSON` | IL performance on deposit lines — see `STRIPE_TAX_WYOMING.md` · **v2** |

---

## 7 · Idempotency smoke (30 seconds)

Resend same `checkout.session.completed` → `already_handled: true`. You already proved this.

---

**Do not paste before launch:** IL tax line_items in `04`, webhook signature middleware, heirloom `07`/`08` batches — all post–estate-day or post–roster wire.
