# WWLuxe · MCP read-only audit (2026-09-10)

**Project:** WhisperingWoodsLUXE · `1b8147da-2812-42a5-946e-f83c582d3071`  
**Home page UID:** `991a8992-afed-4eaf-b77e-13a81380ad12`  
**Agent policy this pass:** MCP **audit only** · **no** `editElement` / `editFrontendWorkflow` / canvas writes.

---

## MCP session result

| Tool | Result |
|------|--------|
| `ping` | OK — server connected |
| `searchPages` | **`[MCP TRIAL ENDED]`** — workspace billing blocks page/workflow reads |

**Impact:** Live canvas truth (pricing text nodes, testimonial section visibility, modal bindings) could **not** be machine-verified this session. Operator sign-off below is the audit source for those items until Pro/Partner MCP is restored.

**Upgrade:** [WeWeb workspace billing](https://dashboard.weweb.io/workspaces/6b964f33-ab86-4d32-92d8-e54b00f48d4c/plans-billing)

---

## Operator sign-off (2026-09-10)

| Check | Status |
|-------|--------|
| Keepsake / estate **pricing on canvas** | **Green** (operator) |
| **Fake testimonials** | **Hidden** (operator) |
| Oct 18 **exact times** on marketing site | **Out of scope** — production docs only (`OCT_18_RUN_OF_DAY.md`) |

---

## Git / static audit (verified in repo)

| Surface | Status | Notes |
|---------|--------|-------|
| `/order` + `wwluxe-order.js` | OK | Canon SKUs · $1420 Chalet · $955/$395/$425/$195/$395/$345 · spreads 55 / 5×255 |
| `lib/wwluxe/stripe-catalog.mjs` | OK | Labels for primary keepsake SKUs · spreads use dynamic SKU in JS |
| `api/wwluxe/keepsake-checkout.js` | OK | Stripe Session · metadata keys · needs `STRIPE_SECRET_KEY` on Vercel |
| `/terms` · `/privacypolicy` | OK | Static under `public/whispering-woods-luxe/` |
| `vercel.json` rewrites | Verify at deploy | `GIT_STATIC_HOSTING.md` |
| SPQ `public/data/*` | N/A | WWLuxe is separate WeWeb project — not in SPQ export JSON |

**Pricing script:**

```bash
node scripts/wwluxe-audit-pricing.mjs
```

Expect legacy-price hits only inside historical audit markdown, not `/order`.

---

## Funnel / conversion spec (doc audit)

| Rule | Source | Repo status |
|------|--------|-------------|
| No fake testimonial names on site | `CONVERSION_ADDITIONS_SPEC.md` | Operator: hidden |
| Single booking path (modal) | ADD-1 | Canvas — MCP unverified |
| `/order` link from pricing | `WEWEB_SWARM_CHANGES.md` | Operator verify in editor |
| Legal URLs `…/terms` · `…/privacypolicy` | `LEGAL_LINKS_CANON.md` | Git pages ready |
| Do not touch `wf_booking_form_submit` structure | SPQ ops law | No git patch assumed |

---

## P0 launch blockers (unchanged)

1. **DNS** apex split — WeWeb `/` + git `/order` `/terms` `/privacypolicy` `/api/wwluxe/*`
2. **Stripe** new account catalog — `STRIPE_MCP_SWARM.md`
3. **Xano** workflow URLs live — `XANO_STRIPE_WIRE.md`
4. **WeWeb publish** + E2E modal → Stripe
5. **Vercel env** `STRIPE_SECRET_KEY` · `WWLUXE_SITE_ORIGIN`

---

## P1 (post-launch / ads)

- Estate + Chalet **images** (14 WebPs) — `ON_ESTATE_SHOT_BRIEF.md`
- Waitlist / confirmation emails
- Experience weeks in modal + JSON-LD (after photog lock)

---

## When MCP reads work again

Re-run read-only checklist (no edits):

1. `searchPages` → Home route `/home` or `/`
2. `getPageSemantic` + `getPageElementsByUid` → pricing section text · testimonial section `conditionalRendering` or removed
3. Grep canvas via semantic text for `895` `350` `1670` `250 thank` `RedTree`
4. `searchFrontendAppPageFunctionWorkflows` → booking submit workflow **action count** unchanged
5. Footer / pricing CTA → href `https://whisperingwoodsluxe.com/order`

---

## Scorecard (adjusted)

| Area | Score | Note |
|------|------:|------|
| Git order + API | 90 | Wire Stripe env + DNS |
| Docs / ops | 88 | Oct 18 run-of-day separated from site |
| WeWeb canvas | — | MCP trial blocked; operator green on price + testimonials |
| Payments | 40 | Catalog + E2E pending Stripe MCP account |

**Next doc:** `STRIPE_MCP_SWARM.md` — fill Product/Price IDs when MCP creates catalog.
