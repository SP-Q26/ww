# WWLuxe · Estate Polish Swarm Script (AI / WeWeb MCP)

**Project:** WhisperingWoodsLUXE · `1b8147da-2812-42a5-946e-f83c582d3071`  
**Page:** Home · `991a8992-afed-4eaf-b77e-13a81380ad12` · route `/home`  
**Script date:** 2026-09-09 (pricing superseded · see `KEEPSAKES_MOM_WALK_CANON.md`)  
**Namespace:** `project-0-SPQ-weweb-ai` · **`ping` first** every session

**Scope this pass:** FAQ restore · Chalet **$355 thank-you** pricing · base-card estate headline · **general** per-senior itinerary (no clock times) · **SEO estate refresh** · **favicon** · **no public dates** until photographer lock-in (Tuesday follow-up)

**Out of scope:** Xano/Stripe · pre-order checkout line items · social-proof quote mining · strict hour-by-hour estate-day schedule

**Do not break:** zero-dropoff · single booking modal · TOS gate · deposit paired with non-refundable · no partial-wipe `wf_booking_form_submit`

---

## Canon updates (2026-09-09)

### Bundle math (current retail)

| Field | **Canon** |
|-------|-----------|
| Chalet Collection pre-order | **$1,420** |
| Market à la carte stack | **$1,775** ($955 + $395 + $425) |
| Published thank-you | **$355** (only advertised courtesy) |
| Keepsakes à la carte | Album **$955** · Digital **$395** · Frame **$425** · Retouches **$195** |

**Copy rule:** Pre-order Chalet only · **$355 thank-you** off **$1,775** stack. Estate-day discounts never in funnel copy. **Mom toast** = personal gift, not marketed. **No vendor lab names** on canvas.

**Forbidden:** `$895` · `$350` · `$1,670` · `$250 thank-you` · `Save $250` · `$995` bundle · vendor names on customer copy

### Itinerary (per senior · general until photog lock-in)

| Block | Duration | Notes |
|-------|----------|--------|
| Hair & makeup | **~40 min** | Salon chairs onsite |
| Estate editorial shoot | **~60 min** | Golf cart between zones |
| Outfit changes | **5–7 min** each | Between looks, not a separate “hour” |
| Mom / family walkthrough | **~15 min** | Guided family-style shots |

**No clock times** (12:00 PM, etc.) on canvas until Tuesday photographer lock-in.  
**No hero dates** · **no JSON-LD `startDate`** until experience weeks are confirmed.

### Dates policy

| Surface | Before Tuesday | After Tuesday (separate micro-pass) |
|---------|----------------|-------------------------------------|
| Hero | No week/date lines | Add one line only when weeks are firm |
| SEO / JSON-LD | No `startDate` | Add when announced |
| Modal `preferredWeek` | General placeholder (see Phase 4) | Replace with real week options |

---

## Element UID map (verify on reconnect)

| Resource | UID |
|----------|-----|
| Hero section | `68072bf6-8fbe-4292-acd2-a776d68bc1fe` |
| Hero subhead | `83f33f04-2d18-4cfc-9878-c962fd2e8b0c` |
| Hero geo badge | *(under Subhead · discover via `getPageSemantic`)* |
| Typical Estate Day section | `5bb3a0e5-6c21-499e-a039-83e5191039de` |
| Estate Day subtitle | `126b922e-1886-4e2f-b073-cf58e442cbe4` |
| Step 1–4 time | `8ce929d8…` `bc4267de…` `d00374ac…` `794d3742…` |
| Step 1–4 title | `6714dbbf…` `0efdaadd…` `ce722535…` `bfc8f6c1…` |
| Step 1–4 desc | `309d2cc8…` `2f71acce…` `a54ff6e5…` `d3271427…` |
| Base package headline | `bcd1d558-24fb-4e7f-b8ef-89183ba9bb51` |
| Chalet bundle price | `3fa5bef5-b27c-42e6-b273-9c902682d4c5` |
| Chalet bundle desc | `6676ca3f-3b7c-4322-a6ae-3f00d5ddd06b` |
| Upsell note (footer) | `e3b9b523-b451-418f-a272-b82bfeaebb11` |
| FAQ accordion list | `05051739-15be-4604-8c8e-8d517e271c61` |
| FAQ Q7 pre-order | `1a15d26e-96b1-4508-bea8-7787790abba0` |
| FAQ A7 pre-order | `03e63424-65cc-4f2f-8fc7-b51232d2ac89` |
| Preferred week select | `cc1a1c45-09d8-491e-90d0-714d41ffe91f` |

