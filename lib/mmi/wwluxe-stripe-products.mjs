/**
 * WWLuxe · Stripe Product canon for MMI account (test/live)
 * Customer-facing names always lead with "Whispering Woods Luxe ·"
 * Estate checkout = deposit + remainder lines only (never single $1,420 line).
 * @see docs/MMI_STRIPE_METADATA_SCHEMA.md
 */

import {
  MMI_BRANDS,
  MMI_FULFILLMENT,
  MMI_PRODUCT_LINES,
  productMetadata,
} from "./stripe-metadata.mjs";
import { WWLUXE_SKU_TAX } from "./stripe-product-tax.mjs";

export const WWLUXE_BRAND_PREFIX = "Whispering Woods Luxe ·";

export const WWLUXE_PRODUCT_IMAGE =
  "https://whisperingwoodsluxe.com/heirloom/assets/favicon.svg";

export const WWLUXE_HOME_URL = "https://whisperingwoodsluxe.com/";
export const WWLUXE_HEIRLOOM_URL = "https://whisperingwoodsluxe.com/heirloom";

/** Oct 2026 roster — estate ticket SKUs only */
export const WWLUXE_EVENT_OCT_2026 = "luxe-estate-2026-oct";

/**
 * @type {Record<string, { prodId: string, priceId: string }>}
 * Test mode IDs — sync after Stripe Dashboard/MCP changes.
 */
export const WWLUXE_STRIPE_IDS_TEST = {
  "WWL-DEPOSIT-710": {
    prodId: "prod_VGdvermVPPNMWQ",
    priceId: "price_1UG6dC0biIaEI74ij2oETuZU",
  },
  "WWL-ESTATE-BALANCE-710": {
    prodId: "prod_VGeFZEukBCMESK",
    priceId: "price_1UG6wu0biIaEI74iUw2YTKmO",
  },
  "WWL-ESTATE-1420": {
    prodId: "prod_VGeFpAPYwHlAkb",
    priceId: "price_1UG6wp0biIaEI74isRIBktDz",
  },
  "WWL-CHALET-PREORDER-1420": {
    prodId: "prod_VGeFDhdCfaBnN5",
    priceId: "price_1UG6x40biIaEI74iMBWrVDBR",
  },
  "WWL-ALBUM-HEIRLOOM-955": {
    prodId: "prod_VGeFOHXLzNJMXh",
    priceId: "price_1UG6x60biIaEI74iBZAHm6Ei",
  },
  "WWL-DIGITAL-395": {
    prodId: "prod_VGeGhatSKgaHyA",
    priceId: "price_1UG6xw0biIaEI74iZYL2K4Ga",
  },
  "WWL-FRAME-425": {
    prodId: "prod_VGeFuG7881qFze",
    priceId: "price_1UG6xO0biIaEI74ieT5SpxSo",
  },
  "WWL-RETOUCH-7-195": {
    prodId: "prod_VGeFJ6QSEkuRwq",
    priceId: "price_1UG6xO0biIaEI74iuIhS2NKV",
  },
  "WWL-UPGRADE-FINEART-395": {
    prodId: "prod_VGeGzeMPaOhxQ3",
    priceId: "price_1UG6xx0biIaEI74i1QvgQDV6",
  },
  "WWL-MINI-PARENT-345": {
    prodId: "prod_VGeH7SuvZXbC6d",
    priceId: "price_1UG6ye0biIaEI74i4S4f3rJf",
  },
  "WWL-SPREAD-1-55": {
    prodId: "prod_VGeGF8vri1pjUL",
    priceId: "price_1UG6y00biIaEI74igmUrUpvS",
  },
  "WWL-SPREAD-5-255": {
    prodId: "prod_VGeId38gn8KLLb",
    priceId: "price_1UG6zy0biIaEI74iNHBLRowA",
  },
};

/**
 * @type {Array<{
 *   sku: string;
 *   name: string;
 *   description: string;
 *   unit_amount: number;
 *   productLine: string;
 *   fulfillment: string;
 *   eventKey?: string;
 *   url?: string;
 *   active?: boolean;
 * }>}
 */
