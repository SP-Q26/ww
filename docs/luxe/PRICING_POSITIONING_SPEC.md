# WWLuxe · Pricing & Estate Positioning Spec (AI / WeWeb MCP)

**Project:** WhisperingWoodsLUXE · `1b8147da-2812-42a5-946e-f83c582d3071`  
**Page:** Home · `991a8992-afed-4eaf-b77e-13a81380ad12` · route `/home`  
**Parent venue:** [whisperingwoodsevents.com](https://whisperingwoodsevents.com) · 40 acres · three ponds · Knot 5.0 · Harvard, IL  
**Audit date:** 2026-09-07  
**Canvas MCP:** `project-0-SPQ-weweb-ai` · **ping first** (re-verify all UIDs after reconnect)

**Do not break:** zero-dropoff · single booking modal · TOS gate before checkout · deposit always paired with non-refundable

---

## Positioning canon (approved)

Use this language across Hero, Experience, Backdrops, Chalet, Pricing, FAQ, disqualifier · **not** “studio session” framing.

| Pillar | Copy kernel |
|--------|-------------|
| **Private estate** | Same private grounds as a top wedding venue · not a rented park slot or strip-mall studio |
| **Portrait photographers’ dream location** | Woods, ponds, reflections · the #1 backdrop portrait photographers chase; you **own** it |
| **Wedding-grade production** | Same estate team and standard as Whispering Woods Events |
| **Seniors rule the estate** | One senior experience day · **24 spots only** · not a conveyor belt |
| **Venue proof** | 40 acres · three ponds · Chalet between North & East ponds · [whisperingwoodsevents.com](https://whisperingwoodsevents.com) |

**Forbidden positioning:** “photo studio,” “our studio,” “strip mall,” “mini session,” outbound link to Knot/Google in funnel (zero-dropoff). Venue name text-only OK; no clickable external links in funnel body.

---

## Pricing audit · canvas (last verified) vs target

**Source:** `docs/WHISPERING_WOODS_LUXE_AUDIT.md` (2026-09-05 MCP). Re-run `getPageElementsByUid` on Pricing section after MCP reconnect.

### Base package

| Field | Canvas (current) | Target | Action |
|-------|------------------|--------|--------|
| Retail | **$1,420** | **$1,420** | Keep |
| Deposit | **$710** (50% non-refundable) | Same | Keep |
| Spots | 24 | 24 | Keep |
| Positioning line | Generic “all-inclusive” | **Estate day** copy (see below) | Update subtitle + checkmarks intro |

### Keepsakes · market retail (luxe · one shop)

**Strategy:** Retail at **market** (what top North Shore studios charge separately). **Chalet Collection** = smart bundle · same team, estate → heirloom, warm one-stop. **$355 pre-order thank-you** = only published courtesy. **Not** phantom stack math on the card.

| SKU | **Market retail** |
|-----|-------------------|
| The Chalet Collection | **$1,420 pre-order** · **$355 thank-you** off **$1,775** market stack |
| 10×10 Leather Heirloom Album (15 spreads) | **$955** |
| Digital Gallery Upgrade | **$395** |
| Premium Framed Wall Print (20×24) | **$425** |
| Extra Retouches (7 max) | **$195** |
| Fine Art upgrade | **+$395** |
| Parent mini 6×6 | **$345** |
| Extra spreads | **$55 each · 5 for $255** |
| **À la carte stack (internal)** | **$1,775** · strikethrough on Chalet card only |

Full copy + Mom Milestone: `KEEPSAKES_MOM_WALK_CANON.md`

### Bundle policy (operator canon)

**The only published discount** is committing to the **Chalet Collection pre-order** at **$1,420** · a **$355 thank-you** off **$1,775** market à la carte · at booking or before balance is due (10 days prior).

| Window | Chalet Collection | À la carte keepsakes | Base $1,420 |
|--------|-------------------|----------------------|-------------|
| **Pre-order** (deposit checkout or before balance, 10 days prior) | **$1,420** ($355 thank-you off $1,775) · **only discount we advertise** | Full retail OK | Full price |
| **Estate day / after** | **Not sold** · no bundle | Full retail only | Full price |

**Estate day · operator discretion (never in funnel copy):** You may choose to adjust pricing day-of via Stripe. Canvas, email, and FAQ must **not** promise estate-day discounts.

**Pre-order (honest):** Market stack **$1,775** − **$355 thank-you** = **$1,420** Chalet Collection. Strikethrough **$1,775** on card is real retail, not a phantom anchor.

**Luxe voice:** Published prices. Pre-order thank-you is the only advertised courtesy. Not a bargain bin · see disqualifier / optional pricing footer in `KEEPSAKES_MOM_WALK_CANON.md`.

### Hospitality (not in copy)

**Mom toast** · personal gift from you to moms of 2026 seniors on estate day. **Not** part of ticket price, admission, or package inclusions. **Do not** put “champagne toast,” “complimentary toast,” or similar in Hero, Pricing checkmarks, FAQ, or SEO. Chalet copy may keep mocktails/grazing as **production hospitality** already in the experience; the toast is a separate surprise from you.


### Margin sanity (market retail + backend deals)

| SKU | Retail | Notes |
|-----|--------|--------|
| Album $955 | Market band | ~$410 wholesale logged |
| Frame $425 | Market band | Fixed 20×24 moulding |
| Digital $395 | High GM | Bundle anchor |
| Retouches $195 / 7 | Editorial cap | Yearbook editor on team |
| Pre-order bundle $1,420 | Smart bundle | $355 thank-you off $1,775 stack |

---

## Known element UIDs (verify on reconnect)

| Resource | UID |
|----------|-----|
| Pricing section | `75a60e34-fade-48ca-b55f-3f519ed6993d` |
| Hero section | `68072bf6-8fbe-4292-acd2-a776d68bc1fe` |
| Hero H1 | `6e2a5723-1b9b-4715-b637-f6c5dbdcf952` |
| Experience section | `c1decbbc-0fd8-4fb8-848c-3b8bf3f03a84` |
| Backdrops section | `612ce5bc-58e2-4291-a7ca-e8dc2328bde4` |
| Chalet section | `992fdc23-13a6-469a-9688-59e3a9d83f44` |
| FAQ section | `764a2540-26d1-426e-aae9-77f443757b84` |
| Base pricing CTA | `45c5d112-d4d6-4913-9b32-9ed0eaf4a8a5` |
| Upsell cluster (names TBD) | `3fa5bef5…` `dca6d96f…` `6072b9a5…` `bc7f3f40…` `cc0f9dea…` `8afe6c24…` |

**MCP step 0:** `getPageSemantic` pageId Home → map Pricing children → `getPageElementsByUid` → confirm which UID is each upsell card before `editElement`.

---

## Copy blocks (paste-ready)

### Pricing section · eyebrow + H2 + sub (replace generic)

**Eyebrow:** `INVESTMENT`

**H2:** `One estate day. Everything included.`

**Sub:**
```
A private 40-acre Harvard estate · the same grounds couples book for weddings at Whispering Woods Events. 
Woods, ponds, and reflection shots portrait photographers travel for · reserved for seniors, one day only, 24 spots. 
Not a strip-mall studio. Wedding-grade production. Your senior rules the estate.
```

### Base card · $1,420

**Title:** `The Estate Senior Experience`

**Price line:** `$1,420` · `All-inclusive`

**Intro under price:**
```
Professional HMU, guided session across estate backdrops, Mom VIP time in the Chalet, 
and a curated digital gallery · one fixed price. No surprise reveal bill.
```

**Deposit line (keep paired):** `$710 (50% Non-Refundable Deposit)` · Balance due 10 days prior

### Pre-order bundle card

**Title:** `The Chalet Collection`

**Badge:** `PRE-ORDER EXCLUSIVE`

**Price:** `$1,420` · strikethrough **`$1,775`** · `$355 thank-you for ordering early`

**Bullets:**
```
• 10×10 Leather Heirloom Album (15 spreads) · $955 retail
• Digital Gallery Upgrade · $395 retail
• Premium Framed Wall Print (20×24) · $425 retail
• Pre-order bundle $1,420 ($1,775 à la carte minus $355 early thank-you)
• One shop · same team from estate day to heirloom
• Not available on estate day · market retail à la carte only after
```

### À la carte cards

| Card | Price line | Subcopy |
|------|------------|---------|
| Heirloom Album | `$955` | `10×10 leather-bound album · 15 spreads · 6–8 week delivery after selection` |
| Framed Print | `$425` | `20×24 archival print · premium frame · ready to hang` |
| Digital Upgrade | `$395` | `Extended private gallery · full-resolution downloads · print release` |
| Extra Retouches | `$195` | `Seven additional fully retouched images` |

### Pricing footer disclaimer (new `ww-text`)

```
Pre-order keepsake pricing is available when you book your estate spot or before your balance is due (10 days prior). 
On estate day and after, keepsakes are à la carte at full retail · no bundle discount.
```

---

## Section copy updates (estate positioning)

### Hero · subtitle (under H1, not in H1)

```
Private estate senior portraits on the same grounds as a top Illinois wedding venue · 
40 acres, ponds, and woodland light. One day only · 24 spots.
```

### Experience · section sub (one paragraph addition)

```
This is not a strip-mall studio hour. It's a wedding-grade estate production · 
the same private property hosts Whispering Woods wedding weekends. 
Seniors get the run of the grounds for one exclusive experience day.
```

### Backdrops · section sub

```
Portrait photographers chase locations like this. You get them private: meadow, willows, wooded aisles, three ponds, barns, walled gardens, stone paths, iron fences, specimen trees, and more across 40 acres · proven in hundreds of wedding galleries. Six favorites on the grid; your photographer curates the day.
```

**Headline (canvas):** `10+ Editorial Zones. One Private Estate.` · not “Six Distinct…”

**Zone images:** **1200 × 1500 px (4:5)** · WebP · see `BACKDROPS_ZONE_IMAGE_SPEC.md`

### Chalet · section sub (tie Mom VIP to venue)

```
The same historic Chalet between the North and East ponds that wedding guests adore · 
now your lounge while your senior shoots the estate.
```

### FAQ · add or update one item

**Q:** `Is this a studio session?`  
**A:** `No. The Estate Senior Experience takes place entirely on the private Whispering Woods grounds in Harvard, IL · the same 40-acre estate used for weddings. You get outdoor backdrops (woods, ponds, reflections), indoor rain backups, and the Chalet lounge. There is no strip-mall studio component.`

**Q:** `Can I buy the Chalet Collection on the day of the event?`  
**A:** `The Chalet Collection is a pre-order offer only · available when you secure your spot or before your balance is due (10 days prior). On estate day, keepsakes are available à la carte at full retail with no bundle discount.`

---

## MCP agent script · execution order

**Namespace:** `project-0-SPQ-weweb-ai`  
**Rules:** `weweb-mcp-integrated-only.mdc` · `weweb-workflow-duplicate-first.mdc`  
**Do not** partial-wipe `wf_booking_form_submit` or NU-style multi-step workflows.

### Phase 0 · Connect & inventory

```
1. ping
2. getMe
3. getPageSemantic pageId 991a8992-afed-4eaf-b77e-13a81380ad12
4. getPageElementsByUid · Pricing section 75a60e34… + all children (discover upsell card UIDs)
5. Grep canvas text for: "Best Value", "495", "275", "695", "studio", "all-inclusive"
6. Record drift vs this spec in a short comment to user
```

### Phase 1 · Pricing section (`75a60e34…`)

```
For each ww-text / ww-button in Pricing:
  editElement → content.default.text.en (or price fields) per copy blocks above

Specific edits:
  - Remove all "Best Value" badges on Chalet Collection card
  - Add "PRE-ORDER EXCLUSIVE" badge (gold #C6A15B or terracotta #C27A59)
  - Update prices: bundle 995, album 695, frame 345, digital 295, retouches 175
  - Add strikethrough **$1,245** on bundle card (not $1,337 stack · style or secondary text)
  - Add pricing footer disclaimer ww-text if missing
  - Ensure base card still $1,420 and deposit copy non-refundable
```

### Phase 2 · Hero + Experience + Backdrops + Chalet

```
editElement on section subtitles per "Section copy updates" above
Do not change H1 text "The Estate Senior Experience" unless user asks
ADD-1 geo badge (if not shipped): see CONVERSION_ADDITIONS_SPEC.md
```

### Phase 3 · FAQ (`764a2540…`)

```
Add or editElement FAQ accordion items for studio question + pre-order bundle policy
Keep rain-or-shine and non-refundable answers unchanged
```

### Phase 4 · SEO (optional same session)

```
searchPages → Home
updatePage metadata.description · include "private estate" "not a studio" "Harvard IL" "24 spots"
JSON-LD Event description · align with estate positioning (no URL outbound in schema)
```

### Phase 5 · Booking modal (future · not in this copy pass)

```
Pre-order Chalet Collection checkbox + Stripe line item = Xano/backend task
For now: pricing section is display-only; note in summary if checkout not wired
Do NOT add second booking path or Calendly
```

### Phase 6 · Verify

```
getPageElementsByUid · re-read all edited text nodes
Confirm no external links added
Confirm deposit mentions still paired with non-refundable in modal + FAQ
WeWeb preview smoke: Pricing section mobile 375px
```

---

## Acceptance checklist

```
[ ] MCP ping succeeded before edits
[ ] No price remains at old retail (495 album, 275 frame, 695 always-on bundle)
[ ] "Best Value" removed; "PRE-ORDER EXCLUSIVE" on bundle only
[ ] Retouches card states 7 images
[ ] Bundle copy states not available estate day / no day-of savings
[ ] Estate positioning in Pricing sub + at least Hero OR Experience
[ ] FAQ answers studio vs estate + pre-order bundle policy
[ ] Base $1,420 and $710 deposit unchanged
[ ] Modal TOS gate + non-refundable copy untouched
[ ] No new external links in funnel
[ ] whisperingwoodsevents.com referenced text-only (no href in ww-text if zero-dropoff strict)
```

---

## Drift log (2026-09-07)

| Item | Status |
|------|--------|
| MCP integrated session | **Connected** · swarm applied 2026-09-07 |
| Pricing on canvas | **Target** · album $955, digital $395, Chalet $1,420 / ~~$1,775~~ |
| Estate positioning | **Applied** · Hero, Experience, Backdrops, Chalet, Pricing, FAQ |
| TOS / legal HTML | No keepsake prices in legal files · OK |
| Xano / Stripe pre-order line item | **Not built** · display copy only until backend |
| SEO meta + favicon | **Scripted** · `ESTATE_POLISH_SWARM_SCRIPT.md` Phase 5 |
| Bundle savings | **$250** / strikethrough **$1,245** (à la carte sum **$1,337** · do not use on bundle card) |
| Itinerary | **General per-senior blocks** · no clock times until photog lock-in (Tuesday) |
| FAQ 9/10 | **Restore** · friend booking + what's included (`ESTATE_POLISH_SWARM_SCRIPT.md`) |

---

## Related docs

- `docs/WHISPERING_WOODS_LUXE_AUDIT.md` · funnel + modal canon
- `docs/whispering-woods-luxe/CONVERSION_ADDITIONS_SPEC.md` · itinerary, disqualifier, social proof
- `docs/whispering-woods-luxe/legal/terms-of-service.html` · deposit law (unchanged by pricing pass)
