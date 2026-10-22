/**
 * Vite copies public/ → dist/, but WeWeb multi-page builds can miss git-only
 * wwj-* assets on some hosts. Belt-and-suspenders before postbuild prerender.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pub = path.join(root, 'public');
const dist = path.join(root, 'dist');

if (!fs.existsSync(dist)) {
  console.warn('[wwj-static] dist/ missing — skip copy');
  process.exit(0);
}
if (!fs.existsSync(pub)) {
  console.warn('[wwj-static] public/ missing — skip copy');
  process.exit(0);
}

let copied = 0;
for (const name of fs.readdirSync(pub)) {
  if (!name.startsWith('wwj-')) continue;
  const from = path.join(pub, name);
  const to = path.join(dist, name);
  const isDir = fs.statSync(from).isDirectory();
  fs.cpSync(from, to, { recursive: isDir, force: true });
  copied += 1;
}

console.log('[wwj-static] ensured wwj pack in dist/', { copied });