export const WWLUXE_STRIPE_PRODUCTS = [
  {
    sku: "WWL-ESTATE-1420",
    name: "Whispering Woods Luxe · Estate Senior Experience (reference)",
    description:
      "Reference only — not for Checkout. Always bill $1,420 as non-refundable deposit ($710) + remainder ($710) as separate line items.",
    unit_amount: 142000,
    productLine: MMI_PRODUCT_LINES.ESTATE_TICKET,
    fulfillment: MMI_FULFILLMENT.SERVICE,
    eventKey: WWLUXE_EVENT_OCT_2026,
    url: WWLUXE_HOME_URL,
    active: false,
  },
  {
    sku: "WWL-DEPOSIT-710",
    name: "Whispering Woods Luxe · Non-refundable deposit · Estate senior reservation",
    description:
      "$710 non-refundable deposit · secures your senior's roster spot · no refund on cancellation or no-show per Terms",
    unit_amount: 71000,
    productLine: MMI_PRODUCT_LINES.ESTATE_DEPOSIT,
    fulfillment: MMI_FULFILLMENT.SERVICE,
    eventKey: WWLUXE_EVENT_OCT_2026,
    url: WWLUXE_HOME_URL,
  },
  {
    sku: "WWL-ESTATE-BALANCE-710",
    name: "Whispering Woods Luxe · Estate experience remainder",
    description:
      "$710 second half of the Estate Senior Experience · due 10 days before your estate day, or paid in full at booking with your non-refundable deposit",
    unit_amount: 71000,
    productLine: MMI_PRODUCT_LINES.ESTATE_BALANCE,
    fulfillment: MMI_FULFILLMENT.SERVICE,
    eventKey: WWLUXE_EVENT_OCT_2026,
    url: WWLUXE_HOME_URL,
  },
  {
    sku: "WWL-CHALET-PREORDER-1420",
    name: "Whispering Woods Luxe · Chalet Collection · Pre-order only",
    description:
      "Pre-order only · heirloom bundle · 10×10 layflat album · full digital gallery · archival framed print 20×24 · pre-order thank-you when ordered by 10 days before your estate day",
    unit_amount: 142000,
    productLine: MMI_PRODUCT_LINES.HEIRLOOM,
    fulfillment: MMI_FULFILLMENT.SERVICE,
    url: WWLUXE_HEIRLOOM_URL,
  },
  {
    sku: "WWL-ALBUM-HEIRLOOM-955",
    name: "Whispering Woods Luxe · Heirloom Album 10×10",
    description:
      "Handcrafted layflat album · 15 spreads included · luxe leather cover standard",
    unit_amount: 95500,
    productLine: MMI_PRODUCT_LINES.HEIRLOOM,
    fulfillment: MMI_FULFILLMENT.SHIP,
    url: WWLUXE_HEIRLOOM_URL,
  },
  {
    sku: "WWL-DIGITAL-395",
    name: "Whispering Woods Luxe · Digital Gallery",
    description:
      "Full-resolution downloads · private family gallery · print release for personal use",
    unit_amount: 39500,
    productLine: MMI_PRODUCT_LINES.HEIRLOOM,
    fulfillment: MMI_FULFILLMENT.DIGITAL,
    url: WWLUXE_HEIRLOOM_URL,
  },
  {
    sku: "WWL-FRAME-425",
    name: "Whispering Woods Luxe · Archival Framed Print 20×24",
    description:
      "Museum-quality materials · ready to hang · heirloom wall display",
    unit_amount: 42500,
    productLine: MMI_PRODUCT_LINES.HEIRLOOM,
    fulfillment: MMI_FULFILLMENT.SHIP,
    url: WWLUXE_HEIRLOOM_URL,
  },
  {
    sku: "WWL-RETOUCH-7-195",
    name: "Whispering Woods Luxe · Extra Retouches (7 images)",
    description: "Editorial retouch beyond your estate gallery set",
    unit_amount: 19500,
    productLine: MMI_PRODUCT_LINES.HEIRLOOM,
    fulfillment: MMI_FULFILLMENT.DIGITAL,
    url: WWLUXE_HEIRLOOM_URL,
  },
  {
    sku: "WWL-UPGRADE-FINEART-395",
    name: "Whispering Woods Luxe · Fine Art Paper Upgrade",
    description: "Museum-grade cotton and giclée papers · album upgrade only",
    unit_amount: 39500,
    productLine: MMI_PRODUCT_LINES.HEIRLOOM,
    fulfillment: MMI_FULFILLMENT.SERVICE,
    url: WWLUXE_HEIRLOOM_URL,
  },
  {
    sku: "WWL-MINI-PARENT-345",
    name: "Whispering Woods Luxe · Parent Mini Heirloom 6×6",
    description: "Paired mini heirloom album for parent and senior",
    unit_amount: 34500,
    productLine: MMI_PRODUCT_LINES.HEIRLOOM,
    fulfillment: MMI_FULFILLMENT.SHIP,
    url: WWLUXE_HEIRLOOM_URL,
  },
  {
    sku: "WWL-SPREAD-1-55",
    name: "Whispering Woods Luxe · Additional album spread",
    description: "One extra spread beyond 15 included in your heirloom album",
    unit_amount: 5500,
    productLine: MMI_PRODUCT_LINES.HEIRLOOM,
    fulfillment: MMI_FULFILLMENT.SERVICE,
    url: WWLUXE_HEIRLOOM_URL,
  },
  {
    sku: "WWL-SPREAD-5-255",
    name: "Whispering Woods Luxe · Additional spreads (5-pack)",
    description: "Bundle of five extra album spreads beyond your included 15",
    unit_amount: 25500,
    productLine: MMI_PRODUCT_LINES.HEIRLOOM,
    fulfillment: MMI_FULFILLMENT.SERVICE,
    url: WWLUXE_HEIRLOOM_URL,
  },
];

