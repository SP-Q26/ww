#!/usr/bin/env node
/**
 * WWLuxe em-dash audit (and optional doc fix).
 *
 *   node scripts/wwluxe-audit-em-dashes.mjs
 *   node scripts/wwluxe-audit-em-dashes.mjs --fix
 *   node scripts/wwluxe-audit-em-dashes.mjs --fix --dir public/docs/whispering-woods-luxe
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const EM = '\u2014';

const args = process.argv.slice(2);
const fix = args.includes('--fix');
const dirArg = args.find((a) => a.startsWith('--dir='));
const targetDir = path.resolve(
  ROOT,
  dirArg ? dirArg.slice('--dir='.length) : 'docs/whispering-woods-luxe'
);

/** Heuristic replacements for markdown / copy blocks (review --fix diffs). */
function suggestLine(line) {
  let out = line;
  // " — " mid-sentence → " · " (common in WWLuxe voice)
  out = out.replace(/\s—\s/g, ' · ');
  // Remaining em dashes (headings, tight pairs)
  out = out.replace(/—/g, ' · ');
  return out;
}

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else if (/\.(md|html|txt)$/i.test(name)) {
      if (/NO_EM_DASH|WEWEB_AI_NO_EM_DASH/i.test(name)) continue;
      acc.push(full);
    }
  }
  return acc;
}

const files = walk(targetDir);
let total = 0;
const hits = [];

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  if (!raw.includes(EM)) continue;
  const lines = raw.split('\n');
  const fileHits = [];
  lines.forEach((line, i) => {
    if (line.includes(EM)) {
      fileHits.push({ line: i + 1, text: line.trim(), suggest: suggestLine(line).trim() });
      total++;
    }
  });
  if (fileHits.length) hits.push({ file, fileHits });

  if (fix) {
    const next = lines.map((line) => (line.includes(EM) ? suggestLine(line) : line)).join('\n');
    if (next !== raw) fs.writeFileSync(file, next);
  }
}

if (!hits.length) {
  console.log(`OK: no em dashes under ${path.relative(ROOT, targetDir)}`);
  process.exit(0);
}

console.log(`${fix ? 'FIXED' : 'FOUND'} ${total} em-dash line(s) in ${hits.length} file(s):\n`);
for (const { file, fileHits } of hits) {
  console.log(path.relative(ROOT, file));
  for (const h of fileHits) {
    console.log(`  L${h.line}: ${h.text.slice(0, 100)}${h.text.length > 100 ? '…' : ''}`);
    if (!fix) console.log(`       → ${h.suggest.slice(0, 100)}${h.suggest.length > 100 ? '…' : ''}`);
  }
  console.log('');
}

if (!fix) {
  console.log('Run with --fix to rewrite files (review git diff before commit).');
  process.exit(1);
}
