#!/usr/bin/env node
/**
 * After Vite build: copy sites/luxe static + API into dist for unified Vercel deploy.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const slicePublic = path.join(root, "sites", "luxe", "public");
const sliceApi = path.join(root, "sites", "luxe", "api");
const distApi = path.join(root, "api");

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const from = path.join(src, name);
    const to = path.join(dest, name);
    if (fs.statSync(from).isDirectory()) copyRecursive(from, to);
    else fs.copyFileSync(from, to);
  }
}

if (!fs.existsSync(dist)) {
  console.error("copy-luxe-slice-into-dist: dist/ missing — run vite build first");
  process.exit(1);
}

// Only heirloom/legal static — never overwrite WeWeb dist/index.html (slice hub).
const sliceStatic = path.join(slicePublic, "whispering-woods-luxe");
copyRecursive(sliceStatic, path.join(dist, "whispering-woods-luxe"));
copyRecursive(sliceApi, distApi);
console.log("copy-luxe-slice-into-dist: ok");
