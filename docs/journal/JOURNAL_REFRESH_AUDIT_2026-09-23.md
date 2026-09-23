# WW Journal · Sep 23 2026 refresh audit

**Project:** `49bf8d2b-9224-4aa4-803a-5b74f1a83f30` (ww Journal)  
**Canvas variable:** `journal_posts` · `d8cf1f9d-24cf-4073-aa40-a22606ea7797`  
**Git catalog:** `docs/journal/journal_posts_with_series_2026-09-23.json` (33 posts)  
**MCP payload (ready):** `.tmp-editvar-args-only.json`

## Copy audit (catalog)

| Check | Result |
|-------|--------|
| Em dashes | 0 in full catalog |
| Curly quotes | Normalized to ASCII in `refresh-journal-posts-2026-09-23.mjs` |
| Personal inboxes | None |
| CTAs | WWE / WWL product URLs + UTM only |
| Canon | 40 acres · Harvard · three doors (Events / Luxe / Journal) |

### New this refresh

- `september-estate-dispatch` (news, 2026-09-23)
- `fall-foliage-field-notes` (news/nature, 2026-09-22)
- `local-floral-estate-edge` (industry-trends, 2026-09-23)
- `solar-2027-full-green-events` (green-program copy + date bump)

Feed order: interleaved trend / green / grounds / events / luxe (script `interleave()`).

## Canvas apply (MCP)

When **WeWeb MCP** is connected (`user-weweb-ai` or `project-0-SPQ-weweb-ai`):

1. `ping`
2. `editVariable` with contents of `.tmp-editvar-args-only.json`
3. `searchVariables` → confirm `journal_posts` length **33**
4. `getPageSemantic` on Home → verify unified stack counter binds to filtered length
5. `projectEditorSwitchMode` → `preview` · smoke first card + expand + article route

If Auto-review blocks the call, approve with smart mode; **do not** omit `defaultValue`.

## Home copy audit (pending MCP)

From last known Home description; re-verify on canvas after reconnect:

| Area | Recommendation |
|------|----------------|
| Hero manifesto | Keep “field notes” voice; avoid brochure SEO in hero (save long keywords for metadata) |
| Wildlife ledger | Observations only; no operator names |
| Unified stack eyebrow | Match pill labels: Industry trends · Green programs on estate · Estate weddings · Estate senior portraits |
| Capture footer | “One email when we publish a new on-the-grounds note · WWE and WWL links only when relevant.” |
| Legacy Tier-2 tile bands | Hide if unified stack is sole feed (P1 from v8 audit) |

## Post-publish

- WeWeb GitHub publish → `journal` branch
- `verify-git-identity.sh` before push
- Optional: `SWARM_AUDIT` note for v9 / Sep 23 catalog

## Open P0/P1 (unchanged)

- `api/subscribe` on ww-journal Vercel project
- Hide duplicate Industry/Green sections below unified stack
- GH007 / noreply on WeWeb export commits
