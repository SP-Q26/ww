#!/usr/bin/env bash
# WW Journal — one npm ci per deploy (Vercel otherwise runs install + vercel build install ≈10m).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export NPM_CONFIG_FUND=false
export NPM_CONFIG_AUDIT=false
export NPM_CONFIG_PREFER_OFFLINE=true

npm ci --no-progress
npm run build
