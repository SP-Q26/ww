# WWLuxe · Stripe product images (upload format)

**Innsegall is a different project** — its `STRIPE_PRODUCT_IMAGES.md` is for scout/MSP products on innsegall.com. WWLuxe art lives only under **`~/ww`** paths below.

Stripe **Product → Image** requires **JPEG, PNG, or WEBP under 2 MB**. SVG URLs are not valid for file upload (hosted SVG may work as URL in some cases; upload uses raster only).

---

## Files to upload (512×512 PNG)

**Folder:** [`upload-for-stripe/`](./upload-for-stripe/) (also in git at `sites/luxe/public/whispering-woods-luxe/assets/stripe-products/*.png`)

| Upload this file | Stripe product (search by SKU in metadata) |
|------------------|--------------------------------------------|
| `estate-deposit.png` | `WWL-DEPOSIT-710` · full estate tree |
| `estate-remainder.png` | `WWL-ESTATE-BALANCE-710` · half tree (second half) |
| `estate-deposit.png` | `WWL-ESTATE-1420` (inactive reference — optional) |
| `chalet.png` | `WWL-CHALET-PREORDER-1420` |
| `album.png` | `WWL-ALBUM-HEIRLOOM-955` |
| `digital.png` | `WWL-DIGITAL-395` |
| `frame.png` | `WWL-FRAME-425` |
| `retouch.png` | `WWL-RETOUCH-7-195` |
| `fineart.png` | `WWL-UPGRADE-FINEART-395` |
| `mini.png` | `WWL-MINI-PARENT-345` |
| `spread.png` | `WWL-SPREAD-1-55` |
| `spread.png` | `WWL-SPREAD-5-255` |

**Dashboard:** Live mode → **Product catalog** → product → **Edit** → **Image** → **Upload** → pick PNG.

Live `prod_…` IDs: [`STRIPE_IDS_LIVE.md`](../../STRIPE_IDS_LIVE.md).

---

## Canonical assets

| Output | Source |
|--------|--------|
| `…/stripe-products/*.png` | `…/stripe-products-source/*.svg` |

Rebuild PNGs:

```bash
cd ~/ww/sites/luxe && npm install sharp --no-save
node scripts/rasterize-wwluxe-stripe-product-pngs.mjs
```

---

## After upload (optional hosted URL)

Production static (same PNGs, for URL field if you prefer):

```text
https://luxe-omega.vercel.app/heirloom/assets/stripe-products/estate.png
```

Redeploy `sites/luxe` after adding new PNGs to git.
