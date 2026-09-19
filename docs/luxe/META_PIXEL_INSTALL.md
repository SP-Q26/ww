# Meta Pixel · Whispering Woods Luxe (safe install)

**Principle:** Pixel is **analytics only**. It does not touch Xano, Stripe, or the booking workflow. If `meta_pixel_id` is **empty**, **no** request is sent to Facebook.

**Hard law (2026-09-18):** Do **not** put Meta Pixel in WeWeb **Project Head** or `vite.config.js` export head. Vercel `postbuild` runs `strip-luxe-meta-pixel-from-dist.mjs` on every build, then **`inject-luxe-meta-pixel-preview.mjs` only on git branch `preview`** (or `WW_LUXE_META_PIXEL=1` locally). Production **`main`** home stays pixel-free until you promote the inject gate.

## 1 · Get the Pixel ID

Meta Business Suite → **Datasets** (Pixel) → copy the **15-digit ID**.

## 2 · Vercel **preview** (marketing home — preferred for testing)

Push **`preview`** branch. Postbuild injects into `dist/index.html`:

- `WW_SITE_CONFIG.meta_pixel_id` (if config block exists)
- `window.WWL_META_PIXEL_ID` + `/heirloom/assets/wwl-meta-pixel.js`

**Do not** paste Meta’s raw snippet in Project Head — strip step will fail the build.

Optional local build: `WW_LUXE_META_PIXEL=1 npm run build`

**Smoke (browser console on preview home):**

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
| PageView | Home (preview inject) |
| InitiateCheckout | Modal → Stripe redirect (optional paste) |
| Purchase | `/booked` success (preview inject) |

**Test events:** Meta Events Manager → **Test events** → open your **Vercel preview URL** (branch `preview`), browse home, submit modal to Stripe (cancel ok), complete a test purchase if possible.

**Console smoke:**

```js
typeof fbq === 'function' && !!document.querySelector('script[src*="wwl-meta-pixel"]')
```

## 6 · What we deliberately did not do

- No pixel inside Stripe Checkout (hosted by Stripe).
- No blocking scripts in the booking `fetch` path.
- No Advantage+ “purchase” optimization until you have ~15+ purchases/week (use **Landing Page Views** first).
