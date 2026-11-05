# WeWeb — single-scroll estate (your section order)

**Rule:** Nobody scrolls back to the header. **§1–2 fixed.** **§3 season switcher** — everything **from §3 downward** can re-theme (accent, palette, bound images). Switcher stays in scroll history at §3; optional **sticky mini season bar** after user passes §4 (same 4 pills, compact).

**Pricing on site (your call):** **$17,900** flat bundled weekend — state it clean, no apology.

**Companion:** `WEWEB_PREVIEW_GAP_AUDIT.md` (P0 footer/phone)

---

## Scroll map (one column, mobile-first)

| § | Name | Fixed / themed | Job |
|---|------|----------------|-----|
| **1** | Hero | Fixed | 15s loop video — all seasons, drone + intimate, mute `playsinline` |
| **2** | The Feeling | Fixed | Poetry — dream, no sell |
| **3** | Natural Cycles — Seasons | **Switcher here** | Tap changes **§4+** (not hero/feeling) |
| **4** | The Experience | Themed intro line + accent | Everything you need, nothing you don't |
| **5** | The Numbers | Fixed stats (wow wall) | Proof without essay |
| **6** | Venue — beauty every direction | **Gallery binds** | Horizontal scroll both ways; season-unlock pics |
| **7** | Walk the Property | Fixed UI, **season image** on pins optional | Map + tap → blurb + view |
| **8** | The Weekend | Fixed copy, accent bind | Fri / Sat / Sun story |
| **9** | Barn | Themed barn stills + fixed GIF | Bear build + rehearsal / rain |
| **10** | Chalet | Themed chalet stills | Stay · reset · linger |
| **11** | Built Forward *(green)* | Fixed card | Solar + modern stewardship — see below |
| **12** | Investment in a Memory | Fixed | $17,900 flat |
| **13** | The Next Step | Fixed | Private tour — book |
| — | Sticky CTA | After §3 | Book a tour — Thu & Sun PM |

---

## §1 — Hero (fixed)

**Video:** ~15s loop — mix seasons, family, happy, private, luxe; drone + close-up work.

**Overlay (minimal):** *Private weekend estate* · *South of Lake Geneva* · [ Book a tour ]

No stats wall here — save for §5.

---

## §2 — The Feeling (fixed)

> Gate closed.  
> Forty acres open.  
> One weekend — only your people.

> Minutes from Lake Geneva · I-90 & Route 47

---

## §3 — Natural Cycles — Seasons (fixed UI, sets `season`)

**H2:** Natural cycles  

**Line:** The land changes. Your weekend doesn't. **Choose a season** — the estate below answers in that light.

**Pills:** Spring · Summer · Fall · History  

**WeWeb:** `season` variable. On change → rebind §4–10 images/accents (and §6 unlocks). §5, §8 copy, §11–13 stay fixed.

### Season dream lines (bind at §4 opener)

| Season | Line |
|--------|------|
| Spring | *Begin where the woods meet the aisle.* |
| Summer | *Long light on the ponds — the whole weekend ahead.* |
| Fall | *Gold on forty acres, still only yours.* |
| History | *Hand-built ground. Family-held weekends.* |

**Optional:** After scroll past §5, show **sticky slim season bar** (bottom above tour CTA) so they can re-skin without scrolling up.

---

## §4 — The Experience (themed accent + one line)

**H2:** The experience  

**Fixed body:** Everything you need for a **private Fri–Sun estate** — ceremony sites, reception space, on-property stay, room to breathe. Nothing you don't: no shared lawn, no Saturday-only clock, no corporate host.

**Bind:** Season dream line as pull-quote under H2.

---

## §5 — The Numbers (fixed — “wow” wall)

**H2:** The numbers speak  

Design: **big type**, stat grid, 2×3 mobile → 3×2 tablet. No paragraphs.

