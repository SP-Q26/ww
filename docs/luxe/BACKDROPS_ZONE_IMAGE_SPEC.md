# WWLuxe · Editorial zone images (crop spec)

**Section:** The Backdrops / Venue Preview · `612ce5bc-58e2-4291-a7ca-e8dc2328bde4`  
**Grid:** `583d23ff-19c2-45ff-bed2-1e3e8dad6c26` · 3 columns desktop · 2 tablet · 1 mobile  
**Image element:** `ww-image` per zone · `object-fit: cover` · full card width

---

## Exact export size (all zone cards)

| Setting | Value |
|---------|--------|
| **Aspect ratio** | **4:5** (portrait) |
| **Master export (default + hover)** | **1200 × 1500 px** each |
| **Minimum** | **800 × 1000 px** (do not go smaller · soft on retina) |
| **Format** | **WebP** primary · JPG 80% backup for WeWeb upload |
| **Color** | sRGB · slight warmth OK · match estate grade |
| **Focal point** | **Center, slightly low** · label overlay sits on bottom third |
| **Safe crop** | Keep subject/horizon out of bottom **25%** (text overlay) |
| **Target file weight** | **120–280 KB** per WebP (12 files ≈ 1.5–3 MB total section) |

**Both states same pixels.** Default and hover/tap swaps must be **identical 1200×1500** so the card does not jump on hover (WeWeb `object-fit: cover` + image swap).

### Dual image per zone (your swarm plan)

| State | Filename pattern | Creative |
|-------|------------------|----------|
| **Default** | `wwluxe-zone-{slug}-default-1200x1500.webp` | Establishing shot · wide context · golden/estate mood |
| **Hover / tap** | `wwluxe-zone-{slug}-hover-1200x1500.webp` | Alternate angle · tighter editorial · reflection/detail · or “alive” moment (path, ripples, light shift) |

**12 files total** (6 zones × 2). Same crop box and safe zone on both; only content changes.

**Slugs:** `meadow` · `willows` · `ponds` · `barns` · `gardens` · `projector`

**Do not** ship hover at a different aspect ratio or resolution (no 3:4 hover + 4:5 default).

### On-screen size (why 1200×1500 is enough)

| Breakpoint | Card width (approx) | Display height @ 4:5 | Retina need |
|------------|---------------------|----------------------|-------------|
| Desktop 3-col | ~340–380 px | ~425–475 px | 1200 px wide master covers ~3× |
| Tablet 2-col | ~340–400 px | ~425–500 px | OK |
| Mobile 1-col | ~100% (~360–390 px) | ~450–490 px | OK |

WeWeb serves one URL per `ww-image`; upload both to media library and bind default on the base image, hover on `_wwHover` state image (or second image toggled in card workflow).

**Why 4:5:** Zone cards are portrait tiles in a 3-column grid (~330–360px wide on desktop). `cover` crops landscape uploads aggressively; **shoot or crop portrait** so meadow sky, pond reflections, and barn facades survive the frame.

**Do not use:** 16:9 hero crops · 1:1 Instagram squares · ultra-wide panorama strips.

---

## Per-zone shot direction (for your photog / estate library)

| Zone | Image UID | Shot brief |
|------|-----------|------------|
| Meadow | `0ca331a4-e215-4864-9c88-56af1cbcbad6` | Open field, golden-hour grass, horizon upper third |
| Willows | `c4891d05-2352-4acb-a7cb-a33920db3618` | Weeping willow tunnel, dappled light |
| Ponds | `4fc69c27-63e3-4a93-97e8-b4f77f4f27ec` | Still water + reflection (any of three ponds) |
| Barns | `7efa77b6-2a88-49d2-80e3-6f66fefb6963` | Weathered wood, door or texture · vertical crop |
| Gardens & Paths | `c7356a51-b6ce-41ee-b2b9-589b62beaa0f` | Walled garden, stone path, or raspberry vines |
| Projector Room | `7ca643e7-99fc-4ad5-a266-3e630f40e267` | Moody interior · cinematic · rain backup |

**Not on the 6-card grid (copy only):** wooded aisle · stone walls · iron fences · specimen trees · Chalet porch · golf-cart paths · listed in section subtitle / chip row so you don’t need 12+ tiles at launch.

---

## Naming convention (media library)

```
wwluxe-zone-meadow-default-1200x1500.webp
wwluxe-zone-meadow-hover-1200x1500.webp
wwluxe-zone-willows-default-1200x1500.webp
wwluxe-zone-willows-hover-1200x1500.webp
…
```

Upload via WeWeb media → bind each `ww-image` `content.default.url`.

---

## Optional expansion (8–10 cards later)

If you add Zone 7–8 cards to the grid, **same 1200×1500** · do not mix aspect ratios. Consider:

- **Wooded Aisle** · tree-lined path, vanishing point center  
- **Stone Walls & Fences** · texture + leading lines  

Grid becomes 4×2 or 5×2; keep mobile stack 1-column.

---

## MCP copy targets

See `MCP_BACKDROPS_COPY_APPLY.md` for headline, subtitle, zone labels, and optional “+ dozens more” chip.
