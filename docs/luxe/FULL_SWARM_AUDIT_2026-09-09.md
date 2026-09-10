# WWLuxe · Full swarm audit (every aspect)

**Date:** 2026-09-09  
**Product:** The Estate Senior Experience  
**Domain:** [whisperingwoodsluxe.com](https://whisperingwoodsluxe.com)  
**WeWeb project:** `1b8147da-2812-42a5-946e-f83c582d3071` · Home `991a8992-afed-4eaf-b77e-13a81380ad12`  
**Audit method:** Git canon + operator WeWeb pass (unverified live) + Sep 5 MCP audit baseline  
**Canvas MCP:** trial ended Sep 10 · treat canvas as **verify in editor**  
**Latest full pass:** `SWARM_AUDIT_COMPLETE_2026-09-10.md`

---

## Executive summary

| Layer | Score | Status |
|-------|------:|--------|
| Funnel UX & positioning | 88 | Green · structure sound; post-pass spot-check needed |
| Copy & pricing consistency | 78 | Amber · git docs synced · **canvas verify** still required |
| Conversion additions | 72 | Amber · disqualifier 4×4 + customize block · see `COPY_SWARM_AUDIT_2026-09-09.md` |
| Booking modal & workflows | 85 | Green structure · **Red** until Xano URLs live |
| Payments (estate + keepsakes) | 55 | Amber · keepsake API stub in git · estate Xano still Red |
| Git static (`/order`, legal) | 91 | Green · luxe Reserve UX · Chalet greys à la carte |
| MHU / Chalet ambience | 78 | Amber · ops doc + BOM · hardware TBD |
| Legal & compliance | 82 | Green git pages · link WeWeb modal to canon URLs |
| SEO & metadata | 78 | Amber · no `startDate` until weeks locked; OG image |
| Creative / photography assets | 35 | Red · 14 zone/chalet files not in repo |
| Ops (crew, Chalet, Mom Milestone) | 75 | Amber · photogs messaged; contracts/weeks TBD |
| DNS / hosting architecture | 25 | Red · path split not live |
| Documentation hygiene | 88 | Green · 2026-09-09 doc pass + `wwluxe-audit-pricing.mjs` |
| **Overall launch readiness** | **~72/100** | **Not sell-ready** until P0 estate backend + DNS |

**Verdict:** Marketing funnel and git keepsake station are in strong shape. You cannot take money at scale until Xano + Stripe estate book works, DNS routes git paths, and pricing is verified一致 on canvas vs `/order`.

---

## 1 · Business model (locked)

| Item | Canon |
|------|--------|
| Estate ticket | **$1,420** · **$710** non-refundable deposit · balance T-10 days |
| Capacity | **24 spots** · sell-out target 14 days |
| Audience | Moms (wallet) + seniors (dream) · North Shore / suburban IL |
| Positioning | Private **estate** day · not strip-mall studio · wedding-grade production |
| Photo crew | 2 × $1,000 + 1 station × $700 = **$2,700/day** · post in-house |
| Day ops | HMU · catered crew lunch + assistant · Chalet mom grazing in base |
| Zero-dropoff | Single booking modal · no outbound links · no Calendly |

### P&L (sell-out · 24 spots)

| Line | Amount |
|------|-------:|
| Gross estate | $34,080 |
| Photo crew | −$2,700 |
| HMU + lunch + assistant (budget) | −$2,000 to −$3,500 |
| Stripe (~3%) | −~$1,000 |
| **Contribution pre-retouch** | ~$27k–$28k |
| Chalet attach 40% × ~$700 margin | +~$6,700 potential |

Crew cost **fits** at sell-out + Chalet attach ≥ ~30%.

---

## 2 · Pricing & SKU canon

### Target retail (ship this)

| SKU | Retail | Notes |
|-----|-------:|-------|
| Estate experience | $1,420 | Unchanged |
| Heirloom album 10×10 · 15 spreads | **$955** | No vendor names on site |
| Digital gallery | **$395** | |
| Frame 20×24 | $425 | Non-lab vendor |
| Extra retouches (7) | $195 | |
| **À la carte stack** | **$1,775** | $955 + $395 + $425 |
| **Chalet pre-order** | **$1,420** | ~~$1,775~~ · **$355 thank-you** |
| Fine Art upgrade | +$395 | Not in bundle |
| Parent mini 6×6 | $345 | |
| Extra spread | $55 each | **15 included** in album |
| Extra spreads 5-pack | **$255** | Max +10 spreads (25 total) |

**Source of truth for checkout:** `ORDER_SKU_CATALOG.md` + `public/whispering-woods-luxe/order/`

### Drift risk (fix or grep)

| Location | Status |
|----------|--------|
| Git `/order` | ✅ $955 / $395 / $1,775 / $355 / $255 pack |
| `KEEPSAKES_MOM_WALK_CANON.md` | ✅ $955 / $395 / $1,775 / $355 |
| `REDTREE_BOM_AUDIT.md` | ✅ Wholesale ~$410 logged |
| `LAUNCH_PUNCHOUT.md` | ✅ Canon table updated |
| `WEWEB_AI_*.md` paste payloads | ✅ 2026-09-09 pass |
| `editor-oppo-brief.html` | ⚠️ Operator refresh if printed |
| WeWeb canvas (post-pass) | ⚠️ **Operator verify** · grep `895`, `350`, `1670`, `250 thank`, `RedTree` |

**Action:** One grep pass in WeWeb editor + refresh stale git docs when canvas confirmed.

---

## 3 · WeWeb funnel (canvas)

### Section map (verified Sep 5 · re-check after pass)

| # | Section | UID | Pass |
|---|---------|-----|------|
| 1 | Hero | `68072bf6…` | ✓ |
| 2 | Experience | `c1decbbc…` | ✓ |
| 3 | Backdrops | `612ce5bc…` | ✓ · photos pending |
| 4 | Chalet | `992fdc23…` | ✓ · photos pending |
| 5 | Pricing | `75a60e34…` | ⚠️ price sync |
| 6 | FAQ | `764a2540…` | ⚠️ count 10→11 if upgrade FAQ added |
| 7 | Final CTA | `53096ef1…` | ✓ |
| 8 | Footer | `26cf5117…` | ⚠️ link `/order` |
| — | Sticky nav + counter | `7fcc75b8…` | ✓ · test 375px clip |

### Conversion additions (`CONVERSION_ADDITIONS_SPEC.md`)

| Item | Priority | Status |
|------|----------|--------|
| ADD-1 Hero geo badge | P1 | Verify on canvas |
| ADD-2 Mom social proof | P1 | **P0: Ajay pass shipped fake quotes · hide until real** |
| ADD-3 Typical estate day itinerary | P0 | Operator pass claimed |
| ADD-4 Pricing deliverables mock | P2 | Not built |
| ADD-5 Disqualifier 4×4 | P0 | Verify · 4th bullet tailored experience |
| Customize your heirloom block | P1 | Verify under pricing |
| FAQ: album upgrades + parent mini | P1 | Verify |

### Booking modal (do not break)

| Check | Status |
|-------|--------|
| `wf_booking_form_submit` untouched | Law |
| Booking vs waitlist mutually exclusive | ✓ Sep 5 |
| $710 deposit copy paired with non-refundable | ✓ |
| TOS gate before Stripe | ✓ structure · verify links |
| 5 CTAs open same modal | ✓ |
| Fields: senior, mom email, phone, week | ✓ |
| Week placeholder until photog lock | Expected |

### Workflows (backend scaffold)

| Workflow | Status |
|----------|--------|
| Roster / spots fetch | Placeholder Xano URL |
| Book + Stripe redirect | Placeholder |
| Waitlist | Placeholder |
| Confirmation email | Not verified |

---

## 4 · Git-owned static (SPQ)

| Path | File | Status |
|------|------|--------|
| `/order` | `public/whispering-woods-luxe/order/index.html` | ✅ Tablet 1024px · expand cards · modes |
| `/terms` | `public/whispering-woods-luxe/terms/index.html` | ✅ v1.1 · keepsakes §11 |
| `/privacypolicy` | `public/whispering-woods-luxe/privacypolicy/index.html` | ✅ v1.1 |
| Assets | `wwluxe-shared.css` · `wwluxe-order.js` | ✅ |
| Vercel rewrites | `vercel.json` | ✅ on SPQ host only |

### `/order` features (v2)

- Boutique copy: **Design your collection** · **Reserve** · quiet addons link
- Chalet selected → **grey out** album/digital/frame (included)
- Chalet bundle hides **≤7 days** before `?event=YYYY-MM-DD`
- Spreads: **15 included · $55 · 5/$255** · stepper after select
- Cover: leather vs linen copy + Chalet consult note
- Legal links → `whisperingwoodsluxe.com/terms` + `/privacypolicy`
- Stripe: POST checkout API (stub until Xano live)

### Hosting gap

WeWeb owns `/` (marketing). Git owns `/order`, `/terms`, `/privacypolicy`.

**Required:** Cloudflare path routes or subdomain before production links work on apex domain.

See `GIT_STATIC_HOSTING.md` · `LEGAL_LINKS_CANON.md`

---

## 5 · Payments

### Estate deposit (WeWeb modal)

```
Form → TOS checkbox → Xano book → Stripe Checkout $710 → webhook → confirm
```

| Step | Status |
|------|--------|
| Xano installed | ❌ P0 |
| Real API URLs in 3 workflows | ❌ P0 |
| Stripe integration | ❌ P0 |
| Webhook marks deposit paid | ❌ P0 |
| E2E smoke in WeWeb preview | ❌ P0 |

### Keepsakes (`/order`)

```
Select SKUs → contact → TOS → POST /keepsake-checkout → Stripe Checkout → webhook
```

| Step | Status |
|------|--------|
| Stripe Price IDs per SKU | ❌ |
| Server-side re-price (no client trust) | ❌ |
| `WWL-SPREAD-5-255` | ✅ in git only |
| Apple Pay domain verification | ❌ |
| Chalet kiosk QR tested on iPhone | ❌ |

**Tap to pay:** Only via **Stripe Checkout redirect** — not HTML card fields. See `PAYMENT_FLOW.md`.

---

## 6 · Legal & compliance

| Document | Canonical URL | Git |
|----------|---------------|-----|
| Terms | `https://whisperingwoodsluxe.com/terms` | ✅ |
| Privacy | `https://whisperingwoodsluxe.com/privacypolicy` | ✅ |

| Check | Status |
|-------|--------|
| $710 non-refundable in terms | ✅ |
| Keepsake custom goods / final sale | ✅ git terms §11 |
| Model release | ✅ |
| Illinois law / McHenry arbitration | ✅ |
| Stripe + consent logging | ✅ privacy §5 |
| WeWeb modal links match canon | ⚠️ verify |
| Legacy `docs/.../legal/*.html` stubs | Stale · use git pages |

**Do not** point WWLuxe at SPQ `/privacy` or `/tos`.

---

## 7 · SEO & metadata

| Item | Status |
|------|--------|
| Title / meta description | ✓ Sep 5 |
| OG tags | ✓ · image may be Unsplash |
| JSON-LD Event | ✓ · **no `startDate`** until weeks firm |
| Favicon | ✓ operator |
| Em dash purge | ✓ claimed · re-run audit script |
| Geo keywords (Barrington, etc.) | ADD-1 optional |
| `prerender: false` | ✓ correct for live counter |

**P2:** Estate OG WebP 1200×630 · add `startDate` after photog lock.

---

## 8 · Creative & assets

### Backdrops (6 zones × 2 states)

| Spec | 1200×1500 WebP each · 12 files |
| Status | **Not in git** · filenames in `BACKDROPS_ZONE_IMAGE_SPEC.md` |

### Chalet (2 states)

| Spec | 1600×1200 WebP · 2 files |
| Status | **Not in git** · `CHALET_MOM_IMAGE_SPEC.md` |

### Optional

| Item | Status |
|------|--------|
| Backdrop chip row under grid | P2 copy only |
| Mom milestone section images | Optional 1200×1500 |
| Pricing phone mock (ADD-4) | P2 |
| Swatch samples (operator PO) | `ORDER_SKU_CATALOG.md` internal SKUs |

---

## 9 · Operations & delivery

| Item | Status |
|------|--------|
| Photographer lock (2 ace + 1 station) | In progress |
| Experience weeks in modal/hero/JSON-LD | After Tuesday+ |
| Mom Milestone (~15 min, included) | Canon in `KEEPSAKES_MOM_WALK_CANON.md` |
| Rain or shine + indoor backup | Terms + FAQ |
| Chalet lounge / grazing | In $1,420 · not separate SKU |
| Album production via pro lab | Internal BOM only · no customer vendor name |
| Frame 20×24 | Separate framer · not lab |
| Sample swatch order | Operator · leather/linen + Fine Art |

---

## 10 · Competitive & messaging

| Theme | Status |
|-------|--------|
| Estate-not-studio | ✓ |
| Published retail · one thank-you only | ⚠️ copy must say $355 not $250 |
| No bargain / no estate-day discount promise | ✓ |
| Disqualifier 4×4 incl. tailored experience | Verify canvas |
| No RedTree / vendor names customer-facing | Grep canvas |
| `editor-oppo-brief.html` | Internal sales tool · stale prices |

---

## 11 · Tooling & MCP

| Tool | Status |
|------|--------|
| Cursor integrated WeWeb MCP | `ping` OK · canvas writes blocked trial on workspace `6b964f33…` |
| WeWeb in-editor AI | Primary canvas path |
| Shell `mcp-remote` | Forbidden |
| `scripts/wwluxe-audit-em-dashes.mjs` | Available |
| Git export / Vercel bridge | SPQ separate from WeWeb publish |

---

## 12 · Master checklist

### P0 · Cannot sell (block launch)

- [ ] Xano connected · placeholder URLs replaced
- [ ] Stripe live · `checkout_url` on book
- [ ] E2E: modal → TOS → pay → confirmation
- [ ] WeWeb publish + preview 200
- [ ] DNS `whisperingwoodsluxe.com`
- [ ] DNS path routes: `/order` `/terms` `/privacypolicy` → git static
- [ ] WeWeb modal legal links → canon URLs
- [ ] Canvas pricing grep: zero hits on 895, 350, 1670, 250 thank, RedTree
- [ ] Experience weeks after photog lock

### P1 · Before ad spend

- [ ] Keepsake prices on canvas match `/order` ($955 / $395 / $1,775 / $355)
- [ ] Pricing footer → `/order`
- [ ] Disqualifier 4×4 + customize heirloom + FAQ upgrade
- [ ] Stripe keepsake Price IDs + `POST /keepsake-checkout` + webhook
- [ ] Apple Pay domain verified
- [ ] Backdrop 12 + Chalet 2 images uploaded
- [x] RedTree wholesale logged · `REDTREE_BOM_AUDIT.md` (~$410 album)
- [ ] Photographer contracts signed
- [ ] Waitlist + confirmation emails fire
- [ ] Chalet QR: `/order?kiosk=1&ref=` on confirmation email

### P2 · Polish

- [ ] OG estate image
- [ ] ADD-4 pricing mock
- [ ] Flip counter 375px clip test
- [ ] Backdrop chip row
- [ ] Prune legacy modals in editor
- [ ] Refresh stale docs (`KEEPSAKES_*`, paste MDs) to $1,775 stack
- [ ] `/order` gate by booking email (v2)

### P3 · Intentionally deferred

- Mom social proof strip (needs 3 real quotes)
- Estate-day discount in copy
- Mom toast as marketed SKU
- Cursor MCP canvas (until WeWeb enables workspace)
- Vendor names on customer copy

---

## 13 · Risk register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Xano/Stripe not wired | Cannot book | P0 this week |
| Price drift canvas vs `/order` | Chargeback / trust | Grep + single canon doc |
| DNS without path split | `/order` 404 on apex | Cloudflare rules before QR print |
| Apple Pay on shared iPad | Wallet friction | QR to mom's phone |
| Chalet pre-order after T-7 | Wrong SKU sold | `?event=` on QR + server check |
| MCP trial | Slow canvas iteration | In-editor AI |
| No backdrop photos | Weak conversion | Shoot before ads |
| Doc stale paste prompts | AI reverts old prices | Archive or update paste MDs |

---

## 14 · Document map (what to trust)

| Trust first | Use for |
|-------------|---------|
| **This file** | Full launch picture |
| `ORDER_SKU_CATALOG.md` | SKUs + checkout |
| `PAYMENT_FLOW.md` | Stripe + tap to pay |
| `LEGAL_LINKS_CANON.md` | URL canon |
| `GIT_STATIC_HOSTING.md` | Deploy paths |
| `LAUNCH_PUNCHOUT.md` | Operator week (partially stale on DONE prices) |
| `WEWEB_SWARM_CHANGES.md` | Canvas paste after pass |
| `WHISPERING_WOODS_LUXE_AUDIT.md` | Sep 5 baseline (modal UIDs) |

**Deprecate for copy paste until updated:** `WEWEB_AI_FULL_SWARM.md`, `MCP_CHALET_COPY_APPLY.md`, `KEEPSAKES_MOM_WALK_CANON.md` (pricing section only).

---

## 15 · Sign-off gates

| Gate | Owner | When |
|------|-------|------|
| **Gate A** · Backend green | Operator | Xano + Stripe E2E in preview |
| **Gate B** · Price一致 | Operator | Canvas grep + `/order` match |
| **Gate C** · DNS + paths | Operator | Apex + git routes live |
| **Gate D** · Creative | Operator | 14 photos on canvas |
| **Gate E** · Ads | Operator | A–C green + 1 test booking |

**Do not run paid traffic until Gates A + B + C.**

---

*End of full swarm audit · 2026-09-09*
