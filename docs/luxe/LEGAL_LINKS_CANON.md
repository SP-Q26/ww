# WWLuxe · legal URL canon

Use these **everywhere** (WeWeb modal, `/order`, emails, Stripe metadata).

| Page | Canonical URL |
|------|----------------|
| Terms | `https://whisperingwoodsluxe.com/terms` |
| Privacy | `https://whisperingwoodsluxe.com/privacypolicy` |
| Keepsake order | `https://whisperingwoodsluxe.com/order` |

**Git source (if path-routed to static host):**

- `public/whispering-woods-luxe/terms/index.html`
- `public/whispering-woods-luxe/privacypolicy/index.html`

**WeWeb:** If terms/privacy already live on canvas, either:

1. **Replace** canvas pages with redirects to git URLs above (recommended single source), or  
2. Keep WeWeb pages and point `/order` checkbox to the **same paths** WeWeb uses.

**Do not use** `/privacy` (SPQ) or `/home` for WWLuxe legal.

**WeWeb booking modal:** bind TOS + Privacy links to the two canonical URLs above.

**Alias:** `/privacy-policy` rewrites to `/privacypolicy` on git host.
