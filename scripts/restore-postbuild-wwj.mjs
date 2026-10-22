/**
 * WeWeb GitHub publish often strips ensure-wwj-public-in-dist from postbuild.js.
 * Re-insert before vite build so dist always gets the git wwj/ww-tour runtime pack.
 */
import fs from 'node:fs';
import path from 'node:path';

const file = path.join(process.cwd(), 'postbuild.js');
const marker = './scripts/ensure-wwj-public-in-dist.mjs';
let src = fs.readFileSync(file, 'utf8');
if (src.includes(marker)) {
  console.log('[postbuild-restore] ok');
  process.exit(0);
}

const block = `spawnSync(process.execPath, ['./scripts/ensure-wwj-public-in-dist.mjs'], {
    cwd: process.cwd(),
    stdio: 'inherit',
});

`;

const needle = "import { spawnSync } from 'node:child_process';\n\n";
if (!src.includes(needle)) {
  console.error('[postbuild-restore] unexpected postbuild.js shape — fix manually');
  process.exit(1);
}

src = src.replace(needle, needle + block);
fs.writeFileSync(file, src);
console.log('[postbuild-restore] re-inserted ensure-wwj-public-in-dist');
