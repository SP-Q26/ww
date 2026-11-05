# WW Venue — full audit (WeWeb publish v39 · Nov 4 2026)

**Project:** `cbd9a95f-c61e-441a-87cb-b25006511440` (WW Venue)  
**Home page:** `385ba910-fe19-436b-a205-edc2ec8b88a7`  
**WeWeb deploys:** production **v39** (`2026-11-04T22:58Z`, label `vvvvvv`); newer **v40** exists — confirm which env you smoke-test.

**Git lanes (do not confuse):**

| Lane | What v39 means here |
|------|---------------------|
| **WeWeb → GitHub** (your publish) | Embedded JSON + assets on the branch WeWeb pushes to — **source of truth for canvas** after publish. |
| **`SPQ/WW/weweb/`** | Head/CSS/JS **canon** (`VERSION` **2026.10.21.16**) — applies only after **Project Head paste** + optional re-merge from export. |
| **`SPQ` `weweb-export` branch** | **SPQ (spquant)** export — not WW Venue. |
| **`~/ww` `venue` branch** | Static tour modal + Vercel — separate from WeWeb publish v39. |

---

## 1. Assets — uploaded vs wired

| Asset | In WeWeb media (sections) | On canvas (MCP element read) |
|-------|---------------------------|------------------------------|
| **Barn_Gif_-_7.42.gif** | Yes `_wwcv=1793833199188` | **No** — timber slider still uses **`200w.gif`** (`8101906a…`) |
| **Heron.gif** | Yes `_wwcv=1793833401295` | **No** — not referenced on home |
| **\*Map.png** | Yes `_wwcv=1793833444818` | **No** — Walk section is tabs + card only (map-pin icon, no map art) |
| Chalet stills | Yes (existing webp) | **Yes** — chalet section + hotspot binding |
| Map / barn in git head | N/A | Head has **`ww-property-map.js`** + CSS — **not mounted** (no `[data-ww-property-map]` on page) |

**Conclusion:** v39 successfully **uploaded** media; **execution gap** is canvas wiring + optional head CSS for heron wipe.

---

## 2. Section / UX audit (post–v39)

| Area | Status | Gap |
|------|--------|-----|
| Hero video + CTA | Live | Confirm **Project Head** `2026.10.21.16` for iframe + season CSS (paste if console `WW_HEAD_VERSION` is older). |
| Season tabs | Live | Single `activeSeason` `6e7f5084…`; boot should sync `data-season`. |
| Gallery preview | Live | **`activeGallerySeason` `301d0edc…`** OK; bulk upload deferred — preview still mixed Unsplash/placeholder. |
| Walk the Property | Live | **`activeHotspot` `0bb2635e…`** drives card; **7 tabs** wired. |
| Walk map | Missing | Drop **\*Map.png** above tabs or above card; pins optional later. |
| Pond / heron | Missing | Recommended: **pond-tab heron wipe** (see plan below). |
| Barn story | Partial | Slider works but **wrong before asset**; CTA workflow still **Calendly new tab** on component — should use **WW Open Tour Drawer**. |
| Chalet | OK | User confirmed in place. |
| Tour drawer | Boot + function `c4e8f1a2…` | Vercel/static needs **`ww-tour-modal.*`** on origin (see `~/ww/public`). |
| Sticky dock | Unknown | Manual DOM order if overlap persists. |
| Dead variable | **`activePropertySpot` `b39e66c5…`** | Appears **unused** (hotspot uses `activeHotspot`) — delete after grep in export. |

---

## 3. How to execute (division of labor)

### A. WeWeb MCP (canvas) — do first

Wire uploaded assets without waiting for gallery bulk or full `ww-property-map.js`.

### B. Git head (`SPQ/WW/weweb`) — parallel

Add small CSS module for pond heron wipe + map frame; bump `VERSION`; `python3 WW/weweb/build-head-paste.py`.

### C. You (one manual step)

Paste rebuilt **`WEWEB_HEAD_PASTE.html`** → **Project Settings → Custom code → Head** (not Home page head).

### D. Publish + git

WeWeb **Publish** → your GitHub v41 (or next) → smoke preview/production → merge **`~/ww`** tour static files if drawer 404s.

---

## 4. MCP change plan (ordered)

### Phase 0 — Preflight (read-only MCP)

- [ ] `getPageSemantic` home — confirm section order unchanged after your v39 edits.
- [ ] `getPageElementsByUid` — `8101906a`, `5663e144`, `57f798be`, `1bf2cac6`, `1172c8dd`.
- [ ] `searchVariables` — confirm no bindings on `activePropertySpot` before delete.

