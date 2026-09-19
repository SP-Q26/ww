/**
 * First paint: pine + sprout tree (#ww-critical-splash); hand off to canvas splash, then hero video.
 * Hard cap: data-ww-hero-video-ready at 5s so splash CSS cannot loop forever.
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const indexPath = path.join(ROOT, "dist", "index.html");
const svgPath = path.join(ROOT, "docs/luxe/canvas/hero-splash-tree.svg");

const HERO_SPLASH_UID = "17f047b4-78f5-44c4-94a0-e24018d60df9";
const SPLASH_STYLE = `<style id="ww-critical-first-paint">
html,body,#app{background-color:#141f19!important}
body{margin:0}
#ww-critical-splash{
  position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;
  background:#141f19;opacity:1;transition:opacity 1s ease;pointer-events:none
}
#ww-critical-splash.is-out{opacity:0}
#ww-critical-splash svg{width:min(32vw,140px);height:auto;display:block}
html:not([data-ww-hero-video-ready="1"]) .ww-element-${HERO_SPLASH_UID}{
  position:absolute!important;inset:0!important;z-index:12!important;
  display:flex!important;align-items:center!important;justify-content:center!important;
  pointer-events:none!important;opacity:1!important;visibility:visible!important;
  transition:opacity 1.15s ease,visibility 1.15s ease
}
html[data-ww-hero-video-ready="1"] .ww-element-${HERO_SPLASH_UID}{
  opacity:0!important;visibility:hidden!important;pointer-events:none!important
}
html[data-ww-hero-video-ready="1"] .ww-element-63c3ad17-1c03-49e0-b69c-be61ce0028ee iframe{
  transition:opacity .7s ease .15s!important
}
</style>`;

const HEAD_BOOT = `<script>(function(){
var r=document.documentElement;
r.style.backgroundColor="#141f19";
function paint(){if(document.body)document.body.style.backgroundColor="#141f19";}
paint();
document.addEventListener("DOMContentLoaded",paint);
var t0=Date.now();
var MIN_CRITICAL=700;
var HANDOFF_MAX=4500;
var splashSel=".ww-element-${HERO_SPLASH_UID}";
function forceHeroReady(){
  r.setAttribute("data-ww-hero-video-ready","1");
}
function dismissCritical(){
  var el=document.getElementById("ww-critical-splash");
  if(!el||el.classList.contains("is-out"))return;
  el.classList.add("is-out");
  window.setTimeout(function(){if(el.parentNode)el.parentNode.removeChild(el);},1100);
}
function tryHandoff(){
  var elapsed=Date.now()-t0;
  var canvas=document.querySelector(splashSel);
  if(canvas&&elapsed>=MIN_CRITICAL){dismissCritical();return true;}
  if(elapsed>=HANDOFF_MAX){dismissCritical();forceHeroReady();return true;}
  return false;
}
function loop(){
  if(!tryHandoff())window.requestAnimationFrame(loop);
}
window.setTimeout(forceHeroReady,5000);
if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",function(){window.requestAnimationFrame(loop);});
}else{window.requestAnimationFrame(loop);}
})();</script><meta name="theme-color" content="#141f19"/>`;

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

html = html.replace(/<script id="ww-luxe-splash-bail">[\s\S]*?<\/script>/g, "");

const svg = loadSplashSvg();
const headSnippet = HEAD_BOOT + SPLASH_STYLE;
const headOpen = html.match(/<head[^>]*>/i);
if (!headOpen) {
  console.warn("inject-luxe-critical-boot: no <head> — skip");
  process.exit(0);
}

if (html.includes('id="ww-critical-first-paint"')) {
  html = html.replace(
    /<style id="ww-critical-first-paint">[\s\S]*?<\/style>/,
    SPLASH_STYLE.trim()
  );
  const oldBoot = html.indexOf('r.style.backgroundColor="#141f19"');
  if (oldBoot !== -1) {
    const scriptStart = html.lastIndexOf("<script>", oldBoot);
    const scriptEnd = html.indexOf("</script>", oldBoot);
    if (scriptStart !== -1 && scriptEnd !== -1) {
      html = html.slice(0, scriptStart) + HEAD_BOOT + html.slice(scriptEnd + 9);
    }
  }
} else {
  const insertAt = headOpen.index + headOpen[0].length;
  html = html.slice(0, insertAt) + headSnippet + html.slice(insertAt);
}

if (svg) {
  html = html.replace(/<div id="ww-critical-splash"[\s\S]*?<\/div>/, "");
  const bodyOpen = html.match(/<body[^>]*>/i);
  if (bodyOpen && !html.includes('id="ww-critical-splash"')) {
    const insertAt = bodyOpen.index + bodyOpen[0].length;
    html = html.slice(0, insertAt) + bodySplashMarkup(svg) + html.slice(insertAt);
  }
}

fs.writeFileSync(indexPath, html);
console.log("inject-luxe-critical-boot: ok" + (svg ? " (3-phase splash)" : ""));
