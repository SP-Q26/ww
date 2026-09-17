# WWLuxe · Stripe MCP swarm (new account · full SKU canon)

**Purpose:** When Stripe MCP is connected to the **new** WWLuxe Stripe account, run this doc top-to-bottom: create catalog, wire env, smoke test estate + keepsake paths.  
**Canon sources:** `ORDER_SKU_CATALOG.md` · `lib/wwluxe/stripe-catalog.mjs` · `public/whispering-woods-luxe/assets/wwluxe-order.js` · `XANO_STRIPE_WIRE.md`  
**Marketing site:** No Oct 18 triad times on WeWeb — schedule lives in `OCT_18_RUN_OF_DAY.md` (production only).

**Last updated:** 2026-09-10 · Operator confirmed canvas **pricing green** · **fake testimonials hidden**.

---

## 0 · Account + env (before MCP product creation)

| Secret / var | Where | Value / notes |
|--------------|-------|----------------|
| `STRIPE_SECRET_KEY` | Vercel (SPQ project) | **Live** or test `sk_…` for keepsake API |
| `STRIPE_WEBHOOK_SECRET` | Vercel + Xano | `whsec_…` for `checkout.session.completed` |
| `WWLUXE_SITE_ORIGIN` | Vercel | `https://whisperingwoodsluxe.com` (Stripe return URLs) |
| Stripe Publishable | WeWeb / Xano only | `pk_…` — **never** in git |
| Dashboard | Stripe | Business name · statement descriptor `WW LUXE` or similar · receipt email branding |

**Checkout surfaces**

| Flow | Entry | Backend today | Stripe mode |
|------|--------|---------------|-------------|
| Estate book | WeWeb modal → Xano | Xano workflows → Stripe Session | **Always** **`WWL-DEPOSIT-710`** ($710 non-refundable) + **`WWL-ESTATE-BALANCE-710`** when paying in full at book, or balance at T−10 · optional **`WWL-CHALET-PREORDER-1420`** · **`BOOKING_MODAL_PAYMENT_PLANS.md`** · `lib/mmi/estate-checkout-lines.mjs` |
| Estate balance | Xano **T−10** email + charge | Xano | **$710** · `WWL-ESTATE-BALANCE-710` (deposit path only) · Chalet pre-order last call same email |
| Keepsakes / Chalet | `/order` → `POST /api/wwluxe/keepsake-checkout` | Vercel serverless | `price_data` + `metadata.wwluxe_sku` per line |

**Law:** Do not restructure `wf_booking_form_submit` — only swap API URLs / Stripe price IDs in Xano after catalog exists.

---

## 1 · Master SKU table (fill Stripe IDs after MCP create)

Use **one Stripe Product per logical SKU** (recommended). **Price** = one-time USD, `unit_amount` in **cents**.  
Copy `prod_…` / `price_…` into the **Stripe ID** columns when created.

### Tier A · Estate (main funnel · Xano)

| Internal SKU | Display name (customer) | Description (Stripe / receipt) | Retail USD | `unit_amount` | `metadata.wwluxe_sku` | Stripe Product ID | Stripe Price ID |
|--------------|-------------------------|--------------------------------|------------:|--------------:|------------------------|-------------------|-----------------|
| `WWL-ESTATE-1420` | The Estate Senior Experience | Full estate day · heirloom story · Chalet access · 24 spots | 1,420.00 | 142000 | `WWL-ESTATE-1420` | `prod________` | `price________` |
| `WWL-DEPOSIT-710` | Estate reservation deposit | Non-refundable 50% deposit · balance due before event | 710.00 | 71000 | `WWL-DEPOSIT-710` | `prod________` | `price________` |
| `WWL-ESTATE-BALANCE-710` | Estate experience balance | Remaining 50% · auto-charge per booking policy | 710.00 | 71000 | `WWL-ESTATE-BALANCE-710` | `prod________` | `price________` |

**Xano map keys:** `estate_deposit` → `WWL-DEPOSIT-710` · `estate_balance` → `WWL-ESTATE-BALANCE-710` · full ticket reference → `WWL-ESTATE-1420`.

### Tier B · Chalet pre-order bundle (`/order` + kiosk)

| Internal SKU | Display name | Description | Retail USD | `unit_amount` | `metadata.wwluxe_sku` | Product ID | Price ID |
|--------------|--------------|-------------|------------:|--------------:|------------------------|------------|----------|
| `WWL-CHALET-PREORDER-1420` | Chalet Collection · Estate Reservation | Heirloom album 10×10 · digital gallery · archival framed print 20×24 · standard spec (not Fine Art / mini / extra spreads) | 1,420.00 | 142000 | `WWL-CHALET-PREORDER-1420` | `prod________` | `price________` |

Compare at checkout (copy only, not a SKU): à la carte **$1,775** · thank-you **$355**.

### Tier C · À la carte keepsakes

