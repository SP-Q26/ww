#!/usr/bin/env node
/**
 * Fail CI / pre-publish if stale WWLuxe pricing or customer-facing lab names remain.
 * Usage: node scripts/wwluxe-audit-pricing.mjs
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const SCAN_DIRS = [
  join(ROOT, "docs/luxe"),
  join(ROOT, "public/docs/luxe"),
  join(ROOT, "public/whispering-woods-luxe"),
];

const STALE_PATTERNS = [
  { re: /\$895\b/, label: "stale album $895" },
  { re: /\$350\b/, label: "stale digital $350" },
  { re: /\$1,670\b/, label: "stale stack $1,670" },
  { re: /\$250 thank-you/i, label: "stale thank-you $250" },
  { re: /1670/, label: "bare 1670 stack" },
  { re: /Save \$250/, label: "Save $250 legacy" },
  { re: /\$995\b/, label: "legacy Chalet $995" },
];

const CUSTOMER_RED_TREE = [
  { re: /RedTree/i, label: "RedTree in customer path", skip: /REDTREE_BOM|redtreealbums|operator|internal|PO line/i },
];

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, files);
    else if (/\.(md|html|js|css)$/.test(name) && !name.includes("wwluxe-audit")) files.push(p);
  }
  return files;
}

let failures = 0;

for (const dir of SCAN_DIRS) {
  if (!existsSync(dir)) continue;
  for (const file of walk(dir)) {
    const rel = relative(ROOT, file);
    const text = readFileSync(file, "utf8");
    const isInternalBom = rel.includes("REDTREE_BOM_AUDIT");

    for (const { re, label } of STALE_PATTERNS) {
      if (isInternalBom && label.includes("stale")) continue;
      const lines = text.split("\n");
      for (const line of lines) {
        if (/grep|Grep kill|zero hits|Never on canvas|Forbidden|stale/i.test(line)) continue;
        if (re.test(line)) {
          console.error(`FAIL ${rel}: ${label}`);
          failures++;
          break;
        }
      }
    }

    const isCustomer =
      rel.includes("public/whispering-woods-luxe") ||
      rel.includes("WEWEB_AI") ||
      rel.includes("MCP_CHALET") ||
      rel.includes("KEEPSAKES_MOM") ||
      rel.includes("WEWEB_SWARM") ||
      rel.includes("NO_EM_DASH");

    if (isCustomer && !isInternalBom) {
      for (const { re, label, skip } of CUSTOMER_RED_TREE) {
        if (skip && skip.test(rel)) continue;
        const lines = text.split("\n");
        for (const line of lines) {
          if (/grep|Grep|REDTREE_BOM|operator internal|vendor lab names/i.test(line)) continue;
          if (re.test(line)) {
            console.error(`FAIL ${rel}: ${label}`);
            failures++;
            break;
          }
        }
      }
    }
  }
}

if (failures) {
  console.error(`\nwwluxe-audit-pricing: ${failures} issue(s). Canon: $955 / $395 / $1,775 / $355 thank-you.`);
  process.exit(1);
}

console.log("wwluxe-audit-pricing: OK");
