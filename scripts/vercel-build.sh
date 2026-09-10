#!/usr/bin/env bash
# Vercel build — venue WeWeb export (branch: venue).
# WeWeb publish may strip package.json postbuild; restore before vite.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> [vercel-build] ensure package.json scripts"
node scripts/ensure-package-scripts.mjs

echo "==> [vercel-build] vite build + postbuild"
npm run build
