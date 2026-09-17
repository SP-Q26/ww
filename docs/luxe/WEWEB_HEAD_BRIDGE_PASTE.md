# Project Head · BRIDGE only (v27)

**Paste this file — not v23/v24/v25.**

| File | Lines |
|------|------|
| [`WEWEB_PROJECT_HEAD_BRIDGE_v26.html`](./WEWEB_PROJECT_HEAD_BRIDGE_v26.html) | ~820 |

**Doctrine:** [`LUXE_CANVAS_VS_HEAD.md`](./LUXE_CANVAS_VS_HEAD.md)

## Steps

1. WeWeb → **Project settings → Custom code → Head**
2. **Select all → delete** (remove the ~4k-line monolith)
3. Paste **entire** `WEWEB_PROJECT_HEAD_BRIDGE_v26.html`
4. **Publish**
5. Console: `document.documentElement.getAttribute('data-ww-head-version')` → **`2026.09.15.v27`**

## Then fix on canvas (preview is truth)

- **1024 shell** — page/column max width 1024px, pine outside
- **Hero** — overlay `100svh` on canvas; **Head v27** only crops YouTube iframe + load flash
- **Section fills** — pine vs linen per section in editor
- **Sticky** — `#ww-sticky-nav` pill (Head no longer injects fab/collapse)
- **Chalet** — wrapper hover states (already on canvas; Head was fighting opacity)

## What stayed in Head

Config · hero iframe crop + load gate · season `data-season` + poetry · gallery drawer · SEO/mailto/tour/legal bridge