---

## Copy blocks (paste-ready)

### Base package card · headline tighten

**Replace** `Package Headline` (`bcd1d558…`):

**Title:** `The Estate Senior Experience`

**Add or update** line directly under headline (if `Package Subhead` exists; else one sentence in `Price Subtext` `4428529b…`):

```
One fixed estate price · professional HMU, guided shoots, Mom VIP Chalet · no surprise reveal bill.
```

**Remove** generic “All-Inclusive. No Surprises.” as the primary headline.

---

### Chalet Collection · price + savings

Use full paste blocks from **`MCP_CHALET_COPY_APPLY.md`** · **`KEEPSAKES_MOM_WALK_CANON.md`**.

- Primary: **`$1,420`** · strikethrough **`$1,775`** · **`$355 thank-you for ordering early`**
- Badge: **`PRE-ORDER EXCLUSIVE`**
- Description / FAQ A7 / upsell note: no vendor names · `$1,775` stack · `$355` thank-you

---

### Itinerary · general per-senior blocks

**Section eyebrow** (optional): `PER SENIOR · ESTATE DAY`

**H2:** keep `A Typical Estate Day`

**Subtitle** (`126b922e…`):

```
Per-senior timing below. Your full experience-day flow is finalized with our photographer partners after crew lock-in · sample blocks only, not a contract. Chalet lounge for moms runs throughout the day.
```

| Step | Time field (replace clock) | Title | Description |
|------|----------------------------|-------|-------------|
| 1 | `~40 min` | `Hair & Makeup` | Private salon chair · unhurried styling before you step onto the estate. |
| 2 | `~60 min` | `Estate Editorial` | Guided session across woodland, pond, and meadow zones · golf cart between setups. |
| 3 | `5–7 min` | `Outfit Changes` | Quick changes between looks · built into your session, not rushed. |
| 4 | `~15 min` | `Mom & Family Walkthrough` | Guided mom/daughter or family portraits · unhurried, not a mini-session add-on. |

**Do not** add Chalet as a timed step unless ops confirms a fixed block.

---

### FAQ 9 & 10 (restore)

**Q9:** `Can I book with a friend?`

**A9:**
```
Yes. Each senior reserves their own estate spot ($1,420 · $710 non-refundable deposit). Friends often book the same experience week so you arrive together · but every senior needs their own booking and time block on estate day.
```

**Q10:** `What's included in the $1,420?`

**A10:**
```
Your estate day includes professional hair and makeup, roughly 60 minutes of guided shooting across private backdrops, outfit changes, 20+ retouched digital images, a private online gallery, golf-cart transport between zones, the Chalet lounge for Mom (mocktails and grazing), and a short family walkthrough. Keepsakes like albums and framed prints are optional pre-order add-ons · not required at booking.
```

**Implementation:** Clone structure from `FAQ Item 8` (`9af5ad38…`) via `addElements` into `05051739…` · wire accordion to `activeFaqIndex` same pattern as items 1–8 · update page description “10-item accordion”.

---

## SEO refresh · ESTATE forward

**Voice:** Private **estate** senior portraits · **not a studio** · same grounds as Whispering Woods wedding venue · Harvard IL · 40 acres · ponds · woodland · 24 spots.

### `updatePage` · full metadata object required

Use `searchPages` first to read current values, then `updatePage` with **every** metadata field populated.

**Suggested `title.en`:**

```
Private Estate Senior Portraits | Whispering Woods Luxe · Harvard, IL · 24 Spots
```

**Suggested `metadata.description.en`:**

