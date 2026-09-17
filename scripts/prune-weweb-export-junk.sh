#!/usr/bin/env bash
# Remove WeWeb AI / editor cruft from repo root after GitHub publish (safe to re-run).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

JUNK=(
  css-pure-decisions.md
  direction-drophelper-brief.md
  todo-css.md
  skill.md
)

removed=0
for f in "${JUNK[@]}"; do
  if [[ -f "$f" ]]; then
    rm -f "$f"
    echo "prune: removed $f"
    removed=$((removed + 1))
  fi
done

if [[ "$removed" -eq 0 ]]; then
  echo "prune: no junk files present"
else
  echo "prune: removed $removed file(s)"
fi
