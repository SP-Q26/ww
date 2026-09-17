# WWLuxe Xano gauntlet

Run in order. Check each box before the next.

**Run from Xano (no terminal):** [`XANO_RUN_GAUNTLET.md`](./XANO_RUN_GAUNTLET.md) — inputs, headers, and pass criteria per endpoint.

**Automated curl smoke:** from `ww` repo root:

```bash
export WWL_XANO_BASE="https://YOUR_INSTANCE.n7.xano.io/api:GROUP_ID"
export WWL_OPS_API_KEY="…"
export WWL_CRON_SECRET="…"   # optional for step 8
./docs/luxe/xano-pastes/smoke-wwl-xano.sh
```

## 0 · Tables + seed

- [ ] API group `wwl_ops` created
- [ ] 7 tables from build sheet
- [ ] Seed `wwl_stripe_sku` — import [`wwl_stripe_sku_seed.json`](./wwl_stripe_sku_seed.json) ([`WWL_STRIPE_SKU_SEED.md`](./WWL_STRIPE_SKU_SEED.md))
- [ ] Seed `wwl_slot` × 24 — import [`wwl_slot_seed_01-fall.json`](./wwl_slot_seed_01-fall.json) · `sales_open` = false ([`WWL_ENV_SETUP.md`](./WWL_ENV_SETUP.md))

## 1 · Read APIs

- [ ] `01-wwl-roster-get.xs` — auth OFF · `GET …/wwl/roster?session_code=01-Fall` → `open`, `total`, `session_label`
- [ ] `02-wwl-slots-get.xs` — header `X-API-Key` · lists slots

## 2 · Ops batch

- [ ] `03-wwl-slots-batch-post.xs` — flip `sales_open` true for smoke (or one row only via `slots` array)

## 3 · Public booking path

- [ ] `04-wwl-book-post.xs` — auth OFF · body smoke → `checkout_url` + `session_id`
- [ ] Stripe test pay → webhook fires
- [ ] `06-wwl-stripe-webhook-post.xs` — auth OFF · slot `deposit_paid` or `paid_in_full` · `wwl_payment_log` row

## 4 · Waitlist

- [ ] `05-wwl-wait-post.xs` — duplicate email same session → 409 or `already_registered`

## 5 · Cron (staging)

- [ ] `07-wwl-schedule-t10-post.xs` — header `X-Cron-Secret` · returns due slots / balance Checkout URLs (v1)

## 6 · Lab + orders (operator)

- [ ] `08-wwl-lab-rollup-get.xs`
- [ ] `09-wwl-lab-batch-post.xs`
- [ ] `10-wwl-orders-batch-post.xs`

## 7 · WeWeb

- [ ] Replace `REPLACE_WITH_YOUR_XANO_INSTANCE` with `…/api:<id>/` on roster · book · wait only

## Smoke JSON · `POST wwl/book`

```json
{
  "session_code": "01-Fall",
  "parent_name": "Test Parent",
  "parent_email": "test+wwl@whisperingwoodsluxe.com",
  "parent_phone": "5555550100",
  "senior_name": "Test Senior",
  "estate_payment_type": "deposit",
  "includes_chalet": false,
  "terms_version": "2026-09-09",
  "success_url": "https://whisperingwoodsluxe.com/?booked=1",
  "cancel_url": "https://whisperingwoodsluxe.com/?booked=0"
}
```
