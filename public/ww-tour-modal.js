/**
 * Whispering Woods Events · Calendly tour drawer
 * Mobile: bottom sheet · Desktop: right sheet
 */
(function wwTourModal() {
  "use strict";

  var cfg = window.WW_SITE_CONFIG || {};
  var BASE =
    cfg.tour_booking_url ||
    "https://calendly.com/whisperingwoodsinfo/private-venue-tour";
  var EMBED =
    BASE +
    (BASE.indexOf("?") === -1 ? "?" : "&") +
    "hide_gdpr_banner=1&background_color=141f19&text_color=f9f6f0&primary_color=c49a5a";

  var root;
  var lastFocus;

  function build() {
    if (root) return root;

    root = document.createElement("div");
    root.className = "ww-tour-root";
    root.id = "ww-tour-modal";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-labelledby", "ww-tour-title");
    root.hidden = true;

    root.innerHTML =
      '<div class="ww-tour-backdrop" data-ww-tour-close tabindex="-1"></div>' +
      '<div class="ww-tour-sheet">' +
      '  <div class="ww-tour-sheet-grab" aria-hidden="true"></div>' +
      '  <button type="button" class="ww-tour-close" data-ww-tour-close aria-label="Close tour booking">×</button>' +
      '  <header class="ww-tour-header">' +
      '    <p class="ww-tour-eyebrow">Whispering Woods Events</p>' +
      '    <h2 class="ww-tour-title" id="ww-tour-title">Private grounds tour</h2>' +
      '    <p class="ww-tour-dek">Forty acres · by appointment · Harvard, Illinois</p>' +
      '    <div class="ww-tour-hairline" aria-hidden="true"></div>' +
      "  </header>" +
      '  <div class="ww-tour-tz">' +
      "    <p>When you pick a time, confirm the slot shows <strong>Central Time (Chicago)</strong> under your selection.</p>" +
      '    <p class="ww-tour-tz-sub">America/Chicago · CST/CDT</p>' +
      "  </div>" +
      '  <div class="ww-tour-frame-wrap">' +
      '    <div class="ww-tour-badge" aria-hidden="true"><span class="ww-tour-badge-dot"></span> Central</div>' +
      '    <div class="ww-tour-frame">' +
      '      <iframe title="Book a private venue tour" src="" data-ww-tour-iframe loading="lazy"></iframe>' +
      "    </div>" +
      "  </div>" +
      '  <footer class="ww-tour-footer">' +
      "    <span>Est. 2012</span>" +
      "    <span>Tour the grounds</span>" +
      "  </footer>" +
      "</div>";

    document.body.appendChild(root);

    root.addEventListener("click", function (ev) {
      if (ev.target.closest("[data-ww-tour-close]")) close();
    });

    document.addEventListener("keydown", function (ev) {
      if (!root || !root.classList.contains("is-open")) return;
      if (ev.key === "Escape") {
        close();
        return;
      }
      if (ev.key !== "Tab") return;
      var focusable = root.querySelectorAll(
        'button, [href], iframe, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      var list = Array.prototype.slice.call(focusable);
      var first = list[0];
      var last = list[list.length - 1];
      if (ev.shiftKey && document.activeElement === first) {
        ev.preventDefault();
        last.focus();
      } else if (!ev.shiftKey && document.activeElement === last) {
        ev.preventDefault();
        first.focus();
      }
    });

    return root;
  }

  function wireIframe(iframe) {
    if (!iframe || iframe.dataset.wwTourWired) return;
    iframe.dataset.wwTourWired = "1";
    var frame = iframe.closest(".ww-tour-frame");
    if (frame) frame.classList.add("is-loading");
    iframe.addEventListener("load", function () {
      iframe.classList.add("is-loaded");
      if (frame) frame.classList.remove("is-loading");
    });
  }

  function open() {
    var el = build();
    var iframe = el.querySelector("[data-ww-tour-iframe]");
    wireIframe(iframe);
    if (iframe && !iframe.getAttribute("src")) iframe.setAttribute("src", EMBED);

    lastFocus = document.activeElement;
    el.hidden = false;
    requestAnimationFrame(function () {
      el.classList.add("is-open");
    });
    document.documentElement.classList.add("ww-tour-open");
    document.body.style.overflow = "hidden";
    var closeBtn = el.querySelector(".ww-tour-close");
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    if (!root) return;
    root.classList.remove("is-open");
    document.documentElement.classList.remove("ww-tour-open");
    document.body.style.overflow = "";
    window.setTimeout(function () {
      if (!root.classList.contains("is-open")) root.hidden = true;
    }, 400);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  window.wwOpenTourModal = open;
  window.wwCloseTourModal = close;
})();
