# WWLuxe · Lab BOM audit (Chalet Collection + à la carte)

**Date:** 2026-09-09 (wholesale logged)  
**Canon retail:** `KEEPSAKES_MOM_WALK_CANON.md`  
**Lab primary:** RedTree Albums pro account (operator internal · **never** on customer copy)  
**Project:** WhisperingWoodsLUXE · Home `991a8992-afed-4eaf-b77e-13a81380ad12`

---

## Executive summary

| Line | Lab? | Retail | BOM status |
|------|------|-------:|------------|
| 10×10 Leather Heirloom Album (15 spreads) | **Yes** · flush-mount album line | **$955** | ✅ Logged wholesale ~$410 |
| Digital Gallery Upgrade | **No** · gallery platform | **$395** | ✅ High-margin service SKU |
| Premium Framed Wall Print (20×24) | **No** · not in album catalog | **$425** | ⚠️ WHCC / Bay Photo / local framer |
| Extra Retouches (7 max) | **No** · in-house editorial | **$195** | ✅ Labor SKU |
| Parent Mini 6×6 | **Yes** · mini album line | **$345** | ✅ Wholesale ~$125–$150 |
| **Chalet Collection** (pre-order bundle) | Mixed BOM | **$1,420** | ✅ Stack **$1,775** − **$355** thank-you |

**Customer copy:** handcrafted flush-mount album · never name the lab on canvas or `/order`.

---

## Logged wholesale cart (operator · 2026-09)

Build in pro account: **10×10 · 15 spreads · Luxe Leather · Semi-Matte · standard deboss**

| BOM line | Wholesale |
|----------|----------:|
| Album base (10 spreads included) | ~$318 |
| Extra spreads ×5 @ $12 | $60 |
| Luxe Leather upgrade | $70 |
| Standard deboss | $20 |
| **Album subtotal (before ship)** | **~$410** |
| Parent mini 6×6 (paired sell) | **~$125–$150** |
| Shipping (album · estimate) | $25–$45 |

**Sample discount:** pro sample code when ordering Chalet sales-room specimen (operator only).

### What the lab does *not* supply

| WW SKU | Action |
|--------|--------|
| 20×24 framed wall print | Largest matted SKU tops at **11×14** · use separate print + moulding vendor |
| Digital gallery | Pic-Time / Pixieset / private gallery · no print COGS |
| Extra retouches | Internal yearbook-editor pipeline |

---

## À la carte stack math (published retail)

| SKU | Retail | Est. COGS | Est. margin |
|-----|-------:|----------:|------------:|
| Album | **$955** | **~$410** + ship | **~$500–$520** |
| Digital | **$395** | **$0–$75** | **~$320–$395** |
| Frame 20×24 | **$425** | **$90–$180** | **~$245–$335** |
| **Stack** | **$1,775** | **~$500–$665** + frame | |
| Chalet pre-order | **$1,420** | **~$590–$750** mixed | **~$670–$830** |

Chalet bundle COGS model: album ~$410 + digital ~$50 + frame ~$130 + ship ≈ **$590–$650** → margin **~$770–$830** at $1,420.

Extra spreads retail **$55** / **5 for $255** vs wholesale **~$12/spread** → strong margin on customization.

Fine Art upgrade **+$395** retail · confirm wholesale delta before promising on every order.

---

## Canvas copy (customer-facing · no lab names)

**Element:** Upsell 1 Desc · `6676ca3f-3b7c-4322-a6ae-3f00d5ddd06b`

```
The heirloom pre-order bundle: three keepsakes, one estate team. 10×10 handcrafted flush-mount leather album (15 layflat spreads, semi-matte photographic paper) · extended private gallery with full-res downloads and print release · 20×24 archival framed wall print, ready to hang. Published market retail $1,775 à la carte · $1,420 when you pre-order at booking ($355 thank-you for ordering early). One shop from estate day to heirloom. Not sold on estate day.
```

| Element | UID | Copy |
|---------|-----|------|
| Album desc | `f6a02c1e-7244-453c-a495-d986b9535fa3` | `Handcrafted flush-mount album · 10×10 leather · 15 layflat spreads · semi-matte photographic paper · 6–8 weeks after image selection` |
| Digital desc | `6e49796e-d2da-4889-a9d7-927fb893b44f` | `Extended private gallery · full-res downloads · print release` |
| Frame desc | `a5f7665c-e945-4338-b633-0b7240ccbed8` | `20×24 archival print · premium moulding · ready to hang` |
| FAQ A7 | `03e63424…` | *Album fulfilled through our heirloom pro lab; framed wall art produced separately at archival standard.* (no vendor name) |

---

## Operator BOM checklist (before first Chalet order)

```
[ ] Pro lab account active · payment on file
[ ] Saved cart template: 10×10 · 15 spreads · Luxe Leather · Semi-Matte · standard deboss
[ ] Logged wholesale $410 album · update if cart changes
[ ] WHCC/Bay Photo SKU for 20×24 moulding + acrylic/print
[ ] Gallery platform: print-release toggles match Digital promise
[ ] Design: 15-spread album max in contract · extra spreads billed per ORDER_SKU_CATALOG
[ ] Shipping: album + frame split-ship in mom comms
[ ] Sample album in Chalet lounge
[ ] Parent mini sample if selling $345 SKU
```

---

## Risk register

| Risk | Mitigation |
|------|------------|
| Client expects all three items from one vendor | Copy: album heirloom lab · frame separate archival vendor |
| 15 spreads vs "20 pages" mom language | Use **spreads** on site |
| Turnaround 10 biz days + design | Set **6–8 weeks after image selection** on album card |
| $955 album psychology | Stays under four-digit standalone · credible vs North Shore band |

---

## Related

- `KEEPSAKES_MOM_WALK_CANON.md` · retail + bundle policy  
- `ORDER_SKU_CATALOG.md` · checkout SKUs  
- `MCP_CHALET_COPY_APPLY.md` · WeWeb paste payloads  
- `api/wwluxe/keepsake-checkout.js` · Stripe Checkout for `/order`
