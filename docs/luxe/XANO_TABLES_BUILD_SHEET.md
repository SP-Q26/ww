# WWLuxe · Xano tables — exact build sheet

**SPQ parity audit:** [`XANO_AUDIT_SPQ.md`](./XANO_AUDIT_SPQ.md)

**Reference:** SPQ live stack (~78 `sp_*` tables). WWL needs **7 tables** in a dedicated API group — same **patterns**, not the same breadth.

**SPQ canon (column law):** `~/nexus-ops/paste/STRIPE_ULTRA/xano/sp_payment_log_TABLE.md` · `sp_consent_log_TABLE.md` · SPQ index `custom-code/STRIPE_INDEX_PASTE.md` (`sp_access_tiers`).

**API group (create in Xano):** `wwl_ops`  
**Prefix law:** every table **`wwl_`** (parallel to `sp_`, `innsegall_`).

**SPQ patterns to copy:**

| SPQ | WWL | Pattern |
|-----|-----|---------|
| `sp_access_tiers` | `wwl_stripe_sku` | Stripe `price_…` in DB, not env-only |
| `sp_consent_log` | `wwl_consent_log` | Append-only · IP/UA · chargeback |
| `sp_payment_log` | `wwl_payment_log` | `uuid` + `stripe_session_id` unique · webhook idempotency |
| `sp_alpha_waitlist` | `wwl_wait` | Public POST · email dedupe |
| *(no direct analog)* | `wwl_slot` | Roster + booking + codename (merged) |
| *(no direct analog)* | `wwl_order` | Heirloom kiosk · `lines_json` |
| *(no direct analog)* | `wwl_lab_batch` | Red Tree PO rollup |

**Not in Xano:** auth users (no accounts v1) · email queue (Resend from function later) · Stripe secrets (env only).

**Create tables in this order** (FKs): `wwl_stripe_sku` → `wwl_slot` → `wwl_consent_log` → `wwl_payment_log` → `wwl_order` → `wwl_wait` → `wwl_lab_batch`.

---

## 1 · `wwl_stripe_sku`

*Like `sp_access_tiers` — canonical price IDs for Xano Checkout.*

| Column | Xano type | Nullable | Default | Notes |
|--------|-----------|----------|---------|-------|
| `id` | integer | No | auto | PK |
| `created_at` | timestamp | Yes | `now()` | |
| `sku` | text | No | | e.g. `WWL-DEPOSIT-710` · **unique** |
| `stripe_price_id` | text | No | | `price_…` test/live per workspace |
| `amount_cents` | integer | No | | Server truth · ignore client |
| `display_name` | text | Yes | | Receipt label |
| `mmi_lane` | text | Yes | | `wwluxe_estate_booking` \| `wwluxe_heirloom` |
| `active` | boolean | No | `true` | |

**Indexes:** unique `sku` · index `active`.

**Seed rows (12):** from `docs/luxe/STRIPE_IDS_TEST.md` + `lib/mmi/wwluxe-stripe-products.mjs`.

---

## 2 · `wwl_slot`

*One row = one senior seat (`session_code` + `spot_codename`). Session metadata duplicated per row — batch-update by `session_code` (SPQ `db.edit` in loop, not 78 tables).*

