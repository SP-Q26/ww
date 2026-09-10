# Migrate WWLuxe off SPQ → [SP-Q26/ww](https://github.com/SP-Q26/ww)

**Why:** `whisperingwoodsevents.com` + `whisperingwoodsluxe.com` belong in a dedicated repo. SPQ stays terminal / spquant.com only.

**Remote:** `git@github.com:SP-Q26/ww.git` (currently LICENSE-only; bootstrap below).

---

## Repo layout

```text
ww/
  README.md
  .gitignore
  sites/
    luxe/                    # whisperingwoodsluxe.com git slice
      vercel.json
      api/wwluxe/
      lib/wwluxe/
      public/whispering-woods-luxe/
    events/                  # whisperingwoodsevents.com
      public/                # venue HTML or WeWeb export
      vercel.json
  docs/
    luxe/                    # copy of docs/whispering-woods-luxe/
  scripts/
    wwluxe-audit-pricing.mjs
```

---

## Copy script (run from `ww` clone)

```bash
WW_ROOT="$(pwd)"
SPQ="/Users/rachaelpennington/SPQ"

mkdir -p sites/luxe sites/events docs/luxe scripts

rsync -a --exclude='public/docs' "$SPQ/public/whispering-woods-luxe/" sites/luxe/public/whispering-woods-luxe/
rsync -a "$SPQ/api/wwluxe/" sites/luxe/api/wwluxe/
rsync -a "$SPQ/lib/wwluxe/" sites/luxe/lib/wwluxe/
rsync -a "$SPQ/docs/whispering-woods-luxe/" docs/luxe/
cp "$SPQ/scripts/wwluxe-audit-pricing.mjs" "$SPQ/scripts/wwluxe-audit-em-dashes.mjs" scripts/
```

---

## `sites/luxe/vercel.json` (minimal)

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    { "source": "/order", "destination": "/whispering-woods-luxe/order/index.html" },
    { "source": "/order/", "destination": "/whispering-woods-luxe/order/index.html" },
    { "source": "/terms", "destination": "/whispering-woods-luxe/terms/index.html" },
    { "source": "/terms/", "destination": "/whispering-woods-luxe/terms/index.html" },
    { "source": "/privacypolicy", "destination": "/whispering-woods-luxe/privacypolicy/index.html" },
    { "source": "/privacypolicy/", "destination": "/whispering-woods-luxe/privacypolicy/index.html" },
    { "source": "/privacy-policy", "destination": "/whispering-woods-luxe/privacypolicy/index.html" },
    { "source": "/privacy-policy/", "destination": "/whispering-woods-luxe/privacypolicy/index.html" }
  ]
}
```

No `npm run build` — static `public/` + serverless `api/`.

---

## SPQ cleanup (after ww is live)

- Remove WW rewrites from SPQ `vercel.json` (lines `/order` … `/privacypolicy`) so spquant.com never serves Luxe paths.
- Optional: delete `public/whispering-woods-luxe`, `api/wwluxe`, `lib/wwluxe` from SPQ in a follow-up PR.

---

## Two sites, two deploys

| Domain | WeWeb (funnel) | Git + Vercel |
|--------|----------------|--------------|
| whisperingwoodsluxe.com | Home + booking modal | `/order`, legal, `/api/wwluxe/*` |
| whisperingwoodsevents.com | Venue canvas (`53256c7e-…`) | `sites/events` when exported |

WeWeb Luxe project: `1b8147da-2812-42a5-946e-f83c582d3071`.

---

## Commit + push (ww repo)

```bash
cd ~/ww
git add -A
git status   # no .env, no secrets
git commit -m "Bootstrap Luxe static checkout, API, and ops docs."
git push origin main
```

Then connect Vercel project **Root Directory** = `sites/luxe`.
