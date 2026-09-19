/**
 * Build gate: dist home must include preview welcome orchestrator (handoff + queue).
 */
import fs from "fs";
import path from "path";

const indexPath = path.join(path.resolve(import.meta.dirname, ".."), "dist", "index.html");

if (!fs.existsSync(indexPath)) {
  console.warn("verify-luxe-splash-orchestrator: no dist/index.html — skip");
  process.exit(0);
}

const html = fs.readFileSync(indexPath, "utf8");
const scriptOk =
  html.includes('id="ww-luxe-welcome-splash"') &&
  html.includes("__wwHeroReadyQueued") &&
  html.includes("releaseHandoff") &&
  html.includes("beginGreenOut") &&
  html.includes("HOLD_MS=420") &&
  html.includes("MIN_BEFORE_FADE_MS=780") &&
  html.includes("WALL_MS=1600") &&
  !html.includes("function forceHeroReady");

if (!scriptOk) {
  console.error(
    "verify-luxe-splash-orchestrator: FAIL — dist/index.html missing current welcome handoff orchestrator"
  );
  process.exit(1);
}

const SPLASH_UID = "17f047b4-78f5-44c4-94a0-e24018d60df9";
const styleMatch = html.match(/<style id="ww-critical-first-paint">([\s\S]*?)<\/style>/);
if (
  styleMatch &&
  styleMatch[1].includes(SPLASH_UID) &&
  styleMatch[1].includes("data-ww-hero-video-ready")
) {
  console.log("verify-luxe-splash-orchestrator: ok (canvas splash hides when hero ready)");
} else {
  console.warn("verify-luxe-splash-orchestrator: warn — canvas splash hide rule not found in inject CSS");
}

console.log("verify-luxe-splash-orchestrator: ok");
