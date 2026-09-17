/**
 * WWLuxe keepsake checkout · server-side SKU canon
 * Mirrors public/whispering-woods-luxe/assets/wwluxe-order.js retail prices
 */

import {
  MMI_BRANDS,
  MMI_FULFILLMENT,
  MMI_PRODUCT_LINES,
  productMetadata,
} from "../../../../lib/mmi/stripe-metadata.mjs";

export const WWLUXE_SITE_ORIGIN =
  process.env.WWLUXE_SITE_ORIGIN || "https://whisperingwoodsluxe.com";

/** @type {Record<string, { name: string; description?: string }>} */
export const SKU_LABELS = {
  "WWL-CHALET-PREORDER-1420": {
    name: "Whispering Woods Luxe · Chalet Collection · Pre-order only",
    description:
      "Pre-order only · heirloom bundle · album · digital gallery · archival framed print 20×24",
  },
  "WWL-ALBUM-HEIRLOOM-955": {
    name: "Whispering Woods Luxe · Heirloom Album 10×10",
    description: "Handcrafted layflat album · 15 spreads · luxe leather default",
  },
  "WWL-DIGITAL-395": {
    name: "Whispering Woods Luxe · Digital Gallery",
    description: "Full-resolution downloads · private family gallery",
  },
  "WWL-FRAME-425": {
    name: "Whispering Woods Luxe · Archival Framed Print 20×24",
    description: "Museum-quality materials · ready to hang",
  },
  "WWL-RETOUCH-7-195": {
    name: "Whispering Woods Luxe · Extra Retouches (7 images)",
    description: "Editorial retouch beyond your estate gallery set",
  },
  "WWL-UPGRADE-FINEART-395": {
    name: "Whispering Woods Luxe · Fine Art Paper Upgrade",
    description: "Museum-grade cotton and giclée papers · album upgrade only",
  },
  "WWL-MINI-PARENT-345": {
    name: "Whispering Woods Luxe · Parent Mini Heirloom 6×6",
    description: "Paired mini album for parent and senior",
  },
  "WWL-SPREAD-1-55": {
    name: "Whispering Woods Luxe · Additional album spread",
    description: "One extra spread beyond 15 included in your heirloom album",
  },
  "WWL-SPREAD-5-255": {
    name: "Whispering Woods Luxe · Additional spreads (5-pack)",
    description: "Bundle of five extra album spreads beyond your included 15",
  },
};

/** MMI taxonomy per keepsake SKU (evergreen — no mmi_event_key on product) */
const SKU_MMI_TAXONOMY = {
  "WWL-CHALET-PREORDER-1420": {
    productLine: MMI_PRODUCT_LINES.HEIRLOOM,
    fulfillment: MMI_FULFILLMENT.SERVICE,
  },
  "WWL-ALBUM-HEIRLOOM-955": {
    productLine: MMI_PRODUCT_LINES.HEIRLOOM,
    fulfillment: MMI_FULFILLMENT.SHIP,
  },
  "WWL-DIGITAL-395": {
    productLine: MMI_PRODUCT_LINES.HEIRLOOM,
    fulfillment: MMI_FULFILLMENT.DIGITAL,
  },
  "WWL-FRAME-425": {
    productLine: MMI_PRODUCT_LINES.HEIRLOOM,
    fulfillment: MMI_FULFILLMENT.SHIP,
  },
  "WWL-RETOUCH-7-195": {
    productLine: MMI_PRODUCT_LINES.HEIRLOOM,
    fulfillment: MMI_FULFILLMENT.DIGITAL,
  },
  "WWL-UPGRADE-FINEART-395": {
    productLine: MMI_PRODUCT_LINES.HEIRLOOM,
    fulfillment: MMI_FULFILLMENT.SERVICE,
  },
  "WWL-MINI-PARENT-345": {
    productLine: MMI_PRODUCT_LINES.HEIRLOOM,
    fulfillment: MMI_FULFILLMENT.SHIP,
  },
  "WWL-SPREAD-1-55": {
    productLine: MMI_PRODUCT_LINES.HEIRLOOM,
    fulfillment: MMI_FULFILLMENT.SERVICE,
  },
  "WWL-SPREAD-5-255": {
    productLine: MMI_PRODUCT_LINES.HEIRLOOM,
    fulfillment: MMI_FULFILLMENT.SERVICE,
  },
};

function lineItemMetadata(sku) {
  const tax = SKU_MMI_TAXONOMY[sku];
  if (!tax) {
    return { wwluxe_sku: sku };
  }
  return productMetadata({
    internalSku: sku,
    brand: MMI_BRANDS.WWLUXE,
    productLine: tax.productLine,
    fulfillment: tax.fulfillment,
  });
}

export function lineItemFromPayloadRow(row) {
  const meta = SKU_LABELS[row.sku] || {};
  const name = row.label || meta.name || row.sku;
  const amount = Number(row.amount_cents);
  if (!Number.isFinite(amount) || amount < 50) {
    throw new Error(`invalid_amount:${row.sku}`);
  }
  return {
    price_data: {
      currency: "usd",
      unit_amount: Math.round(amount),
      product_data: {
        name,
        description: meta.description || undefined,
        metadata: lineItemMetadata(row.sku),
      },
    },
    quantity: 1,
  };
}

export function siteOriginFromRequest(req) {
  const forced = process.env.WWLUXE_SITE_ORIGIN;
  if (forced) return forced.replace(/\/$/, "");
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto = req.headers["x-forwarded-proto"] || "https";
  if (host) return `${proto}://${host}`.replace(/\/$/, "");
  return WWLUXE_SITE_ORIGIN;
}
