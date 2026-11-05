# WW Venue — go-live execution (2026.10.21.16)

## Done in git (`SPQ/WW/weweb`)

| Item | Status |
|------|--------|
| `ww-season-mood.js` | Tab bridge + inline tokens; no duplicate tab `setSeason` clicks |
| `ww-site-boot-snippet.js` | Canon boot; gallery var `301d0edc-0a02-47eb-85e2-aad3a5ecec04` |
| `ww-luxe-layout.css` | Hero iframe 16:9 cover (no `width: 300%` letterbox) |
| `ww-brand.css` | Autumn `--ww-gold` uses autumn accent |
| `VERSION` | **2026.10.21.16** |
| `WEWEB_HEAD_PASTE.html` | Rebuilt (~114k) — **Project Head**, not Home page head |

## Done on WeWeb canvas (MCP)

| Item | Status |
|------|--------|
| **WW Site Boot** `a8f3c2e1…` | Synced from git snippet (gallery UUID + season bridge) |
| Hero CTA `1172c8dd…` | Border/hover use `var(--ww-accent)` |
| Duplicate `activeSeason` vars | Deleted `f73bb6a0…`, `9ebfb97a…`, `b33cd03c…` — keep `6e7f5084…` |

## Done on `~/ww/public` (Vercel static)

- `ww-tour-modal.js` / `.css` copied from `ww-journal-wt/public`
- `ww-site-bridge.js` copied from `SPQ/WW/weweb`

Commit/push **`ww`** when ready so preview/prod can load tour drawer assets.

## Your manual gates (cannot MCP)

1. **Paste Project Head** — copy all of `WW/weweb/WEWEB_HEAD_PASTE.html` into **Project Settings → Custom code → Head**. Confirm `window.WW_HEAD_VERSION === "2026.10.21.16"`.
2. **WeWeb publish** → GitHub / preview smoke: season tabs → `html[data-season]`, pine block shifts, hero CTA accent, no gallery console spam.
3. **Content:** barn hero GIF, chalet stills, gallery bulk upload (200+) — media ops, not code.
4. **Sticky dock DOM order** — if dock still covers content, move sticky section in editor (last root section).

## Smoke checklist

- [ ] Console: no `301d0edc… (not found)`
- [ ] Spring / Summer / Autumn: accent + `#ww-season-anchor` background move
- [ ] Tour CTA opens drawer (not new tab) on preview + Vercel
- [ ] Hero video fills frame without side letterbox
