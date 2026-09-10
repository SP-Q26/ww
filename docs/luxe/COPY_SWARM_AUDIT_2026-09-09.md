# WWLuxe · Copy swarm audit (web + `/order`)

**Date:** 2026-09-09  
**Goal:** On-brand luxe voice · **weaponize against industry demo** (strip-mall minis, reveal-room upsells, opaque pricing) without sounding petty  
**Canon:** `KEEPSAKES_MOM_WALK_CANON.md` · `PRICING_POSITIONING_SPEC.md` · `EDITOR_OPPO_BRIEF_PRINT.html`  
**WeWeb canvas:** MCP trial ended · **operator must verify live** using checklist below  
**Git surfaces audited:** `/order` · `/terms` · `/privacypolicy`

---

## Brand voice (non-negotiable)

| Pillar | We say | We never say |
|--------|--------|--------------|
| **Venue** | Private 40-acre estate · wedding-grade grounds | Studio hour · barn mini · park slot |
| **Price** | Published · $1,420 all-in day · honest retail keepsakes | Save $X gimmicks · fake compare · haggle |
| **Mom** | Chalet VIP · Mom Milestone included · parent mini story | Mom walkthrough · quick group snap |
| **Craft** | Editorial · retouch-led · heirloom | Yearbook filler · batch farm |
| **Keepsakes** | Market retail · one team · pre-order thank-you only | Reveal pressure · estate-day deal |
| **Tone** | Warm · confident · selective | Attack competitors by name · bargain language |

**Punctuation:** No em dashes (U+2014) in customer copy · use ` · ` or `.`

---

## Weaponization map (vs industry demo)

Use these contrasts on **web** (funnel). Use **lighter** echoes on `/order` (post-commit · trust, not debate).

