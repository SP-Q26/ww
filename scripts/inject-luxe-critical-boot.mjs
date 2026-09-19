/**
 * First paint: pine background only. No animated critical overlay.
 * Mandatory 1.5s bail sets data-ww-hero-video-ready and removes splash layers.
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const indexPath = path.join(ROOT, "dist", "index.html");

const HERO_SPLASH_UID = "17f047b4-78f5-44c4-94a0-e24018d60df9";
const HERO_VIDEO_UID = "63c3ad17-1c03-49e0-b69c-be61ce0028ee";

const SPLASH_STYLE = `<style id="ww-critical-first-paint">
html,body,#app{background-color:#141f19!important}
body{margin:0}
#ww-critical-splash{display:none!important}
html[data-ww-hero-video-ready="1"] .ww-element-${HERO_SPLASH_UID},
html[data-ww-hero-video-ready="1"] .ww-element-${HERO_VIDEO_UID} iframe{
  opacity:1!important;visibility:visible!important
}
</style>`;

const BAIL_SCRIPT = `<script id="ww-luxe-splash-bail">(function(){
var MS=1500;
var SPLASH=".ww-element-${HERO_SPLASH_UID}";
function bail(){
  var r=document.documentElement;
  r.setAttribute("data-ww-hero-video-ready","1");
  var c=document.getElementById("ww-critical-splash");
  if(c&&c.parentNode)c.parentNode.removeChild(c);
  var el=document.querySelector(SPLASH);
  if(el){
    el.style.setProperty("opacity","0","important");
    el.style.setProperty("visibility","hidden","important");
    el.style.setProperty("display","none","important");
  }
}
window.setTimeout(bail,MS);
document.addEventListener("DOMContentLoaded",function(){window.setTimeout(bail,MS);});
})();</script><meta name="theme-color" content="#141f19"/>`;

if (!fs.existsSync(indexPath)) {
  console.warn("inject-luxe-critical-boot: dist/index.html missing — skip");
  process.exit(0);
}

let html = fs.readFileSync(indexPath, "utf8");

if (html.includes('id="ww-critical-first-paint"')) {
  html = html.replace(
    /<style id="ww-critical-first-paint">[\s\S]*?<\/style>/,
    SPLASH_STYLE.trim()
  );
} else {
  const headOpen = html.match(/<head[^>]*>/i);
  if (headOpen) {
    const insertAt = headOpen.index + headOpen[0].length;
    html = html.slice(0, insertAt) + SPLASH_STYLE + html.slice(insertAt);
  }
}

html = html.replace(/<script id="ww-luxe-splash-bail">[\s\S]*?<\/script>/, "");
html = html.replace(/<div id="ww-critical-splash"[\s\S]*?<\/div>/, "");

const bailMarker = 'id="ww-luxe-splash-bail"';
if (!html.includes(bailMarker)) {
  const headClose = html.indexOf("</head>");
  if (headClose !== -1) {
    html = html.slice(0, headClose) + BAIL_SCRIPT + html.slice(headClose);
  }
}

fs.writeFileSync(indexPath, html);
console.log("inject-luxe-critical-boot: ok (pine + 1.5s bail, no critical overlay)");
