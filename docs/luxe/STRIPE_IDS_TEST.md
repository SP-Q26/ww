# MMI Stripe · test mode · WWLuxe catalog IDs

**Account:** MMI: A Space Odyssey LLC sandbox · `acct_1UG5yw0biIaEI74i`  
**Brand:** `mmi_brand=wwluxe` on all rows below  
**Canon copy:** `lib/mmi/wwluxe-stripe-products.mjs`  
**Checkout lines:** `lib/mmi/estate-checkout-lines.mjs` (estate = deposit + balance, never single $1,420 line)

| `mmi_internal_sku` | Product name (customer) | `prod_…` | `price_…` | ¢ |
|--------------------|-------------------------|----------|-----------|---|
| `WWL-DEPOSIT-710` | Whispering Woods Luxe · Non-refundable deposit · Estate senior reservation | `prod_VGdvermVPPNMWQ` | `price_1UG6dC0biIaEI74ij2oETuZU` | 71000 |
| `WWL-ESTATE-BALANCE-710` | Whispering Woods Luxe · Estate experience remainder | `prod_VGeFZEukBCMESK` | `price_1UG6wu0biIaEI74iUw2YTKmO` | 71000 |
| `WWL-ESTATE-1420` | Whispering Woods Luxe · Estate Senior Experience (reference) · **inactive** | `prod_VGeFpAPYwHlAkb` | `price_1UG6wp0biIaEI74isRIBktDz` | 142000 |
| `WWL-CHALET-PREORDER-1420` | Whispering Woods Luxe · Chalet Collection · Pre-order only | `prod_VGeFDhdCfaBnN5` | `price_1UG6x40biIaEI74iMBWrVDBR` | 142000 |
| `WWL-ALBUM-HEIRLOOM-955` | Whispering Woods Luxe · Heirloom Album 10×10 | `prod_VGeFOHXLzNJMXh` | `price_1UG6x60biIaEI74iBZAHm6Ei` | 95500 |
| `WWL-DIGITAL-395` | Whispering Woods Luxe · Digital Gallery | `prod_VGeGhatSKgaHyA` | `price_1UG6xw0biIaEI74iZYL2K4Ga` | 39500 |
| `WWL-FRAME-425` | Whispering Woods Luxe · Archival Framed Print 20×24 | `prod_VGeFuG7881qFze` | `price_1UG6xO0biIaEI74ieT5SpxSo` | 42500 |
| `WWL-RETOUCH-7-195` | Whispering Woods Luxe · Extra Retouches (7 images) | `prod_VGeFJ6QSEkuRwq` | `price_1UG6xO0biIaEI74iuIhS2NKV` | 19500 |
| `WWL-UPGRADE-FINEART-395` | Whispering Woods Luxe · Fine Art Paper Upgrade | `prod_VGeGzeMPaOhxQ3` | `price_1UG6xx0biIaEI74i1QvgQDV6` | 39500 |
| `WWL-MINI-PARENT-345` | Whispering Woods Luxe · Parent Mini Heirloom 6×6 | `prod_VGeH7SuvZXbC6d` | `price_1UG6ye0biIaEI74i4S4f3rJf` | 34500 |
| `WWL-SPREAD-1-55` | Whispering Woods Luxe · Additional album spread | `prod_VGeGF8vri1pjUL` | `price_1UG6y00biIaEI74igmUrUpvS` | 5500 |
| `WWL-SPREAD-5-255` | Whispering Woods Luxe · Additional spreads (5-pack) | `prod_VGeId38gn8KLLb` | `price_1UG6zy0biIaEI74iNHBLRowA` | 25500 |

**Xano estate Checkout (price IDs):**

- Deposit line (always line 1): `price_1UG6dC0biIaEI74ij2oETuZU`
- Balance / remainder line (line 2 when pay-in-full, or T−10): `price_1UG6wu0biIaEI74iUw2YTKmO`
- Chalet pre-order add-on: `price_1UG6x40biIaEI74iMBWrVDBR`

**Pay in full:** same session still uses **two** estate prices (deposit + remainder), not `WWL-ESTATE-1420`.

**URLs:** Estate products → `https://whisperingwoodsluxe.com/` · Heirlooms → `https://whisperingwoodsluxe.com/heirloom`  
**Image:** `https://whisperingwoodsluxe.com/heirloom/assets/favicon.svg` (swap for 512px PNG when ready)

**Live mode:** Re-run `node scripts/seed-mmi-wwluxe-stripe-test.mjs` with `sk_live_…` on MMI only — then duplicate this table as `STRIPE_IDS_LIVE.md`.
