# Whispering Woods Journal · swarm audit (WeWeb v7 / git `journal`)

**Date:** 2026-09-20  
**Canvas:** WeWeb **ww Journal** · publish **v7** (export `cacheVersion` **7**)  
**Git:** `SP-Q26/ww` · branch **`journal`** · WeWeb export **`021b1a5`** (`v7 - v7`)  
**Vercel:** project **`ww-journal`** · production deploy on `journal` @ commit `021b1a5`  
**Pages:** Home `81e5d604…` · Article `7f21e17b…` (`/p/{{slug}}`)

---

## Executive scorecard (100 = production-ready)

| Dimension | Score | Notes |
|-----------|------:|-------|
| **Information architecture** | **82** | Trends + green **tile bands** before main feed; feed **30 posts interleaved** (no trend/green stacks) |
| **Content / catalog** | **88** | **30** articles · 5 trends · 5 green · 20 estate/luxe/grounds; git mirror `JOURNAL_POSTS_WITH_SERIES` |
| **Brand (WWJ / WWE / WWL)** | **88** | Estate voice; feed pills **2026/27 trends** + **Green programs** |
| **Design system** | **86** | Clean tiles reuse feed card class; wildlife ledger + hero intact |
| **Mobile / touch** | **82** | Tile grids stack on mobile; deck swipe unchanged |
| **Conversion / links** | **84** | WWE/WWL + UTMs; tile → article internal links |
| **Newsletter** | **70** | `POST {baseUrl}/api/subscribe` — **no `api/subscribe` in ww-journal repo yet** |
| **Article UX** | **80** | Reader from `journal_posts`; OG still project-level |
| **SEO / deploy** | **85** | **`ww-journal`** Vercel prod on `journal`; cache **7** |
| **Git hygiene** | **62** | WeWeb export commit uses operator email — cleanup script before CLI history rewrite |

### Composite

| | Score |
|---|------:|
| **WWJ v7 (canvas + Vercel prod)** | **83 / 100** |
| **After `/api/subscribe` on ww-journal + deck bound to feed slice** | **~89** |

---

## v7 canvas deltas (MCP)

| Area | v7 state |
|------|----------|
| **Industry trends** | Label **2026 / 2027 INDUSTRY TRENDS** · 5 clean tiles → articles |
| **Green programs** | Label **GREEN PROGRAMS ON THE ESTATE** · 5 clean tiles |
| **`journal_posts`** | **30** items · interleaved order (grounds/events/luxe/trend/green) |
| **Main feed** | Full archive repeat; specialty pills on trend/green rows |
| **Swipe deck** | Still **8 static cards** (P1: bind first 8 of feed) |

---

## Live smoke (2026-09-20)

| Check | Result |
|-------|--------|
| Home `GET /` | **200** (SSO share URL + deployment host) |
| Export `cacheVersion` | **7** in `public/data/81e5d604…json` |
| Trends / green in export | **`INDUSTRY TRENDS`** · **`GREEN PROGRAMS`** present |
| Article `GET /p/barn-timber-window-light` | **404 NOT_FOUND** (no `vercel.json` SPA rewrite on deploy **before** git fix) |
| Subscribe `POST /api/subscribe` | **404** (no API route in repo) |

**Fix shipped in git (post-audit):** root **`vercel.json`** rewrites `/p/:path*` → `/index.html` for client router (`7f21e17b…` @ `p/{{slug}}`). Re-smoke article URL after next Vercel build.

---

## P0 / P1

| Pri | Item |
|-----|------|
| **P0** | Mount **`api/subscribe`** on `ww-journal` (or proxy to n8n) |
| **P0** | Deploy **`vercel.json`** article rewrites (committed with v7 docs) |
| **P1** | Deck → `journal_posts.slice(0,8)` |
| **P1** | Per-article OG/JSON-LD on Article page |
| **P2** | `cleanup-git-authors-after-weweb.sh` on `journal` WeWeb commits |
