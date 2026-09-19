# Welcome motion assets (Lottie · WebP)

## Lottie (generated in git)

```bash
node scripts/generate-heirloom-welcome-lottie.mjs
```

Output: `sites/luxe/public/whispering-woods-luxe/assets/heirloom-welcome.json`

- Embeds `heirloom-splash-tree-static.svg` as an image layer.
- Gold + sage rings are native Lottie shapes (smooth under Vue boot).
- **1.6s** composition @ 30fps.

**Not used on home preview** (experiment retired — duplicate tree layers). Kept for optional future / marketing embeds.

Home welcome canon: **rings + `heirloom-splash-tree-static.svg`** only (`inject-luxe-critical-boot.mjs`).

## WebP (manual / pipeline)

This repo does not encode animated WebP in CI (no `ffmpeg` / `sharp` in `package.json`).

**Operator export (recommended):**

1. Screen or render the welcome at **428×428** (2× 214px).
2. Export **~1.2–1.4s**, once, alpha or on `#141f19`.
3. Tools: After Effects → WebP plugin, [Squoosh](https://squoosh.app/), or:

```bash
ffmpeg -framerate 30 -i frames/frame_%03d.png -loop 0 -lossless 0 -q:v 80 heirloom-welcome.webp
```

4. Place at `sites/luxe/public/whispering-woods-luxe/assets/heirloom-welcome.webp`.
5. Wire inject to `<img>` + known duration (see `SPLASH_SKELETON_CANON.md`).
