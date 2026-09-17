#!/usr/bin/env bash
# After WeWeb GitHub publish → main: restore Vercel-only hooks, bump cache, sanity-check.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

CACHE_VER="${CACHE_VER:-}"
if [[ -n "$CACHE_VER" ]]; then
  echo "==> CACHE_VER=$CACHE_VER (set in WeWeb publish / vite.config if needed)"
fi

echo "==> package.json scripts (postbuild must survive export)"
if ! grep -q 'postbuild\.js' package.json || ! grep -q '"postbuild"' package.json; then
  echo "RESTORE: add postbuild → node ./postbuild.js (WeWeb strips scripts on publish)"
  exit 1
fi
if ! grep -q 'vite build' package.json; then
  echo "RESTORE: vite build script missing"
  exit 1
fi

echo "==> vercel build gate"
grep -q 'vercel-build.sh' vercel.json || { echo "vercel.json buildCommand must use scripts/vercel-build.sh"; exit 1; }

echo "==> git identity (ww law)"
if [[ -x scripts/verify-git-identity.sh ]]; then
  scripts/verify-git-identity.sh
fi

echo "==> local export cache stamp"
WWCV="$(grep -o 'cacheVersion":"[0-9]*' public/data/991a8992-afed-4eaf-b77e-13a81380ad12.json 2>/dev/null | head -1 | tr -d 'cacheVersion":"' || true)"
HEAD_VER="$(grep -o 'data-ww-head-version" content="[^"]*' index.html 2>/dev/null | head -1 | sed 's/.*content="//;s/"$//' || true)"
echo "    page JSON cacheVersion: ${WWCV:-unknown}"
echo "    index.html head: ${HEAD_VER:-unknown}"

echo "==> optional: rebuild MCP hero-boot payload"
if [[ -f scripts/build-wwl-booking-hero-boot-payload.mjs ]]; then
  node scripts/build-wwl-booking-hero-boot-payload.mjs || true
fi

echo "OK prep-weweb-export-main"
