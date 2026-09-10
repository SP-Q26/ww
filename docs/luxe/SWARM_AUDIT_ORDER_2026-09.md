# WWLuxe · swarm audit (Sep 2026 · order v2)

> **Superseded for full picture by** [`FULL_SWARM_AUDIT_2026-09-09.md`](./FULL_SWARM_AUDIT_2026-09-09.md) · every aspect.

**Scope:** Post–WeWeb pass · tablet `/order` · legal links · Stripe tap-to-pay

---

## Verdict

| Lane | Status |
|------|--------|
| WeWeb canvas | **Yellow** · operator pass done; verify legal URLs + pricing footer → `/order` |
| Git `/order` | **Green** · tablet 1024px · expandable cards · mode switch · spread $255 |
| Git legal | **Green** · `/terms` `/privacypolicy` (or align WeWeb to same URLs) |
| Stripe tap-to-pay | **Red** · needs Checkout Session API + webhook |
| DNS path split | **Red** · git paths on whisperingwoodsluxe.com |

---

## Legal links (canonical)

| Use | URL |
|-----|-----|
| Terms | `https://whisperingwoodsluxe.com/terms` |
| Privacy | `https://whisperingwoodsluxe.com/privacypolicy` |

See `LEGAL_LINKS_CANON.md`. WeWeb modal + `/order` checkbox must match.

---

## `/order` v2 (done)

- Max width **1024px** · 2-col product grid on tablet
- Tap card → **expand bullets** (animated)
- **Add to order** chip separate from expand
- Spreads: **15 included · $55 each or 5 for $255** · stepper only after "Add extra spreads"
- **Mode:** Pre-order vs **I already ordered Chalet** (add-ons only)
- Chalet bundle **hidden ≤7 days** before `?event=YYYY-MM-DD`
- Cover section: leather vs linen talking points + Chalet consult copy
- `?kiosk=1` · `?mode=addons` · `?ref=`

---

## WeWeb · verify

- [ ] Modal TOS → `/terms` · Privacy → `/privacypolicy`
- [ ] Keepsake prices on canvas
- [ ] Pricing footer → `/order`
- [ ] Disqualifier 4×4 · customize heirloom block
- [ ] `wf_booking_form_submit` untouched

---

## Tap to pay · how to ensure it works

1. **Never** collect card numbers in HTML.
2. Xano `POST /keepsake-checkout` creates **Stripe Checkout Session** with `line_items` from SKU table.
3. Enable **Apple Pay + Google Pay** in Stripe Dashboard → Payment methods.
4. Return `checkout_url` → browser redirect (wallets auto-show on phone).
5. **Webhook** `checkout.session.completed` marks order paid before production.
6. Optional: pass `?event=` on QR so pre-order window closes automatically.

Detail: `PAYMENT_FLOW.md`

---

## P0 operator

- [ ] DNS path routes for `/order` `/terms` `/privacypolicy`
- [ ] Stripe Price IDs (`WWL-SPREAD-5-255` not 250)
- [ ] Checkout API live
- [ ] Chalet QR: `https://whisperingwoodsluxe.com/order?kiosk=1&ref={booking}`

---

## P3 snuffed

- Card fields in static HTML
- Chalet bundle after T-7 days
- SPQ `/privacy` for WWLuxe
