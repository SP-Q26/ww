# MMI Stripe · metadata schema (single account, multi-lane)

**Account:** MMI: A Space Odyssey LLC (`acct_1UG5yw0biIaEI74i` test)  
**Code:** `lib/mmi/stripe-metadata.mjs`  
**Related:** `docs/luxe/STRIPE_MCP_SWARM.md` · `docs/companytown/STACK_AND_STREAMING.md`

One Stripe account, **multiple customer faces** — routing is always `metadata`, never separate accounts (except Innsegall on Isles LLC).

---

## 1 · Audit (2026-09-15)

| Surface | Before | Gap | After |
|---------|--------|-----|--------|
| MMI Products (test) | Empty | No catalog | WWLuxe SKUs + `mmi_*` on create |
| `keepsake-checkout.js` | `wwluxe_*` only | No brand/lane/event | Adds `mmi_brand`, `mmi_lane`, `mmi_event_key`, `mmi_schema_version` |
| `stripe-catalog.mjs` | `wwluxe_sku` in `price_data` | No `mmi_*` on lines | `productMetadata()` on `product_data.metadata` |
| Xano estate deposit | `wwluxe_sku`, booking fields | No router keys | **Wire:** `mmi_brand=wwluxe`, `mmi_lane=wwluxe_estate_booking`, `mmi_event_key` per roster week |
| Companytown (future) | Docs only | — | `CT-*` SKUs · `mmi_brand=companytown` · lanes `companytown_tickets` / `companytown_merch` |
| Innsegall | `innsegall_sku` on **other** account | — | **Do not** mix on MMI |

**Stripe limits:** 50 metadata keys, 500 chars/value — stay sparse; use `mmi_internal_sku` not prose.

---

## 2 · Event calendar (lanes)

| `mmi_event_key` | Brand | Program | When | Stripe products |
|-----------------|-------|---------|------|-----------------|
| `luxe-estate-2026-oct` | `wwluxe` | senior_estate · 1 day | Oct 2026 | Deposit/balance/full **for this roster** (current canon) |
| `luxe-estate-2027-spring` | `wwluxe` | senior_estate · **2 day** | Spring 2027 | **New** deposit/ticket SKUs when price locked (or same $710 deposit + session `event_key`) |
| `luxe-estate-2027-fall-day` | `wwluxe` | senior_estate · 1 day | Fall 2027? | Tentative — create products when confirmed |
| `ww-music-2027-summer` | `ww_events` | music_weekend · 2 day | Summer 2027 | `WWE-TICKET-*`, `WWE-MERCH-*` (small catalog) |
| `companytown-2027-fall` | `companytown` | festival · 2 day | Fall 2027 | `CT-TICKET-*`, `CT-MERCH-*`, scrip bundles |

**Rule:** Keepsakes (`WWL-ALBUM-*`, Chalet bundle, etc.) are **not** tied to `mmi_event_key` on the Product — optional `event_key` on **session** only for attribution.

**Rule:** Estate deposit/balance/full Products carry `mmi_event_key` when price or roster differs per experience; if amount is identical, one Price + **session** `mmi_event_key` is enough.

---

## 3 · Product / Price metadata (required)

| Key | Values | Notes |
|-----|--------|--------|
| `mmi_schema_version` | `1` | Bump when breaking webhook contracts |
| `mmi_brand` | `wwluxe` · `companytown` · `ww_events` | Webhook router |
| `mmi_internal_sku` | `WWL-DEPOSIT-710`, `CT-PASS-VIP-2027`, … | Canon ID · matches git |
| `mmi_product_line` | `estate_deposit` · `estate_balance` · `estate_ticket` · `keepsake` · `ticket` · `merch` · `scrip` · `fee` | Fulfillment logic |
| `mmi_fulfillment` | `service` · `digital` · `ship` · `badge` · `none` | Tax/shipping |
| `mmi_event_key` | registry key | **Omit** on evergreen keepsakes |

