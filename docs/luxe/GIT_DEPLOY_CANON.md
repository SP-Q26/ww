# Luxe · git + Vercel canon (single branch)

**Repo:** `SP-Q26/ww` (`~/ww`)

## One branch: `main`

| Step | Owner |
|------|--------|
| WeWeb publish → GitHub | **WeWeb** → branch **`main`** (default; email / GitHub integration expectations) |
| Vercel production build | **`main`** @ repo root (`.`) |
| Heirloom slice + APIs | `sites/luxe/` merged in **`postbuild`** / `scripts/vercel-build.sh` — not a separate deploy repo |

**Do not** maintain a parallel **`luxe`** git branch for day-to-day Luxe work. Preview vs production is **WeWeb preview** vs **Vercel** (`luxe-omega.vercel.app` / custom domain), not two git branches.

## Vercel project `luxe` (dashboard) — **use this one**

| Project | Use? | Why |
|---------|------|-----|
| **`luxe`** | **YES** — production | Repo **root** · full WeWeb export + `/booked` + `/heirloom` + `api/wwluxe` · alias **`luxe-omega.vercel.app`** |
| **`wwluxe`** | **NO** — retire | Old slice experiment; also builds `main` and duplicates deploys. **Pause** or disconnect Git. |

After any change to production branch:

1. **Settings → Git → Production Branch** → **`main`**
2. **Root Directory** → **`.`** (empty — **not** `sites/luxe`)
3. Build: `bash scripts/vercel-build.sh` · output **`dist`**
4. **Domains:** `whisperingwoodsluxe.com` + `www` on **`luxe` only**

`vercel.json` enables deployments on **`main`** only (`deploymentEnabled.main`).

### Environment variables (project **`luxe`** · Production)

| Variable | Required | Value |
|----------|----------|--------|
| `STRIPE_SECRET_KEY` | **Yes** (heirloom `/api/wwluxe/keepsake-checkout`) | MMI live `sk_live_…` (same account as `STRIPE_IDS_LIVE.md`) |
| `WWLUXE_SITE_ORIGIN` | **Recommended** | `https://whisperingwoodsluxe.com` (Stripe return URLs on heirloom) |

**Not on Vercel:** estate modal book uses **Xano** `WWL_STRIPE_SECRET_KEY` + `WWL_PUBLIC_ORIGIN` — set in Xano, not duplicated here unless you add server routes later.

After env change: **Redeploy** production (or wait for next `main` push).

### Vercel UI cheatsheet

| Task | Path |
|------|------|
| **Production branch = `main`** | Project **luxe** → **Settings** → **Git** → **Production Branch** → `main` |
| **Root directory** | **Settings** → **General** → **Root Directory** → leave **empty** (repo root) |
| **“Deployment differs from Project Settings”** | **Deployments** → latest **Production** → **⋯** → **Redeploy** → uncheck “Use existing Build Cache” (applies current settings) |
| **Env vars** | **Settings** → **Environment Variables** → add for **Production** (and Preview if you test `/heirloom` checkout) |

**Instant load tree:** Vercel `postbuild` runs `scripts/inject-luxe-critical-boot.mjs` (pine + sprout SVG until `data-ww-hero-video-ready=1` from **Home · Hero video boot**). Green-only tile = old deploy without splash inject, or canvas splash hidden — redeploy `main` after inject fix.

## Operator loop

```text
WeWeb publish to GitHub (main)
  → Vercel auto-builds main
  → smoke PREVIEW_HOST=https://luxe-omega.vercel.app bash sites/luxe/scripts/smoke-luxe-swarm.sh
```

## Legacy branch `luxe`

If `origin/luxe` still exists from an old experiment, either delete it on GitHub or fast-forward it to `main` once:

```bash
cd ~/ww
git fetch origin
git push origin main:refs/heads/luxe   # optional mirror; safe if luxe is abandoned
```

Canonical tip is always **`origin/main`**.

## Identity

Before commit/push: `bash scripts/verify-git-identity.sh` (noreply author only).
