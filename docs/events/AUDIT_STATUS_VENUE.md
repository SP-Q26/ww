# WWE venue · audit status (v27 export)

**Branch:** `venue` · **WeWeb publish label:** v25 (export `cacheVersion` **27**)  
**Commit:** `2529983` (post-cleanup: noreply author)  
**Project:** `cbd9a95f-c61e-441a-87cb-b25006511440` · `whisperingwoodsevents.com`

## Git audit (2026-10-11)

| Check | Result |
|-------|--------|
| Target branch | `venue` only (`vercel.json` `deploymentEnabled.venue`) |
| `wwg_cacheVersion` vs page JSON | **27** = **27** on all 4 `public/data/*.json` |
| Tracked `.env` | None |
| Personal email in export JSON | **0** (`@gmail` / operator) |
| `tel:` in venue page JSON | **0** |
| WeWeb GitHub author metadata | **Rewritten** via `cleanup-git-authors-after-weweb.sh cd3d919` → S.P. noreply |
| Local `npm run build` | **EPIPE** on `sass-embedded` (Node 22) — treat Vercel as build truth |

## Canvas / export parity (Home `385ba910…`)

- Uplift sections present in export router tree: **Calm**, **Destination Arrival**, **Right Fit**, on-page **FAQ** (`#faq`)
- Pricing copy: **$17,900** hardcoded (no Jan uplift warning)
- Bespoke: **Engagement Sessions** section
- Meta: engagement SEO keywords + `EventVenue` structured data (verify in preview)

## Operator docs (SPQ mirror)

- One-day uplift runbook: `SPQ/WW/docs/WEWEB_AI_WWE_ONE_DAY_UPLIFT.md` (not required in export)
- Vercel wiring: `docs/events/VERCEL_VENUE_PREVIEW.md`
- Post-push smoke: `docs/events/VENUE_V27_SMOKE.md`

## Open / P2

- Older `venue` history may still contain WeWeb personal emails before `cd3d919`; only tip rewritten unless full `filter-repo` requested
- Re-paste `WW/weweb/WEWEB_HEAD_PASTE.html` in WeWeb Project Head if mobile column / card-lift CSS drifts from canvas
