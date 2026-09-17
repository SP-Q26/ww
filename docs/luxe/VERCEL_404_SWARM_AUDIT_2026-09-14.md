# Vercel 404 · swarm audit (2026-09-14)

## Symptom

Opening **`https://luxe-omega.vercel.app/`** (or `/home`) returned **404 NOT_FOUND**.  
**`/heirloom`**, legal paths, and assets returned **200**.

## Root cause

| Layer | Finding |
|-------|---------|
| **Architecture** | `sites/luxe` is a **path slice** only (heirloom, terms, Stripe API). **Marketing `/` lives on WeWeb**, not this Vercel project. |
| **Missing static** | No `public/index.html` at project root → Vercel had nothing to serve for `/`. |
| **No redirect** | `vercel.json` had rewrites for `/heirloom*` only, not `/` or `/home`. |
| **Custom domain** | `whisperingwoodsluxe.com` did not resolve from audit host (DNS/SSL separate from Vercel slice). |
| **luxe-spq.vercel.app** | **302** to Vercel SSO (deployment protection) — not a public 200 homepage. |

This is **not** a broken heirloom deploy; it is an **empty root** on a slice project.

## Fix (git `sites/luxe`)

1. **`public/index.html`** — meta + JS redirect to `https://whisperingwoodsluxe.com/`
2. **`vercel.json`** — `redirects` entry `/home` → `https://whisperingwoodsluxe.com/home`
3. **`scripts/smoke-paths.sh`** — assert `GET /` is not **404**

Redeploy **spq/luxe** (CLI from `sites/luxe` or Git push on branch **`luxe`** with Root Directory **`sites/luxe`**).

## MCP / CLI audit matrix

| Tool | Result |
|------|--------|
| WeWeb MCP `ping` | OK |
| Vercel MCP `list_teams` | **Empty** — re-auth SPQ for dashboard MCP (see `VERCEL_MCP_AUDIT.md`) |
| `smoke-paths.sh` @ luxe-omega | `/heirloom*` **200** · `/` **404** (pre-fix) |
| `npx vercel ls luxe` | Production **Ready** @ luxe-omega (when CLI logged in) |
| Project `prj_zYZT3zKw07mQmYGdXY8e5DARl8z3` | Root dir must be **`sites/luxe`** if Git-connected to `SP-Q26/ww` |

## DNS law (do not break marketing)

| Route | Owner |
|-------|--------|
| `/*` (home, funnel) | **WeWeb** publish host |
| `/heirloom*`, `/terms*`, `/privacypolicy*`, `/api/wwluxe/*` | **Vercel** `luxe` |

Pointing **apex only** at Vercel → home **404** until you add index/redirect (now fixed on Vercel) **and** you still lose WeWeb unless path-split or subdomain (see `KEEPSAKES_VERCEL_DNS.md`).

## WeWeb (marketing home)

| Check | URL |
|-------|-----|
| Production preview | `https://1b8147da-2812-42a5-946e-f83c582d3071-production.weweb.io/` |
| Head smoke | `data-ww-head-version` → `2026.09.14.v25` after paste |

## Post-deploy smoke

```bash
PREVIEW_HOST=https://luxe-omega.vercel.app bash ~/ww/sites/luxe/scripts/smoke-paths.sh
curl -sI https://luxe-omega.vercel.app/ | head -5   # expect 200 (index) or 307
curl -sI https://luxe-omega.vercel.app/heirloom | head -5   # 200
```

## Still open

- `STRIPE_SECRET_KEY` on Vercel → checkout API **500** until set
- Apex DNS for `whisperingwoodsluxe.com` → WeWeb + path rules to Vercel
- Vercel MCP SPQ scope for agent dashboard audits
