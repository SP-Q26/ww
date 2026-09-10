/**
 * WWLuxe keepsake checkout · server-side SKU canon
 * Mirrors public/whispering-woods-luxe/assets/wwluxe-order.js retail prices
 */

export const WWLUXE_SITE_ORIGIN =
  process.env.WWLUXE_SITE_ORIGIN || "https://whisperingwoodsluxe.com";

/** @type {Record<string, { name: string; description?: string }>} */
export const SKU_LABELS = {
  "WWL-CHALET-PREORDER-1420": {
    name: "Chalet Collection · Estate Reservation",
    description:
      "Whispering Woods Luxe heirloom album, digital gallery, and archival framed print",
  },
  "WWL-ALBUM-HEIRLOOM-955": {
    name: "Heirloom Album 10×10",
    description: "Handcrafted layflat album · 15 spreads included",
  },
  "WWL-DIGITAL-395": {
    name: "Digital Gallery",
    description: "Full-resolution downloads · private family gallery",
  },
  "WWL-FRAME-425": {
    name: "Archival Framed Print 20×24",
    description: "Museum-quality materials · ready to hang",
  },
  "WWL-RETOUCH-7-195": {
    name: "Extra Retouches · 7 images",
    description: "Editorial retouch beyond your estate gallery set",
  },
  "WWL-UPGRADE-FINEART-395": {
    name: "Fine Art Paper Upgrade",
    description: "Museum-grade cotton and giclée papers",
  },
  "WWL-MINI-PARENT-345": {
    name: "Parent Mini Keepsake 6×6",
    description: "Paired mini album for parent and senior",
  },
};

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
        metadata: { wwluxe_sku: row.sku },
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
