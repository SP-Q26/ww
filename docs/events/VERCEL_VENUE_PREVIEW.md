# Events venue · `venue` branch · Vercel preview

**Domain (later):** `https://www.whisperingwoodsevents.com/`  
**Until DNS:** Vercel preview URL on branch **`venue`**.

## Branch law

| Branch | Purpose | Vercel |
|--------|---------|--------|
| `main` | Luxe export / monorepo default | Do not wire to venue preview |
| **`venue`** | **Whispering Woods Events** WeWeb export | **Production branch** for `ww-events` project until custom domain |

Same GH007 cleanup as `main`: `docs/WEWEB_GITHUB_PUBLISH.md` — use `origin/venue` as cleanup base when rewriting after WeWeb push.

```bash
cd ~/ww
git fetch origin
git checkout venue
./scripts/cleanup-git-authors-after-weweb.sh origin/venue
./scripts/push-main-after-cleanup.sh venue
```

## WeWeb → GitHub

Point the **Events** WeWeb project GitHub integration at **`SP-Q26/ww`**, branch **`venue`**.

| Field | Value |
|-------|--------|
| Editor slug | `unyielding-publisher` |
| Editor | `https://unyielding-publisher-editor.weweb.io/` |
| Preview | `https://unyielding-publisher-production.weweb.io/` |

(WeWeb project UUID in README may differ from editor slug — trust the editor URL you publish from.)

After each WeWeb publish: fetch → author cleanup → push `venue`.

## Vercel project `ww-events`

1. Import **SP-Q26/ww** (same repo as Luxe).
2. **Root Directory:** `.` (repo root — **not** `sites/events`; that path is for future static-only drops).
3. **Production Branch:** `venue`.
4. **Build:** `vercel.json` at root (`scripts/vercel-build.sh` → `npm run build` + `postbuild.js`).
5. **Node:** 24.x (matches `package.json` engines).
6. No Stripe env required for venue-only preview.

`vercel.json` enables deployments **only** on `venue` (`git.deploymentEnabled`). Luxe static/API stays on project **`ww-luxe`** with root `sites/luxe`.

## Favicon

Upload in WeWeb (Project or Home favicon). Git reference: copy from SPQ `WW/assets/favicon/apple-touch-icon.png` (pine-deep + `#c49a5a` — **not** `sites/luxe` / WWLuxe charcoal).

## Smoke after deploy

- Preview URL loads home (no white screen).
- `Tour the Grounds` → Google calendar.
- Mobile column ~28rem (head paste published in WeWeb).
- Tab favicon under Squarespace/Vercel limits if you mirror elsewhere.

## Custom domain (later)

Vercel → Domains → add `whisperingwoodsevents.com` + `www` → switch production from preview-only when DNS is ready.
