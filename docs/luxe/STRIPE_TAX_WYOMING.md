# WWLuxe · Stripe Tax · Wyoming HQ · IL-safe

**Policy (operator):**

| Fact | Tax treatment |
|------|----------------|
| **Head office** | **Wyoming** (MMI) — Stripe Tax head office + business presence |
| **Digital heirlooms** | Ordered and delivered from **WY** (no IL warehouse) |
| **Shipped goods** (album, frame, mini) | **Ship-from WY** · collect customer **ship-to** for Stripe Tax |
| **Estate senior experience** | Performed **on Illinois estate grounds** — treat as **IL performance location** on deposit/balance lines |
| **IL compliance** | **Play safe:** register **Illinois** in Stripe Tax when CPA agrees (often before first paid estate slot) · always `automatic_tax` · never assume WY 0% on IL services |

**Not tax advice.** CPA signs nexus and registration timing.

---

## Two locations, one Checkout

```text
Wyoming (MMI)          Illinois (estate)
     │                        │
     ├─ head office           ├─ performance_location on
     ├─ digital fulfillment      WWL-DEPOSIT-710
     └─ ship-from tangible       WWL-ESTATE-BALANCE-710
```

Everything else (heirloom SKUs, Chalet components when split) uses **WY origin** + customer billing/shipping as Stripe rules dictate.

---

## Stripe Tax setup (MMI)

1. **Settings → Tax → Head office:** WY address (MMI).  
2. **Registrations:** **WY** (home) + **IL** (safe default for estate program — confirm with CPA).  
3. **Products:** `tax_code` from `lib/mmi/stripe-product-tax.mjs`.  
4. **Checkout:** `lib/mmi/wwl-tax-locations.mjs` → `stripeCheckoutAutomaticTaxParams()`.

**Test account:** Tax `status` may be `pending` until head office is saved in Dashboard.

### Env (Xano / Vercel — not in git)

```bash
# JSON · Stripe address object · country required
WWLUXE_TAX_WY_ORIGIN_JSON='{"line1":"…","city":"…","state":"WY","postal_code":"…","country":"US"}'
WWLUXE_TAX_IL_PERFORMANCE_JSON='{"line1":"…","city":"Harvard","state":"IL","postal_code":"…","country":"US"}'
```

Use the **legal/site** address for the Harvard IL estate property for performance — not a WY mailbox.

---

## Line-item rules

| SKU group | `performance_location` | Ship-from / origin |
|-----------|------------------------|-------------------|
| `WWL-DEPOSIT-710`, `WWL-ESTATE-BALANCE-710` | **IL** (`WWLUXE_TAX_IL_PERFORMANCE_JSON`) | n/a |
| Digital `WWL-DIGITAL-395` | none | **WY** (business) · tax from customer address |
| Tangible album/frame/mini | none | **WY** + ship-to |
| Chalet `WWL-CHALET-PREORDER-1420` | Prefer **split** into estate + heirloom lines at booking when tax is on; if single line, CPA picks code | mixed |

**Code:** `lib/mmi/stripe-checkout-tax-lines.mjs` builds Checkout `line_items` with `tax_behavior: exclusive` and IL performance on estate SKUs.

---

## IL “play safe” checklist

```
[ ] IL sales tax registration (or ST-1 / MyTax Illinois) when CPA says go
[ ] Stripe Tax registration: us-il active before first estate Checkout in prod
[ ] Every estate Checkout: automatic_tax enabled + IL performance on deposit/balance
[ ] wwl_payment_log.amount_tax_cents stored from webhook
[ ] Terms: published prices exclude tax; “sales tax calculated at checkout”
[ ] No claim on marketing that “Wyoming = no tax” for IL estate experience
```

---

## Wyoming filing

- File/remit **WY** for sales sourced to WY per Stripe location reports.  
- File/remit **IL** for amounts Stripe allocated to IL (estate + any IL destination sales).  
- [WY excise tax registration](https://excise-tax-div.wyo.gov/registration) with head office in state.

---

## Git map

| File | Role |
|------|------|
| `lib/mmi/wwl-tax-locations.mjs` | WY origin · IL performance · session defaults |
| `lib/mmi/stripe-checkout-tax-lines.mjs` | Checkout line_items tax hints |
| `lib/mmi/stripe-product-tax.mjs` | Product `tax_code` |
| `docs/luxe/XANO_SCHEMA.md` | `amount_tax_cents` on payments |

---

## Version

| Date | Note |
|------|------|
| 2026-09-15 | WY head · WY digital/ship · IL performance · IL-safe registration |
