/**
 * Vercel-only: remove postbuild splash inject so dist matches WeWeb preview (CSR export).
 * WeWeb preview works; git/Vercel broke by mutating index.html after vite build.
 */
import fs from "fs";
import path from "path";

const indexPath = path.join(path.resolve(import.meta.dirname, ".."), "dist", "index.html");

const MINIMAL_FIRST_PAINT = `<style id="ww-critical-first-paint">
html, body, #app {
  background-color: #141f19 !important;
}
body { margin: 0; }
</style>`;

if (!fs.existsSync(indexPath)) {
  console.warn("uninject-luxe-vercel-splash: dist/index.html missing — skip");
  process.exit(0);
}

let html = fs.readFileSync(indexPath, "utf8");
let changed = false;

const before = html;

html = html.replace(/<script id="ww-luxe-splash-orchestrator">[\s\S]*?<\/script>\s*/g, "");
html = html.replace(/<script id="ww-luxe-splash-bail">[\s\S]*?<\/script>\s*/g, "");
html = html.replace(/<div id="ww-critical-splash"[\s\S]*?<\/div>\s*/g, "");

if (html.includes('id="ww-critical-first-paint"')) {
  html = html.replace(
    /<style id="ww-critical-first-paint">[\s\S]*?<\/style>/,
    MINIMAL_FIRST_PAINT.trim()
  );
}

if (html !== before) {
  changed = true;
}

if (html.includes("ww-critical-splash") || html.includes("ww-luxe-splash-orchestrator")) {
  console.error("uninject-luxe-vercel-splash: FAIL — splash inject markers remain");
  process.exit(1);
}

if (changed) {
  fs.writeFileSync(indexPath, html);
  console.log("uninject-luxe-vercel-splash: stripped Vercel splash inject (preview parity)");
} else {
  console.log("uninject-luxe-vercel-splash: ok (already clean)");
}
