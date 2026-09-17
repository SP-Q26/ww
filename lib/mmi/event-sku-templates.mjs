/**
 * Future event SKUs — registry only until prices lock.
 * Create Stripe Products when operator approves catalog publish.
 * @see docs/MMI_STRIPE_METADATA_SCHEMA.md §2
 */

export const PLANNED_SKU_TEMPLATES = Object.freeze({
  "luxe-estate-2027-spring": {
    brand: "wwluxe",
    lane: "wwluxe_estate_booking",
    examples: [
      "WWL-DEPOSIT-710-2027-SPRING",
      "WWL-ESTATE-TICKET-2027-SPRING",
    ],
    note: "2-day senior estate · duplicate deposit SKU if price ≠ $710",
  },
  "luxe-estate-2027-fall-day": {
    brand: "wwluxe",
    lane: "wwluxe_estate_booking",
    examples: ["WWL-DEPOSIT-710-2027-FALL-DAY"],
    note: "Tentative single senior day",
  },
  "ww-music-2027-summer": {
    brand: "ww_events",
    lane: "ww_events_music_checkout",
    examples: ["WWE-TICKET-GA-2027", "WWE-TICKET-VIP-2027", "WWE-MERCH-TEE-M"],
    note: "2-day music · tickets + small merch",
  },
  "companytown-2027-fall": {
    brand: "companytown",
    lanes: ["companytown_tickets", "companytown_merch"],
    examples: [
      "CT-TICKET-GA-2027",
      "CT-TICKET-VIP-2027",
      "CT-MERCH-TEE-M",
      "CT-SCRIP-BUNDLE-130",
    ],
    note: "Fall invitational · see companytown settlement docs",
  },
});
