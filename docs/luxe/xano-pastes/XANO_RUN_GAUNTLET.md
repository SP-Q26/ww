# WWLuxe gauntlet · run entirely in Xano

No terminal, no keys in chat. Use **API → `wwl_ops` → endpoint → Run**. Secrets stay in **Xano → Settings → Environment variables** and (for gated routes) in the **Run** header fields only inside your browser.

**Order:** run steps **1 → 8** in sequence. Check the box before moving on.

---

## Run panel cheat sheet

| Where in Run | Used for |
|--------------|----------|
| **Inputs** (query / body) | Values in each step below |
| **Headers** | `X-API-Key` (steps 2, 3, 7, 8–10) · `X-Cron-Secret` (step 8) |
| **Response** | JSON you assert on |
| **Logs** (after Run) | Stack trace if something fails |

**Ops header (optional for launch week):**

- If **`WWL_OPS_API_KEY`** env is **empty**, steps **2, 3, 8** run from **Run** with **no headers** (see [`WWL_ENV_SETUP.md`](./WWL_ENV_SETUP.md) · speed mode).
- If env is **set**, add header **`X-API-Key`** on Run (when your Xano UI shows **Headers** / **Request headers**). Never paste the key into API code.

**`X-Cron-Secret`** on step 9: same rule — empty **`WWL_CRON_SECRET`** = no header required.

JWT / API group auth stays **off** on every `wwl_*` route (gate is header + env compare in the stack).

---

## 0 · Already done?

- [ ] **7 tables** per build sheet — especially **`wwl_payment_log`** (webhook dies with `missing parameter - dbo` if this table is missing or misnamed)
- [ ] **`wwl_stripe_sku`** import [`wwl_stripe_sku_seed.json`](./wwl_stripe_sku_seed.json) + **24 rows in `wwl_slot`** for `01-Fall`  
  - If roster returns **`total: 0`**, the table is empty (or `session_code` doesn’t match exactly).  
  - Import: [`wwl_slot_seed_01-fall.json`](./wwl_slot_seed_01-fall.json) via **Database → `wwl_slot` → Import** (or add one row manually, then import the rest).  
  - **Dates:** On the table, **`estate_date`** and **`balance_due_date`** must have **no column default** (not “today”). Seed uses `estate_date` `2026-10-18`; **`balance_due_date` stays blank** until someone runs **book**. If rows already show today, fix columns then run batch below.
  - Willow/Lantern names instead: see [`XANO_AUDIT_SPQ.md`](../XANO_AUDIT_SPQ.md) § paste seed · `wwl_slot`.
- [ ] Env: `WWL_STRIPE_SECRET_KEY`, `WWL_OPS_API_KEY`, `WWL_CRON_SECRET`, `WWL_STRIPE_WEBHOOK_SECRET`
- [ ] Stripe webhook URL → `POST wwl/stripe/webhook` · event `checkout.session.completed`

---

## 1 · `GET wwl/roster`

**Headers:** none  

**Inputs:**

| Input | Value |
|-------|--------|
| `session_code` | `01-Fall` |

**Pass when:** `total` is 24 (or your seed count), `sales_open` is false *before* step 3.

---

## 2 · `GET wwl/slots`

**Headers:** `X-API-Key` = `WWL_OPS_API_KEY`  

**Inputs:**

| Input | Value |
|-------|--------|
| `session_code` | `01-Fall` |
| `limit` | `5` |

**Pass when:** `count` ≥ 1 and rows look like your seed.

---

## 3 · `POST wwl/slots/batch` (open sales)

**Headers:** `X-API-Key`  

**Body (JSON inputs):**

```json
{
  "session_code": "01-Fall",
  "sales_open": true
}
```

**Pass when:** `ok` is true, `updated` ≥ 1.

**Optional rename before shoot week** (ops only — moms never send codename at book):

```json
{
  "session_code": "01-Fall",
  "slots": [
    {
      "slot_ref": "01-Fall·01",
      "spot_codename": "Willow",
      "time_block": "09:40"
    }
  ]
}
```

Booking **auto-claims** the next open seat (`sort_order`); batch rename is for call sheets only.

---

## 4 · `GET wwl/roster` (after open)

Same as step 1.

**Pass when:** `sales_open` is true.

---

## 5 · `POST wwl/book`

**Headers:** none  

**Body:**

