# WWLuxe · Conversion Additions Spec (AI / WeWeb)

**Project:** WhisperingWoodsLUXE · `1b8147da-2812-42a5-946e-f83c582d3071`  
**Page:** Home · `991a8992-afed-4eaf-b77e-13a81380ad12` · route `/home`  
**Goal:** 14-day sellout · North Shore / suburban IL moms (wallet) + seniors (dream)  
**Do not break:** zero-dropoff · single booking modal · non-refundable copy pairing · TOS gate before checkout

---

## Funnel order (target)

```
1 Hero (+ geo badge)           68072bf6-8fbe-4292-acd2-a776d68bc1fe
2 The Experience               c1decbbc-0fd8-4fb8-848c-3b8bf3f03a84
3 The Backdrops                612ce5bc-58e2-4291-a7ca-e8dc2328bde4
4 [NEW] Mom Social Proof       insert after Backdrops
5 [NEW] Typical Estate Day     insert before Chalet
6 The Chalet                   992fdc23-13a6-469a-9688-59e3a9d83f44
7 Pricing (+ deliverables viz)   75a60e34-fade-48ca-b55f-3f519ed6993d
8 [NEW] Is This Right for You? insert before FAQ
9 FAQ                          764a2540-26d1-426e-aae9-77f443757b84
10 Final CTA                   53096ef1-d851-4b59-b3ee-55909b5f3273
11 Footer                      26cf5117-2d1e-4d60-a840-0a5bba841075
 ·  Sticky nav                   7fcc75b8-985b-4a78-8536-b93d3ee6d2d8
```

**WeWeb:** each `[NEW]` = root `ww-section` via `addSection` with `previousSectionUid` = section above.

---

## Global design tokens

| Token | Value |
|-------|-------|
| Cream | `#FDFBF7` |
| Charcoal | `#2C2C2C` |
| Gold | `#C6A15B` |
| Terracotta | `#C27A59` |
| Sage | `#7B8E7A` |
| Headlines | Playfair Display |
| Body | Inter |

**Forbidden:** outbound links · Google review widgets · Calendly · second booking path · fake testimonial names

---

## ADD-1: Hero geo badge

| Field | Value |
|-------|-------|
| **Where** | Hero section `68072bf6…` · under subtitle · above primary CTA |
| **Priority** | P1 · ship now |
| **Element** | `ww-text` or existing subtitle sibling |

**Copy (static):**
```
Welcoming 2026 seniors from Barrington, Hinsdale, Naperville, Geneva & the Chicago North Shore.
```

**Style:** 11–12px · letter-spacing 0.08em · uppercase or small caps · `color: var(--sage)` or `rgba(123,142,122,0.9)` · no bold

**SEO (optional `updatePage`):** add same phrase to `meta keywords` + JSON-LD `areaServed`

---

## ADD-2: Mom Social Proof (3 cards)

| Field | Value |
|-------|-------|
| **Where** | New section after Backdrops `612ce5bc…` |
| **Priority** | P1 · ship after real quotes mined |
| **Layout** | 3 `ww-div` cards · desktop row · mobile stack |

**Section copy:**
- Eyebrow: `WHAT FAMILIES SAY`
- H2: `Confidence for her. Peace of mind for you.`
- Sub (if wedding-origin quotes): `From families who've experienced the estate · the same team, the same standard of care.`

**Card anatomy (×3):**
```
[quote text 2–3 sentences]
 ·  [First] [Last initial]., [Town] · [Role tag]
```

**Three buckets (one card each):**

| ID | Archetype | Mine from wedding reviews |
|----|-----------|---------------------------|
| A | Emotional host / mom relief | fireplace, mocktails, cried, watched her, stress-free lounge |
| B | Reluctant subject | hates photos, nervous, comfortable in 10 min, felt like a shoot |
| C | Logistics / zero stress | arrived, team handled everything, didn't coordinate |

**Testimonial rules (chargeback-safe):**
1. Real quote + real town → **written permission** (email OK) before publish
2. Wedding guest → role tag `Whispering Woods wedding guest` or `Estate guest` · do NOT claim they booked Estate Senior Experience unless true
3. Light edit OK · keep sentiment · do not invent names (no placeholder Jennifer K. / Michelle R.)
4. No superlatives unless in source quote (`best in Illinois` = cut unless guest said it)

**Design:** white card · 1px `rgba(44,44,44,0.12)` border · gold 3px left border · 16–20px padding · quote italic optional

---

## ADD-3: Typical Estate Day (itinerary)

