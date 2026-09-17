#!/usr/bin/env bash
# Full WhisperingWoodsLUXE WeWeb export + sites/luxe slice into dist/
set -euo pipefail
cd "$(dirname "$0")/.."
echo "==> [vercel-build] npm run build (vite + postbuild + luxe slice copy)"
npm run build
