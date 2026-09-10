# Paste to WeWeb AI · Remove all em dashes (Home page)

Ping first. Project `1b8147da-2812-42a5-946e-f83c582d3071` · Home `991a8992-afed-4eaf-b77e-13a81380ad12`.

**Task:** Find every `ww-text`, FAQ answer, modal label, SEO field, and metadata string on this page that contains an **em dash** (Unicode U+2014). Replace per rules below. **Do not change prices, UIDs, workflows, or TOS gate.**

**Replacement rules:** Use ` · ` for parallel phrases, `:` for label/explanation, `.` or `,` for sentence breaks. **No U+2014 characters left on the page.** En-dash ranges like `5–7 min` and `6–8 weeks` are OK.

**Do not touch:** `wf_booking_form_submit` · deposit non-refundable wording · no outbound links.

---

## Global search

1. `getPageSemantic` on Home.
2. For each text element, if `content.default.text.en` (or bound copy) contains U+2014, edit it.
3. Re-run mental grep: Hero, Experience, Backdrops, Chalet/Pricing, Itinerary, FAQ (all 10), Disqualifier, Trust row, Booking modal (labels only), page SEO.

---

## Known strings (paste these if they still have em dashes)

### Hero subhead (`83f33f04…` area)

```
Private estate senior portraits on the same grounds as a top Illinois wedding venue. Woods, ponds, and reflection shots portrait photographers travel for. Reserved for seniors, one day only, 24 spots.
```

### Experience sub + team line

**Section sub (add or fix):**
```
This is not a strip-mall studio hour. It's a wedding-grade estate production. Seniors rule the grounds for one day.
```

**Team line (`c1decbbc…` section):**
```
Award-winning portrait photographer. Retouch team led by a Colorado best-in-state yearbook editor · Fairview High, Boulder, CO.
```

### Backdrops

**Headline** `f9d7957f…`:
```
10+ Editorial Zones. One Private Estate.
```

**Subtitle** `a981066c…`:
```
Portrait photographers chase locations like this. You get them private: meadow, willows, wooded aisles, three ponds, barns, walled gardens, stone paths, iron fences, specimen trees, and more across 40 acres. A few favorites below; your photographer curates the day.
```

**Optional chip** (under grid):
```
+ wooded aisles · stone walls · iron fences · gardens · golf-cart paths · and dozens more
```

### Chalet + keepsakes

**Chalet desc** `6676ca3f…`:
```
The heirloom pre-order bundle: three keepsakes, one estate team. 10×10 handcrafted flush-mount leather album (15 layflat spreads, semi-matte photographic paper) · extended private gallery with full-res downloads and print release · 20×24 archival framed wall print, ready to hang. Published market retail $1,775 à la carte · $1,420 when you pre-order at booking ($355 thank-you for ordering early). One shop from estate day to heirloom. Not sold on estate day.
```

**Upsell footer** `e3b9b523…`:
```
Keepsakes at published market retail. Chalet Collection pre-order $1,420 ($355 thank-you off $1,775). Our only advertised courtesy. Estate day: à la carte only, no bundle.
```

**Digital upgrade** `6e49796e…`:
```
Extended private gallery · full-res downloads · print release
```

### Itinerary

**Subtitle** `126b922e…`:
```
Per-senior timing below. Full experience-day flow finalized with photographer partners after crew lock-in. Sample blocks only. Chalet lounge for moms throughout the day.
```

**Step 3 desc** `a54ff6e5…` (if em dash in "between looks"):
```
Between looks · built into your session, not rushed.
```

**Inclusion #9** `bf6bf421…`:
```
Mom Milestone: ~15 min at a curated estate setting, included. Same portrait team · retouch led by our Boulder best-in-state yearbook editor.
```

### FAQ

**A7** `03e63424…`:
```
No. Chalet Collection is pre-order only, at booking or before balance is due (10 days prior). $1,420 ($1,775 retail minus $355 early thank-you). Album is fulfilled through our heirloom pro lab; framed wall art is produced separately at archival standard. Estate day: keepsakes à la carte at full retail, no bundle.
```

**A9** (friend booking):
```
Yes. Each senior reserves their own estate spot ($1,420 · $710 non-refundable deposit). Friends often book the same experience week. Every senior needs their own booking and time block.
```

**A10** (what's included): keep em-dash-free; keepsakes sentence ends with "optional pre-order add-ons, not required at booking."

**Studio FAQ** (if present): use "Harvard, IL" + comma, not em dash before "the same 40-acre estate."

### Disqualifier (optional luxe line)

```
Published estate pricing. Chalet pre-order $1,420 ($355 thank-you off $1,775 retail). Our only courtesy. Luxury estate experience; bargain shoppers will be happier elsewhere.
```

### Booking modal · week TBD

**Preferred week label** `cc1a1c45…`:
```
Experience week: dates announced after photographer confirmation
```

### SEO (`updatePage` · all required fields)

**title.en:**
```
Private Estate Senior Portraits | Whispering Woods Luxe · Harvard, IL · 24 Spots
```

**metadata.description.en:**
```
Private estate senior portraits on 40-acre Harvard grounds, same wedding-venue property as Whispering Woods Events. Not a studio. $1,420 all-inclusive · 24 spots · $710 non-refundable deposit. Barrington, Hinsdale, Naperville, Geneva, North Shore.
```

**openGraphDescription.en:**
```
Forty private acres. Wedding-grade estate production. Not a studio. 24 spots · $710 deposit.
```

**JSON-LD Event description:** estate positioning, no em dashes, **no startDate** until weeks are announced.

---

## Verify

- Search page semantic / preview for U+2014 (zero hits).
- Prices: $1,420 base · $710 deposit · Chalet $1,420 / ~~$1,775~~ · keepsakes $955 / $395 / $425 / $195 · $355 thank-you.
- 10 FAQ items · modal week TBD · favicon if asset ready.

Thanks.
