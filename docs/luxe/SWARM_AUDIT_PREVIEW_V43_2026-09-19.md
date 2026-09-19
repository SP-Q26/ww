# Luxe · full swarm audit (preview v43 + splash handoff)

**Date:** 2026-09-19  
**Git:** `origin/preview` @ **`01a6503`** (stack: **WeWeb v43** + welcome inject handoff fixes)  
**Prior baseline:** timing sign-off **`c119778`** · canvas export **v42+** (Hero Load Splash on home)  
**Smoke URL:** `https://luxe-git-preview-spq.vercel.app/` (Vercel **deployment protection** → SSO for unauthenticated `curl`)

---

## Executive summary

| Area | Verdict | Notes |
|------|---------|--------|
| Cache coherence | **GREEN** | `wwg_cacheVersion` **43** ↔ all page JSON `cacheVersion` **43** (`verify-ww-cache-version.mjs` PASS) |
| Postbuild chain | **GREEN** | `inject-luxe-critical-boot` → strip meta pixel → `copy-luxe-slice-into-dist` |
| Welcome splash (git) | **GREEN** | Queue/flush hero-ready, green-out before tree-out, handoff at green (`01a6503`) |
| Preview vs `main` gate | **GREEN** | Welcome inject only when `VERCEL_GIT_COMMIT_REF=preview` (or `WW_LUXE_WELCOME_SPLASH=1`) |
| Hero video boot (export) | **YELLOW** | v43 boot **minimal** (`SPLASH_MIN_MS` 1200, iframe `load` + **2s** cap; no `HARD_OUT` / YT API vs git mirror) |
| CLI / curl smoke | **RED** | Preview SSO **302**; `audit-luxe-deploy-sweep.sh` HTTP leg fails without bypass |
| Hero FOMO copy | **YELLOW** | Home export still contains **`24 spot`** / **spots** strings (pre-prod checklist) |
| Booking JS mirror | **YELLOW** | `docs/luxe/paste` ↔ `sites/luxe/.../wwl-booking-checkout.js` **drift** |
| Splash verify script | **YELLOW** | `verify-luxe-splash-orchestrator.mjs` still expects **`forceHeroReady`** (stale; not in `vercel-build.sh`) |
| Local `npm run build` | **INFO** | Sandbox/macOS 12 may hit Vite/sass VM warning; rely on **Vercel** as build truth |
| Promote `main` | **HOLD** | Operator has not requested production promotion |

---

## Splash timeline (preview) — current canon

| Phase | Owner | Behavior |
|-------|--------|----------|
| 0–~48ms | Vercel inject | Pine `#141f19`, `#app` locked (`ww-welcome-lock`) |
| Tree mount | Inject | Static SVG + CSS rings; shimmer until `img` load |
| Hold | Inject | **420ms** after tree live; green-out not before **780ms** from splash start |
| Green-out | Inject | `beginGreenOut()` → unlock `#app`, **`releaseHandoff()`**, fade `.ww-welcome__bg` (**350ms**) |
| Tree-out | Inject | **~374ms** after green-out starts (green finishes first) |
| Dismiss | Inject | Remove `#ww-critical-splash` DOM; wall cap **1600ms** |
| Canvas bridge | WeWeb | **Hero Load Splash** (`17f047b4-…`) until `data-ww-hero-video-ready="1"` |
| Hero ready | WeWeb boot | **`Home · Hero video boot`** sets ready (min **1200ms** from boot start) |
| Blocked ready | Inject | While pending: **queue** `setAttribute`; **flush** on `releaseHandoff` |
| Safety | Inject | `ensureHeroReady()` at **1800ms** if boot never wins |

**Why v42/v43 felt worse than `c119778`:** early `forceHeroReady()` masked timing bugs; handoff fix exposed **dropped** ready signals (fixed `07dbf51` / `01a6503`). Stacked **critical + canvas** splash is intentional on preview; total perceived length ≈ critical wall + boot min unless queue flush keeps boot on schedule.

