# `/heirloom` copy audit · 2026-09-15

**Path:** `sites/luxe/public/whispering-woods-luxe/order/` (Vercel rewrite `/heirloom` → order shell)  
**Canon:** `KEEPSAKES_MOM_WALK_CANON.md` · tagline **Keepsakes are optional · published prices always**

## Trust line (surface 3×)

| Location | Copy |
|----------|------|
| Ribbon under steps | Keepsakes are optional · published prices always |
| Pay bar sub (empty cart) | Same |
| Footer `wwl-foot__note` | Same |

## Pricing matrix (export HTML)

| SKU | Price | Status |
|-----|------:|--------|
| Chalet Collection | $1,420 · ~~$1,775~~ · $355 thank-you | OK |
| Heirloom Album 10×10 | $955 | OK |
| Digital Gallery | $395 | OK |
| Framed Print 20×24 | $425 | OK |
| Extra Retouches (7) | $195 | OK |
| Fine Art paper | +$395 | OK |
| Parent Mini 6×6 | $345 | OK |
| Extra spreads | $55 each · 5 for $255 | OK |

## Voice checks

| Rule | Result |
|------|--------|
| No reveal-room / surprise bill language beyond “no reveal-room surprises” (anti-competitor) | OK |
| No vendor lab names on order UI | OK |
| No stale `$895` / `$350 thank-you` / `Save $250` | OK |
| Estate experience **not** conflated with Chalet SKU on this page | OK (Chalet labeled separately) |
| Optional keepsakes explicit | OK (intro + trust + footer) |
| Published retail explicit | OK |

## Kiosk / tablet

| Feature | Behavior |
|---------|----------|
| **Start fresh** (`#reset-session`) | One tap in kiosk mode; confirm on non-kiosk. Clears draft, selections, form, step 1. Keeps `?event=` / preorder window logic. |
| Draft restore banner | Hidden after reset |

## Smoke

```bash
PREVIEW_HOST=https://luxe-omega.vercel.app bash sites/luxe/scripts/smoke-luxe-swarm.sh
```

Manual: `/heirloom` → trust ribbon → select Chalet → **Start fresh** → $0 and empty fields.
