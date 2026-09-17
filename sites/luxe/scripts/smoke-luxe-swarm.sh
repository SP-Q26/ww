#!/usr/bin/env bash
# WWLuxe unyielding live smoke — marketing + slice + aliases + API.
# Usage:
#   PREVIEW_HOST=https://luxe-omega.vercel.app bash sites/luxe/scripts/smoke-luxe-swarm.sh
#   SMOKE_WEWEB=1 bash sites/luxe/scripts/smoke-luxe-swarm.sh
set -euo pipefail

PREVIEW_HOST="${PREVIEW_HOST:-https://luxe-omega.vercel.app}"
WEWEB_HOST="${WEWEB_HOST:-https://1b8147da-2812-42a5-946e-f83c582d3071-production.weweb.io}"
PROD_HOST="${PROD_HOST:-https://whisperingwoodsluxe.com}"

code() {
  curl -sS -o /dev/null -w "%{http_code}" "$1" || echo "000"
}

redirect_loc() {
  curl -sS -o /dev/null -w "%{http_code} %{redirect_url}" -L --max-redirs 0 "$1" 2>/dev/null || echo "000"
}

smoke_host() {
  local base="$1" label="$2" mode="${3:-full}"
  echo ""
  echo "========== $label ($base) [${mode}] =========="
  local fail=0

  local paths=(
    "/"
    "/home"
    "/terms"
    "/terms/"
    "/privacypolicy"
    "/privacypolicy/"
    "/privacy-policy"
    "/manifest.json"
    "/serviceworker.js"
  )
  if [[ "$mode" == "full" ]]; then
    paths+=(
      "/heirloom"
      "/heirloom/"
      "/keepsakes"
      "/order"
      "/heirloom/assets/wwluxe-shared.css"
      "/heirloom/assets/wwluxe-order.js"
      "/terms/assets/wwluxe-shared.css"
    )
  fi

  for path in "${paths[@]}"; do
    c=$(code "${base}${path}")
    echo "$c  GET ${path}"
    case "$path" in
      /home|/terms|/privacypolicy|/privacy-policy|/heirloom|/keepsakes|/order)
        [[ "$c" == "200" || "$c" == "301" || "$c" == "302" || "$c" == "307" || "$c" == "308" ]] || fail=1
        ;;
      *)
        [[ "$c" == "200" ]] || fail=1
        ;;
    esac
  done

  if [[ "$mode" == "full" ]]; then
    c=$(curl -sS -o /dev/null -w "%{http_code}" -X POST "${base}/api/wwluxe/keepsake-checkout" \
      -H "Content-Type: application/json" -d '{"lines":[]}' || echo "000")
    echo "$c  POST /api/wwluxe/keepsake-checkout (not 404)"
    [[ "$c" == "404" ]] && fail=1
  else
    echo "skip  POST /api/wwluxe/keepsake-checkout (marketing-only host)"
  fi

  title=$(curl -sS "${base}/" 2>/dev/null | head -c 12000 | grep -o '<title>[^<]*</title>' | head -1 || true)
  echo "title: ${title:-<missing>}"
  if [[ -z "$title" ]] || echo "$title" | grep -qi '404\|not found'; then
    echo "FAIL: home title missing or error page"
    fail=1
  fi

  return "$fail"
}

err=0
smoke_host "$PREVIEW_HOST" "Vercel (luxe-omega)" "full" || err=1

if [[ "${SMOKE_WEWEB:-0}" == "1" ]]; then
  smoke_host "$WEWEB_HOST" "WeWeb production" "marketing" || err=1
fi

if [[ "${SMOKE_PROD:-0}" == "1" ]]; then
  smoke_host "$PROD_HOST" "Custom apex" "full" || err=1
fi

if [[ "$err" -ne 0 ]]; then
  echo ""
  echo "SMOKE FAILED"
  exit 1
fi
echo ""
echo "SMOKE OK"
