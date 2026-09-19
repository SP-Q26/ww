#!/usr/bin/env bash
# Full WhisperingWoodsLUXE WeWeb export + sites/luxe slice into dist/
set -euo pipefail
cd "$(dirname "$0")/.."
echo "==> [vercel-build] sync cacheVersion with router wwg_cacheVersion"
node scripts/sync-ww-cache-version.mjs
node scripts/verify-ww-cache-version.mjs
echo "==> [vercel-build] npm run build (vite + postbuild + luxe slice copy)"
npm run build
