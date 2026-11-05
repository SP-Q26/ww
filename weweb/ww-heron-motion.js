/**
 * One-shot heron fly-by when By The Numbers enters view.
 * @ww-head-module heron-motion
 */
(function wwHeronMotion() {
  "use strict";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  function boot() {
    var track =
      document.getElementById("ww-stats-heron-track") ||
      document.querySelector("[data-ww-stats-heron-track]");
    if (!track || track.classList.contains("ww-stats-heron-play")) return;

    var anchor =
      document.getElementById("scroll-numbers") ||
      document.getElementById("numbers-eyebrow") ||
      track;

    if (!("IntersectionObserver" in window)) {
      track.classList.add("ww-stats-heron-play");
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          track.classList.add("ww-stats-heron-play");
          observer.disconnect();
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(anchor);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
