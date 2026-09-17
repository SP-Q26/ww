/**
 * WWLuxe · tax sourcing addresses (Stripe Tax)
 * Head office + digital/ship fulfillment = Wyoming (MMI).
 * On-estate photography = Illinois performance location (IL-compliant collection).
 * @see docs/luxe/STRIPE_TAX_WYOMING.md
 *
 * Set in Xano env / Vercel (no street PII in git — operator paste live values):
 *   WWLUXE_TAX_WY_ORIGIN_JSON
 *   WWLUXE_TAX_IL_PERFORMANCE_JSON
 */

/** Stripe Tax head office + default ship-from / digital fulfillment origin */
export const WWL_TAX_ROLE_WY_ORIGIN = "wy_origin";

/** Where the estate senior experience is performed (Harvard / McHenry IL grounds) */
export const WWL_TAX_ROLE_IL_PERFORMANCE = "il_performance";

/**
 * Parse JSON address from env (Stripe address shape).
 * @param {string | undefined} raw
 * @returns {Record<string, string> | null}
 */
function parseAddressEnv(raw) {
  if (!raw || typeof raw !== "string") return null;
  try {
    const o = JSON.parse(raw);
    if (!o?.country) return null;
    return o;
  } catch {
    return null;
  }
}

/** Wyoming · MMI head office / fulfillment (digital + shipped goods origin) */
export function wyOriginAddress() {
  return parseAddressEnv(process.env.WWLUXE_TAX_WY_ORIGIN_JSON);
}

/** Illinois · Whispering Woods Estate performance (estate deposit/balance lines) */
export function ilPerformanceAddress() {
  return parseAddressEnv(process.env.WWLUXE_TAX_IL_PERFORMANCE_JSON);
}

/**
 * SKUs that must use IL performance location at Checkout (not WY origin).
 * @param {string} sku
 */
export function skuUsesIlPerformance(sku) {
  return sku === "WWL-DEPOSIT-710" || sku === "WWL-ESTATE-BALANCE-710";
}

/**
 * SKUs fulfilled from WY (digital delivery + physical ship-from).
 * @param {string} sku
 */
export function skuFulfilledFromWyoming(sku) {
  if (skuUsesIlPerformance(sku)) return false;
  if (sku === "WWL-ESTATE-1420") return false;
  return true;
}

/**
 * Defaults for Stripe Checkout Session create (spread into API body).
 * IL estate lines still need per-line performance_location in Xano builder.
 */
export function stripeCheckoutAutomaticTaxParams() {
  return {
    automatic_tax: { enabled: true },
    customer_update: { address: "auto", shipping: "auto" },
    shipping_address_collection: { allowed_countries: ["US"] },
  };
}

/**
 * Optional ship-from override when Stripe Tax requests it (WY).
 * @returns {object | null}
 */
export function stripeShipFromDetails() {
  const addr = wyOriginAddress();
  if (!addr) return null;
  return { address: addr };
}
