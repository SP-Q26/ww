/**
 * Fail Vercel build if git wwj runtime pack is missing or stale (wrong byte size).
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const hydrate = path.join(root, 'public', 'wwj-posts-hydrate.js');
if (!fs.existsSync(hydrate)) {
  console.error('[wwj-verify] missing public/wwj-posts-hydrate.js');
  process.exit(1);
}
const body = fs.readFileSync(hydrate, 'utf8');
const minBytes = 5500;
const size = Buffer.byteLength(body, 'utf8');
if (size < minBytes) {
  console.error('[wwj-verify] wwj-posts-hydrate.js too small', { size, minBytes });
  process.exit(1);
}
if (!body.includes('resetVariables') || !body.includes('__wwjResetVariablesPatched')) {
  console.error('[wwj-verify] hydrate missing resetVariables patch — run ship-wwj-public from SPQ');
  process.exit(1);
}
console.log('[wwj-verify] ok', { size });
