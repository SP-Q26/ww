# Whispering Woods Journal · swarm audit (WeWeb v4.1 / git `journal`)

**Date:** 2026-09-20  
**Canvas:** WeWeb **ww Journal** · publish **v4.1** (export `cacheVersion` **6**)  
**Git:** `SP-Q26/ww` · branch **`journal`** · HEAD **`792e063`** (`v6 - v4.1`)  
**Pages:** Home `81e5d604…` · Article `7f21e17b…` (`/p/{{slug}}`)

---

## Executive scorecard (100 = preview-ready)

| Dimension | Score | Notes |
|-----------|------:|-------|
| **Information architecture** | **74** | Feed + deck labeled as archive vs curated highlights; **feed still above deck** in DOM |
| **Content / catalog** | **78** | **`journal_posts` × 20**; deck **8 static cards** (overlap with feed, pillars say “Weddings” not WWE) |
| **Brand (WWJ / WWE / WWL)** | **86** | Header pills, tour CTA, wildlife ledger, pine hero, estate voice |
| **Design system** | **84** | Tokens on header/hero/cards; wildlife block is new v4.1 surface |
| **Mobile / touch** | **80** | Deck pan-x + snap + scroll sync workflow; 44px nav |
| **Conversion / links** | **82** | WWE/WWL external + UTMs on tour paths |
| **Newsletter** | **72** | `POST {baseUrl}/api/subscribe` — needs Vercel route + `N8N_WEDDINGS_SUBSCRIBE_WEBHOOK` on preview host |
| **Article UX** | **78** | Dynamic reader from `journal_posts`; per-slug OG/JSON-LD still weak |
| **SEO / deploy** | **70** | Prerender on; **no `ww-journal` Vercel project** in team yet (only luxe / spquant / innsegall) |
| **Git hygiene** | **65** | WeWeb export commits on `journal` use operator email — run author cleanup before next CLI push |

### Composite

| | Score |
|---|------:|
| **WWJ v4.1 (today)** | **78 / 100** |
| **After deck→`journal_posts` slice + reorder + Vercel journal project + subscribe API** | **~88–90** |

---

## v4.1 canvas deltas (MCP)

| Area | v4.1 state |
|------|------------|
| **Wildlife ledger** | New “Estate grounds ledger” chips (deer, heron, fox, waterfowl) above hero |
| **Hero** | Harvard / 40 acres / three ponds eyebrow; WWJ H1 + field-notes subtitle |
| **Ideas feed** | Eyebrow **ESTATE ARCHIVE · ALL DISPATCHES**; repeat on **20 posts** |
| **Swipe deck** | Eyebrow **CURATED FIELD STORIES · EIGHT HIGHLIGHTS**; **8 static cards** + expand UX |
| **Capture** | DISPATCHES FROM THE GROUNDS · subscribe workflow |
| **Header** | WWJ wordmark · Weddings·WWE · Seniors·WWL · Tour grounds |

---

## Luxe isolation (do not mix with Journal)

**Journal ≠ Luxe.** The Vercel project **`luxe`** must stay on **`sites/luxe`** + branches **`main`** / **`preview`** only.

Pushes to git branch **`journal`** previously triggered **preview** builds on the **`luxe`** project (same GitHub repo) — confusing URLs, **not** a production overwrite. Production Luxe remains **`main`** @ `f0e80312` on `whisperingwoodsluxe.com`.

**Fix:** On project **`luxe`** → Settings → Git → **Ignored Build Step** (only build `main` and `preview`):

```bash
if [ "$VERCEL_GIT_COMMIT_REF" = "main" ] || [ "$VERCEL_GIT_COMMIT_REF" = "preview" ]; then exit 1; else exit 0; fi
```

(Vercel: exit **1** = run build, exit **0** = skip.)

Create a **separate** Vercel project **`ww-journal`** for branch **`journal`** — never reuse or rename **`luxe`**.

---

## Deploy checklist (Vercel preview)

1. **Vercel:** New project **`ww-journal`** (separate from **`luxe`**) → repo `SP-Q26/ww` → branch **`journal`** → root **`.`** (WeWeb export at branch root; `package.json` name `ww-journal`).
2. **Build:** `npm ci && npm run build` (Node **≥ 24.12**).
3. **Env (preview + prod):** `N8N_WEDDINGS_SUBSCRIBE_WEBHOOK` if `/api/subscribe` is mounted on same project; else hybrid DNS rules to a git API host (see estate launch docs).
4. **Smoke:** `/` home · `/p/venue-tour-checklist` · submit test email (Network → `/api/subscribe`).
5. **Git:** After WeWeb publish, run `~/ww/scripts/cleanup-git-authors-after-weweb.sh` with base **`6e9edcc`** (not `origin/main`), then `./scripts/push-main-after-cleanup.sh journal`.

---

## P0 / P1

| Pri | Item |
|-----|------|
| **P0** | Create/link **Vercel** project on `journal` branch |
| **P0** | Confirm **subscribe** API on preview URL |
| **P1** | Move **deck above feed** OR hide deck; bind deck to **first 8** of `journal_posts` |
| **P1** | Unify pillar chips **WWE / WWL** on deck cards |
| **P1** | Article **per-slug** meta / JSON-LD |
| **P2** | Author cleanup on `journal` git history (noreply) |

---

## Newsletter path

**Not Xano.** Canvas → `fetch(globalContext.browser.baseUrl + '/api/subscribe')` → Vercel serverless / n8n webhook.
