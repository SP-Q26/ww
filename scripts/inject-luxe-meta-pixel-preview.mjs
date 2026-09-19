/**
 * Preview-only Meta Pixel (analytics). Home SPA + /booked confirmation.
 * Production `main` keeps home clean via strip-luxe-meta-pixel-from-dist.mjs.
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const ref = process.env.VERCEL_GIT_COMMIT_REF || "main";
const enabled =
  ref === "preview" || process.env.WW_LUXE_META_PIXEL === "1";

if (!enabled) {
  console.log("inject-luxe-meta-pixel-preview: skip (not preview)");
  process.exit(0);
}

const PIXEL_ID = String(
  process.env.WWL_META_PIXEL_ID || "2254112335167924"
).replace(/\s/g, "");

if (!PIXEL_ID) {
  console.warn("inject-luxe-meta-pixel-preview: no pixel id — skip");
  process.exit(0);
}

const MARKER = 'id="ww-luxe-meta-pixel-preview"';
/** Booked has no welcome gate — load pixel in head. */
const BOOKED_SNIPPET = `<script ${MARKER}>
window.WWL_META_PIXEL_ID="${PIXEL_ID}";
</script>
<script src="/heirloom/assets/wwl-meta-pixel.js" defer></script>`;
/** Home: never block <body> parse — wait until welcome splash hands off (or timeout). */
const HOME_SNIPPET = `<script ${MARKER}>
(function(){
var PIXEL_ID="${PIXEL_ID}";
var MAX_WAIT_MS=2200;
var t0=performance.now();
function loadPixel(){
window.WWL_META_PIXEL_ID=PIXEL_ID;
var s=document.createElement("script");
s.src="/heirloom/assets/wwl-meta-pixel.js";
s.async=true;
(document.head||document.documentElement).appendChild(s);
}
function welcomeDone(){
if(window.__wwLuxeWelcomePending===false)return true;
var el=document.getElementById("ww-critical-splash");
if(!el||!el.parentNode)return true;
if(performance.now()-t0>MAX_WAIT_MS)return true;
return false;
}
function arm(){
if(welcomeDone()){loadPixel();return;}
setTimeout(arm,80);
}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",arm);}
else{arm();}
})();
</script>`;

function injectHome() {
  const indexPath = path.join(ROOT, "dist", "index.html");
  if (!fs.existsSync(indexPath)) {
    console.warn("inject-luxe-meta-pixel-preview: no dist/index.html — skip home");
    return;
  }
  let html = fs.readFileSync(indexPath, "utf8");
  if (html.includes(MARKER)) {
    console.log("inject-luxe-meta-pixel-preview: home already injected");
    return;
  }

  if (/window\.WW_SITE_CONFIG\s*=\s*\{/.test(html)) {
    if (!/meta_pixel_id\s*:/.test(html)) {
      html = html.replace(
        /(tour_booking_url:\s*"[^"]*")(\s*\n\};)/,
        `$1,\n  meta_pixel_id: "${PIXEL_ID}"$2`
      );
    } else {
      html = html.replace(
        /meta_pixel_id:\s*["'][^"']*["']/,
        `meta_pixel_id: "${PIXEL_ID}"`
      );
    }
  }

  const bodyClose = html.lastIndexOf("</body>");
  if (bodyClose === -1) {
    console.error("inject-luxe-meta-pixel-preview: no </body> in index.html");
    process.exit(1);
  }
  html = html.slice(0, bodyClose) + HOME_SNIPPET + html.slice(bodyClose);
  fs.writeFileSync(indexPath, html);
  console.log("inject-luxe-meta-pixel-preview: home ok (post-welcome)");
}

function injectBooked() {
  const bookedPath = path.join(
    ROOT,
    "dist",
    "whispering-woods-luxe",
    "booked",
    "index.html"
  );
  if (!fs.existsSync(bookedPath)) {
    console.warn("inject-luxe-meta-pixel-preview: no dist/booked — skip");
    return;
  }
  let html = fs.readFileSync(bookedPath, "utf8");
  if (html.includes(MARKER)) {
    console.log("inject-luxe-meta-pixel-preview: booked already injected");
    return;
  }
  const headClose = html.indexOf("</head>");
  if (headClose === -1) return;
  html = html.slice(0, headClose) + BOOKED_SNIPPET + html.slice(headClose);
  fs.writeFileSync(bookedPath, html);
  console.log("inject-luxe-meta-pixel-preview: booked ok");
}

injectHome();
injectBooked();