| Internal SKU | Display name | Description | Retail USD | `unit_amount` | `metadata.wwluxe_sku` | Product ID | Price ID |
|--------------|--------------|-------------|------------:|--------------:|------------------------|------------|----------|
| `WWL-ALBUM-HEIRLOOM-955` | Heirloom Album 10×10 | Handcrafted layflat · 15 spreads · luxe leather default | 955.00 | 95500 | `WWL-ALBUM-HEIRLOOM-955` | `prod________` | `price________` |
| `WWL-DIGITAL-395` | Digital Gallery | Full-resolution downloads · private family gallery · print release | 395.00 | 39500 | `WWL-DIGITAL-395` | `prod________` | `price________` |
| `WWL-FRAME-425` | Archival Framed Print 20×24 | Museum-quality materials · ready to hang | 425.00 | 42500 | `WWL-FRAME-425` | `prod________` | `price________` |
| `WWL-RETOUCH-7-195` | Extra Retouches · 7 images | Editorial retouch beyond estate gallery set | 195.00 | 19500 | `WWL-RETOUCH-7-195` | `prod________` | `price________` |

### Tier D · Add-ons (not in Chalet bundle)

| Internal SKU | Display name | Description | Retail USD | `unit_amount` | `metadata.wwluxe_sku` | Product ID | Price ID |
|--------------|--------------|-------------|------------:|--------------:|------------------------|------------|----------|
| `WWL-UPGRADE-FINEART-395` | Fine Art Paper Upgrade | Museum-grade cotton / giclée · album upgrade only | 395.00 | 39500 | `WWL-UPGRADE-FINEART-395` | `prod________` | `price________` |
| `WWL-MINI-PARENT-345` | Parent Mini Keepsake 6×6 | Paired mini album for parent and senior | 345.00 | 34500 | `WWL-MINI-PARENT-345` | `prod________` | `price________` |
| `WWL-SPREAD-1-55` | Additional album spread (each) | Beyond 15 included spreads | 55.00 | 5500 | `WWL-SPREAD-1-55` | `prod________` | `price________` |
| `WWL-SPREAD-5-255` | Additional spreads · 5-pack | Bundle pricing for 5 extra spreads | 255.00 | 25500 | `WWL-SPREAD-5-255` | `prod________` | `price________` |

**Spread lines on `/order`:** Client may send composite SKUs like `WWL-SPREAD-1-55×3` or `WWL-SPREAD-5-255×2` with **`amount_cents`** = computed total (55×n or bundle math). Server uses `price_data` today — v2 can map to `price_…` × `quantity`.

### Tier E · Cover preference ($0 · metadata only)

| Internal SKU | Display name | Description | Retail USD | `unit_amount` | `metadata.wwluxe_sku` | Product ID | Price ID |
|--------------|--------------|-------------|------------:|--------------:|------------------------|------------|----------|
| `WWL-COVER-LEATHER-0` | Luxe leather cover | Default heirloom cover · no charge | 0.00 | 0 | `WWL-COVER-LEATHER-0` | optional | optional |
| `WWL-COVER-LINEN-0` | Natural linen cover | Alternate cover · same retail tier | 0.00 | 0 | `WWL-COVER-LINEN-0` | optional | optional |

Stripe Checkout may omit $0 lines; persist cover on **session metadata** `wwluxe_cover` (already in `keepsake-checkout.js`).

### Internal only · not customer Stripe catalog

Sample / swatch PO labels (`WWL-SAMPLE-*`) — **do not** create in Stripe customer catalog. Use operator pro vendor cart.

---

## 2 · Stripe MCP execution playbook

Run with **Stripe MCP** on the new account (test mode first, then live).

### 2.1 Create products (repeat per row in §1)

For each SKU:

1. **Product** `name` = Display name · `description` = Description column · `metadata`: use `productMetadata()` from `lib/mmi/stripe-metadata.mjs` (`mmi_*` + legacy `wwluxe_sku`). See `docs/MMI_STRIPE_METADATA_SCHEMA.md`.
2. **Price** one-time USD · `unit_amount` = cents column · same `metadata.wwluxe_sku` on price (optional but helps reporting).
3. Paste IDs back into §1 table · commit IDs to operator sheet (not necessarily git if using env-only price IDs later).

### 2.2 Estate deposit (Xano)

- Point Xano “create checkout session” to **`price________`** for `WWL-DEPOSIT-710` (or dynamic `price_data` mirroring 71000 until IDs wired).
- Session metadata minimum: `booking_id`, `parent_email`, `senior_name`, `experience_week`, `wwluxe_sku: WWL-DEPOSIT-710`.
- Success URL: WeWeb confirmation route · Cancel: home with modal closed.

### 2.3 Keepsakes (Vercel API)

**Today:** `api/wwluxe/keepsake-checkout.js` builds **`price_data`** from POST body; labels from `lib/wwluxe/stripe-catalog.mjs` (`SKU_LABELS`).

**v2 (recommended after MCP):** Replace `price_data` with fixed `price: 'price_…'` + `quantity: 1` when `body.lines[].sku` matches canon — reject unknown SKUs and amount drift.

