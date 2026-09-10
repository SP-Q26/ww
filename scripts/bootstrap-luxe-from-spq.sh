#!/usr/bin/env bash
# One-time: copy Luxe git slice from SPQ into this monorepo.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SPQ="${SPQ_ROOT:-$HOME/SPQ}"

if [[ ! -d "$SPQ/public/whispering-woods-luxe" ]]; then
  echo "SPQ not found at $SPQ — set SPQ_ROOT=/path/to/SPQ"
  exit 1
fi

mkdir -p "$ROOT/sites/luxe/public" "$ROOT/sites/luxe/api" "$ROOT/sites/luxe/lib" "$ROOT/docs/luxe" "$ROOT/scripts"

rsync -a --exclude='public/docs' "$SPQ/public/whispering-woods-luxe/" "$ROOT/sites/luxe/public/whispering-woods-luxe/"
rsync -a "$SPQ/api/wwluxe/" "$ROOT/sites/luxe/api/wwluxe/"
rsync -a "$SPQ/lib/wwluxe/" "$ROOT/sites/luxe/lib/wwluxe/"
rsync -a "$SPQ/docs/whispering-woods-luxe/" "$ROOT/docs/luxe/"
cp "$SPQ/scripts/wwluxe-audit-pricing.mjs" "$SPQ/scripts/wwluxe-audit-em-dashes.mjs" "$ROOT/scripts/" 2>/dev/null || true

echo "Done. Review: git -C $ROOT status"
