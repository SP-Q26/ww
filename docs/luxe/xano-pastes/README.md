# WWLuxe · Xano API pastes (`wwl_ops`)

**Tables:** [`XANO_TABLES_BUILD_SHEET.md`](../XANO_TABLES_BUILD_SHEET.md) — create all 7 before APIs.

**Gauntlet:** [`GAUNTLET.md`](./GAUNTLET.md) · **Audit:** [`XANO_PASTES_AUDIT.md`](./XANO_PASTES_AUDIT.md)

## Database seed files

| File | Table | Notes |
|------|--------|--------|
| [`wwl_stripe_sku_seed.json`](./wwl_stripe_sku_seed.json) | `wwl_stripe_sku` | 12 rows · test `price_…` · [`WWL_STRIPE_SKU_SEED.md`](./WWL_STRIPE_SKU_SEED.md) |
| [`wwl_slot_seed_01-fall.json`](./wwl_slot_seed_01-fall.json) | `wwl_slot` | 24 rows · `01-Fall` · codenames `01`–`24` |

## API group

1. Xano → **New API group** → name `wwl_ops` (or your label).
2. Paste each `.xs` file as a **new API endpoint** (query name = path in file header).
3. Set **auth** per file header (`NONE` = disable JWT on that route).

## Environment variables

**All Xano secrets use `WWL_*` — setup:** [`WWL_ENV_SETUP.md`](./WWL_ENV_SETUP.md)

| Name | Used by |
|------|---------|
| `WWL_STRIPE_SECRET_KEY` | book · webhook · t10 |
| `WWL_STRIPE_WEBHOOK_SECRET` | webhook (optional verify) |
| `WWL_OPS_API_KEY` | slots · batch · lab · orders |
| `WWL_CRON_SECRET` | schedule/t10 |
| `WWL_TAX_WY_ORIGIN_JSON` | book (optional Stripe Tax) |
| `WWL_TAX_IL_PERFORMANCE_JSON` | book (optional) |

## WeWeb base URL

After paste: `https://<instance>.n7.xano.io/api:<group_id>/`

| Route | WeWeb |
|-------|--------|
| `GET wwl/roster` | roster / spots |
| `POST wwl/book` | booking submit |
| `POST wwl/wait` | waitlist |

## Files

| File | Route |
|------|--------|
| `01-wwl-roster-get.xs` | `GET wwl/roster` |
| `02-wwl-slots-get.xs` | `GET wwl/slots` |
| `03-wwl-slots-batch-post.xs` | `POST wwl/slots/batch` |
| `04-wwl-book-post.xs` | `POST wwl/book` |
| `05-wwl-wait-post.xs` | `POST wwl/wait` |
| `06-wwl-stripe-webhook-post.xs` | `POST wwl/stripe/webhook` |
| `07-wwl-schedule-t10-post.xs` | `POST wwl/schedule/t10` |
| `08-wwl-lab-rollup-get.xs` | `GET wwl/lab/rollup` |
| `09-wwl-lab-batch-post.xs` | `POST wwl/lab/batch` |
| `10-wwl-orders-batch-post.xs` | `POST wwl/orders/batch` |

**Note:** Table names in pastes assume Xano tables are literally `wwl_slot`, `wwl_stripe_sku`, etc. Rename in stack if your UI pluralizes differently.

**Loops:** XanoScript uses `foreach ($arr) { each as $row { ... } }` — not `foreach ($arr as $row)`.

**Input:** optional = `text field_name?` · booleans = `bool flag?` (not `boolean?`).

**Logic (SPQ):** use `&&` in **`db.query` `where`** · avoid `&&` inside `conditional { if (...) && (...) }` — nest `conditional` blocks or filter in SQL instead.

**db.edit:** `data = { field: value }` **literal object only** — not `data = $patch` (parser error).

**precondition:** simple `==` / `!=` only — no `$x in ["a","b"]` (`in` is for `db.query` `where` only).
