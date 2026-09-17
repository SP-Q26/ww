# Luxe · git + Vercel canon (single branch)

**Repo:** `SP-Q26/ww` (`~/ww`)

## One branch: `main`

| Step | Owner |
|------|--------|
| WeWeb publish → GitHub | **WeWeb** → branch **`main`** (default; email / GitHub integration expectations) |
| Vercel production build | **`main`** @ repo root (`.`) |
| Heirloom slice + APIs | `sites/luxe/` merged in **`postbuild`** / `scripts/vercel-build.sh` — not a separate deploy repo |

**Do not** maintain a parallel **`luxe`** git branch for day-to-day Luxe work. Preview vs production is **WeWeb preview** vs **Vercel** (`luxe-omega.vercel.app` / custom domain), not two git branches.

## Vercel project `luxe` (dashboard)

After any change to production branch:

1. **Settings → Git → Production Branch** → **`main`**
2. **Root Directory** → **`.`** (empty)
3. Build: `bash scripts/vercel-build.sh` · output **`dist`**

`vercel.json` enables deployments on **`main`** only (`deploymentEnabled.main`).

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
