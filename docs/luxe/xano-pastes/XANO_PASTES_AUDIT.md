# WWLuxe Xano pastes · full audit (2026-09-15)

**Canon:** `nexus-ops/paste/STRIPE_ULTRA/xano/*.xs` · `innsegall/docs/pastes/innsegall-events-post.xs`

**Runbook:** [`GAUNTLET.md`](./GAUNTLET.md) · **Syntax law:** [`README.md`](./README.md)

---

## SPQ XanoScript rules (this pack)

| Rule | Do | Don’t |
|------|----|--------|
| Loops | `foreach ($arr) { each as $row { } }` | `foreach ($arr as $row)` |
| Optionals | `text field?` · `bool flag?` | `text? field?` · `boolean` |
| Compound `if` | Nest `conditional` blocks | `if (a) && (b)` inside `conditional` |
| Filters | `&&` / `||` in **`db.query` `where`** | — |
| Preconditions | Single `==` / `!=` or flag via nested `conditional` | `$x in [...]` · `(a && b)` |
| Stripe | `api.request` + `params \|set:"line_items[0][price]"` | — |
| `db.edit` | `data = { col: $val }` inline | `data = $patch` variable |
| Consent IP | `legal/request_client_meta` when IP empty | — |

---

## Endpoint matrix

| # | Route | Auth | Tables | SPQ analog | Parse risk | Runtime risk |
|---|--------|------|--------|------------|------------|--------------|
| 01 | `GET wwl/roster` | none | `wwl_slot` | index-style read | **Low** | Empty session → `sample` null (label blank) |
| 02 | `GET wwl/slots` | `X-API-Key` | `wwl_slot` | ops read | **Low** | `$rows` init `[]` before branch |
| 03 | `POST wwl/slots/batch` | API key | `wwl_slot` | batch `db.edit` | **Med** | Session loop only if `sales_open` / label / date sent |
| 04 | `POST wwl/book` | none | slot, sku, consent | checkout v2.4 + consent v1.2 | **Med–High** | Dynamic `line_items[n]` keys; needs `legal/request_client_meta` |
| 05 | `POST wwl/wait` | none | `wwl_wait` | waitlist | **Low** | Duplicate → `already_registered` |
| 06 | `POST wwl/stripe/webhook` | none | payment_log, slot | webhook v2.6 | **Low** | Idempotent on `session_id` only (not `evt_` alone) |
| 07 | `POST wwl/schedule/t10` | `X-Cron-Secret` | slot, sku | cron + Stripe | **Med** | Creates Checkout URL; marks `balance_due` before pay |
| 08 | `GET wwl/lab/rollup` | API key | slot, order, lab_batch | custom | **Med** | Nested `foreach`; orders not filtered by `session_code` yet |
| 09 | `POST wwl/lab/batch` | API key | `wwl_lab_batch` | ops patch | **Low** | — |
| 10 | `POST wwl/orders/batch` | API key | `wwl_order` | ops patch | **Low** | `precondition` inside `foreach` aborts whole batch on one bad id |

---

## Per-file notes

### 01 · roster

- **Pattern:** Two filtered queries + count (no `foreach`).
- **Smoke:** `GET …/wwl/roster?session_code=01-Fall` → `open`, `total`, `sales_open`.
- **Gap:** No rows → `session_label` empty (acceptable before seed).

### 02 · slots

- **Pattern:** Nested `conditional` for filters (SPQ-safe).
- **Smoke:** `X-API-Key` + optional `session_code` / `status`.

### 03 · slots/batch

- **Body:** `{ "session_code": "01-Fall", "sales_open": true }` OR `{ "slots": [{ "slot_ref": "01-Fall·Willow", "time_block": "09:40" }] }`.
- **Fixed:** Session-wide loop runs only when a session-level field is present.

### 04 · book

- **Must:** `wwl_stripe_sku` seeded · `sales_open` true · spot `open`.
- **Lines:** Deposit always; `full` adds balance SKU; `includes_chalet` adds Chalet SKU.
- **Risk:** If parser/runtime rejects `|set:$key_price:$pid`, unroll four Stripe `params` blocks (deposit / +chalet / full / full+chalet) — same as SPQ fixed `line_items[0]`.
- **Deps:** `WWL_STRIPE_SECRET_KEY` · optional tax JSON + `legal/request_client_meta` function.

### 05 · wait

- **Dedupe:** `session_code` + `email` + `status=active`.

### 06 · webhook

- **Event:** `checkout.session.completed` only (others → `ok` + empty handling).
- **Idempotency:** Existing `wwl_payment_log` with same `stripe_session_id` + `succeeded` → `already_handled: true`.
- **Fixed:** `metadata[product_type]=estate_balance_t10` → `paid_balance_at` + `status=complete`.
- **Gap (P2):** No unique guard on `stripe_webhook_event_id` alone; consent IP not copied onto payment_log.

### 07 · schedule/t10

- **v1:** Off-session charge **not** implemented — returns `checkout_url` per due slot for email.
- **Webhook:** Completes slot when mom pays balance session.
- **Cron:** `POST` + header `X-Cron-Secret: $WWL_CRON_SECRET`.

### 08 · lab/rollup

- **v1 stub:** Counts chalet slots + album lines in paid orders (all sessions).
- **P2:** Filter `wwl_order` by `slot_ref` / `session_code`.

### 09–10 · lab/orders batch

- Operator patches only; no Stripe.

---

## Missing APIs (by design)

| API | Where instead |
|-----|----------------|
| `POST wwl/order` (heirloom checkout) | Vercel `/api/wwluxe/keepsake-checkout` until Xano phase 2 |
| `POST wwl/consent` standalone | Inlined in `wwl/book` |
| Stripe signature verify | Optional; SPQ v2.6 parses body like these pastes |

---

## Env checklist

| Variable | Endpoints |
|----------|-----------|
| `WWL_OPS_API_KEY` | 02, 03, 08, 09, 10 |
| `WWL_CRON_SECRET` | 07 |
| `WWL_STRIPE_SECRET_KEY` | 04, 06, 07 |
| `WWL_STRIPE_WEBHOOK_SECRET` | (optional verify — not wired in 06) |

---

## Gauntlet order (unchanged)

Tables + SKU seed → 01 → 02 → 03 (flip `sales_open`) → 04 → Stripe pay → 06 → 05 → 07–10.

---

## Changelog (audit pass)

- 01: query-only roster (no `&&` in `if`)
- 02: `$rows` default `[]`
- 03: conditional session-wide batch
- 04: `$pay_type in ["deposit","full"]` · `$sku_code` in loop
- 06: T−10 balance completion on webhook
