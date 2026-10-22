/**
 * WW Journal · tour Calendly drawer (same modal as WWE) + estate tour link intercept
 */
(function wwJournalBridge() {
  "use strict";

  var cfg = window.WW_SITE_CONFIG || {};
  var TOUR_URL =
    cfg.tour_booking_url ||
    "https://calendly.com/whisperingwoodsinfo/private-venue-tour";
  var TOUR_RE =
    /tour grounds|schedule estate tour|book.*tour|grounds tour|private.*tour/i;

  function openTour() {
    if (typeof window.wwOpenTourModal === "function") {
      window.wwOpenTourModal();
      return;
    }
    try {
      window.dispatchEvent(new CustomEvent("ww:open-tour-request"));
    } catch (e) {}
    var tries = 0;
    (function retry() {
      tries += 1;
      if (typeof window.wwOpenTourModal === "function") {
        window.wwOpenTourModal();
        return;
      }
      if (tries < 20) window.setTimeout(retry, 120);
    })();
  }

  function isTourControl(el) {
    if (!el) return false;
    if (el.closest("[data-ww-tour]")) return true;
    var text = (el.textContent || "").trim();
    if (TOUR_RE.test(text)) return true;
    var href = (el.getAttribute("href") || "").toLowerCase();
    return (
      href.indexOf("calendly.com") !== -1 ||
      href.indexOf("calendar.app.google") !== -1
    );
  }

  function wireTourDelegation() {
    if (document.documentElement.dataset.wwJournalTourDelegated) return;
    document.documentElement.dataset.wwJournalTourDelegated = "1";

    document.addEventListener(
      "click",
      function (ev) {
        var el = ev.target.closest("a, button");
        if (!el || !isTourControl(el)) return;
        ev.preventDefault();
        ev.stopPropagation();
        openTour();
      },
      true
    );

    document.querySelectorAll("[data-ww-tour]").forEach(function (node) {
      node.setAttribute("href", "#tour");
      node.removeAttribute("target");
    });
  }

  function boot() {
    wireTourDelegation();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
