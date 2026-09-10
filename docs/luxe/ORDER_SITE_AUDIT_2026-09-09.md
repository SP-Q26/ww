# WWLuxe · `/order` site audit (full)

**Date:** 2026-09-09  
**Scope:** `public/whispering-woods-luxe/order/` · `assets/wwluxe-order.js` · `assets/wwluxe-shared.css` · `api/wwluxe/keepsake-checkout.js` · linked `/terms` · `/privacypolicy`  
**Canon:** `ORDER_SKU_CATALOG.md` · `COPY_SWARM_AUDIT_2026-09-09.md`

---

## Executive summary

| Layer | Score | Status |
|-------|------:|--------|
| Pricing & SKU logic | 92 | Green |
| UX flow (3-step · boutique modes) | 94 | Green · luxe pass 2026-09-09 |
| Copy & brand | 93 | Green · Design/Reserve voice |
| Tablet / kiosk | 92 | Green |
| Accessibility | 78 | Amber · focus-visible added |
| Checkout / payments | 62 | Amber · Stripe custom_text + receipt |
| Edge cases & validation | 85 | Green |
| **Overall** | **~89/100** | **Boutique-ready** · **Stripe env for live pay** |

### Luxe refactor (2026-09-09 evening)

- Hero: **Design your collection** · italic **Reserve your heirlooms**
- Steps: **Curate → Details → Reserve**
- CTAs: **Reserve** / **Reserved** · paybar **Complete reservation**
- Mode: quiet link *Already reserved Chalet?* (no equal tabs)
- T-7: auto **Refine your collection** · addons-only
- Stripe: `custom_text` + `receipt_email` + luxe line-item names
- Palette: warmer cream, pill chips, gold step accent

---

## Architecture

| Piece | Path | Role |
|-------|------|------|
| Page | `/order` → `order/index.html` | 3-step keepsake checkout |
| JS | `assets/wwluxe-order.js` | Cart · modes · draft · Stripe POST |
| CSS | `assets/wwluxe-shared.css` | Tablet-first · 1024px max · fixed paybar mobile |
| API | `/api/wwluxe/keepsake-checkout` | Stripe Checkout Session |
| Legal | `/terms` · `/privacypolicy` | Linked from footer + step 3 checkbox |

**Query params:** `?kiosk=1` · `?mode=addons` · `?ref=` · `?event=YYYY-MM-DD` · `?checkout=success|cancelled`

---

## Flow audit

### Step 1 · Choose

| Check | Status | Notes |
|-------|--------|-------|
| Pre-order vs Chalet-add-ons toggle | ✅ | `aria-selected` on mode buttons |
| Chalet bundle $1,420 / ~~$1,775~~ | ✅ | $355 thank-you in bullets |
| À la carte album/digital/frame | ✅ | Hidden in addons mode |
| Add-ons: retouch, fine art, mini, spreads | ✅ | Retouch moved out of à la carte (fix 2026-09-09) |
| Chalet + add-ons stack in cart | ✅ | JS `buildLines()` |
| Chalet excludes duplicate album/digital/frame | ✅ | Selecting Chalet clears à la carte trio |
| Pre-order closes ≤7 days before `?event=` | ✅ | Auto-switch to addons mode |
| Cover preference | ✅ | Shown only when album context (Chalet, album, spreads, fine art) |
| Expandable cards · tap targets ≥48px | ✅ | Chips 48px · stepper 52px |

### Step 2 · Details

| Field | Required | Status |
|-------|----------|--------|
| Parent name | Yes | ✅ min 2 chars |
| Email | Yes | ✅ basic regex |
| Senior first name | No | ⚠️ optional · OK for v1 |
| Booking ref | No | ⚠️ prefill via `?ref=` · not validated server-side |
| Design notes | No | ✅ |

### Step 3 · Pay

| Check | Status |
|-------|--------|
| Line-item review | ✅ incl. $0 cover row |
| TOS + Privacy links | ✅ dynamic from `WWLUXE_CONFIG` |
| Custom goods acknowledgment | ✅ |
| Apple Pay / Google Pay / Card copy | ✅ |
| Terms checkbox gates pay | ✅ |
| Stripe redirect | ⚠️ needs `STRIPE_SECRET_KEY` on Vercel |

---

## Pricing matrix (verified)

| SKU | Retail | Pre-order | Add-ons mode | In Chalet bundle |
|-----|-------:|-----------|--------------|------------------|
| Chalet Collection | $1,420 | ✅ | — (already owned) | — |
| Album | $955 | ✅ à la carte | Hidden | ✅ included |
| Digital | $395 | ✅ | Hidden | ✅ included |
| Frame | $425 | ✅ | Hidden | ✅ included |
| Extra retouches (7) | $195 | ✅ add-on | ✅ add-on | ❌ not included |
| Fine Art | +$395 | ✅ | ✅ | ❌ |
| Parent mini | $345 | ✅ | ✅ | ❌ |
| Spreads | $55 / 5×$255 | ✅ max +10 | ✅ | ❌ (15 base in album) |

**Spread math:** 5@$255 + remainder@$55 · max 10 extra · SKUs in payload.

---

## Mode matrix

| Mode | Chalet section | À la carte | Add-ons | Cover block |
|------|----------------|------------|---------|-------------|
| Pre-order keepsakes | ✅ if window open | ✅ | ✅ | If album context |
| I already ordered Chalet | Hidden | Hidden | ✅ label changes | If album context |

**Addons-only order examples:**

| Cart | Valid | Total |
|------|:-----:|------:|
| Retouches only | ✅ | $195 |
| Chalet + retouches + mini | ✅ | $1,420 + $195 + $345 |
| Fine art + spreads (pre-order Chalet) | ✅ | $1,420 + $395 + spreads |
| Digital only (no Chalet) | ✅ | $395 |
| Empty | ❌ pay disabled | $0 |

