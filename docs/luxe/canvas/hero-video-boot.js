/**
 * Home · Hero video boot (canvas page workflow — custom-js)
 * Crop YouTube chrome, gate reveal until playing, set heroVideoReady for splash.
 * Git mirror of WeWeb workflow; paste via MCP createFrontendWorkflow.
 */
(function () {
  var HERO_VIDEO_UID = "63c3ad17-1c03-49e0-b69c-be61ce0028ee";
  var HERO_WRAP_UID = "0189df0a-5823-4836-a68e-b222ed3a47d6";
  var HERO_URL_VAR = "f7f3e84f-ec8f-4996-b09a-96b527b9ee5e";
  var HERO_READY_VAR = "dafc47f7-259a-4c95-a431-e28e229c6b46";
  var HERO_ROOT = ".ww-element-" + HERO_VIDEO_UID;
  var HERO_WRAP = ".ww-element-" + HERO_WRAP_UID;
  var STYLE_ID = "ww-hero-canvas-crop";
  var SPLASH_MIN_MS = 1200;
  var HARD_OUT_MS = 1500;
  var splashStarted = Date.now();
  var readyScheduled = false;
  var iframeWatchTries = 0;

  function parseYtId(url) {
    var m = String(url || "").match(/(?:youtu\.be\/|embed\/|v=)([\w-]{11})/);
    return m ? m[1] : "";
  }

  function injectCropCss() {
    if (document.getElementById(STYLE_ID)) return;
    var scale = "1.16";
    var css = [
      HERO_WRAP + "{overflow:hidden!important;background:#141f19!important;}",
      HERO_ROOT + "," + HERO_ROOT + " .ww-video-youtube{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;overflow:hidden!important;pointer-events:none!important;z-index:0!important;}",
      HERO_ROOT + " iframe," + HERO_ROOT + " .ww-video-youtube iframe{position:absolute!important;top:50%!important;left:50%!important;width:177.78vh!important;height:100vh!important;min-width:100%!important;min-height:56.25vw!important;transform:translate(-50%,-50%) scale(" + scale + ")!important;border:0!important;pointer-events:none!important;background:transparent!important;}",
      "html:not([data-ww-hero-video-ready=\"1\"]) " + HERO_ROOT + " iframe{opacity:0!important;visibility:hidden!important;}",
      "html[data-ww-hero-video-ready=\"1\"] " + HERO_ROOT + " iframe{opacity:1!important;visibility:visible!important;transition:opacity .65s ease;}",
      HERO_ROOT + "::after{content:\"\";position:absolute;inset:0;z-index:2;pointer-events:none;box-shadow:inset 0 0 0 10px #141f19,inset 0 0 0 11px rgba(198,161,91,0.22);}",
      "@media (max-width:1024px){" + HERO_ROOT + " iframe," + HERO_ROOT + " .ww-video-youtube iframe{transform:translate(-50%,-50%) scale(1.2)!important;}}",
      "@media (max-width:480px){" + HERO_ROOT + " iframe," + HERO_ROOT + " .ww-video-youtube iframe{transform:translate(-50%,-50%) scale(1.26)!important;}}"
    ].join("\n");
    var el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = css;
    document.head.appendChild(el);
  }

  function markReady() {
    if (readyScheduled) return;
    readyScheduled = true;
    var elapsed = Date.now() - splashStarted;
    var delay = Math.max(0, SPLASH_MIN_MS - elapsed);
    window.setTimeout(function () {
      document.documentElement.setAttribute("data-ww-hero-video-ready", "1");
      variables[HERO_READY_VAR] = true;
    }, delay);
  }

  window.setTimeout(function () {
    markReady();
  }, HARD_OUT_MS);

  function patchIframeSrc(iframe) {
    try {
      var src = iframe.getAttribute("src") || iframe.src || "";
      if (src.indexOf("youtube.com") === -1 && src.indexOf("youtu.be") === -1) return;
      var u = new URL(src, window.location.href);
      u.searchParams.set("controls", "0");
      u.searchParams.set("modestbranding", "1");
      u.searchParams.set("rel", "0");
      u.searchParams.set("iv_load_policy", "3");
      u.searchParams.set("disablekb", "1");
      u.searchParams.set("fs", "0");
      u.searchParams.set("playsinline", "1");
      u.searchParams.set("mute", "1");
      var next = u.toString();
      if (next !== src) iframe.src = next;
    } catch (e) {
      /* keep default embed */
    }
  }

  function loadYouTubeApi(cb) {
    if (window.YT && window.YT.Player) {
      cb();
      return;
    }
    var prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () {
      if (typeof prev === "function") prev();
      cb();
    };
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      var s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    } else {
      window.setTimeout(cb, 150);
    }
  }

  function watchIframe() {
    var root = document.querySelector(HERO_ROOT);
    if (!root) {
      markReady();
      return;
    }
    var iframe = root.querySelector("iframe");
    if (!iframe) {
      iframeWatchTries += 1;
      if (iframeWatchTries > 15) {
        markReady();
        return;
      }
      window.setTimeout(watchIframe, 120);
      return;
    }

    patchIframeSrc(iframe);

    var videoId = parseYtId(variables[HERO_URL_VAR]) || parseYtId(iframe.src);
    var done = false;
    function finish() {
      if (done) return;
      done = true;
      markReady();
    }

    iframe.addEventListener(
      "load",
      function () {
        window.setTimeout(finish, 500);
      },
      { once: true }
    );

    loadYouTubeApi(function () {
      if (!videoId || !window.YT || !window.YT.Player) {
        window.setTimeout(finish, 900);
        return;
      }
      try {
        new YT.Player(iframe, {
          events: {
            onStateChange: function (ev) {
              if (
                ev.data === YT.PlayerState.PLAYING ||
                ev.data === YT.PlayerState.BUFFERING
              ) {
                finish();
              }
            },
          },
        });
      } catch (err) {
        window.setTimeout(finish, 700);
      }
    });

    window.setTimeout(finish, 3200);
  }

  injectCropCss();
  watchIframe();
  return true;
})();
