#!/usr/bin/env bash
# Rewrite committer/author to SP noreply on all commits since BASE (post–WeWeb GitHub export).
# Usage: ./scripts/cleanup-git-authors-after-weweb.sh [base-ref]
# Default base: origin/main
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

BASE="${1:-origin/main}"
NAME="S.P."
EMAIL="293159210+SP-Q26@users.noreply.github.com"

git config user.name "$NAME"
git config user.email "$EMAIL"

if ! git rev-parse "$BASE" >/dev/null 2>&1; then
  echo "cleanup: base ref not found: $BASE (fetch first?)"
  exit 1
fi

HEAD_SHA="$(git rev-parse HEAD)"
BASE_SHA="$(git rev-parse "$BASE")"

if [[ "$HEAD_SHA" == "$BASE_SHA" ]]; then
  echo "cleanup: nothing to rewrite (HEAD == $BASE)"
  ./scripts/verify-git-identity.sh
  exit 0
fi

COUNT="$(git rev-list --count "$BASE"..HEAD)"
echo "cleanup: rewriting author on $COUNT commit(s) since $BASE"

export GIT_COMMITTER_NAME="$NAME"
export GIT_COMMITTER_EMAIL="$EMAIL"

# Re-apply current tree per commit with reset-author (WeWeb-export style history)
git rebase "$BASE" --exec 'git commit --amend --reset-author --no-edit'

./scripts/verify-git-identity.sh
echo "cleanup: OK — push with ./scripts/push-main-after-cleanup.sh (may need --force-with-lease if remote had bad-email commits)"
