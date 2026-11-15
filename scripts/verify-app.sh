#!/usr/bin/env bash
# Static gate checks for Frankie — The API Chimera Lab.
# Used by the Kiro hook .kiro/hooks/format-on-save.json (afterFileEdit).
# Exits 0 only if every check passes.
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FAIL=0

check() { # check <description> <command...>
  local desc="$1"; shift
  if "$@" >/dev/null 2>&1; then echo "PASS: $desc"; else echo "FAIL: $desc"; FAIL=1; fi
}

check "index.html exists" test -f "$ROOT/index.html"
check "app.js exists" test -f "$ROOT/app.js"
check "styles.css exists" test -f "$ROOT/styles.css"
check "LICENSE exists" test -f "$ROOT/LICENSE"
check "README.md exists" test -f "$ROOT/README.md"
check ".kiro/specs present" test -f "$ROOT/.kiro/specs/frankie-chimera-lab/requirements.md"
check ".kiro/steering present" test -f "$ROOT/.kiro/steering/product.md"
check ".kiro/hooks present" test -f "$ROOT/.kiro/hooks/format-on-save.json"
check ".kiro/agents present" test -f "$ROOT/.kiro/agents/dr-frankenstein.md"
check ".kiro/settings/mcp.json present" test -f "$ROOT/.kiro/settings/mcp.json"

if command -v node >/dev/null 2>&1; then
  check "app.js parses (node --check)" node --check "$ROOT/app.js"
else
  echo "SKIP: node not installed, JS parse check skipped"
fi

# No real secrets: look for credential VALUES / assignments, not the prose
# words "secret/key/token" (which appear legitimately in docs).
if grep -rniE "AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}|gho_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,}|xox[baprs]-[A-Za-z0-9-]{10,}|(api[_-]?key|passwd|password|client_secret)\s*[:=]\s*['\"][^'\"]{4,}" \
    "$ROOT" --exclude-dir=.git --exclude=verify-app.sh; then
  echo "FAIL: possible secret/key value found (see above)"
  FAIL=1
else
  echo "PASS: no secret/key values found"
fi

# .kiro must NOT be gitignored (Kiroween disqualification risk).
if [ -f "$ROOT/.gitignore" ] && grep -q "^\.kiro" "$ROOT/.gitignore"; then
  echo "FAIL: .kiro is gitignored"
  FAIL=1
else
  echo "PASS: .kiro is not gitignored"
fi

# Local asset references in index.html must resolve to real files.
MISSING=0
for ref in $(grep -oE '(src|href)="[^"]+\.(js|css)"' "$ROOT/index.html" | sed -E 's/^(src|href)="([^"]+)"/\2/' | grep -v "^https\?://"); do
  if [ ! -f "$ROOT/$ref" ]; then echo "FAIL: missing local asset: $ref"; MISSING=1; fi
done
[ "$MISSING" -eq 0 ] && echo "PASS: all local assets resolve"
[ "$MISSING" -eq 1 ] && FAIL=1

exit $FAIL
