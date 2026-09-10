# WWLuxe · WeWeb swarm change list (full)

**Page:** Home `991a8992-afed-4eaf-b77e-13a81380ad12`  
**Project:** `1b8147da-2812-42a5-946e-f83c582d3071`  
**Do not touch:** `wf_booking_form_submit` · TOS gate · $710 non-refundable pairing

Apply via **WeWeb in-editor AI** (Cursor MCP blocked on workspace `6b964f33…`).

---

## A · Pricing & keepsakes (post–vendor meeting)

### Price elements

| Element / area | Value |
|----------------|-------|
| Base estate card | **$1,420** · deposit **$710** (unchanged) |
| Heirloom album | **$955** |
| Digital upgrade | **$395** |
| Frame 20×24 | **$425** |
| Extra retouches | **$195** |
| Chalet bundle | **$1,420** · strikethrough **~~$1,775~~** |
| Badge | `PRE-ORDER EXCLUSIVE` |

### Copy sync (grep kill stale prices + vendor lab names on canvas)

| UID / area | Action |
|------------|--------|
| Chalet desc `6676ca3f…` | Heirloom/handcrafted language · `$1,775` à la carte · **$355 thank-you** · no vendor names |
| Upsell footer `e3b9b523…` | `$1,775` · **$355** courtesy |
| FAQ A7 `03e63424…` | Pre-order only · `$1,420` · `$1,775` minus **$355** · lab fulfilled album · frame separate |
| Album desc `f6a02c1e…` | Handcrafted layflat · 10×10 leather · 15 spreads · semi-matte |
| Digital `6e49796e…` | Extended private gallery · full-res · print release |
| Disqualifier luxe line | `$1,775` retail · **$355** courtesy |

### New block · “Customize your heirloom” (under pricing upsells)

Add `ww-text` or small card group **below** Chalet card, **not inside** bundle price:

```
Optional heirloom add-ons (pre-order or à la carte · not included in Chalet Collection):
· Fine Art paper upgrade · +$395
· Parent mini keepsake 6×6 · $345
· Additional spreads · $55 each or 5 for $255 (15 included)
· Extra retouches · $195 (7 images)
```

### New FAQ item (clone accordion)

**Q:** Can I upgrade my album or add a parent mini?  
**A:** Yes. The Chalet Collection includes our standard handcrafted heirloom album. Fine Art paper (+$395), parent mini keepsake ($345), and extra spreads are optional add-ons when you order keepsakes. Pre-order when you book or before your balance is due for bundle pricing; estate day is à la carte at full retail.

### Link to order page

Add one line on pricing footer or Chalet note:

`Configure keepsakes at whisperingwoodsluxe.com/order` (internal link when page exists · **no outbound** if same domain)

---

## B · Disqualifier 4×4 matrix (`ADD-5`)

**Section:** after Pricing `75a60e34…` · before FAQ `764a2540…`  
**Layout:** 2 columns · no CTA · sage border on right column

**Left · The Estate Experience is for you if…**
1. Editorial, magazine-quality portraits, not yearbook fillers
2. Professional HMU and unhurried time for your senior
3. A pampered day for you (Chalet lounge, no errands)
4. Heirloom memories, not just social content

**Right · This is not for you if…**
1. You need a 15-minute cap-and-gown turnaround
2. You compare to park mini-sessions or phone snapshots
3. You want the cheapest option, not a once-in-a-lifetime estate day
4. **You want a one-size-fits-all session, not a guided, tailored estate experience**

---

## C · Copy / SEO (verify still true)

| Item | Status |
|------|--------|
| Em dash purge | Re-verify U+2014 = 0 |
| Hero / Experience estate-not-studio | Hold |
| Backdrops `10+ Editorial Zones` | Hold |
| FAQ count | **11** after new FAQ (was 10) |
| Modal week TBD | Until photog lock |
| JSON-LD `startDate` | Empty until weeks firm |
| Social proof section | **Hidden** |
| Favicon | Done |

---

## D · Media (P1)

| Asset | Spec | Count |
|-------|------|------:|
| Backdrop zones | 1200×1500 · default + hover | 12 |
| Chalet section | 1600×1200 · default + hover | 2 |
| Optional chip row under backdrops | copy only | 1 |
| OG image | estate WebP 1200×630 | 1 |

---

## E · New WeWeb page `/order`

| Step | Action |
|------|--------|
| 1 | Create page route `/order` · title `Keepsake Order · Whispering Woods Luxe` |
| 2 | Paste HTML from `public/whispering-woods-luxe/order/index.html` in `ww-html` **or** rebuild native (slower) |
| 3 | `noindex` meta until Stripe wired (optional) |
| 4 | Link from pricing section only · **do not** add nav menu |

---

## F · Backend (not WeWeb canvas)

| Item | Owner |
|------|-------|
| Xano + Stripe estate book | P0 |
| Keepsake line items per `ORDER_SKU_CATALOG.md` | P1 |
| `/order` POST → Xano draft order → Stripe | P1 |
| Experience weeks in modal + hero + JSON-LD | After photog lock |

---

## G · Intentionally unchanged

- Estate **$1,420** deliverables (FAQ A10)
- Zero-dropoff funnel · single booking modal
- No vendor names on customer copy
- No estate-day discount promises
- Mom toast off-copy

---

## Paste prompt (WeWeb AI · one message)

```
Home page 991a8992-afed-4eaf-b77e-13a81380ad12. Do not touch wf_booking_form_submit.

1. Sync keepsake prices: album $955, digital $395, frame $425, retouches $195, Chalet $1420 with strikethrough $1775. All copy: $1775 stack, $355 thank-you. Remove any vendor brand names; use heirloom/handcrafted/keepsake.

2. Add "Customize your heirloom" optional block (Fine Art +$395, mini $345, spreads $55 or 5/$250, retouches $195).

3. Add FAQ: album upgrades and parent mini.

4. Add or update disqualifier section 4x4: right column 4th bullet "You want a one-size-fits-all session, not a guided, tailored estate experience."

5. Grep page for stale price tokens and vendor lab names — zero hits.

6. Create page /order from public/whispering-woods-luxe/order/index.html (ww-html). Link once from pricing footer.
```
