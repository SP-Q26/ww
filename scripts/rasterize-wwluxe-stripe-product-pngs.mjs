#!/usr/bin/env node
/**
 * WWLuxe Stripe checkout: stripe-products-source/*.svg → stripe-products/*.png (512², <2MB).
 * Sharp: cd sites/luxe && npm install sharp --no-save
 */
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const luxeRoot = path.join(root, "sites/luxe");
const srcDir = path.join(
  root,
  "sites/luxe/public/whispering-woods-luxe/assets/stripe-products-source"
);
const outDir = path.join(
  root,
  "sites/luxe/public/whispering-woods-luxe/assets/stripe-products"
);
const pasteDir = path.join(root, "docs/luxe/paste/stripe-live-p0/upload-for-stripe");

const require = createRequire(path.join(luxeRoot, "package.json"));
let sharp;
try {
  sharp = require("sharp");
} catch {
  console.error("Run: cd sites/luxe && npm install sharp --no-save");
  process.exit(1);
}

if (!fs.existsSync(pasteDir)) fs.mkdirSync(pasteDir, { recursive: true });
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const svgs = fs
  .readdirSync(srcDir)
  .filter((x) => x.endsWith(".svg") && !x.startsWith("_"));

for (const f of svgs) {
  const base = f.replace(".svg", ".png");
  const out = path.join(outDir, base);
  await sharp(path.join(srcDir, f), { density: 192 })
    .resize(512, 512)
    .png({ compressionLevel: 9 })
    .toFile(out);
  fs.copyFileSync(out, path.join(pasteDir, base));
  console.log(base, fs.statSync(out).size, "bytes");
}

// retired single estate tile
const legacy = path.join(outDir, "estate.png");
if (fs.existsSync(legacy)) {
  fs.unlinkSync(legacy);
  console.log("removed legacy estate.png");
}
