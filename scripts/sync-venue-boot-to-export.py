#!/usr/bin/env python3
"""Patch WW Site Boot workflow code in src/_front/router.js from weweb/ww-site-boot-snippet.js."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ROUTER = ROOT / "src" / "_front" / "router.js"
SNIPPET = ROOT / "weweb" / "ww-site-boot-snippet.js"
BOOT_ID = "a8f3c2e1-9b4d-4a6e-8f7c-1d2e3b4a5c6d"
ACTION_ID = "__WW_BOOT__"


def main() -> None:
    snippet = SNIPPET.read_text()
    if "return true;" not in snippet:
        raise SystemExit("boot snippet missing return true")

    text = ROUTER.read_text()
    marker = "window.wwg_designInfo = "
    idx = text.find(marker)
    if idx == -1:
        raise SystemExit("wwg_designInfo not found in router.js")

    json_start = idx + len(marker)
    depth = 0
    end = json_start
    for i, ch in enumerate(text[json_start:], json_start):
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    else:
        raise SystemExit("could not parse designInfo JSON")

    design = json.loads(text[json_start:end])
    workflows = design.get("workflows") or []
    updated = False
    for wf in workflows:
        if wf.get("id") != BOOT_ID:
            continue
        actions = wf.get("actions") or {}
        if ACTION_ID not in actions:
            raise SystemExit(f"{ACTION_ID} missing in boot workflow")
        actions[ACTION_ID]["code"] = snippet
        updated = True
        break
    if not updated:
        raise SystemExit(f"workflow {BOOT_ID} not found")

    new_json = json.dumps(design, separators=(",", ":"))
    new_text = text[:json_start] + new_json + text[end:]
    ROUTER.write_text(new_text)
    print(f"Patched {ROUTER} boot workflow from {SNIPPET.name}")


if __name__ == "__main__":
    main()
