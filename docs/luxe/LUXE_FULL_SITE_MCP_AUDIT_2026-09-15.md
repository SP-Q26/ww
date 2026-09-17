# WhisperingWoodsLUXE · full site MCP audit · 2026-09-15

Project `1b8147da-2812-42a5-946e-f83c582d3071` · breakpoints: **default (desktop)** · **tablet** · **mobile**

**Latest publish:** WeWeb **v25 (`vvv`)** · git `cacheVersion` **25** · `LUXE_PUBLISH_AUDIT_v25_vvv_2026-09-15.md` · live smoke `smoke-luxe-swarm.sh`

---

## Cleanup batch · 2026-09-15 (canvas MCP)

| Done | Item |
|------|------|
| ✅ | **1024px shell** on Experience, Backdrops, Pricing, Chalet, Estate Day, Social Proof, Right Fit, Footer inners (FAQ inner stays **860px**) |
| ✅ | Deleted **Contact Form Modal**, **FAQ Modal**, footer scroll `ww-html` hack |
| ✅ | Deleted globals: `contactModalOpen`, `faqModalOpen`, `formSubmitted`, `visionQuizStep`, duplicate `faqOpenItem` |
| ✅ | Privacy page path → **`/privacypolicy`** |
| ✅ | Terms + Privacy `ww-html`: pill nav **Home · Terms · Privacy** + full `https://whisperingwoodsluxe.com/...` links |
| ✅ | Design system guidelines: **1024 shell**, transparent sticky, legal nav pattern |
| ✅ | **Hero canvas boot** — splash `17f047b4…`, workflow `Home · Hero video boot`, `heroVideoReady` var · see `LUXE_POLISH_AUDIT_2026-09-15.md` |
| ⏳ | **Publish** WeWeb (canvas changes) · Head v27 optional trim of duplicate hero CSS |
| ⏳ | **Xano URL** in booking workflow (still placeholder) |
| ⏳ | Duplicate **`selectedDate`** — verify tour modal binding before delete |
| ⏳ | **Gallery drawer** — confirm “View Full Gallery” CTA on canvas |

---

## Site map (3 pages)

| Page | Route (WeWeb) | Role | Audit |
|------|----------------|------|--------|
| **Home** | `/home` | Single-page funnel | Primary · see below |
| **Terms of Service** | `/terms` | `ww-html` TOS block | Matches canon URL · pill nav |
| **Privacy Policy** | `/privacypolicy` | `ww-html` privacy block | **Aligned** with `LEGAL_LINKS_CANON.md` |

---

## Library components (modals)

| Component | Used on Home export? | Verdict |
|-----------|----------------------|---------|
| **Tour Booking Modal** | Yes (69 refs) | **Keep** · only booking surface |
| **Contact Form Modal** | No refs in export | **Remove** or archive if not on canvas |
| **FAQ Modal** | No refs in export | **Remove** · FAQ is on-page accordion |

Orphan globals tied to dead modals: `contactModalOpen`, `faqModalOpen`, `formSubmitted` → **delete** if modals removed.

---

## Home · layout shell by breakpoint

| Area | Desktop | Tablet | Mobile | Gap vs doctrine |
|------|---------|--------|--------|-----------------|
| Section inners (`experience-inner`, `backdrops-inner`, `pricing-inner`, footer) | `maxWidth: 1200px`, pad `0 24px` | pad `0 20px` | pad `0 16px` | **1024 shell not applied** (0× `1024` in export) |
| FAQ inner | `maxWidth: 860px` | same cascade | `0 16px` | OK narrow reading column |
| Hero | `100svh`, overlay absolute, video z-stack | `100svh` | `100svh` | Canvas + Head v27 iframe crop |
| Sticky `#ww-sticky-nav` | fixed pill `28rem`, blur, **transparent** | smaller pad, 40px targets | 44px hover targets | DS guidelines still say **charcoal 0.92** → update guidelines |
| Pricing columns | **row** (2 col) | **column** stack | **column** stack | OK |
| Backdrops grid | row wrap | row wrap | gap 16 | OK |
| Experience cards | row wrap | row wrap | gap 16 | OK |
| Footer inner | `120px` bottom pad | `110px` | `120px` | Clears sticky · OK |

**Add (if 1024 is still the product rule):** set shared inner wrappers to `maxWidth: 1024px` (not 1200) on default + center on pine page background.

---

## Home · remove / simplify

| Item | Why |
|------|-----|
| **Footer `ww-html` “Page Scroll and Animation Controller”** | Hidden 0×0; duplicates Chalet hover (canvas parent states) + smooth scroll (DS + Head). **Remove** after confirming Chalet tap on real devices. |
| **Contact + FAQ modals** | Unused; FAQ is section `764a2540…` + sticky internal link. |
| **Duplicate project variables** | Two `faqOpenItem`, two `selectedDate` (MCP inventory) · keep `activeFaqIndex` + one date var. |
| **`visionQuizStep`** | No quiz UI in semantic · legacy from old tour flow. |
| **`activeSeason` (default `summer`)** | Overlaps Head `season-mood.js` + `data-season` · pick **one** source (recommend Head + remove unused tabs or wire tabs to same var). |
| **Monolith Head v23–v25** | Already retired · keep git archive only. |

---

## Home · add / wire

| Item | Priority |
|------|----------|
| **Xano booking URL** | Workflow still `REPLACE_WITH_YOUR_XANO_INSTANCE` · **P0** before live checkout |
| **Privacy URL consistency** | `/privacypolicy` everywhere (footer OK · WeWeb page path `/privacy` not OK) |
| **Head v27 paste + publish** | Hero mask, legal guard, sticky backup |
| **Roster counter data source** | `spotsRemaining` / formulas manual · wire to Xano or admin when ready |
| **Gallery drawer** | Head provides JS · confirm CTA/trigger on canvas still opens `wwOpenGalleryDrawer` |
| **WeWeb Backend** | Not installed · OK if Xano + Stripe only |
| **Design system guidelines** | Update sticky to transparent glass; document 1024 vs 1200 decision |

---

## Breakpoint QA checklist (preview)

Run in WeWeb preview at each width (~1440, ~1024, ~768, ~390).

| Check | Desktop | Tablet | Mobile |
|-------|---------|--------|--------|
| Hero: no YT chrome, no black flash | | | |
| Sticky: transparent, not full-width bar, safe-area | | | |
| FAQ sticky nav → scrolls to `#faq` section | | | |
| Pricing: readable stack, CTA opens Tour Modal | | | |
| Backdrops: tap/hover swap | | | |
| Chalet: hover/tap image (no footer HTML hack) | | | |
| Modal: subhead + TOS checkboxes + legal links | | | |
| Footer legal URLs open correct pages | | | |
| No horizontal scroll | | | |

---

## Legal pages

- Minimal: one section + `ww-html` each · **prerender on** · good for SEO.
- **Add:** shared header/footer reuse section (optional) so legal pages match Home chrome.
- **Or remove** WeWeb legal pages and redirect to git static only (`LEGAL_LINKS_CANON.md` option 1).

---

## Copy / compliance (spot check)

- No Harvard IL in export · OK  
- No em dash in export · OK  
- Modal + footer deposit language aligned after subhead rewrite · OK  

---

## Recommended order of work

1. Privacy path + footer/modal link smoke  
2. Delete dead modals + orphan variables  
3. Remove footer animation `ww-html` after Chalet device test  
4. Decide **1024 vs 1200** and apply to all `*-inner` wrappers  
5. Wire Xano · Stripe smoke  
6. Update DS guidelines to match sticky + shell  
7. Publish + export to git when preview clean at all breakpoints  
