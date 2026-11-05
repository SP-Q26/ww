# Venue audit — WeWeb publish v45 / git `080ecf1` (Nov 5 2026)

**Repo:** `SP-Q26/ww` · branch **`venue`**  
**WeWeb publish:** `080ecf1` — *v45 - v42* (cacheVersion **45** in export)  
**Booking canon:** **Calendly** `https://calendly.com/whisperingwoodsinfo/private-venue-tour` (tour drawer iframe + boot)

---

## What v45 brought (WeWeb → GitHub)

| Area | Change |
|------|--------|
| Export | Home + contact / integrity / bespoke-journey page data, shared CSS hash, home page CSS large diff |
| **WW Site Boot (canvas)** | **One-shot scroll reveal** (`ww-oneshot-scroll-anim`, IO on `[id^="scroll-"]`) |
| Boot `TOUR_URL` | Calendly private venue tour |
| Git-owned `public/` | Tour stack aligned to same Calendly URL + embed query params |

---

## Git canon (after Calendly correction)

1. **`weweb/config.json`** — `tour_booking_url` → Calendly.
2. **`weweb/ww-site-boot-snippet.js`** — v45 one-shot scroll + Calendly `TOUR_URL`.
3. **`public/ww-tour-modal.js`**, **`ww-site-config.js`**, **`ww-site-bridge.js`** — Calendly fallbacks; bridge skips direct navigation when href is already Calendly/Google (boot opens drawer).
4. **`weweb/WEWEB_HEAD_PASTE.html`** — rebuild via `python3 weweb/build-head-paste.py` after config change; **paste in WeWeb Project Head**.
5. **`scripts/sync-venue-boot-to-export.py`** — run after every WeWeb publish to `venue`.

---

## Layer truth (smoke)

| Layer | Tour booking |
|-------|----------------|
| `weweb/WEWEB_HEAD_PASTE.html` | Calendly in `WW_SITE_CONFIG` — **operator must paste** |
| `public/ww-tour-modal.js` | Calendly embed + styling query params |
| Export boot (`router.js`) | Calendly after sync script |
| WeWeb canvas boot | Should match snippet (MCP or paste) |

---

## Still open (non-blocker)

- Duplicate **`activePropertySpot`** variables in WeWeb — delete; use **`activeHotspot`**.
- Untracked prerender HTML at repo root — optional.
- **Project Head** on live site may lag until paste (`WW_HEAD_VERSION` = `2026.10.21.18`).

---

## Smoke checklist (post deploy `venue`)

- [ ] `TOUR_URL` = Calendly (`rg calendly.com weweb/ww-site-boot-snippet.js src/_front/router.js`)
- [ ] Tour drawer → Calendly iframe (Central Time note visible)
- [ ] Scroll sections animate **once**
- [ ] By The Numbers heron fly-by (needs head paste v18)
- [ ] Pond tab heron wipe

---

*Prior: `VENUE_AUDIT_FIX_NOV4_2026.md`, `WWE_AUDIT_V41_NOV4_2026.md`*
