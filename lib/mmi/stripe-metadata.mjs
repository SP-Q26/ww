/**
 * MMI Stripe account · shared product + checkout metadata (multi-brand, multi-event)
 * Account: MMI: A Space Odyssey LLC · test/live via env keys
 * Canon doc: docs/MMI_STRIPE_METADATA_SCHEMA.md
 */

/** Customer-facing brands on one Stripe account */
export const MMI_BRANDS = Object.freeze({
  WWLUXE: "wwluxe",
  COMPANYTOWN: "companytown",
  WW_EVENTS: "ww_events",
});

/** Webhook / ops routing lanes (one checkout surface each) */
export const MMI_LANES = Object.freeze({
  WWLUXE_ESTATE_BOOKING: "wwluxe_estate_booking",
  WWLUXE_HEIRLOOM: "wwluxe_heirloom",
  WW_EVENTS_MUSIC: "ww_events_music_checkout",
  COMPANYTOWN_TICKETS: "companytown_tickets",
  COMPANYTOWN_MERCH: "companytown_merch",
});

/** Product taxonomy */
export const MMI_PRODUCT_LINES = Object.freeze({
  ESTATE_TICKET: "estate_ticket",
  ESTATE_DEPOSIT: "estate_deposit",
  ESTATE_BALANCE: "estate_balance",
  /** @deprecated use HEIRLOOM — value `heirloom` is canon */
  KEEPSAKE: "heirloom",
  HEIRLOOM: "heirloom",
  TICKET: "ticket",
  MERCH: "merch",
  SCRIP: "scrip",
  FEE: "fee",
});

export const MMI_FULFILLMENT = Object.freeze({
  SERVICE: "service",
  DIGITAL: "digital",
  SHIP: "ship",
  BADGE: "badge",
  NONE: "none",
});

/**
 * Registered programs (add rows before creating event-bound Stripe products).
 * @type {Record<string, { brand: string, program: string, label: string, days?: number, status: string }>}
 */
export const MMI_EVENT_REGISTRY = Object.freeze({
  "luxe-estate-2026-oct": {
    brand: MMI_BRANDS.WWLUXE,
    program: "senior_estate",
    label: "Estate Senior Experience · Oct 2026",
    days: 1,
    status: "active",
  },
  "luxe-estate-2027-spring": {
    brand: MMI_BRANDS.WWLUXE,
    program: "senior_estate",
    label: "Estate Senior Experience · Spring 2027 (2-day)",
    days: 2,
    status: "planned",
  },
  "luxe-estate-2027-fall-day": {
    brand: MMI_BRANDS.WWLUXE,
    program: "senior_estate",
    label: "Estate Senior Day · Fall 2027 (possible)",
    days: 1,
    status: "tentative",
  },
  "ww-music-2027-summer": {
    brand: MMI_BRANDS.WW_EVENTS,
    program: "music_weekend",
    label: "Small music weekend · Summer 2027 (2-day)",
    days: 2,
    status: "planned",
  },
  "companytown-2027-fall": {
    brand: MMI_BRANDS.COMPANYTOWN,
    program: "companytown_invitational",
    label: "Companytown Invitational · Fall 2027",
    days: 2,
    status: "planned",
  },
});

/** Card statement suffix per brand (≤22 chars total with prefix; check Stripe rules) */
export const MMI_STATEMENT_SUFFIX = Object.freeze({
  [MMI_BRANDS.WWLUXE]: "WW LUXE",
  [MMI_BRANDS.COMPANYTOWN]: "COMPANYTOWN",
  [MMI_BRANDS.WW_EVENTS]: "WW EVENTS",
});

/**
 * Build Product/Price metadata for Stripe API (all string values).
 */
export function productMetadata({
  internalSku,
  brand,
  productLine,
  fulfillment,
  eventKey = "",
}) {
  if (!internalSku || !brand || !productLine || !fulfillment) {
    throw new Error("productMetadata: missing required field");
  }
  const meta = {
    mmi_brand: brand,
    mmi_internal_sku: internalSku,
    mmi_product_line: productLine,
    mmi_fulfillment: fulfillment,
    mmi_schema_version: "1",
  };
  if (eventKey) meta.mmi_event_key = eventKey;

  if (internalSku.startsWith("WWL-")) meta.wwluxe_sku = internalSku;
  if (internalSku.startsWith("CT-")) meta.ct_sku = internalSku;
  if (internalSku.startsWith("WWE-")) meta.wwe_sku = internalSku;

  return meta;
}

/**
 * Checkout Session + PaymentIntent metadata (Xano / Vercel).
 * Merges lane router fields with flow-specific keys.
 */
export function sessionMetadata({
  brand,
  lane,
  eventKey = "",
  extra = {},
}) {
  const base = {
    mmi_brand: brand,
    mmi_lane: lane,
    mmi_schema_version: "1",
  };
  if (eventKey) base.mmi_event_key = eventKey;
  return { ...base, ...extra };
}

/** Default session fields for Luxe keepsake API (backward compatible) */
export function wwluxeKeepsakeSessionMetadata(body, contact) {
  const eventKey =
    body.event_key ||
    body.mmi_event_key ||
    (contact.mode === "preorder" ? "luxe-estate-2026-oct" : "");

  return sessionMetadata({
    brand: MMI_BRANDS.WWLUXE,
    lane: MMI_LANES.WWLUXE_HEIRLOOM,
    eventKey,
    extra: {
      wwluxe_source: body.source || "order_web",
      wwluxe_email: String(contact.email || "").slice(0, 500),
      wwluxe_name: String(contact.name || "").slice(0, 500),
      wwluxe_senior: String(contact.senior || "").slice(0, 200),
      wwluxe_ref: String(contact.ref || "").slice(0, 200),
      wwluxe_cover: String(contact.cover || "").slice(0, 50),
      wwluxe_mode: String(contact.mode || "").slice(0, 50),
      wwluxe_terms: String(body.terms_version || "").slice(0, 50),
    },
  });
}
