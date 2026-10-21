# Venue publish audit · cache v31 (2026-10-20)

**WeWeb publish:** `edc0dab` · message `v31 - ee`  
**Branch:** `venue` → Vercel `ww-events`

## Export gates

| Check | Result |
|-------|--------|
| `public/data/*.json` `cacheVersion` | **31** on Home, Bespoke, Integrity, Contact |
| Prerender manifest | 4 routes (`/`, `/bespoke-journey`, `/integrity`, `/contact`) |
| Estate images in `public/images/` | OG + gallery WebPs present in export |
| Home luxe pass | `section-gallery` + `2331` full-bleed band in export JSON |
| `package.json` `postbuild` | Present (Vercel also runs `scripts/ensure-package-scripts.mjs`) |
| Page JSON `openGraphImage` | **Not embedded** in export blobs; OG lives in WeWeb page metadata + Project Head paste |

## Git bridge (this commit)

| Piece | Action |
|-------|--------|
| `@vercel/analytics` + `<Analytics />` | Re-applied after export stripped `App.vue` |
| Speed Insights | `template.html` deferred `/_vercel/insights/script.js` |
| `.npmrc` | `legacy-peer-deps=true` for vue-router 5 peer resolution |
| Author on WeWeb commit | Run `cleanup-git-authors-after-weweb.sh` before push |

## Operator

1. Vercel: enable **Web Analytics** on ww-events (see `VERCEL_WEB_ANALYTICS.md`).
2. Share preview: estate WebP OG URL from `SPQ/WW/weweb/WEWEB_HEAD_PASTE.html` if link previews lag.
3. Smoke: Home season tabs, gallery band, Tour CTAs · 390 / 768 / 1440.
