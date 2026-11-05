# WW Venue — full audit · WeWeb publish v41 (Nov 4 2026)

**Project:** `cbd9a95f-c61e-441a-87cb-b25006511440` (WW Venue)  
**Git head canon:** `2026.10.21.18` (`WW/weweb/WEWEB_HEAD_PASTE.html`)  
**User publish:** **v41** (canvas)  
**Repo push target:** `SP-Q26/ww` · branch **`venue`** (`weweb/`, `docs/events/`) — **not** `SP-Q26/SPQ` main.

---

## Executive summary

| Layer | Status | Action for live smoke |
|-------|--------|------------------------|
| **WeWeb v41 canvas** | Published — barn GIF, tour CTAs, map card, heron, stats fly-by track | Smoke on preview + custom domain |
| **Project Head (live)** | **Still `2026.10.21.16`** on `unyielding-publisher-production.weweb.io` | **Re-paste** full head **v18** after git push |
| **Git `WW/weweb`** | **v18** — heron motion, Google tour URL in config/head, boot snippet sync | **Commit + push** (this pass) |
| **`~/ww/public` tour modal** | Separate deploy; embed logic may still assume Calendly query params | Confirm iframe loads **Google** appointment URL |

---

## v41 canvas vs prior sweep

### Confirmed wired (MCP)

| Feature | ID / notes |
|---------|------------|
| Hero / sticky / FAQ / footer tour CTAs | → `WW Open Tour Drawer` `c4e8f1a2…` |
| Barn timber peg before image | `Barn_Gif_-_7.42.gif` |
| Barn slider CTA | `execute-workflow:c4e8f1a2…` |
| **Walk map** | `*Map.png` in **`57f798be…` map card** (v41: card wrapper + pills + extra children — not flat image only) |
| **Pond heron** | `c2c0c7a2…` `#ww-pond-heron` (replaces earlier `9e414c6c…` uid) · 280px / 240 mobile |
| **Stats heron fly-by** | `4e027208…` `#ww-stats-heron-track` + `40fc12f9…` `#ww-stats-heron-flyby` |
| **New app workflow** | `WW Tour Drawer Loader` `b7e2c1f0…` (onload-app) — loads tour assets in editor/publish |

### v41 user/editor changes (audit)

1. **Numbers heron track** — `backgroundImage: Heron.gif` on track **and** child fly-by image → may look busy; optional: remove background on track, keep child + head CSS animation only.  
2. **Map card** — `minWidth: 369px`, `minHeight: 330px` on `57f798be…` → **mobile horizontal scroll risk** (tablet/mobile overrides weak).  
3. **Barn slider** — desktop `minWidth: 39rem` again (mobile/tablet `0` OK).  
4. **Duplicate variables** — two `activePropertySpot` (`a7e3f3ff…`, `b39e66c5…`); live site uses `activeHotspot` (`0bb2635e…`). Delete duplicates in WeWeb when safe.  
5. **Head version drift** — publish v41 **does not** auto-update Project Head; production HTML still **v16** without re-paste.

---

## Git canon (this commit)

| Path | Purpose |
|------|---------|
| `WW/weweb/WEWEB_HEAD_PASTE.html` | Full project head @ **v18** |
| `WW/weweb/ww-heron-motion.{css,js}` | Stats fly-by + pond sizing |
| `WW/weweb/ww-site-boot-snippet.js` | MCP sync source — **Google** `tour_booking_url` aligned with `config.json` |
| `WW/weweb/config.json` | `calendar.app.google/d3iGi3bVmyjSdxyn9` |
| Docs | `WWE_*`, `GO_LIVE_EXECUTE_OCT21_2026.md` |

---

## Tour booking URL chain

| Source | URL |
|--------|-----|
| `config.json` / head `WW_SITE_CONFIG` | `https://calendar.app.google/d3iGi3bVmyjSdxyn9` |
| `ww-site-bridge.js` | Uses `cfg.tour_booking_url` (Google fallback) |
| `ww-site-boot-snippet.js` | **Fixed** to Google (was Calendly) |
| `~/ww/public/ww-tour-modal.js` | Builds `EMBED` from `tour_booking_url` — verify Google loads in iframe (not Calendly query string) |

---

## Live smoke checklist (post push + head paste)

1. View source / console: `WW_HEAD_VERSION === "2026.10.21.18"`.  
2. **By The Numbers** — one heron fly-by on scroll.  
3. **Walk** → Pond tab — heron wipe / overlay.  
4. **Tour drawer** — loader → **Google** booking (not blank Calendly).  
5. **Mobile** — map card + barn: no sideways scroll.  
6. Season tabs — gallery filter, accents, no console errors on `301d0edc…`.

---

## Out of scope (this commit)

- WeWeb export JSON in git (`src/_front/router.js` boot synced via `scripts/sync-venue-boot-to-export.py`).
- `~/ww/public` — deploy separately if tour JS/CSS changed.  
- Bear/Kimber ops docs staged in same repo — not production blockers for WW site.

---

*Prior: `WWE_PRE_PUSH_AUDIT_NOV4_2026.md`, `WWE_MCP_SWEEP_NOV4_2026.md`, `WWE_AUDIT_V39_NOV4_2026.md`*
