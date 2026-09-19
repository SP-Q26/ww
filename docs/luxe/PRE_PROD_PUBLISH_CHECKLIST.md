# Pre–prod publish checklist (Luxe)

After **preview** welcome is signed off: **WeWeb publish** → merge export → **`main`** only when ready.

## WeWeb (before publish)

- [ ] **Hero:** remove **spots / capacity** copy (search home hero for `spots`, `24 spot`, roster FOMO).
- [ ] **Project Head:** pre-pixel bridge (`WEWEB_PASTE_HEAD_PRE_PIXEL.md`) — no pixel, no Vercel splash scripts.
- [ ] Preview smoke: modal, mobile CTA, no reload loop.

## Git / Vercel (after export)

- [ ] `sync-ww-cache-version.mjs` + `verify-ww-cache-version.mjs`
- [ ] Promote welcome inject `preview` → `main` only when operator requests
- [ ] `verify-git-identity.sh` before push