### Phase 1 — Barn GIF (5 min)

| Tool | Target | Change |
|------|--------|--------|
| `editElement` | `8101906a…` timber-peg-slider | `content.default.beforeImageUrl` → `designs/.../Barn_Gif_-_7.42.gif?_wwcv=1793833199188`; clear or ignore `beforeVideoUrl` for production. |
| `editFrontendWorkflow` | `8101906a…-ctaClick` | Replace `change-page` Calendly with `execute-workflow:c4e8f1a2-9b3d-4e5f-a6c7-8d9e0f1a2b3c` (same as hero CTA). |

### Phase 2 — Property map (10 min)

| Tool | Target | Change |
|------|--------|--------|
| `addElements` | Parent `5663e144…`, slot `children`, **after** title `0677da5f…`, **before** tab row `d9fd9f03…` | `ww-image` **Property Map** — static url `*Map.png?_wwcv=1793833444818`, `objectFit: contain`, height ~220–280px, gold border match hotspot card. |
| `editDesignSystemGuidelines` | append | “Walk map: contained PNG, not full bleed.” |

Optional later: replace with `[data-ww-property-map]` + `ww-property-map.js` when pins JSON is ready.

### Phase 3 — Heron pond wipe (20 min)

| Tool | Target | Change |
|------|--------|--------|
| `addElements` | Inside `57f798be…` Hotspot Description Box, **after** `1bf2cac6…` Hotspot Image | `ww-image` **Heron Overlay** — url `Heron.gif?_wwcv=1793833401295`, `objectFit: contain`, absolute layer. |
| `editElement` | `57f798be…` | `style.default.position: relative`, `overflow: hidden`. |
| `editElement` | new heron uid | `style.default`: absolute inset, `pointer-events: none`, `conditionalRendering` formula: `variables['0bb2635e…'] == 'the-pond'`. |
| `editElement` | heron | Class or `attributes.id: ww-pond-heron`; `animationPlayState` / customCss hook for wipe (or rely on head CSS `#ww-pond-heron.is-wipe`). |
| `editFrontendWorkflow` | each pond tab click **or** one page function | On `activeHotspot` → `the-pond`: add class `is-wipe` via `custom-js` in tab workflow **or** boot listener (prefer **tab workflow** after `update-variable` so one shot per visit). |

**Git (same release):** add to `ww-weweb-production.css`:

- `@keyframes ww-heron-wipe` (clip-path inset)
- `@media (prefers-reduced-motion: reduce)` — static first frame
- Rebuild head paste.

### Phase 4 — Hotspot media polish (optional)

| Tool | Target | Change |
|------|--------|--------|
| `editElement` | `1bf2cac6…` JS binding | Point `the-pond` still to best pond webp (already Megan 3235); heron overlay handles motion. |
| `deleteVariable` | `b39e66c5…` | If unused. |

### Phase 5 — Boot / tour sanity

| Tool | Target | Change |
|------|--------|--------|
| `editFrontendWorkflow` | `a8f3c2e1…` WW Site Boot | Ensure `GALLERY_SEASON_VAR` typo-free; tour asset base matches preview origin. |
| Review | `b7e2c1f0…` WW Tour Drawer Loader | Dedupe with boot if double-loading scripts. |

### Phase 6 — Publish & smoke

- [ ] Publish WeWeb → git.
- [ ] Paste Project Head if VERSION bumped.
- [ ] Preview: barn before=GIF, map visible, pond tab=heron wipe, tour drawer, season accents, no gallery var errors.
- [ ] Push `~/ww/public` tour files if needed.

---

## 5. Canonical asset URLs (MCP copy-paste)

```
Barn:  designs/cbd9a95f-c61e-441a-87cb-b25006511440/sections/Barn_Gif_-_7.42.gif?_wwcv=1793833199188
Heron: designs/cbd9a95f-c61e-441a-87cb-b25006511440/sections/Heron.gif?_wwcv=1793833401295
Map:   designs/cbd9a95f-c61e-441a-87cb-b25006511440/sections/*Map.png?_wwcv=1793833444818
```

---

## 6. Explicitly deferred (per your call)

- Gallery bulk upload (200+)
- Full interactive `property_hotspots.json` + pins on map
- Wildlife “cross-screen” band (optional; pond wipe is enough for launch)

---

## 7. Next agent turn

Say **“run MCP phase 1–3”** to implement barn + map + heron on canvas, and **“add head CSS for heron”** to patch git + rebuild paste in the same pass.
