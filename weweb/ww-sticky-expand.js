/**
 * Whispering Woods — minimal expandable sticky bar
 * Collapsed: 40px fab · Expanded: Tour · Contact · FAQ
 * Production DOM uses ww-element UIDs (no [name=] attrs).
 */
(function wwStickyExpand() {
  "use strict";

  var NAV_ID = "ww-sticky-nav";
  var TOUR_UID = "7ffe9c6e-0ff6-44fd-bdd5-d18c2157d6b0";
  var CONTACT_UID = "b8c1d4b4-33b7-4f7e-a751-2c21c7e5ef4d";
  var FAQ_UID = "c315d18a-974c-4c85-b34a-d972c7aecbcb";
  var expanded = false;
  var ready = false;

  function nav() {
    return document.getElementById(NAV_ID);
  }

  function navItem(selector) {
    var el = nav();
    return el ? el.querySelector(selector) : null;
  }

  function ensureFab() {
    var el = nav();
    if (!el || el.querySelector(".ww-sticky-fab")) return false;

    var fab = document.createElement("button");
    fab.type = "button";
    fab.className = "ww-sticky-fab";
    fab.setAttribute("aria-label", "Open menu");
    fab.setAttribute("aria-expanded", "false");
    fab.innerHTML = '<span class="ww-sticky-fab__icon" aria-hidden="true">◎</span>';
    fab.addEventListener("click", function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      toggle();
    });
    el.insertBefore(fab, el.firstChild);
    el.classList.add("ww-sticky-collapsible");
    return true;
  }

  function setExpanded(on) {
    var el = nav();
    if (!el) return;
    expanded = on;
    el.classList.toggle("is-expanded", on);
    var fab = el.querySelector(".ww-sticky-fab");
    if (fab) {
      fab.setAttribute("aria-expanded", on ? "true" : "false");
      fab.setAttribute("aria-label", on ? "Close menu" : "Open menu");
    }
    document.body.classList.toggle("ww-sticky-expanded", on);
  }

  function toggle() {
    setExpanded(!expanded);
  }

  function collapse() {
    if (expanded) setExpanded(false);
  }

  function bindItems() {
    var el = nav();
    if (!el) return;

    var selectors =
      '[name="Nav Tour Button"], [name="Nav Contact Button"], [name="Nav FAQ Button"], ' +
      ".ww-element-" +
      TOUR_UID +
      ", .ww-element-" +
      CONTACT_UID +
      ", .ww-element-" +
      FAQ_UID;

    el.querySelectorAll(selectors).forEach(function (btn) {
      if (btn.dataset.wwStickyBound) return;
      btn.dataset.wwStickyBound = "1";
      btn.addEventListener("click", function () {
        window.setTimeout(collapse, 120);
      });
    });

    if (!document.documentElement.dataset.wwStickyOutsideBound) {
      document.documentElement.dataset.wwStickyOutsideBound = "1";
      document.addEventListener("click", function (ev) {
        if (!expanded) return;
        if (!el.contains(ev.target)) collapse();
      });
      document.addEventListener("keydown", function (ev) {
        if (ev.key === "Escape") collapse();
      });
    }
  }

  function tryBoot() {
    if (ready) return true;
    if (!nav()) return false;
    ensureFab();
    bindItems();
    setExpanded(false);
    ready = true;
    return true;
  }

  function boot() {
    if (tryBoot()) return;
    [120, 600, 1500, 3000].forEach(function (ms) {
      window.setTimeout(tryBoot, ms);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  window.wwStickyToggle = toggle;
  window.wwStickyCollapse = collapse;
})();
