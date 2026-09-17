/**
 * Vite/WeWeb export puts Project Head late in <head> — first paint is white until bridge runs.
 * Inject pine boot + theme-color immediately after <head> on dist/index.html (Vercel full app).
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const indexPath = path.join(ROOT, "dist", "index.html");

const SNIPPET = `<script>(function(){var r=document.documentElement;r.style.backgroundColor="#141f19";if(document.body)document.body.style.backgroundColor="#141f19";})();</script><meta name="theme-color" content="#141f19"/><style id="ww-critical-first-paint">html,body,#app{background-color:#141f19!important}body{margin:0}</style>`;

if (!fs.existsSync(indexPath)) {
  console.warn("inject-luxe-critical-boot: dist/index.html missing — skip");
  process.exit(0);
}

let html = fs.readFileSync(indexPath, "utf8");
if (html.includes('id="ww-critical-first-paint"')) {
  console.log("inject-luxe-critical-boot: already present");
  process.exit(0);
}

const headOpen = html.match(/<head[^>]*>/i);
if (!headOpen) {
  console.warn("inject-luxe-critical-boot: no <head> — skip");
  process.exit(0);
}

const insertAt = headOpen.index + headOpen[0].length;
html = html.slice(0, insertAt) + SNIPPET + html.slice(insertAt);
fs.writeFileSync(indexPath, html);
console.log("inject-luxe-critical-boot: ok");
