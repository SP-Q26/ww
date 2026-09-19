/**
 * Build gate: home dist must include splash orchestrator (HANDOFF_MAX / forceHeroReady).
 */
import fs from "fs";
import path from "path";

const indexPath = path.join(path.resolve(import.meta.dirname, ".."), "dist", "index.html");

if (!fs.existsSync(indexPath)) {
  console.warn("verify-luxe-splash-orchestrator: no dist/index.html — skip");
  process.exit(0);
}

const html = fs.readFileSync(indexPath, "utf8");
const ok =
  html.includes("ww-luxe-splash-orchestrator") &&
  html.includes("HANDOFF_MAX") &&
  html.includes("forceHeroReady");

if (!ok) {
  console.error(
    "verify-luxe-splash-orchestrator: FAIL — dist/index.html missing splash orchestrator (death-loop risk)"
  );
  process.exit(1);
}

const SPLASH_UID = "17f047b4-78f5-44c4-94a0-e24018d60df9";
const styleMatch = html.match(/<style id="ww-critical-first-paint">([\s\S]*?)<\/style>/);
if (styleMatch && styleMatch[1].includes(SPLASH_UID) && styleMatch[1].includes(":not([data-ww-hero-video-ready")) {
  console.error(
    "verify-luxe-splash-orchestrator: FAIL — inject splash CSS still locks canvas splash until ready"
  );
  process.exit(1);
}

console.log("verify-luxe-splash-orchestrator: ok");
