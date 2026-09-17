# WWLuxe · flip Stripe Live · live test · then DNS

**Order:** Live keys + live `price_…` in Xano → smoke on **one hostname** → DNS path split.

MCP in Cursor is **test-only** until you connect the **live** MMI account (`manage_stripe_accounts` in Stripe MCP). Dashboard steps below work without MCP.

---

## 1 · Stripe Live (Dashboard)

1. Toggle **Live** (top right).
2. **Tax:** Head office WY · Registrations **WY + IL** · Defaults **exclusive**.
3. **Products:** Run catalog seed (§2) or duplicate from test. On **deposit + balance** products set performance location: **14518 O'Brien Rd, Harvard, IL 60033**.
4. **Developers → Webhooks → Add endpoint (live):**
   - URL: `https://xfog-zdyr-rbyx.n7e.xano.io/api:E6ai6f3e/wwl/stripe/webhook`
   - Event: `checkout.session.completed`
   - Copy **`whsec_…`** → Xano `WWL_STRIPE_WEBHOOK_SECRET`.

---

## 2 · Seed live catalog (terminal, MMI `sk_live_…` only)

From repo root:

```bash
cd ~/ww
STRIPE_SECRET_KEY=sk_live_… node scripts/seed-mmi-wwluxe-stripe-test.mjs
```

Writes `docs/luxe/STRIPE_IDS_LIVE.md` and `docs/luxe/xano-pastes/wwl_stripe_sku_seed.live.json`.

Then in **Xano → `wwl_stripe_sku`:** update each row’s `stripe_price_id` to the **live** `price_…` (or import the `.live.json` if your table import supports it).

**Never** pair `sk_live_…` with test `price_…` from `wwl_stripe_sku_seed.json`.

---

## 3 · Xano env (live)

| Variable | Live value |
|----------|------------|
| `WWL_STRIPE_SECRET_KEY` | `sk_live_…` |
| `WWL_STRIPE_WEBHOOK_SECRET` | live `whsec_…` |
| `WWL_PUBLIC_ORIGIN` | **Pre-DNS test:** `https://luxe-omega.vercel.app` · **After DNS:** `https://whisperingwoodsluxe.com` |

`04` already pasted: `automatic_tax`, address + US shipping collection.

---

## 4 · Vercel project `luxe` (live)

| Env | Value |
|-----|--------|
| `STRIPE_SECRET_KEY` or `WWLUXE_STRIPE_SECRET_KEY` | `sk_live_…` |
| `WWLUXE_SITE_ORIGIN` | Same as `WWL_PUBLIC_ORIGIN` for the phase you’re in |

Redeploy **production** after env change.

---

## 5 · Live test (before custom domain)

**Book from the same origin that serves `/booked`.** Checkout JS sends `success_url = window.location.origin + '/booked'`.

| Where mom opens the site | `/booked` works? |
|--------------------------|------------------|
| `https://luxe-omega.vercel.app/` | Yes (Vercel rewrites) |
| WeWeb `…-production.weweb.io` only | **No** until DNS sends `/booked` to Vercel |

**Pre-DNS smoke:** use **Vercel production URL** for the funnel, or temporarily browse marketing on a host that path-splits `/booked` to Vercel.

1. Real card · smallest real booking (or deposit on a slot you can refund in Dashboard).
2. Stripe **Live** → Payment succeeded · Checkout shows tax if configured.
3. Xano webhook **200** · slot not `open`.
4. Land on `/booked?ref=…` on **same host**.

```bash
PREVIEW_HOST=https://luxe-omega.vercel.app bash sites/luxe/scripts/smoke-luxe-swarm.sh
```

---

## 6 · Swap domain on (after live payment OK)

1. **WeWeb:** custom domain apex → production publish.
2. **DNS:** apex `/` → WeWeb; `/booked`, `/heirloom*`, legal, `/api/wwluxe/*` → Vercel (`KEEPSAKES_VERCEL_DNS.md`).
3. Set `WWL_PUBLIC_ORIGIN` + `WWLUXE_SITE_ORIGIN` → `https://whisperingwoodsluxe.com`.
4. `SMOKE_PROD=1 bash sites/luxe/scripts/smoke-luxe-swarm.sh`

---

## Rollback

Xano: restore `sk_test_…` + test `price_` IDs. Vercel: test key. Stripe Dashboard: disable live webhook if needed.
