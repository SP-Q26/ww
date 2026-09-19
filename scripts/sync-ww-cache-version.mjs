/**
 * Keep public/data/*.json cacheVersion aligned with src/_front/router.js wwg_cacheVersion.
 * Mismatch causes infinite reload (wwWebsiteData throws reloadUrl → window.location = fullPath).
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const routerPath = path.join(ROOT, "src", "_front", "router.js");
const dataDir = path.join(ROOT, "public", "data");

const routerSrc = fs.readFileSync(routerPath, "utf8");
const m = routerSrc.match(/window\.wwg_cacheVersion\s*=\s*(\d+)/);
if (!m) {
  console.error("sync-ww-cache-version: cannot parse wwg_cacheVersion from router.js");
  process.exit(1);
}
const cv = m[1];

if (!fs.existsSync(dataDir)) {
  console.warn("sync-ww-cache-version: no public/data — skip");
  process.exit(0);
}

let updated = 0;
for (const file of fs.readdirSync(dataDir).filter((f) => f.endsWith(".json"))) {
  const p = path.join(dataDir, file);
  const raw = fs.readFileSync(p, "utf8");
  let j;
  try {
    j = JSON.parse(raw);
  } catch {
    continue;
  }
  if (j.cacheVersion == null) continue;
  if (String(j.cacheVersion) === cv) continue;
  j.cacheVersion = cv;
  fs.writeFileSync(p, JSON.stringify(j));
  updated += 1;
  console.log(`sync-ww-cache-version: ${file} → ${cv}`);
}

for (const rel of ["public/manifest.json", "template.html"]) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) continue;
  const next = fs.readFileSync(p, "utf8").replace(/_wwcv=\d+/g, `_wwcv=${cv}`);
  if (next !== fs.readFileSync(p, "utf8")) {
    fs.writeFileSync(p, next);
    console.log(`sync-ww-cache-version: ${rel} _wwcv=${cv}`);
  }
}

console.log(`sync-ww-cache-version: ok (wwg_cacheVersion=${cv}, json files updated=${updated})`);
