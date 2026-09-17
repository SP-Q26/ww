# WWLuxe · Xano schema (overview)

**Exact column types, enums, indexes, create order:** → **[`XANO_TABLES_BUILD_SHEET.md`](./XANO_TABLES_BUILD_SHEET.md)** (use this in the Xano UI).

**Law:** SPQ-style — `wwl_*` prefix · `wwl_consent_log` + `wwl_payment_log` chargeback chain · **`wwl_stripe_sku`** like `sp_access_tiers` · **batch** `POST /wwl/slots/batch` · webhook/T−10 single-row only.

**7 tables:** `wwl_stripe_sku` · `wwl_slot` · `wwl_consent_log` · `wwl_payment_log` · `wwl_order` · `wwl_wait` · `wwl_lab_batch` (not 78 — same patterns as SPQ payment/consent/tier tables).

**Code:** `lib/mmi/estate-checkout-lines.mjs` · `lib/mmi/wwluxe-stripe-products.mjs` · tax `STRIPE_TAX_WYOMING.md`  
**SPQ audit:** [`XANO_AUDIT_SPQ.md`](./XANO_AUDIT_SPQ.md)

---

## Quick reference (details in build sheet)

### `wwl_slot` (session + spot + booking)

One row = **one senior seat** for one estate day. Public scarcity is “24 codenames,” not UUIDs.

### Identity (short · special)

| Column | Type | Example | Notes |
|--------|------|---------|-------|
| `session_code` | text | `01-Fall`, `08-SpringA` | **Booking reference** moms see in email · roster API groups on this |
| `spot_codename` | text | `Willow`, `Lantern` | Estate spot name · unique per `session_code` |
| `slot_ref` | text | `01-Fall·Willow` | **Computed** display ref · optional QR (`/order?ref=01-Fall·Willow`) |
| `mmi_event_key` | text | `luxe-estate-2026-oct` | Stripe metadata · reporting |

### Session fields (duplicated on each row — batch-updated together)

| Column | Type | Notes |
|--------|------|-------|
| `estate_date` | date | Calendar day |
| `doors_open` | time | Optional ops |
| `capacity` | int | Always `1` per row; sum open rows = spots left |
| `session_label` | text | Mom-facing: “October 18, 2026 inaugural” |
| `sales_open` | bool | Batch flip when ready |

### Booking (null / `open` until sold)

| Column | Type | Notes |
|--------|------|-------|
| `status` | enum | `open` · `pending_checkout` · `held` · `deposit_paid` · `paid_in_full` · `balance_due` · `complete` · `cancelled` |
| `parent_name` | text | |
| `parent_email` | text | |
| `parent_phone` | text | nullable |
| `senior_name` | text | |
| `estate_payment_type` | enum | `deposit` \| `full` |
| `includes_chalet` | bool | |
| `terms_version` | text | e.g. `2026-09-09` |
| `tos_accepted_at` | timestamp | Consent audit |
| `balance_due_date` | date | T−10 |
| `checkout_lines_json` | json | Snapshot from `linesForModalSelection()` · chargeback evidence |
| `stripe_customer_id` | text | T−10 off-session |
| `stripe_default_pm_id` | text | From first Checkout |
| `initial_checkout_session_id` | text | |
| `balance_payment_intent_id` | text | nullable |
| `paid_deposit_at` | timestamp | |
| `paid_balance_at` | timestamp | null if `full` at book |
| `paid_chalet_at` | timestamp | null if no Chalet |
| `booked_at` | timestamp | Webhook time · **then** decrement public “spots” |

### Ops / day-of (batch-friendly)

| Column | Type | Notes |
|--------|------|-------|
| `time_block` | text | e.g. `09:40` · assign in batch before event |
| `photographer_zone` | text | A / B / C |
| `hmua_done` | bool | default false |
| `notes_ops` | text | internal |

### Indexes

- **Unique** `(session_code, spot_codename)`
- **Unique** `slot_ref` when not null
- `(session_code, status)` for roster + T−10 queries
- `(parent_email)` for support lookup

### Why merge week + booking?

- Roster API = `COUNT` where `session_code=?` AND `status=open` — no join.
- Booking **claims** a row: `open` → `pending_checkout` via **auto-assign** lowest `sort_order` (no `spot_codename` in `POST wwl/book`). Estate codenames are ops-assigned before shoot week.
- Chargeback packet = one row + `checkout_lines_json` + `wwl_payment_log` rows.

---

## 2 · `wwl_payment_log`

Mirror SPQ payment log · **one row per Stripe Checkout session** (not per line). Line detail lives in `checkout_lines_json` on slot + Stripe receipt.

| Column | Type | Notes |
|--------|------|-------|
| `stripe_session_id` | text | **Unique** idempotency |
| `stripe_event_id` | text | **Unique** `evt_…` |
| `stripe_customer_id` | text | |
| `mmi_lane` | text | `wwluxe_estate_booking` \| `wwluxe_heirloom` |
| `slot_ref` | text | nullable · FK logical to `wwl_slot` |
| `order_id` | int | nullable · FK `wwl_order` |
| `amount_cents` | int | Session total |
| `amount_tax_cents` | int | From Stripe `total_details.amount_tax` |
| `currency` | text | `usd` |
| `payment_status` | enum | `succeeded` · `refunded` · `disputed` |
| `lines_json` | json | From Stripe line items or canon snapshot |
| `day` | date | UTC bucket |

Webhook: if `stripe_session_id` exists and `succeeded` → 200 skip (Innsegall pattern).

---

