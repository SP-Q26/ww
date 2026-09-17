# Luxe git audit · 2026-09-15 (updated v25 `vvv`)

Branch: **`luxe`** · identity: `S.P.` + `*@users.noreply.github.com` (`verify-git-identity.sh`).

## Latest publish train

| Commit | Notes |
|--------|--------|
| WeWeb `v25 - vvv` | `cacheVersion` 25 · three pages · author cleanup required |
| Bridge commit | Restore `postbuild.js` slice copy · swarm smoke script · audit docs |

## Canon

| Artifact | Status |
|----------|--------|
| Root `vercel.json` | Full app + heirloom rewrites |
| `scripts/vercel-build.sh` | `npm run build` |
| `postbuild.js` | Must include `copy-luxe-slice-into-dist.mjs` after every WeWeb publish |
| `WEWEB_PROJECT_HEAD_BRIDGE_v26.html` | Project Head only (`LUXE_CANVAS_VS_HEAD.md`) |

## Export checks (v25 Home)

| Check | Result |
|-------|--------|
| `/heirloom` upsell links | Present |
| `/keepsakes` in export | Absent |
| `week_sept_*` | Absent |
| Stale price strings | Grep clean |

## Smoke

```bash
PREVIEW_HOST=https://luxe-omega.vercel.app bash sites/luxe/scripts/smoke-luxe-swarm.sh
SMOKE_WEWEB=1 bash sites/luxe/scripts/smoke-luxe-swarm.sh
```

## Intentionally not committed

Untracked: `docs/companytown/`, `docs/weddings/`, `sites/companytown/`, root `index.html`, etc.

## Post-push

Redeploy Vercel **`luxe`** (root `.`) if Git hook did not fire. Re-run swarm smoke and paste log into `LUXE_SWARM_AUDIT_v25_2026-09-15.md`.