| Stat | Display | Notes |
|------|---------|--------|
| **5.0** | The Knot rated | Link to listing |
| **63** | Knot reviews | |
| **5×** | Knot Award Winner | Verify “5×” on profile before print |
| **HOF** | Knot Hall of Fame | |
| **4.9** | Google | |
| **40** | Private acres | |
| **1** | Wedding per weekend | |
| **14+** | Years family-owned | |
| **~150** | Guest capacity band | Use your real max — “up to 150 guests” if accurate |
| **2019** | Creative Venue of the Year | Optional tile |

**Events hosted:** Use a **verified** number only. If not audited, use **“Hundreds of weekends hosted”** or mail-backed count — avoid fake odometer.

**Micro under grid:** Bundled estate weekends · Harvard, IL · south of Lake Geneva

---

## §6 — Venue — beauty in every direction (gallery weapon)

**H2:** Beauty in every direction  

**UX:** Horizontal scroll **both ways** (drag, momentum). Feels infinite on mobile.

**Structure:**

- **Lead image** — full width, binds to `season` (hero still).
- **Core set (always visible):** 3 + 5 + 7 = **15** strong images (ponds, aisle, woods, reception light) — same slots, **swap file per season** where you have seasonal captures (9–11 seasonal alternates total is enough).
- **Season unlock (neat):** 2–3 tiles per season **locked** until that season is selected — subtle lock icon → tap season at §3 (or sticky bar) → tiles resolve. Same scroll row; don’t hide the gallery.

**WeWeb:** Conditional visibility on unlock slots: `season === spring` etc.

**No copy block** — caption optional one word per tile (Ponds · Aisle · Chalet).

---

## §7 — Walk the property (interactive map)

**H2:** Walk the property  

**UX:** Simple map graphic (SVG or illustrated aerial). **Tap pins:**

| Pin | Short description | Image |
|-----|-------------------|--------|
| Gate / arrival | Private entry — the world narrows to your weekend. | Drone or drive-in |
| Ponds | Ceremony and portraits on the water. | Bind optional per season |
| Wooded aisle | Vows in the trees. | |
| Grove / lawn | Reception flow and tent space. | |
| Barn | Friday rehearsal · weather backup. | |
| Chalet | Stay Fri–Sat · reset · morning coffee. | |
| Solar | On-site power — real infrastructure. | Fixed or season |

**Interaction:** One panel below map updates (text + image) on pin tap. Mobile: large hit targets.

**Line under map:** *Harvard, IL · ~30 min south of Lake Geneva · I-90 / Route 47*

---

## §8 — The Weekend (fixed story, accent optional)

**H2:** The weekend  

### Friday — Settle in  
Arrive when the property is yours. Unpack the car, claim the chalet, wander the acres while the light softens. **Rehearsal dinner in the barn** when you want a weather-proof start — intimate, on-property, already included in the weekend story.

### Saturday — Celebrate  
Ceremony where you choose — ponds, **wooded aisle**, grove. Reception with the windows open. Bear and family on the ground; you're not chasing a venue manager. Dance, toast, disappear to the ponds.

### Sunday — Linger  
Slow goodbyes. **Morning coffee** on the porch. The property is **yours until 10** — mornings here are too beautiful to hurry. Pack without a stranger rushing you off the lawn.

---

## §9 — Barn (dual slider + copy)

**H2:** The barn  

**Layout:** Split or stacked mobile:

1. **Looping GIF / short video** — Bear working the barn (retro / archival tone if you have it; else current build b-roll).
2. **Auto-scrolling still strip** — barn interior, Friday tables, rain-day ceremony — **images bind per season** where possible.

**Copy:** Hand-built by Bear — not a relocated relic, not the whole brand. Your **rehearsal dinner** home and your **rainy-day savior** when the sky refuses to cooperate. Warm light, timber, everyone in one room before the big day.

---

## §10 — Chalet (themed stills)

**H2:** The chalet  

**Copy:** **Stay · reset · linger.** Yours Friday and Saturday night. Get ready with your people, steal a quiet hour, late-night fireplace, coffee while the ponds and woods wake up. You're not driving to a hotel — you're **still on your weekend**.

