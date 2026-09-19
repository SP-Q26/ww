# Pattern · brand arrival + cross-dissolve

**Status:** Proven · **First ship:** Whispering Woods Luxe home · **Signed off:** 2026-09-18  
**Codename:** **arrival dissolve** (use this label in briefs and agent prompts)

Portable combo for any premium SPA / WeWeb site where first paint must feel intentional, not like a white flash or a spinner.

## The weapon (stack these together)

| # | Layer | What it does |
|---|--------|----------------|
| 1 | **Fade-through plate** | One brand background on `html` / `body` / `#app` (`theme-color` too) so every phase reads as the same room. |
| 2 | **Branded preloader** | Full-bleed **identity mark** (logo, tree, monogram) + light motion (CSS rings, shimmer) — never a generic loader. |
| 3 | **Shell lock** | Hide the heavy app (`visibility: hidden`) while the SPA still boots; user never sees half-mounted layout. |
| 4 | **Static critical path** | First paint = **predrawn** asset (`<img>` + `preload`) — no SMIL/Lottie/inline SVG animation during framework boot. |
| 5 | **Three-knob timing** | **Hold** after asset ready · **floor** (min ms from start before exit) · **wall** (hard max). Stops flash *and* stall. |
| 6 | **Single ready semaphore** | One DOM flag (e.g. `data-*-ready="1"`) + optional app variable — drives splash hide **and** primary reveal. |
| 7 | **Early-setter guard** | Block the canvas/workflow from flipping ready until critical splash dismisses (`__*Pending` + patched `setAttribute`). |
| 8 | **Cross-dissolve handoff** | Splash/mark **opacity out** while hero/video/content **opacity in** on the **same plate** (~0.35–0.65s). |
| 9 | **Reduced motion** | Short static path (~400ms), no stroke-wait. |
| 10 | **One owner per route** | Either git/critical **or** canvas splash — **never** two overlays + two timers on one URL. |

**Motion vocabulary:** cross-dissolve · fade-through · branded preloader · arrival sequence · hero handoff. Luxe glossary: `docs/luxe/HERO_BRAND_REVEAL.md`.

## Timing recipe (copy numbers, retune per brand)

Luxe preview welcome (reference):

```text
HOLD_MS           ≈ 420   after mark paints (onload)
MIN_BEFORE_FADE   ≈ 780   from splash start (anti-flash on cache)
WALL_MS           ≈ 1600  hard cap
Crossfade CSS     ≈ 0.35s plate · 0.15s mark · 0.65s hero media
```

Canvas hero (WeWeb): min **~1.2s** before `data-ww-hero-video-ready` so the sprout/tree beat registers before dissolve.

## Agent / operator checklist (new project)

1. Pick **one** splash owner for the route (document in README or canon).
2. Define **ready semaphore** name and who may set it (list all writers; delete duplicates).
3. Ship **static** critical asset path first; animate only in canvas or post-hydration.
4. Implement **pending guard** if framework boot races the inject.
5. Wire **cross-dissolve** CSS on both splash and primary layer (shared bg color).
6. Add **hold + floor + wall** in one orchestrator script (no magic single timeout).
7. Smoke: warm cache, cold cache, 4× CPU throttle, `prefers-reduced-motion`.
8. Branch gate: experiment on **preview**; promote inject + canvas together.

## Anti-patterns (learned the hard way)

- Inline SMIL / Lottie in `index.html` during Vue/WeWeb mount → quarter-frames, jank.
- Two splashes (Vercel inject + canvas) → death loop on `data-ww-hero-video-ready`.
- Fade anchored to mount time instead of **asset onload** → flash or dead air.
- Hold without **floor** → cached SVG dismisses instantly.
- Floor without **wall** → stuck on splash if hero boot fails.

## Reference implementation (Luxe)

| Piece | Location |
|-------|----------|
| Critical welcome inject | `scripts/inject-luxe-critical-boot.mjs` |
| Splash canon | `docs/luxe/SPLASH_SKELETON_CANON.md` |
| Canvas hero boot + dissolve | `docs/luxe/canvas/hero-video-boot.js` |
| Vocabulary | `docs/luxe/HERO_BRAND_REVEAL.md` |

## SPQ / multi-shell reuse

Same law on Terminal / Index / Auth: **one preload owner**, lock document shell until lane/stack ready, hard cap, reduced-motion path. See `spq-ops.mdc` funnel pole boot — different surface, **same arrival dissolve semantics**.

---

*When briefing a new build: “Use **arrival dissolve** — fade-through plate, branded preloader, three-knob timing, single ready flag, cross-dissolve into hero.”*
