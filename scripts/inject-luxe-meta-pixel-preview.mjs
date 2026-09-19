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
const SNIPPET = `<script ${MARKER}>
window.WWL_META_PIXEL_ID="${PIXEL_ID}";
</script>
<script src="/heirloom/assets/wwl-meta-pixel.js"></script>`;

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

  const headClose = html.indexOf("</head>");
  if (headClose === -1) {
    console.error("inject-luxe-meta-pixel-preview: no </head> in index.html");
    process.exit(1);
  }
  html = html.slice(0, headClose) + SNIPPET + html.slice(headClose);
  fs.writeFileSync(indexPath, html);
  console.log("inject-luxe-meta-pixel-preview: home ok");
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
  html = html.slice(0, headClose) + SNIPPET + html.slice(headClose);
  fs.writeFileSync(bookedPath, html);
  console.log("inject-luxe-meta-pixel-preview: booked ok");
}

injectHome();
injectBooked();
