#!/usr/bin/env bash
# Verify identity, then push main (force-with-lease if rewriting replaced remote tips).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

BRANCH="${1:-main}"
REMOTE="${2:-origin}"

./scripts/verify-git-identity.sh

git fetch "$REMOTE"

if ! git rev-parse "$REMOTE/$BRANCH" >/dev/null 2>&1; then
  echo "push: no $REMOTE/$BRANCH — first push"
  git push -u "$REMOTE" "$BRANCH"
  exit 0
fi

# Ahead / behind
if git merge-base --is-ancestor "$REMOTE/$BRANCH" HEAD 2>/dev/null; then
  if git rev-parse HEAD >/dev/null && [[ "$(git rev-parse HEAD)" == "$(git rev-parse "$REMOTE/$BRANCH")" ]]; then
    echo "push: already up to date"
    exit 0
  fi
  echo "push: fast-forward or new commits"
  git push "$REMOTE" "$BRANCH"
  exit 0
fi

# Diverged (typical after author rewrite)
echo "push: diverged from $REMOTE/$BRANCH — using --force-with-lease (post–WeWeb author cleanup)"
git push --force-with-lease "$REMOTE" "HEAD:refs/heads/$BRANCH"
