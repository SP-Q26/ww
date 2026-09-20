# Vercel Web Analytics (ww-journal)

Journal is **Vue 3 + Vite** (WeWeb export), not Next.js. Use the **Vue** integration, not `@vercel/analytics/next`.

## Repo wiring

- Dependency: `@vercel/analytics` (see root `package.json`)
- `.npmrc`: `legacy-peer-deps=true` (vue-router 5 vs package peer on vue-router 4)
- Component: `src/_front/App.vue` — `<Analytics />` from `@vercel/analytics/vue` (tracks SPA route changes via vue-router)

## Vercel dashboard

1. Project **ww-journal** → **Analytics** → enable **Web Analytics**
2. Deploy `journal` branch after the analytics commit
3. Visit production, navigate Home → article; data within ~30s (disable ad blockers)

## WeWeb re-export

WeWeb GitHub publish may **overwrite** `App.vue`. After a canvas publish, re-apply the `<Analytics />` import or keep this doc as the restore checklist.
