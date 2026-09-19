/**
 * Meta Pixel (analytics). Home SPA + /booked confirmation.
 * `main` and `preview` use the same inject (post strip). Do not load from Project Head.
 * Opt-out entire inject: WW_LUXE_META_PIXEL=0
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const ref = process.env.VERCEL_GIT_COMMIT_REF || "main";

if (process.env.WW_LUXE_META_PIXEL === "0") {
  console.log(`inject-luxe-meta-pixel-preview: skip (WW_LUXE_META_PIXEL=0, ref=${ref})`);
  process.exit(0);
}

const PIXEL_ID = String(
  process.env.WWL_META_PIXEL_ID || "2254112335167924"
).replace(/\s/g, "");

if (!PIXEL_ID) {
  console.warn("inject-luxe-meta-pixel-preview: no pixel id — skip");
  process.exit(0);
}

const homePixelOff = process.env.WW_LUXE_META_PIXEL_HOME === "0";

const MARKER = 'id="ww-luxe-meta-pixel-preview"';
/** Booked has no welcome gate — load pixel in head. */
const BOOKED_SNIPPET = `<script ${MARKER}>
window.WWL_META_PIXEL_ID="${PIXEL_ID}";
</script>
<script src="/heirloom/assets/wwl-meta-pixel.js" defer></script>`;
/**
 * Home: load only after welcome splash is removed (not at green-out).
 * beginGreenOut clears __wwLuxeWelcomePending while the tree is still on screen —
 * polling that flag caused fbevents.js to load during the tree hold (1–2 visible frames).
 */
const HOME_SNIPPET = `<script ${MARKER}>
(function(){
var PIXEL_ID="${PIXEL_ID}";
var loaded=false;
var FALLBACK_MS=2400;
function loadPixel(){
if(loaded)return;
loaded=true;
window.WWL_META_PIXEL_ID=PIXEL_ID;
function attach(){
var s=document.createElement("script");
s.src="/heirloom/assets/wwl-meta-pixel.js";
s.async=true;
(document.head||document.documentElement).appendChild(s);
}
if(window.requestIdleCallback){requestIdleCallback(attach,{timeout:800});}
else{setTimeout(attach,0);}
}
window.addEventListener("ww-luxe-welcome-dismissed",function(){
setTimeout(loadPixel,400);
},{once:true});
setTimeout(function(){
if(!document.getElementById("ww-critical-splash")){loadPixel();}
},FALLBACK_MS);
})();
</script>`;

function injectHome() {
  if (homePixelOff) {
    console.log("inject-luxe-meta-pixel-preview: home skipped (WW_LUXE_META_PIXEL_HOME=0)");
    return;
  }
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

  const bodyClose = html.lastIndexOf("</body>");
  if (bodyClose === -1) {
    console.error("inject-luxe-meta-pixel-preview: no </body> in index.html");
    process.exit(1);
  }
  html = html.slice(0, bodyClose) + HOME_SNIPPET + html.slice(bodyClose);
  fs.writeFileSync(indexPath, html);
  console.log("inject-luxe-meta-pixel-preview: home ok (after splash dismiss)");
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
