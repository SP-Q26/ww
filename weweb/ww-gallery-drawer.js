/**
 * Whispering Woods — one gallery library, two displays
 * @ww-head-module gallery-drawer
 */
(function wwGalleryDrawer() {
  "use strict";

  var GALLERY_VAR = "f7cfb366-eba3-4fc9-b3ff-5b67d379c7f1";
  var VENUE_SECTION_UID = "49446105-625e-4277-a7f7-d8f600112d2a";
  var GALLERY_BTN_UID = "bf83eccd-ea4a-4921-8045-b37bff010d1c";
  var DRAWER_ID = "ww-gallery-drawer";
  var BACKDROP_ID = "ww-gallery-backdrop";
  var open = false;
  var seen = Object.create(null);

  function normalizeItem(item) {
    if (!item) return null;
    if (typeof item === "string") return { url: item, alt: "Whispering Woods venue" };
    var url = item.url || item.src || item.image || item.path;
    if (!url || url.indexOf("no_image") !== -1) return null;
    return { url: url, alt: item.alt || item.title || "Whispering Woods venue" };
  }

  function pushImage(list, candidate) {
    var item = normalizeItem(candidate);
    if (!item || seen[item.url]) return;
    seen[item.url] = true;
    list.push(item);
  }

  function fromVariable() {
    if (typeof wwLib === "undefined" || !wwLib.wwVariable) return [];
    var list = [];
    try {
      var raw = wwLib.wwVariable.getValue(GALLERY_VAR);
      if (Array.isArray(raw)) {
        raw.forEach(function (item) {
          pushImage(list, item);
        });
      } else if (raw && typeof raw === "object") {
        if (Array.isArray(raw.items)) raw.items.forEach(function (item) { pushImage(list, item); });
        else if (Array.isArray(raw.data)) raw.data.forEach(function (item) { pushImage(list, item); });
        else Object.keys(raw).forEach(function (key) {
          pushImage(list, raw[key]);
        });
      }
    } catch (e) {}
    return list;
  }

  function fromDom() {
    var list = [];
    var inner = document.querySelector(".ww-element-" + VENUE_SECTION_UID);
    var section = inner ? inner.closest(".section-base") : null;
    var roots = [
      section,
      inner,
      document.querySelector('[name="Gallery Slider"]'),
    ].filter(Boolean);

    if (!roots.length) roots = [document.body];

    roots.forEach(function (root) {
      root.querySelectorAll("img").forEach(function (img) {
        var src = img.currentSrc || img.src;
        if (!src || src.indexOf("200w.gif") !== -1 || src.indexOf("no_image") !== -1) return;
        if (img.naturalWidth === 1 && img.naturalHeight === 1) return;
        pushImage(list, { url: src, alt: img.alt });
      });
    });

    return list;
  }

  function getImages() {
    seen = Object.create(null);
    var fromVar = fromVariable();
    if (fromVar.length) return fromVar;
    return fromDom();
  }

  function ensureShell() {
    if (document.getElementById(DRAWER_ID)) return;

    var backdrop = document.createElement("div");
    backdrop.id = BACKDROP_ID;
    backdrop.className = "ww-drawer-backdrop";
    backdrop.setAttribute("aria-hidden", "true");
    backdrop.addEventListener("click", closeDrawer);

    var drawer = document.createElement("aside");
    drawer.id = DRAWER_ID;
    drawer.className = "ww-drawer ww-gallery-drawer";
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-modal", "true");
    drawer.setAttribute("aria-label", "Full gallery");
    drawer.innerHTML =
      '<div class="ww-drawer__head">' +
      '<h2 class="ww-drawer__title">The Grounds</h2>' +
      '<button type="button" class="ww-drawer__close" aria-label="Close gallery">×</button>' +
      "</div>" +
      '<p class="ww-gallery-drawer__lede">Forty acres — ceremony, ponds, woods, and light.</p>' +
      '<div class="ww-gallery-drawer__scroll" data-ww-gallery-scroll></div>';

    drawer.querySelector(".ww-drawer__close").addEventListener("click", closeDrawer);
    document.body.appendChild(backdrop);
    document.body.appendChild(drawer);
  }

  function renderImages() {
    var scroll = document.querySelector("[data-ww-gallery-scroll]");
    if (!scroll) return;

    var images = getImages();
    if (!images.length) {
      scroll.innerHTML =
        '<p class="ww-gallery-drawer__empty">Photos are loading — scroll the gallery above or refresh.</p>';
      return;
    }

    scroll.innerHTML = images
      .map(function (item, i) {
        return (
          '<figure class="ww-gallery-drawer__frame">' +
          '<img src="' +
          item.url +
          '" alt="' +
          (item.alt || "").replace(/"/g, "&quot;") +
          '" loading="' +
          (i < 3 ? "eager" : "lazy") +
          '" decoding="async" />' +
          "</figure>"
        );
      })
      .join("");
  }

  function openDrawer() {
    ensureShell();
    renderImages();
    open = true;
    document.getElementById(BACKDROP_ID).classList.add("is-open");
    document.getElementById(DRAWER_ID).classList.add("is-open");
    document.body.classList.add("ww-drawer-open");
    var closeBtn = document.getElementById(DRAWER_ID).querySelector(".ww-drawer__close");
    if (closeBtn) closeBtn.focus();
  }

  function closeDrawer() {
    if (!open) return;
    open = false;
    var backdrop = document.getElementById(BACKDROP_ID);
    var drawer = document.getElementById(DRAWER_ID);
    if (backdrop) backdrop.classList.remove("is-open");
    if (drawer) drawer.classList.remove("is-open");
    document.body.classList.remove("ww-drawer-open");
  }

  function isGalleryTrigger(el) {
    if (!el) return false;
    if (el.closest('[data-ww-gallery-open], [name="View Full Gallery Button"]')) return true;
    if (el.closest(".ww-element-" + GALLERY_BTN_UID)) return true;
    var btn = el.closest("button, a");
    if (btn && /view full gallery/i.test(btn.textContent || "")) return true;
    return false;
  }

  function bindTriggers() {
    document.addEventListener(
      "click",
      function (ev) {
        if (isGalleryTrigger(ev.target)) {
          ev.preventDefault();
          ev.stopPropagation();
          ev.stopImmediatePropagation();
          openDrawer();
          return;
        }

        var slide = ev.target.closest(
          '[name="Gallery Slider"], [name*="Gallery Slide Photo"], .ww-element-' + VENUE_SECTION_UID + ' img'
        );
        if (slide && !ev.target.closest("[class*='navigation'], [class*='pagination'], button")) {
          ev.preventDefault();
          openDrawer();
        }
      },
      true
    );

    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") closeDrawer();
    });
  }

  function boot() {
    bindTriggers();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.wwOpenGalleryDrawer = openDrawer;
  window.wwCloseGalleryDrawer = closeDrawer;
})();
