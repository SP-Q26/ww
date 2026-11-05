# Venue audit — WeWeb publish v45 / git `080ecf1` (Nov 5 2026)

**Repo:** `SP-Q26/ww` · branch **`venue`**  
**WeWeb publish:** `080ecf1` — *v45 - v42* (cacheVersion **45** in export)  
**Follow-up git commit:** (this pass) re-applies Google tour URL + boot canon on top of v45 export

---

## What v45 brought (WeWeb → GitHub)

| Area | Change |
|------|--------|
| Export | Home + contact / integrity / bespoke-journey page data, shared CSS hash, home page CSS large diff |
| **WW Site Boot (canvas)** | **One-shot scroll reveal** (`ww-oneshot-scroll-anim`, IO on `[id^="scroll-"]`) — replaces flat scroll-anim kill |
| Boot regression | **`TOUR_URL` back to Calendly** in export `router.js` (overwrote `18e4013` Google patch) |
| Git-owned `public/` | **Unchanged** on v45 — `ww-tour-modal.js` still Google (from `18e4013`) |

---

## Fixes in this commit (git canon)

1. **`weweb/ww-site-boot-snippet.js`** — merge v45 **one-shot scroll** + **Google** `TOUR_URL` + calendar click capture.
2. **`scripts/sync-venue-boot-to-export.py`** — re-patch `src/_front/router.js` boot from snippet (run after every WeWeb publish to `venue`).
3. **WeWeb MCP** — sync **WW Site Boot** workflow to same snippet (canvas matches git).

---

## Layer truth (smoke)

| Layer | Tour URL | Head v18 heron |
|-------|----------|----------------|
| `weweb/WEWEB_HEAD_PASTE.html` | Google in `WW_SITE_CONFIG` | Yes — **operator must paste** |
| `public/ww-tour-modal.js` | Google | N/A |
| Export boot (`router.js`) | **Google after this commit** | Boot only |
| WeWeb canvas boot | Google after MCP sync | Boot only |

---

## Still open (non-blocker)

- Duplicate **`activePropertySpot`** variables in WeWeb — delete; use **`activeHotspot`**.
- Untracked prerender HTML at repo root (`index.html`, `contact/`, …) — from local build; not required on `venue` unless you commit prerender output.
- **Project Head** on live site may lag until paste of `weweb/WEWEB_HEAD_PASTE.html` (`2026.10.21.18`).

---

## Smoke checklist (post deploy `venue`)

- [ ] `TOUR_URL` in export = Google (`rg TOUR_URL src/_front/router.js`)
- [ ] Tour drawer loads Google appointment iframe
- [ ] Scroll sections animate **once** (no loop flicker)
- [ ] By The Numbers heron fly-by (needs head paste v18)
- [ ] Pond tab heron wipe

---

*Prior: `VENUE_AUDIT_FIX_NOV4_2026.md`, `WWE_AUDIT_V41_NOV4_2026.md`*