| Field | Value |
|-------|-------|
| **Where** | New section after Social Proof · before Chalet `992fdc23…` |
| **Priority** | P0 · ship first |
| **Layout** | 4 steps · desktop horizontal · **mobile vertical stack** (no horizontal scroll) |

**Section copy:**
- Eyebrow: `YOUR MORNING AT THE ESTATE`
- H2: `A Typical Estate Day`
- Sub: `Sample flow · your experience week may vary slightly.`

**Steps (fixed template):**

| # | Time | Title | Dek |
|---|------|-------|-----|
| 1 | 09:30 AM | Arrival & Salon HMU | Private styling chair, unhurried look selection. |
| 2 | 10:45 AM | Editorial Zones | Golf cart between backdrops with pro lighting crew. |
| 3 | 11:45 AM | Family Milestones | Mom/daughter or family portraits, guided posing. |
| 4 | 12:00 PM | Chalet Lounge & Reveal | Mocktails, grazing, first sneak peeks on screen. |

**Rules:** Only promise live feed / on-screen reveal if delivered in package · frame times as sample not contract

**Design:** gold step numbers · charcoal titles (Playfair) · muted dek (Inter) · connecting line desktop only

---

## ADD-4: Pricing deliverables visual

| Field | Value |
|-------|-------|
| **Where** | Inside Pricing `75a60e34…` · **base $1,420 card only** |
| **Priority** | P2 · week 2 |
| **Layout** | Desktop: checkmarks left 50% · mockup right 50% · Mobile: mockup above checkmarks |

**Show max 3 visuals (pick what’s real):**
1. Phone · private gallery UI (actual or WW-branded frame)
2. Archival print / linen box
3. Digital pass or Chalet reveal screen

**Forbidden:** stock UI of wrong product · 9 mockups · upsell card mockups (text only on upsells)

---

## ADD-5: Is This Right for You? (disqualifier)

| Field | Value |
|-------|-------|
| **Where** | New section after Pricing `75a60e34…` · before FAQ `764a2540…` |
| **Priority** | P0 · ship now |
| **Layout** | 2 columns desktop · stack mobile · **no CTA in section** |

**Left · H3:** `The Estate Experience is for you if…`
- Editorial, magazine-quality portraits · not yearbook fillers
- Professional HMU and unhurried time for your senior
- A pampered day for you (Chalet, lounge, no errands)
- Heirloom memories, not just social content

**Right · H3:** `This is not for you if…`
- You need a 15-minute cap-and-gown turnaround
- You're comparing to park mini-sessions or phone snapshots
- You want the cheapest option, not a once-in-a-lifetime estate day

**Tone:** contrast without attacking school photographers · right column sage border · muted text

---

## Build sequence

| Phase | Items | Blocker |
|-------|-------|---------|
| **A (now)** | ADD-3 Itinerary · ADD-5 Disqualifier · ADD-1 Hero geo | none |
| **B (quotes ready)** | ADD-2 Social proof | 3 permitted real quotes |
| **C (asset ready)** | ADD-4 Pricing mock | honest gallery/print assets |

---

## Acceptance checklist

```
[ ] Page order matches funnel order above
[ ] No new external links or review widgets
[ ] Booking modal unchanged · TOS gate intact
[ ] Deposit mentions still paired with non-refundable where applicable
[ ] Itinerary subtitle includes "sample flow" / "may vary"
[ ] Social proof: no fabricated names · permission on file for attributed quotes
[ ] Mobile 375px: itinerary vertical · social cards stack · sticky nav not clipped
[ ] Hero geo under subtitle · not in H1
[ ] Disqualifier before FAQ · after Pricing
```

---

## MCP implementation notes

- **Namespace:** `project-0-SPQ-weweb-ai` · `ping` first
- **Structure:** `addSection` JSONL · `previousSectionUid` = prior section UID
- **Edits:** `editElement` on Hero for geo badge · Pricing card for mockup
- **Do not:** partial wipe on `wf_booking_form_submit` · duplicate modal booking path

---

## Input slot (paste real quotes here)

```yaml
card_a_emotional:
  raw_quote: ""
  attribution: ""  # First L., Town
  role_tag: ""     # e.g. Whispering Woods wedding guest
  permission: false  # email OK on file

card_b_reluctant:
  raw_quote: ""
  attribution: ""
  role_tag: ""
  permission: false

card_c_logistics:
  raw_quote: ""
  attribution: ""
  role_tag: ""
  permission: false
```

Agent: map pasted quotes to cards A/B/C · apply testimonial rules · trim to 2–3 sentences · ship ADD-2.
