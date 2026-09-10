# WWLuxe · Launch punchout (snuff list)

**Updated:** 2026-09-10  
**Project:** WhisperingWoodsLUXE · `1b8147da-2812-42a5-946e-f83c582d3071`  
**Canvas MCP:** trial ended on reads (`searchPages`) · operator **pricing + testimonials green** · Stripe: `STRIPE_MCP_SWARM.md`

---

## Locked operator decisions

| Decision | Canon |
|----------|--------|
| **Photographers** | Lead **$1,000** + 2 zone shooters × **$800** = **$2,600/day** · up to 24 seniors · ~20 min/zone · capture only |
| **Post** | In-house (not in photog day rate) |
| **Day support** | HMU + logistics on Producer · catered **crew** lunch/snacks/mocktails · Chalet mom grazing in $1,420 base |
| **Photog pay** | **50% T-7 days** · **50% after drive + files clear** · see `PHOTOGRAPHER_DAY_RATE_SOW.md` |
| **Base ticket** | **$1,420** · **$710** non-refundable deposit · **24 spots** |
| **Crew model** | 3 zone photographers · Mom Milestone on schedule · **live view = Z2 bay → projector room** (Z1/Z3 untethered) |

---

## Keepsake pricing canon (shipped in git · paste to canvas)

| SKU | Retail | Notes |
|-----|-------:|-------|
| Heirloom Album 10×10 · 15 spreads | **$955** | Handcrafted flush-mount |
| Digital Gallery Upgrade | **$395** | High-margin service |
| Framed Print 20×24 | **$425** | Separate archival vendor |
| Extra Retouches (7 max) | **$195** | Labor |
| Fine Art upgrade | **+$395** | Album only |
| Parent Mini 6×6 | **$345** | |
| Extra spreads | **$55 · 5/$255** | Beyond 15 included |
| **À la carte stack** | **$1,775** | |
| **Chalet Collection pre-order** | **$1,420** | $1,775 − **$355** thank-you |

**Wholesale logged:** album ~**$410** · see `REDTREE_BOM_AUDIT.md`.

### Canvas copy deltas

- Album price · **$955**
- Digital price · **$395**
- Chalet compare · ~~**$1,775**~~ **$1,420**
- Chalet desc / footer / FAQ A7 · `$1,775` à la carte · `$355 thank-you`
- Grep kill: `$895` · `$350` · `$1,670` · `$250 thank-you` · vendor lab names

---

## Swarm audit · DONE (git / docs)

| Item | Status |
|------|--------|
| `/order` tablet flow · git static | ✅ `public/whispering-woods-luxe/order/` |
| `/terms` + `/privacypolicy` | ✅ git static + Vercel rewrites |
| Pricing canon docs ($955/$395/$1,775/$355) | ✅ 2026-09-09 pass |
| BOM wholesale ~$410 logged | ✅ `REDTREE_BOM_AUDIT.md` |
| Stripe keepsake API stub | ✅ `api/wwluxe/keepsake-checkout.js` |
| Xano/Stripe wire guide | ✅ `XANO_STRIPE_WIRE.md` |
| Pricing audit script | ✅ `scripts/wwluxe-audit-pricing.mjs` |
| Estate-not-studio positioning | Done (canvas) |
| Em dash purge | Done |
| Favicon | Done |
| `wf_booking_form_submit` | **Untouched** (law) |

---

## Swarm audit · REMAINING

### P0 · Launch blockers

| # | Item | Owner | Verify |
|---|------|-------|--------|
| 1 | **Xano** installed + connected | Operator | Integrations panel |
| 2 | Replace placeholder URLs in 3 workflows | Operator | `XANO_STRIPE_WIRE.md` |
| 3 | **Stripe** live `checkout_url` estate book | Operator | Test mode |
| 4 | **STRIPE_SECRET_KEY** on Vercel for `/order` API | Operator | POST keepsake-checkout |
| 5 | **DNS path split** · `/order` `/terms` `/privacypolicy` on apex | Operator | `GIT_STATIC_HOSTING.md` |
| 6 | **WeWeb Publish** + DNS apex | Operator | Preview 200 |
| 7 | **E2E smoke** form → TOS → Stripe | Operator | WeWeb preview |
| 8 | **Canvas pricing grep** · zero stale prices | Operator | **Done** (2026-09-10) |
| 8b | **Fake testimonials** hidden | Operator | **Done** (2026-09-10) |
| 9 | **Stripe catalog** (all SKUs + IDs) | Agent + Operator | `STRIPE_MCP_SWARM.md` |
| 10 | **Experience weeks** in modal + JSON-LD | Operator | After photog lock · **no Oct 18 times on site** |

### P1 · Before ad spend

| # | Item |
|---|------|
| 11 | Estate photos · backdrop grid |
| 12 | Chalet section images |
| 13 | Chalet pre-order Stripe line in Xano |
| 14 | Waitlist + confirmation emails |
| 15 | Photographer contracts |
| 16 | **MHU + Chalet ambience** · Pi 5 loop · CRT (salon) + LCD/CRT (Chalet) · offline playlists | `MHU_CHALET_AMBIENCE_OPS.md` |

---

## Paste targets

| Task | Doc |
|------|-----|
| Canvas keepsake sync | `MCP_CHALET_COPY_APPLY.md` · `WEWEB_SWARM_CHANGES.md` |
| Full audit | `MCP_AUDIT_READONLY_2026-09-10.md` · `STRIPE_MCP_SWARM.md` |
| Order + legal hosting | `GIT_STATIC_HOSTING.md` |
| Payment | `PAYMENT_FLOW.md` · `XANO_STRIPE_WIRE.md` |
| SKUs | `ORDER_SKU_CATALOG.md` |

**Do not touch:** `wf_booking_form_submit`
