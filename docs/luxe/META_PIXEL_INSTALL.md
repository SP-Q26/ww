# Meta Pixel · Whispering Woods Luxe (safe install)

**Principle:** Pixel is **analytics only**. It does not touch Xano, Stripe, or the booking workflow. If `meta_pixel_id` is **empty**, **no** request is sent to Facebook.

**Hard law:** Do **not** put Meta Pixel in WeWeb **Project Head** or `vite.config.js` export head. Vercel `postbuild` runs `strip-luxe-meta-pixel-from-dist.mjs` on every build, then **`inject-luxe-meta-pixel-preview.mjs` on `main` and `preview`** (same behavior). Opt out: `WW_LUXE_META_PIXEL=0`. Home PageView only: `WW_LUXE_META_PIXEL_HOME=0`.

## 1 · Get the Pixel ID

Meta Business Suite → **Datasets** (Pixel) → copy the **15-digit ID**.

## 2 · Vercel **`main` + `preview`** (marketing home)

Postbuild injects into `dist/index.html` on every production and preview deploy:

- `WW_SITE_CONFIG.meta_pixel_id` (if config block exists)
- **After splash dismiss** (`ww-luxe-welcome-dismissed` + 400ms, end of `<body>`): async load pixel — **not** at green-out (`__wwLuxeWelcomePending` flips false while the tree is still visible)
- **A/B splash:** Vercel Preview env `WW_LUXE_META_PIXEL_HOME=0` skips home PageView (booked Purchase still injects)

**Do not** paste Meta’s raw snippet in Project Head — strip step will fail the build.

Optional local build: `npm run build` (inject runs by default). Disable: `WW_LUXE_META_PIXEL=0 npm run build`

**Smoke (browser console on home — apex or preview):**

```js
typeof fbq === 'function' && document.querySelector('script[src*="wwl-meta-pixel"]')
```

With ID set, Network tab should show `fbevents.js` (after load). With ID empty, **no** `fbevents.js`.

## 3 · `/booked` confirmation (Purchase event)

Git file: `sites/luxe/public/whispering-woods-luxe/booked/index.html` already loads the same asset and fires **Purchase** when checkout was not cancelled.

Redeploy Vercel `main` after pull — no WeWeb step for `/booked`.

## 4 · InitiateCheckout (optional, modal)

Paste file `docs/luxe/paste/wwl-booking-checkout-active.js` includes a **try/catch** call immediately before `location.assign(checkoutUrl)`. Update the WeWeb **Tour Booking Modal** submit workflow when you are ready.

If `fbq` fails, checkout still redirects.

## 5 · Meta Events Manager

| Event | Where |
|-------|--------|
| PageView | Home (`main` + `preview` inject, after splash) |
| InitiateCheckout | Modal → Stripe redirect (optional paste) |
| Purchase | `/booked` success (`main` + `preview` inject) |

**Test events:** Meta Events Manager → **Test events** → open **preview URL or apex** (same inject), browse home, submit modal to Stripe (cancel ok), complete a test purchase if possible.

**Console smoke:**

```js
typeof fbq === 'function' && !!document.querySelector('script[src*="wwl-meta-pixel"]')
```

## 6 · What we deliberately did not do

- No pixel inside Stripe Checkout (hosted by Stripe).
- No blocking scripts in the booking `fetch` path.
- No Advantage+ “purchase” optimization until you have ~15+ purchases/week (use **Landing Page Views** first).
