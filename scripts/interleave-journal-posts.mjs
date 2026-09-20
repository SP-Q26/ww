#!/usr/bin/env node
/**
 * Reorder journal_posts for feed variety: trends + green woven through
 * grounds, weddings, luxe, and planning — no stacked specialty runs.
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const inPath = join(root, 'docs/journal/JOURNAL_POSTS_WITH_SERIES_2026-09-20.json');
const outPath = inPath;

function feedCategory(post) {
  const tags = post.tags || [];
  if (tags.includes('industry-trends')) return 'trend';
  if (tags.includes('green-program')) return 'green';
  if (post.pillar === 'luxe') return 'luxe';
  if (tags.some((t) => ['nature', 'grounds', 'chalet'].includes(t))) return 'grounds';
  return 'events';
}

function interleave(posts) {
  const buckets = {};
  for (const p of posts) {
    const c = feedCategory(p);
    (buckets[c] ||= []).push(p);
  }
  for (const key of Object.keys(buckets)) {
    buckets[key].sort((a, b) => (b.published || '').localeCompare(a.published || ''));
  }

  const specialty = new Set(['trend', 'green']);
  const rotation = ['grounds', 'events', 'luxe', 'trend', 'green'];
  const result = [];
  const recent = [];

  const remaining = () => Object.values(buckets).reduce((n, arr) => n + arr.length, 0);

  while (remaining() > 0) {
    const candidates = rotation.filter((c) => buckets[c]?.length);
    const scored = candidates
      .map((c) => {
        let score = buckets[c].length * 100;
        if (recent[0] === c) score -= specialty.has(c) ? 1000 : 80;
        if (recent[1] === c) score -= specialty.has(c) ? 500 : 40;
        if (recent[0] && specialty.has(recent[0]) && specialty.has(c)) score -= 200;
        return { c, score };
      })
      .sort((a, b) => b.score - a.score);

    const pick = scored[0]?.c ?? candidates[0];
    result.push(buckets[pick].shift());
    recent.unshift(pick);
    if (recent.length > 3) recent.pop();
  }

  return result;
}

function validate(order) {
  for (let i = 1; i < order.length; i++) {
    const prev = order[i - 1].tags || [];
    const cur = order[i].tags || [];
    if (prev.includes('industry-trends') && cur.includes('industry-trends')) {
      throw new Error(`Back-to-back industry-trends at ${i - 1} and ${i}`);
    }
    if (prev.includes('green-program') && cur.includes('green-program')) {
      throw new Error(`Back-to-back green-program at ${i - 1} and ${i}`);
    }
  }
}

const posts = JSON.parse(readFileSync(inPath, 'utf8'));
const mixed = interleave(posts);
validate(mixed);

writeFileSync(outPath, JSON.stringify(mixed, null, 2));
console.log(`Interleaved ${mixed.length} posts → ${outPath}`);
