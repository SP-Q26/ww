# WeWeb Project Head — Whispering Woods **Events** (venue)

**WeWeb project:** `cbd9a95f-c61e-441a-87cb-b25006511440` (WW Venue)  
**Git branch:** `venue` in `SP-Q26/ww` — **not** `SP-Q26/SPQ` main.

## Paste target

WeWeb → **Project Settings → Custom code → Head** (not a single page head).

Paste entire file:

```text
weweb/WEWEB_HEAD_PASTE.html
```

After paste, confirm in browser console:

```js
window.WW_HEAD_VERSION // e.g. "2026.10.21.18"
```

## Rebuild head from modules

```bash
cd ~/ww
python3 weweb/build-head-paste.py
```

After boot edits in `weweb/ww-site-boot-snippet.js`, sync the v41 export:

```bash
python3 scripts/sync-venue-boot-to-export.py
```

Reads `weweb/VERSION`, `weweb/config.json`, and all `ww-*.css` / `ww-*.js` listed in `build-head-paste.py`.

## Static tour drawer (Vercel / apex)

Served from repo root `public/` (same origin as marketing site or production domain):

- `public/ww-tour-modal.js`
- `public/ww-tour-modal.css`
- `public/ww-site-bridge.js` (optional if fully inlined in head)

Head boot loads these when not on apex-only WeWeb host.

## Docs

Go-live and audits: `docs/events/WWE_*.md`
