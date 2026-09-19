#!/usr/bin/env bash
# Luxe full deploy sweep — local export truth + HTTP smokes (no Vercel MCP required).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PREVIEW_HOST="${PREVIEW_HOST:-https://luxe-omega.vercel.app}"
WEWEB_HOST="${WEWEB_HOST:-https://1b8147da-2812-42a5-946e-f83c582d3071-production.weweb.io}"
FAIL=0

section() { echo ""; echo "=== $* ==="; }

section "Git export stamps"
WWCV="$(python3 - <<'PY' 2>/dev/null || true
import json, pathlib
p = pathlib.Path("public/data/991a8992-afed-4eaf-b77e-13a81380ad12.json")
if p.exists():
    d = json.loads(p.read_text())
    print(d.get("cacheVersion", "?"))
PY
)"
echo "cacheVersion (home JSON): ${WWCV:-missing}"
if grep -q '_wwcv=37' index.html 2>/dev/null; then
  echo "index.html _wwcv=37: yes"
elif grep -q '_wwcv=3[0-9]' index.html 2>/dev/null; then
  WWCV_HTML=$(grep -o '_wwcv=[0-9]*' index.html | head -1 | tr -d '_wwcv=')
  echo "index.html _wwcv=${WWCV_HTML}: STALE (expect 37 after v37 GitHub publish)"
  FAIL=1
else
  echo "index.html _wwcv: could not detect"
fi
if grep -q '2026.09.15.v28' index.html 2>/dev/null; then
  echo "head bridge v28 baked: yes"
elif grep -q '2026.09.15.v27' index.html 2>/dev/null; then
  echo "head bridge v27 baked: STALE (paste v28 from docs/luxe/WEWEB_PROJECT_HEAD_BRIDGE_v26.html)"
  FAIL=1
fi

section "Vercel build chain"
grep -q inject-luxe-critical-boot postbuild.js && echo "postbuild critical boot inject: yes" || { echo "missing inject-luxe-critical-boot"; FAIL=1; }
grep -q strip-luxe-meta-pixel-from-dist postbuild.js && echo "postbuild strip home meta pixel: yes" || { echo "missing strip-luxe-meta-pixel-from-dist"; FAIL=1; }
grep -q inject-luxe-meta-pixel-preview postbuild.js && echo "postbuild inject meta pixel (main+preview): yes" || { echo "missing inject-luxe-meta-pixel-preview"; FAIL=1; }
grep -q copy-luxe-slice-into-dist postbuild.js && echo "postbuild luxe slice copy: yes" || { echo "missing copy-luxe-slice"; FAIL=1; }
if grep -q 'wwl-meta-pixel' vite.config.js 2>/dev/null; then
  echo "vite.config.js embeds wwl-meta-pixel: FORBIDDEN on home export"
  FAIL=1
fi

section "HTTP smokes ($PREVIEW_HOST)"
if command -v curl >/dev/null 2>&1; then
  PREVIEW_HOST="$PREVIEW_HOST" bash "$ROOT/sites/luxe/scripts/smoke-paths.sh" || FAIL=1
else
  echo "curl not available — skip HTTP"
fi

section "WeWeb hosted ($WEWEB_HOST)"
if command -v curl >/dev/null 2>&1; then
  code=$(curl -sS -o /dev/null -w "%{http_code}" "$WEWEB_HOST/" || echo "000")
  echo "$code GET $WEWEB_HOST/"
  html=$(curl -sS "$WEWEB_HOST/" 2>/dev/null | head -c 120000 || true)
  if echo "$html" | grep -q '_wwcv=35'; then
    echo "WeWeb host shows _wwcv=35"
  elif echo "$html" | grep -q '_wwcv=33'; then
    echo "WeWeb host still _wwcv=33"
  fi
fi

section "Booking checkout git vs canvas"
if diff -q docs/luxe/paste/wwl-booking-checkout-active.js sites/luxe/public/whispering-woods-luxe/assets/wwl-booking-checkout.js >/dev/null 2>&1; then
  echo "paste ↔ sites mirror: in sync (exact)"
elif diff -q <(sed -n '/^(function /,$p' docs/luxe/paste/wwl-booking-checkout-active.js) \
            <(sed -n '/^(function /,$p' sites/luxe/public/whispering-woods-luxe/assets/wwl-booking-checkout.js) 2>/dev/null; then
  echo "paste ↔ sites mirror: in sync (header-only drift OK)"
else
  echo "paste ↔ sites mirror: DRIFT (sync docs/luxe/paste → sites/.../wwl-booking-checkout.js)"
  FAIL=1
fi

if [[ "$FAIL" -eq 0 ]]; then
  echo ""
  echo "SWEEP: PASS (local + HTTP)"
  exit 0
fi
echo ""
echo "SWEEP: FAIL — see LUXE_V35_REDEPLOY_AUDIT.md"
exit 1
