# WWLuxe · Complete swarm audit (every aspect)

**Date:** 2026-09-10  
**Scope:** WeWeb Home (operator passes) · git `/order` · legal · payments · ops · MHU/Chalet · docs  
**Canon:** $1,420 estate · $710 deposit · $955 / $395 / $425 · stack **$1,775** · Chalet **$355 thank-you**  
**Canvas:** MCP trial ended · **cannot verify live** · grep in WeWeb editor required  
**Desktop note:** Operator reported **1100×1066** layout tree · target inner grid **1200px** max · spot-check alignment

---

## Executive scorecard

| Layer | Score | Status |
|-------|------:|--------|
| **Home funnel (WeWeb)** | 82 | Amber · strong structure · **verify pricing + testimonials** |
| **Git `/order` (keepsakes)** | 91 | Green · luxe pass · Chalet greys à la carte |
| **Payments** | 52 | Red/Amber · estate Xano · keepsake Stripe env |
| **Legal** | 84 | Green git · modal links verify |
| **Copy / pricing consistency** | 74 | Amber · canvas grep P0 |
| **Conversion architecture** | 88 | Green · zero-dropoff · modal · disqualifier |
| **SEO / metadata** | 80 | Amber · no `startDate` until weeks lock |
| **Creative assets** | 32 | Red · zone + Chalet WebPs not in repo |
| **Estate ops (MHU/Chalet)** | 78 | Amber · ambience doc + BOM · not built yet |
| **DNS / hosting split** | 25 | Red · `/order` on apex |
| **Documentation** | 90 | Green |
| **Overall launch readiness** | **~73/100** | **Sell estate after P0 backend + canvas grep** |

---

## P0 · Fix before ad spend or live traffic

| # | Issue | Where | Action |
|---|--------|-------|--------|
| 1 | **Fake testimonial names** | WeWeb ADD-2 | **Done** — section hidden (operator 2026-09-10) |
| 2 | **Stale keepsake prices on canvas** | Pricing upsells | **Done** — operator green 2026-09-10 · MCP re-grep when trial restored |
| 3 | **Xano placeholder URLs** | 3 workflows | `XANO_STRIPE_WIRE.md` |
| 4 | **Stripe estate $710 live** | Booking modal | E2E preview smoke |
| 5 | **DNS path split** | Apex domain | `/order` `/terms` `/privacypolicy` `/api` → SPQ |
| 6 | **`STRIPE_SECRET_KEY`** | Vercel | Keepsake checkout |
| 7 | **Canvas grep** | Home | Zero `RedTree`, em dashes `—`, "courtesy" (use **thank-you**) |

---

## 1 · WeWeb Home (canvas) · operator pass audit

**Source:** Prompts 1–6 + alignment + em-dash + pricing + conversion additions (Ajay BM transcript). **Not MCP-verified.**

### Funnel order (target vs claimed)

| # | Section | Claimed | Verify |
|---|---------|---------|--------|
| 1 | Hero + geo badge | ✅ | Geo under subtitle · not in H1 |
| 2 | Experience | ✅ | Sub: strip-mall / wedding-grade production |
| 3 | Backdrops | ✅ | 10+ zones copy · 6 grid cards · photos pending |
| 4 | Mom social proof | ⚠️ **SHIPPED** | **Should be hidden** until real quotes |
| 5 | Typical estate day | ✅ | Sample flow disclaimer · times 12PM–4PM |
| 6 | Chalet | ✅ | Mom VIP · live feed · mocktails |
| 7 | Pricing + customize heirloom | ✅ claimed | Grep prices |
| 8 | Disqualifier 4×4 | ✅ | 4th bullet tailored experience |
| 9 | FAQ | ✅ | Chalet pre-order · studio vs estate |
| 10 | Final CTA + footer | ✅ | `/order` link on pricing footer |
| — | Sticky mobile nav | ✅ | FAQ scroll + modal · 375px clip test |

### Design system (canvas)

| Token | Target | Notes |
|-------|--------|-------|
| Cream | `#FDFBF7` | Background alternation |
| Charcoal | `#2C2C2C` | Text |
| Gold | `#C6A15B` | CTA · dividers |
| Terracotta | `#C27A59` | Urgency pills |
| Sage | `#7B8E7A` | Geo badge · accents |
| Headlines | Playfair Display | |
| Body | Inter | |
| Max content width | **1200px** | Hero full-bleed |

**Layout flag (1100×1066):** If desktop sections look off-center, re-check inner wrappers: `margin: 0 auto`, `width: 100%`, no `margin-left: 0` orphans. Experience / Backdrops / Chalet / FAQ headers **760px** centered · FAQ body **860px**.

### Animations (Prompt 6)

| Effect | Status |
|--------|--------|
| Section fade-up on scroll | Claimed ✅ |
| Card stagger | Claimed ✅ |
| Pricing CTA pulse | Claimed ✅ · watch for “pressure” vs luxe — OK if subtle |
| Card hover lift (desktop) | Claimed ✅ |
| Modal slide-up | Claimed ✅ |
| `scroll-behavior: smooth` | Claimed ✅ |

### Booking modal

| Check | Status |
|-------|--------|
| Calendly removed | ✅ |
| $710 deposit + non-refundable paired | ✅ |
| TOS gate before pay | ✅ verify |
| Waitlist when spots = 0 | ✅ |
| `wf_booking_form_submit` untouched | Law |
| Week dropdown TBD copy | ✅ |
| 5 CTAs → same modal | ✅ |

### Copy / brand drift risks (from pass history)

