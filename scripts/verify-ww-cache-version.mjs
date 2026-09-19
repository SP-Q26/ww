/**
 * Fail build if page JSON cacheVersion !== router wwg_cacheVersion (infinite reload on prod).
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const routerSrc = fs.readFileSync(path.join(ROOT, "src", "_front", "router.js"), "utf8");
const m = routerSrc.match(/window\.wwg_cacheVersion\s*=\s*(\d+)/);
if (!m) {
  console.error("verify-ww-cache-version: no wwg_cacheVersion in router.js");
  process.exit(1);
}
const expected = m[1];
const dataDir = path.join(ROOT, "public", "data");
let fail = false;

for (const file of fs.readdirSync(dataDir).filter((f) => f.endsWith(".json"))) {
  const j = JSON.parse(fs.readFileSync(path.join(dataDir, file), "utf8"));
  if (j.cacheVersion == null) continue;
  if (String(j.cacheVersion) !== expected) {
    console.error(`verify-ww-cache-version: ${file} has cacheVersion ${j.cacheVersion}, router expects ${expected}`);
    fail = true;
  }
}

if (fail) {
  console.error("verify-ww-cache-version: run node scripts/sync-ww-cache-version.mjs");
  process.exit(1);
}
console.log(`verify-ww-cache-version: ok (${expected})`);
