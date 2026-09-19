# Luxe · full swarm audit + live smoke (preview v42)

**Date:** 2026-09-19  
**Deploy:** `dpl_9gtkx46BbV7SBGkYUKbJrog27Tg1` · **READY**  
**Git:** `preview` @ `e9aff39` (WeWeb **v42** + welcome splash inject)  
**Smoke URL (branch alias):** `https://luxe-git-preview-spq.vercel.app/`  
**Deployment URL:** `https://luxe-koyrowxxw-spq.vercel.app/`  
**Inspector:** https://vercel.com/spq/luxe/9gtkx46BbV7SBGkYUKbJrog27Tg1

---

## Executive summary

| Area | Verdict | Notes |
|------|---------|--------|
| Build / deploy | **GREEN** | READY on `preview`, commit `e9aff39` |
| Cache coherence | **GREEN** | `wwg_cacheVersion` **42** ↔ home JSON `cacheVersion` **42** ↔ live `_wwcv=42` |
| Welcome splash + v42 canvas | **GREEN** | Critical inject present: rings, static tree, 420/780/1600ms, `__wwLuxeWelcomePending` |
| Home meta pixel | **GREEN** | No `wwl-meta-pixel` / `meta_pixel_id` in live HTML |
| Postbuild chain | **GREEN** | inject → strip pixel → luxe slice copy |
| Unauthenticated curl smoke | **RED** | Preview **SSO** → 302/401; use Vercel auth bypass or browser |
| Hero “spots” FOMO copy | **YELLOW** | v42 export still contains **“24 spot”** strings (pre-prod checklist) |
| Booking JS mirror | **YELLOW** | `paste/wwl-booking-checkout-active.js` ≠ `sites/.../wwl-booking-checkout.js` |
| JSON-LD in Head | **YELLOW** | `<script type="application/ld+json">[object Object]</script>` in live HTML |
| Doc-only pricing / em-dash audits | **INFO** | Fail on stale **docs**; not live canvas |

---

## Live smoke (authenticated HTML fetch)

Fetched home via Vercel-authenticated fetch (preview protection blocks raw `curl`).

| Signal | Result |
|--------|--------|
| HTTP | **200** |
| Title | Class of 2027 … Whispering Woods Luxe |
| `_wwcv` | **42** (favicon, fonts, shared CSS) |
| `#ww-critical-splash` | **present** |
| `ww-luxe-welcome-splash` orchestrator | **present** |
| `HOLD_MS=420`, `MIN_BEFORE_FADE_MS=780`, `WALL_MS=1600` | **present** |
| Preload static tree | `/heirloom/assets/heirloom-splash-tree-static.svg` |
| Meta pixel | **absent** |
| Head bridge | `data-ww-head-version` target **2026.09.17.v28** |
| Canvas hero splash hide rule | `.ww-element-17f047b4-…` when `data-ww-hero-video-ready` |

**Operator browser smoke (required):** hard-refresh `/` on preview → pine → rings + tree → cross-dissolve → hero; no reload loop; modal opens.

---

## Local / git gates

| Check | Result |
|-------|--------|
| `verify-ww-cache-version.mjs` | **PASS** (42) |
| `audit-luxe-deploy-sweep.sh` | **FAIL** — SSO on HTTP + booking paste drift |
| `smoke-luxe-swarm.sh` (curl) | **FAIL** — 302 on all paths (deployment protection) |
| `wwluxe-audit-em-dashes.mjs` | **FAIL** — historical audit **docs** only |
| `wwluxe-audit-pricing.mjs` | **FAIL** — historical audit **docs** only |

---

## v42 export notes

- Shared CSS: `ww-style-shared-7f0ad93f853a.css`
- New icons: `trees.svg`, `pencil-simple-line.svg`
- Home workflow: **Home · Hero video boot** (`SPLASH_MIN_MS` 1200) — stacks after Vercel welcome dismiss on preview

---

## P0 / P1 / P2

| Pri | Item | Action |
|-----|------|--------|
| **P1** | Preview SSO blocks CLI smoke | Use logged-in Vercel preview, share link, or relax protection for `preview` branch smoke |
| **P1** | Hero **“24 spot”** copy still in export | WeWeb edit + publish; see `PRE_PROD_PUBLISH_CHECKLIST.md` |
| **P1** | Booking paste ↔ sites mirror drift | Sync `wwl-booking-checkout.js` from paste or re-export modal workflow |
| **P2** | Broken JSON-LD `[object Object]` | Fix structured data binding in WeWeb page SEO / Head |
| **P2** | Promote to `main` | Only after preview sign-off + coherent export (no split v38/v39) |

---

## Regression (v42 + inject) — blank pine gap

**Cause:** `dismiss()` called `forceHeroReady()` → inject CSS hid canvas **Hero Load Splash** while YouTube iframe still hidden → ~0.5s blank green.

**Fix:** `releaseHandoff()` only on dismiss; canvas boot owns `data-ww-hero-video-ready` (+ 2.2s fallback).

**Follow-up (green hang):** Boot `markReady()` often fired while `__wwLuxeWelcomePending` — patched `setAttribute` **dropped** ready with no retry → ~1s extra pine until fallback. **Queue + flush** on green-out `releaseHandoff`; green fades before tree-out.

---

## Sign-off

- [x] Preview deploy green for `e9aff39`
- [x] Splash + cache **42** on live HTML (auth fetch)
- [ ] Human visual: welcome timing + hero video + modal
- [ ] Remove hero spots copy (v43+)
- [ ] Booking JS sync before prod book smoke