| Industry demo move | Our counter (web) | `/order` echo |
|--------------------|-------------------|---------------|
| $199 session → $2k at reveal | **$1,420 published.** Estate day is the product. | Published retail · no surprise invoice |
| Strip-mall backdrop wall | **10+ editorial zones** on private estate | Handcrafted heirlooms · same estate team |
| Mom waits in the car | **Chalet VIP** + Mom Milestone in gallery | Parent mini · Chalet consult for cover |
| 15-min cap-and-gown | **~60 min editorial** + HMU + outfit changes | Extra retouches capped · editorial pipeline |
| Cheapest bid wins | Disqualifier: **bargain shoppers happier elsewhere** | Pre-order window · à la carte on estate day |
| Opaque album upsell | **$1,775 stack** strikethrough · **$355 thank-you** only | Line-item prices on every card |
| One-size mini line | **Tailored estate experience** (disqualifier #4) | Design consult · cover swatches in Chalet |

---

## Surface 1 · `/order` (git · audited live)

**Overall:** **82/100** on-brand · **68/100** weaponized (trust lines added this pass)

### What’s strong

| Area | Score | Notes |
|------|------:|-------|
| Pricing canon | ✅ | $955 / $395 / $425 / $1,775 / $355 / $55·5/$255 |
| Voice | ✅ | Heirloom · handcrafted · Chalet · editorial |
| Mom story | ✅ | Parent mini · Chalet consult copy |
| No vendor names | ✅ | Clean |
| Legal coupling | ✅ | Custom goods · TOS links |
| UX copy | ✅ | Kiosk modes · draft restore · preorder window |

### Gaps fixed (2026-09-09 pass)

| Was | Now |
|-----|-----|
| `$355 courtesy` | **`$355 thank-you`** (canon) |
| No anti-demo line | Intro: **published retail · no reveal-room surprises** |
| Chalet bullets soft | Added **not sold on estate day** · **one estate team** |
| Meta generic | Estate + published pricing in description |

### Remaining `/order` opportunities (P2)

| Item | Suggestion |
|------|------------|
| Success email tone | Match “design consult in the Chalet” language |
| Empty cart state | Optional one-liner: “Keepsakes are optional · published prices only” |
| `5 for $250` in docs | Fixed in `WEWEB_SWARM_CHANGES.md` → **$255** |

### `/order` section scorecard

| Block | On-brand | vs demo | Action |
|-------|:--------:|:-------:|--------|
| Hero / intro | ✅ | ⚠️ → ✅ | Trust line added |
| Chalet bundle | ✅ | ✅ | Thank-you + not on estate day |
| À la carte | ✅ | ✅ | Prices visible upfront |
| Upgrades | ✅ | ✅ | Fine art / mini / spreads clear |
| Cover consult | ✅ | ✅ | Anti–rush swatch story |
| Pay step | ✅ | ✅ | Stripe · custom goods |
| Terms footer | ✅ | — | OK |

---

## Surface 2 · WeWeb Home (operator verify · MCP blocked)

**Method:** Open editor → grep + section walk against this table. Paste prompt at bottom.

### Section audit checklist

| Section | On-brand target | Weaponize? | Verify |
|---------|-----------------|------------|--------|
| **Hero** | Estate · 24 spots · wedding grounds | ✅ vs studio | Geo badge · no dates until lock |
| **Experience** | Strip-mall **not** · wedding-grade · Boulder editor line | ✅ | Team line present |
| **Backdrops** | `10+ Editorial Zones` · pros travel for this | ✅ | Not “six distinct” |
| **Chalet** | Mom VIP · ponds · grazing production | ⚠️ soft | Tie to wedding Chalet |
| **Pricing base** | $1,420 · $710 non-refundable | ✅ published | No “all-inclusive” generic |
| **Chalet card** | $1,420 · ~~$1,775~~ · **$355 thank-you** | ✅ | No vendor names |
| **Keepsakes** | $955 / $395 / $425 / $195 | ✅ | Grep stale prices |
| **Customize block** | Fine art · mini · spreads · retouches | — | **Often missing** · add |
| **Disqualifier 4×4** | Right #4 tailored estate | ✅ | **Often missing** · add |
| **Itinerary** | Per-senior durations · no fake clock | — | Sample flow disclaimer |
| **FAQ** | Studio? **No.** · Chalet pre-order only | ✅ | 10–11 items |
| **Social proof** | Hidden until real quotes | — | Do not fabricate |
| **Modal** | TOS · deposit · week TBD | ✅ | Legal URLs canon |
| **Footer** | Link **`/order`** once | ✅ | No outbound |

### Web copy drift grep (must be zero hits)

```
895  350  1670  250 thank  RedTree  Save $250  $995 bundle  Best Value
U+2014 (em dash)
```

### Web weaponization score (expected if canon pasted)

| If… | Score |
|-----|------:|
| Sep 5 audit only (pre-bump, no disqualifier #4) | ~70 |
| Post `WEWEB_SWARM_CHANGES` paste complete | ~88 |
| + Customize block + `/order` link + FAQ upgrade | **~92** |

---

## Surface 3 · Legal (`/terms` · `/privacypolicy`)

| Check | Status |
|-------|--------|
| $1,420 / $710 deposit | ✅ |
| Custom keepsakes · production start | ✅ |
| Chalet pre-order described | ✅ |
| Kiosk / Stripe mentioned | ✅ |
| Tone matches luxe (firm, clear) | ✅ |
| Weaponization | N/A (appropriate) |

---

## Cross-surface consistency

| Phrase | Web target | `/order` | Match |
|--------|------------|----------|:-----:|
| Thank-you (not “courtesy” / “save”) | $355 thank-you | $355 thank-you | ✅ |
| Stack compare | ~~$1,775~~ | $1,775 strikethrough | ✅ |
| Chalet estate-day rule | Not sold on estate day | Not sold on estate day | ✅ |
| Mom Milestone | Included in estate | Parent mini optional SKU | ✅ |
| Vendor names | None | None | ✅ |
| Estate ticket | $1,420 | Linked via hero | ✅ |

---

## Forbidden copy scan (`/order` + docs)

| Rule | `/order` | Docs paste |
|------|----------|------------|
| Em dash | ✅ none | Operator grep web |
| RedTree customer-facing | ✅ | ✅ internal BOM only |
| Mom walkthrough | ✅ | ✅ |
| Champagne toast sold | ✅ | ✅ |
| Estate-day discount promise | ✅ | ✅ |

---

## P0 operator actions (web)

1. **WeWeb in-editor AI** · paste block below (one message).  
2. **Grep canvas** · stale price + vendor + em dash.  
3. **Confirm disqualifier** · 4th bullet on right column.  
4. **Pricing footer** · link to `https://whisperingwoodsluxe.com/order`.  
5. **Upgrade MCP** or manual paste if trial stays blocked.

---

## Paste prompt · copy + weaponize (WeWeb AI)

```
Home 991a8992-afed-4eaf-b77e-13a81380ad12. Do not touch wf_booking_form_submit.

VOICE: Luxe estate · warm · selective. Weaponize against strip-mall minis and reveal-room upsells by contrast, never by naming competitors. Published prices only.

1. Pricing: album $955, digital $395, frame $425, retouches $195, Chalet $1420, strikethrough $1775, $355 thank-you (not "save" or "courtesy"). No vendor lab names.

2. Experience subtitle must include: not a strip-mall studio hour · wedding-grade estate production.

3. Disqualifier 4x4 before FAQ. Right column bullet 4: "You want a one-size-fits-all session, not a guided, tailored estate experience." Right column bullet 3: cheapest option / bargain (see CONVERSION_ADDITIONS_SPEC).

4. Optional pricing footer line: "Published estate pricing. Our only advertised courtesy is the Chalet pre-order thank-you. Luxury experience; bargain shoppers will be happier elsewhere."

5. Add "Customize your heirloom" block (Fine Art +$395, mini $345, spreads $55 or 5/$255, retouches $195).

6. FAQ: Chalet pre-order only · $1775 minus $355 · estate day à la carte. FAQ: not a studio session (strip-mall component).

7. Link pricing footer to /order (same domain). Grep: zero stale prices, vendor names, em dashes.
```

---

## Related

- `WEWEB_SWARM_CHANGES.md` · structural + pricing paste  
- `MCP_CHALET_COPY_APPLY.md` · element UIDs  
- `FULL_SWARM_AUDIT_2026-09-09.md` · launch readiness  
- `scripts/wwluxe-audit-pricing.mjs` · CI price grep