**Legacy (keep for old handlers):**

| Key | When |
|-----|------|
| `wwluxe_sku` | `WWL-*` products |
| `ct_sku` | `CT-*` products |
| `wwe_sku` | `WWE-*` music weekend |

---

## 4 · Checkout Session metadata (required on create)

| Key | Example | Set by |
|-----|---------|--------|
| `mmi_brand` | `wwluxe` | All flows |
| `mmi_lane` | `wwluxe_keepsake` | All flows |
| `mmi_event_key` | `luxe-estate-2027-spring` | Estate booking, tickets; optional on keepsakes |
| `mmi_schema_version` | `1` | All flows |

**Lanes (`mmi_lane`):**

| Lane | Brand | Entry |
|------|-------|--------|
| `wwluxe_estate_booking` | wwluxe | WeWeb modal → Xano |
| `wwluxe_keepsake` | wwluxe | `/api/wwluxe/keepsake-checkout` |
| `ww_events_music_checkout` | ww_events | Future music site |
| `companytown_tickets` | companytown | companytown.live passes |
| `companytown_merch` | companytown | companytown.live store |

**Luxe keepsake (existing keys — keep):** `wwluxe_source`, `wwluxe_email`, `wwluxe_name`, `wwluxe_senior`, `wwluxe_ref`, `wwluxe_cover`, `wwluxe_mode`, `wwluxe_terms`.

**Estate booking (Xano — add):** `booking_id`, `parent_email`, `senior_name`, `experience_week`, plus `mmi_*` above.

**Estate booking (checkout type — add on next push):** `estate_payment_type` = `deposit` | `full` (not BNPL/installments) · `includes_chalet` · `terms_version`. See `docs/luxe/BOOKING_MODAL_PAYMENT_PLANS.md`.

**PaymentIntent:** mirror session metadata; set `statement_descriptor_suffix` from `MMI_STATEMENT_SUFFIX[brand]` in code.

---

## 5 · SKU prefixes

| Prefix | Brand | Examples |
|--------|-------|----------|
| `WWL-` | wwluxe | `WWL-DEPOSIT-710`, `WWL-CHALET-PREORDER-1420` |
| `CT-` | companytown | `CT-TICKET-GA-2027`, `CT-MERCH-TEE-M` |
| `WWE-` | ww_events | `WWE-TICKET-GA-2027`, `WWE-MERCH-POSTER` |

Event-specific ticket when price differs: `CT-TICKET-VIP-2027` metadata `mmi_event_key=companytown-2027-fall`.

---

## 6 · Webhook router (Xano)

```text
checkout.session.completed
  → read session.metadata.mmi_lane
  → switch:
       wwluxe_estate_booking  → roster / deposit paid
       wwluxe_keepsake        → keepsake orders table
       companytown_tickets    → orders + badge tier
       companytown_merch      → orders + ship queue
       ww_events_music_checkout → orders (tickets + merch)
  → always log metadata.mmi_event_key for reporting
```

---

## 7 · Dashboard branding (one account)

- **Business URL:** primary domain or neutral presenter (`whisperingwoodsluxe.com` or events parent).
- **Checkout line names** carry the face (“Companytown Invitational · GA Pass”).
- **Descriptor suffix** per brand at session create — not per product.

---

## 8 · MCP checklist

1. `GetProducts` on MMI test — dedupe `metadata.mmi_internal_sku`.
2. Create WWLuxe canon from `STRIPE_MCP_SWARM.md` §1 with `productMetadata()`.
3. Do **not** create spring/music/CT products until SKUs/prices are locked — registry rows exist in code.
4. Paste `prod_` / `price_` into `docs/luxe/STRIPE_IDS_TEST.md` (optional git).

---

## 9 · Version history

| Version | Date | Change |
|---------|------|--------|
| 1 | 2026-09-15 | Initial multi-event schema + registry |
