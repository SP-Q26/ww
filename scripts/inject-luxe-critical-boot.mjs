/**
 * Main production: strip Vercel splash (WeWeb canvas owns hero splash).
 * Branch `preview` only: luxe welcome — pine, skellie, heirloom img tree, ≤1750ms wall.
 */
import fs from "fs";
import path from "path";
import { spawnSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
const indexPath = path.join(ROOT, "dist", "index.html");

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
const TREE_SRC = "/heirloom/assets/heirloom-splash-tree-welcome.svg";

const SPLASH_STYLE = `<style id="ww-critical-first-paint">
html,body,#app{background-color:#141f19!important}
body{margin:0}
html.ww-welcome-lock #app{
  visibility:hidden!important;pointer-events:none!important
}
#ww-critical-splash{
  position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;
  pointer-events:none
}
#ww-critical-splash .ww-welcome__bg{
  position:absolute;inset:0;background-color:#141f19;
  transition:opacity .45s ease
}
#ww-critical-splash.ww-green-out .ww-welcome__bg{opacity:0}
#ww-critical-splash .ww-welcome__tree{
  position:relative;z-index:1;width:min(214px,62vw);aspect-ratio:1;display:flex;align-items:center;justify-content:center
}
#ww-critical-splash .ww-welcome__sk-tree{
  position:absolute;inset:0;border-radius:50%;
  background:linear-gradient(90deg,rgba(44,44,44,0.12) 0%,rgba(198,161,91,0.22) 45%,rgba(44,44,44,0.12) 90%);
  background-size:200% 100%;
  animation:ww-welcome-shimmer 1.1s ease-in-out infinite
}
@keyframes ww-welcome-shimmer{
  0%{background-position:100% 0}
  100%{background-position:-100% 0}
}
#ww-critical-splash .ww-welcome__tree-img{
  width:100%;height:auto;display:block;opacity:0;
  transition:opacity .35s ease
}
#ww-critical-splash .ww-welcome__tree.is-live .ww-welcome__sk-tree{display:none}
#ww-critical-splash .ww-welcome__tree.is-live .ww-welcome__tree-img{opacity:1}
#ww-critical-splash.ww-tree-out .ww-welcome__tree{
  opacity:0;transition:opacity .45s ease
}
html[data-ww-hero-video-ready="1"] .ww-element-${HERO_SPLASH_UID}{
  opacity:0!important;visibility:hidden!important;pointer-events:none!important
}
</style>`;

const PRELOAD = `<link rel="preload" href="${TREE_SRC}" as="image" type="image/svg+xml"/>`;

const ORCHESTRATOR = `<script id="${MARKER}">(function(){
var TREE_SRC="${TREE_SRC}";
var WALL_MS=1750;
var DRAW_HOLD_MS=1320;
var REDUCED_MS=400;
var splashStart=performance.now();
var r=document.documentElement;
var timers=[];
r.classList.add("ww-welcome-lock");
window.__wwLuxeWelcomePending=true;
var nativeSetAttr=r.setAttribute.bind(r);
r.setAttribute=function(name,value){
  if(name==="data-ww-hero-video-ready"&&window.__wwLuxeWelcomePending)return;
  return nativeSetAttr(name,value);
};
function later(fn,ms){timers.push(setTimeout(fn,ms));}
function forceHeroReady(){
  window.__wwLuxeWelcomePending=false;
  nativeSetAttr("data-ww-hero-video-ready","1");
}
function splash(){return document.querySelector("#ww-critical-splash");}
function dismiss(){
  r.classList.remove("ww-welcome-lock");
  var s=splash();
  if(s&&s.parentNode)s.parentNode.removeChild(s);
  forceHeroReady();
}
function scheduleFades(imgAt){
  var reduced=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduced){
    later(dismiss,REDUCED_MS);
    later(forceHeroReady,REDUCED_MS);
    return;
  }
  var greenAt=imgAt+DRAW_HOLD_MS;
  var wallEnd=splashStart+WALL_MS;
  var treeAt=greenAt+160;
  var doneAt=Math.min(wallEnd,treeAt+460);
  if(greenAt>wallEnd-500)greenAt=wallEnd-500;
  if(treeAt>wallEnd-460)treeAt=wallEnd-460;
  if(doneAt<treeAt+200)doneAt=treeAt+460;
  later(function(){
    var s=splash();if(s)s.classList.add("ww-green-out");
  },Math.max(0,greenAt-performance.now()));
  later(function(){
    var s=splash();if(s)s.classList.add("ww-tree-out");
  },Math.max(0,treeAt-performance.now()));
  later(dismiss,Math.max(0,doneAt-performance.now()));
  later(forceHeroReady,Math.max(0,wallEnd-performance.now()));
}
function mountTree(){
  var wrap=document.querySelector(".ww-welcome__tree");
  if(!wrap){scheduleFades(performance.now());return;}
  var img=new Image();
  img.className="ww-welcome__tree-img";
  img.alt="";
  img.decoding="async";
  img.width=214;
  img.height=214;
  function live(){
    wrap.classList.add("is-live");
    scheduleFades(performance.now());
  }
  img.onload=live;
  img.onerror=live;
  img.src=TREE_SRC;
  wrap.appendChild(img);
}
function arm(){
  r.style.backgroundColor="#141f19";
  if(document.body)document.body.style.backgroundColor="#141f19";
  requestAnimationFrame(function(){requestAnimationFrame(mountTree);});
}
arm();
})();</script>`;

const THEME_META = `<meta name="theme-color" content="#141f19"/>`;

function bodySplashMarkup() {
  return `<div id="ww-critical-splash" role="status" aria-label="Loading"><div class="ww-welcome__bg" aria-hidden="true"></div><div class="ww-welcome__tree" aria-hidden="true"><div class="ww-welcome__sk-tree"></div></div></div>${ORCHESTRATOR}`;
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

html = html.replace(
  /<link rel="preload" href="\/heirloom\/assets\/heirloom-splash-tree[^"]*"[^>]*>\s*/g,
  ""
);
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

if (!html.includes(PRELOAD)) {
  const headClose = html.indexOf("</head>");
  if (headClose !== -1) {
    html = html.slice(0, headClose) + PRELOAD + html.slice(headClose);
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

const bodyOpen = html.match(/<body[^>]*>/i);
if (bodyOpen && !html.includes('id="ww-critical-splash"')) {
  const at = bodyOpen.index + bodyOpen[0].length;
  html = html.slice(0, at) + bodySplashMarkup() + html.slice(at);
}

if (!html.includes(MARKER)) {
  console.error("inject-luxe-critical-boot: FAIL — welcome splash missing after inject");
  process.exit(1);
}

fs.writeFileSync(indexPath, html);
console.log("inject-luxe-critical-boot: ok (preview welcome · skellie+img · 1.75s wall)");
