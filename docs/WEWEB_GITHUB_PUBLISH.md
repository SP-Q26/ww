# WeWeb → GitHub (WW monorepo)

**Same law as SPQ `weweb-export` → `main`:** WeWeb publishes with the **logged-in operator email**. GitHub **“Block command line pushes that expose my email”** should stay **ON** — WeWeb’s server push will often **fail (GH007)**. That is expected.

| Brand | Target branch |
|-------|----------------|
| **Events venue** | **`venue`** → Vercel `ww-events` (`docs/events/VERCEL_VENUE_PREVIEW.md`) |
| Luxe / default | `main` |

**You always clean up commit metadata locally**, then push as **S.P. + noreply**.

---

## Division of labor

| Layer | Owner | Repo path |
|-------|--------|-----------|
| Marketing canvas | WeWeb publish | Not required in `ww` unless you export static |
| Order / legal / Stripe API | Git `ww` | `sites/luxe/` |
| Events static (optional) | Git `ww` | `sites/events/` |

WeWeb projects:

- Luxe: `1b8147da-2812-42a5-946e-f83c582d3071`
- Events: `unyielding-publisher` → git branch **`venue`**

Connecting WeWeb to `SP-Q26/ww` is **optional**. If you do, treat every WeWeb GitHub publish as **untrusted author metadata** until cleanup runs.

---

## Operator flow (after WeWeb “Publish to GitHub”)

1. **Leave** GitHub email privacy block enabled.
2. **Fetch** whatever WeWeb managed to push (or merge export locally if push failed):
   ```bash
   cd ~/ww
   git fetch origin
   git checkout main   # or merge WeWeb branch if you use one
   git pull --rebase origin main
   ```
3. **Rewrite authors** on commits since `origin/main`:
   ```bash
   ./scripts/cleanup-git-authors-after-weweb.sh
   ```
4. **Verify** (also runs on pre-commit if hooks enabled):
   ```bash
   ./scripts/verify-git-identity.sh
   ```
5. **Push** (force-with-lease only if you rewrote already-pushed commits):
   ```bash
   ./scripts/push-main-after-cleanup.sh
   ```
   Or manually: `git push --force-with-lease origin main`

---

## One-liner (agent / operator)

```bash
cd ~/ww && git fetch origin && ./scripts/cleanup-git-authors-after-weweb.sh origin/main && ./scripts/push-main-after-cleanup.sh
```

---

## Repo identity (set once per clone)

```bash
git config user.name "S.P."
git config user.email "293159210+SP-Q26@users.noreply.github.com"
git config core.hooksPath .githooks
chmod +x scripts/*.sh .githooks/pre-commit
```

---

## If WeWeb push never lands on GitHub

- Canvas truth stays in WeWeb until publish succeeds or you paste from MCP/docs.
- Git slice (`sites/luxe`) can still ship via normal commits — no WeWeb email involved.
- Do **not** disable GitHub email blocking to “make WeWeb happy”; use cleanup instead.

---

## Agent duty

After any WeWeb GitHub publish or merge of WeWeb export into `ww`:

1. Run `cleanup-git-authors-after-weweb.sh`
2. Run `verify-git-identity.sh`
3. Scan staged diff for personal emails before commit
4. Push only with noreply authors on `origin/main..HEAD`

See `.cursor/rules/git-identity-sp-only.mdc` and SPQ `.cursor/rules/whispering-woods-identity.mdc`.
