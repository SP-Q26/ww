# Luxe publish audit · WeWeb v25 (`vvv`)

**Branch:** `luxe` · **Export:** `cacheVersion` **25** · **WeWeb commit message:** `v25 - vvv`  
**Pages:** Home `991a8992…` · Terms `3515bd43…` · Privacy `8afee215…` (all cache **25**)

## Gates (post-merge bridge)

| Check | Result |
|-------|--------|
| Root `vercel.json` + `scripts/vercel-build.sh` | OK |
| `postbuild.js` → `copy-luxe-slice-into-dist.mjs` | **Restored** (WeWeb stripped again on publish) |
| Experience Date Select `cc1a1c45…` | **Green** — choices `2026-10-18` + `2027-spring`; no `week_sept_*` in export |
| Date default | Formula default `2026-10-18` (valid choice); optional canvas tweak: empty until user picks |
| Upsell links on Home export | **`/heirloom` ×2** · **`/keepsakes` ×0** |
| Stale price grep (`$895`, `$350 thank`, `Save $250`, `$1,670`) | **0** in Home export |
| Removed coded element `element-cf63c911…` | Export dropped extension folder (canvas cleanup) |
| Git author on WeWeb push | **Rewrite before push** — `cleanup-git-authors-after-weweb.sh` + `push-main-after-cleanup.sh luxe` |
| `scripts/verify-git-identity.sh` | Required pre-push |

## Live smoke (unyielding)

```bash
chmod +x sites/luxe/scripts/smoke-luxe-swarm.sh
PREVIEW_HOST=https://luxe-omega.vercel.app bash sites/luxe/scripts/smoke-luxe-swarm.sh
SMOKE_WEWEB=1 bash sites/luxe/scripts/smoke-luxe-swarm.sh   # optional WeWeb host
SMOKE_PROD=1 bash sites/luxe/scripts/smoke-luxe-swarm.sh    # when apex DNS live
```

Legacy slice-only smoke still valid:

```bash
PREVIEW_HOST=https://luxe-omega.vercel.app bash sites/luxe/scripts/smoke-paths.sh
```

## Vercel

| Setting | Value |
|---------|--------|
| Project | **`luxe`** (team SPQ) |
| URL | https://luxe-omega.vercel.app |
| Root Directory | **`.`** (repo root) |
| Production branch | **`luxe`** |

## Canvas follow-up (next publish)

- Confirm Experience Date still has only the two week values after editor changes.
- Deduplicate project `selectedDate` if two UIDs still exist in WeWeb variables.
- Re-publish will strip `postbuild` slice copy again — keep git bridge commit in same deploy train.

## Related docs

- `LUXE_SWARM_AUDIT_v25_2026-09-15.md` — live run log + feature matrix  
- `VERCEL_FULL_APP.md` · `WHERE_IS_THE_SITE.md` · `LUXE_GIT_AUDIT_2026-09-15.md`
