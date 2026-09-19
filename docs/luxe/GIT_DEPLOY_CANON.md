# Luxe · git + Vercel canon (single branch)

**Repo:** `SP-Q26/ww` (`~/ww`) — **Whispering Woods Luxe only.**

| Branch | Role |
|--------|------|
| **`luxe`** | WeWeb GitHub publish sink (export JSON) |
| **`preview`** | Vercel preview + splash experiments → promote **package** to `main` |
| **`main`** | Production apex (`whisperingwoodsluxe.com`) |

**Not in this repo:** Company Town, Weddings Journal, and other brands live in **separate repos/branches**. Never commit `docs/companytown/`, `docs/weddings/`, or `sites/weddings/` here (see `.gitignore`).

## Elite backup (known-good package)

**Signed off 2026-09-19** — WeWeb **v45** canvas + preview package (welcome splash, preview Meta Pixel gate, apex sitemap/robots, `main` = `preview` same tip).

| Pin | SHA | Notes |
|-----|-----|--------|
| **`main` (prod)** | `79b3f6a` | WeWeb v45 + preview package merge commit |
| **`preview`** | `a325bbc` | Same package (merge commit `79b3f6a` on main includes canon) |
| **WeWeb publish sink** | `origin/luxe` @ `79bb294` | v45 publish (operator email; merge via git only) |
| **Git tag** | `luxe-elite-backup-2026-09-19` | Set on `main` tip after smoke |

**Reload prod to this exact set:**

```bash
cd ~/ww
git fetch origin
git checkout main
git reset --hard 79b3f6a   # or: git checkout luxe-elite-backup-2026-09-19
./scripts/verify-git-identity.sh
git push origin main       # only after operator confirms; needs force if main moved
```

**Vercel without git rewrite:** Deployments → Production deployment for commit **`79b3f6a`** → Promote to Production.

**Package includes:** `cacheVersion` **45**, welcome inject, preview pixel inject, `sites/luxe` slice, apex SEO URL rewrite in postbuild — not export-only.

## Two git branches by design: `luxe` (WeWeb) → `main` (production)

| Step | Owner |
|------|--------|
| WeWeb publish → GitHub | **`luxe`** only — WeWeb signs commits with the **operator login email** (GH007 if you aimed at `main`) |
| Operator merge | **`main`** — squash or merge export from `origin/luxe`, **S.P. + noreply** author only |
| Vercel production build | **`main`** @ repo root (`.`) |
| Heirloom slice + APIs | `sites/luxe/` merged in **`postbuild`** / `scripts/vercel-build.sh` — not a separate deploy repo |

WeWeb **must not** push directly to **`main`**. Keep GitHub **“Block command line pushes that expose my email”** on. After each publish:

```bash
cd ~/ww
./scripts/merge-luxe-export-to-main.sh
# commit on main (noreply), restore sites/luxe legal if needed
./scripts/verify-git-identity.sh && git push origin main
```

See `docs/WEWEB_GITHUB_PUBLISH.md`. Ignore WeWeb root junk via `.gitignore` (`/features/`, `/terms/`, root `index.html`, etc.).

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
| `WWLUXE_ALLOW_PROMOTION_CODES` | **Optional · operator smoke** | `true` on **Vercel** + **Xano** — Checkout promo field only. **Do not** use `WWLUXE_SMOKE_COUPON_ID` (Stripe rejects `discounts` + `allow_promotion_codes`). Unset before launch. |

**Estate book is Xano-only** for Stripe session create — Vercel env alone does not affect the booking modal.

After env change: **Redeploy** production (or wait for next `main` push).

### Vercel UI cheatsheet

| Task | Path |
|------|------|
| **Production branch = `main`** | Project **luxe** → **Settings** → **Git** → **Production Branch** → `main` |
| **Root directory** | **Settings** → **General** → **Root Directory** → leave **empty** (repo root) |
| **“Deployment differs from Project Settings”** | **Deployments** → latest **Production** → **⋯** → **Redeploy** → uncheck “Use existing Build Cache” (applies current settings) |
| **Env vars** | **Settings** → **Environment Variables** → add for **Production** (and Preview if you test `/heirloom` checkout) |

**Welcome splash:** `postbuild` → `inject-luxe-critical-boot.mjs` on **`main`** and **`preview`** (same smoke path). Pine lock + static tree + rings → green-out handoff → **canvas boot** sets `data-ww-hero-video-ready`. See `SPLASH_SKELETON_CANON.md`.

## Operator loop

```text
WeWeb publish → GitHub (branch luxe)
  → merge-luxe-export-to-main.sh + noreply commit on main
  → Vercel auto-builds main
  → SMOKE_PROD=1 bash sites/luxe/scripts/smoke-paths.sh
```

## Branch `luxe` (WeWeb sink)

`origin/luxe` is the **intended** WeWeb publish target. **`origin/main`** is canonical for Vercel and identity. Optional after a main push:

```bash
git push origin main:refs/heads/luxe   # mirror tip for WeWeb diff only; not required
```

## Identity

Before commit/push: `bash scripts/verify-git-identity.sh` (noreply author only).
