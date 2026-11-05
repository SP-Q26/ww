# Lane: WW Events · venue branch

| Item | Value |
|------|--------|
| **Open folder** | `~/ww` (not `~/SPQ`) |
| **GitHub** | `SP-Q26/ww` |
| **Branch** | **`venue`** — WeWeb head canon, events audits, `public/` tour modal |
| **WeWeb canvas** | WW Venue `cbd9a95f-c61e-441a-87cb-b25006511440` |
| **Production** | [whisperingwoodsevents.com](https://www.whisperingwoodsevents.com) |

## Do not use

- **`SP-Q26/SPQ` `main`** for venue head paste or go-live commits (SPQ = spquant.com only).
- Nested `SPQ/WW/` as source of truth after migration — sync **into** `~/ww` instead.

## Push checklist

```bash
cd ~/ww
git checkout venue
./scripts/verify-git-identity.sh   # S.P. + noreply
git add weweb/ docs/events/ public/ww-tour-modal.* public/ww-site-bridge.js
git commit -m "…"
git push origin venue
```

Merge to `main` only when operator promotes venue static + shared `public/` assets.
