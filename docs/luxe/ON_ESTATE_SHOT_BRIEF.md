# WWLuxe · On-estate shot brief

**Use on property.** Goal: **14 required files** (12 backdrop + 2 Chalet) for hover swaps on the site. Optional: Mom Milestone pair.

**Brand feel:** Private European estate · wedding-grade production · warm editorial · not yearbook · not strip-mall studio. Golden, earthy, timeless. No heavy filters. Slight warmth in grade is fine.

---

## Global rules (every shot)

| Rule | Spec |
|------|------|
| **Backdrop cards** | **4:5 portrait** · export **1200 × 1500 px** |
| **Chalet section** | **4:3 landscape** · export **1600 × 1200 px** |
| **Pairs** | Default + hover = **same pixel dimensions** (no jump on hover) |
| **Safe zone** | Keep hero subject / horizon out of **bottom 25%** (zone label overlay) |
| **Focal point** | Center, slightly low |
| **Format** | WebP q82–85 · sRGB · **120–280 KB** (zones) · **150–350 KB** (Chalet) |
| **People** | **No faces required** on zone cards (estate sells the estate). Chalet: lifestyle OK, no identifiable minors without release |
| **Weather** | Shoot what you have. Rain/mood = bonus for Barn + Projector |

**Do not shoot for web:** 16:9-only frames · 1:1 squares · ultra-wide panoramas you’ll crop later · different aspect ratios for default vs hover.

**WeWeb wiring (after export):** Default image on `ww-image` · hover image on `_wwHover` state (or stacked pair).

**Specs:** `BACKDROPS_ZONE_IMAGE_SPEC.md` · `CHALET_MOM_IMAGE_SPEC.md`

---

## Shot list · 6 zones × 2 = **12 files**

For each zone: **same tripod height / same crop intent** for both frames. Default = context. Hover = detail, angle, or “alive” moment.

### 1 · The Meadow · `meadow`

| | File | Direction |
|---|------|-----------|
| **DEFAULT** | `wwluxe-zone-meadow-default-1200x1500.webp` | Open field · golden grass · horizon in **upper third** · sky breathing room · feels vast, private |
| **HOVER** | `wwluxe-zone-meadow-hover-1200x1500.webp` | Tighter on grass texture / path through meadow · or sun flare / wind in grass · same 4:5 box |

**Avoid:** Flat midday harsh shadow · power lines · parked cars · wedding signage.

### 2 · The Willows · `willows`

| | File | Direction |
|---|------|-----------|
| **DEFAULT** | `wwluxe-zone-willows-default-1200x1500.webp` | Weeping willow tunnel · dappled light · path or aisle leading in · romantic, sheltered |
| **HOVER** | `wwluxe-zone-willows-hover-1200x1500.webp` | Closer on cascading branches · light filtering through leaves · or low angle up into canopy |

**Avoid:** Dead brown winter unless that’s the only day (prefer green/gold).

### 3 · Pond / Reflection · `ponds`

*(Site may say “Pond 3” or “Reflection Pond” — one card represents all three ponds.)*

| | File | Direction |
|---|------|-----------|
| **DEFAULT** | `wwluxe-zone-ponds-default-1200x1500.webp` | Still water · clean reflection · trees/sky mirrored · calm, editorial |
| **HOVER** | `wwluxe-zone-ponds-hover-1200x1500.webp` | Ripples · dock edge · reeds · or Chalet glimpse across water · “alive” water moment |

**Avoid:** Murky algae close-up · floating debris · bright blown-out sky with no reflection.

### 4 · The Barn · `barns`

| | File | Direction |
|---|------|-----------|
| **DEFAULT** | `wwluxe-zone-barns-default-1200x1500.webp` | Weathered wood · door or facade · **vertical-friendly** composition · warm side light |
| **HOVER** | `wwluxe-zone-barns-hover-1200x1500.webp` | Texture detail · hardware · hayloft shadow · or interior threshold (moody, not cluttered) |

**Rain-day hero:** This zone + Projector carry the “rain or shine” promise.

### 5 · Gardens & Paths · `gardens`

*(Covers walled garden, stone paths, raspberry path, iron fences — one card for the cluster.)*

| | File | Direction |
|---|------|-----------|
| **DEFAULT** | `wwluxe-zone-gardens-default-1200x1500.webp` | Stone path or walled garden · leading lines · depth · estate-curated, not wild |
| **HOVER** | `wwluxe-zone-gardens-hover-1200x1500.webp` | Raspberry vines / berry tones · iron fence detail · or specimen tree + path bend |

