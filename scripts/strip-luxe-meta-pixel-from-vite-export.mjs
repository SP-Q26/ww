/**
 * Remove Meta Pixel from WeWeb-exported project head embedded in vite.config.js.
 * Run after merge from WeWeb publish so pixel cannot re-enter via export.
 */
import fs from "fs";
import path from "path";

const vitePath = path.join(path.resolve(import.meta.dirname, ".."), "vite.config.js");
let s = fs.readFileSync(vitePath, "utf8");
const before = s;

s = s.replace(
  /,\\n  \/\* Meta Pixel — leave \\"\\" until ID is ready; empty = no Facebook requests \*\/\\n  meta_pixel_id: \\"[^"\\]*\\"/g,
  ""
);
s = s.replace(
  /<script src=\\"https:\/\/whisperingwoodsluxe\.com\/heirloom\/assets\/wwl-meta-pixel\.js\\" defer><\/script>\\n/g,
  ""
);
s = s.replace(
  /<noscript><img height=\\"1\\" width=\\"1\\" style=\\"display:none\\" alt=\\"\\"\\n  src=\\"https:\/\/www\.facebook\.com\/tr\?id=[^&]+&amp;ev=PageView&amp;noscript=1\\" \/><\/noscript>\\n/g,
  ""
);

if (s === before) {
  if (/wwl-meta-pixel|meta_pixel_id/.test(s)) {
    console.error("strip-luxe-meta-pixel-from-vite-export: patterns missed — fix script");
    process.exit(1);
  }
  console.log("strip-luxe-meta-pixel-from-vite-export: already clean");
} else {
  fs.writeFileSync(vitePath, s);
  console.log("strip-luxe-meta-pixel-from-vite-export: stripped from vite.config.js");
}
