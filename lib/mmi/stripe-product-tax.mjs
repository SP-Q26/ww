/**
 * Stripe Tax · product tax category (tax_code on Product)
 * Rates come from Stripe Tax (head office WY + customer/performance location) — not from this file.
 * Estate lines: set performance_location = IL estate on Checkout (docs/luxe/STRIPE_TAX_WYOMING.md).
 * @see https://docs.stripe.com/tax/tax-codes
 */

export const STRIPE_TAX = Object.freeze({
  GENERAL_SERVICES: "txcd_20030000",
  DIGITAL_SUPPLIED: "txcd_10000000",
  TANGIBLE_GOODS: "txcd_99999999",
});

/** @type {Record<string, { tax_code: string, shippable: boolean }>} */
export const WWLUXE_SKU_TAX = {
  "WWL-DEPOSIT-710": { tax_code: STRIPE_TAX.GENERAL_SERVICES, shippable: false },
  "WWL-ESTATE-BALANCE-710": { tax_code: STRIPE_TAX.GENERAL_SERVICES, shippable: false },
  "WWL-ESTATE-1420": { tax_code: STRIPE_TAX.GENERAL_SERVICES, shippable: false },
  "WWL-CHALET-PREORDER-1420": { tax_code: STRIPE_TAX.GENERAL_SERVICES, shippable: false },
  "WWL-ALBUM-HEIRLOOM-955": { tax_code: STRIPE_TAX.TANGIBLE_GOODS, shippable: true },
  "WWL-DIGITAL-395": { tax_code: STRIPE_TAX.DIGITAL_SUPPLIED, shippable: false },
  "WWL-FRAME-425": { tax_code: STRIPE_TAX.TANGIBLE_GOODS, shippable: true },
  "WWL-RETOUCH-7-195": { tax_code: STRIPE_TAX.GENERAL_SERVICES, shippable: false },
  "WWL-UPGRADE-FINEART-395": { tax_code: STRIPE_TAX.GENERAL_SERVICES, shippable: false },
  "WWL-MINI-PARENT-345": { tax_code: STRIPE_TAX.TANGIBLE_GOODS, shippable: true },
  "WWL-SPREAD-1-55": { tax_code: STRIPE_TAX.GENERAL_SERVICES, shippable: false },
  "WWL-SPREAD-5-255": { tax_code: STRIPE_TAX.GENERAL_SERVICES, shippable: false },
};
