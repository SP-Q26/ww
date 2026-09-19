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

## Not the cause
- Meta Pixel (removed from home; postbuild strip).
- Stripe.js on home HTML (no stripe script tags on `/`).
- HTTP redirect loop (curl: 200, 0 redirects).

## Fix (P0)
1. Replace `wwCriticalFirstPaint` script with `id="ww-luxe-splash-orchestrator"` (handoff + 5s `forceHeroReady`).
2. Fallback inject orchestrator before `</head>` if marker missing.
3. **Remove** inject CSS that forces canvas splash visible when not ready.
4. `verify-luxe-splash-orchestrator.mjs` — **fail build** if orchestrator missing.

## Operator smoke after deploy
```bash
curl -sS https://whisperingwoodsluxe.com/ | grep -c 'ww-luxe-splash-orchestrator'  # must be >= 1
curl -sS https://whisperingwoodsluxe.com/ | grep -c 'HANDOFF_MAX'                 # must be >= 1
```

## WeWeb
Paste `docs/luxe/WEWEB_PROJECT_HEAD_BRIDGE_v26.html` after edits; publish so canvas/export head matches git.
