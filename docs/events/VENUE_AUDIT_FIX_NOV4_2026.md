# Venue lane audit — fixes (Nov 4 2026)

**Repo:** `SP-Q26/ww` · branch **`venue`** · WeWeb **`cbd9a95f…`**

## Issues found

| # | Issue | Severity |
|---|--------|----------|
| 1 | `public/ww-tour-modal.js` still defaulted to **Calendly** + Calendly query on Google URL | **Blocker** for tour drawer |
| 2 | `public/ww-site-config.js` Calendly URL | High |
| 3 | `public/ww-site-bridge.js` stale vs `weweb/ww-site-bridge.js` | High |
| 4 | WeWeb **WW Site Boot** + export `router.js` still **Calendly** + no Google click capture | **Blocker** without head paste |
| 5 | Docs still pointed at **SPQ/WW** paths | Confusion |
| 6 | Project Head on live host may still be **v16** until operator re-pastes **v18** | Blocker for heron/head modules |

## Fixes applied (this commit)

- Align **`public/`** tour stack to **Google** `calendar.app.google/d3iGi3bVmyjSdxyn9` (matches `weweb/config.json` + head paste).
- **`scripts/sync-venue-boot-to-export.py`** — patches `src/_front/router.js` boot from `weweb/ww-site-boot-snippet.js` after each boot edit.
- **WeWeb MCP** — synced **WW Site Boot** workflow to same snippet (Google URL + calendar link capture).
- **`docs/events/WWE_AUDIT_V41_NOV4_2026.md`** — repo path corrected.

## Operator still required

1. **Paste** `weweb/WEWEB_HEAD_PASTE.html` → Project Head → `WW_HEAD_VERSION === "2026.10.21.18"`.
2. **WeWeb Publish** to `venue` (optional if only git/Vercel deploy from export).
3. Delete duplicate **`activePropertySpot`** variables in WeWeb (keep **`activeHotspot`**).

## Smoke

- Tour drawer iframe → Google appointment (not Calendly params).
- Tour CTAs without head paste still open drawer (boot + public JS).
- By The Numbers heron fly-by + Pond heron (needs head v18).
