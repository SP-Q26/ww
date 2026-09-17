# WWLuxe · 12-hour launch punchout

**Target:** Public **billboard** (WeWeb funnel) + **git paths** (`/heirloom`, legal, API shell) on apex.  
**Project:** WhisperingWoodsLUXE · `1b8147da-2812-42a5-946e-f83c582d3071` · git `SP-Q26/ww` branch **`luxe`**  
**Updated:** 2026-09-13 (post publish v2 / export `cacheVersion` 11)

---

## Launch tiers (pick what “go live” means tonight)

| Tier | User sees | Requires |
|------|-----------|----------|
| **A · Billboard** | Home, modal UI, urgency copy, `/heirloom` page loads styled | WeWeb + DNS + Vercel static slice |
| **B · Book estate** | Modal → Stripe (deposit **or** pay-in-full; optional Chalet same checkout) | Tier A + Xano + Stripe · **`docs/luxe/BOOKING_MODAL_PAYMENT_PLANS.md`** (next push) |
| **C · Chalet checkout** | `/heirloom` → Stripe | Tier A + `STRIPE_SECRET_KEY` on Vercel + catalog |

**Law:** Do **not** restructure `wf_booking_form_submit`. Roster **onload** stays **off** until Xano is live (billboard-safe).

---

## T−12 → T−10 · Git slice ready (operator)

1. **Commit + push `ww` `luxe`** (not WeWeb export root only):
   - `sites/luxe/vercel.json` — `/heirloom` canonical; `/keepsakes` + `/order` aliases
   - `sites/luxe/public/whispering-woods-luxe/**` — absolute asset paths (`/whispering-woods-luxe/assets/…`)
   - `sites/luxe/api/wwluxe/keepsake-checkout.js` — `/heirloom` return URLs
   - `docs/luxe/KEEPSAKES_VERCEL_DNS.md` (optional)
2. After any WeWeb GitHub publish: `./scripts/prune-weweb-export-junk.sh` · `./scripts/cleanup-git-authors-after-weweb.sh 6e9edcc` · `./scripts/push-main-after-cleanup.sh luxe`
3. **Do not** `git add` venue/companytown bleed — only `sites/luxe` + docs you intend.

---

## T−10 → T−8 · Vercel (`ww-luxe`)

1. Vercel → **Add project** → GitHub `SP-Q26/ww` · branch **`luxe`** · **Root Directory** `sites/luxe` (no build command; static + serverless).
2. **Environment variables** (Preview + Production):
   - `WWLUXE_SITE_ORIGIN` = `https://whisperingwoodsluxe.com`
   - `STRIPE_SECRET_KEY` = `sk_test_…` (Tier C) — omit for Tier A-only smoke
3. Deploy → smoke **preview URL**:
   - `GET /heirloom` → 200, **styled** (not white wall)
   - `GET /heirloom/assets/wwluxe-shared.css` → 200
   - `GET /terms` · `GET /privacypolicy` → 200
4. Optional: `POST /api/wwluxe/keepsake-checkout` with test body (Tier C).

---

## T−8 → T−6 · DNS (apex stays WeWeb)

**Marketing `/` → WeWeb only.** Never point full apex to Vercel.

### Option 1 · Path split (if DNS is Cloudflare on `whisperingwoodsluxe.com`)

Route to **Vercel `ww-luxe`**:

- `/heirloom*` · `/keepsakes*` · `/order*` · `/terms*` · `/privacypolicy*` · `/privacy-policy*` · `/api/wwluxe/*`  
  (Assets load via `/heirloom/assets/*` etc. — no separate `/whispering-woods-luxe/*` rule required.)

Default `/*` → **WeWeb** publish host (from WeWeb custom domain panel).

### Option 2 · Subdomain first (fastest)

- `whisperingwoodsluxe.com` → WeWeb  
- `heirloom.whisperingwoodsluxe.com` (or `keepsakes.…`) → Vercel  

Temporarily point canvas links to subdomain **or** add redirect `/heirloom` → subdomain until path split.

---

## T−6 → T−4 · WeWeb (canvas truth)

1. **WeWeb Preview** smoke (390px + desktop):
   - Home loads · no hang (no roster onload)
   - **Secure Your Spot** modal · **Experience date** shows **Oct 18, 2026** + **Spring 2027**
   - TOS / Privacy → `https://whisperingwoodsluxe.com/terms` + `/privacypolicy`
   - Pricing upsell → `/heirloom` (or subdomain if Option 2)
2. If dropdown empty: hard refresh; z-index fix is in v2 export (`zIndexOpen` 10050).
3. **Publish** WeWeb (note publish #) → GitHub `luxe` if connected → author cleanup again.
4. Custom domain in WeWeb: apex + `www` per their wizard.

---

## T−4 → T−2 · Apex smoke (production URLs)

| URL | Expect |
|-----|--------|
| `https://whisperingwoodsluxe.com/` (or `/home`) | WeWeb funnel |
| `https://whisperingwoodsluxe.com/heirloom` | Styled Chalet station |
| `https://whisperingwoodsluxe.com/terms` | Legal |
| `https://whisperingwoodsluxe.com/privacypolicy` | Legal |
| Modal TOS links | Same legal URLs |

**Tier B only:** submit modal → Stripe test checkout (placeholder Xano will fail until URLs replaced).

---

## T−2 → T−0 · Tier B/C (if in scope for 12h)

| Step | Action | Doc |
|------|--------|-----|
| Xano install | WeWeb integrations | `XANO_STRIPE_WIRE.md` |
| Replace 2 URLs | Book + waitlist (not roster onload) | same |
| Stripe estate | $710 deposit product · webhook | `STRIPE_MCP_SWARM.md` |
| Recreate roster fetch | Home `onload` **only after** live spots API | `XANO_STRIPE_WIRE.md` billboard section |
| Heirloom SKUs | Stripe prices for `/heirloom` | `ORDER_SKU_CATALOG.md` |

If Stripe/Xano slip: ship **Tier A** + `bookings@whisperingwoodsluxe.com` in modal copy as fallback.

---

## P1 · Not blocking DNS (same 12h if time)

- [ ] Zone 2 hover image (duplicate file) · one discretionary swap per `BACKDROPS_ZONE_IMAGE_SPEC.md`
- [ ] Hero tablet poster fallback (YouTube letterbox) — `WEWEB_AI_LAUNCH_MOBILE_PHOTOS_PROMPT.md`
- [ ] Photographer ICA / T-7 pay — ops, not site
- [ ] Waitlist game-day fields — `WAITLIST_GAME_DAY.md`

---

## Done checklist (sign-off)

- [ ] **Tier declared:** A / B / C
- [ ] Apex marketing loads on phone
- [ ] `/heirloom` styled on production host
- [ ] Legal 200 on production
- [ ] Git `luxe` has `sites/luxe` + author noreply on latest operator push
- [ ] No personal email in latest **sites/luxe** commit metadata (WeWeb export commits cleaned or acceptable)

**Refs:** `KEEPSAKES_VERCEL_DNS.md` · `GIT_STATIC_HOSTING.md` · `LEGAL_LINKS_CANON.md` · `LAUNCH_PUNCHOUT.md` (pricing canon)
