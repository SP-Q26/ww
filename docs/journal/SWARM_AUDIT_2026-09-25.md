# Whispering Woods Journal · swarm audit (Sep 25 2026)

**Canvas:** WeWeb **ww Journal** `49bf8d2b-9224-4aa4-803a-5b74f1a83f30`  
**Git:** `SP-Q26/ww` · branch **`journal`** · catalog commit **`4e6eff4`** (docs only)  
**Export on git:** still **v8** · `cacheVersion` **8** (`91c3877` layout)  
**Vercel:** **`ww-journal`** · prod **200** on `/` · **`POST /api/subscribe` → 404**

---

## Executive scorecard

| Dimension | Score | Sep 25 notes |
|-----------|------:|--------------|
| **Catalog / copy** | **94** | **33** posts on canvas; matches `JOURNAL_POSTS_WITH_SERIES_2026-09-23.json`; no em dashes; WWE/WWL CTAs + UTMs |
| **Canvas vs git export** | **58** | **`journal_posts` updated on canvas**; **git export does not embed** `september-estate-dispatch` · prod bundle still **pre-refresh** until WeWeb publish |
| **Information architecture** | **90** | Unified stack + `journal_stack_filter` (`all` default); legacy deck index documented hidden |
| **Filters / feed** | **91** | 6 trend · 5 green · 7 luxe · 26 events-tagged; interleaved lead = dispatch |
| **Newsletter** | **70** | No `api/subscribe` in `ww-journal` repo |
| **Article UX** | **82** | `expanded_post_slug` present; reader binds `journal_posts` |
| **SEO / deploy** | **86** | `vercel.json` SPA rewrites OK; analytics wired per `VERCEL_WEB_ANALYTICS.md` |
| **Git hygiene** | **72** | CLI catalog commit noreply; WeWeb export authors still a risk on next publish |

### Composite

| | Score |
|---|------:|
| **WWJ canvas (editor / preview)** | **~90 / 100** |
| **WWJ production (Vercel today)** | **~82 / 100** (catalog lag) |
| **After publish + subscribe API** | **~92** |

---

## What passed (canvas MCP)

| Check | Result |
|-------|--------|
| `journal_posts` count | **33** |
| First slug | `september-estate-dispatch` (2026-09-23) |
| New slugs | `fall-foliage-field-notes`, `local-floral-estate-edge` |
| `solar-2027-full-green-events` | Sep 2026 engineering copy |
| Git ↔ canvas field diff | **0** (slugs, title, hook, dek, published) |
| Typography canon | 0 em-dash posts; 0 curly-quote posts in catalog |
| `journal_stack_filter` | `all` · values `all \| trends \| green \| weddings \| seniors` |
| `deck_active_index` | 0 · description marks legacy hidden |

---

## Gaps (ordered)

### P0 · Production feed lag

- **Symptom:** `https://ww-journal.vercel.app/` HTML does **not** contain `september-estate-dispatch` (variables are runtime; export/git still **v8** without Sep catalog in embedded defaults).
- **Fix:** WeWeb **Publish → GitHub** (`journal`) after canvas variable push · verify export includes updated `journal_posts` default · `verify-git-identity.sh` · Vercel deploy smoke (lead card + `/p/september-estate-dispatch`).

### P0 · Newsletter

- **`POST /api/subscribe` → 404** on production (unchanged from v8 audit).
- **Fix:** Add Vercel function or proxy to n8n/webhook; bind existing capture workflow.

### P1 · Home layout duplication (carry from v8)

- Export JSON still references **Industry / Green** tile patterns and **legacy swipe** section id `82cbd467…` with **3** `conditionalRendering: false` nodes in `81e5d604….json`.
- **Re-verify in editor:** unified stack only visible; hide or delete duplicate bands if still rendered.
- **Fix:** `conditionalRendering: false` on Industry Trends + Green Programs section roots (or delete nodes) · publish v9.

### P1 · Article SEO

- Per-article OG/JSON-LD from `journal_posts` (still open from v8).

### P2 · Counter / deck

- Confirm Home counter binds **filtered** `journal_posts.length` (0–32), not `deck_active_index` (legacy 0–12).

### P2 · Git

- Run `cleanup-git-authors-after-weweb.sh` after next WeWeb export if operator email appears.

---

## Smoke checklist (operator)

1. WeWeb **preview** Home → lead card **September estate dispatch** · pills · Prev/Next · counter **1 / 33** (or filtered equivalent).
2. Expand → article route → CTA WWE/WWL.
3. After publish: prod same as preview; `POST /api/subscribe` not 404.
4. Optional: bump `SWARM_AUDIT` + `cacheVersion` in export commit message (**v9**).

---

## Source files

| Artifact | Path |
|----------|------|
| Catalog | `docs/journal/JOURNAL_POSTS_WITH_SERIES_2026-09-23.json` |
| Refresh script | `scripts/refresh-journal-posts-2026-09-23.mjs` |
| Prior layout audit | `docs/journal/SWARM_AUDIT_V8_2026-09-20.md` |
| Refresh notes | `docs/journal/JOURNAL_REFRESH_AUDIT_2026-09-23.md` |
