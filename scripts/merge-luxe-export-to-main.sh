#!/usr/bin/env bash
# WeWeb publishes to origin/luxe with operator email (GH007-safe sink).
# Operator merges export onto main as a single S.P. + noreply commit for Vercel.
#
# Usage (after WeWeb publish):
#   ./scripts/merge-luxe-export-to-main.sh
#   # resolve any remaining conflicts, stage sites/luxe legal + postbuild bridge
#   git commit -m "Ship WeWeb export vNN on main …"
#   ./scripts/verify-git-identity.sh && git push origin main
#
# Do NOT push origin/luxe to production without author cleanup on main.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

LUXE_REF="${LUXE_REF:-origin/luxe}"
MAIN_REF="${MAIN_REF:-origin/main}"

git fetch origin

if ! git rev-parse "$LUXE_REF" >/dev/null 2>&1; then
  echo "merge-luxe: missing $LUXE_REF — publish from WeWeb to luxe branch first"
  exit 1
fi

git checkout main
git pull --rebase origin main

if git merge-base --is-ancestor "$LUXE_REF" HEAD 2>/dev/null; then
  echo "merge-luxe: main already contains $LUXE_REF — nothing to merge"
  exit 0
fi

echo "merge-luxe: merging $LUXE_REF into main (expect conflicts on export files)"

set +e
git merge "$LUXE_REF" -m "WIP: merge WeWeb export from luxe (operator will squash-commit with noreply author)"
merge_status=$?
set -e

if [[ "$merge_status" -ne 0 ]]; then
  echo "merge-luxe: resolving known export conflicts with luxe (theirs)…"
  for f in \
    .weweb-export-manifest.json \
    postbuild.js \
    public/data/3515bd43-f827-4437-9a36-759c037406e2.json \
    public/data/8afee215-521b-4113-bef6-5df22fbce128.json \
    public/data/991a8992-afed-4eaf-b77e-13a81380ad12.json \
    public/manifest.json \
    public/serviceworker.js \
    public/sitemap.xml \
    src/_front/router.js \
    template.html \
    vite.config.js \
    package-lock.json
  do
    if git ls-files -u -- "$f" 2>/dev/null | grep -q .; then
      git checkout --theirs -- "$f" && git add "$f"
    fi
  done
  for f in src/pages/styleCompiler/ww-style-page-*.css public/ww-style-shared-*.css; do
    if git ls-files -u -- "$f" 2>/dev/null | grep -q .; then
      git checkout --theirs -- "$f" && git add "$f"
    fi
  done
fi

./scripts/ensure-weweb-postbuild-bridge.sh
git add postbuild.js 2>/dev/null || true

if git diff --cached --quiet && git diff --quiet; then
  if [[ "$merge_status" -ne 0 ]]; then
    echo "merge-luxe: still conflicted — fix remaining files, then: git add -A && git commit"
    git status -sb
    exit 1
  fi
  echo "merge-luxe: clean merge — run verify-git-identity.sh before push"
  exit 0
fi

echo ""
echo "merge-luxe: staged/working changes ready."
echo "  1. Add git-owned slices: sites/luxe/public/… terms v1.3, hero splash, inject script"
echo "  2. git commit (author must be S.P. + noreply — never push WeWeb gmail commits)"
echo "  3. ./scripts/verify-git-identity.sh && git push origin main"
echo ""
echo "Optional squash (drops WeWeb author commits from main history):"
echo "  git reset --soft $MAIN_REF && git add -A && git commit -m \"…\""
git status -sb
