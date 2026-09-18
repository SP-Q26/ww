/**
 * Guest Stripe Checkout session fields — same law as `POST wwl/book` (04-wwl-book-AUDIT.md).
 * Never `customer_update` without `customer=cus_…`.
 */

/** @returns {Record<string, unknown>} spread into Checkout Session create */
export function wwlGuestCheckoutTaxAndAddressParams() {
  if (stripeAutomaticTaxDisabled()) {
    return {};
  }
  return {
    automatic_tax: { enabled: true },
    billing_address_collection: "required",
    shipping_address_collection: { allowed_countries: ["US"] },
  };
}

/** Operator escape hatch only — modal estate flow keeps tax on by default. */
function stripeAutomaticTaxDisabled() {
  return /^(0|false|no|off)$/i.test(
    String(process.env.WWLUXE_STRIPE_AUTOMATIC_TAX || "").trim()
  );
}

export function wwlGuestCheckoutPromoParams() {
  const promoOn = /^(1|true|yes)$/i.test(
    String(process.env.WWLUXE_ALLOW_PROMOTION_CODES || "").trim()
  );
  return promoOn ? { allow_promotion_codes: true } : {};
}

export function wwlStripeSecretFromEnv() {
  return (
    process.env.STRIPE_SECRET_KEY ||
    process.env.WWLUXE_STRIPE_SECRET_KEY ||
    process.env.WWL_STRIPE_SECRET_KEY ||
    ""
  );
}
