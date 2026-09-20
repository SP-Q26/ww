#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const basePath = join(root, 'docs/journal/JOURNAL_POSTS_REWRITE_2026-09-20.json');
const outPath = join(root, 'docs/journal/JOURNAL_POSTS_WITH_SERIES_2026-09-20.json');

const utm = (slug) =>
  `https://whisperingwoodsevents.com/?utm_source=ww_journal&utm_medium=blog&utm_campaign=estate_rebrand_2026&utm_content=${slug}`;

const newPosts = [
  {
    slug: 'private-weekend-not-shared-hall',
    title: 'Why couples are choosing private weekends over shared halls',
    listTitle: 'Private weekends over shared halls',
    hook: 'Presence beats production value when the gate is yours.',
    dek: '2026 couples are trading stacked Saturday slots for one address, relaxed timing, and guests who never hear another celebration through the wall.',
    tags: ['industry-trends', 'privacy', 'planning'],
    pillar: 'events',
    series: 'industry-trends-2027',
    published: '2026-09-20',
    read_minutes: 4,
    cta_url: utm('private-weekend-not-shared-hall'),
    cta_label: 'Tour the buyout',
    body_paragraphs: [
      'The trend is not bigger décor. It is fewer strangers in your photographs and a timeline that breathes from Friday setup through Sunday coffee on the porch.',
      'Ask on tour what happens when music runs past ten, when family wants a quiet pond walk, or when you need twenty minutes of portraits without a coordinator chasing the next couple in the ballroom corridor.',
      'Whispering Woods Events hosts one wedding per gate on forty private acres in Harvard, Illinois. The Journal tracks what that feels like week to week, not what a brochure promises.'
    ]
  },
  {
    slug: 'relaxed-timing-no-rush-reception',
    title: 'Relaxed timing: the new luxury is not running late',
    listTitle: 'Relaxed timing as the new luxury',
    hook: 'A schedule with margin feels expensive.',
    dek: 'Planners in 2027 are building buffers for weather, portraits, and conversation instead of packing every minute for optics.',
    tags: ['industry-trends', 'planning', 'weekend'],
    pillar: 'events',
    series: 'industry-trends-2027',
    published: '2026-09-20',
    read_minutes: 3,
    cta_url: utm('relaxed-timing-no-rush-reception'),
    cta_label: 'See weekend flow',
    body_paragraphs: [
      'Guests remember how the day felt, not whether cocktail hour ended at six-oh-two. Estate weekends reward padding: meadow portraits while the sun shifts, a woodland walk between courses, dance floor time without a hard load-out.',
      'On tour, map three slow moments you want protected: first look, golden hour, and a morning-after gathering. If the venue cannot hold them, the day will shrink around someone else’s clock.',
      'A Harvard buyout is built for margin. One celebration, your vendors, midnight on private land when the contract allows. Do more with less noise.'
    ]
  },
  {
    slug: 'micro-guest-lists-estate-intimacy',
    title: 'Smaller guest lists, deeper estate experiences',
    listTitle: 'Smaller lists, deeper weekends',
    hook: 'Intimacy is the trend line.',
    dek: 'Doing more with less often means fewer seats and more time on the land: ponds, barn light, and Chalet hospitality for the people who matter most.',
    tags: ['industry-trends', 'privacy', 'tiktok'],
    pillar: 'events',
    series: 'industry-trends-2027',
    published: '2026-09-19',
    read_minutes: 3,
    cta_url: utm('micro-guest-lists-estate-intimacy'),
    cta_label: 'Walk forty acres',
    body_paragraphs: [
      'Pinterest still shows grand aisles, but many 2026 couples are editing the guest list before they edit the florals. A private estate lets a smaller circle wander without feeling empty.',
      'Use the meadow for ceremony, the woodland for cocktails, the hall for dinner facing the ponds you just married beside. Scale is in the land, not the headcount.',
      'Tour with your real number in mind. Whispering Woods Events is a family-run weekend buyout south of Lake Geneva, not a volume ballroom.'
    ]
  },
  {
    slug: 'unplugged-weekends-no-phones',
    title: 'Unplugged weekends: privacy guests can feel',
    listTitle: 'Unplugged estate weekends',
    hook: 'Privacy is a guest experience, not a contract clause.',
    dek: 'Couples are asking for ceremony pockets without live streams and reception energy without strangers filming from the parking lot.',
    tags: ['industry-trends', 'privacy'],
    pillar: 'events',
    series: 'industry-trends-2027',
    published: '2026-09-19',
    read_minutes: 3,
    cta_url: utm('unplugged-weekends-no-phones'),
    cta_label: 'Plan your weekend',
    body_paragraphs: [
      'When the property is yours from Friday through Sunday, you can set gentle phone boundaries without policing a public park. Guests notice the hush at the gate.',
      'Photographers still capture everything that matters. The difference is background: no tour buses, no overlapping events, no accidental audience in the frame.',
      'Harvard’s forty-acre buyout is designed for that kind of presence. Start on whisperingwoodsevents.com, then read field notes here when the meadows shift.'
    ]
  },
  {
    slug: 'do-more-with-less-estate-weekend',
    title: 'Do more with less: one estate, one weekend',
    listTitle: 'Do more with less on one estate',
    hook: 'One address replaces three venue changes.',
    dek: 'The 2027 weekend model stacks rehearsal, celebration, and farewell on private land instead of shuttles, after-party rentals, and exhausted goodbyes.',
    tags: ['industry-trends', 'weekend', 'venue'],
    pillar: 'events',
    series: 'industry-trends-2027',
    published: '2026-09-18',
    read_minutes: 4,
    cta_url: utm('do-more-with-less-estate-weekend'),
    cta_label: 'Compare the buyout',
    body_paragraphs: [
      'Less can mean fewer décor installs and more time in barn window light, pond reflections, and Chalet fireside moments that already exist on the property.',
      'Compare total weekend cost with shuttle loops, security for a public space, and photo hours that end when the hall flips. Estates often win on simplicity.',
      'Whispering Woods Events bundles tables, chairs, Ready Suites, rain backup in timber and hall, and dance until midnight on private land. Tour first, then decide with your feet.'
    ]
  },
  {
    slug: 'flower-recycle-community-bloom',
    title: 'After the last dance: flowers to neighbors who need bloom',
    listTitle: 'Flowers after the weekend',
    hook: 'Beauty should not end in a dumpster.',
    dek: 'Our green program routes leftover arrangements to nearby retirement and VA communities so celebration on the meadow becomes quiet joy in someone’s window.',
    tags: ['green-program', 'sustainability', 'community'],
    pillar: 'events',
    series: 'green-programs',
    published: '2026-09-20',
    read_minutes: 3,
    cta_url: utm('flower-recycle-community-bloom'),
    cta_label: 'Ask on tour',
    body_paragraphs: [
      'Estate weddings use a lot of stems. When the weekend closes, trained volunteers sort what is still fresh and deliver bundles to partner communities within a short drive of Harvard.',
      'Couples hear the details during planning, not as a surprise invoice. It is part of hosting responsibly on land you will still walk next season.',
      'Whispering Woods Events is building fuller green programming through 2027. The Journal documents what is live today and what is coming online with solar and expanded recycling.'
    ]
  },
  {
    slug: 'food-waste-to-local-farms',
    title: 'From banquet leftovers to local farm soil',
    listTitle: 'Food waste to local farms',
    hook: 'The meal continues off the plate.',
    dek: 'Scraps and safe surplus from catered weekends go to partner farms near McHenry County instead of the landfill.',
    tags: ['green-program', 'sustainability', 'local'],
    pillar: 'events',
    series: 'green-programs',
    published: '2026-09-20',
    read_minutes: 3,
    cta_url: utm('food-waste-to-local-farms'),
    cta_label: 'See green programs',
    body_paragraphs: [
      'Your caterer remains your choice. We provide labeled collection points, cold storage where needed, and a pickup rhythm farms can rely on after Sunday brunch.',
      'This is not performative composting for a photo. It is a practical loop: estate hospitality, honest waste sorting, neighbors who grow food for the region.',
      'Ask your planner to build sort-friendly service ware into the weekend. We will share current farm partners on tour.'
    ]
  },
  {
    slug: 'neighbor-sort-recycling-stations',
    title: 'Sort like a neighbor: recycling stations that actually work',
    listTitle: 'Sort like a neighbor',
    hook: 'Clear bins beat vague “green” signs.',
    dek: 'Weekend buyouts mean more cups, glass, and cardboard. We stage labeled stations so guests recycle without a lecture.',
    tags: ['green-program', 'sustainability'],
    pillar: 'events',
    series: 'green-programs',
    published: '2026-09-19',
    read_minutes: 2,
    cta_url: utm('neighbor-sort-recycling-stations'),
    cta_label: 'Tour the estate',
    body_paragraphs: [
      'Forty acres can host a generous bar and a generous coffee bar. That also means volume. Stations are placed where guests naturally pause: barn entries, hall exits, Chalet patios.',
      'Staff and signage use plain language: glass here, compostables there, landfill last. Vendors get a one-page map during load-in.',
      'Doing more with less waste keeps the meadows the reason you booked. Details evolve; ask what is standard for your wedding season.'
    ]
  },
  {
    slug: 'meadow-bees-wildflower-honey',
    title: 'Meadow bees and wildflower honey on the grounds',
    listTitle: 'Meadow bees and wildflower honey',
    hook: 'The land keeps working after you leave.',
    dek: 'Pollinator-friendly meadow edges and managed hives produce estate honey couples can gift, taste at brunch, or send home as a quiet thank-you.',
    tags: ['green-program', 'nature', 'grounds'],
    pillar: 'events',
    series: 'green-programs',
    published: '2026-09-19',
    read_minutes: 3,
    cta_url: utm('meadow-bees-wildflower-honey'),
    cta_label: 'Walk the meadow',
    body_paragraphs: [
      'Wildflowers are not only backdrop. They feed bees that pollinate the same edges you photographed at golden hour.',
      'Small-batch honey can appear in welcome bags, favor tables, or Sunday farewell coffee. Availability varies by season; we will be honest about what is ready for your date.',
      'This is estate stewardship: private land, visible ecology, a story guests can taste. Seniors on the same property experience it during Luxe days on the meadow.'
    ]
  },
  {
    slug: 'solar-2027-full-green-events',
    title: 'Solar arriving 2027: toward full green events',
    listTitle: 'Solar 2027 · full green events',
    hook: 'The barn roof is part of the plan.',
    dek: 'Photovoltaic install in 2027 will offset hall and Chalet load so celebrations lean harder on Illinois sun, not only Illinois grid.',
    tags: ['green-program', 'sustainability', 'news'],
    pillar: 'events',
    series: 'green-programs',
    published: '2026-09-18',
    read_minutes: 4,
    cta_url: utm('solar-2027-full-green-events'),
    cta_label: 'Follow the build',
    body_paragraphs: [
      'Green events are a sequence: sort waste well today, route flowers and food tomorrow, generate on-site power when the engineering is right for a historic barn and banquet hall.',
      'We are not claiming carbon-neutral overnight. We are publishing the roadmap so couples and planners can align lighting, timing, and vendor choices with what the property will support in 2027.',
      'Until panels are live, meadow shade, natural ventilation, and thoughtful energy use still matter. The Journal will note milestones as install dates firm up.'
    ]
  }
];

const base = JSON.parse(readFileSync(basePath, 'utf8'));
const slugs = new Set(base.map((p) => p.slug));
for (const p of newPosts) {
  if (slugs.has(p.slug)) throw new Error(`duplicate slug: ${p.slug}`);
}
const merged = [...newPosts, ...base];
writeFileSync(outPath, JSON.stringify(merged, null, 2));
const interleave = spawnSync(process.execPath, [join(root, 'scripts/interleave-journal-posts.mjs')], {
  cwd: root,
  encoding: 'utf8',
});
if (interleave.status !== 0) {
  console.error(interleave.stderr || interleave.stdout);
  process.exit(interleave.status || 1);
}
console.log(interleave.stdout);
console.log(`Wrote interleaved ${merged.length} posts → ${outPath}`);
