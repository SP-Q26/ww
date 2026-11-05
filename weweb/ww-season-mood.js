/**
 * Whispering Woods — season mood controller
 * @ww-head-module season-mood
 */
(function wwSeasonMood() {
  "use strict";

  var DREAM_LINES = {
    spring: "Begin where the woods meet the aisle.",
    summer: "Long light on the ponds — the whole weekend ahead.",
    autumn: "Gold on forty acres, still only yours.",
  };

  var DEFAULT_OFF =
    "Forty acres of private woods on a 40-acre estate — yours for the weekend.";
  var STORAGE_KEY = "ww-season";

  var WEWEB_TABS = {
    "8b68b655-aefa-4e90-aedd-9da03fa83f04": "spring",
    "71f57801-4f90-4b3e-983a-9b266f6de9a2": "summer",
    "acf6e8c7-9f3a-41c7-b491-7123eded81db": "autumn",
  };

  var PALETTE = {
    spring: { accent: "#8a9a86", deep: "#1a2b22" },
    summer: { accent: "#c49a5a", deep: "#1e2d24" },
    autumn: { accent: "#b86b32", deep: "#241a14" },
  };

  var INLINE_TOKEN_KEYS = [
    "--ww-accent",
    "--ww-section-deep",
    "--ww-gold",
    "--c0c11ce2-c659-4b11-951e-ba8bf27c74cc",
    "--def92927-84a9-422e-bdae-62d522cc2e42",
    "--a5dd128b-549f-4f54-9c83-114918bbf26e",
    "--ebfadec8-ae7f-4d30-adba-4d923a28b531",
    "--e8ac40e2-c651-4e4b-906e-d06029b3f80b",
    "--a05fbde1-3036-4151-9120-5511b7036d6f",
    "--ec680406-f325-4d00-9578-fa1347a85154",
    "--73adb72f-1c0f-4c6a-b07f-e32d10c2587e",
    "--0f9e2011-92e6-4a68-930c-5c958d6fe6f7",
  ];

  var POETRY_UID = "cd1c365d-76ee-4806-824d-ebef5f137aee";
  var SEASON_VAR_ID = "6e7f5084-d32d-4fb7-98bd-1337a99fc5fb";
  var activeSeason = null;

  function root() {
    return document.documentElement;
  }

  function poetryEl() {
    return (
      document.querySelector(".ww-dreamline") ||
      document.querySelector(".ww-element-" + POETRY_UID)
    );
  }

  function paintInlineTokens(season) {
    var el = root();
    if (!season || !PALETTE[season]) {
      INLINE_TOKEN_KEYS.forEach(function (k) {
        el.style.removeProperty(k);
      });
      return;
    }
    var p = PALETTE[season];
    el.style.setProperty("--ww-accent", p.accent);
    el.style.setProperty("--ww-section-deep", p.deep);
    el.style.setProperty("--ww-gold", p.accent);
    el.style.setProperty("--c0c11ce2-c659-4b11-951e-ba8bf27c74cc", p.accent);
    el.style.setProperty("--def92927-84a9-422e-bdae-62d522cc2e42", p.deep);
    el.style.setProperty("--a5dd128b-549f-4f54-9c83-114918bbf26e", p.deep);
    if (season === "spring") {
      el.style.setProperty("--ebfadec8-ae7f-4d30-adba-4d923a28b531", p.accent);
      el.style.setProperty("--e8ac40e2-c651-4e4b-906e-d06029b3f80b", p.deep);
    } else if (season === "summer") {
      el.style.setProperty("--a05fbde1-3036-4151-9120-5511b7036d6f", p.accent);
      el.style.setProperty("--ec680406-f325-4d00-9578-fa1347a85154", p.deep);
    } else if (season === "autumn") {
      el.style.setProperty("--73adb72f-1c0f-4c6a-b07f-e32d10c2587e", p.accent);
      el.style.setProperty("--0f9e2011-92e6-4a68-930c-5c958d6fe6f7", p.deep);
    }
  }

  function applyTokens(season) {
    if (!season || !DREAM_LINES[season]) {
      root().setAttribute("data-season", "");
      document.body && document.body.setAttribute("data-season", "");
      paintInlineTokens("");
      return;
    }
    root().setAttribute("data-season", season);
    document.body && document.body.setAttribute("data-season", season);
    paintInlineTokens(season);
  }

  function readWeWebSeasonVariable() {
    var cfg = window.WW_SITE_CONFIG || {};
    var varId = cfg.active_season_var || SEASON_VAR_ID;
    var saw = false;
    var val;
    try {
      if (typeof wwLib !== "undefined" && wwLib.wwVariable && typeof wwLib.wwVariable.getValue === "function") {
        val = wwLib.wwVariable.getValue(varId);
        saw = true;
      }
    } catch (e) {}
    if (!saw) return undefined;
    if (val === "" || val === null || val === undefined) return "";
    return DREAM_LINES[val] ? val : "";
  }

  function updatePoetry(season, opts) {
    opts = opts || {};
    var el = poetryEl();
    if (!el) return;
    var line = season && DREAM_LINES[season] ? DREAM_LINES[season] : DEFAULT_OFF;
    if (opts.skipDream) {
      el.textContent = line;
      return;
    }
    el.classList.add("is-fading");
    window.setTimeout(function () {
      el.textContent = line;
      el.classList.remove("is-fading");
    }, 180);
  }

  function highlightTabs(season) {
    Object.keys(WEWEB_TABS).forEach(function (uid) {
      var tab = document.querySelector(".ww-element-" + uid);
      if (!tab) return;
      var on = WEWEB_TABS[uid] === season;
      tab.classList.toggle("ww-season-tab--active", on);
      tab.setAttribute("aria-pressed", on ? "true" : "false");
    });
    document.querySelectorAll(".ww-season__pill, .ww-season-sticky button").forEach(function (btn) {
      var on = btn.getAttribute("data-season") === season;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function setSeason(season, opts) {
    opts = opts || {};
    season = season && DREAM_LINES[season] ? season : "";
    if (!opts.force && activeSeason === season) return;
    activeSeason = season;
    applyTokens(season);

    if (!season || !DREAM_LINES[season]) {
      updatePoetry("", opts);
      highlightTabs("");
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      if (!opts.silent) {
        document.dispatchEvent(new CustomEvent("ww:season-change", { detail: { season: "" } }));
      }
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, season);
    } catch (e) {}
    updatePoetry(season, opts);
    highlightTabs(season);
    if (!opts.silent) {
      document.dispatchEvent(new CustomEvent("ww:season-change", { detail: { season: season } }));
    }
  }

  function bindWeWebTabClicks() {
    var html = root();
    if (html.dataset.wwSeasonTabBridge) return;
    html.dataset.wwSeasonTabBridge = "1";
    document.addEventListener(
      "click",
      function (ev) {
        var seasonKey = null;
        Object.keys(WEWEB_TABS).forEach(function (uid) {
          if (ev.target.closest(".ww-element-" + uid)) seasonKey = WEWEB_TABS[uid];
        });
        if (!seasonKey) return;
        var before = activeSeason || html.getAttribute("data-season") || "";
        var toggled = before === seasonKey ? "" : seasonKey;
        window.setTimeout(function () {
          var fromVar = readWeWebSeasonVariable();
          var next;
          if (fromVar === undefined) next = toggled;
          else if (fromVar === before) next = toggled;
          else next = fromVar;
          setSeason(next, { force: true, silent: true });
        }, 80);
      },
      true
    );
  }

  function bindPills() {
    document.querySelectorAll(".ww-season__pill, .ww-season-sticky button").forEach(function (pill) {
      pill.addEventListener("click", function () {
        setSeason(pill.getAttribute("data-season"));
      });
    });
  }

  function bindWeWebTabs() {
    Object.keys(WEWEB_TABS).forEach(function (uid) {
      var tab = document.querySelector(".ww-element-" + uid);
      if (!tab || tab.dataset.wwSeasonBound) return;
      tab.dataset.wwSeasonBound = "1";
      tab.style.cursor = "pointer";
    });
  }

  function watchWeWebSeasonVar() {
    var last = null;
    function tick() {
      var season = readWeWebSeasonVariable();
      if (season === undefined) return;
      if (season === last) return;
      last = season;
      setSeason(season, { silent: true });
    }
    tick();
    window.setInterval(tick, 200);
  }

  function initStickySeasonBar() {
    var bar = document.querySelector(".ww-season-sticky");
    var anchor = document.querySelector("#ww-season-anchor, .ww-season");
    if (!bar || !anchor) return;
    var shown = false;
    function onScroll() {
      var want = anchor.getBoundingClientRect().bottom < -80;
      if (want !== shown) {
        shown = want;
        bar.classList.toggle("is-visible", want);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initTourLinks() {
    document.querySelectorAll('a[href*="calendly.com"]').forEach(function (el) {
      el.removeAttribute("target");
      el.removeAttribute("rel");
    });
  }

  function boot() {
    document.body && document.body.classList.add("ww-site");
    var fromVar = readWeWebSeasonVariable();
    var initial = fromVar !== undefined ? fromVar : "";
    setSeason(initial, { skipDream: true, silent: true, force: true });
    watchWeWebSeasonVar();
    bindWeWebTabClicks();
    bindPills();
    bindWeWebTabs();
    initStickySeasonBar();
    initTourLinks();
    [400, 1200, 2500].forEach(function (ms) {
      window.setTimeout(bindWeWebTabs, ms);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.wwSetSeason = setSeason;
})();