**Media:** 3–5 rotating stills/GIFs — morning, fireplace, getting-ready — season bind on exterior/window shots.

---

## §11 — Built Forward (green / modern card)

**Should you add it?** **Yes — one card.** This is the right place to say the estate **gets better every year**: off-season work, solar, and family stewardship — tied to Bear’s craft in §9, not a separate “green” lecture.

**H3:** Built forward  

**Copy (short):** Bear shaped the land by hand. When the last guest leaves, we don’t go dormant — **off-season is for improvement**: paths, ponds, barn details, and the infrastructure the next year’s couples feel but never see. **On-site solar and battery storage** — quieter weekends, real care for forty acres. Family-owned isn’t frozen in time; **it’s better every season**.

**Framing rules:**

| Say | Avoid |
|-----|--------|
| Off-season **stewardship** · **constant improvement** · **better every year** | “Still under construction” · “Pardon our mess” · vague timelines |
| Work happens **between** weddings | Major work during booked weekends (only mention if you have a real policy) |

**Do not** headline “AJ” on the public site — **next generation stewardship** or **family care in the quiet months** is enough.

**Visual:** Solar or winter land-care + one craft detail (timber, path, barn). Soft green border optional.

**Placement:** After Chalet, before price — **craft → quiet-month upgrades → investment**.

---

## §12 — Investment in a memory (fixed)

**H2:** Investment in a memory  

**Price:** **$17,900** — flat-rate bundled weekend estate (full Fri–Sun buyout, one wedding, 40 acres; typical ceremony seating + chalet nights in the bundle — details on tour).

**Tone:** State the number. No “we're sorry” / no “call for pricing” hide. Peak or suite nuances → **private tour**.

**One line:** Deposit holds your date · balance in installments per contract.

**CTA:** Book a tour

---

## §13 — The Next Step (tour close — polished copy)

**H2:** The next step  

**Body:** Come see it — **walk the land**, not a slideshow. Every tour is **private and unhurried**: your date, your questions, an honest pass through the ponds, aisle, barn, and chalet. No pressure script — just the property that’s held **years of sacred weekends** for couples like you.

**Rules (small):** Tours **Thursday & Sunday afternoons**. Sunday after the property is clean (~noon following a wedding weekend). We confirm guest count and fit before you're on the calendar.

**CTA button:** Request your estate tour  

**Form:** Name · email · phone · wedding month/year · guest band · full weekend Y/N

---

## Green card + season switch — how they work together

- **Season** = emotion / fantasy / gallery unlock / barn-chalet exteriors.  
- **Green card** = fixed trust: **off-season improvements**, solar, **better every year** (stewardship, not jobsite).  
- **Numbers wall** = rational wow after experience promise.  
- **Order:** Feel → pick season → experience promise → **stats** → gallery play → map → weekend narrative → barn/chalet proof → **built forward** → price → tour.

---

## Hero video + 30-day media (unchanged priority)

See prior storyboard in git history or shoot list: trailer first, then **summer default** pack, seasonal alternates for §6 unlocks and §9–10 binds.

---

## WeWeb implementation notes

1. Variable `season` at §3 only affects elements **below** §3 in the tree (or use conditional classes on a wrapper `#themed-from-season`).  
2. §6 gallery: horizontal container + momentum scroll; unlock tiles = visibility conditions.  
3. §7 map: click workflow sets `activePin` + swaps image/text panel.  
4. §9: video/GIF element + marquee stills (auto-scroll animation).  
5. Sticky: **Book tour** always; optional **season mini-bar** after §5.  
6. **Do not** duplicate season switcher in header.

---

## One-line flow

*Trailer → poem → pick your season → experience + stats → swipe gallery → map the land → live the weekend → barn + chalet → built forward → $17,900 → walk it.*

That sells feeling, weaponizes pictures/GIFs, and ends on tour — single scroll, no lame return to header.
