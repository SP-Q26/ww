# Vercel Web Analytics · WW Events (`venue` branch)

WeWeb export is **Vue 3 + Vite**. Use **`@vercel/analytics/vue`**, not the Next.js entry.

## Repo wiring (git `venue`)

| Piece | Location |
|-------|----------|
| Dependency | `@vercel/analytics` in root `package.json` |
| SPA pageviews | `src/_front/App.vue` — `<Analytics />` + import |
| Speed Insights (optional) | `template.html` — `<script defer src="/_vercel/insights/script.js">` |
| Peer deps | `.npmrc` → `legacy-peer-deps=true` (vue-router 5) |

## Vercel dashboard (operator)

1. Project **ww-events** (or the Vercel project wired to `SP-Q26/ww` · branch **`venue`**).
2. **Analytics** → enable **Web Analytics** (and **Speed Insights** if desired).
3. Deploy after git push; browse production/preview with ad blockers off.
4. Confirm events in Analytics within ~30s on route changes (Home → Bespoke → Contact).

## After WeWeb GitHub publish

WeWeb may **overwrite** `App.vue`. Re-apply `<Analytics />` or restore from this doc before relying on metrics.

## Not in repo

- No GA4 measurement ID in WeWeb env (empty). Add only via Vercel Web Analytics or future env + Project Head if operator supplies `G-` ID.
