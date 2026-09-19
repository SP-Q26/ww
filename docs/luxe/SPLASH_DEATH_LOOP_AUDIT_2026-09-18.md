# Splash death loop audit · 2026-09-18

## Symptom
Home (`/`) stuck on animated tree splash; hero/video never appears; feels like infinite reload or “Stripe loop” (no HTTP redirect — client-side stall).

## Root cause (P0)
`scripts/inject-luxe-critical-boot.mjs` only replaced the handoff script when it found `r.style.backgroundColor="#141f19"`. WeWeb Project Head uses **`wwCriticalFirstPaint`** with `root.style.backgroundColor`.

**Result on every Vercel build:**
- Inject refreshed `#ww-critical-first-paint` CSS including **canvas splash forced visible** until `data-ww-hero-video-ready="1"`.
- Inject inserted `#ww-critical-splash` SVG (infinite SMIL animation).
- **Orchestrator never ran** — no `HANDOFF_MAX`, no `forceHeroReady()` at 5s.
- Export head also hides hero iframe until `data-ww-hero-video-ready`.
- Hero boot workflow may run late or not set the attribute → **permanent splash loop**.

## Death loop (P0) — cacheVersion mismatch (2026-09-18 evening)
`public/data/*.json` had `cacheVersion: 44` while `src/_front/router.js` baked `window.wwg_cacheVersion = 39`.

WeWeb runtime (`wwWebsiteData.js`): on mismatch → `throw { reloadUrl: true }` → router `window.location = to.fullPath` → **infinite full-page reload**. `#app` stays empty; no canvas skellie.

**Fix:** `scripts/sync-ww-cache-version.mjs` before build + `verify-ww-cache-version.mjs` gate. Never bump JSON/manifest `_wwcv` without matching `router.js` (or run sync).

## Not the cause
- Meta Pixel (removed from home; postbuild strip).
- Stripe.js on home HTML (no stripe script tags on `/`).
- HTTP redirect loop (curl: 200, 0 redirects).

## Fix (P0) — preview parity
WeWeb **preview does not run Vercel postbuild**. Stop mutating `dist/index.html` after build.

1. `uninject-luxe-vercel-splash.mjs` strips `#ww-critical-splash`, orchestrator, inject CSS (pine-only).
2. `inject-luxe-critical-boot.mjs` delegates to uninject (deprecated).
3. Restored home export JSON from **v38 `cf91ce8`** (last known good on main before splash emergencies).

## Operator smoke after deploy
```bash
curl -sS https://whisperingwoodsluxe.com/ | grep -c 'ww-luxe-splash-orchestrator'  # must be >= 1
curl -sS https://whisperingwoodsluxe.com/ | grep -c 'HANDOFF_MAX'                 # must be >= 1
```

## WeWeb
Paste `docs/luxe/WEWEB_PROJECT_HEAD_BRIDGE_v26.html` after edits; publish so canvas/export head matches git.