```
Private estate senior portraits on a 40-acre Harvard, IL property · the same wedding-venue grounds as Whispering Woods Events. Not a strip-mall studio. Professional HMU, woodland and pond backdrops, Mom VIP Chalet. $1,420 all-inclusive · 24 spots · $710 non-refundable deposit. North Shore, Barrington, Hinsdale, Naperville, Geneva.
```

**Suggested `metadata.keywords.en`:**

```
private estate senior portraits, estate senior photography Harvard IL, luxury senior photos estate, Whispering Woods senior portraits, wedding venue senior photos, woodland senior portraits Illinois, pond reflection senior photos, not studio senior portraits, Barrington estate senior photos, North Shore luxury senior portraits, Chalet senior experience
```

**Suggested `metadata.openGraphTitle.en`:**

```
Private Estate Senior Portraits | Whispering Woods Luxe
```

**Suggested `metadata.openGraphDescription.en`:**

```
Forty private acres. Wedding-grade estate production. Not a studio · your senior on the same grounds as Whispering Woods weddings. 24 spots · $710 deposit holds your chair.
```

**`openGraphImage`:** Keep current Unsplash estate image until brand asset exists, or swap to on-property photo after upload.

**`structuredData.en` · Event on an Estate (no `startDate` until Tuesday):**

```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "The Estate Senior Experience · Private Estate Senior Portraits",
  "description": "A one-day private estate senior portrait experience on 40 acres in Harvard, Illinois · wedding-venue grounds, not a photo studio. Professional HMU, editorial backdrops, Mom VIP Chalet.",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "image": "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&h=630&fit=crop",
  "location": {
    "@type": "Place",
    "name": "Whispering Woods Estate · Private Harvard, IL Grounds",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Harvard",
      "addressRegion": "IL",
      "addressCountry": "US"
    }
  },
  "organizer": {
    "@type": "Organization",
    "name": "Whispering Woods Luxe",
    "url": "https://whisperingwoodsluxe.com"
  },
  "offers": {
    "@type": "Offer",
    "price": "1420",
    "priceCurrency": "USD",
    "availability": "https://schema.org/LimitedAvailability",
    "description": "$710 non-refundable deposit required to reserve an estate spot",
    "url": "https://whisperingwoodsluxe.com"
  },
  "areaServed": [
    "Barrington, IL",
    "Hinsdale, IL",
    "Naperville, IL",
    "Geneva, IL",
    "Chicago North Shore"
  ]
}
```

**Page `description` (editor):** Mention estate-not-studio, 10 FAQ items, per-senior itinerary blocks, $250 pre-order bundle savings.

---

## Favicon

1. **Asset:** Square mark · min 32×32 · PNG or ICO · gold `#C6A15B` on cream `#FDFBF7` or charcoal monogram **WW** · no tiny text.
2. **Upload:** `uploadMediaFile` → `mediaType: "images"` → user completes upload in editor **or** place file in repo and user uploads manually.
3. **Resolve path:** `exploreMediaFile` → path like `designs/<uid>/…/favicon.png`
4. **Assign:** `updatePage` → `id: 991a8992…` → `favicon: "<media path>"` · `projectId: 1b8147da…`

**Verify:** WeWeb preview tab shows icon · not `favicon: null` on `searchPages`.

---

## MCP execution order

### Phase 0 · Connect & inventory

```
1. ping
2. getMe
3. getPageSemantic pageId 991a8992… projectId 1b8147da…
4. Grep canvas for: "Save $340", "1,335", "1,337", "12:00 PM", "All-Inclusive. No Surprises", "Week of Sept"
5. getPageElementsByUid · Pricing upsell cluster + FAQ Item 8 (clone template)
```

### Phase 1 · Bundle savings ($250)

```
editElement 6676ca3f… → bundle desc ($355 thank-you, $1,775 stack)
editElement e3b9b523… → upsell footer note
editElement 03e63424… → FAQ A7
If Upsell 1 Compare text missing:
  addElements under Upsell 1 Top → ww-text strikethrough $1,775 next to $1,420
Remove any remaining "Save $340" or "$1,335" / "$1,337" stack math on bundle card
```

### Phase 2 · Base card headline (estate)

```
editElement bcd1d558… → "The Estate Senior Experience"
editElement 4428529b… (or new subhead) → one fixed estate price line (see copy block)
```

