# WWLuxe · Chalet / Mom VIP image spec

**Section:** The Chalet (Mom VIP) · `992fdc23-13a6-469a-9688-59e3a9d83f44`  
**Layout:** Split feature block (copy + large lifestyle image), not the 4:5 backdrop grid.

---

## Main Chalet image (section hero)

Use **landscape 4:3** for architecture, porch-between-ponds, and lounge interiors. Chalet reads as a *venue feature*, not a portrait tile.

| Setting | Value |
|---------|--------|
| **Aspect ratio** | **4:3** (landscape) |
| **Master export (default + hover)** | **1600 × 1200 px** each |
| **Minimum** | **1200 × 900 px** |
| **Format** | WebP · sRGB · **150–350 KB** per file |
| **Focal point** | Center · keep warmth (fireplace, grazing, pond glimpse, porch rails) in frame |
| **Safe crop** | If copy overlays image on mobile, keep key detail out of bottom **20%** |

### Dual state (same as backdrop plan)

| State | Filename | Shot idea |
|-------|----------|-----------|
| **Default** | `wwluxe-chalet-default-1600x1200.webp` | Exterior or wide lounge · ponds / porch context |
| **Hover / tap** | `wwluxe-chalet-hover-1600x1200.webp` | Interior detail · mocktails/grazing · cozy seating · firelight |

**Both files must be 1600 × 1200** (identical pixels) for swap without jump.

**Do not** use 1200×1500 here unless you deliberately crop the Chalet column as portrait in WeWeb (unusual for this section).

---

## Mom Milestone vignette (optional second asset)

If you add a **Mom + senior** or **Chalet porch** editorial shot (itinerary step, Experience card, or social proof):

| Setting | Value |
|---------|--------|
| **Aspect ratio** | **4:5** (portrait) |
| **Export** | **1200 × 1500 px** |
| **Default + hover** | Same size if you use two states |

```
wwluxe-mom-milestone-default-1200x1500.webp
wwluxe-mom-milestone-hover-1200x1500.webp
```

**Shot brief:** Curated vignette at pond edge, Chalet porch, or woodland edge · warm, guided, editorial (not yearbook lineup). Matches `KEEPSAKES_MOM_WALK_CANON.md`.

---

## Quick picker

| Use case | Size | Ratio |
|----------|------|-------|
| **Chalet section** (lounge / building / ponds) | **1600 × 1200** | 4:3 |
| **Backdrop grid zones** | **1200 × 1500** | 4:5 |
| **Mom Milestone people shot** | **1200 × 1500** | 4:5 |
| **OG / social share** (already set) | **1200 × 630** | ~1.91:1 |

---

## Lightroom export (Chalet pair)

1. Crop **4 × 3** · **1600 × 1200 px**
2. WebP quality **82–85**
3. Sharpen for screen after resize
4. Upload both to WeWeb media · bind default + `_wwHover` on section `ww-image`
