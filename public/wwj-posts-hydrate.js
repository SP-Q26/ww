/**
 * WWJ — hydrate journal_posts from git-built /wwj-posts.json (same origin as WeWeb export).
 * Canvas may keep a 1-post seed; production feed always follows GitHub deploy.
 */
(function () {
  var POSTS_UID = 'd8cf1f9d-24cf-4073-aa40-a22606ea7797';
  var MANIFEST_URL = '/wwj-boot-manifest.json';
  var DEFAULT_CATALOG = '/wwj-posts.json';

  fetch(DEFAULT_CATALOG, { credentials: 'same-origin' })
    .then(function (r) {
      return r.ok ? r.json() : null;
    })
    .then(function (body) {
      if (!body) return;
      var posts = Array.isArray(body) ? body : body.posts;
      if (posts && posts.length) window.__wwjPostsCatalogPosts = posts;
    })
    .catch(function () {});

  function slugSet(posts) {
    var s = {};
    if (!Array.isArray(posts)) return s;
    for (var i = 0; i < posts.length; i++) {
      if (posts[i] && posts[i].slug) s[posts[i].slug] = true;
    }
    return s;
  }

  function needsHydrate(current, catalogPosts) {
    if (!Array.isArray(catalogPosts) || !catalogPosts.length) return false;
    if (!Array.isArray(current) || !current.length) return true;
    if (catalogPosts.length !== current.length) return true;
    var cat = slugSet(catalogPosts);
    var cur = slugSet(current);
    for (var slug in cat) {
      if (!cur[slug]) return true;
    }
    return false;
  }

  function readPosts(lib) {
    try {
      return lib.wwVariable.getValue(POSTS_UID);
    } catch (e) {
      return null;
    }
  }

  function applyCatalog(catalogPosts) {
    var lib = typeof wwLib !== 'undefined' ? wwLib : null;
    if (!lib || !lib.wwVariable || !lib.wwVariable.getValue || !lib.wwVariable.updateValue) {
      return false;
    }
    var current = readPosts(lib);
    if (!needsHydrate(current, catalogPosts)) return true;
    try {
      lib.wwVariable.updateValue(POSTS_UID, catalogPosts.slice());
    } catch (e) {
      return false;
    }
    var after = readPosts(lib);
    if (!Array.isArray(after) || after.length !== catalogPosts.length) {
      return false;
    }
    try {
      window.dispatchEvent(
        new CustomEvent('wwj-posts-hydrated', { detail: { count: catalogPosts.length } }),
      );
    } catch (e) {}
    return true;
  }

  function startWithPosts(posts) {
    if (!Array.isArray(posts) || !posts.length) return;
    var tries = 0;
    var maxTries = 600;
    function tick() {
      if (applyCatalog(posts) || tries++ >= maxTries) return;
      setTimeout(tick, 100);
    }
    tick();
  }

  function catalogUrl(manifest) {
    if (!manifest || !manifest.catalog) return DEFAULT_CATALOG;
    var q = manifest.version ? '?v=' + encodeURIComponent(manifest.version) : '';
    return '/' + manifest.catalog.replace(/^\//, '') + q;
  }

  function run() {
    if (window.__wwjPostsCatalogPosts && window.__wwjPostsCatalogPosts.length) {
      startWithPosts(window.__wwjPostsCatalogPosts);
    }
    fetch(MANIFEST_URL, { credentials: 'same-origin' })
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .catch(function () {
        return null;
      })
      .then(function (manifest) {
        var url = catalogUrl(manifest);
        return fetch(url, { credentials: 'same-origin' }).then(function (r) {
          if (!r.ok) throw new Error('catalog ' + r.status);
          return r.json();
        });
      })
      .then(function (body) {
        var posts = Array.isArray(body) ? body : body && body.posts;
        if (Array.isArray(posts) && posts.length) {
          window.__wwjPostsCatalogPosts = posts;
        }
        startWithPosts(posts);
      })
      .catch(function () {});
  }

  window.__wwjPostsHydrateRun = run;

  function boot() {
    run();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  window.addEventListener('load', run);
  window.addEventListener('pageshow', run);

  function spaNotify() {
    run();
    if (typeof window.wwjWildlifeTrainRescan === 'function') {
      window.wwjWildlifeTrainRescan();
    }
    try {
      window.dispatchEvent(new CustomEvent('wwj-spa-nav'));
    } catch (e) {}
  }

  function installHistoryHooks() {
    if (window.__wwjHistoryHooks) return;
    window.__wwjHistoryHooks = true;
    window.addEventListener('popstate', spaNotify);
    var pushState = history.pushState;
    var replaceState = history.replaceState;
    history.pushState = function () {
      pushState.apply(history, arguments);
      spaNotify();
    };
    history.replaceState = function () {
      replaceState.apply(history, arguments);
      spaNotify();
    };
  }

  function installWwDataLoadedHook() {
    if (window.__wwjDataLoadedHook) return true;
    var lib = typeof wwLib !== 'undefined' ? wwLib : null;
    if (!lib || typeof lib.$on !== 'function') return false;
    window.__wwjDataLoadedHook = true;
    lib.$on('wwStore:dataLoaded', spaNotify);
    return true;
  }

  /** WeWeb resetVariables() restores journal_posts to 1-post export on every route — restore catalog sync. */
  function patchVariablesReset() {
    if (window.__wwjResetVariablesPatched) return true;
    var lib = typeof wwLib !== 'undefined' ? wwLib : null;
    if (!lib || !lib.$pinia || !lib.$pinia._s) return false;
    var store = lib.$pinia._s.get('variables');
    if (!store || typeof store.resetVariables !== 'function') return false;
    window.__wwjResetVariablesPatched = true;
    var orig = store.resetVariables.bind(store);
    store.resetVariables = function (toRoute, resetPersistant) {
      orig(toRoute, resetPersistant);
      var catalog = window.__wwjPostsCatalogPosts;
      if (!catalog || !catalog.length) return;
      store.setValue(POSTS_UID, catalog.slice(), { ignoreQuery: true });
      if (lib.wwVariable && lib.wwVariable.updateValue) {
        try {
          lib.wwVariable.updateValue(POSTS_UID, catalog.slice());
        } catch (e) {}
      }
      try {
        window.dispatchEvent(
          new CustomEvent('wwj-posts-hydrated', { detail: { count: catalog.length } }),
        );
      } catch (e) {}
    };
    return true;
  }

  function installSpaHooks() {
    installHistoryHooks();
    var tries = 0;
    (function waitLib() {
      var ok = installWwDataLoadedHook() && patchVariablesReset();
      if (ok || tries++ > 600) return;
      setTimeout(waitLib, 100);
    })();
  }

  installSpaHooks();
})();
