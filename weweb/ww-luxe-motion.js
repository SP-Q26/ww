/**
 * One-shot scroll reveal — disconnects after each section enters view.
 * @ww-head-module luxe-motion
 */
(function wwLuxeMotion() {
  "use strict";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  function boot() {
    var sections = document.querySelectorAll(".section-base:not(#ww-sticky-nav)");
    if (!sections.length) return;

    sections.forEach(function (section, index) {
      section.style.setProperty("--ww-rise-delay", Math.min(index * 0.035, 0.35) + "s");
      if (index === 0) {
        section.classList.add("ww-in-view");
      }
    });

    if (!("IntersectionObserver" in window)) {
      sections.forEach(function (section) {
        section.classList.add("ww-in-view");
      });
      return;
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
