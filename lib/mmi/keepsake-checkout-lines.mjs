/**
 * Heirloom Checkout line_items — modal pattern: catalog `price_` + quantity when amounts match.
 * Falls back to `price_data` only when decomposition cannot use catalog prices.
 */

import { lineItemFromPayloadRow } from "../../sites/luxe/lib/wwluxe/stripe-catalog.mjs";
import { WWLUXE_SKU_TAX } from "./stripe-product-tax.mjs";
import {
  WWLUXE_STRIPE_IDS_LIVE,
  WWLUXE_STRIPE_IDS_TEST,
  WWLUXE_STRIPE_PRODUCTS,
} from "./wwluxe-stripe-products.mjs";

const UNIT_CENTS = Object.fromEntries(
  WWLUXE_STRIPE_PRODUCTS.map((p) => [p.sku, p.unit_amount])
);

export function canonicalKeepsakeSku(raw) {
  const s = String(raw || "");
  const cut = s.split(/[×x]/)[0];
  return cut.trim() || s;
}

export function wwluxePriceCatalogForSecret(secret) {
  const key = String(secret || "");
  if (key.startsWith("sk_live_")) return WWLUXE_STRIPE_IDS_LIVE;
  return WWLUXE_STRIPE_IDS_TEST;
}

/**
 * @param {Array<{ sku: string, amount_cents: number, label?: string }>} rows
 * @param {string} secret
 */
export function stripeLineItemsForKeepsakeRows(rows, secret) {
  const catalog = wwluxePriceCatalogForSecret(secret);
  return rows.map((row) => {
    const sku = canonicalKeepsakeSku(row.sku);
    const amount = Number(row.amount_cents);
    if (!Number.isFinite(amount) || amount < 50) {
      throw new Error(`invalid_amount:${sku}`);
    }

    const unit = UNIT_CENTS[sku];
    const priceId = catalog[sku]?.priceId;

    if (priceId && unit && amount % unit === 0) {
      const quantity = amount / unit;
      if (quantity >= 1 && quantity <= 99 && Number.isInteger(quantity)) {
        return { price: priceId, quantity };
      }
    }

    const item = lineItemFromPayloadRow({ ...row, sku });
    const tax = WWLUXE_SKU_TAX[sku];
    const price_data = {
      ...item.price_data,
      tax_behavior: "exclusive",
      product_data: {
        ...item.price_data.product_data,
        ...(tax?.tax_code ? { tax_code: tax.tax_code } : {}),
      },
    };
    return { ...item, price_data };
  });
}
