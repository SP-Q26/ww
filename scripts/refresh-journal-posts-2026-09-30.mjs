#!/usr/bin/env node
/**
 * WW Journal · Oct 2026 refresh: copy audit, new dispatch + trends, interleave.
 * Input: docs/journal/journal_posts_with_series_2026-09-23.json
 * Output: docs/journal/journal_posts_with_series_2026-09-30.json
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const inPath = join(root, 'docs/journal/journal_posts_with_series_2026-09-23.json');
const outPath = join(root, 'docs/journal/journal_posts_with_series_2026-09-30.json');

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

const UTM =
  'utm_source=ww_journal&utm_medium=blog&utm_campaign=estate_rebrand_2026&utm_content=';

const NEW_POSTS = [
  {
    slug: 'october-estate-dispatch',
    title: 'October estate dispatch',
    listTitle: 'October on the grounds',
    hook: 'Harvest light, cooler nights, tour season in full swing.',
    dek: 'Fall color is climbing the oak line, Luxe rosters tighten for Class of 2027, and green-program pickups continue after weekend buyouts.',
    tags: ['news', 'venue'],
    pillar: 'events',
    published: '2026-09-30',
    read_minutes: 4,
    cta_url: `https://whisperingwoodsevents.com/?${UTM}october-estate-dispatch`,
    cta_label: 'Book an October grounds tour',
    body_paragraphs: [
      'Tour slots fill faster once meadow edges turn. We are holding Thursday and Sunday afternoons for couples comparing Harvard buyouts to corridor ballrooms.',
      'Flower recycling and farm routing ran through September weekends without drama. October adds heavier linens and earlier sunsets, so portrait blocks move up on the timeline.',
      'Whispering Woods Luxe continues estate senior days on the same acres as WWE buyouts. One property, three doors, forty private acres south of Lake Geneva.',
    ],
  },
  {
    slug: 'heated-lounge-fall-backup',
    title: 'Heated lounge backup without losing the meadow',
    listTitle: 'Chalet and barn as fall insurance',
    hook: 'Couples want outdoor vows until the air says otherwise.',
    dek: '2026 planners are pairing quick outdoor ceremonies with heated lounge time at the Chalet and barn timber portraits when wind picks up across the ponds.',
    tags: ['industry-trends', 'weather', 'planning'],
    pillar: 'events',
    series: 'industry-trends-2027',
    published: '2026-09-29',
    read_minutes: 3,
    cta_url: `https://whisperingwoodsevents.com/?${UTM}heated-lounge-fall-backup`,
    cta_label: 'Walk rain and wind plans',
    body_paragraphs: [
      'The trend is not a tent on the lawn. It is a short outdoor window, then guests drift to fireplaces, mocktails, and window light while catering resets.',
      'On tour, time how long it takes from meadow to Chalet porch. If that walk feels like a punishment, your rain plan will feel like one too.',
      'Whispering Woods Events keeps ceremony, cocktail, and portrait layers on one address so pivots stay dignified, not improvised.',
    ],
  },
  {
    slug: 'post-weekend-compost-pickup',
    title: 'Post-weekend compost pickup on schedule',
    listTitle: 'What leaves the estate after Sunday brunch',
    hook: 'Green events end when trucks roll, not when photos post.',
    dek: 'Sorted compost and floral surplus now leave on a Monday rhythm with partner farms west of Harvard, keeping meadow edges clean for the next gate.',
    tags: ['green-program', 'sustainability', 'news'],
    pillar: 'events',
    series: 'green-programs',
    published: '2026-09-28',
    read_minutes: 3,
    cta_url: `https://whisperingwoodsevents.com/?${UTM}post-weekend-compost-pickup`,
    cta_label: 'Ask about green programs',
    body_paragraphs: [
      'Weekend buyouts generate volume: stems, prep scraps, and service ware that must leave before the next family arrives.',
      'Labeled stations and a Monday pickup window mean staff are not guessing at 2 a.m. Sunday. Vendors get the same map during load-in.',
      'Solar planning for 2027 pairs with these loops: less haul-off, more on-site stewardship. The Journal notes each milestone as it ships.',
    ],
  },
];

let posts = JSON.parse(readFileSync(inPath, 'utf8'));
const bySlug = new Map(posts.map((p) => [p.slug, p]));

for (const np of NEW_POSTS) {
  if (!bySlug.has(np.slug)) {
    posts.push(np);
    bySlug.set(np.slug, np);
  } else {
    Object.assign(bySlug.get(np.slug), np);
  }
}

for (const p of posts) {
  auditCopy(p);
  const tags = p.tags || [];
  if (tags.includes('industry-trends') || tags.includes('green-program')) {
    if ((p.published || '') < '2026-09-28') p.published = '2026-09-28';
  }
  if (tags.includes('news') && !['october-estate-dispatch', 'september-estate-dispatch'].includes(p.slug)) {
    if ((p.published || '') < '2026-09-22') p.published = '2026-09-22';
  }
  if (!p.cta_url?.includes('utm_content=') && p.slug) {
    const base = p.pillar === 'luxe'
      ? 'https://whisperingwoodsluxe.com/home'
      : 'https://whisperingwoodsevents.com/';
    p.cta_url = `${base}?${UTM}${p.slug}`;
  }
}

const solar = bySlug.get('solar-2027-full-green-events');
if (solar) {
  solar.published = '2026-09-28';
  solar.body_paragraphs[2] =
    'Late September 2026: routing and structural review continue. We will publish install windows when engineering signs off so 2027 couples can plan lighting and generator needs.';
}

const fall = bySlug.get('fall-foliage-field-notes');
if (fall) {
  fall.published = '2026-09-27';
  fall.dek =
    'Early October on the Harvard estate: oak lines warm first, barn timber glows by late afternoon, and pond mirrors return on still evenings before frost.';
}

posts = interleave(posts);

const slugs = posts.map((p) => p.slug);
const dup = slugs.filter((s, i) => slugs.indexOf(s) !== i);
if (dup.length) {
  console.error('Duplicate slugs:', dup);
  process.exit(1);
}

writeFileSync(outPath, JSON.stringify(posts, null, 2) + '\n');
console.log('Wrote', posts.length, 'posts · lead', posts[0]?.slug, '→', outPath);
