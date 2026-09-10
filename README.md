# Whispering Woods · `ww`

Two brands, one repo, **no SPQ / terminal**.

## Git identity (required — blocks GH007)

WeWeb login email must **not** appear in commits. Use **SP + GitHub noreply** only:

```bash
cd ~/ww
git config user.name "S.P."
git config user.email "293159210+SP-Q26@users.noreply.github.com"
git config core.hooksPath .githooks
chmod +x scripts/verify-git-identity.sh .githooks/pre-commit
```

Before every push: `./scripts/verify-git-identity.sh`  
GitHub: [Emails → Block command line pushes that expose my email](https://github.com/settings/emails) (keep on).

Customer-facing contact in this repo: **@whisperingwoodsluxe.com** / **@whisperingwoodsevents.com** only.

| Site | Domain | Marketing | Git-owned (this repo) |
|------|--------|-----------|------------------------|
| **Events** (wedding venue) | [whisperingwoodsevents.com](https://whisperingwoodsevents.com) | WeWeb publish | `sites/events/` (export or static when ready) |
| **Luxe** (estate seniors) | [whisperingwoodsluxe.com](https://whisperingwoodsluxe.com) | WeWeb `/home` | `sites/luxe/` · `/order` · legal · Stripe API |

## Vercel (recommended)

Create **two Vercel projects** from this repo:

| Vercel project | Root directory | Domain |
|----------------|----------------|--------|
| `ww-events` | `sites/events` | `whisperingwoodsevents.com` |
| `ww-luxe` | `sites/luxe` | Path split or subdomain for git routes |

**Luxe env (ww-luxe):**

- `STRIPE_SECRET_KEY`
- `WWLUXE_SITE_ORIGIN=https://whisperingwoodsluxe.com`

**Luxe DNS (apex on WeWeb):** Cloudflare rules send `/order`, `/terms`, `/privacypolicy`, `/api/wwluxe/*` → **ww-luxe** deployment. Everything else → WeWeb. See `docs/luxe/GIT_STATIC_HOSTING.md`.

## WeWeb projects (canvas — not in git)

| Brand | WeWeb project ID | Route |
|-------|------------------|-------|
| Luxe funnel | `1b8147da-2812-42a5-946e-f83c582d3071` | `/home` |
| Events venue | `53256c7e-af62-4a5c-ad51-afcf0a2d420d` | (venue site) |

Publish in WeWeb; connect each project’s GitHub to this repo only if you use WeWeb’s export sync (optional).

## Bootstrap from SPQ (one-time)

From your machine (paths adjusted if needed):

```bash
cd /path/to/ww
mkdir -p sites/luxe sites/events docs scripts

rsync -a --exclude='public/docs' /path/to/SPQ/public/whispering-woods-luxe/ sites/luxe/public/whispering-woods-luxe/
rsync -a /path/to/SPQ/api/wwluxe/ sites/luxe/api/wwluxe/
rsync -a /path/to/SPQ/lib/wwluxe/ sites/luxe/lib/wwluxe/
rsync -a /path/to/SPQ/docs/whispering-woods-luxe/ docs/luxe/
cp /path/to/SPQ/scripts/wwluxe-*.mjs scripts/
```

Then add `sites/luxe/vercel.json` (see `docs/luxe/GIT_STATIC_HOSTING.md` rewrites).

## 24h Luxe launch order

1. Bootstrap `sites/luxe` + push to `main`
2. Vercel **ww-luxe** deploy + env vars
3. DNS path split for `/order` + `/api`
4. WeWeb publish Luxe home + modal
5. Stripe catalog · `docs/luxe/STRIPE_MCP_SWARM.md`
6. Xano URLs · `docs/luxe/XANO_STRIPE_WIRE.md`

## Events site

Place venue static export or hand-built HTML under `sites/events/public/`. Until then, events can stay **WeWeb-only** on its own publish host with DNS on `whisperingwoodsevents.com`.
