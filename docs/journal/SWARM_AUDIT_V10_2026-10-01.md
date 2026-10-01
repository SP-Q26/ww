# Whispering Woods Journal · v10 publish audit

**Date:** 2026-10-01  
**WeWeb publish:** **v10** · git `c3f5523` (`v10 - 11`)  
**Export `cacheVersion`:** **10**  
**Branch:** `journal` · Vercel **`ww-journal`**

---

## Scorecard

| Dimension | Score | Notes |
|-----------|------:|-------|
| **Catalog in export** | **98** | **36-post** `journal_posts` · lead `october-estate-dispatch` · tail `post-weekend-compost-pickup` |
| **Canvas ↔ export** | **96** | MCP `editVariable` then WeWeb GitHub publish; counts match |
| **Analytics** | **88** | v10 export stripped `App.vue` + dep again; **restored in follow-up commit** |
| **Newsletter** | **82** | `api/subscribe.js` in repo · prod `POST /api/subscribe` needs env + redeploy |
| **Git hygiene** | **55** | WeWeb commit author personal email (GH007 if block enabled on push machine) |

**Composite (post analytics restore + subscribe deploy):** **~92 / 100**

---

## v10 export verification

| Check | Result |
|-------|--------|
| `cacheVersion` | **10** |
| Home export `81e5d604….json` | **36** posts · lead `october-estate-dispatch` |
| Article export `7f21e17b….json` | cache **10** |
| Canvas `journal_posts` (`d8cf1f9d…`) | **36** (post-publish MCP read) |
| Git catalog | `docs/journal/JOURNAL_POSTS_WITH_SERIES_2026-09-30.json` |
| Em dashes in catalog | **0** |
| `@vercel/analytics` in v10 WeWeb commit | **Removed** → bridge commit restores |

### Catalog delta vs v9

| Added / bumped | Slug |
|----------------|------|
| Lead dispatch | `october-estate-dispatch` |
| Trends / weather | `heated-lounge-fall-backup` |
| Green / news | `post-weekend-compost-pickup` |

---

## Smoke (production · 2026-10-01)

| Check | Result |
|-------|--------|
| `GET /home` | **200** |
| `GET /data/81e5d604….json` | **200** · `cacheVersion` **10** · **36** posts |
| `GET /p/october-estate-dispatch` | Run after deploy (SPA route) |
| `POST /api/subscribe` | **503** or **404** until bridge deploy + `JOURNAL_SUBSCRIBE_WEBHOOK_URL` |

---

## Open items

| Pri | Item |
|-----|------|
| P0 | Vercel env `JOURNAL_SUBSCRIBE_WEBHOOK_URL` + deploy with `api/subscribe.js` |
| P1 | Hide legacy Swipe Deck / duplicate Industry·Green bands on Home if still visible |
| P2 | Noreply author on future WeWeb exports (`cleanup-git-authors-after-weweb.sh` if rewriting) |
