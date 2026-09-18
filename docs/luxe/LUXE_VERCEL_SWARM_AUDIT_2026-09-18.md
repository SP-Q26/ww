# Luxe · full swarm audit (2026-09-18 · DNS live)

**Canon project:** `luxe` · `prj_zYZT3zKw07mQmYGdXY8e5DARl8z3` · team **SPQ**  
**Git production:** `main` @ **`af76cc2`** (WeWeb **v37**)  
**Public URL:** `https://whisperingwoodsluxe.com` (operator: DNS live) · fallback `https://luxe-omega.vercel.app`

---

## Executive summary

| Area | Verdict | Notes |
|------|---------|--------|
| Vercel production deploy | **GREEN** | `dpl_6dGr8YWWoAWfaR4E1V7iYr2ZEcNY` READY · `af76cc2` |
| HTTP GET smoke (`luxe-omega`) | **GREEN** | `/`, `/heirloom`, `/booked`, `/terms`, shared CSS **200** (agent run 2026-09-18) |
| Marketing export | **GREEN** | Git `index.html` **`_wwcv=37`** |
| Custom apex (Vercel API) | **VERIFY** | `get_project` still listed **no** custom domains on `luxe` — confirm **Settings → Domains** shows apex + **Valid** |
| Apex HTTP (agent) | **VERIFY** | Agent curl to apex **timed out / TLS error** — re-run from your network: `curl -sI https://whisperingwoodsluxe.com/` → expect **200**, not SSO |
| Hero load (tree + fade) | **YELLOW** | Canvas + Head behavior **done in editor**; git **critical tree inject** + slower tree fade **not on production** until next `main` deploy |
| Heirloom card layout | **YELLOW** | **Fixed in git** (`48px` icon column + **30px** `column-gap`); **not live** until deploy |
| Keepsake API | **YELLOW** | `POST /api/wwluxe/keepsake-checkout` — expect **400** with key, **503** without; prior audits saw **500** |
| Estate book (Xano) | **VERIFY** | `WWL_PUBLIC_ORIGIN` = **`https://whisperingwoodsluxe.com`** · live `WWL_STRIPE_SECRET_KEY` |
| Booking JS drift | **YELLOW** | `docs/luxe/paste/wwl-booking-checkout-active.js` ≠ `sites/.../wwl-booking-checkout.js` |
| Duplicate `wwluxe` project | **YELLOW** | Pause / disconnect Git if still linked |
| Uncommitted git | **YELLOW** | `inject-luxe-critical-boot.mjs`, `wwluxe-shared.css`, docs — **push + redeploy** |

---

## Hero load sequence (intended — after your canvas/Head work)

| Phase | What the user sees | Owner |
|-------|-------------------|--------|
| **0 ms** | Pine `#141f19` + **sprout/tree** (play animation) | Vercel `inject-luxe-critical-boot.mjs` (`#ww-critical-splash`) — **pending deploy** |
| **Vue mount** | Canvas **Hero Load Splash** / sprout loader (same mark; may stack briefly) | WeWeb canvas |
| **≥ ~1.2 s** | `data-ww-hero-video-ready="1"` from **Home · Hero video boot** | Canvas workflow |
| **Fade** | **Green hero plate** → video **~0.65s** (iframe opacity) | Head bridge + boot CSS |
| **Fade** | **Tree** fades on **slower** curve (canvas splash / critical overlay **~0.55s+**) | Canvas + inject CSS |

Smoke in browser console after load:

```js
document.documentElement.getAttribute("data-ww-hero-video-ready") // "1"
!!document.getElementById("ww-critical-splash") // true after next deploy with inject
```

---

## Heirloom · product cards (icon overlap)

**Root cause:** `.wwl-product__head` grid used **28px** first column while `.wwl-medallion--product` is **48×48** → art overlapped title/price.

**Fix (git, pending deploy):**

- `grid-template-columns: 48px …`
- `column-gap: 30px`
- Desktop `.wwl-product__inner { padding-left: 90px; }` (align bullets with text)

File: `sites/luxe/public/whispering-woods-luxe/assets/wwluxe-shared.css`

---

## Vercel · `luxe` only

| Check | Expected |
|-------|----------|
| Production branch | **`main`** (Settings → Git) |
| Root directory | **empty** (repo root) |
| “Deployment differs from Project Settings” | **Redeploy** production, no build cache |
| Domains | `whisperingwoodsluxe.com` + `www` on **`luxe`** |
| Env (optional until heirloom checkout) | `STRIPE_SECRET_KEY`, `WWLUXE_SITE_ORIGIN` |

**Estate booking** does **not** use Vercel Stripe — **Xano** `WWL_STRIPE_SECRET_KEY` only.

---

## HTTP smoke commands (run locally)

```bash
# Full slice + marketing on apex
SMOKE_PROD=1 PROD_HOST=https://whisperingwoodsluxe.com \
  bash sites/luxe/scripts/smoke-luxe-swarm.sh

# Git + omega default
bash scripts/audit-luxe-deploy-sweep.sh
```

---

## Sign-off (launch night)

- [ ] Apex + www **200** HTML (share one URL in ads)
- [ ] Home: tree on first paint → hero crossfade (not flat green-only)
- [ ] `/heirloom`: product icons **30px** clear of titles (after CSS deploy)
- [ ] One live **Book** → Stripe → `/booked`
- [ ] Xano `WWL_PUBLIC_ORIGIN` matches apex
- [ ] `wwluxe` project paused
- [ ] Push **`af76cc2` + heirloom/inject** commits and confirm new production deployment ID

---

## Agent evidence (2026-09-18)

- `curl` GET `luxe-omega`: `/` `/heirloom` `/booked` `/terms` `/heirloom/assets/wwluxe-shared.css` → **200**
- Vercel `luxe` latest production: **`dpl_6dGr8YWWoAWfaR4E1V7iYr2ZEcNY`** @ **`af76cc2`**
- Live `wwluxe-shared.css` on omega still has **28px / 12px gap** until next deploy
