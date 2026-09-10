#!/usr/bin/env bash
# WW monorepo — block commits/pushes with personal or machine git identity.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

FAIL=0
REQUIRED_EMAIL='293159210+SP-Q26@users.noreply.github.com'
REQUIRED_NAME='S.P.'

name="$(git config user.name || true)"
email="$(git config user.email || true)"

if [[ "$email" != *@users.noreply.github.com ]]; then
  echo "FAIL: git user.email must be GitHub noreply, got: ${email:-<unset>}"
  echo "  git config user.email \"$REQUIRED_EMAIL\""
  FAIL=1
fi
if [[ "$email" == *".lan" ]] || [[ "$email" == *".local" ]]; then
  echo "FAIL: machine email blocked: $email"
  FAIL=1
fi
if [[ -n "$email" ]] && echo "$email" | grep -qiE '@(gmail|icloud|me\.com|hotmail|proton|yahoo)\.'; then
  echo "FAIL: personal inbox in git user.email: $email"
  FAIL=1
fi

# Staged content scan (when committing)
if git rev-parse --git-dir >/dev/null 2>&1; then
  if git diff --cached --quiet 2>/dev/null; then
    : # nothing staged
  else
    if git diff --cached | grep -qiE '@(gmail|icloud|me\.com|hotmail|proton|yahoo)\.|@[A-Za-z0-9._-]+\.(lan|local)\b'; then
      echo "FAIL: staged diff may contain personal or machine email — review and use product domain or remove."
      FAIL=1
    fi
  fi

  # Commits not on origin/main yet (pre-push style)
  if git rev-parse origin/main >/dev/null 2>&1; then
    while IFS= read -r line; do
      ae="${line%% |*}"
      an="${line#*| }"
      if [[ "$ae" != *@users.noreply.github.com ]]; then
        echo "FAIL: unpushed commit author email: $ae ($an)"
        FAIL=1
      fi
      if echo "$ae" | grep -qiE '\.(lan|local)$|@(gmail|icloud|me\.com)'; then
        echo "FAIL: blocked email in unpushed history: $ae"
        FAIL=1
      fi
    done < <(git log origin/main..HEAD --format='%ae | %an' 2>/dev/null || true)
  fi
fi

if [[ $FAIL -ne 0 ]]; then
  echo "verify-git-identity: fix identity before commit/push. See README.md § Git identity."
  exit 1
fi

echo "OK: git identity ($name <$email>)"
