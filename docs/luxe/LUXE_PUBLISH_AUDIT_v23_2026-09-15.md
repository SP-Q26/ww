# Luxe publish audit · WeWeb v23 (`vv`)

**Superseded for current export by:** `LUXE_PUBLISH_AUDIT_v25_vvv_2026-09-15.md`

**Branch:** `luxe` · **Export:** `cacheVersion` **23** · **WeWeb commit:** `v23 - vv` (merged from GitHub publish)

## Gates (post-merge fix commit)

| Check | Result |
|-------|--------|
| `vercel.json` at repo root + `scripts/vercel-build.sh` | OK (WeWeb does not strip root `vercel.json`) |
| `postbuild.js` → `copy-luxe-slice-into-dist.mjs` | **Restored** — WeWeb publish removed slice copy; required for `/heirloom` + API on Vercel |
| Experience Date Select `week_sept_21` stale value | **Patched in export** — choices are `2026-10-18` + `2027-spring`; stale value broke dropdown |
| Git author on WeWeb push | **Done** — `cleanup-git-authors-after-weweb.sh` + rebase; commits rewritten to S.P. noreply |
| `scripts/verify-git-identity.sh` | **OK** (pre-push) |

## Canvas vs export (follow-up in WeWeb editor)

| Item | Note |
|------|------|
| Duplicate `selectedDate` vars | Still two project variables — delete orphan after confirming modal binding |
| Nav **Secure Spot** mobile label | Canvas MCP set 11px; confirm re-export on next publish if export still shows 7px |
| Hero boot workflow | Present in export (`Home · Hero video boot`) |

## Smoke after Vercel deploy

```bash
PREVIEW_HOST=https://luxe-omega.vercel.app bash sites/luxe/scripts/smoke-paths.sh
```

Modal: **Secure Spot** → Experience date → **Oct 18, 2026** + **Spring 2027**.

## Vercel project

Single project **`luxe`** → **luxe-omega.vercel.app** · Root Directory **`.`** · branch **`luxe`**.
