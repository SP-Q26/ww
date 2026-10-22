/**
 * WWJ — root URL canon: /home → / (replaceState + optional Vercel redirect in ww vercel.json).
 * Load synchronously before SPA boot (no defer).
 */
(function () {
  var POSTS_UID = 'd8cf1f9d-24cf-4073-aa40-a22606ea7797';

  fetch('/wwj-posts.json', { credentials: 'same-origin' })
    .then(function (r) {
      return r.ok ? r.json() : null;
    })
    .then(function (body) {
      if (!body) return;
      var posts = Array.isArray(body) ? body : body.posts;
      if (posts && posts.length) window.__wwjPostsCatalogPosts = posts;
    })
    .catch(function () {});

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
    };
    return true;
  }

  (function waitPinia() {
    var tries = 0;
    (function tick() {
      if (patchVariablesReset() || tries++ > 400) return;
      setTimeout(tick, 50);
    })();
  })();

  var path = location.pathname || '/';
  if (path === '/home' || path === '/home/') {
    var target = '/' + (location.search || '') + (location.hash || '');
    history.replaceState(null, '', target);
    path = '/';
  }
  if (/^\/p\/[^/]+\/$/.test(path)) {
    var canon = path.replace(/\/+$/, '');
    history.replaceState(null, '', canon + (location.search || '') + (location.hash || ''));
  }

  function normalizeGuideLinks(root) {
    var scope = root || document;
    var links = scope.querySelectorAll('a[href^="p/"], a[href^="/p/"]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var href = a.getAttribute('href');
      if (!href || href.indexOf('://') !== -1) continue;
      var next = href.charAt(0) === '/' ? href : '/' + href;
      next = next.replace(/\/+$/, '');
      if (next !== href) a.setAttribute('href', next);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      normalizeGuideLinks();
    });
  } else {
    normalizeGuideLinks();
  }
  window.addEventListener('wwj-spa-nav', function () {
    setTimeout(function () {
      normalizeGuideLinks();
    }, 0);
  });
})();
