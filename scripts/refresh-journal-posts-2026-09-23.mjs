#!/usr/bin/env node
/**
 * Refresh WW Journal catalog: copy audit, new Sep 2026 news/trends, interleave.
 * Output: docs/journal/journal_posts_with_series_2026-09-23.json
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const inPath = join(root, 'docs/journal/journal_posts_with_series_2026-09-20.json');
const outPath = join(root, 'docs/journal/journal_posts_with_series_2026-09-23.json');

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

function auditCopy(post) {
  const fix = (s) => {
    if (typeof s !== 'string') return s;
    return s
      .replace(/\u2014/g, ' · ')
      .replace(/—/g, ' · ')
      .replace(/\u2019/g, "'")
      .replace(/\u2018/g, "'")
      .replace(/\u201c/g, '"')
      .replace(/\u201d/g, '"')
      .replace(/\s+/g, ' ')
      .replace(/ \· /g, ' · ')
      .trim();
  };
  for (const k of ['title', 'listTitle', 'hook', 'dek', 'cta_label']) {
    if (post[k]) post[k] = fix(post[k]);
  }
  if (post.body_paragraphs) {
    post.body_paragraphs = post.body_paragraphs.map(fix);
  }
  return post;
}

const NEW_POSTS = [
  {
    slug: 'fall-foliage-field-notes',
    title: 'Fall foliage field notes on forty acres',
    listTitle: 'Fall color on meadow and pines',
    hook: 'Gold arrives in layers, not one weekend.',
    dek: 'Late September on the Harvard estate: meadow edges turn first, barn timber warms, and pond reflections pick up amber before the first hard frost.',
    tags: ['news', 'nature', 'grounds'],
    pillar: 'events',
    published: '2026-09-22',
    read_minutes: 3,
    cta_url:
      'https://whisperingwoodsevents.com/?utm_source=ww_journal&utm_medium=blog&utm_campaign=estate_rebrand_2026&utm_content=fall-foliage-field-notes',
    cta_label: 'Tour in fall light',
    body_paragraphs: [
      'Couples touring in autumn often ask when color peaks. On private land the answer is a corridor, not a calendar: willows along the ponds, oak lines at the meadow edge, and long barn shadows that read editorial in late afternoon.',
      'Plan portraits for the hour before sunset when wind is calm. Mirror-still ponds return in fall as often as in summer, with fewer insects and softer air for guests in linen.',
      'Whispering Woods Events hosts one wedding per weekend south of Lake Geneva. Walk the grounds in the season you plan to marry, not only in spring Pinterest boards.',
    ],
  },
  {
    slug: 'local-floral-estate-edge',
    title: 'Local floral at the estate edge',
    listTitle: 'Regional stems over flown-in installs',
    hook: 'Trend lines point toward the county line.',
    dek: '2026 and 2027 planners are specifying Illinois and Wisconsin growers first, then designing installs that echo meadow sage and barn amber already on the property.',
    tags: ['industry-trends', 'design', 'planning'],
    pillar: 'events',
    series: 'industry-trends-2027',
    published: '2026-09-23',
    read_minutes: 3,
    cta_url:
      'https://whisperingwoodsevents.com/?utm_source=ww_journal&utm_medium=blog&utm_campaign=estate_rebrand_2026&utm_content=local-floral-estate-edge',
    cta_label: 'Meet your florist on tour',
    body_paragraphs: [
      'The shift is practical: shorter truck routes, hardier stems for outdoor ceremonies, and palettes that photograph true against pine and pond instead of fighting them.',
      'On tour, note where your florist can anchor installations without masking forty acres. A gate bouquet and Chalet entry often need less volume when the land already frames the story.',
      'Whispering Woods Events welcomes your creative team. The Journal tracks what couples are asking for before it becomes a template.',
    ],
  },
  {
    slug: 'september-estate-dispatch',
    title: 'September estate dispatch',
    listTitle: 'What changed on the grounds this month',
    hook: 'News from Harvard, not a press release.',
    dek: 'Green programs are live for fall weddings, solar engineering moves toward a 2027 install, and Class of 2027 Luxe sessions continue on the same private acres as weekend buyouts.',
    tags: ['news', 'venue'],
    pillar: 'events',
    published: '2026-09-23',
    read_minutes: 4,
    cta_url:
      'https://whisperingwoodsevents.com/?utm_source=ww_journal&utm_medium=blog&utm_campaign=estate_rebrand_2026&utm_content=september-estate-dispatch',
    cta_label: 'Book a fall grounds tour',
    body_paragraphs: [
      'Flower recycling and farm food routing are standard talking points on new tours. Recycling stations are mapped for fall weekends so guests sort without a lecture.',
      'Photovoltaic planning continues for barn and hall roofs. We publish milestones here as dates firm; couples booking 2027 should ask how energy timing intersects with their weekend.',
      'Whispering Woods Luxe remains on Class of 2027 estate senior portraits with limited seasonal roster. Weddings book through Whispering Woods Events. One property, three doors, forty private acres.',
    ],
  },
];

let posts = JSON.parse(readFileSync(inPath, 'utf8'));
const slugs = new Set(posts.map((p) => p.slug));
for (const np of NEW_POSTS) {
  if (!slugs.has(np.slug)) posts.push(np);
}

// Freshen dates on specialty and news
for (const p of posts) {
  auditCopy(p);
  const tags = p.tags || [];
  if (tags.includes('industry-trends') || tags.includes('green-program')) {
    if ((p.published || '') < '2026-09-20') p.published = '2026-09-20';
  }
  if (tags.includes('news') && p.slug !== 'september-estate-dispatch') {
    if ((p.published || '') < '2026-09-19') p.published = '2026-09-19';
  }
}

// Touch solar post for September milestone
const solar = posts.find((p) => p.slug === 'solar-2027-full-green-events');
if (solar) {
  solar.published = '2026-09-21';
  solar.dek =
    'Engineering walk-throughs continue this fall as photovoltaic install targets 2027, offsetting hall and Chalet load on forty Harvard acres.';
  solar.body_paragraphs[2] =
    'September 2026: structural review and routing plans are underway. The Journal will note when install dates are public so 2027 couples can align lighting and vendor choices.';
}

posts = interleave(posts);
writeFileSync(outPath, JSON.stringify(posts, null, 2) + '\n');
console.log('Wrote', posts.length, 'posts to', outPath);
