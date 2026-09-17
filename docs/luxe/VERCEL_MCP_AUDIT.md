# Vercel MCP · setup + audit (2026-09-14)

## MCP status in Cursor

| Check | Result |
|-------|--------|
| Namespace `plugin-vercel-vercel` | **Ready** (tools load) |
| `list_teams` | **Empty** — session not scoped to a Vercel team |
| `get_project` / `list_deployments` (SPQ **luxe**) | **403** — *"Not authorized: Trying to access resource under scope spq. You must re-authenticate to this scope."* |
| `get_git_deployment_context` | **Empty teams** — same auth gap |

**Conclusion:** Vercel MCP is installed but **not authorized for team SPQ**. Agent cannot audit deployments/env via MCP until you re-auth to that team.

### Fix MCP auth (Cursor)

1. **Cursor Settings** → **MCP** (or **Features** → **MCP Servers**).
2. Find **Vercel** (`plugin-vercel-vercel`).
3. **Sign out / Disconnect** → **Connect** again (or **Re-authenticate**).
4. In the Vercel OAuth screen, choose team **SPQ** (not only a personal hobby scope).
5. Approve access for the Cursor integration.
6. New chat → ask agent to run `list_teams` — should show **SPQ** with `team_HqMoC6Iyl5J5qMn9YmR6pJRL`.

If teams stay empty: confirm you’re logged into [vercel.com](https://vercel.com) as a member of **SPQ**, then retry. SAML/SSO teams sometimes need an extra team login in the browser.

**No `mcp.json` entry required** for the bundled Vercel plugin — it ships with the Cursor Vercel extension, not `SPQ/.cursor/mcp.json` (that file is WeWeb-only).

---

## Project audit (CLI — works with your local `vercel login`)

| Field | Value | Verdict |
|-------|--------|---------|
| Project | **spq/luxe** · `prj_zYZT3zKw07mQmYGdXY8e5DARl8z3` | OK |
| Production alias | **https://luxe-omega.vercel.app** | OK |
| **Root Directory** (dashboard) | **`.`** | **OK for CLI deploys** from `sites/luxe` · **Wrong when Git repo = `SP-Q26/ww` root** |
| Framework | Other | OK |
| Build / install (dashboard defaults) | Still show `npm run build` / `npm install` | Override in UI to **empty** when Git is connected |

### Preview smoke (2026-09-14)

`PREVIEW_HOST=https://luxe-omega.vercel.app ./sites/luxe/scripts/smoke-paths.sh` → **200** on `/heirloom`, `/heirloom/assets/*`, `/terms`, `/privacypolicy`.  
`POST /api/wwluxe/keepsake-checkout` → **500** until `STRIPE_SECRET_KEY` is set in Vercel env.

---

## When you connect GitHub to this project

Set **once** in Vercel → **luxe** → **Settings** → **General**:

- **Root Directory:** `sites/luxe`
- **Production Branch:** `luxe`
- **Build Command:** empty
- **Install Command:** empty

If Root Directory stays `.` on a full **ww** clone, Vercel runs the **WeWeb Vite** app at repo root → broken layout.

Until Git is wired, keep shipping preview with:

```bash
cd ~/ww/sites/luxe && npx vercel deploy --prod
```

---

## MCP tools to use after SPQ auth

| Tool | Use |
|------|-----|
| `list_teams` | Confirm SPQ visible |
| `get_project` | Root directory, framework, link |
| `list_deployments` | Latest preview/production URLs |
| `get_deployment_build_logs` | Failed Git deploys |
| `get_git_deployment_context` | Which repos/branches map to projects |