**Session metadata (already implemented):**

| Key | Source |
|-----|--------|
| `wwluxe_source` | `order_web` · `chalet_kiosk` |
| `wwluxe_email` | contact.email |
| `wwluxe_name` | contact.name |
| `wwluxe_senior` | contact.senior |
| `wwluxe_ref` | booking / kiosk ref |
| `wwluxe_cover` | `leather` \| `linen` |
| `wwluxe_mode` | `preorder` \| `addons` |
| `wwluxe_terms` | e.g. `2026-09-09` |

**PaymentIntent description:** `Whispering Woods Luxe · Chalet reservation for {senior}`.

### 2.4 Webhooks

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Xano: mark booking deposit paid · store `session_id` · trigger confirmation email |
| `checkout.session.completed` | Keepsake: create order row · notify studio · attach `client_reference_id` = `wwluxe_ref` |
| `payment_intent.succeeded` | Backup handler if session webhook missed |
| `charge.refunded` | Operator playbook · deposit policy = non-refundable except operator override |

Endpoint: Xano webhook URL + Vercel optional forwarder — **one** signing secret per endpoint.

### 2.5 Smoke tests (24h gate)

```text
[ ] Stripe test: WWL-DEPOSIT-710 → success → metadata on PI
[ ] WeWeb preview: modal → TOS → Stripe test card → confirmation
[ ] POST /api/wwluxe/keepsake-checkout (curl) → checkout_url → pay → return ?checkout=success
[ ] Chalet bundle only: one line WWL-CHALET-PREORDER-1420 @ 142000 cents
[ ] À la carte: album + digital + frame = 177500 cents (three lines or one combined — match UI)
[ ] Add-ons on top of Chalet: retouch + fineart + mini + spreads → amounts match wwluxe-order.js
[ ] Webhook received in Xano test log
[ ] Live keys only after all test green
```

**Sample curl (keepsake):** see `XANO_STRIPE_WIRE.md` § keepsake body.

---

## 3 · Code sync after IDs exist

| File | Action |
|------|--------|
| `lib/wwluxe/stripe-catalog.mjs` | Extend `SKU_LABELS` for spread SKUs if validating descriptions server-side |
| `api/wwluxe/keepsake-checkout.js` | Optional: `STRIPE_PRICE_MAP` env JSON `{ "WWL-ALBUM-HEIRLOOM-955": "price_..." }` |
| Xano | Replace placeholder workflow URLs · attach price IDs |
| `public/.../wwluxe-order.js` | **No change** required if API stays `price_data` — SKUs already canon |

**Pricing audit (git):**

```bash
node scripts/wwluxe-audit-pricing.mjs
```

---

## 4 · 24-hour launch stack (no canvas times)

| # | Task | Doc |
|---|------|-----|
| 1 | DNS path split apex | `GIT_STATIC_HOSTING.md` |
| 2 | `STRIPE_SECRET_KEY` + `WWLUXE_SITE_ORIGIN` on Vercel | this doc §0 |
| 3 | Xano live + 3 workflow URLs | `XANO_STRIPE_WIRE.md` |
| 4 | Stripe catalog §1 complete | this doc |
| 5 | WeWeb publish home | Operator |
| 6 | E2E smoke | `LAUNCH_PUNCHOUT.md` |
| 7 | Images (P1) | `ON_ESTATE_SHOT_BRIEF.md` |

**Not on marketing site:** T1–T8 triad clocks, valet batch times, photog lunch rotation — keep in `OCT_18_RUN_OF_DAY.md` / crew SOWs only.

---

## 5 · MCP agent checklist (Stripe connected)

When user says “Stripe MCP is live”:

1. List existing products — dedupe by `metadata.wwluxe_sku`.
2. Create missing products/prices from §1 (skip `WWL-SAMPLE-*`).
3. Export filled §1 table to operator (paste into this file or `STRIPE_IDS_LIVE.md` — git optional).
4. Run test checkout for deposit + Chalet.
5. Do **not** edit WeWeb via MCP unless user re-enables writes.

---

## 6 · Quick reference · cents

| SKU | cents |
|-----|------:|
| WWL-DEPOSIT-710 | 71000 |
| WWL-ESTATE-BALANCE-710 | 71000 |
| WWL-ESTATE-1420 | 142000 |
| WWL-CHALET-PREORDER-1420 | 142000 |
| WWL-ALBUM-HEIRLOOM-955 | 95500 |
| WWL-DIGITAL-395 | 39500 |
| WWL-FRAME-425 | 42500 |
| WWL-RETOUCH-7-195 | 19500 |
| WWL-UPGRADE-FINEART-395 | 39500 |
| WWL-MINI-PARENT-345 | 34500 |
| WWL-SPREAD-1-55 | 5500 |
| WWL-SPREAD-5-255 | 25500 |

À la carte stack **177500** · Chalet **142000** · thank-you delta **35500** (marketing only).
