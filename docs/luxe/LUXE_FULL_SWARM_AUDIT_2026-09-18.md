# Whispering Woods Luxe · full swarm audit (2026-09-18)

**Production URL:** https://whisperingwoodsluxe.com  
**Git `main`:** `9900956` — heirloom checkout parity + favicon mark  
**Prior audit:** `LUXE_VERCEL_SWARM_AUDIT_2026-09-18.md` (pre-checkout fix)

---

## Executive summary

| Lane | Verdict | Notes |
|------|---------|--------|
| **Vercel / HTTP** | **GREEN** | Agent smoke: `/`, `/heirloom`, `/booked`, `/terms`, static assets **200** on apex |
| **Heirloom Checkout** | **GREEN** | Operator confirmed Stripe opens from `/heirloom`; API **400** on empty `lines` (not 404/500) |
| **Estate modal → Xano book** | **GREEN** | Operator confirmed; paste ↔ `wwl-booking-checkout.js` **in sync**; `terms_version` **2026-09-18** |
| **Heirloom UI (git)** | **GREEN** | Live CSS shows **48px** product icon column (deployed) |
| **Favicon** | **GREEN** | Tree medallion PNG on `/heirloom/assets/favicon.png` **200** |
| **T−10 balance (`07`)** | **YELLOW** | Creates Checkout with `automatic_tax` but **no** `billing_address_collection` (modal `04` has it) — fix before cron emails |
| **Balance + Chalet ops** | **YELLOW** | Manual / `07` Checkout links + `/heirloom` last call — no Resend automation yet |
| **Stripe Tax / IL** | **YELLOW** | Registrations + IL `performance_location` on deposit/balance products (Dashboard CPA lane) |
| **WeWeb export drift** | **YELLOW** | Hosted WeWeb still **`_wwcv=35`** vs git **37+**; Head bridge **v27** in export (v28 in docs) |
| **Git export hygiene** | **YELLOW** | `index.html` favicon `?_wwcv=38` vs `manifest.json` still **37**; untracked `index.html` / `terms/` / `privacypolicy/` in working tree |
| **Webhook / Xano** | **GREEN** | Operator: webhook updates slot; `WWL_PUBLIC_ORIGIN` set; `07` pasted; promos off |
| **WW Events cross-promo** | **READY** | Paste map: `docs/events/WWLUXE_ANNOUNCEMENT_BAR_FOOTER.md` |

**Launch posture:** **Go for organic** on one URL (apex) with estate book + heirloom pay. **Before T−10 cron:** patch `07` to match `04` guest tax params.

---

## 1 · Vercel & routes (agent 2026-09-18)

```text
SMOKE_PROD=1 PROD_HOST=https://whisperingwoodsluxe.com \
  bash sites/luxe/scripts/smoke-luxe-swarm.sh
→ SMOKE OK (all paths 200/307; POST keepsake-checkout → 400)
```

| Path | Role |
|------|------|
| `/` | WeWeb marketing + booking modal |
| `/heirloom` | Chalet / heirloom Checkout (git slice) |
| `/booked` | Post–Stripe return |
| `/terms`, `/privacypolicy` | Static legal v1.2 (git) |
| `/api/wwluxe/keepsake-checkout` | Heirloom Stripe session |

**Build chain:** `postbuild` includes `inject-luxe-critical-boot` + `copy-luxe-slice-into-dist` — **OK** in git.

---

## 2 · Payments

### Estate (modal)

| Step | Owner | Status |
|------|--------|--------|
| `POST wwl/book` | Xano `04` | Live prices + `billing_address_collection` + no `customer_update` |
| Webhook | Xano `06` | **VERIFY** live endpoint + `WWL_STRIPE_WEBHOOK_SECRET` |
| `WWL_PUBLIC_ORIGIN` | Xano env | **VERIFY** = `https://whisperingwoodsluxe.com` |
| Promo codes | Xano + Vercel | **Unset** `WWLUXE_ALLOW_PROMOTION_CODES` for launch |

### Heirloom (`/heirloom`)

| Step | Owner | Status |
|------|--------|--------|
| Session create | Vercel `keepsake-checkout.js` | **GREEN** — catalog `price_` + guest tax law (`stripe-guest-checkout.mjs`) |
| Secret | Vercel | `STRIPE_SECRET_KEY` / `WWLUXE_STRIPE_SECRET_KEY` (live MMI) |
| Client | `wwluxe-order.js` | Spread lines decomposed; Stripe `message` in alert |
| Docs | `HEIRLOOM_CHECKOUT_AUDIT.md` | Canon |

### T−10 remainder ($710)

| Step | Owner | Status |
|------|--------|--------|
| `POST wwl/schedule/t10` | Xano `07` | Returns `checkout_url` per due slot |
| Email | Manual / future Resend | Copy in ops thread (balance link + `/heirloom` Chalet last call) |
| **Gap** | `07` paste | Add `billing_address_collection=required` + `shipping_address_collection[allowed_countries][0]=US` like `04` |

