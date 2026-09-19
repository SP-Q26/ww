# Journal · Luxe expand swarm audit (2026-09-18)

**Scope:** Rebuild `sites/weddings/` · **13 posts** (8 legacy + **5 new** Luxe/senior/engagement) · visual/copy alignment with live **whisperingwoodsluxe.com**  
**North star (unchanged):** wedding **tours** via **whisperingwoodsevents.com** · senior bookings via **Luxe**  
**WeWeb:** `ww Journal` · `49bf8d2b-9224-4aa4-803a-5b74f1a83f30` · export on branch **`journal`**

---

## Executive scorecard

| Lane | Score | Notes |
|------|------:|-------|
| **Git static (Vercel)** | **88** | 13 URLs, deck, subscribe, `/go/*` → Events/Luxe, sitemap |
| **Luxe copy parity** | **86** | $1,420 / $710 / 24 spots / Chalet / rain-or-shine / heirloom · from live Luxe + terms |
| **Events tour ROI** | **72** | 5 tour CTAs · engagement → tour · `/go/tour` → Events (not Calendly) |
| **WeWeb canvas** | **70** | Still **8 hand-built cards** on export · needs 5 new cards or `journal_posts` sync |
| **DNS / apex** | **15** | `whisperingwoodsweddings.com` may still 301 to Events until cutover |
| **Deploy readiness** | **75** | Ready to push **`journal`** + Vercel `ww-weddings` once merged |

**Composite:** **~78/100** git slice · **~72/100** full estate (WeWeb + DNS).

---

## What changed (git)

### Rebuilt slice

`sites/weddings/` was **missing from disk**; restored with:

- `public/data/posts.json` — **13 posts**
- `scripts/generate-weddings-static.mjs` — deck home + articles + sitemap
- `public/assets/ww-weddings.css` — **Luxe-adjacent** linen `#f9f6f0`, Cormorant + Inter, gold `#c6a15b`
- `public/assets/ww-weddings.js` — in-rail deck autoplay, UTMs, subscribe
- `api/go.js` — **`tour` → whisperingwoodsevents.com** (+ UTMs)

### Five new posts (Luxe / seniors / engagement)

| Slug | Pillar | CTA | Source (Luxe live) |
|------|--------|-----|---------------------|
| `class-of-2027-estate-senior-day` | luxe | Luxe | Home title, $1,420, 24 spots, HMU |
| `estate-senior-day-timeline` | luxe | Luxe | Chalet, Mom Milestone, day flow |
| `engagement-photos-private-estate` | events | **Tour** | Estate land · tour before buyout |
| `chalet-heirlooms-no-reveal-room` | luxe | Luxe | Published retail, `/heirloom`, Chalet pre-order |
| `senior-portraits-rain-or-shine` | luxe | Luxe | Rain-or-shine policy (terms) |

### Mix (13 total)

| Pillar | Count |
|--------|------:|
| Events (weddings / tour) | 6 |
| Luxe (seniors) | 7 |

---

## SEO & scale

| Item | Status |
|------|--------|
| Sitemap | 14 URLs (home + 13 posts) · `lastmod` 2026-09-18 |
| JSON-LD | BlogPosting per article with correct `url` on git static |
| Internal links | Footer Events · Luxe · Luxe Class of 2027 |
| Keyword growth | +5 long-tail: class of 2027, engagement estate, chalet heirlooms, rain seniors |
| Scale path | Keep **`posts.json` single source** → generator → optional WeWeb variable sync |

**Do not** duplicate Luxe checkout on Journal · prices are **editorial** only; book on whisperingwoodsluxe.com.

---

## WeWeb gap (post-git)

| Item | Git | WeWeb v1 export |
|------|-----|-----------------|
| Post count | 13 | 8 cards |
| New slugs | 5 | Missing routes/content |
| Deck autoplay | In-rail JS | `scrollIntoView` (P0 paste `WEWEB_DECK_AUTOPLAY_INRAIL.js`) |
| Luxe visual | Linen deck CSS | Editor tokens differ |

**P1 WeWeb:** Add 5 deck cards + Article bindings for new slugs **or** run future `sync-journal-posts-to-weweb.mjs` from `posts.json`.

---

## Deploy checklist

### 1 · Git (`journal`)

```bash
cd ~/ww
# on branch journal (merge from preview/main as you prefer)
git add sites/weddings scripts/generate-weddings-static.mjs docs/weddings/SWARM_JOURNAL_LUXE_EXPAND_2026-09-18.md docs/weddings/README.md sites/weddings/README.md
git status   # verify identity before commit
# commit when ready
```

### 2 · Vercel `ww-weddings`

| Step | Action |
|------|--------|
| Root directory | `sites/weddings` |
| Branch | `journal` (production) |
| Env | `N8N_WEDDINGS_SUBSCRIBE_WEBHOOK`, `WW_WEDDINGS_SITE_ORIGIN` |
| Deploy | Push or redeploy after commit |

### 3 · Hybrid apex (when DNS on Journal)

Cloudflare (or edge) rules:

- `/api/*`, `/go/*` → Vercel `ww-weddings`
- `/`, `/p/*` → WeWeb **or** Vercel static (pick one host; see `LAUNCH_GO_LIVE_AUDIT.md`)

### 4 · Smoke (production or preview)

```bash
curl -sI "https://<preview-or-apex>/" | head -3
curl -sI "https://<host>/p/class-of-2027-estate-senior-day/" | head -3
curl -sI "https://<host>/go/luxe?utm_content=test" | grep -i location
curl -sX POST "https://<host>/api/subscribe" \
  -H 'Content-Type: application/json' \
  -d '{"email":"you@example.com","source":"ww_journal_home","tags":["weddings-blog"]}'
```

Expect: **200** home/article · **302** Luxe/Events with UTMs · subscribe **200** `{ok:true}`.

### 5 · WeWeb publish (canvas truth)

- Republish after deck/autoplay + 13 slugs
- GitHub publish → **`journal`**
- Preview: deck **13** cards, no vertical page jump on autoplay

---

## Cross-estate

| From | To Journal | To Luxe | To Events tour |
|------|------------|---------|----------------|
| Luxe footer | UTMs in `CROSS_LINKS_CANON.md` | — | — |
| Events footer | Journal home | Luxe link | Calendly on **Events** |
| Journal | — | `/go/luxe` | `/go/tour` → **Events** |

---

## Risks

| Risk | Mitigation |
|------|------------|
| Price drift vs Luxe | Re-audit when Luxe pricing changes on live site |
| WeWeb/git duplicate URLs | One host for `/p/*` at cutover |
| Journal DNS still 301 | Cutover before paid Pinterest traffic |
| 13-card deck perf | Lazy-load optional later; static HTML is light |

---

## Summary

Git Journal is **rebuilt and expanded**: Luxe-forward editorial (7/13), engagement bridge to **tours**, Vercel-ready **13-post** sitemap, and **Events-first** `/go/tour`. **Deploy** = commit on **`journal`** + Vercel + DNS/hybrid rules. **WeWeb** still needs **5 new stories** and autoplay fix to match git.

**Related:** `sites/weddings/README.md` · `SWARM_JOURNAL_FULL_ROI_2026-09-13.md` · `docs/luxe/LUXE_FULL_SWARM_AUDIT_2026-09-18.md`
