#!/usr/bin/env bash
# Prints the four values to paste into the Azure DevOps `mainGroup` variable
# group for jacobhal.se acquisition tracking.
#
# Run it yourself; it is deliberately not committed output. The anon keys are
# public by design (they ship inside the JS bundle), but there is no reason to
# paste them into a chat log or a commit.
set -euo pipefail

skarp_env="${1:-$HOME/Git/quiz-app/.env.prod}"
krydda_env="${2:-$HOME/Git/recipe-app/.env.prod}"

read_var() { grep -E "^$2=" "$1" | head -1 | cut -d= -f2- | tr -d '"'"'"'\r'; }

echo "WEB_SUPABASE_SKARP_URL       = https://avwotuhzttumwafbdyef.supabase.co"
echo "WEB_SUPABASE_SKARP_ANON_KEY  = $(read_var "$skarp_env" SUPABASE_ANON_KEY)"
echo "WEB_SUPABASE_KRYDDA_URL      = https://aomgkkrcrhhvnujtxtyb.supabase.co"
echo "WEB_SUPABASE_KRYDDA_ANON_KEY = $(read_var "$krydda_env" SUPABASE_ANON_KEY)"