| Column | Xano type | Nullable | Default | Notes |
|--------|-----------|----------|---------|-------|
| `id` | integer | No | auto | PK |
| `created_at` | timestamp | Yes | `now()` | |
| `updated_at` | timestamp | Yes | | bump on book/webhook |
| `session_code` | text | No | | `01-Fall` · `08-SpringA` · **mom-facing run id** |
| `spot_codename` | text | No | | `Willow` · `Lantern` · 24/session |
| `slot_ref` | text | No | | `01-Fall·Willow` · **unique** · QR / `/order?ref=` |
| `mmi_event_key` | text | Yes | | `luxe-estate-2026-oct` |
| `estate_date` | date | No | **no default** | e.g. `2026-10-18` · **do not** use “today” / `now()` on the column |
| `session_label` | text | Yes | | “October 18, 2026 inaugural” |
| `sales_open` | boolean | No | `false` | batch flip when live |
| `sort_order` | integer | Yes | | roster display · 1–24 |
| `status` | enum | No | `open` | see enums below |
| `parent_name` | text | Yes | | |
| `parent_email` | email | Yes | | |
| `parent_phone` | text | Yes | | |
| `senior_name` | text | Yes | | |
| `estate_payment_type` | enum | Yes | | `deposit` \| `full` |
| `includes_chalet` | boolean | Yes | `false` | |
| `terms_version` | text | Yes | | |
| `tos_consent_id` | integer | Yes | | FK → `wwl_consent_log.id` |
| `balance_due_date` | date | Yes | **no default** | Set on **`wwl/book`** only: `estate_date` − 10 days · leave **empty** on seed rows |
| `checkout_lines_json` | json | Yes | | from `linesForModalSelection()` |
| `stripe_customer_id` | text | Yes | | |
| `stripe_default_pm_id` | text | Yes | | |
| `initial_checkout_session_id` | text | Yes | | |
| `balance_payment_intent_id` | text | Yes | | |
| `paid_deposit_at` | timestamp | Yes | | |
| `paid_balance_at` | timestamp | Yes | | |
| `paid_chalet_at` | timestamp | Yes | | |
| `booked_at` | timestamp | Yes | | webhook · spot no longer `open` |
| `time_block` | text | Yes | | `09:40` · batch before event |
| `photographer_zone` | text | Yes | | `A` \| `B` \| `C` |
| `hmua_done` | boolean | Yes | `false` | |
| `notes_ops` | text | Yes | | internal |

**Enum `status`:**  
`open` · `pending_checkout` · `deposit_paid` · `paid_in_full` · `balance_due` · `complete` · `cancelled`

**Enum `estate_payment_type`:** `deposit` · `full`

**Indexes:**

- unique (`session_code`, `spot_codename`)
- unique `slot_ref`
- index (`session_code`, `status`)
- index `parent_email`
- index `initial_checkout_session_id` (nullable unique optional)

**Roster query:** `status == open` AND `sales_open == true` AND `session_code == ?` → count = spots left.

---

## 3 · `wwl_consent_log`

*Like `sp_consent_log` — append-only.*

| Column | Xano type | Nullable | Default | Notes |
|--------|-----------|----------|---------|-------|
| `id` | integer | No | auto | PK |
| `created_at` | timestamp | Yes | `now()` | |
| `uuid` | uuid | Yes | | `security.create_uuid` |
| `consent_type` | enum | No | | see below |
| `tos_version` | text | No | | e.g. `2026-09-09` |
| `accepted_at` | timestamp | Yes | `now()` | |
| `email` | email | Yes | | |
| `parent_name` | text | Yes | | |
| `senior_name` | text | Yes | | |
| `slot_ref` | text | Yes | | set after slot claim |
| `wwl_slot_id` | integer | Yes | | FK `wwl_slot.id` |
| `stripe_session_id` | text | Yes | | patch when Checkout created |
| `ip_address` | text | Yes | | `legal/request_client_meta` |
| `user_agent` | text | Yes | | |
| `page_url` | text | Yes | | modal / order URL |
| `amount_usd` | decimal | Yes | | optional display |

**Enum `consent_type`:** `tos_booking` · `tos_order`

---

## 4 · `wwl_payment_log`

*Like `sp_payment_log` (STRIPE_ULTRA / webhook v3) — dispute bundle.*

