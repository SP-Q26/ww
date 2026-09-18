#!/usr/bin/env bash
# WeWeb export often strips Luxe postbuild hooks — restore if missing.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if grep -q 'inject-luxe-critical-boot' postbuild.js && grep -q 'copy-luxe-slice-into-dist' postbuild.js; then
  echo "ensure-weweb-postbuild-bridge: postbuild hooks OK"
  exit 0
fi

echo "ensure-weweb-postbuild-bridge: restoring Luxe hooks in postbuild.js"

python3 <<'PY'
from pathlib import Path

path = Path("postbuild.js")
text = path.read_text()
marker = "const criticalBoot = spawnSync(process.execPath, ['./scripts/inject-luxe-critical-boot.mjs']"
if marker in text:
    raise SystemExit(0)

bridge = r'''
const criticalBoot = spawnSync(process.execPath, ['./scripts/inject-luxe-critical-boot.mjs'], {
    cwd: process.cwd(),
    stdio: 'inherit',
});
if (criticalBoot.status !== 0) {
    process.exit(criticalBoot.status ?? 1);
}

// WeWeb publish strips this — required for /heirloom, /booked, Stripe API on Vercel.
const sliceCopy = spawnSync(process.execPath, ['./scripts/copy-luxe-slice-into-dist.mjs'], {
    cwd: process.cwd(),
    stdio: 'inherit',
});
if (sliceCopy.status !== 0) {
    process.exit(sliceCopy.status ?? 1);
}
'''

if not text.rstrip().endswith("}"):
    raise SystemExit("postbuild.js: unexpected shape — fix manually")

# Append after runPrerender closing brace (last closing brace of file)
if "function runPrerender()" in text:
    path.write_text(text.rstrip() + "\n" + bridge)
else:
    raise SystemExit("postbuild.js: runPrerender not found — fix manually")

print("ensure-weweb-postbuild-bridge: appended hooks")
PY

grep -q 'inject-luxe-critical-boot' postbuild.js && grep -q 'copy-luxe-slice-into-dist' postbuild.js
