# Luxe · production splash audit (green only, no rings/tree)

**Date:** 2026-09-19  
**Report:** Circle + tree never visible on apex — pine plate then site.  
**Prod:** `https://whisperingwoodsluxe.com/` · git `main` @ v44 export (`2aad405`+)

---

## Executive summary

| Finding | Severity | Verdict |
|---------|----------|---------|
| **Welcome splash branch gate** | **FIXED** | Was preview-only; **`main` + `preview`** now share the same inject (operator promote 2026-09-19). |
| **Canvas Hero Sprout Loader present in v44** | OK | `17f047b4` + SVG child `1b928beb` in home export; `heroVideoReady` default **false**. |
| **Head `::before` green veil over hero section** | **P0** | Project Head painted a full-bleed gradient **on top of** the sprout splash (same `z-index: 1`) → user sees **only green** until `data-ww-hero-video-ready`. |
| **Stale Head video UID `63c3ad17…`** | **P1** | v44 hero iframe lives in wrap **`0189df0a…`**; old Head selectors were no-ops; boot inject partially compensated. |
| **Assets** | OK | `/heirloom/assets/heirloom-splash-tree-static.svg` **200** (used by preview inject, not canvas SMIL tree). |

**Fix (git):** Remove section `::before`; raise `#ww-hero-splash` / `17f047b4` z-index; align Head bridge to **`0189df0a`** — `index.html` + `WEWEB_PROJECT_HEAD_BRIDGE_v26.html`.

**Also paste** updated bridge into WeWeb **Project Head** if canvas Head diverges from git `index.html`.

---

## Expected owners by environment

| Layer | Preview (`VERCEL_GIT_COMMIT_REF=preview`) | Production (`main`) |
|-------|-------------------------------------------|---------------------|
| First paint | Vercel critical splash (rings + static SVG) | Pine only (`wwCriticalFirstPaint` + hero section bg) |
| Handoff | Canvas **Hero Load Splash** + **Hero video boot** | Same canvas stack only |
| Ready semaphore | `data-ww-hero-video-ready` + `heroVideoReady` var | Same |

---

## Timeline (broken prod)

1. **0ms** — Pine `#141f19` (Head + hero section).  
2. **0–1200ms+** — Head `::before` **covers** Hero Sprout Loader (rings/tree underneath).  
3. **Boot** — `markReady()` after `SPLASH_MIN_MS` / iframe / 2s cap → `data-ww-hero-video-ready="1"`, `heroVideoReady=true` → splash opacity **0**, video fades in.  
4. **Perceived** — “green then site” with **no** circle/tree.

---

## Canvas truth (v44 home JSON)

| Resource | UID | Notes |
|----------|-----|--------|
| Hero section | `68072bf6-…` | Parent of video wrap + splash |
| Hero video wrap | `0189df0a-…` | iframe target for boot + Head |
| Hero Load Splash | `17f047b4-…` (`#ww-hero-splash`) | Same gradient as removed `::before` |
| Hero Sprout Loader | `1b928beb-…` | Inline SVG + SMIL stroke reveal |
| `heroVideoReady` | `dafc47f7-…` | default `false`, not localStorage |

---

## Verification after fix deploy

1. Hard refresh `/` — **gold/sage rings + drawing tree** on pine for ~1.2s minimum.  
2. Cross-dissolve to hero video (no blank flash).  
3. DevTools: no `html:not([data-ww-hero-video-ready]) .ww-element-68072bf6::before` rule in live Head.  
4. Preview branch unchanged — still has **both** critical + canvas beats.

---

## Related

`HERO_BRAND_REVEAL.md` · `SPLASH_SKELETON_CANON.md` · `SWARM_AUDIT_PREVIEW_V43_2026-09-19.md`
