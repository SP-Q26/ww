# Luxe · hero brand reveal (vocabulary)

**Portable pattern (weaponize elsewhere):** `docs/patterns/BRAND_ARRIVAL_CROSS_DISSOLVE.md` — codename **arrival dissolve**.

What you built in WeWeb for the home hero is a deliberate **brand moment** before the estate video takes over. Use these names when briefing designers, copy, or future agents.

## Canvas names (WeWeb)

| Resource | Name | UID (reference) |
|----------|------|-----------------|
| Overlay on hero | **Hero Load Splash** | `17f047b4-78f5-44c4-94a0-e24018d60df9` |
| Rings + sprout/tree mark | **Hero Sprout Loader** | `1b928beb-…` (nocode / loader block) |
| Orchestration | **Home · Hero video boot** | Page workflow · git `docs/luxe/canvas/hero-video-boot.js` |
| Ready flag | `heroVideoReady` | `dafc47f7-259a-4c95-a431-e28e229c6b46` |
| DOM gate | `data-ww-hero-video-ready="1"` | Set by boot workflow (min **1.2s** splash beat) |

Asset: `hero-splash-tree.svg` / `heirloom-splash-tree.svg` (animated sprout-to-tree on canvas; static variant for Vercel welcome).

## Style terms (industry)

| Term | What it means here |
|------|---------------------|
| **Cross-dissolve** | Splash/tree **fades out** while hero/video **fades in** on the same pine plate — overlap, not a hard cut. This is the “classy” feel. |
| **Fade-through** | Material Motion family name for the same idea when **background color is shared** (`#141f19`) so the eye reads one continuous arrival. |
| **Branded preloader** / **identity splash** | Short full-bleed mark (tree + gold/sage rings) before primary content — not a generic spinner. |
| **Stroke reveal** / **line-draw** | SVG paths animating from sprout to tree (SMIL or canvas timeline) — editorial “draw-on” mark. |
| **Arrival sequence** | Hospitality/editorial wording for the full beat: pine → mark → hero. |
| **Hero handoff** | Engineering: one clock (`data-ww-hero-video-ready`) hides splash, reveals YouTube crop, avoids double-splash races. |

## Preview welcome (git inject)

`inject-luxe-critical-boot.mjs` on branch **`preview`** mirrors the same **cross-dissolve** intent: critical splash dismisses, then canvas hero continues. Canon timing: `SPLASH_SKELETON_CANON.md` · `WELCOME_SPLASH_PREVIEW.md`.

**Operator sign-off (2026-09-18):** preview welcome timing (420ms hold, 780ms floor, 1.6s wall) approved for feel.

## Do not confuse with

- **Skeleton screen** — gray shimmer placeholders for layout (`/booked`, order paths).
- **Section fade-up** — scroll-triggered content reveals lower on the page.
- **Stinger** — TV/film 2–5s logo bumper; Luxe beat is shorter and tied to video readiness.
