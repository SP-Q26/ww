# Season accent manifest — Whispering Woods Home

**Head paste version:** see `WW/weweb/VERSION` · rebuild: `python3 WW/weweb/build-head-paste.py`

Clients toggle **Spring / Summer / Autumn** in Natural Cycles. Every row below must visibly shift when the tab changes.

## Accent colors (canon)

| Season | Token | Hex | Role |
|--------|-------|-----|------|
| Spring | `--ww-accent-spring` | `#8A9A86` | Sage |
| Summer | `--ww-accent-summer` | `#C49A5A` | Gold |
| Autumn | `--ww-accent-autumn` | `#B86B32` | Copper |

Runtime: `html[data-season="spring|summer|autumn"]` sets `--ww-accent` + `--ww-section-deep`.

---

## Tier 1 — Natural Cycles section (most change)

**Section:** `#ww-season-anchor` · child root `ww-element-f1062913`

| # | Element | UID / selector | What changes |
|---|---------|----------------|--------------|
| 1 | **Section background** | `#ww-season-anchor` | `--ww-section-deep` tint (spring/summer/autumn pine) |
| 2 | **Section glow** | `#ww-season-anchor::before` | Radial accent wash (22% accent) |
| 3 | **Top border** | `#ww-season-anchor` | 3px accent mix 55% |
| 4 | **Bottom border** | `#ww-season-anchor` | 2px accent mix 25% |
| 5 | **Eyebrow** | `ww-element-81a83690` | Text → `--ww-accent` |
| 6 | **Headline** | `ww-element-898eb72e` | Subtle accent underline bar |
| 7 | **Tab row border** | `ww-element-1cf18242` | Full accent ring + inset shadow |
| 8 | **Tab dividers** | `8b68b655`, `71f57801`, `acf6e8c7` | Right border accent mix |
| 9 | **Active tab** | per `data-season` | Label + cell background 18% accent |
| 10 | **Poetry panel** | `ww-element-e66566cf` | Border 50% accent · bg 28% accent + pine |
| 11 | **Poetry copy** | `ww-element-cd1c365d` | Italic text → accent color (JS + CSS) |
| 12 | **Dream line** | `.ww-dreamline` or poetry UID | Season copy text (JS) |

**Copy per season (JS):**
- Spring: *Begin where the woods meet the aisle.*
- Summer: *Long light on the ponds — the whole weekend ahead.*
- Autumn: *Gold on forty acres, still only yours.*

---

## Tier 2 — Site-wide accents (subtle — “we control the mood”)

| # | Surface | Selector / UID | What changes |
|---|---------|--------------|--------------|
| 13 | Body veil | `body.ww-site::before` | Radial accent at top (4% opacity) |
| 14 | Hero CTA border | `ww-element-1172c8dd` | Border + text accent |
| 15 | Hero title | `ww-element-67cf3d64` | Gold/sage/copper script |
| 16 | Experience icons | `5d30871a`, `e9ddc655`, `f8a31c45` | Glyph accent |
| 17 | Stats numbers | `eb7245d9`, `7b2c736b`, etc. | Number accent |
| 18 | Stats tile borders | `749482b3`, `b80914cf` | Accent border 22% |
| 19 | Gallery CTA | `ww-element-bf83eccd` | Button border + hover |
| 20 | Property chips | walk section buttons | Border / active fill |
| 21 | Final CTA buttons | `2c5a9642` section | Outline accent |
| 22 | **Footer top rule** | footer section `1255087b` | 2px accent |
| 23 | Footer venue name | `ww-element-60c8ca1f` | Accent text |
| 24 | Footer contact + email | `09b4e7a7`, `120ac746` | Accent text |
| 25 | Footer tour button | `ww-element-f0f7c99a` | Solid accent fill |
| 26 | Footer social rings | `8de06f32`, `aff30be4`, `8787082c` | Border accent · hover fill |
| 27 | Footer social icons | `3de3e745`, `fc145a7b`, `6fc77c1a` | Icon fill accent |
| 28 | Footer divider | `ww-element-4fffe772` | Accent line |
| 29 | Sticky nav pill border | `#ww-sticky-nav` | Accent border 38% |
| 30 | Sticky nav icons/labels | nav UIDs | Accent color |

---

## Toggle wiring

| Source | Mechanism |
|--------|-----------|
| WeWeb tab workflows | `activeSeason` var `6e7f5084-d32d-4fb7-98bd-1337a99fc5fb` |
| Bridge poll | `wwWeWebBridge` → `wwSetSeason(v)` every 400ms |
| Tab click backup | `ww-season-mood.js` → `bindWeWebTabs()` on tab UIDs |
| Toggle off | Variable `""` → default gold accent, no active tab |

---

## Smoke checklist (all 30)

1. Open Natural Cycles → tap **Spring** → section bg sage-tinted, prose panel sage, eyebrow sage
2. Tap **Summer** → gold shift across Tier 1 + footer tour button
3. Tap **Autumn** → copper shift
4. Tap active season again (toggle off) → accents return to default gold, no tab highlight
5. Scroll to footer → social hover: solid accent circle, pine icon (no layout jump)
6. View Full Gallery → drawer opens with venue photos (not empty)
