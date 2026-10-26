#!/usr/bin/env bash
# Vercel Ignored Build Step for ww-luxe (main) and ww-journal (journal).
# Usage: bash scripts/vercel-should-build-ww.sh <luxe|journal>
# Exit 0 = skip · exit 1 = build
set -euo pipefail

PRODUCT="${1:-}"
case "$PRODUCT" in
  luxe) WANT_REF="main" ;;
  journal) WANT_REF="journal" ;;
  *)
    echo "ww: pass luxe or journal"
    exit 1
    ;;
esac

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

REF="${VERCEL_GIT_COMMIT_REF:-}"
if [ -n "$REF" ] && [ "$REF" != "$WANT_REF" ]; then
  echo "ww-$PRODUCT: skip (branch $REF != $WANT_REF)"
  exit 0
fi

if [ -n "${WW_IGNORE_TEST_FILES:-}" ]; then
  CHANGED="$WW_IGNORE_TEST_FILES"
elif git rev-parse HEAD^ >/dev/null 2>&1; then
  CHANGED="$(git diff --name-only HEAD^ HEAD || true)"
else
  echo "ww-$PRODUCT: build (no parent commit)"
  exit 1
fi

if [ -z "$CHANGED" ]; then
  echo "ww-$PRODUCT: skip (empty diff)"
  exit 0
fi

EXPORT_RE='^(public/|src/|sites/|template\.html|index\.html|vite\.config|plugins-settings\.json|weweb-postcss|prerender/)'
GATE_RE='^(package\.json|package-lock\.json|postbuild\.js|vercel\.json|scripts/ensure-package-scripts\.mjs|scripts/vercel-build\.sh|scripts/vercel-should-build-ww\.sh|docs/)'

export_hit=0
gate_only=1
while IFS= read -r f; do
  [ -z "$f" ] && continue
  if echo "$f" | grep -qE "$EXPORT_RE"; then export_hit=1; fi
  if ! echo "$f" | grep -qE "$GATE_RE"; then gate_only=0; fi
done <<< "$CHANGED"

# WeWeb vNN + separate "restore prebuild/gate" commit → skip the gate-only follow-up
if [ "$gate_only" = 1 ] && [ "$export_hit" = 0 ]; then
  echo "ww-$PRODUCT: skip (gate-only — fold ensure-package-scripts into the export commit)"
  exit 0
fi

if echo "$CHANGED" | grep -qE "$EXPORT_RE"; then
  echo "ww-$PRODUCT: build (export paths changed)"
  exit 1
fi

echo "ww-$PRODUCT: skip (no export paths)"
exit 0
