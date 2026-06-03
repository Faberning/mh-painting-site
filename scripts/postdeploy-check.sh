#!/usr/bin/env bash
# postdeploy-check.sh <deployed-url>
# The EKO §1 gates that can ONLY be proven against a live URL. Dashboard settings
# can lie/lag — the live fetch is the proof (EKO §3). Run after every deploy.
set -u
URL="${1:?usage: postdeploy-check.sh https://your-site}"
fail=0

echo "== AI-crawler live-fetch (EKO §1.1 / §3) =="
for UA in "ClaudeBot" "GPTBot" "PerplexityBot"; do
  CODE=$(curl -s -A "$UA" -o /dev/null -w "%{http_code}" "$URL/")
  echo "  $UA -> $CODE"
  [ "$CODE" = "200" ] || { echo "  x BLOCKED ($CODE) — fix Cloudflare bot settings before launch"; fail=1; }
done

echo "== HTTPS / no challenge on homepage =="
BODY=$(curl -s "$URL/")
echo "$BODY" | grep -qiE 'cf-mitigated|just a moment|__cf_chl' && { echo "  x challenge page served"; fail=1; } || echo "  ok no challenge"

echo "== Form round-trip (EKO §1.4 / §7) =="
LEAD=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$URL/api/lead" \
  -H 'content-type: application/json' \
  -d '{"name":"Gate Test","email":"gate@example.com","message":"round-trip"}')
echo "  POST /api/lead -> $LEAD"
[ "$LEAD" = "200" ] || { echo "  x form did not return 2xx"; fail=1; }

echo ""
[ "$fail" = "0" ] && echo "POST-DEPLOY GATES PASSED" || { echo "POST-DEPLOY GATES FAILED — not launch-ready"; exit 1; }
