# WWLuxe · SKU catalog (checkout + sample order)

**Customer-facing:** heirloom · handcrafted · keepsake · no vendor names.  
**Internal SKU codes:** use in Xano / Stripe / operator sheets only.

---

## Architecture recommendation

| Surface | URL | Role |
|---------|-----|------|
| **Main funnel** | `whisperingwoodsluxe.com` (WeWeb `/home`) | Estate booking modal · $710 deposit · zero-dropoff |
| **Keepsake order** | `whisperingwoodsluxe.com/order` | Post-booking configure + pay (or pre-order add-ons at balance) |

**Yes, build `/order` as simple HTML** (prototype in `public/whispering-woods-luxe/order/index.html`). Deploy as a **WeWeb page** at route `/order` (paste HTML in `ww-html` or host static). Do **not** move estate deposit checkout off the main funnel.

Gate `/order` later with booking email or Stripe customer ID (v2). v1 can collect order intent and operator confirms.

---

## Checkout page SKUs (sellable)

### Tier A · Estate (main funnel only)

| SKU | Name (customer) | Retail | Stripe/Xano | On `/order`? |
|-----|-----------------|-------:|-------------|:------------:|
| `WWL-ESTATE-1420` | The Estate Senior Experience | $1,420 | Deposit `WWL-DEPOSIT-710` | **Link only** → home modal |
| `WWL-DEPOSIT-710` | Non-refundable deposit (50%) | $710 | With estate book | No (modal) |

### Tier B · Chalet pre-order bundle (one SKU)

| SKU | Name | Retail | Compare | Notes |
|-----|------|-------:|---------|-------|
| `WWL-CHALET-PREORDER-1420` | Chalet Collection (pre-order) | **$1,420** | ~~$1,775~~ | Standard heirloom album + digital + frame. **Not** Fine Art, mini, extra spreads, or extra retouches. |

**Bundle stack (reference only):** $955 + $395 + $425 = $1,775 · $355 thank-you.

### Tier C · À la carte keepsakes

| SKU | Name | Retail | Notes |
|-----|------|-------:|-------|
| `WWL-ALBUM-HEIRLOOM-955` | Heirloom Album 10×10 · 15 spreads | $955 | Handcrafted layflat · leather · semi-matte |
| `WWL-DIGITAL-395` | Digital Gallery Upgrade | $395 | Full-res · private gallery · print release |
| `WWL-FRAME-425` | Archival Framed Print 20×24 | $425 | Ready to hang |
| `WWL-RETOUCH-7-195` | Extra Retouches (7 max) | $195 | Editorial retouch |

### Tier D · Optionals (add-ons · not in Chalet bundle)

| SKU | Name | Retail | Notes |
|-----|------|-------:|-------|
| `WWL-UPGRADE-FINEART-395` | Fine Art paper upgrade | **+$395** | Museum-grade papers · upgrade on album only |
| `WWL-MINI-PARENT-345` | Parent Mini Keepsake 6×6 | $345 | Mom & daughter / parent keepsake |
| `WWL-SPREAD-1-55` | Additional album spread (each) | $55 | Beyond 15 included |
| `WWL-SPREAD-5-255` | Additional spreads (5-pack) | $255 | 16–20 spreads total |

**Rules:**
- Fine Art + mini + spreads: **available** at pre-order checkout and estate day à la carte.
- **Chalet bundle** stays standard spec; optionals are **line items on top**.
- Max spreads: **25** on v1 (15 base + 10 optional).

### Cover choice (checkout v2 · after swatches)

| SKU | Name | Retail | Notes |
|-----|------|-------:|-------|
| `WWL-COVER-LEATHER-0` | Luxe leather cover | $0 | Default on heirloom album |
| `WWL-COVER-LINEN-0` | Natural linen cover | $0 | Alternate at same price tier |

Do not charge different retail for leather vs linen at launch; operator picks wholesale tier internally.

---

## Sample / swatch order (operator · internal)

**Purpose:** Sales room · Chalet lounge · your own eyes before client orders.  
**Vendor cart:** use pro account; codes below are **internal PO labels**.

| PO line | Internal SKU | Qty | Notes |
|---------|--------------|----:|-------|
| Heirloom album sample 10×10 · 15 spreads · luxe leather · semi-matte | `WWL-SAMPLE-ALBUM-STD` | 1 | Pro heirloom lab line (operator) |
| Heirloom album sample · Fine Art paper (one tier you will sell) | `WWL-SAMPLE-ALBUM-FA` | 1 | For +$395 upgrade story |
| Luxe leather cover swatch | `WWL-SAMPLE-SWATCH-LEATHER` | 1 | |
| Natural linen cover swatch | `WWL-SAMPLE-SWATCH-LINEN` | 1 | |
| Pure linen swatch (optional) | `WWL-SAMPLE-SWATCH-LINEN-PURE` | 1 | If offering linen on order form |
| Fine Art paper swatch set (giclée + one cotton if offered) | `WWL-SAMPLE-SWATCH-PAPER-FA` | 1 | |
| Semi-matte vs lustre reference (if undecided) | `WWL-SAMPLE-SWATCH-PAPER-STD` | 1 | Pick one for production |
| Parent mini 6×6 sample (paired with 10×10) | `WWL-SAMPLE-MINI-66` | 1 | Mom & daughter sell |
| White presentation box (if not in album SKU) | `WWL-SAMPLE-BOX` | 1 | Optional |
| Standard debossing die proof | `WWL-SAMPLE-DEBOSS-STD` | 1 | Studio deboss if eligible |

**Do not sample:** Lite album tier, mini without parent story, every cover material.

**Coupon:** pro sample discount if account offers one (operator only).

---

## Stripe / Xano line item map (when wired)

```
estate_deposit     → WWL-DEPOSIT-710
estate_balance     → WWL-ESTATE-BALANCE-710  (auto 10 days prior)
chalet_bundle      → WWL-CHALET-PREORDER-1420
album_alacarte     → WWL-ALBUM-HEIRLOOM-955
upgrade_fineart    → WWL-UPGRADE-FINEART-395
digital            → WWL-DIGITAL-395
frame              → WWL-FRAME-425
retouch_7          → WWL-RETOUCH-7-195
mini_parent        → WWL-MINI-PARENT-345
spread_1           → WWL-SPREAD-1-55
spread_5           → WWL-SPREAD-5-255
```

---

## HTML prototype

`public/whispering-woods-luxe/order/index.html` · copy to WeWeb `/order` page.
