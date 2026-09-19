/**
 * WeWeb export sitemap/robots often point at *.weweb-preview.io — rewrite to production apex.
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const APEX = (process.env.WWLUXE_SITE_ORIGIN || "https://whisperingwoodsluxe.com").replace(
  /\/$/,
  ""
);
const PREVIEW = /https?:\/\/[a-f0-9-]+\.weweb-preview\.io/gi;

function rewriteFile(rel) {
  const filePath = path.join(ROOT, rel);
  if (!fs.existsSync(filePath)) return false;
  const before = fs.readFileSync(filePath, "utf8");
  const after = before.replace(PREVIEW, APEX);
  if (after === before) return false;
  fs.writeFileSync(filePath, after);
  console.log(`rewrite-luxe-apex-seo-urls: ${rel}`);
  return true;
}

const touched =
  rewriteFile("public/sitemap.xml") |
  rewriteFile("public/robots.txt") |
  rewriteFile("dist/sitemap.xml") |
  rewriteFile("dist/robots.txt");

if (!touched) {
  console.log("rewrite-luxe-apex-seo-urls: ok (already apex)");
}