```json
{
  "session_code": "01-Fall",
  "parent_name": "Xano Run Parent",
  "parent_email": "run-test@whisperingwoodsluxe.com",
  "parent_phone": "5555550100",
  "senior_name": "Xano Run Senior",
  "estate_payment_type": "deposit",
  "includes_chalet": false,
  "terms_version": "2026-09-09",
  "success_url": "https://whisperingwoodsluxe.com/booked?ref=01-Fall·01",
  "cancel_url": "https://whisperingwoodsluxe.com/booked?cancelled=1"
}
```

**Pass when:** response includes `checkout_url` (Stripe) and `session_id` (`cs_test_…`).

**Save from response** (for your own notes in Xano, not in git):

- `session_id`
- `slot_ref`
- `checkout_url`

**Slot state after Run (before pay):** lowest open `sort_order` row → **pending_checkout** — confirm in **Database → `wwl_slot`**.

---

## 6 · Stripe pay + webhook (not a fake Run body)

`06` expects a real Stripe event. Do **not** paste a made-up JSON in Run unless you are debugging — use the live path:

1. Copy **`checkout_url`** from step 5 → open in a browser (Stripe **test** mode).
2. Card `4242 4242 4242 4242` · any future expiry · any CVC.
3. **Stripe → Developers → Webhooks → your endpoint → Recent deliveries** → `checkout.session.completed` → **200**.
4. **Xano → API → `wwl/stripe/webhook` → History / Logs** → same request succeeded.

**Database pass:**

| Table | Check |
|-------|--------|
| `wwl_payment_log` | Row with `stripe_session_id` = step 5 `session_id`, `payment_status` succeeded |
| `wwl_slot` | First claimed row: `deposit_paid` (deposit path) |
| `wwl_consent_log` | `stripe_session_id` linked |

**Retry:** run book again for a second checkout — each call grabs the next open `sort_order` row.

---

## 7 · `POST wwl/wait`

**Headers:** none  

**Body:**

```json
{
  "session_code": "01-Fall",
  "email": "wait-test@whisperingwoodsluxe.com",
  "terms_version": "2026-09-09"
}
```

Run **twice** with the same email.

**Pass when:** first succeeds; second returns already registered / 409-style error.

---

## 8 · `GET wwl/lab/rollup`

**Headers:** `X-API-Key`  

**Inputs:** `session_code` = `01-Fall`

**Pass when:** JSON returns without access denied (rollup may be empty until Chalet/lab data exists).

---

## 9 · `POST wwl/schedule/t10`

**Headers:** `X-Cron-Secret` = `WWL_CRON_SECRET`  

**Body:**

```json
{
  "session_code": "01-Fall"
}
```

**Pass when:** no “Invalid cron secret”; response lists due slots or empty array (normal right after a fresh deposit if balance isn’t due yet).

---

## 10 · Optional · `POST wwl/lab/batch` / `POST wwl/orders/batch`

Only after you have lab rows or orders to patch. Same **`X-API-Key`** header. See build sheet / paste headers for body shape.

---

## If a Run fails

| Error | Fix |
|-------|-----|
| Invalid ops API key | Header name exactly `X-API-Key`; value matches env `WWL_OPS_API_KEY` |
| Invalid cron secret | Header `X-Cron-Secret` matches `WWL_CRON_SECRET` |
| No spots available | `sales_open` false; all rows taken; or empty seed |
| Book missing Stripe URL | Re-paste `04`; set `WWL_STRIPE_SECRET_KEY`; check `wwl_stripe_sku` test prices |
| Automatic tax / head office | Re-paste `04` (tax off for launch) **or** Stripe **Test → Settings → Tax** → save WY head office, then re-enable tax in `04` |
| Webhook non-200 | Stripe delivery detail → Xano log on `06`; URL must match group base |
| Webhook `missing parameter - dbo` on **Query all Records** | Create **`wwl_payment_log`** table (build sheet §4) · name exactly `wwl_payment_log` · enums `product_type` + `payment_status` · re-paste `06` |
| `legal/request_client_meta` | Ensure SPQ **legal** function exists in this Xano workspace (book/wait use it when IP is empty in Run) |

---

## After gauntlet

- [ ] WeWeb: replace `REPLACE_WITH_YOUR_XANO_INSTANCE` on roster / book / wait only ([`GAUNTLET.md`](./GAUNTLET.md) §7)
- [ ] Flip `sales_open` false on a staging session when you need to freeze bookings

**Terminal script** ([`smoke-wwl-xano.sh`](./smoke-wwl-xano.sh)) is optional — same steps, for CI later.
