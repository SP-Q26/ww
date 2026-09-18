/**
 * Vite/WeWeb export puts Project Head late in <head> — first paint is pine only until Vue mounts.
 * Inject pine boot + instant tree splash (matches canvas Hero Sprout Loader) on dist/index.html.
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const indexPath = path.join(ROOT, "dist", "index.html");
const svgPath = path.join(ROOT, "docs/luxe/canvas/hero-splash-tree.svg");

const SPLASH_STYLE = `<style id="ww-critical-first-paint">html,body,#app{background-color:#141f19!important}body{margin:0}#ww-critical-splash{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:#141f19;transition:opacity .95s ease}#ww-critical-splash svg{width:min(28vw,128px);height:auto}html[data-ww-hero-video-ready="1"] #ww-critical-splash{opacity:0;pointer-events:none}</style>`;

const HEAD_BOOT = `<script>(function(){var r=document.documentElement;r.style.backgroundColor="#141f19";if(document.body)document.body.style.backgroundColor="#141f19";window.setTimeout(function(){if(r.getAttribute("data-ww-hero-video-ready")!=="1")r.setAttribute("data-ww-hero-video-ready","1");},9000);})();</script><meta name="theme-color" content="#141f19"/>`;

function loadSplashSvg() {
  if (!fs.existsSync(svgPath)) {
    console.warn("inject-luxe-critical-boot: hero-splash-tree.svg missing — pine only");
    return "";
  }
  return fs
    .readFileSync(svgPath, "utf8")
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .trim();
}

function bodySplashMarkup(svg) {
  if (!svg) return "";
  return `<div id="ww-critical-splash" role="status" aria-label="Loading">${svg}</div>`;
}

if (!fs.existsSync(indexPath)) {
  console.warn("inject-luxe-critical-boot: dist/index.html missing — skip");
  process.exit(0);
}

let html = fs.readFileSync(indexPath, "utf8");
const svg = loadSplashSvg();
const hasSplash = html.includes('id="ww-critical-splash"');

if (hasSplash && html.includes('id="ww-critical-first-paint"')) {
  console.log("inject-luxe-critical-boot: already present");
  process.exit(0);
}

const headSnippet = HEAD_BOOT + SPLASH_STYLE;
const headOpen = html.match(/<head[^>]*>/i);
if (!headOpen) {
  console.warn("inject-luxe-critical-boot: no <head> — skip");
  process.exit(0);
}

if (!html.includes('id="ww-critical-first-paint"')) {
  const insertAt = headOpen.index + headOpen[0].length;
  html = html.slice(0, insertAt) + headSnippet + html.slice(insertAt);
} else if (!html.includes("ww-critical-splash")) {
  const paintClose = html.indexOf('id="ww-critical-first-paint"');
  const styleEnd = html.indexOf("</style>", paintClose);
  if (styleEnd !== -1) {
    const extra =
      "#ww-critical-splash{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:#141f19;transition:opacity .95s ease}#ww-critical-splash svg{width:min(28vw,128px);height:auto}html[data-ww-hero-video-ready=\"1\"] #ww-critical-splash{opacity:0;pointer-events:none}";
    html = html.slice(0, styleEnd) + extra + html.slice(styleEnd);
  }
}

if (svg && !hasSplash) {
  const bodyOpen = html.match(/<body[^>]*>/i);
  if (bodyOpen) {
    const insertAt = bodyOpen.index + bodyOpen[0].length;
    html = html.slice(0, insertAt) + bodySplashMarkup(svg) + html.slice(insertAt);
  }
}

fs.writeFileSync(indexPath, html);
console.log("inject-luxe-critical-boot: ok" + (svg ? " (tree splash)" : ""));
