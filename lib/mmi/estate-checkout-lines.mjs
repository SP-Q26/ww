/**
 * WWLuxe estate Checkout · line-item composition (every estate sale includes $710 deposit line)
 * @see docs/luxe/BOOKING_MODAL_PAYMENT_PLANS.md
 */

export const WWL_DEPOSIT_SKU = "WWL-DEPOSIT-710";
export const WWL_BALANCE_SKU = "WWL-ESTATE-BALANCE-710";
export const WWL_CHALET_SKU = "WWL-CHALET-PREORDER-1420";

/** @deprecated for Checkout — use deposit + balance lines; keep for marketing total $1,420 */
export const WWL_ESTATE_FULL_REFERENCE_SKU = "WWL-ESTATE-1420";

export const AMOUNT_DEPOSIT_CENTS = 71000;
export const AMOUNT_BALANCE_CENTS = 71000;
export const AMOUNT_CHALET_CENTS = 142000;
export const AMOUNT_ESTATE_TOTAL_CENTS = 142000;

/** Stripe Checkout / receipt label (always line 1 when estate is in cart) */
export const DEPOSIT_DISPLAY_NAME =
  "Whispering Woods Luxe · Non-refundable deposit · Estate senior reservation";

export const BALANCE_DISPLAY_PAID_IN_FULL =
  "Whispering Woods Luxe · Estate experience remainder · paid in full today";

export const BALANCE_DISPLAY_DUE_T10 =
  "Whispering Woods Luxe · Estate experience remainder · due 10 days before event";

export const CHALET_DISPLAY_NAME =
  "Whispering Woods Luxe · Chalet Collection · Pre-order only";

/**
 * @typedef {{ sku: string; amount_cents: number; display_name: string; charge_when: 'now' | 't_minus_10' }} EstateCheckoutLine
 */

/** Reserve now — deposit line only at booking; balance at T−10 */
export function linesDepositAtBooking() {
  return [
    {
      sku: WWL_DEPOSIT_SKU,
      amount_cents: AMOUNT_DEPOSIT_CENTS,
      display_name: DEPOSIT_DISPLAY_NAME,
      charge_when: "now",
    },
  ];
}

/** Pay estate in full at booking — still two lines (deposit + remainder now) */
export function linesEstatePaidInFullAtBooking() {
  return [
    {
      sku: WWL_DEPOSIT_SKU,
      amount_cents: AMOUNT_DEPOSIT_CENTS,
      display_name: DEPOSIT_DISPLAY_NAME,
      charge_when: "now",
    },
    {
      sku: WWL_BALANCE_SKU,
      amount_cents: AMOUNT_BALANCE_CENTS,
      display_name: BALANCE_DISPLAY_PAID_IN_FULL,
      charge_when: "now",
    },
  ];
}

/** T−10 off-session or pay-link — single balance line */
export function lineBalanceAtT10() {
  return {
    sku: WWL_BALANCE_SKU,
    amount_cents: AMOUNT_BALANCE_CENTS,
    display_name: BALANCE_DISPLAY_DUE_T10,
    charge_when: "t_minus_10",
  };
}

export function linesDepositPlusChaletAtBooking() {
  return [
    ...linesDepositAtBooking(),
    {
      sku: WWL_CHALET_SKU,
      amount_cents: AMOUNT_CHALET_CENTS,
      display_name: CHALET_DISPLAY_NAME,
      charge_when: "now",
    },
  ];
}

export function linesEstatePaidInFullPlusChaletAtBooking() {
  return [
    ...linesEstatePaidInFullAtBooking(),
    {
      sku: WWL_CHALET_SKU,
      amount_cents: AMOUNT_CHALET_CENTS,
      display_name: CHALET_DISPLAY_NAME,
      charge_when: "now",
    },
  ];
}

/**
 * @param {'deposit' | 'full'} estatePaymentType
 * @param {boolean} includesChalet
 * @returns {EstateCheckoutLine[]}
 */
export function linesForModalSelection(estatePaymentType, includesChalet) {
  if (estatePaymentType === "full") {
    return includesChalet
      ? linesEstatePaidInFullPlusChaletAtBooking()
      : linesEstatePaidInFullAtBooking();
  }
  return includesChalet
    ? linesDepositPlusChaletAtBooking()
    : linesDepositAtBooking();
}