---

## Git commits (preview tip)

| SHA | Summary |
|-----|---------|
| `01a6503` | Queue hero-ready; green before tree-out; fallback **1.8s** |
| `07dbf51` | WeWeb **v43** export + canvas handoff (no force ready on dismiss) |
| `e9aff39` | v42 merge + welcome splash |
| `c119778` | Signed-off welcome timing (420 / 780 / 1600) |

---

## WeWeb export v43 (in `preview`)

| Item | Value |
|------|--------|
| `cacheVersion` | **43** |
| Home workflows | **Home · Hero video boot** (2 actions), **roster fetch** (2 actions) |
| Hero boot code size | ~**2270** chars |
| `SPLASH_MIN_MS` | **1200** |
| `HARD_OUT_MS` / YT.Player | **not** in export (git mirror `docs/luxe/canvas/hero-video-boot.js` is richer) |
| Canvas hero splash | Present; hidden via inject CSS when `data-ww-hero-video-ready="1"` |

---

## Build / Vercel

| Check | Result |
|-------|--------|
| `vercel.json` | `scripts/vercel-build.sh` → sync cache → `npm run build` → postbuild |
| `package.json` | `postbuild` → `postbuild.js` (inject + pixel strip + slice) — **present** |
| `verify-ww-cache-version.mjs` | **PASS** (43) |
| `audit-luxe-deploy-sweep.sh` | **FAIL** — SSO on `luxe-omega` / preview URLs + booking drift |
| Meta pixel on home | Stripped at postbuild (`strip-luxe-meta-pixel-from-dist.mjs`) |

---

## Live smoke (operator — required)

Unauthenticated tools cannot fetch HTML on protected preview. In browser (Vercel SSO):

1. Hard-refresh `/` — pine → rings + static tree → **green fades** → tree dissolves → **canvas tree** (brief) → hero video crossfade.
2. No **~1s dead pine** after critical splash (queue flush).
3. No reload loop (cache **43** stable in Network tab `_wwcv`).
4. Booking modal opens; mobile CTA.
5. 4× CPU throttle once before `main` promote.

---

## P0 / P1 / P2

| Pri | Item | Action |
|-----|------|--------|
| **P1** | Preview SSO blocks automation | Vercel bypass token, logged-in preview, or deployment share link for CI |
| **P1** | **24 spot** / spots on home hero | WeWeb canvas edit + publish; `PRE_PROD_PUBLISH_CHECKLIST.md` |
| **P1** | Booking paste ↔ sites mirror | Sync `wwl-booking-checkout.js` before prod booking smoke |
| **P2** | Hero boot export vs git mirror | Optional: paste full `hero-video-boot.js` via MCP (duplicate workflow first) for `HARD_OUT` / YT polish |
| **P2** | `verify-luxe-splash-orchestrator.mjs` | Update gates for `__wwHeroReadyQueued` / `beginGreenOut` (remove `forceHeroReady` check) |
| **P2** | JSON-LD `[object Object]` | Re-check live Head after v43 (not in home JSON string; may be Head binding) |
| **P2** | Promote welcome inject to **`main`** | Only after preview sign-off + operator request (`luxe-prod-preview-gate`) |

---

## Sign-off checklist

- [x] Git preview @ `01a6503` with v43 + handoff fixes
- [x] Cache **43** aligned locally
- [x] Splash canon documented (`SPLASH_SKELETON_CANON.md`)
- [ ] Human visual on latest preview deploy (post-`01a6503`)
- [ ] Hero spots copy removed
- [ ] Booking JS sync
- [ ] `main` promote

**Related:** `SWARM_AUDIT_PREVIEW_V42_2026-09-19.md` (incident narrative) · `WELCOME_SPLASH_PREVIEW.md` · `HERO_BRAND_REVEAL.md` · `docs/patterns/BRAND_ARRIVAL_CROSS_DISSOLVE.md`