export function stripePostProductParams(row) {
  const metadata = productMetadata({
    internalSku: row.sku,
    brand: MMI_BRANDS.WWLUXE,
    productLine: row.productLine,
    fulfillment: row.fulfillment,
    eventKey: row.eventKey || "",
  });
  const params = {
    name: row.name,
    description: row.description,
    url: row.url || WWLUXE_HEIRLOOM_URL,
    images: [WWLUXE_PRODUCT_IMAGE],
    metadata,
    default_price_data: {
      currency: "usd",
      unit_amount: row.unit_amount,
      metadata: { mmi_internal_sku: row.sku, wwluxe_sku: row.sku },
    },
  };
  if (row.active === false) params.active = false;
  const tax = WWLUXE_SKU_TAX[row.sku];
  if (tax) {
    params.tax_code = tax.tax_code;
    params.shippable = tax.shippable;
  }
  return params;
}

/** @param {string} sku */
export function stripeUpdateProductParams(sku) {
  const row = WWLUXE_STRIPE_PRODUCTS.find((p) => p.sku === sku);
  const ids = WWLUXE_STRIPE_IDS_TEST[sku];
  if (!row || !ids) throw new Error(`unknown_sku:${sku}`);
  const metadata = productMetadata({
    internalSku: row.sku,
    brand: MMI_BRANDS.WWLUXE,
    productLine: row.productLine,
    fulfillment: row.fulfillment,
    eventKey: row.eventKey || "",
  });
  return {
    id: ids.prodId,
    name: row.name,
    description: row.description,
    url: row.url || WWLUXE_HEIRLOOM_URL,
    images: [WWLUXE_PRODUCT_IMAGE],
    metadata,
    ...(row.active === false ? { active: false } : { active: true }),
    ...(WWLUXE_SKU_TAX[row.sku]
      ? {
          tax_code: WWLUXE_SKU_TAX[row.sku].tax_code,
          shippable: WWLUXE_SKU_TAX[row.sku].shippable,
        }
      : {}),
  };
}