### Chalet last call

- **URL:** https://whisperingwoodsluxe.com/heirloom  
- **SKU:** `WWL-CHALET-PREORDER-1420` · live `price_1UGdaG02CkQBMWtCLhT2JAWv`  
- Not on balance Checkout unless intentionally combined.

---

## 3 · Stripe catalog (live)

Canon: `docs/luxe/STRIPE_IDS_LIVE.md` · code: `WWLUXE_STRIPE_IDS_LIVE` in `lib/mmi/wwluxe-stripe-products.mjs`.

| Check | Action |
|-------|--------|
| 12 SKUs + prices | Matched in git |
| Webhook | Dashboard → `checkout.session.completed` → Xano URL |
| Tax head office | Dashboard → Tax (modal + heirloom use automatic tax when enabled) |
| IL performance | Products `WWL-DEPOSIT-710`, `WWL-ESTATE-BALANCE-710` |
| Promos | Deactivated in Dashboard (per prior ops) |

---

## 4 · Legal & consent

| Surface | `terms_version` | Served from |
|---------|-----------------|-------------|
| Booking modal | `2026-09-18` | WeWeb + `wwl-booking-checkout.js` |
| Heirloom | `2026-09-18` | `wwluxe-order.js` |
| Static legal | v1.2 | `sites/luxe/.../terms` + `privacypolicy` |

WeWeb canvas should match **2026-09-18** on next publish if modal paste updated.

---

## 5 · WeWeb vs git

| Signal | Git / Vercel | WeWeb host |
|--------|----------------|------------|
| `_wwcv` | **37–38** (favicon bump) | **35** (stale) |
| Head bridge | v27 in export; v28 in `WEWEB_PROJECT_HEAD_BRIDGE_v26.html` | Re-bake on publish |
| Booking JS | `sites/.../wwl-booking-checkout.js` | Re-paste from `docs/luxe/paste/` if canvas drift |

**Rule:** Share **apex** for ads, not WeWeb production subdomain, unless debugging.

---

## 6 · Organic launch (48h)

| # | Action |
|---|--------|
| 1 | One link: **whisperingwoodsluxe.com** in bio + Stories |
| 2 | WW Events announcement bar → Luxe (copy drafted) |
| 3 | Pin best Reel; estate + optional `/heirloom` Chalet last call |
| 4 | Smoke: one **deposit** book + one **heirloom** line (done) |
| 5 | Studio manual booking email within ~1 business day (`/booked` sets expectation) |

---

## 7 · P0 / P1 backlog (ordered)

| P | Item | Owner |
|---|------|--------|
| **P1** | Patch **`07`** guest tax params (= `04`) | Xano re-paste |
| **P1** | Confirm **webhook `06`** + `wwl_payment_log` on live pay | Xano + Stripe |
| **P1** | `WWL_PUBLIC_ORIGIN` + live `WWL_STRIPE_SECRET_KEY` | Xano env |
| **P2** | Resend: booking confirm + T−10 balance email | Xano tail |
| **P2** | Stripe Tax registrations + IL performance on products | Dashboard + CPA |
| **P2** | WeWeb publish → **main** with v37+ export + Head v28 | Operator |
| **P2** | Pause duplicate Vercel **`wwluxe`** project if still connected | Vercel |
| **P3** | Sync untracked root `index.html` / legal shells into export commit | Git |
| **P3** | Hero critical boot + slower tree fade on production | Deploy inject + canvas |

---

## 8 · Sign-off checklist

- [x] Apex HTTP smoke (agent)
- [x] Heirloom Checkout (operator)
- [x] Estate book Checkout (operator)
- [x] Live webhook marks slot `deposit_paid` / balance complete (operator)
- [ ] Xano roster `sales_open` + 24 slots seeded
- [x] `07` pasted (billing address + US shipping in git paste)
- [ ] WW Events bar + footer live (WeWeb Events project)
- [x] Promo env vars off
- [x] Heirloom Checkout + Stripe branding (operator)

---

## Commands (operator)

```bash
cd ~/ww
git pull origin main
SMOKE_PROD=1 PROD_HOST=https://whisperingwoodsluxe.com \
  bash sites/luxe/scripts/smoke-luxe-swarm.sh
bash scripts/audit-luxe-deploy-sweep.sh   # local export stamps
```

**Heirloom API smoke (creates real Checkout session — use test email):**

```bash
curl -sS -X POST "https://whisperingwoodsluxe.com/api/wwluxe/keepsake-checkout" \
  -H "Content-Type: application/json" \
  -d '{"lines":[{"sku":"WWL-SPREAD-1-55","amount_cents":5500}],"contact":{"email":"you+test@whisperingwoodsluxe.com","name":"Test"}}'
```

Expect JSON with `checkout_url` and `session_id`.
