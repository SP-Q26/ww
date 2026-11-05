# WW Venue — MCP sweep audit (Nov 4 2026 · post head paste)

**WeWeb project:** `cbd9a95f-c61e-441a-87cb-b25006511440`  
**Git head canon:** `2026.10.21.17` (`WEWEB_HEAD_PASTE.html` — re-paste for heron wipe CSS)  
**Static tour modal:** `~/ww/public/ww-tour-modal.{js,css}` (deploy with Vercel / WeWeb static origin)

---

## MCP changes applied this sweep

| Item | Element / workflow | Change |
|------|-------------------|--------|
| Barn before GIF | `8101906a…` timber peg | `beforeImageUrl` → `Barn_Gif_-_7.42.gif`; cleared mixkit video |
| Barn CTA | `8101906a…-ctaClick` | → `execute-workflow:c4e8f1a2…` (tour drawer) |
| Property map | `c163e796…` **Property Map Image** | `*Map.png` between tab row and hotspot card |
| Heron pond | `9e414c6c…` **Heron Pond Overlay** | `Heron.gif`, `#ww-pond-heron`, shows when `activeHotspot == the-pond` |
| Heron wipe | `wf_hotspot_tab_pond` | After set variable → `custom-js` adds `ww-heron-wipe-play` |
| Hotspot card | `57f798be…` | `position: relative`, `overflow: hidden` |
| Breakpoint fix | `8101906a…` | **mobile/tablet** `minWidth: 0`, `maxWidth: 100%` (was 35rem horizontal leak) |

**Not deleted (needs approval):** unused `activePropertySpot` `b39e66c5…` — safe to remove in editor if still unbound.

---

## Breakpoint audit (MCP `getPageElementsByUid`)

WeWeb breakpoints: **default (desktop) → tablet → mobile** (cascade).

| Zone | default | tablet | mobile | Verdict |
|------|---------|--------|--------|---------|
| **Hero shell** `df7f8a87…` | min 100svh, max 860px | Same | Same | OK — aligned across breakpoints |
| **Hero CTA** `1172c8dd…` | inline-flex, accent borders | width 100%, max 320px | OK | OK |
| **Hotspot container** `5663e144…` | max 28rem, 20px pad | *(inherits)* | *(inherits)* | OK — luxe column |
| **Tab row** `d9fd9f03…` | horizontal scroll, snap | row + 4px pad | OK | OK — touch strip |
| **Timber peg** `8101906a…` | minWidth **35rem** | minWidth **0**, max 35rem | minWidth **0**, width 100% | **Fixed** — mobile no longer forces 560px scroll |
| **Tour modal CSS** | right sheet 440px | — | bottom sheet 94vh | OK (git `ww-tour-modal.css`) |
| **Sticky dock** | user confirmed working | head CSS `#ww-sticky-nav` mobile collapsible | OK | OK |

**Follow-ups (optional MCP):**

- Move **Property Map** above tab row (order: title → map → tabs → card) if you want map-first storytelling.
- **Desktop barn** `minWidth: 35rem` inside narrow page shell — if barn section still feels wide, set **default** `maxWidth: 28rem` on slider style to match hotspots.

---

## Tour modal loader (WWL-style)

**Shipped in `ww/public/ww-tour-modal.js` + `.css`:**

- Default: **gold + sage pulsing rings** + italic “Opening your tour…” (same family as WW Luxe welcome / WWL splash, dark pine palette).
- Optional **dotLottie**: set in Project Head config:

```js
window.WW_SITE_CONFIG = {
  // ...
  tour_loader_dotlottie: "designs/cbd9a95f-…/sections/YourLoader.dotlottie?_wwcv=…",
};
```

No Lottie file exists in WW Venue media yet — upload a `.dotlottie` to Images, paste URL above, rings hide automatically.

**Deploy:** push/copy updated `ww-tour-modal.js` + `.css` to the origin your boot loads (preview + production). Hard refresh after deploy.

---

## Git head delta (re-paste)

| File | Change |
|------|--------|
| `ww-weweb-production.css` | `#ww-pond-heron` wipe keyframes + reduced motion |
| `VERSION` | **2026.10.21.17** |
| `WEWEB_HEAD_PASTE.html` | Rebuilt |

After re-paste: confirm `window.WW_HEAD_VERSION === "2026.10.21.17"`.

---

## Smoke checklist

- [ ] Tour drawer: rings loader → Calendly iframe fade-in
- [ ] Barn slider: Barn_Gif before side; no horizontal scroll on phone
- [ ] Walk: map PNG visible; Pond tab → heron wipe over still (**larger overlay v18**)
- [ ] **By The Numbers: heron fly-by once on scroll**
- [ ] Hero + sticky tour CTAs → drawer (not new tab)
- [ ] Season tabs → accents + no gallery console spam
- [ ] Head version **2026.10.21.18**

---

## Next publish

1. WeWeb **Publish** (canvas MCP edits).  
2. Re-paste **Project Head** v17 if not already.  
3. Deploy **tour modal** static files to hosting origin.  
4. Optional: delete `activePropertySpot` variable in WeWeb.
