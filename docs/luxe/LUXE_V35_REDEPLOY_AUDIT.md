# Luxe v35 · full clean redeploy audit (2026-09-17)

**WeWeb publish:** v35 (canvas `editedAt` 2026-09-17 on WhisperingWoodsLUXE)  
**Vercel project:** `luxe` → **https://luxe-omega.vercel.app** (production branch **`main`**)  
**Custom domain:** https://whisperingwoodsluxe.com (when DNS points at Vercel)

Run the automated sweep:

```bash
cd ~/ww
bash scripts/audit-luxe-deploy-sweep.sh
PREVIEW_HOST=https://luxe-omega.vercel.app SMOKE_WEWEB=1 bash sites/luxe/scripts/smoke-luxe-swarm.sh
```

After WeWeb **GitHub publish** to `main`:

```bash
CACHE_VER=35 bash scripts/prep-weweb-export-main.sh
git push origin main   # only when you intend to redeploy Vercel
```

---

## Truth layers

| Layer | What it proves |
|--------|----------------|
| **WeWeb canvas** | Modal, hero boot, Project Head — live editor / WeWeb CDN |
| **Git `main` export** | What Vercel builds (`npm ci` → `scripts/vercel-build.sh` → `postbuild.js`) |
| **Vercel `luxe`** | `/`, `/heirloom`, `/booked`, `/api/wwluxe/*` |

Preview vs production is **WeWeb preview URL** vs **Vercel** — not a second git branch (`GIT_DEPLOY_CANON.md`).

---

## P0 — must be green for “clean redeploy”

### 1. GitHub export matches publish **35**

Local snapshot at audit time still showed **`cacheVersion` 33** and **`_wwcv=33`** in `index.html` / `public/data/991a8992….json`.

**Action:** WeWeb → GitHub publish to **`SP-Q26/ww`** branch **`main`**. Pull locally, then:

- `cacheVersion` **35** in home page JSON
- `index.html` links use **`?_wwcv=35`**

### 2. Project Head **v28** (white flash)

Git doc: `docs/luxe/WEWEB_PROJECT_HEAD_BRIDGE_v26.html` (stamp **`2026.09.15.v28`** — pine `#141f19`, `theme-color`, hero-ready split with canvas).

**Action:** Paste into WeWeb **Project Head** if export still shows **v27**. Re-publish + export.

Vercel also injects early boot via `scripts/inject-luxe-critical-boot.mjs` in **`postbuild.js`** (survives export if `postbuild` script kept).

### 3. Booking modal → Stripe

**Flow:** `wwlBookingSubmitCheckout` (page onload boot) → form `submit` → `POST …/wwl/book` → `location.assign(checkout_url)`.

| Check | Status (audit) |
|--------|----------------|
| Canvas **Home · Hero video boot** registers checkout | OK (MCP) — includes Xano URL + `wwUpdate` |
| Git paste `wwl-booking-checkout-active.js` | **Newer** — `varGet` / `fieldVal` / `wwUpdate(ctx,…)` + roster helper |
| Sync canvas boot step to git paste | Run `node scripts/build-wwl-booking-hero-boot-payload.mjs` → apply via MCP `editFrontendWorkflow` (full 2-action graph) |
| Form submit workflow | Must be `return await wwlBookingSubmitCheckout(event, context)` on **Booking Form Container** |
| **Senior Email** field | Still on modal — **required** empty field can block HTML5 submit **before** workflow. Hide group `Senior Email Field Group` or set input not required (MCP `editElement` returned `PAGE_NOT_FOUND` — fix in editor if needed) |

### 4. Push `main` → Vercel redeploy

`vercel.json`: `deploymentEnabled.main: true`, `luxe: false`.

**Do not** disable GitHub email block; run `scripts/verify-git-identity.sh` before push.

### 5. HTTP smokes

```bash
PREVIEW_HOST=https://luxe-omega.vercel.app bash sites/luxe/scripts/smoke-paths.sh
```

Includes **`/heirloom/assets/stripe-products/chalet.png`** (Stripe product icon path).

Optional production:

```bash
SMOKE_PROD=1 PREVIEW_HOST=https://luxe-omega.vercel.app bash sites/luxe/scripts/smoke-paths.sh
```

---

## P1 — already in git (verify on deployed build)

- **`/heirloom`** order page medallions → `/heirloom/assets/stripe-products/*.png`
- **`postbuild.js`**: prerender (best-effort) + critical boot inject + **`copy-luxe-slice-into-dist.mjs`**
- **`api/wwluxe/keepsake-checkout.js`** at repo root (Vercel serverless)
- Docs: `VERCEL_FULL_APP.md`, `VERCEL_MCP_AUDIT.md` (team MCP **403** — use CLI/dashboard + curl smokes)

---

## P2 — Xano / Stripe live

```bash
# With env from docs/luxe/xano-pastes/
bash docs/luxe/xano-pastes/smoke-wwl-xano.sh
```

Stripe image origin: `docs/luxe/paste/stripe-live-p0/STRIPE_PRODUCT_IMAGES.md`

---

## MCP canvas fixes (integrated only)

1. **Hero boot** — `editFrontendWorkflow` id `8dbbd8ba-c8e9-420c-9c66-fb9b7aa4ff34`, scope `page`, include **both** `boot1` and `boot_wwl_checkout` actions (never partial).
2. **Tour Booking Modal** — hide **Senior Email Field Group** (`52f43d0d-…`) or clear `required` on **Senior Email Input** (`7b7343ee-…`), `componentUid` `d39c36d0-9146-4920-a2dc-a3641cf44806`.
3. **Project Head** — v28 bridge paste.

---

## Sign-off checklist

- [ ] Git `main` at **v35** export (`_wwcv=35`)
- [ ] Head **v28** on WeWeb + baked in export
- [ ] Hero boot checkout matches git paste
- [ ] Booking submit opens Stripe (deposit + pay in full)
- [ ] Senior email not blocking submit
- [ ] Vercel `luxe` deploy green on `main`
- [ ] `audit-luxe-deploy-sweep.sh` PASS
- [ ] `smoke-luxe-swarm.sh` PASS (optional `SMOKE_WEWEB=1`)
