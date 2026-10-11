# WWE venue · smoke checklist (cache v27)

Run after every WeWeb → `venue` push and Vercel deploy.

**Preview:** Vercel `ww-events` production branch `venue`  
**Prod (when DNS):** `https://www.whisperingwoodsevents.com/`

## 0 · Cache coherence

In DevTools console on any route:

```js
window.wwg_cacheVersion === 27
```

Network: `public/data/<page-uuid>.json` returns `cacheVersion: "27"`.

## 1 · Routes (4)

| Route | Page id | Pass |
|-------|---------|------|
| `/` | `385ba910-fe19-436b-a205-edc2ec8b88a7` | |
| `/bespoke-journey` | `fd094741-c8cc-43f1-8a50-0c7002ee470a` | |
| `/integrity` | `78bda3b0-10da-46db-9c0a-16d8fa0b330f` | |
| `/contact` | `061de62d-94a9-476c-8acf-696c53e1adfd` | |

- No white screen · no horizontal scroll on **390px** width
- Typography: Cormorant / Inter / Montserrat · **no Playfair**

## 2 · Home scroll order (spot check)

Feeling → Seasons → Freedom/Pillars → **Calm** → Numbers → Quotes → Gallery → Hotspots → Weekend → Barn → Chalet → **Arrival** → Built Forward → Pricing **$17,900** → **Right Fit** → FAQ **`#faq`** → Private Walkthrough → Footer

## 3 · CTAs

- **Tour the Grounds** → `https://calendly.com/whisperingwoodsinfo/private-venue-tour` (new tab)
- Mail links → `info@whisperingwoodsevents.com` only
- **No** `tel:` links

## 4 · Breakpoints

| Width | Checks |
|-------|--------|
| 390 | Column ~28rem · sticky FAQ usable · card tap targets ≥44px |
| 768 | Tablet layout intact |
| 1280+ | Desktop hero + sections |

## 5 · Card lift (if head paste live)

Hover: slight lift + shadow · Active/press: scale ~0.98 · transitions on default state

## 6 · Satellites

- **Bespoke:** Engagement Sessions block
- **Integrity / Contact:** dedicated sections (not home-only duplicates)

## Sign-off

| Role | Date | Notes |
|------|------|-------|
| Operator | | |
