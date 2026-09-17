# WWLuxe · Xano audit vs SPQ (~78 tables)

**Operator action:** create tables from **[`XANO_TABLES_BUILD_SHEET.md`](./XANO_TABLES_BUILD_SHEET.md)** only — this file is the **why** and **parity check**.

---

## Scope decision (narrow on purpose)

| SPQ domain | ~tables | WWL v1 |
|------------|---------|--------|
| Auth (`sp_user`, magic, roles) | many | **Skip** — no accounts |
| Niches / entitlements (`sp_user_niches`, unlock loops) | many | **Skip** — roster spot = entitlement |
| Terminal / intel / page state | many | **Skip** |
| Stripe catalog | `sp_access_tiers` | **`wwl_stripe_sku`** (11 checkout + 1 inactive ref) |
| Consent chain | `sp_consent_log` | **`wwl_consent_log`** (`tos_booking` · `tos_order`) |
| Payment audit | `sp_payment_log` | **`wwl_payment_log`** |
| Alpha waitlist | `sp_alpha_waitlist` | **`wwl_wait`** |
| Product-specific | — | **`wwl_slot`** · **`wwl_order`** · **`wwl_lab_batch`** |

You are **not** missing 71 tables — WWL is a **single-event commerce + ops** surface, not a multi-niche SaaS.

---

## `sp_access_tiers` → `wwl_stripe_sku`

| SPQ | WWL |
|-----|-----|
| `tier_key` | `sku` (unique) |
| `stripe_id` | `stripe_price_id` |
| `price_cents` | `amount_cents` |
| `status` active/inactive | `active` boolean |
| `included_niches` JSON | **N/A** — unlock = slot status |
| `billing_period` | **N/A** — all one-time |
| `package_key` | **N/A** |

**Checkout rule (code):** Xano resolves `price_…` from `wwl_stripe_sku` where `sku IN (lines[].sku)` — never use `WWL-ESTATE-1420` in sessions (`estate-checkout-lines.mjs`).

---

## `sp_consent_log` → `wwl_consent_log`

| SPQ column | WWL | Notes |
|------------|-----|-------|
| `consent_type` | `consent_type` | `tos_booking` (modal) · `tos_order` (`/order`) — not `tos_signup` |
| `tos_version` | `tos_version` | same |
| `uuid` | `uuid` | chargeback packet |
| `user_id` | **omit** | no auth |
| `email`, IP, UA, `page_url` | same | `legal/request_client_meta` |
| `stripe_session_id` | same | patch after Checkout create |
| `niche_id` | **omit** | |
| `amount_usd` | optional | |
| — | `slot_ref`, `wwl_slot_id`, `parent_name`, `senior_name` | estate context |

**Flow:** `POST /wwl/book` inserts consent **before** slot claim + Checkout (SPQ: pay consent before `create-checkout-session`).

---

## `sp_payment_log` → `wwl_payment_log`

| SPQ (STRIPE_ULTRA) | WWL | Notes |
|--------------------|-----|-------|
| `stripe_session_id` unique | same | idempotency |
| `stripe_webhook_event_id` | same | `evt_…` unique |
| `uuid` | same | |
| `user_id` | **omit** | |
| `email` | same | Stripe customer |
| `stripe_payment_intent_id`, `stripe_customer_id` | same | |
| `stripe_subscription_id` | **omit** | no subs |
| `niche_*`, `tier_key`, `package_key` | **omit** | |
| `unlocked_count`, seats | **omit** | slot `status` instead |
| `product_type` enum | WWL enum | `estate_checkout` · `estate_balance_t10` · `heirloom_checkout` |
| `payment_status` | same set | incl. `chargeback` |
| `tos_consent_id` | same | FK consent |
| `signup_consent_id` | **omit** | no signup consent row |
| `terms_version`, IP, UA | same | copy from consent |
| `access_period_*`, `days_of_service_used` | **omit** | |
| — | `wwl_slot_id`, `wwl_order_id`, `slot_ref` | |
| — | `mmi_lane`, `mmi_event_key`, `estate_payment_type`, `includes_chalet` | Stripe metadata echo |
| — | `amount_tax_cents`, `lines_json` | Stripe Tax + SKU snapshot |
| — | `day` | UTC reporting bucket |

**Idempotency (copy SPQ v2.6):** `stripe_session_id` exists + `payment_status = succeeded` → `200` `{ already_handled: true }`.

---

## APIs vs SPQ

| SPQ | WWL |
|-----|-----|
| `POST stripe/create-checkout-session` | `POST /wwl/book` (estate) · order endpoint later |
| `POST stripe/webhook` | `POST /wwl/stripe/webhook` |
| tier-driven unlock loop | update **`wwl_slot.status`** + timestamps |
| — | **`POST /wwl/slots/batch`** (roster ops — SPQ has no direct analog) |
| — | **`POST /wwl/schedule/t10`** (balance charge) |

**API group name:** `wwl_ops` (new Xano API group — do not paste into SPQ `SuIN-5s_` group).

---

## Paste seed · `wwl_stripe_sku` (test mode)

Import **[`xano-pastes/wwl_stripe_sku_seed.json`](./xano-pastes/wwl_stripe_sku_seed.json)** (12 rows; `active: false` only on `WWL-ESTATE-1420`). Operator notes: [`WWL_STRIPE_SKU_SEED.md`](./xano-pastes/WWL_STRIPE_SKU_SEED.md). `stripe_price_id` canon: `STRIPE_IDS_TEST.md`.

`display_name` optional — copy from `lib/mmi/wwluxe-stripe-products.mjs` `name` fields.

---

## Paste seed · `wwl_slot` × 24 (`01-Fall`)

Per row (batch insert):

| Field | Value |
|-------|--------|
| `session_code` | `01-Fall` |
| `estate_date` | `2026-10-18` |
| `session_label` | `October 18, 2026 · Inaugural estate day` |
| `mmi_event_key` | `luxe-estate-2026-oct` |
| `status` | `open` |
| `sales_open` | `false` until launch |
| `sort_order` | `1`…`24` |
| `spot_codename` | one per row from list below |
| `slot_ref` | `01-Fall·{codename}` (middle dot ·) |

**Codenames:** Willow, Lantern, Meadow, Brook, Cedar, Fern, Hazel, Ivy, Lark, Maple, Moss, Oak, Pebble, Pine, Reed, Sage, Sparrow, Stone, Thistle, Vale, Wren, Birch, Clover, Ember.

---

## Gaps / next-phase (not schema)

| Item | Owner |
|------|--------|
| XanoScript pastes (`wwl-book-v1.xs`, webhook, batch) | build phase |
| WeWeb `REPLACE_WITH_YOUR_XANO_INSTANCE` | after API group URL |
| Live `price_…` duplicate table | `STRIPE_IDS_LIVE.md` + re-seed `wwl_stripe_sku` |
| Stripe Tax head office WY + IL registration | Dashboard + `STRIPE_TAX_WYOMING.md` |
| Remaining product `tax_code` on MMI catalog | `stripeUpdateProductParams()` |

---

## Version

| Date | Note |
|------|------|
| 2026-09-15 | Full SPQ parity audit · 7-table narrow scope |
