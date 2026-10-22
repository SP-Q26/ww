/**
 * WWJ — re-hydrate git catalog after WeWeb SPA page loads (fetchPage resets variables).
 */
(function () {
  if (typeof window === "undefined") return;

  function notify() {
    if (typeof window.__wwjPostsHydrateRun === "function") {
      window.__wwjPostsHydrateRun();
    }
    if (typeof window.wwjWildlifeTrainRescan === "function") {
      window.wwjWildlifeTrainRescan();
    }
    try {
      window.dispatchEvent(new CustomEvent("wwj-spa-nav"));
    } catch (e) {}
  }

  function installHistoryHooks() {
    if (window.__wwjHistoryHooks) return;
    window.__wwjHistoryHooks = true;
    window.addEventListener("popstate", notify);
    var pushState = history.pushState;
    var replaceState = history.replaceState;
    history.pushState = function () {
      pushState.apply(history, arguments);
      notify();
    };
    history.replaceState = function () {
      replaceState.apply(history, arguments);
      notify();
    };
  }

  function installWwDataLoadedHook() {
    if (window.__wwjDataLoadedHook) return true;
    var lib = typeof wwLib !== "undefined" ? wwLib : null;
    if (!lib || typeof lib.$on !== "function") return false;
    window.__wwjDataLoadedHook = true;
    lib.$on("wwStore:dataLoaded", notify);
    return true;
  }

  function boot() {
    installHistoryHooks();
    if (!installWwDataLoadedHook()) {
      var tries = 0;
      (function waitLib() {
        if (installWwDataLoadedHook() || tries++ > 600) return;
        setTimeout(waitLib, 100);
      })();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
