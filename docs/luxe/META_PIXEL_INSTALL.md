# Meta Pixel · Whispering Woods Luxe (safe install)

**Principle:** Pixel is **analytics only**. It does not touch Xano, Stripe, or the booking workflow. If `meta_pixel_id` is **empty**, **no** request is sent to Facebook.

**Hard law (2026-09-18):** Do **not** put Meta Pixel in WeWeb **Project Head** or `vite.config.js` export head. Vercel `postbuild` runs `strip-luxe-meta-pixel-from-dist.mjs` and **fails the build** if pixel tags remain in `dist/index.html`. Re-enable ads only via a reviewed, isolated loader (not global head) after launch stability.

## 1 · Get the Pixel ID

Meta Business Suite → **Datasets** (Pixel) → copy the **15-digit ID**.

## 2 · WeWeb Project Head (marketing home + modal)

In `WW_SITE_CONFIG` (Project Head bridge), set:

```js
meta_pixel_id: "2254112335167924",
```

Add **before** `site-bridge.js` (or at end of Head):

```html
<script src="https://whisperingwoodsluxe.com/heirloom/assets/wwl-meta-pixel.js" defer></script>
```

Publish WeWeb → merge to `main` so Vercel serves the JS file.

**Smoke (browser console on home):**

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
| PageView | Home (WeWeb) |
| InitiateCheckout | Modal → Stripe redirect (optional) |
| Purchase | `/booked` success |

Use **Test events** in Meta before scaling spend.

## 6 · What we deliberately did not do

- No pixel inside Stripe Checkout (hosted by Stripe).
- No blocking scripts in the booking `fetch` path.
- No Advantage+ “purchase” optimization until you have ~15+ purchases/week (use **Landing Page Views** first).
