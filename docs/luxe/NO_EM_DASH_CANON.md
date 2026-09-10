# WWLuxe · No em dash canon

**Rule:** Customer-facing copy (canvas, modal, SEO, legal HTML, emails) uses **no em dashes** (Unicode U+2014). Operator docs may use them in filenames only if unavoidable; prefer ` · ` or `:` in new doc titles.

**Why:** Cleaner on mobile, avoids AI-slop typography, matches estate luxe voice (periods and middle dots, not long dashes).

---

## Replacement ladder (pick the lightest fix)

| Context | Use instead of U+2014 |
|---------|----------------------|
| Parallel items / brand rhythm | ` · ` (middle dot) |
| Label → explanation | `:` |
| Two sentences | `.` |
| Light pause, same sentence | `,` |
| Compound modifier | hyphen `-` (e.g. `rain-or-shine`, `pre-order`) |
| SEO / page title segments | ` \| ` or ` · ` (never U+2014) |

**Forbidden on canvas:** U+2014 · en dash `–` in marketing copy (ranges OK: `5–7 min`, `6–8 weeks`).

---

## MCP access (Cursor) vs paid WeWeb plan

`getMe` can show **`hasMcpAccess: false`** on the workspace that owns WhisperingWoodsLUXE (`6b964f33-ab86-4d32-92d8-e54b00f48d4c`) even when you are on a paid WeWeb tier. Cursor MCP `ping` succeeds; canvas reads/writes return **MCP TRIAL ENDED**.

That is a **workspace MCP entitlement flag**, not fixed by refreshing Cursor or republishing the site.

**Escalation (pick one):**

1. **WeWeb support** · workspace `6b964f33-ab86-4d32-92d8-e54b00f48d4c`, project WhisperingWoodsLUXE `1b8147da-2812-42a5-946e-f83c582d3071`, error text, screenshot of Plans & billing showing paid tier, ask to enable MCP for that workspace.
2. **In-editor WeWeb AI** · paste `WEWEB_AI_NO_EM_DASH_SWEEP.md` (and other apply docs) in the project editor chat; does not use Cursor MCP.
3. **Workspace with MCP** · another workspace (`WR`, `hasMcpAccess: true`) only helps if the project is moved or duplicated there (WeWeb UI; not automatic).

**Do not use:** shell `mcp-remote`, `scripts/mcp-call.mjs` (SPQ law).

---

## Git hygiene

```bash
# Audit customer-facing docs
node scripts/wwluxe-audit-em-dashes.mjs

# Rewrite docs/whispering-woods-luxe/*.md (review diff before commit)
node scripts/wwluxe-audit-em-dashes.mjs --fix

# Mirror under public/docs if you ship legal there
node scripts/wwluxe-audit-em-dashes.mjs --fix --dir public/docs/whispering-woods-luxe
```

Canvas truth stays in WeWeb until publish export.

---

## Canvas status (2026-09-08)

**Applied via WeWeb in-editor AI** (Cursor MCP still blocked on workspace `6b964f33…`).

| Area | Status |
|------|--------|
| SEO title / meta / OG | Done · em-dash-free |
| JSON-LD Event name | Done |
| Hero · Experience · team line | Done |
| Experience estate blurb (40 acres…) | Done |
| Backdrops headline + subtitle | Done |
| Chalet section sub (ponds lounge) | Done |
| Pricing section sub | Done |
| Itinerary · Mom Milestone · outfit step | Done |
| Chalet desc · digital · upsell footer · disqualifier | Done |
| FAQ A7 · A9 · A10 · studio FAQ | Done |
| Modal preferred-week label | Done |

**Still optional / not in sweep report:**

- Backdrops chip row under grid (`MCP_BACKDROPS_COPY_APPLY.md`)
- Zone card renames (Ponds · Gardens & Paths · projector vibe)
- Estate 1200×1500 zone images (replace Unsplash)
- Favicon (if not already assigned)
- Social proof section stays hidden until real quotes

---

## Apply docs (em-dash-free targets)

| Doc | Purpose |
|-----|---------|
| `WEWEB_AI_NO_EM_DASH_SWEEP.md` | One paste: sweep entire Home page |
| `MCP_BACKDROPS_COPY_APPLY.md` | Backdrops header + zone cards |
| `MCP_CHALET_COPY_APPLY.md` | Chalet + keepsakes descriptions |
| `WEWEB_AI_FULL_SWARM.md` | Full launch swarm (keep in sync) |
