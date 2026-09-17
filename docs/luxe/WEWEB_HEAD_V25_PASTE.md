# WeWeb Project Head · v25

**Paste file:** [`WEWEB_PROJECT_HEAD_V25_FULL.html`](./WEWEB_PROJECT_HEAD_V25_FULL.html)

## Steps

1. WeWeb → **Project settings** → **Custom code** → **Head**
2. **Select all** → delete → paste **entire** `WEWEB_PROJECT_HEAD_V25_FULL.html`
3. **Publish**
4. Smoke in browser console:

```js
document.documentElement.getAttribute('data-ww-head-version')
// → "2026.09.14.v25"
```

## What v25 fixes

| Issue | Fix |
|-------|-----|
| Blank / empty preview | Sections no longer `opacity: 0` while waiting for scroll; motion reveals after content is visible |
| Desktop full bleed | `.sections-wrapper` **max-width 1024px** (64rem), centered on pine |
| Tablet | Same 1024 shell — phone layout, not a separate desktop grid |
| Phone | Default gutters **1.25rem**, section rhythm **2.75rem**, stack **1.25rem** |
| Tight CTAs | 48px min height + consistent padding (carried from v24 block) |
| Hero YouTube flash | Mask + deferred iframe fade-in (carried from v24 block) |

## Layout model

- **Outer:** pine background (`body.ww-site`)
- **Shell:** `.sections-wrapper` ≤ **1024px**, linen column, shadow
- **Inner:** full width of shell; typography stays phone-scale (no desktop type blow-up)
