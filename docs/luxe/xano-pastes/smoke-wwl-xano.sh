#!/usr/bin/env bash
# WWLuxe · Xano wwl_ops smoke (paste gauntlet)
# Usage:
#   export WWL_XANO_BASE="https://YOUR_INSTANCE.n7.xano.io/api:YOUR_GROUP_ID"
#   export WWL_OPS_API_KEY="your-ops-key"
#   export WWL_CRON_SECRET="your-cron-secret"
#   ./docs/luxe/xano-pastes/smoke-wwl-xano.sh
#
# Prereqs: 7 tables · 12 SKUs · 24 slots (01-Fall) · sales_open false until step 2

set -euo pipefail

BASE="${WWL_XANO_BASE:?Set WWL_XANO_BASE (no trailing slash)}"
OPS_KEY="${WWL_OPS_API_KEY:-}"
CRON="${WWL_CRON_SECRET:-}"
SESSION="01-Fall"
SMOKE_EMAIL="smoke+$(date +%s)@whisperingwoodsluxe.com"

# strip trailing slash
BASE="${BASE%/}"

pass() { echo "PASS  $*"; }
fail() { echo "FAIL  $*" >&2; exit 1; }
json() { if command -v jq >/dev/null 2>&1; then jq .; else cat; fi; }

echo "=== WWL Xano smoke ==="
echo "Base: $BASE"
echo ""

# 1 · roster (before sales open)
echo "--- 1 GET wwl/roster ---"
R1=$(curl -sS "$BASE/wwl/roster?session_code=$SESSION")
echo "$R1" | json
OPEN1=$(echo "$R1" | jq -r '.open // empty' 2>/dev/null || true)
TOTAL=$(echo "$R1" | jq -r '.total // empty' 2>/dev/null || true)
[[ -n "$TOTAL" ]] && pass "roster total=$TOTAL (open=$OPEN1 pre-flip)"
[[ -z "$TOTAL" ]] && fail "roster missing total — check URL / seed slots"

# 2 · ops slots list
echo ""
echo "--- 2 GET wwl/slots (ops) ---"
[[ -z "$OPS_KEY" ]] && fail "WWL_OPS_API_KEY required for step 2+"
S2=$(curl -sS -H "X-API-Key: $OPS_KEY" "$BASE/wwl/slots?session_code=$SESSION&limit=5")
echo "$S2" | json
COUNT2=$(echo "$S2" | jq -r '.count // empty' 2>/dev/null || true)
[[ "$COUNT2" =~ ^[0-9]+$ ]] && pass "slots count=$COUNT2"

# 3 · flip sales_open
echo ""
echo "--- 3 POST wwl/slots/batch (sales_open true) ---"
B3=$(curl -sS -X POST -H "Content-Type: application/json" -H "X-API-Key: $OPS_KEY" \
  -d "{\"session_code\":\"$SESSION\",\"sales_open\":true}" \
  "$BASE/wwl/slots/batch")
echo "$B3" | json
echo "$B3" | jq -e '.ok == true' >/dev/null 2>&1 && pass "batch sales_open"

# 4 · roster after flip
echo ""
echo "--- 4 GET wwl/roster (after sales_open) ---"
R4=$(curl -sS "$BASE/wwl/roster?session_code=$SESSION")
echo "$R4" | json
SO=$(echo "$R4" | jq -r '.sales_open // empty' 2>/dev/null || true)
[[ "$SO" == "true" ]] && pass "sales_open true"
[[ "$SO" != "true" ]] && echo "WARN  sales_open not true in response — confirm DB"

# 5 · book → checkout_url
echo ""
echo "--- 5 POST wwl/book ---"
BOOK_BODY=$(cat <<EOF
{
  "session_code": "$SESSION",
  "parent_name": "Smoke Parent",
  "parent_email": "$SMOKE_EMAIL",
  "parent_phone": "5555550100",
  "senior_name": "Smoke Senior",
  "estate_payment_type": "deposit",
  "includes_chalet": false,
  "terms_version": "2026-09-09",
  "success_url": "https://whisperingwoodsluxe.com/?booked=1",
  "cancel_url": "https://whisperingwoodsluxe.com/?booked=0"
}
EOF
)
B5=$(curl -sS -X POST -H "Content-Type: application/json" -d "$BOOK_BODY" "$BASE/wwl/book")
echo "$B5" | json
URL5=$(echo "$B5" | jq -r '.checkout_url // empty' 2>/dev/null || true)
case "$URL5" in
  https://checkout.stripe.com/*|https://*stripe*) pass "checkout_url present" ;;
  *) fail "book missing checkout_url — WWL_STRIPE_SECRET_KEY · wwl_stripe_sku · legal/request_client_meta" ;;
esac
echo ""
echo "MANUAL  Open checkout_url in browser · pay test card 4242… · then run step 6 in Xano logs"
echo "MANUAL  Stripe webhook → $BASE/wwl/stripe/webhook (checkout.session.completed)"

# 6 · waitlist
echo ""
echo "--- 6 POST wwl/wait ---"
WAIT_BODY="{\"session_code\":\"$SESSION\",\"email\":\"wait-$SMOKE_EMAIL\",\"terms_version\":\"2026-09-09\"}"
W6a=$(curl -sS -X POST -H "Content-Type: application/json" -d "$WAIT_BODY" "$BASE/wwl/wait")
echo "first: $W6a" | json
W6b=$(curl -sS -w "\nHTTP:%{http_code}" -X POST -H "Content-Type: application/json" -d "$WAIT_BODY" "$BASE/wwl/wait" || true)
echo "dup:   $W6b"
pass "wait (confirm duplicate returns error / already_registered)"

# 7 · lab rollup
echo ""
echo "--- 7 GET wwl/lab/rollup ---"
L7=$(curl -sS -H "X-API-Key: $OPS_KEY" "$BASE/wwl/lab/rollup?session_code=$SESSION")
echo "$L7" | json
pass "lab rollup"

# 8 · t10 cron (dry — may return count 0)
echo ""
echo "--- 8 POST wwl/schedule/t10 ---"
[[ -z "$CRON" ]] && echo "SKIP  WWL_CRON_SECRET not set"
if [[ -n "$CRON" ]]; then
  T8=$(curl -sS -X POST -H "X-Cron-Secret: $CRON" -H "Content-Type: application/json" \
    -d "{\"session_code\":\"$SESSION\"}" "$BASE/wwl/schedule/t10")
  echo "$T8" | json
  pass "t10 cron"
fi

echo ""
echo "=== Smoke API calls done ==="
echo "Verify in Xano DB after Stripe pay:"
echo "  wwl_slot ($CODENAME) → deposit_paid · wwl_payment_log row · wwl_consent_log stripe_session_id"
echo "Optional: POST wwl/orders/batch after you have wwl_order rows"
