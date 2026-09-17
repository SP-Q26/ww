# Luxe · Git + MCP audit (2026-09-13 · `/heirloom` sweep)

**Branch:** `SP-Q26/ww` → `luxe` · **Remote HEAD:** `4ad221c` (*v12 - 34*, `cacheVersion` **12**) · audited 2026-09-14  
**Canvas:** WeWeb `1b8147da-2812-42a5-946e-f83c582d3071` · **MCP session:** 2026-09-13

---

## Executive summary

| Layer | Status | Notes |
|-------|--------|--------|
| **Canvas `/heirloom` links** | **Green** | Upsell note + Chalet card → `https://whisperingwoodsluxe.com/heirloom` (MCP `getPageElementsByUid`) |
| **Git export vs canvas** | **Green** | Export v12: **`/heirloom` ×3** on upsell UIDs · **`/keepsakes` ×0** |
| **`sites/luxe` static slice** | **Green** (this commit) | `/heirloom` rewrites · absolute asset paths · Stripe → `/heirloom?checkout=…` |
| **Billboard (no onload API)** | **Green** | Home `workflows: []` in export |
| **Modal / legal** | **Green** | `7757521a` → `/terms` + `/privacypolicy`; Experience date select Oct 18 + Spring 2027, `zIndexOpen` 10050 |
| **Booking API** | **Expected** | `REPLACE_WITH_YOUR_XANO_INSTANCE` in export (submit only) |
| **Git commit metadata** | **Red** | WeWeb publish commits (`4ad221c`, `c410dfd`, …) use operator email — run `cleanup-git-authors-after-weweb.sh` before push if GH007/block enabled |
| **Working tree hygiene** | **Red** | Untracked **venue bleed** (`docs/companytown/`, `sites/weddings/`, …) — do not `git add -A` |
| **SPQ mirror** | **Amber** | `public/whispering-woods-luxe/*` + `api/wwluxe/*` mostly **untracked** on `weweb-export`; `vercel.json` has `/heirloom` |

---

## MCP sweep (canvas truth)

### Pages

| Page | Route | Prerender | Notes |
|------|-------|-----------|--------|
| Home | `home` | no | Funnel + modal |
| Terms of Service | `terms` | yes | WeWeb-hosted legal (parallel to git `/terms`) |
| Privacy Policy | `privacy` | yes | WeWeb route **`/privacy`** — git uses **`/privacypolicy`** |

### Home · URLs (live canvas)

| Element | UID | Link / copy |
|---------|-----|-------------|
| Upsell Note | `e3b9b523-b451-418f-a272-b82bfeaebb11` | `…/heirloom` · “Design your heirloom collection…” |
| Upsell 1 Chalet Collection | `3e1a5635-93f0-46dc-b790-12aa0a005c0b` | `…/heirloom` |
| Legal Page Links (modal) | `7757521a-23ac-4062-87c8-fc3d47a00ec1` | `/terms` · `/privacypolicy` (formula HTML) |
| Experience Date Select | `cc1a1c45-09d8-491e-90d0-714d41ffe91f` | `2026-10-18`, `2027-spring` |

### Home · workflows

- **Page workflows:** none (no roster onload).
- **Tour Booking Modal** (`d39c36d0-9146-4920-a2dc-a3641cf44806`): submit on booking + waitlist forms; component `workflows: []` at library level (logic on form containers).

### Project variables (roster / cruft)

| Variable | Default | Launch note |
|----------|---------|-------------|
| `spotsRemaining` | 17 | Static until Xano onload restored |
| `totalSpots` | 24 | |
| `rosterCounterText` | “Only 17 of 24…” | |
| Orphans (delete when approved) | `contactModalOpen`, `faqModalOpen`, `formSubmitted`, duplicate `selectedDate` / `faqOpenItem`, `visionQuizStep`, `activeSeason` | Not in export JSON |

### Export drift (must fix before trusting git funnel)

Git `public/data/991a8992-….json` (**v11**) path counts:

```text
whisperingwoodsluxe.com/keepsakes  ×3
whisperingwoodsluxe.com/terms      ×2
whisperingwoodsluxe.com/privacypolicy ×2
heirloom                           ×0
```

Upsell UIDs in export still show **`/keepsakes`** and old copy (“Configure keepsakes…”). **WeWeb Publish → GitHub `luxe` → prune → author cleanup.**

---

## Git audit (`luxe`)

### Layout

| Path | Role |
|------|------|
| Repo **root** | WeWeb Vite export (`cacheVersion` 11) |
| **`sites/luxe/`** | Vercel root: order, legal, `api/wwluxe/*`, `vercel.json` |

### Uncommitted `sites/luxe` (this sweep)

- `vercel.json` — `/heirloom` + legacy aliases
- `public/…/terms`, `privacypolicy` — links → `/heirloom`
- `assets/wwluxe-order.js`, `api/wwluxe/keepsake-checkout.js` — Stripe returns → `/heirloom`
- `order/index.html` — minor path copy (if changed)

### Author / identity

```bash
cd ~/ww && ./scripts/verify-git-identity.sh   # FAIL on WeWeb commits
./scripts/cleanup-git-authors-after-weweb.sh 6e9edcc
./scripts/push-main-after-cleanup.sh luxe     # after commit sites/luxe only
```

Latest WeWeb export commits on `luxe`: operator email + real name in author field (GH007 risk if email block on).

### Do not commit

Untracked from other branches: `docs/companytown/`, `sites/weddings/`, root `index.html`, `privacy/`, `terms/`, etc.

After WeWeb publish: `./scripts/prune-weweb-export-junk.sh` (root junk md files).

### Vercel smoke (when wired)

| Check | URL |
|-------|-----|
| Canonical checkout | `GET /heirloom` → styled order app |
| Aliases | `/keepsakes`, `/order` → same |
| Legal | `/terms`, `/privacypolicy` |
| API | `POST /api/wwluxe/keepsake-checkout` (Tier C) |

Local: `cd sites/luxe && npx serve public -p 9876` — use `/whispering-woods-luxe/order/` (rewrites need Vercel).

---

## SPQ (`weweb-export`)

- `vercel.json`: `/heirloom` rewrites present (uncommitted).
- `public/whispering-woods-luxe/{terms,privacypolicy,order,assets}` + `api/wwluxe/`: **untracked** — mirror of `ww/sites/luxe` for apex routing if SPQ hosts slice.
- Swarm docs still mention `/order` in prompts (`WEWEB_AI_LAUNCH_MOBILE_PHOTOS_PROMPT.md`, etc.) — update when pasting into WeWeb.

---

## Action list (ordered)

1. **WeWeb Publish** (note publish #) so export matches canvas `/heirloom`.
2. **Commit only** `sites/luxe/` + `docs/luxe/{12H_LAUNCH_PUNCHOUT,KEEPSAKES_VERCEL_DNS,GIT_MCP_AUDIT_2026-09-13}.md` on `ww` `luxe`.
3. **Author cleanup** + push `luxe`.
4. **Vercel** project root `sites/luxe` · smoke `/heirloom`.
5. **DNS** path split or subdomain per `KEEPSAKES_VERCEL_DNS.md`.
6. Optional: delete orphan variables; align prompt docs `/order` → `/heirloom`.

**Refs:** `12H_LAUNCH_PUNCHOUT.md` · `LEGAL_LINKS_CANON.md` (SPQ mirror) · `GIT_STATIC_HOSTING.md`
