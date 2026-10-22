/**
 * WW Journal · scrolling wildlife ledger (Companytown whistle-train pattern)
 * Mount: #wwj-wildlife-ledger · data from __WWJ_WILDLIFE_SIGHTINGS__ or JSON URL
 */
(function () {
  if (typeof window === "undefined") return;
  if (window.__wwjWildlifeTrainInit) return;
  window.__wwjWildlifeTrainInit = true;

  var FEED_URL = "/wwj-wildlife-sightings.json";
  var LEDGER_SEL = "#wwj-wildlife-ledger";
  var CHIPS_SEL = "#wwj-wildlife-static-chips";

  function doc() {
    return typeof wwLib !== "undefined" && wwLib.getFrontDocument
      ? wwLib.getFrontDocument()
      : document;
  }

  function buildTrack(items) {
    var track = document.createElement("div");
    track.className = "wwj-wildlife-train__track";
    track.setAttribute("aria-live", "polite");

    function appendRow() {
      for (var i = 0; i < items.length; i++) {
        if (i > 0) {
          var sep = document.createElement("span");
          sep.className = "wwj-wildlife-train__sep";
          sep.setAttribute("aria-hidden", "true");
          sep.textContent = "·";
          track.appendChild(sep);
        }
        var car = document.createElement("div");
        car.className = "wwj-wildlife-train__car";
        var title = document.createElement("span");
        title.className = "wwj-wildlife-train__title";
        title.textContent =
          (items[i].emoji ? items[i].emoji + " " : "") + (items[i].title || "");
        var loc = document.createElement("span");
        loc.className = "wwj-wildlife-train__loc";
        loc.textContent = items[i].location || "";
        car.appendChild(title);
        car.appendChild(loc);
        track.appendChild(car);
      }
    }

    appendRow();
    appendRow();
    return track;
  }

  function mount(ledger, items) {
    if (!items.length || ledger.querySelector(".wwj-wildlife-train")) return;

    var chips = ledger.querySelector(CHIPS_SEL);
    if (chips) chips.setAttribute("data-wwj-wildlife-static-chips", "1");

    var wrap = document.createElement("div");
    wrap.className = "wwj-wildlife-train wwj-wildlife-train--mounted";

    var viewport = document.createElement("div");
    viewport.className = "wwj-wildlife-train__viewport";

    var engine = document.createElement("div");
    engine.className = "wwj-wildlife-train__engine";
    engine.setAttribute("aria-hidden", "true");
    var dot = document.createElement("span");
    dot.className = "wwj-wildlife-train__engine-dot";
    engine.appendChild(dot);
    engine.appendChild(document.createTextNode("Live on forty acres"));

    var trackWrap = document.createElement("div");
    trackWrap.className = "wwj-wildlife-train__track-wrap";
    trackWrap.appendChild(buildTrack(items));

    viewport.appendChild(engine);
    viewport.appendChild(trackWrap);
    wrap.appendChild(viewport);

    if (chips && chips.parentNode) {
      chips.parentNode.insertBefore(wrap, chips);
    } else {
      ledger.appendChild(wrap);
    }
  }

  var FALLBACK = [
    { emoji: "🪶", title: "2 Blue herons", location: "North pond edge" },
    { emoji: "🦢", title: "1 Great white egret", location: "East shallows" },
    { emoji: "🦅", title: "1 Juvenile bald eagle", location: "Dawn tree line" },
    { emoji: "🪶", title: "1 Red-tailed hawk", location: "Meadow thermals" },
    { emoji: "🦊", title: "1 Red fox · 2 kits", location: "Wooded aisle" },
    { emoji: "🦝", title: "2 Possums", location: "Service lane · dusk" },
    { emoji: "🐟", title: "4 Large carp", location: "East shallows" },
    { emoji: "🦃", title: "Juvenile turkeys", location: "Oak leaf line" },
  ];

  function resolveItems(done) {
    fetch(FEED_URL, { credentials: "same-origin" })
      .then(function (res) {
        if (!res.ok) throw new Error("sightings " + res.status);
        return res.json();
      })
      .then(function (items) {
        done(Array.isArray(items) ? items : FALLBACK);
      })
      .catch(function () {
        done(FALLBACK);
      });
  }

  function initLedger(ledger) {
    if (ledger.dataset.wwjWildlifeReady) return;
    ledger.dataset.wwjWildlifeReady = "1";
    resolveItems(function (items) {
      mount(ledger, items);
    });
  }

  function scan() {
    var d = doc();
    var ledgers = d.querySelectorAll(LEDGER_SEL);
    for (var i = 0; i < ledgers.length; i++) initLedger(ledgers[i]);
  }

  var scans = 0;
  function tick() {
    scan();
    scans++;
    if (doc().querySelector(LEDGER_SEL + " .wwj-wildlife-train") || scans > 200) return;
    setTimeout(tick, 80);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tick);
  } else {
    tick();
  }
})();
