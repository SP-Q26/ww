# WWLuxe · Stripe sandbox setup (operator)

**Date:** 2026-09-15  
**Canon:** `STRIPE_MCP_SWARM.md` · `docs/MMI_STRIPE_METADATA_SCHEMA.md` · `lib/mmi/stripe-metadata.mjs`  
**Stripe MCP target:** **`MMI: A Space Odyssey`** (WWLuxe sandbox) — **not** Innsegall / Isles LLC.

| Account | `stripe_context` | Use |
|---------|------------------|-----|
| **MMI: A Space Odyssey LLC sandbox** | `acct_1UG5yw0biIaEI74i` | **All** `WWL-*` products · estate deposit · keepsakes |
| The Isles LLC sandbox | `acct_1UCtB2F5SRiYwzwF` | **Innsegall only** — **never** create WWLuxe SKUs here |

**Hard law:** Do not put Whispering Woods Luxe catalog on the Innsegall Stripe account.

### Connect the right account in Cursor (after MCP refresh)

1. In chat, ask the agent to run Stripe **`manage_stripe_accounts`** → open the URL → **add** the **MMI: A Space Odyssey** test account (and remove Isles LLC from this session if you only want WWLuxe work).
2. Say **done** → agent runs **`list_available_accounts_or_orgs`** and must see **MMI: A Space Odyssey** (not only Isles LLC).
3. All `PostProducts` / catalog work uses that account’s `stripe_context` with `livemode: false`.

Until step 2 shows MMI, **do not** create products — the session may still point at Innsegall.

### Troubleshooting · Stripe MCP account picker empty (operator FYI · 2026-09-15)

If **`manage_stripe_accounts`** / `access.stripe.com` opens but the **permissions / account list never populates**, and there is **no usable control inside Cursor Settings** or the **Stripe Dashboard** to fix it:

1. **Sign out of Cursor completely**, then sign back in.
2. Re-open the Stripe MCP link (or reconnect the Stripe plugin).
3. The account picker should then load so you can **drop Isles LLC** and **add MMI: A Space Odyssey**.

*(Feedback for Cursor / Stripe MCP UX — not documented in-product as of this date.)*

---

## Do you need sample product photos?

**No — not for sandbox or first live charges.**

| Phase | Images |
|-------|--------|
| **Test / launch** | One **house mark** per product (or shared) is enough — same pattern as Innsegall `innsegall.com/stripe/*.png`. Use `https://whisperingwoodsluxe.com/heirloom/assets/favicon.svg` until square PNGs ship. |
| **Later (conversion)** | Lifestyle or product mockups on Checkout — optional polish, not a payment blocker. |

**Recommended before live:** add `sites/luxe/public/stripe/wwluxe-mark.png` (512×512) and per-tier icons if you want parity with Innsegall (`estate.png`, `chalet.png`, `album.png`). Deploy on Vercel, then set each Stripe Product `images[]` to `https://whisperingwoodsluxe.com/stripe/…` (add rewrite if you serve from `/stripe/` at apex).

---

## Account branding (Dashboard — manual)

Checkout receipts and **default statement descriptor** follow the **Stripe business profile**, not product names.

| Setting | Target for WWLuxe |
|---------|-------------------|
| Business name | Whispering Woods Luxe (or legal entity name) |
| Business URL | `https://whisperingwoodsluxe.com` |
| Support email | `bookings@whisperingwoodsluxe.com` |
| Statement descriptor | `WW LUXE` (≤22 chars, appears on cards) |
| Brand icon / logo | Upload in **Settings → Branding** (HTTPS asset from site) |

**Important:** The connected MCP sandbox still shows **Innsegall**-oriented profile (`innsegall.com`, `INNSEGALL.COM` descriptor). Estate deposits charged on this account may show **Innsegall** on statements until you either update the profile **or** create a **dedicated WWLuxe Stripe account** (recommended for clean customer-facing billing).

---

## Catalog (create in **Test mode**)

Create **one Product + default Price** per row. Metadata on product: `wwluxe_sku` = internal SKU.

| `wwluxe_sku` | `unit_amount` (¢) | Display name |
|--------------|------------------:|--------------|
| `WWL-ESTATE-1420` | 142000 | The Estate Senior Experience |
| `WWL-DEPOSIT-710` | 71000 | Estate reservation deposit |
| `WWL-ESTATE-BALANCE-710` | 71000 | Estate experience balance |
| `WWL-CHALET-PREORDER-1420` | 142000 | Chalet Collection · Estate Reservation |
| `WWL-ALBUM-HEIRLOOM-955` | 95500 | Heirloom Album 10×10 |
| `WWL-DIGITAL-395` | 39500 | Digital Gallery |
| `WWL-FRAME-425` | 42500 | Archival Framed Print 20×24 |
| `WWL-RETOUCH-7-195` | 19500 | Extra Retouches · 7 images |
| `WWL-UPGRADE-FINEART-395` | 39500 | Fine Art Paper Upgrade |
| `WWL-MINI-PARENT-345` | 34500 | Parent Mini Keepsake 6×6 |
| `WWL-SPREAD-1-55` | 5500 | Additional album spread (each) |
| `WWL-SPREAD-5-255` | 25500 | Additional spreads · 5-pack |

Skip `$0` cover SKUs in Stripe (`WWL-COVER-*`) — cover stays in session metadata (`keepsake-checkout.js`).

After MCP create, paste `prod_…` / `price_…` into `STRIPE_MCP_SWARM.md` §1.

---

## Match “current billing” (two surfaces)

| Flow | How it works today | Sandbox wiring |
|------|-------------------|----------------|
| **Estate $710 deposit** | WeWeb modal → **Xano** → Stripe Checkout Session | Xano test keys · Session line uses **`price_…` for `WWL-DEPOSIT-710`** (or `price_data` 71000 until ID wired) |
| **Keepsakes `/heirloom`** | `POST /api/wwluxe/keepsake-checkout` | Vercel `STRIPE_SECRET_KEY` or `WWLUXE_STRIPE_SECRET_KEY` · builds **`price_data`** from body + `SKU_LABELS` — **works without** catalog IDs; IDs optional for v2 anti-tamper |

**Env (Vercel `luxe` project):**

```text
STRIPE_SECRET_KEY=sk_test_…
STRIPE_WEBHOOK_SECRET=whsec_…   # when testing completions
WWLUXE_SITE_ORIGIN=https://whisperingwoodsluxe.com
```

Return URLs use `WWLUXE_SITE_ORIGIN` so success/cancel land on production hostname even from preview API.

**Webhook:** `checkout.session.completed` → Xano (deposit) + optional Vercel forwarder for keepsake orders.

---

## Smoke (after catalog + env)

1. Stripe Dashboard → pay **WWL-DEPOSIT-710** with test card `4242…`.
2. WeWeb preview: booking modal → Stripe test → confirmation.
3. `curl` keepsake checkout (see `XANO_STRIPE_WIRE.md`) → open `checkout_url` → pay → `?checkout=success` on heirloom route.
4. Confirm webhook in Xano test log.

---

## MCP agent

1. `GetProducts` — skip if `metadata.wwluxe_sku` already exists.
2. `PostProducts` + `default_price_data` per table above; shared `images[]` until PNG pack exists.
3. Do **not** delete Innsegall products on shared account.
4. Export IDs to this file or `STRIPE_IDS_TEST.md` (no secrets in git).
