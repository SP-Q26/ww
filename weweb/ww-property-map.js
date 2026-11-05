/**
 * Whispering Woods — Walk the Property (map + hotspot cards)
 * WeWeb: PRELOAD custom code, or script tag after ww-season-mood.js
 * Container: [data-ww-property-map] with optional data-hotspots-url
 */
(function wwPropertyMap() {
  "use strict";

  var DEFAULT_JSON = "../data/property_hotspots.json";

  function el(tag, cls, html) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (html != null) node.innerHTML = html;
    return node;
  }

  function mediaSrc(hotspot, season) {
    if (hotspot.season_media && season && hotspot.season_media[season]) {
      return hotspot.season_media[season];
    }
    return hotspot.media && hotspot.media.src;
  }

  function PropertyMap(root, data) {
    this.root = root;
    this.data = data;
    this.activeId = data.default_hotspot || (data.hotspots[0] && data.hotspots[0].id);
    this.mapEl = root.querySelector(".ww-property__map");
    this.chipsEl = root.querySelector(".ww-property__chips");
    this.cardEl = root.querySelector(".ww-property__card");
    this.geoEl = root.querySelector(".ww-property__geo");
    this.render();
    this.bindSeason();
  }

  PropertyMap.prototype.render = function () {
    var self = this;
    var d = this.data;

    if (this.geoEl && d.geo_line) this.geoEl.textContent = d.geo_line;

    this.renderMap();
    this.renderChips();
    this.setActive(this.activeId, true);
  };

  PropertyMap.prototype.renderMap = function () {
    var self = this;
    var d = this.data;
    var map = d.map || {};
    var vb = map.viewBox || "0 0 400 520";

    this.mapEl.innerHTML = "";
    this.mapEl.setAttribute("role", "group");
    this.mapEl.setAttribute("aria-label", "Property map");

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", vb);
    svg.setAttribute("class", "ww-property__svg");
    svg.setAttribute("aria-hidden", "true");

    var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML =
      '<linearGradient id="ww-map-sky" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#e8efe6"/>' +
      '<stop offset="100%" stop-color="#d4ddd0"/>' +
      "</linearGradient>";
    svg.appendChild(defs);

    var bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bg.setAttribute("width", "400");
    bg.setAttribute("height", "520");
    bg.setAttribute("fill", "url(#ww-map-sky)");
    svg.appendChild(bg);

    var land = document.createElementNS("http://www.w3.org/2000/svg", "path");
    land.setAttribute(
      "d",
      "M40 480 Q80 420 120 440 T200 400 T280 420 T360 460 L380 520 L20 520 Z M60 200 Q140 120 200 140 T340 180 T360 320 Q300 380 200 360 Q100 340 60 280 Z"
    );
    land.setAttribute("fill", "#8a9a86");
    land.setAttribute("opacity", "0.35");
    svg.appendChild(land);

    [
      { cx: 248, cy: 300, rx: 36, ry: 22 },
      { cx: 180, cy: 260, rx: 28, ry: 18 },
      { cx: 300, cy: 250, rx: 24, ry: 16 },
    ].forEach(function (p) {
      var pond = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
      pond.setAttribute("cx", String(p.cx));
      pond.setAttribute("cy", String(p.cy));
      pond.setAttribute("rx", String(p.rx));
      pond.setAttribute("ry", String(p.ry));
      pond.setAttribute("fill", "#6b8f9a");
      pond.setAttribute("opacity", "0.55");
      svg.appendChild(pond);
    });

    var trees = document.createElementNS("http://www.w3.org/2000/svg", "g");
    trees.setAttribute("fill", "#1e2d24");
    trees.setAttribute("opacity", "0.2");
    for (var i = 0; i < 18; i++) {
      var t = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      t.setAttribute("cx", String(50 + (i % 6) * 55 + (i % 3) * 8));
      t.setAttribute("cy", String(80 + Math.floor(i / 6) * 45));
      t.setAttribute("r", String(8 + (i % 4) * 3));
      trees.appendChild(t);
    }
    svg.appendChild(trees);

    if (map.base_image) {
      var img = document.createElementNS("http://www.w3.org/2000/svg", "image");
      img.setAttribute("href", map.base_image);
      img.setAttribute("width", "400");
      img.setAttribute("height", "520");
      img.setAttribute("preserveAspectRatio", "xMidYMid slice");
      img.setAttribute("opacity", "0.92");
      svg.insertBefore(img, svg.firstChild.nextSibling);
    }

    this.mapEl.appendChild(svg);

    d.hotspots.forEach(function (h) {
      var pin = el("button", "ww-property__pin");
      pin.type = "button";
      pin.dataset.hotspotId = h.id;
      pin.style.left = h.pin.x + "%";
      pin.style.top = h.pin.y + "%";
      pin.setAttribute("aria-label", h.label + ": " + h.title);
      pin.innerHTML =
        '<span class="ww-property__pin-dot" aria-hidden="true"></span>' +
        '<span class="ww-property__pin-label">' +
        h.label +
        "</span>";
      pin.addEventListener("click", function () {
        self.setActive(h.id);
      });
      self.mapEl.appendChild(pin);
    });
  };

  PropertyMap.prototype.renderChips = function () {
    var self = this;
    this.chipsEl.innerHTML = "";
    this.chipsEl.setAttribute("role", "tablist");
    this.chipsEl.setAttribute("aria-label", "Property landmarks");

    this.data.hotspots.forEach(function (h) {
      var chip = el("button", "ww-property__chip");
      chip.type = "button";
      chip.dataset.hotspotId = h.id;
      chip.setAttribute("role", "tab");
      chip.textContent = h.label;
      chip.addEventListener("click", function () {
        self.setActive(h.id);
      });
      self.chipsEl.appendChild(chip);
    });
  };

  PropertyMap.prototype.setActive = function (id, skipScroll) {
    var h = this.data.hotspots.find(function (x) {
      return x.id === id;
    });
    if (!h) return;

    this.activeId = id;

    this.root.querySelectorAll(".ww-property__pin").forEach(function (p) {
      var on = p.dataset.hotspotId === id;
      p.classList.toggle("is-active", on);
      p.setAttribute("aria-pressed", on ? "true" : "false");
    });

    this.root.querySelectorAll(".ww-property__chip").forEach(function (c) {
      var on = c.dataset.hotspotId === id;
      c.classList.toggle("is-active", on);
      c.setAttribute("aria-selected", on ? "true" : "false");
    });

    this.renderCard(h);

    if (!skipScroll && window.matchMedia("(max-width: 767px)").matches) {
      var card = this.cardEl;
      if (card) card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  PropertyMap.prototype.renderCard = function (h) {
    var season =
      document.documentElement.getAttribute("data-season") ||
      document.body.getAttribute("data-season") ||
      "summer";
    var src = mediaSrc(h, season);
    var m = h.media || {};
    var type = m.type || "image";

    var mediaHtml = "";
    if (src) {
      if (type === "gif") {
        mediaHtml =
          '<img class="ww-property__card-media" src="' +
          src +
          '" alt="' +
          (m.alt || h.title) +
          '" loading="lazy" />';
      } else {
        mediaHtml =
          '<img class="ww-property__card-media" src="' +
          src +
          '" alt="' +
          (m.alt || h.title) +
          '" loading="lazy" onerror="this.classList.add(\'is-missing\')" />';
      }
    } else {
      mediaHtml =
        '<div class="ww-property__card-placeholder" aria-hidden="true"><span>' +
        h.label +
        "</span></div>";
    }

    this.cardEl.innerHTML =
      '<article class="ww-property__card-inner">' +
      '<div class="ww-property__card-visual">' +
      mediaHtml +
      "</div>" +
      '<div class="ww-property__card-body">' +
      '<p class="ww-kicker">' +
      h.label +
      "</p>" +
      "<h3 class=\"ww-display\" style=\"font-size:1.65rem;margin:0 0 0.35rem\">" +
      h.title +
      "</h3>" +
      '<p class="ww-property__fact">' +
      h.fact +
      "</p>" +
      "<p>" +
      h.body +
      "</p>" +
      "</div></article>";

    this.cardEl.setAttribute("aria-live", "polite");
  };

  PropertyMap.prototype.bindSeason = function () {
    var self = this;
    document.addEventListener("ww:season-change", function (e) {
      var h = self.data.hotspots.find(function (x) {
        return x.id === self.activeId;
      });
      if (h) self.renderCard(h);
    });
  };

  function boot() {
    var root = document.querySelector("[data-ww-property-map]");
    if (!root) return;

    var url = root.getAttribute("data-hotspots-url") || DEFAULT_JSON;

    fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error("hotspots fetch failed");
        return r.json();
      })
      .then(function (data) {
        window.wwPropertyMap = new PropertyMap(root, data);
      })
      .catch(function (err) {
        console.warn("[ww-property-map]", err);
        root.classList.add("ww-property--error");
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
