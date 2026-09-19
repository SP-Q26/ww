/**
 * Main production: strip Vercel splash (WeWeb canvas owns hero splash).
 * Branch `preview` only: luxe welcome — pine + heirloom tree → fade green → fade tree → hero (≤1.5s).
 */
import fs from "fs";
import path from "path";
import { spawnSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
const indexPath = path.join(ROOT, "dist", "index.html");
const svgPath = path.join(
  ROOT,
  "sites/luxe/public/whispering-woods-luxe/assets/heirloom-splash-tree.svg"
);

const ref = process.env.VERCEL_GIT_COMMIT_REF || "main";
const welcome =
  ref === "preview" || process.env.WW_LUXE_WELCOME_SPLASH === "1";

if (!welcome) {
  const uninject = path.join(ROOT, "scripts/uninject-luxe-vercel-splash.mjs");
  const r = spawnSync(process.execPath, [uninject], { stdio: "inherit" });
  process.exit(r.status ?? 0);
}

const HERO_SPLASH_UID = "17f047b4-78f5-44c4-94a0-e24018d60df9";
const MARKER = "ww-luxe-welcome-splash";
const HARD_MS = 1500;
const GREEN_OUT_MS = 520;
const TREE_OUT_MS = 1080;
const DISMISS_MS = 1380;

const SPLASH_STYLE = `<style id="ww-critical-first-paint">
html,body,#app{background-color:#141f19!important}
body{margin:0}
#ww-critical-splash{
  position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;
  pointer-events:none;isolation:isolate
}
#ww-critical-splash .ww-welcome__bg{
  position:absolute;inset:0;background-color:#141f19;
  transition:opacity .55s ease;will-change:opacity
}
#ww-critical-splash.ww-green-out .ww-welcome__bg{opacity:0}
#ww-critical-splash .ww-welcome__tree{
  position:relative;z-index:1;width:min(268px,78vw);height:auto;display:block;
  transition:opacity .55s ease,visibility .55s ease;will-change:opacity
}
#ww-critical-splash.ww-tree-out .ww-welcome__tree{
  opacity:0;visibility:hidden
}
html[data-ww-hero-video-ready="1"] .ww-element-${HERO_SPLASH_UID}{
  opacity:0!important;visibility:hidden!important;pointer-events:none!important
}
</style>`;

const ORCHESTRATOR = `<script id="${MARKER}">(function(){
var HARD=${HARD_MS};
var GREEN=${GREEN_OUT_MS};
var TREE=${TREE_OUT_MS};
var DONE=${DISMISS_MS};
var SPLASH_SEL="#ww-critical-splash";
var r=document.documentElement;
function forceHeroReady(){r.setAttribute("data-ww-hero-video-ready","1");}
function splash(){return document.querySelector(SPLASH_SEL);}
function dismiss(){
  var s=splash();
  if(s&&s.parentNode)s.parentNode.removeChild(s);
  forceHeroReady();
}
function run(){
  r.style.backgroundColor="#141f19";
  if(document.body)document.body.style.backgroundColor="#141f19";
  window.setTimeout(function(){
    var s=splash();if(s)s.classList.add("ww-green-out");
  },GREEN);
  window.setTimeout(function(){
    var s=splash();if(s)s.classList.add("ww-tree-out");
  },TREE);
  window.setTimeout(dismiss,DONE);
  window.setTimeout(forceHeroReady,HARD);
}
if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",run,{once:true});
}else{
  run();
}
})();</script>`;

const THEME_META = `<meta name="theme-color" content="#141f19"/>`;

function loadSplashSvg() {
  if (!fs.existsSync(svgPath)) {
    console.warn("inject-luxe-critical-boot: heirloom tree svg missing at", svgPath);
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
  return `<div id="ww-critical-splash" role="status" aria-label="Loading"><div class="ww-welcome__bg" aria-hidden="true"></div><div class="ww-welcome__tree" aria-hidden="true">${svg}</div></div>${ORCHESTRATOR}`;
}

function stripWelcomeSplash(html) {
  const start = html.indexOf('<div id="ww-critical-splash"');
  if (start === -1) return html;
  let depth = 0;
  let i = start;
  while (i < html.length) {
    if (html.startsWith("<div", i)) {
      depth++;
      i += 4;
      continue;
    }
    if (html.startsWith("</div>", i)) {
      depth--;
      i += 6;
      if (depth === 0) {
        let end = i;
        const after = html.slice(end);
        const scriptMatch = after.match(
          /^\s*<script id="ww-luxe-welcome-splash">[\s\S]*?<\/script>/
        );
        if (scriptMatch) end += scriptMatch[0].length;
        return html.slice(0, start) + html.slice(end);
      }
      continue;
    }
    i++;
  }
  return html;
}

if (!fs.existsSync(indexPath)) {
  console.warn("inject-luxe-critical-boot: dist/index.html missing — skip");
  process.exit(0);
}

let html = fs.readFileSync(indexPath, "utf8");

html = html.replace(/<script id="ww-luxe-welcome-splash">[\s\S]*?<\/script>\s*/g, "");
html = html.replace(/<script id="ww-luxe-splash-orchestrator">[\s\S]*?<\/script>\s*/g, "");
html = html.replace(/<script id="ww-luxe-splash-bail">[\s\S]*?<\/script>\s*/g, "");
html = stripWelcomeSplash(html);

if (html.includes('id="ww-critical-first-paint"')) {
  html = html.replace(/<style id="ww-critical-first-paint">[\s\S]*?<\/style>/, SPLASH_STYLE.trim());
} else {
  const headOpen = html.match(/<head[^>]*>/i);
  if (headOpen) {
    const at = headOpen.index + headOpen[0].length;
    html = html.slice(0, at) + SPLASH_STYLE + html.slice(at);
  }
}

const wwCritical = /<script>\s*\(function wwCriticalFirstPaint\(\)[\s\S]*?<\/script>/;
if (wwCritical.test(html)) {
  html = html.replace(wwCritical, "");
}

if (!html.includes('name="theme-color" content="#141f19"')) {
  const headClose = html.indexOf("</head>");
  if (headClose !== -1) {
    html = html.slice(0, headClose) + THEME_META + html.slice(headClose);
  }
}

const svg = loadSplashSvg();
const bodyOpen = html.match(/<body[^>]*>/i);
if (svg && bodyOpen && !html.includes('id="ww-critical-splash"')) {
  const at = bodyOpen.index + bodyOpen[0].length;
  html = html.slice(0, at) + bodySplashMarkup(svg) + html.slice(at);
}

if (!html.includes(MARKER)) {
  console.error("inject-luxe-critical-boot: FAIL — welcome splash missing after inject");
  process.exit(1);
}

fs.writeFileSync(indexPath, html);
console.log("inject-luxe-critical-boot: ok (preview welcome · heirloom tree)");