| Column | Xano type | Nullable | Default | Notes |
|--------|-----------|----------|---------|-------|
| `id` | integer | No | auto | PK |
| `created_at` | timestamp | Yes | `now()` | |
| `uuid` | uuid | Yes | | |
| `wwl_slot_id` | integer | Yes | | estate bookings |
| `wwl_order_id` | integer | Yes | | heirloom orders |
| `slot_ref` | text | Yes | | denorm for reports |
| `email` | email | Yes | | Stripe customer email |
| `stripe_session_id` | text | Yes | | **unique** idempotency |
| `stripe_webhook_event_id` | text | Yes | | **unique** `evt_…` |
| `stripe_payment_intent_id` | text | Yes | | |
| `stripe_customer_id` | text | Yes | | |
| `mmi_lane` | text | Yes | | `wwluxe_estate_booking` \| `wwluxe_heirloom` |
| `mmi_event_key` | text | Yes | | |
| `estate_payment_type` | text | Yes | | metadata echo |
| `includes_chalet` | boolean | Yes | | |
| `product_type` | enum | Yes | | see below |
| `amount_cents` | integer | Yes | | `amount_total` |
| `amount_tax_cents` | integer | Yes | `0` | Stripe Tax |
| `currency` | text | Yes | `usd` | |
| `payment_status` | enum | Yes | | see below |
| `terms_version` | text | Yes | | |
| `tos_consent_id` | integer | Yes | | FK `wwl_consent_log.id` |
| `lines_json` | json | Yes | | line items / SKUs |
| `ip_address` | text | Yes | | from consent row |
| `user_agent` | text | Yes | | from consent row |
| `day` | date | Yes | | UTC bucket · reports |

**Enum `product_type`:** `estate_checkout` · `estate_balance_t10` · `heirloom_checkout`

**Enum `payment_status`:** `succeeded` · `failed` · `refunded` · `disputed` · `chargeback`

**Idempotency (copy SPQ):** if row exists with `stripe_session_id` and `payment_status == succeeded` → return 200 `already_handled`.

---

## 5 · `wwl_order`

*Heirloom `/order` + kiosk — no line-item table.*

| Column | Xano type | Nullable | Default | Notes |
|--------|-----------|----------|---------|-------|
| `id` | integer | No | auto | PK |
| `created_at` | timestamp | Yes | `now()` | |
| `updated_at` | timestamp | Yes | | |
| `uuid` | uuid | Yes | | |
| `order_ref` | text | Yes | | `H-01F-003` · unique when set |
| `slot_ref` | text | Yes | | optional gate |
| `wwl_slot_id` | integer | Yes | | |
| `parent_email` | email | No | | |
| `parent_name` | text | Yes | | |
| `senior_name` | text | Yes | | |
| `lines_json` | json | No | | `[{sku,qty,amount_cents}]` |
| `total_cents` | integer | No | | server recomputed |
| `cover` | text | Yes | | album cover |
| `source` | enum | Yes | | `order_web` · `chalet_kiosk` |
| `status` | enum | No | `pending_checkout` | |
| `terms_version` | text | Yes | | |
| `tos_consent_id` | integer | Yes | | |
| `stripe_session_id` | text | Yes | | unique when set |
| `fulfillment_status` | text | Yes | | `lab` · `frame_vendor` split |

**Enum `status`:** `pending_checkout` · `paid` · `fulfillment` · `shipped` · `cancelled`

**Enum `source`:** `order_web` · `chalet_kiosk`

Chalet on **booking modal** → `wwl_slot` only, not this table.

---

## 6 · `wwl_wait`

*Like `sp_alpha_waitlist` (simpler).*

| Column | Xano type | Nullable | Default | Notes |
|--------|-----------|----------|---------|-------|
| `id` | integer | No | auto | PK |
| `created_at` | timestamp | Yes | `now()` | |
| `uuid` | uuid | Yes | | |
| `session_code` | text | No | | |
| `email` | email | No | | **unique** per (`session_code`,`email`) via app logic |
| `parent_name` | text | Yes | | |
| `senior_name` | text | Yes | | |
| `tos_version` | text | Yes | | |
| `marketing_consent` | boolean | No | `true` | |
| `ip_address` | text | Yes | | |
| `user_agent` | text | Yes | | |
| `status` | enum | No | `active` | `active` · `unsubscribed` |

