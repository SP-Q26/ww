# WeWeb Project Head · v24

**Full paste (entire Head):** `WEWEB_PROJECT_HEAD_V23_FULL.html` (same folder · v24 content · ~3.9k lines)  
**Smoke:** `data-ww-head-version` → `2026.09.14.v24`  
**Audit:** `LUXE_HOME_AUDIT_2026-09-14.md`

**Surgical paste (motion/sticky only):** sections below.

---

# WeWeb Project Head · v23 motion + sticky fix (partial)

**Publish label:** v23  
**Smoke after publish:** `document.documentElement.getAttribute('data-ww-head-version')` → `2026.09.14.v23`  
**Live check:** mobile home shows hero + zones (not green wall); sticky pill ~full width, not 40×40.

## What to do in WeWeb

1. **Project settings → Custom code → Head** (full Project Head — not page head).
2. **Replace** the existing `@ww-head-module luxe-motion` **CSS** block (inside the big `<style>`) with **Block A** below.
3. **Replace** the existing `(function wwLuxeMotion()` **script** with **Block B** below.
4. **Replace** the `data-ww-head-version` line in `wwWeWebBridge` with **Block C** (or find `2026.08.20.11` → `2026.09.14.v23`).
5. **Publish v23** to staging/production.
6. **Delete** temp workflows (canvas only, after smoke green):
   - App: `Luxe reveal + sticky hotfix`
   - Home page: `Luxe reveal hotfix (home onload)`

Do **not** duplicate blocks — remove the old `luxe-motion` CSS rules and old `wwLuxeMotion` IIFE first.

---

## Block A — CSS (`@ww-head-module luxe-motion`)

Paste inside your main Project Head `<style>` where the luxe-motion section lives:

```css
/**
 * Luxe motion — mobile-first, one-pass reveal, drawer slide
 * @ww-head-module luxe-motion
 */

@media (prefers-reduced-motion: no-preference) {
  /* Only hide sections after motion boot arms (avoids blank page if SPA mounts late) */
  html[data-ww-motion-ready] .section-base:not(#ww-sticky-nav):not(.ww-in-view) {
    opacity: 0;
    transform: translateY(14px);
  }

  html[data-ww-motion-ready] .section-base:not(#ww-sticky-nav).ww-in-view {
    opacity: 1;
    transform: translateY(0);
    transition:
      opacity 0.72s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.72s cubic-bezier(0.4, 0, 0.2, 1);
    transition-delay: var(--ww-rise-delay, 0s);
  }

  .section-base:first-of-type {
    opacity: 1 !important;
    transform: none !important;
  }

  /* Sticky nav — mobile max-height: 0 crushed the pill CTA */
  @media (max-width: 767px) {
    .ww-s-dA,
    .ww-s-dA > .ww-section-element,
    #ww-sticky-nav {
      max-height: none !important;
      min-height: 44px !important;
      width: min(28rem, calc(100% - 24px)) !important;
      max-width: min(28rem, calc(100% - 24px)) !important;
    }
  }

  .ww-drawer:not(.is-open),
  .ww-gallery-drawer:not(.is-open),
  #ww-gallery-drawer:not(.is-open) {
    transform: translateX(-50%) translateY(108%) !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }

  .ww-drawer.is-open,
  .ww-gallery-drawer.is-open,
  #ww-gallery-drawer.is-open {
    transform: translateX(-50%) translateY(0) !important;
    visibility: visible !important;
    pointer-events: auto !important;
  }

  .ww-drawer-backdrop {
    opacity: 0;
    transition: opacity 0.32s ease;
  }

  .ww-drawer-backdrop.is-open {
    opacity: 1;
  }

  #ww-sticky-nav.ww-sticky-collapsible {
    transition:
      width 0.38s cubic-bezier(0.4, 0, 0.2, 1),
      max-width 0.38s cubic-bezier(0.4, 0, 0.2, 1),
      height 0.38s cubic-bezier(0.4, 0, 0.2, 1),
      border-radius 0.38s cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 0.35s ease;
  }

  .ww-element-1172c8dd-b0c2-4a44-876c-e3ac4f6755a1,
  .ww-element-f0f7c99a-32d2-414a-af85-812bce22af64 {
    transition:
      transform 0.28s ease,
      border-color var(--ww-transition-mood),
      background-color 0.28s ease,
      box-shadow 0.28s ease;
  }

  .ww-element-1172c8dd-b0c2-4a44-876c-e3ac4f6755a1:active,
  .ww-element-f0f7c99a-32d2-414a-af85-812bce22af64:active {
    transform: scale(0.98);
  }

  html[data-season] .section-base {
    transition:
      background-color var(--ww-transition-mood),
      border-color var(--ww-transition-mood),
      color var(--ww-transition-mood);
  }
}

@media (prefers-reduced-motion: reduce) {
  .section-base,
  .ww-drawer,
  .ww-drawer-backdrop,
  #ww-sticky-nav {
    transition: none !important;
    animation: none !important;
  }
}
```

---

## Block B — JS (`wwLuxeMotion`)

Replace the entire existing `<script>` that contains `(function wwLuxeMotion()`:

```html
<script>
/**
 * One-shot scroll reveal — disconnects after each section enters view.
 * @ww-head-module luxe-motion
 */
(function wwLuxeMotion() {
  "use strict";

  var started = false;

  function revealAll(sections) {
    sections.forEach(function (section, index) {
      section.style.setProperty("--ww-rise-delay", Math.min(index * 0.035, 0.35) + "s");
      section.classList.add("ww-in-view");
    });
  }

  function tryBoot() {
    var sections = document.querySelectorAll(".section-base:not(#ww-sticky-nav)");
    if (!sections.length) return false;
    if (started) return true;
    started = true;
    document.documentElement.setAttribute("data-ww-motion-ready", "1");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealAll(sections);
      return true;
    }

    sections.forEach(function (section, index) {
      section.style.setProperty("--ww-rise-delay", Math.min(index * 0.035, 0.35) + "s");
      if (index === 0) {
        section.classList.add("ww-in-view");
      }
    });

    if (!("IntersectionObserver" in window)) {
      revealAll(sections);
      return true;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("ww-in-view");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );

    sections.forEach(function (section) {
      if (section.classList.contains("ww-in-view")) return;
      observer.observe(section);
    });
    return true;
  }

  function boot() {
    if (tryBoot()) return;
    [120, 600, 1500, 3000, 6000].forEach(function (ms) {
      window.setTimeout(tryBoot, ms);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
</script>
```

---

## Block C — head version stamp

In the `wwWeWebBridge` script at the bottom of Head:

```javascript
document.documentElement.setAttribute("data-ww-head-version", "2026.09.14.v23");
```

(Comment line can read `/* @ww-head-paste v2026.09.14.v23 */`.)

---

## v22 vs v23

If you already published **v22** with only the hotfix workflows but **without** this Head swap, live will still show `2026.08.20.11` and the green-wall bug. **v23 = Head paste above + publish** (workflows optional to remove after).

Git mirror: same blocks in `~/ww/index.html` (not what WeWeb hosts until GitHub publish).
