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

### What Stripe Tax does (why you pay the fee)

Stripe **calculates rates**, **collects** on Checkout, and **reports** by jurisdiction. You do **not** maintain rate tables or file-by-hand for every mom ZIP.

You only declare **business facts once** (not “50 times”):

| Fact | Where to set it | Xano `wwl/book` env? |
|------|-----------------|----------------------|
| WY head office / ship-from | **Stripe Dashboard → Tax → Head office** (already Sheridan WY on MMI test) | **No** — Stripe uses this for origin |
| IL obligation to collect | **Stripe Dashboard → Tax → Registrations → Illinois** | **No** |
| Estate session **performed** in McHenry IL | **Stripe → Products** for `WWL-DEPOSIT-710` + `WWL-ESTATE-BALANCE-710` → tax / performance location **OR** one Checkout line-item override in `04` if products lack it | **Optional** `WWLUXE_TAX_IL_PERFORMANCE_JSON` only if you build lines in Xano from JSON |
| Mom’s ship-to (FL, HI, Chicago, …) | **Checkout** collects address (`billing_address_collection` + `shipping_address_collection` in `04`) | **No** — Stripe uses what she enters |
| Product category (service vs goods vs digital) | **Stripe Product `tax_code`** (set on catalog) | **No** |

`WWLUXE_TAX_WY_ORIGIN_JSON` / `WWLUXE_TAX_IL_PERFORMANCE_JSON` are for **git/Vercel** `stripe-checkout-tax-lines.mjs` only. **Estate booking via Xano does not need them** if head office, IL registration, product tax codes, and `automatic_tax` are on.

### Canon · IL performance (McHenry County estate)

Set this **once** in Stripe on estate deposit + balance products (Tax / performance location), not in every checkout:

```text
14518 O'Brien Rd, Harvard, IL 60033, US
```

(JSON shape if ever needed in Xano env: `line1`, `city` Harvard, `state` IL, `postal_code` 60033, `country` US.)

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
[ ] Terms: “Published prices exclude tax. Sales tax is calculated at checkout. Your estate session is performed in Illinois; keepsakes and shipments are fulfilled from our Wyoming HQ to the address you provide.” (`sites/luxe/.../terms/index.html` §8)
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