### Phase 3 · Itinerary generalization

```
editElement 126b922e… → general subtitle (photographer lock-in, not a contract)
For steps 1–4:
  editElement Step N Time → duration labels (~40 min, ~60 min, 5–7 min, ~15 min)
  editElement Step N Title + Desc → per table above
Do NOT add hero or section dates
```

### Phase 4 · FAQ restore + modal weeks (pre-Tuesday)

```
addElements → FAQ 9 & 10 (clone Item 8 pattern)
editElement FAQ questions/answers for Q9/A9 Q10/A10
editElement cc1a1c45… choices:
  - REMOVE "Week of Sept 21" / "Week of Sept 28" until Tuesday
  - REPLACE with single option:
    label: "Experience week · dates announced after photographer confirmation"
    value: "week_tbd"
  - placeholder: "Select experience week (dates coming soon)"
```

**Tuesday follow-up (separate script):** restore real week labels · optional hero one-liner · JSON-LD `startDate` if fixed single day.

### Phase 5 · SEO + favicon

```
searchPages → capture full metadata + favicon state
updatePage → full metadata object (all required fields) + estate copy above
uploadMediaFile / exploreMediaFile → favicon path
updatePage → favicon assigned
```

### Phase 6 · Verify

```
getPageElementsByUid · bundle, base headline, itinerary times, FAQ count
searchPages · favicon not null, description contains "estate" and "not a studio"
WeWeb preview 375px: pricing bundle strikethrough readable · FAQ 10 items · no clock times in itinerary
Confirm: no "Save $340" · no "$1,337" stack on bundle (use $1,245) · no Sept week in hero
```

---

## `updatePage` payload skeleton

```json
{
  "id": "991a8992-afed-4eaf-b77e-13a81380ad12",
  "projectId": "1b8147da-2812-42a5-946e-f83c582d3071",
  "title": { "en": "Private Estate Senior Portraits | Whispering Woods Luxe · Harvard, IL · 24 Spots" },
  "description": "…estate-not-studio… 10 FAQ… per-senior itinerary…",
  "favicon": "designs/<uid>/…/wwluxe-favicon.png",
  "metadata": {
    "description": { "en": "…" },
    "keywords": { "en": "…" },
    "openGraphImage": "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&h=630&fit=crop",
    "openGraphTitle": { "en": "…" },
    "openGraphDescription": { "en": "…" },
    "structuredData": { "en": { … } }
  }
}
```

---

## Acceptance checklist

```
[ ] ping succeeded
[ ] Bundle: $1,420 · $355 thank-you · ~~$1,775~~ visible · à la carte stack $1,775 on internal sheet only
[ ] Base card headline: The Estate Senior Experience (not generic all-inclusive)
[ ] Itinerary: duration labels only · no 12:00 PM clock times · general photog lock-in subtitle
[ ] FAQ: 10 items including friend booking + what's included
[ ] FAQ A7: $355 thank-you language
[ ] Hero: no experience week dates
[ ] Modal preferred week: TBD placeholder until Tuesday
[ ] SEO: title + meta + OG + JSON-LD emphasize PRIVATE ESTATE · NOT STUDIO
[ ] Favicon: assigned (not null)
[ ] Modal TOS + deposit copy untouched
[ ] wf_booking_form_submit not edited
```

---

## Tuesday post-lock-in micro-pass (stub)

When photographer + experience weeks are firm:

1. `editElement` modal `preferredWeek` → real week options  
2. Optional hero `ww-text` one line: `Experience weeks: [Week A] & [Week B] · Harvard, IL`  
3. `updatePage` → add `startDate` / `endDate` to JSON-LD if single-day or multi-day event  
4. Revisit itinerary only if photog approves a published hour-by-hour flow  

---

## Related docs

- `docs/whispering-woods-luxe/PRICING_POSITIONING_SPEC.md` · bundle policy (update savings to $250)  
- `docs/whispering-woods-luxe/CONVERSION_ADDITIONS_SPEC.md` · original itinerary spec (superseded for timing by this script)  
- `docs/WHISPERING_WOODS_LUXE_AUDIT.md` · launch P0s unchanged  
