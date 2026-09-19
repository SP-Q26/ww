/**
 * Home SPA must never load Meta Pixel from Project Head (analytics-only, opt-in later).
 * Strips pixel tags from dist HTML after WeWeb export + inject.
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const indexPath = path.join(ROOT, "dist", "index.html");

if (!fs.existsSync(indexPath)) {
  console.warn("strip-luxe-meta-pixel-from-dist: no dist/index.html — skip");
  process.exit(0);
}

let html = fs.readFileSync(indexPath, "utf8");
const before = html;

html = html.replace(
  /,?\s*\/\* Meta Pixel[\s\S]*?meta_pixel_id:\s*["'][^"']*["']\s*/g,
  ""
);
html = html.replace(
  /<script[^>]*src=["'][^"']*wwl-meta-pixel\.js["'][^>]*>\s*<\/script>\s*/gi,
  ""
);
html = html.replace(
  /<noscript>\s*<img[^>]*facebook\.com\/tr\?id=[^>]*>\s*<\/noscript>\s*/gi,
  ""
);
html = html.replace(/meta_pixel_id:\s*["'][^"']*["'],?\s*/g, "");

if (html !== before) {
  fs.writeFileSync(indexPath, html);
  console.log("strip-luxe-meta-pixel-from-dist: removed Meta Pixel from dist/index.html");
} else if (/wwl-meta-pixel|meta_pixel_id/i.test(html)) {
  console.error("strip-luxe-meta-pixel-from-dist: FAIL — pixel markers still present");
  process.exit(1);
} else {
  console.log("strip-luxe-meta-pixel-from-dist: ok (clean)");
}
