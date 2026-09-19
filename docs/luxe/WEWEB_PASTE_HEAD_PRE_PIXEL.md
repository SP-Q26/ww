# WeWeb · paste Project Head (pre-pixel, pre–Vercel splash)

**Use when:** Canvas Project Head still has Meta Pixel or emergency splash scripts from tonight.

## Steps

1. Open **WhisperingWoodsLUXE** → **Project settings** → **Custom code** → **Head** (project only, not page head).
2. **Select all** in Head → delete.
3. Paste **entire** contents of:
   - `docs/luxe/WEWEB_PROJECT_HEAD_BRIDGE_v26.html`
4. **Publish** the project (same publish you will merge to git, or after git restore deploy).
5. Smoke in WeWeb **preview** (not only Vercel):
   - Hero video + canvas splash handoff
   - Mobile hero CTA readable
   - Open booking modal once

## Must NOT appear in Head after paste

- `meta_pixel_id` / `wwl-meta-pixel.js`
- `ww-luxe-splash-bail` / `ww-luxe-splash-orchestrator`
- Facebook `noscript` pixel img

## Must appear

- `wwCriticalFirstPaint` (pine background only)
- `data-ww-head-version` smoke: `2026.09.17.v28` in bridge script at bottom
- Hero iframe crop CSS for element `63c3ad17-1c03-49e0-b69c-be61ce0028ee`

## Git / Vercel (same release)

Production restore commit restores **coherent export v38** (`cf91ce8` snapshot) with `wwg_cacheVersion = 38`. After paste + publish, prefer **one** WeWeb GitHub export merge so canvas and git stay matched.

See `INCIDENT_REPORT_2026-09-18_PROD_LAYOUT.md`.
