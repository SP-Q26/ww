# WW Venue — pre-push audit (Nov 4 2026)

Use this before you **git push** (SPQ `WW/weweb`) and **WeWeb publish**. Static tour files live in **`~/ww/public/`** — push that repo/hosting separately if the drawer loader is not updating.

---

## Version gate

| Artifact | Expected |
|----------|----------|
| `WW/weweb/VERSION` | **`2026.10.21.18`** |
| Project Head paste | `window.WW_HEAD_VERSION === "2026.10.21.18"` |
| WeWeb canvas | Publish after MCP so editor matches git intent |

---

## What this push contains (SPQ git)

### Project Head modules (paste into **Project Settings → Head**)

| Module | Role |
|--------|------|
| `ww-brand.css` + layout/season/responsive/mobile | Luxe shell, stats grid, sticky dock |
| `ww-weweb-production.css` | Season accents, stats number color, pond wipe clip-path |
| **`ww-heron-motion.css`** | **NEW** — stats fly-by + larger pond heron |
| **`ww-heron-motion.js`** | **NEW** — IO trigger on By The Numbers |
| `ww-luxe-motion.*` | Section rise-in |
| `ww-season-mood.js`, gallery, sticky, bridge | Season sync, drawer hooks |

### Config (`WW_SITE_CONFIG`)

- `active_season_var`, gallery vars, tokens, ratings — unchanged contract  
- `tour_loader_dotlottie: ""` — optional; rings in `~/ww/public/ww-tour-modal.*` until you set a URL  

### Not in this git tree (deploy elsewhere)

| Path | Change |
|------|--------|
| `~/ww/public/ww-tour-modal.js` | WWL-style ring loader + optional dotLottie |
| `~/ww/public/ww-tour-modal.css` | Loader rings, reduced motion |
| WeWeb canvas (MCP) | Barn GIF, map, heron, stats fly-by track, workflows |

---

## MCP canvas state (WW Venue · home)

| Feature | Element / workflow | Status |
|---------|-------------------|--------|
| Barn before GIF | `8101906a…` | Wired |
| Barn CTA → tour drawer | `c4e8f1a2…` | Wired |
| Property map | `c163e796…` | In walk column |
| Pond heron overlay | `9e414c6c…` `#ww-pond-heron` | **Taller (280px / 240 mobile)** + head CSS |
| Pond wipe | `wf_hotspot_tab_pond` | Tab replay class |
| **Stats heron fly-by** | `4e027208…` track + `40fc12f9…` image | **NEW** — scroll once |
| Mobile barn width | `8101906a…` tablet/mobile | `minWidth: 0` |

**Optional cleanup:** delete unused `activePropertySpot` (`b39e66c5…`) in editor if still present.

---

## Heron strategy (two beats, one asset)

1. **Walk · Pond tab** — dramatic wipe over still (`#ww-pond-heron` + tab workflow). Head v18 makes the GIF **larger and sharper** on the hotspot card.  
2. **By The Numbers** — single **fly-by** when the stats block enters view (`#ww-stats-heron-track` → `#ww-stats-heron-flyby`). Fits “proof” section without repeating on every page; estate wildlife as punctuation.

No second page required unless you want heron on **FAQ** or **Journal** later — same GIF + `#ww-stats-heron-track` pattern.

---

## Pre-push smoke (5 min)

1. Hard refresh preview — confirm head **v18**.  
2. Scroll to **By The Numbers** — heron crosses once (not on every pixel of scroll).  
3. Walk → **Pond** tab — wipe + **bigger** heron.  
4. Tour drawer — loader then Calendly.  
5. Mobile width — barn section no horizontal scroll.  
6. `prefers-reduced-motion` — heron visible/static, no fly animation.

---

## Push order (recommended)

1. **Git push** SPQ (`WW/weweb/*`, docs).  
2. **Re-paste** full `WEWEB_HEAD_PASTE.html` in WeWeb Project Head.  
3. **WeWeb Publish** (MCP elements + workflows).  
4. Deploy **`~/ww/public`** tour modal if loader changed.  
5. Production smoke on `whisperingwoodsevents.com` (or preview URL).

---

## Risk notes (low)

- **`:has()` selectors** in production CSS — supported in current Safari/Chrome; stats accent still works without `:has` on very old browsers.  
- **Head size** ~118k chars — within WeWeb head limits; rebuild only via `build-head-paste.py`.  
- **Gallery bulk** — still manual; not blocking this push.

---

*Related: `WWE_MCP_SWEEP_NOV4_2026.md`, `WWE_AUDIT_V39_NOV4_2026.md`, `GO_LIVE_EXECUTE_OCT21_2026.md`*