## 3 · `wwl_order` (heirloom / kiosk)

Vercel `keepsake-checkout` or future Xano proxy. **No line table** — SPQ-style JSON blob.

| Column | Type | Notes |
|--------|------|-------|
| `order_ref` | text | Short: `H-01FW-3` (session + sequence) optional |
| `slot_ref` | text | nullable · gate v2 |
| `parent_email` | text | |
| `senior_name` | text | |
| `lines_json` | json | `[{sku, amount_cents, qty}]` |
| `total_cents` | int | Server recomputed |
| `source` | text | `order_web` · `chalet_kiosk` |
| `status` | enum | `pending` · `paid` · `fulfillment` · `shipped` · `cancelled` |
| `stripe_session_id` | text | unique when set |
| `cover` | text | album cover choice |
| `terms_version` | text | |

Chalet bought **in booking modal** does **not** create `wwl_order` — only `wwl_slot.includes_chalet` + payment log.

---

## 4 · `wwl_wait`

| Column | Type |
|--------|------|
| `session_code` | text |
| `parent_email` | text |
| `parent_name` | text |
| `senior_name` | text |
| `created_at` | timestamp |

No spot assignment. Promote to slot manually or batch email when spot opens.

---

## 5 · `wwl_lab_batch` (Red Tree bulk)

One row per **lab PO wave** per session (not per senior).

| Column | Type | Notes |
|--------|------|-------|
| `session_code` | text | `01-Fall` |
| `vendor` | text | `redtree` |
| `status` | enum | `draft` · `ready` · `submitted` · `in_production` · `shipped` |
| `rollup_json` | json | Albums, spreads, leather, minis — see below |
| `cart_template_json` | json | Operator Red Tree saved cart snapshot |
| `wholesale_cents` | int | Internal |
| `submitted_at` | timestamp | |
| `tracking` | text | nullable |

### `rollup_json` shape (generated by API, not hand-edited)

```json
{
  "album_10x10_15_spread": 12,
  "extra_spreads_total": 18,
  "mini_6x6": 4,
  "chalet_bundle_count": 12,
  "fine_art_upgrades": 2,
  "notes": "Luxe Leather · Semi-Matte · standard deboss"
}
```

**Source query:** `wwl_slot` where `paid_chalet_at` OR album SKUs on linked `wwl_order` for `session_code` — see `REDTREE_BOM_AUDIT.md` wholesale lines.

---

## API surface (batch-first)

| Method | Path | Use |
|--------|------|-----|
| `GET` | `/wwl/roster` | `?session_code=01-Fall` → `{ open, total, session_label }` |
| `GET` | `/wwl/slots` | Operator · filter by session |
| `POST` | `/wwl/slots/batch` | **Seed 24 codenames** · flip `sales_open` · assign `time_block` / zones |
| `POST` | `/wwl/book` | Claim slot · create Checkout (Stripe — not batch) |
| `POST` | `/wwl/wait` | Single insert waitlist |
| `POST` | `/wwl/stripe/webhook` | Stripe only |
| `POST` | `/wwl/schedule/t10` | Cron · balance charge + email (Stripe — not batch) |
| `GET` | `/wwl/lab/rollup` | `?session_code=01-Fall` → `wwl_lab_batch.rollup_json` draft |
| `POST` | `/wwl/lab/batch` | Mark PO submitted · attach tracking |
| `POST` | `/wwl/orders/batch` | Operator status bumps (`fulfillment` → `shipped`) |

WeWeb replaces `REPLACE_WITH_YOUR_XANO_INSTANCE` on **book**, **wait**, **roster** only.

---

## Session + codename seed (example)

| `session_code` | `estate_date` | Spots |
|----------------|---------------|-------|
| `01-Fall` | 2026-10-18 | 24 codenames |
| `08-SpringA` | 2027-03-__ | 24 (planned) |

Codenames: fixed list of 24 estate-themed names (batch insert once). Moms see **“01-Fall · Willow”** not `booking_id=847`.

---

## Stripe · product tax category (`tax_code`)

Stripe Dashboard “Product tax category” = API field **`tax_code`** on Product ([Tax codes](https://docs.stripe.com/tax/tax-codes)). Set on **MMI** products via API; confirm with CPA for IL photography.

| Group | SKUs | `tax_code` | `shippable` |
|-------|------|------------|-------------|
| Estate + labor + bundle | deposit, balance, Chalet, retouch, spreads, fine art | `txcd_20030000` General - Services | false |
| Digital gallery | `WWL-DIGITAL-395` | `txcd_10000000` General - Electronically Supplied Services | false |
| Physical heirloom | album, frame, mini | `txcd_99999999` General - Tangible Goods | **true** |

Canon map: `lib/mmi/stripe-product-tax.mjs`. Chalet is **service-classified at product level**; with Stripe Tax on, prefer **split Checkout lines** for max/legal collection (see `STRIPE_TAX_WYOMING.md`).

**Tax ops:** `wwl_payment_log.amount_tax_cents` (from Stripe session) · `performance_address_json` in env or `wwl_config` row for IL estate.

**Not in Xano:** Price IDs stay env + `STRIPE_IDS_TEST.md`.

---

## T−10 query (no extra table)

```text
wwl_slot WHERE session_code = ?
  AND estate_payment_type = deposit
  AND status = deposit_paid
  AND balance_due_date <= today
  AND paid_balance_at IS NULL
```

---

## Version

| Date | Note |
|------|------|
| 2026-09-15 | Merged slot table · WWL prefix · batch API law · lab rollup · Stripe tax_code |
