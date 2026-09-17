# WhisperingWoodsLUXE · swarm audit v25 (`vvv`) · 2026-09-15

Unyielding checklist after WeWeb publish **v25 - vvv** and git bridge push.

## Export / git matrix

| Area | Status | Evidence |
|------|--------|----------|
| Cache version | OK | `25` on all three `public/data/*.json` |
| Router / designInfo | OK | `window.wwg_cacheVersion = 25`; pages Home + Terms + Privacy |
| Vercel slice merge | Bridge | `postbuild.js` slice copy (WeWeb export strips it) |
| Home funnel links | OK | `/heirloom` only; no `/keepsakes` in export JSON |
| Tour date select | OK | No legacy `week_sept_*`; choices Oct 18 + Spring 2027 |
| Pricing stale strings | OK | Grep clean on Home export |
| Custom extension drop | Info | `element-cf63c911…` removed from export |
| `wf_booking_form_submit` | Not git-patched | Law: canvas-only; do not partial-wipe via MCP |

## Live URL matrix (run `smoke-luxe-swarm.sh`)

| Surface | Host | Paths |
|---------|------|--------|
| Full marketing + rewrites | `luxe-omega.vercel.app` | `/`, `/terms`, `/privacypolicy`, `/heirloom`, aliases |
| WeWeb-hosted marketing | `…-production.weweb.io` | `/` (optional `SMOKE_WEWEB=1`) |
| Production apex | `whisperingwoodsluxe.com` | `SMOKE_PROD=1` when DNS green |

## Feature smoke (manual after deploy)

| Feature | How to verify |
|---------|----------------|
| Hero video / splash | Preview `/` — estate hero loads, no white wall |
| Sticky nav **Secure Spot** | Mobile 375px — label readable (not 7px) |
| Tour modal | Open → Experience date → both options selectable |
| FAQ accordion | Expand/collapse |
| Chalet / pricing copy | `$1,420` · Chalet thank-you `$355` / `$1,775` stack |
| Footer legal | Links to `/terms` + `/privacypolicy` |
| Heirloom order | `/heirloom` loads order shell + CSS/JS 200 |
| Stripe checkout API | POST checkout ≠ 404 (500/400 OK without env) |

## Smoke log

**2026-09-15** · `SMOKE_WEWEB=1` · **SMOKE OK**

```
Vercel [full]: / 200 · /home 307 · legal + heirloom aliases 200 · assets 200 · checkout POST 500 (not 404)
Title: Class of 2027 Private Estate Senior Portraits | Whispering Woods Luxe · Whispering Woods Estate
WeWeb [marketing]: / 200 · legal paths 200/301 · manifest/serviceworker 200 · heirloom/API skipped (not on WeWeb host)
```

Re-run after every `luxe` push:

`PREVIEW_HOST=https://luxe-omega.vercel.app SMOKE_WEWEB=1 bash sites/luxe/scripts/smoke-luxe-swarm.sh`

## `/heirloom` (git slice)

Copy audit: `HEIRLOOM_COPY_AUDIT_2026-09-15.md` · trust line ×3 · **Start fresh** kiosk reset.

## Open / P1

| Item | Owner |
|------|--------|
| WeWeb publish strips `postbuild` slice copy | Git bridge every publish |
| WeWeb commit author PII | `cleanup-git-authors-after-weweb.sh` |
| Xano roster onload | Off until backend live (`12H_LAUNCH_PUNCHOUT.md`) |
| Vercel MCP SPQ auth | `VERCEL_MCP_AUDIT.md` |