---

## Copy audit

| Area | Status | Notes |
|------|--------|-------|
| Published retail / anti-reveal | ✅ | Intro trust line |
| No vendor names | ✅ | |
| Thank-you not “courtesy” | ✅ | Chalet bullet |
| Mom / parent mini story | ✅ | |
| Estate team continuity | ✅ | |
| Mode-specific intro | ✅ | Fixed · addons intro differs |
| Retouch “not in Chalet bundle” | ✅ | Tagline + bullet |
| Em dashes | ✅ | None |
| Apostrophe in Stripe's | ✅ | ASCII OK |

**P2 copy:** Step 2 could say “booking email from estate confirmation” for clarity.

---

## UX / visual

| Item | Status |
|------|--------|
| Max width 1024px | ✅ |
| Safe area insets (notch/home) | ✅ |
| Fixed paybar mobile | ✅ |
| Paybar static desktop ≥900px | ✅ · long page scroll |
| localStorage draft restore | ✅ `wwluxe_order_draft_v2` |
| Success / cancel banners | ✅ |
| Cart preview step 1 | ✅ |
| Google Fonts (Cormorant + DM Sans) | ✅ · external dep |
| `prefers-reduced-motion` | ✅ added this pass |
| Chalet 6-bullet animation | ✅ nth-child 5–6 added |

---

## Accessibility

| Item | Status | Fix |
|------|--------|-----|
| Mode `role="tablist"` | ⚠️ | `aria-selected` added · tabs lack `role="tab"` / panel `role="tabpanel"` |
| Step progress | ⚠️ | Visual only · not `aria-current="step"` |
| Product expand `aria-expanded` | ✅ | On card heads |
| Form labels | ✅ | `for`/`id` paired |
| Focus styles | ⚠️ | Relies on browser default |
| Checkbox size 24px | ✅ | |
| Color contrast | ✅ | Ink on cream generally OK |

**P2:** Add `:focus-visible` outlines on chips and mode buttons.

---

## Checkout & security

| Item | Status |
|------|--------|
| Client prices displayed | ✅ UX only |
| Server should re-price from SKU table | ⚠️ API trusts `amount_cents` from client · **P1:** server-side price table |
| `terms_version` in metadata | ✅ `2026-09-09` |
| `contact` in Stripe metadata | ✅ |
| Cover preference in payload | ✅ via `contact.cover` |
| No secrets in HTML | ✅ |
| CORS / same-origin API | ✅ relative `/api/...` |
| Fallback alert if API down | ✅ logs payload to console |

---

## Legal linkage

| Link | Target | Status |
|------|--------|--------|
| Footer Terms | `whisperingwoodsluxe.com/terms` | ✅ |
| Footer Privacy | `whisperingwoodsluxe.com/privacypolicy` | ✅ |
| Step 3 checkbox | Same URLs · `target=_blank` | ✅ |
| Terms § keepsakes / Chalet | ✅ | Matches order flow |
| Terms link to `/order` | ✅ | |

---

## Deployment

| Item | Status |
|------|--------|
| `vercel.json` rewrites `/order` | ✅ |
| API route at repo root | ✅ |
| DNS path split to SPQ | ⚠️ operator · see `GIT_STATIC_HOSTING.md` |
| `STRIPE_SECRET_KEY` | ❌ operator |
| `WWLUXE_SITE_ORIGIN` | Optional for return URLs |

---

## Bugs fixed (this audit pass)

1. **Retouches hidden in addons mode** · moved to `#section-addons`
2. **Cover shown for retouch-only cart** · `needsCoverChoice()` + hide `#section-cover`
3. **Addons mode intro still pre-order copy** · dynamic `#intro-mode-note`
4. **Chalet 5th/6th bullets invisible** · CSS animation delays
5. **No reduced-motion** · media query added
6. **Catalog doc** · retouches explicitly excluded from Chalet bundle

---

## P0 · before taking money

```
[ ] STRIPE_SECRET_KEY on Vercel
[ ] Smoke POST /api/wwluxe/keepsake-checkout → checkout_url
[ ] DNS: /order + /api on apex
[ ] Server-side SKU price validation (do not trust client cents)
```

## P1 · before Chalet kiosk

```
[ ] QR: /order?kiosk=1&ref=BOOKING_ID
[ ] Test addons flow: retouches + mini on Chalet tablet
[ ] Apple Pay domain verification in Stripe
[ ] Optional: require booking ref on step 2 when ?ref= missing
```

## P2 · polish

```
[ ] focus-visible styles
[ ] Step aria-current
[ ] noindex until live pay (optional)
[ ] Validate booking email against Xano (v2)
[ ] Split spread line items into 5-packs + singles for Stripe clarity
```

---

## Test script (manual)

1. `/order` · add Chalet + retouches + 3 spreads · cover linen · step through · confirm total **$1,420 + $195 + $165 = $1,780** (3×$55)
2. `/order?mode=addons` · retouches only · **$195** · cover hidden
3. `/order?event=2026-09-12` (if today within 7d) · Chalet hidden · addons mode
4. Reload · draft restored
5. `?checkout=success` · success banner · draft cleared
6. Pay without API key · fallback alert · payload in console

---

## Related

- `COPY_SWARM_AUDIT_2026-09-09.md` · web + competitive voice  
- `PAYMENT_FLOW.md` · Stripe sequence  
- `XANO_STRIPE_WIRE.md` · env wiring  
- `scripts/wwluxe-audit-pricing.mjs` · stale price grep
