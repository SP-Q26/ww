# WWLuxe · git-owned static pages + DNS path split

| Path | File | Purpose |
|------|------|---------|
| `/order` | `public/whispering-woods-luxe/order/index.html` | Touch keepsake checkout |
| `/terms` | `public/whispering-woods-luxe/terms/index.html` | Terms of Service |
| `/privacypolicy` | `public/whispering-woods-luxe/privacypolicy/index.html` | Privacy Policy |

**Assets:** `public/whispering-woods-luxe/assets/wwluxe-shared.css` · `wwluxe-order.js`

**API (same Vercel project):** `POST /api/wwluxe/keepsake-checkout` · requires `STRIPE_SECRET_KEY` · see `XANO_STRIPE_WIRE.md`

**WeWeb:** Link to these URLs from pricing footer and booking TOS. Do not duplicate in canvas.

---

## SPQ `vercel.json` rewrites (when apex hits SPQ)

Already configured:

- `/order` → `/whispering-woods-luxe/order/index.html`
- `/terms` → `/whispering-woods-luxe/terms/index.html`
- `/privacypolicy` → `/whispering-woods-luxe/privacypolicy/index.html`
- `/privacy-policy` → alias to privacypolicy

Vercel auto-serves `/api/wwluxe/*` from `api/wwluxe/` at repo root.

---

## DNS path split (WeWeb home + git paths)

WeWeb owns `/` (marketing funnel). Git owns `/order`, `/terms`, `/privacypolicy`, and optionally `/api/*`.

### Option A · Cloudflare Workers / Transform Rules (recommended)

| Path pattern | Origin |
|--------------|--------|
| `/order*` | SPQ Vercel deployment |
| `/terms*` | SPQ Vercel |
| `/privacypolicy*` | SPQ Vercel |
| `/privacy-policy*` | SPQ Vercel |
| `/api/wwluxe/*` | SPQ Vercel |
| `/*` (default) | WeWeb publish host |

Set `WWLUXE_SITE_ORIGIN=https://whisperingwoodsluxe.com` on Vercel so Stripe return URLs stay on apex.

### Option B · Subdomain (simpler)

| Host | Role |
|------|------|
| `whisperingwoodsluxe.com` | WeWeb only |
| `order.whisperingwoodsluxe.com` | SPQ `/order` |

Update footer links and `WWLUXE_CONFIG.checkoutApi` if using subdomain.

### Option C · Apex on SPQ (all static + API)

Point apex DNS to Vercel SPQ · add WeWeb as reverse proxy for `/home` only (harder). Usually prefer Option A.

---

## Local preview

```bash
npx serve public -p 8765
# http://localhost:8765/whispering-woods-luxe/order/
```

**Kiosk URL:** `/order?kiosk=1&ref=BOOKING_ID&event=2026-10-15`

**Modes:** `?mode=addons` · `?checkout=success` after Stripe return

---

## Canon legal URLs

- Terms: `https://whisperingwoodsluxe.com/terms`
- Privacy: `https://whisperingwoodsluxe.com/privacypolicy`

See `LEGAL_LINKS_CANON.md`.
