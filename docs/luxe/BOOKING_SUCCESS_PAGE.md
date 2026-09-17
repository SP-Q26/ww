# Estate booking · post-payment page

**Opinion:** After Stripe, moms should land on a **quiet confirmation** — tree, receipt note, “details incoming” — **not** the homepage hash, not Chalet, not another choice. They already decided.

## Git page (canonical)

| URL | File |
|-----|------|
| `https://whisperingwoodsluxe.com/booked?ref=01-Fall·01` | `sites/luxe/public/whispering-woods-luxe/booked/index.html` |
| Cancel | `https://whisperingwoodsluxe.com/booked?cancelled=1` |
| T−10 balance (later) | `?balance_paid=1&ref=…` |

**Assets:** `heirloom-splash-tree.svg` + `wwluxe-shared.css` (`.wwl-confirm-*`).

**Deploy:** Vercel project `sites/luxe` — `vercel.json` rewrites `/booked` → static HTML.

## Xano defaults (`04-wwl-book-post.xs`)

When WeWeb omits `success_url` / `cancel_url`:

```text
success_url = https://whisperingwoodsluxe.com/booked?ref={slot_ref}
cancel_url  = https://whisperingwoodsluxe.com/booked?cancelled=1
```

Re-paste `04` after pull, or set the same strings on the book workflow body in WeWeb.

## WeWeb (if main domain is canvas, not Vercel)

Pick one:

1. **DNS / path** — Serve `/booked` from the same Vercel static deploy (recommended).
2. **WeWeb page** `/booked` — Rebuild the same layout with native elements (tree image + text blocks). **Do not** add product sections or heirloom CTAs.
3. **Redirect only** — WeWeb page with zero content except meta refresh to the Vercel URL (last resort).

**Modal workflow:** pass explicit URLs if you override defaults:

```json
"success_url": "https://whisperingwoodsluxe.com/booked?ref={{slot_ref from book response}}",
"cancel_url": "https://whisperingwoodsluxe.com/booked?cancelled=1"
```

(`slot_ref` is in Xano book response — bind after book step if you build URL in WeWeb.)

## Copy law

- Say **payment received** / **reservation confirmed** — not “congrats, shop more.”
- **No** Chalet, heirloom, or upsell modules on this route.
- **Reference line** = `slot_ref` only (no senior name on public URL).
- Support: `bookings@whisperingwoodsluxe.com`

## Vercel preview before apex domain

| Layer | Tool | Action |
|-------|------|--------|
| `/booked` HTML | **Vercel CLI** (not MCP) | `cd ~/ww/sites/luxe && npx vercel deploy` or push `luxe` branch · smoke `https://luxe-omega.vercel.app/booked` |
| Stripe return URLs | **Xano** | Set env **`WWL_PUBLIC_ORIGIN`** = `https://luxe-omega.vercel.app` (re-paste `04` or add var in stack) · defaults to `https://whisperingwoodsluxe.com` when unset |
| Book POST body | **WeWeb MCP** | Optional: pass `success_url` / `cancel_url` in `POST wwl/book` if you override Xano defaults |
| Webhook `06` enrichments | **Xano paste** | Not MCP |

When `WWL_PUBLIC_ORIGIN` points at preview, Checkout returns to `luxe-omega.vercel.app/booked?ref=…` without touching the live domain.

## Smoke (after WeWeb publish + Vercel `/booked`)

1. `WWL_PUBLIC_ORIGIN` set (preview or prod) · Xano `04`/`06` live.
2. Static: `{ORIGIN}/booked?ref=TEST·01` and `?cancelled=1`.
3. WeWeb preview: Secure my spot → fill **Parent / caregiver name**, senior, mom email, phone, pay choice → Stripe test → **`/booked?ref=…`**.
4. Xano: slot `deposit_paid` · `wwl_payment_log` row · roster `open` −1.
5. Stripe: resend webhook → `already_handled: true`.
