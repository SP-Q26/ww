# WeWeb → GitHub → `luxe` → `main` (WW monorepo)

**Same law as SPQ:** WeWeb publishes with the **logged-in operator email**. GitHub **“Block command line pushes that expose my email”** should stay **ON**.

**Luxe WWL:** point WeWeb GitHub integration at branch **`luxe`** (not `main`). WeWeb may push there with operator email; **never** treat `origin/luxe` as production.

**Production:** operator merges export onto **`main`** with **S.P. + noreply** only (`scripts/merge-luxe-export-to-main.sh`).

---

## Division of labor

| Layer | Owner | Repo path |
|-------|--------|-----------|
| Marketing canvas | WeWeb publish | Not required in `ww` unless you export static |
| Order / legal / Stripe API | Git `ww` | `sites/luxe/` |
| Events static (optional) | Git `ww` | `sites/events/` |

WeWeb projects:

- Luxe: `1b8147da-2812-42a5-946e-f83c582d3071`
- Events: `53256c7e-af62-4a5c-ad51-afcf0a2d420d`

Connecting WeWeb to `SP-Q26/ww` is **optional**. If you do, treat every WeWeb GitHub publish as **untrusted author metadata** until cleanup runs.

---

## Operator flow (after WeWeb “Publish to GitHub” → **`luxe`**)

1. **Leave** GitHub email privacy block enabled.
2. **Fetch** WeWeb’s push:
   ```bash
   cd ~/ww
   git fetch origin
   git log -1 origin/luxe --format='%ae %s'   # expect operator email — OK on luxe only
   ```
3. **Merge export onto main** (resolve export conflicts; restore postbuild bridge):
   ```bash
   ./scripts/merge-luxe-export-to-main.sh
   ```
   Add git-owned files (`sites/luxe/public/…` legal v1.3, `docs/luxe/canvas/hero-splash-tree.svg`, etc.). **Do not** add root `/features/`, `/terms/`, `index.html` (gitignored junk).
4. **Commit on `main`** with noreply author (squash is fine):
   ```bash
   git reset --soft origin/main   # optional: one commit, drops WeWeb authors from main history
   git add -A
   git commit -m "Ship WeWeb export vNN on main …"
   ```
5. **Verify** and **push main only**:
   ```bash
   ./scripts/verify-git-identity.sh
   git push origin main
   ```

If WeWeb ever pushed to `main` by mistake, use `./scripts/cleanup-git-authors-after-weweb.sh` then `./scripts/push-main-after-cleanup.sh` (force-with-lease).

---

## One-liner (agent / operator)

```bash
cd ~/ww && git fetch origin && ./scripts/merge-luxe-export-to-main.sh
# then commit + verify-git-identity.sh + git push origin main
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
