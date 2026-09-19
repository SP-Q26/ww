# Whispering Woods Journal

**Production domain:** [whisperingwoodsweddings.com](https://whisperingwoodsweddings.com) (DNS cutover pending)

**Visual reference:** [Whispering Woods Luxe](https://whisperingwoodsluxe.com/home) (linen, Cormorant, estate senior copy) · conversions to **Events** (tours) and **Luxe** (Class of 2027).

## Git

| | |
|--|--|
| Repository | `SP-Q26/ww` |
| Branch | **`journal`** (WeWeb export at repo root + this Vercel slice) |

## Vercel

| Item | Value |
|------|--------|
| Project | `ww-weddings` |
| Root | `sites/weddings` |

### Env

| Variable | Purpose |
|----------|---------|
| `N8N_WEDDINGS_SUBSCRIBE_WEBHOOK` | Email capture |
| `WW_WEDDINGS_SITE_ORIGIN` | `https://whisperingwoodsweddings.com` |

## Content

1. Edit `public/data/posts.json` (**13 posts** as of 2026-09-18 · 5 Luxe/senior/engagement expansions)
2. `node scripts/generate-weddings-static.mjs` from repo root
3. Commit `public/` outputs + deploy from **`journal`**

## Routes

| Path | Purpose |
|------|---------|
| `/` | Inspo deck + capture |
| `/p/{slug}/` | Article |
| `/go/venue` | → whisperingwoodsevents.com + UTMs |
| `/go/luxe` | → whisperingwoodsluxe.com/home + UTMs |
| `/go/tour` | → Events + UTMs (tour on venue site) |
| `/api/subscribe` | n8n forward |

**Docs:** `docs/weddings/README.md` · **`SWARM_JOURNAL_LUXE_EXPAND_2026-09-18.md`**
