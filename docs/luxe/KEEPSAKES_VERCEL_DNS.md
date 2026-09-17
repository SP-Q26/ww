# Heirloom checkout (`/heirloom`) · audit + Vercel/DNS

**Canonical URL:** `https://whisperingwoodsluxe.com/heirloom`  
**Legacy aliases:** `/keepsakes`, `/order` (same HTML app)

**Repo path:** `sites/luxe/` on branch `luxe` · **WeWeb** owns `/` (marketing).

---

## Static audit (must pass before DNS)

| Check | Status |
|-------|--------|
| `vercel.json` rewrites `/heirloom` (+ `/keepsakes`, `/order`) → `whispering-woods-luxe/order/index.html` | In `sites/luxe/vercel.json` |
| CSS/JS under routed prefixes (`/heirloom/assets/…`, `/terms/assets/…`) | Path-split often omits `/whispering-woods-luxe/*`; page-scoped assets must hit Vercel |
| Legal pages `/terms`, `/privacypolicy` | Same asset rule; links point at `/heirloom` |
| `wwluxe-order.js` checkout API | Defaults to `{origin}/api/wwluxe/keepsake-checkout` when `WWLUXE_CONFIG.checkoutApi` is empty |
| Stripe return URLs | `/heirloom?checkout=success` / `cancelled` in JS + `api/wwluxe/keepsake-checkout.js` |

**Smoke on Vercel preview URL (before custom domain):**

1. `GET /heirloom` → 200, styled (not white wall)
2. `GET /heirloom/assets/wwluxe-shared.css` → 200
3. `GET /terms` · `/privacypolicy` → 200
4. DevTools → no 404 on assets when address bar shows `/heirloom`

Checkout button needs `STRIPE_SECRET_KEY` on the project; browsing the catalog does not.

---

## Should you wire Vercel + DNS now?

**Yes — if** the WeWeb site links to `https://whisperingwoodsluxe.com/heirloom`. Without a host for that path, clicks 404.

**Order of operations (low risk):**

### Phase 1 · Vercel only (no apex DNS change)

1. Vercel → New project → GitHub `SP-Q26/ww` · branch **`luxe`** · **Root Directory** `sites/luxe`.
2. Env (Preview + Production when ready):
   - `STRIPE_SECRET_KEY` = `sk_test_…` until live
   - `WWLUXE_SITE_ORIGIN` = `https://whisperingwoodsluxe.com`
3. Deploy → smoke `https://<project>.vercel.app/heirloom` (and `/terms`).

Marketing stays on WeWeb; you only prove the git slice.

### Phase 2 · DNS (pick one)

**A · Path split (apex on WeWeb)** — needs Cloudflare (or similar) in front of `whisperingwoodsluxe.com`:

| Path | Origin |
|------|--------|
| `/heirloom*`, `/keepsakes*`, `/order*`, `/terms*`, `/privacypolicy*`, `/api/wwluxe/*` | Vercel `ww-luxe` |
| `/*` | WeWeb publish host |

**B · Subdomain (simplest first ship)** — no path split:

| Host | Points to |
|------|-----------|
| `whisperingwoodsluxe.com` | WeWeb |
| `heirloom.whisperingwoodsluxe.com` | Vercel (`sites/luxe`) |

Then temporarily change canvas links to the subdomain **or** add a Cloudflare redirect `whisperingwoodsluxe.com/heirloom` → subdomain until Phase A.

**Do not** point the whole apex to Vercel only — that would drop the WeWeb funnel.

---

## Commit checklist (`ww` `luxe`)

- `sites/luxe/vercel.json` (`/heirloom` + alias rewrites)
- `sites/luxe/public/…` absolute assets + legal links
- `sites/luxe/api/wwluxe/keepsake-checkout.js`
- `./scripts/prune-weweb-export-junk.sh` after WeWeb publish (optional)
- Author cleanup after WeWeb push (`cleanup-git-authors-after-weweb.sh`)

WeWeb export at repo **root** is separate from `sites/luxe` deploy; only `sites/luxe` is the Vercel root directory.
