# Whispering Woods Journal · swarm audit (WeWeb v8 / git `journal`)

**Date:** 2026-09-20  
**Canvas:** WeWeb **ww Journal** · publish **v8** (export `cacheVersion` **8**)  
**Git:** `SP-Q26/ww` · branch **`journal`** · WeWeb export **`91c3877`** (`v8 - v8`)  
**Vercel:** project **`ww-journal`** · production **READY** @ `91c3877`  
**Pages:** Home `81e5d604…` · Article `7f21e17b…` (`/p/{{slug}}`)

---

## Executive scorecard (100 = production-ready)

| Dimension | Score | Notes |
|-----------|------:|-------|
| **Information architecture** | **92** | Single **Unified Swipe Stack** + pill filters; legacy tile grids still in export DOM (see P1) |
| **Content / catalog** | **88** | **30** posts in `journal_posts`; filter logic trends / green / weddings / seniors |
| **Brand (WWJ / WWE / WWL)** | **90** | Pill labels match estate voice; card pillar chips aligned |
| **Design system** | **88** | `components/pill-nav` + `card-post`; guidelines §9 updated on canvas |
| **Mobile / touch** | **86** | Horizontal snap rail, 48px pills, Prev/Next 44px |
| **Conversion / links** | **84** | WWE/WWL + UTMs; card → article |
| **Newsletter** | **70** | `POST {baseUrl}/api/subscribe` — **no `api/subscribe` in repo** |
| **Article UX** | **80** | Reader from `journal_posts`; footer disclaimer fixed on canvas (prior) |
| **SEO / deploy** | **86** | `vercel.json` article rewrites; cache **8**; prod deploy green |
| **Git hygiene** | **62** | WeWeb export author still operator email (`v7`/`v8`); CLI commits use noreply |

### Composite

| | Score |
|---|------:|
| **WWJ v8 (canvas + Vercel prod)** | **86 / 100** |
| **After hide legacy grids + `/api/subscribe`** | **~91** |

---

## v8 canvas deltas (export verification)

| Area | v8 state |
|------|----------|
| **Unified Swipe Stack** | `#ww-deck` repeat on filtered `journal_posts`; **5** filter workflows (`Filter Stack *`) |
| **Pills** | All stories · Industry trends · Green programs on estate · Estate weddings · Estate senior portraits |
| **`journal_stack_filter`** | `a114a874-3fa4-42f5-804a-43fdbd37f146` |
| **Controls** | Dynamic counter, Prev/Next (`c1000003`/`c1000004`), touch scroll sync (page onload) |
| **Legacy Swipe Deck** | Section `82cbd467…` — **hidden** in export (`conditionalRendering: false`) |
| **Industry / Green tile bands** | Elements still present in page JSON — **confirm hidden in editor** or remove in v8.1 (P1) |
| **Static 8-card deck markup** | May remain inside hidden section; live rail is repeat-driven |

---

## Deploy smoke (2026-09-20)

| Check | Result |
|-------|--------|
| Vercel **`ww-journal`** prod state | **READY** on `91c3877` |
| Export `cacheVersion` | **8** in `public/data/81e5d604…json` |
| Unified stack in export | `Stack Filter Pills`, `Filter Stack All`, `journal_stack_filter` present |
| `vercel.json` `/p/:path*` | Present (SPA article routes) |
| Preview URL curl | **302 SSO** (team protection); validate in WeWeb preview or logged-in browser |
| `POST /api/subscribe` | **404** (no API route) |

---

## P0 / P1 / P2

| Pri | Item |
|-----|------|
| **P0** | Mount **`api/subscribe`** on `ww-journal` (or proxy) |
| **P1** | Set **`conditionalRendering: false`** on Industry Trends + Green Programs sections (or delete nodes) so home is stack-only |
| **P1** | Per-article OG/JSON-LD on Article page |
| **P2** | `cleanup-git-authors-after-weweb.sh` on WeWeb export commits when rewriting `journal` history |
| **P2** | Journal `package.json` has no SPQ-style `prebuild` chain (WeWeb stripped); Vercel build still **READY** on `vite build` + `postbuild` |

---

## Operator notes

- Follow-up git commits on **`journal`** should use **`scripts/verify-git-identity.sh`** before push.
- Home layout canon: `docs/journal/HOME_UNIFIED_STACK_2026-09-20.md`.
