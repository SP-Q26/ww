#!/usr/bin/env bash
# WWLuxe path smoke — run against Vercel preview or production apex.
set -euo pipefail
PREVIEW_HOST="${PREVIEW_HOST:-https://YOUR-PROJECT.vercel.app}"
PROD_HOST="${PROD_HOST:-https://whisperingwoodsluxe.com}"

smoke() {
  local base="$1" label="$2"
  echo "=== $label ($base) ==="
  local fail=0
  code=$(curl -sS -o /dev/null -w "%{http_code}" "${base}/" || echo "000")
  echo "$code  GET / (want 200 — preview hub; not 404)"
  [[ "$code" != "200" ]] && fail=1
  for path in \
    /booked \
    /booked?cancelled=1 \
    /heirloom \
    /heirloom/assets/wwluxe-shared.css \
    /heirloom/assets/wwluxe-order.js \
    /heirloom/assets/stripe-products/chalet.png \
    /terms \
    /terms/assets/wwluxe-shared.css \
    /privacypolicy
  do
    code=$(curl -sS -o /dev/null -w "%{http_code}" "${base}${path}" || echo "000")
    echo "$code  GET ${path}"
    [[ "$code" == "200" ]] || fail=1
  done
  code=$(curl -sS -o /dev/null -w "%{http_code}" -X POST "${base}/api/wwluxe/keepsake-checkout" \
    -H "Content-Type: application/json" -d '{"lines":[]}' || echo "000")
  echo "$code  POST /api/wwluxe/keepsake-checkout (want 400 or 503, not 404)"
  [[ "$code" == "404" ]] && fail=1
  return "$fail"
}

err=0
smoke "$PREVIEW_HOST" "preview" || err=1
if [[ "${SMOKE_PROD:-0}" == "1" ]]; then
  smoke "$PROD_HOST" "production" || err=1
fi
exit "$err"