**Bonus B-roll (copy only, no extra card):** wooded aisle · golf-cart path — shoot if easy; site lists these in subtitle/chips only.

### 6 · Projector Room · `projector`

| | File | Direction |
|---|------|-----------|
| **DEFAULT** | `wwluxe-zone-projector-default-1200x1500.webp` | Moody interior · cinematic · projector beam or shadow play · editorial, not office |
| **HOVER** | `wwluxe-zone-projector-hover-1200x1500.webp` | Tighter on light/shadow on wall · seating silhouette · or lens flare / grain texture |

**This is your indoor rain backup** — make it feel intentional, Vogue-adjacent.

---

## Shot list · Chalet · **2 files**

**4:3 landscape · 1600 × 1200 px each.** Mom VIP section (split layout, not the grid).

| | File | Direction |
|---|------|-----------|
| **DEFAULT** | `wwluxe-chalet-default-1600x1200.webp` | **Exterior or wide lounge** · porch-between-ponds context · building + landscape · welcoming |
| **HOVER** | `wwluxe-chalet-hover-1600x1200.webp` | **Interior warmth** · fireplace glow · mocktail/grazing styling · cozy seating · firelight (no brand labels on bottles) |

**Staging tips (quick):** One grazing board · one mocktail glass · throw on fireplace if safe · tidy cables · warm lamps, not overhead fluorescent.

**Safe crop:** On mobile, copy may sit below image; still keep fireplace/mocktails **center-weighted**.

---

## Optional · Mom Milestone · **2 files** (P2)

Only if you have time + talent/release.

| | File | Direction |
|---|------|-----------|
| **DEFAULT** | `wwluxe-mom-milestone-default-1200x1500.webp` | Mom + senior at pond edge, Chalet porch, or woodland · guided, editorial · connection, not posed lineup |
| **HOVER** | `wwluxe-mom-milestone-hover-1200x1500.webp` | Closer moment · hands, laugh, walking together · same 4:5 |

**Not:** cap-and-gown lineup · stiff yearbook smile · “say cheese.”

---

## Walk order (efficient estate loop)

1. **Chalet** — stage interior hover first while light is soft; grab exterior default from porch
2. **Ponds** — reflection best early/late · Chalet in background if possible
3. **Meadow** — open sky · golden hour priority
4. **Willows** — shaded · even light all day
5. **Gardens / paths** — raspberry path if in season
6. **Barn** — side light morning or evening
7. **Projector** — anytime · control artificial light

**Time budget:** ~2–3 hours on property for 14 required frames if you pre-scout. Double-shoot default + hover at each stop before moving.

---

## Export checklist (tonight)

```
[ ] 12 zone files named exactly: wwluxe-zone-{slug}-{default|hover}-1200x1500.webp
[ ] 2 Chalet files: wwluxe-chalet-{default|hover}-1600x1200.webp
[ ] Every pair: identical pixel dimensions
[ ] Bottom 25% clear on zones (label safe)
[ ] WebP q82–85 · sharpen for screen · sRGB
[ ] Upload to WeWeb media library
[ ] Bind default + _wwHover on each ww-image
[ ] Desktop hover test: no jump · no layout shift
```

---

## Filename cheat sheet

```
wwluxe-zone-meadow-default-1200x1500.webp
wwluxe-zone-meadow-hover-1200x1500.webp
wwluxe-zone-willows-default-1200x1500.webp
wwluxe-zone-willows-hover-1200x1500.webp
wwluxe-zone-ponds-default-1200x1500.webp
wwluxe-zone-ponds-hover-1200x1500.webp
wwluxe-zone-barns-default-1200x1500.webp
wwluxe-zone-barns-hover-1200x1500.webp
wwluxe-zone-gardens-default-1200x1500.webp
wwluxe-zone-gardens-hover-1200x1500.webp
wwluxe-zone-projector-default-1200x1500.webp
wwluxe-zone-projector-hover-1200x1500.webp
wwluxe-chalet-default-1600x1200.webp
wwluxe-chalet-hover-1600x1200.webp
```

---

## Not in this shoot (already handled or copy-only)

| Asset | Notes |
|-------|--------|
| **Hero** | Full-bleed video or wide still · separate from grid · golden estate, senior energy |
| **Experience cards** | Emoji/icons · no photos required |
| **Social proof** | Real quotes only · do not stage fake testimonials |
| **OG social** | 1200×630 · can pull from meadow or Chalet wide later |

---

**Minimum viable launch:** 14 files above. **Nice-to-have:** Mom Milestone pair + hero refresh same day while crew is on property.
