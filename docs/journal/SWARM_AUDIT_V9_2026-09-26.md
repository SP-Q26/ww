# Whispering Woods Journal · v9 publish audit

**Date:** 2026-09-26  
**WeWeb publish:** **v9** · git `3f7a6e6` (`v9 - v9`)  
**Export `cacheVersion`:** **9**  
**Branch:** `journal` · Vercel **`ww-journal`**

---

## Scorecard

| Dimension | Score | Notes |
|-----------|------:|-------|
| **Catalog in export** | **95** | `september-estate-dispatch` + **33-post** `journal_posts` embedded in Home export JSON |
| **Canvas ↔ export** | **92** | Aligned after v9 GitHub publish |
| **Analytics** | **88** | WeWeb stripped `App.vue` + dep; **restored in follow-up commit** |
| **Newsletter** | **70** | `POST /api/subscribe` still **404** |
| **Git hygiene** | **55** | WeWeb commit author `ajaypwibm@gmail.com` (GH007 risk if block enabled on push machine) |

**Composite (post analytics restore + deploy):** **~91 / 100**

---

## v9 export verification

| Check | Result |
|-------|--------|
| `cacheVersion` | **9** |
| Lead slug in `81e5d604….json` | `september-estate-dispatch` |
| `journal_posts` variable uid in export | Present |
| Article page export | `7f21e17b….json` cache **9** |
| `@vercel/analytics` in v9 WeWeb commit | **Removed** → bridge commit restores |

---

## Smoke (production)

Run after deploy:

- `GET /` → **200**
- Response body contains `september-estate-dispatch`
- `GET /p/september-estate-dispatch` → **200**
- `POST /api/subscribe` → still **404** (known P0)

---

## Open items (unchanged)

| Pri | Item |
|-----|------|
| P0 | `api/subscribe` on ww-journal |
| P1 | Hide duplicate Industry/Green home sections if still visible |
| P2 | Noreply author on future WeWeb exports (`cleanup-git-authors-after-weweb.sh` if rewriting) |