| Risk | Detail |
|------|--------|
| **Fake social proof** | P0 remove/hide |
| **“Courtesy”** | Replace with **thank-you** ($355) everywhere |
| **$1,670 / $250** | Legacy stack · must be **$1,775 / $355** |
| **Vendor names** | RedTree removed in late pass · re-grep |
| **Superlatives in quotes** | “Best in Illinois” cut per spec |
| **Itinerary typo** | Early pass had `1:30 AM` · confirm **PM** on canvas |
| **FOMO tone** | 🔥 pills OK for spots · pair with luxe body copy |

### WeWeb verify checklist (15 min in editor)

```
[ ] Grep: 1670, 895, 350, 695, 495, 275, 295, 175, RedTree, courtesy, —
[ ] Pricing: Chalet $1,420 · ~~$1,775~~ · $355 thank-you
[ ] Album $955 · Digital $395 · Frame $425 · Retouch $195
[ ] Customize heirloom: Fine Art +$395 · mini $345 · spreads $55/5×$255
[ ] Social proof: hidden OR real quotes with permission
[ ] Footer / pricing link: whisperingwoodsluxe.com/order
[ ] Desktop 1440 + 1100 width: sections centered
[ ] Mobile 375: sticky nav not clipping · hero text above video
[ ] Lighthouse mobile ≥70
```

---

## 2 · Git `/order` (keepsake station)

**Audit:** `ORDER_SITE_AUDIT_2026-09-09.md` · **~89/100** after luxe pass.

| Item | Status |
|------|--------|
| Design / Reserve voice | ✅ |
| Quiet link vs mode tabs | ✅ |
| Chalet reserves → **grey out** album/digital/frame | ✅ (2026-09-10) |
| Spread math 15 + $55 / 5×$255 | ✅ |
| Addons mode + T-7 window | ✅ |
| Stripe `custom_text` + receipt email | ✅ API |
| Server-side price validation | ❌ P0 |
| Fonts Cormorant + DM Sans | ✅ (differs from Home — OK for boutique kiosk) |

**Kiosk:** `/order?kiosk=1&ref=` · Chalet tablet beside king-bed display.

---

## 3 · Payments

| Flow | Path | Status |
|------|------|--------|
| Estate deposit | WeWeb modal → Xano → Stripe $710 | ❌ placeholders |
| Keepsakes | `/order` → `/api/wwluxe/keepsake-checkout` | ⚠️ needs env |
| Apple Pay | Stripe dashboard + domain | ❌ |

---

## 4 · Legal

| Doc | URL | Status |
|-----|-----|--------|
| Terms | `/terms` git | ✅ keepsakes § |
| Privacy | `/privacypolicy` git | ✅ |
| Modal TOS links | WeWeb | ⚠️ verify canon URLs |

---

## 5 · MHU + Chalet ambience (ops)

**Doc:** `MHU_CHALET_AMBIENCE_OPS.md` · **Punchout #15**

| Zone | Screen | Playlist |
|------|--------|----------|
| MHU salon | 13–14″ CRT · side mount | Senior glam · MV-heavy · snippets rare |
| Chalet lounge | LCD or CRT · Side A wall | Mom · 1–3 min MTV snippets · interviews |

**Chalet floor plan:** fireplace wrap · 6–8 seating · kitchen · bath · king bed = collection display · live view **separate monitor** Side B · ambience TV Side A.

**Pi 5 ×2** owned · offline library · 3.5mm BT transmitter.

---

## 6 · Creative assets (red)

| Asset set | Files | Status |
|-----------|------:|--------|
| Backdrop zones ×2 states | 12 WebP | Not in git |
| Chalet hero ×2 | 2 WebP | Not in git |
| ADD-4 pricing mock | 1–3 visuals | Not built |
| Estate OG 1200×630 | 1 | P2 |

---

## 7 · SEO

| Item | Status |
|------|--------|
| Title · Harvard · 24 spots | Claimed ✅ |
| `areaServed` suburbs | ADD-1 ✅ |
| JSON-LD Event | No `startDate` until weeks locked |
| `prerender: false` | Correct for live counter |

---

## 8 · Docs hygiene

| Script | Result |
|--------|--------|
| `node scripts/wwluxe-audit-pricing.mjs` | Fails on `COPY_SWARM_AUDIT` legacy examples only (audit doc mentions old prices intentionally) |

**Master docs:** `FULL_SWARM_AUDIT_2026-09-09.md` · `LAUNCH_PUNCHOUT.md` · `KEEPSAKES_MOM_WALK_CANON.md`

---

## 9 · What separates good from great (your read)

| Good | Great |
|------|-------|
| Estate + Chalet + published pricing | **MHU/Chalet ambience** · curated snippets · fireplace layout |
| Mom not in car | King bed as workspace nod · live view + grazing |
| `/order` boutique flow | Low-pressure Reserve language |

---

## 10 · Recommended next actions (priority order)

1. **Hide fake testimonials** on canvas (or replace with permitted quotes).  
2. **Canvas pricing grep** (15 min).  
3. **Xano + Stripe estate** E2E.  
4. **DNS** path split for `/order`.  
5. **Backdrop + Chalet WebPs** into WeWeb media.  
6. **Pi playlists** encode + estate-day test.  
7. **ADD-4** deliverables mock when honest assets exist.  
8. **Server-side** keepsake price table on API.

---

## Related files

| Topic | Path |
|-------|------|
| Order deep-dive | `ORDER_SITE_AUDIT_2026-09-09.md` |
| Copy voice | `COPY_SWARM_AUDIT_2026-09-09.md` |
| Conversion spec | `CONVERSION_ADDITIONS_SPEC.md` |
| Ambience | `MHU_CHALET_AMBIENCE_OPS.md` |
| Launch gates | `LAUNCH_PUNCHOUT.md` |
