#!/usr/bin/env node
/**
 * WeWeb export often strips postbuild from package.json.
 * Vercel runs scripts/vercel-build.sh which calls this before npm run build.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkgPath = path.join(root, 'package.json');

const POSTBUILD = 'node ./postbuild.js';
const BUILD = 'vite build -l warn';

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
if (!pkg.scripts) pkg.scripts = {};

let changed = false;
if (pkg.scripts.build !== BUILD) {
  pkg.scripts.build = BUILD;
  changed = true;
}
if (!pkg.scripts.postbuild || !String(pkg.scripts.postbuild).includes('postbuild.js')) {
  pkg.scripts.postbuild = POSTBUILD;
  changed = true;
}

if (changed) {
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('[ensure-package-scripts] restored build/postbuild');
} else {
  console.log('[ensure-package-scripts] OK');
}
