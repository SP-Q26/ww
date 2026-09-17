/**
 * Map estate-checkout line rows → Stripe Checkout line_items tax hints.
 * @see estate-checkout-lines.mjs
 * @see wwl-tax-locations.mjs
 */

import { WWLUXE_STRIPE_IDS_TEST } from "./wwluxe-stripe-products.mjs";
import { WWLUXE_SKU_TAX } from "./stripe-product-tax.mjs";
import {
  ilPerformanceAddress,
  skuUsesIlPerformance,
} from "./wwl-tax-locations.mjs";

/**
 * @param {{ sku: string, amount_cents?: number }} line
 * @returns {{ price: string, quantity: number, tax_behavior?: string, tax_code?: string, tax_details?: object }}
 */
export function stripeLineItemFromCheckoutLine(line) {
  const ids = WWLUXE_STRIPE_IDS_TEST[line.sku];
  if (!ids?.priceId) throw new Error(`missing_stripe_price:${line.sku}`);

  const tax = WWLUXE_SKU_TAX[line.sku];
  const item = {
    price: ids.priceId,
    quantity: 1,
    tax_behavior: "exclusive",
  };

  if (tax?.tax_code) item.tax_code = tax.tax_code;

  if (skuUsesIlPerformance(line.sku)) {
    const perf = ilPerformanceAddress();
    if (perf) {
      item.tax_details = { performance_location: perf };
    }
  }

  return item;
}

/**
 * @param {Array<{ sku: string }>} lines from linesForModalSelection()
 */
export function stripeLineItemsFromEstateLines(lines) {
  return lines.map((line) => stripeLineItemFromCheckoutLine(line));
}