---

## 7 · `wwl_lab_batch`

| Column | Xano type | Nullable | Default | Notes |
|--------|-----------|----------|---------|-------|
| `id` | integer | No | auto | PK |
| `created_at` | timestamp | Yes | `now()` | |
| `updated_at` | timestamp | Yes | | |
| `session_code` | text | No | | |
| `vendor` | text | No | `redtree` | |
| `status` | enum | No | `draft` | |
| `rollup_json` | json | Yes | | see XANO_SCHEMA.md |
| `cart_template_json` | json | Yes | | operator snapshot |
| `wholesale_cents` | integer | Yes | | internal |
| `submitted_at` | timestamp | Yes | | |
| `tracking` | text | Yes | | |

**Enum `status`:** `draft` · `ready` · `submitted` · `in_production` · `shipped`

---

## Endpoints (build next phase)

**Pastes:** [`xano-pastes/`](./xano-pastes/) · run [`GAUNTLET.md`](./xano-pastes/GAUNTLET.md)

| Verb | Path | Auth | Writes |
|------|------|------|--------|
| GET | `wwl/roster` | public | read `wwl_slot` |
| GET | `wwl/slots` | API key | read |
| POST | `wwl/slots/batch` | API key | **batch** edit many slots |
| POST | `wwl/book` | public | consent + slot + Stripe session |
| POST | `wwl/wait` | public | `wwl_wait` |
| POST | `wwl/stripe/webhook` | Stripe sig | `wwl_payment_log` + slot status |
| POST | `wwl/schedule/t10` | cron secret | balance charge |
| GET | `wwl/lab/rollup` | API key | compute `rollup_json` |
| POST | `wwl/lab/batch` | API key | `wwl_lab_batch` |
| POST | `wwl/orders/batch` | API key | order status bumps |

WeWeb URLs: `…/wwl/roster` · `…/wwl/book` · `…/wwl/wait`.

**Env (Xano, all `WWL_*`):** see [`xano-pastes/WWL_ENV_SETUP.md`](./xano-pastes/WWL_ENV_SETUP.md) — `WWL_STRIPE_SECRET_KEY` · `WWL_STRIPE_WEBHOOK_SECRET` · `WWL_OPS_API_KEY` · `WWL_CRON_SECRET` · `WWL_TAX_*_JSON`.

---

## Seed checklist (Oct inaugural)

```
[ ] wwl_stripe_sku × 12 — import `docs/luxe/xano-pastes/wwl_stripe_sku_seed.json`
[ ] wwl_slot × 24 for session_code 01-Fall (codenames + estate_date + session_label)
[ ] sales_open = false until smoke
```

**Placeholders until shoot week:** `spot_codename` `01`…`24` · `slot_ref` `01-Fall·01`…`01-Fall·24` · real codenames via `POST wwl/slots/batch` before `sales_open` ([`WWL_ENV_SETUP.md`](./xano-pastes/WWL_ENV_SETUP.md)).

---

## Audit vs old draft

| Removed | Reason |
|---------|--------|
| `experience_week` + `booking` | → `wwl_slot` |
| `booking_checkout_line` | → `checkout_lines_json` + `lines_json` |
| `stripe_event_log` | → `stripe_webhook_event_id` on payment log |
| Separate `wwl_session` table | session fields on slot + batch by `session_code` |

| Added vs prior WWL doc | Reason |
|------------------------|--------|
| `wwl_stripe_sku` | SPQ `sp_access_tiers` pattern |
| `wwl_consent_log` | SPQ chargeback chain |

---

## Version

| Date | Note |
|------|------|
| 2026-09-15 | Exact types · 7 tables · SPQ stripe/consent mapping |
