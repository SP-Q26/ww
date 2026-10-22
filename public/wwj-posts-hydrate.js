/**
 * WWJ — hydrate journal_posts from git-built /wwj-posts.json (same origin as WeWeb export).
 * Canvas may keep a 1-post seed; production feed always follows GitHub deploy.
 */
(function () {
  var POSTS_UID = 'd8cf1f9d-24cf-4073-aa40-a22606ea7797';
  var MANIFEST_URL = '/wwj-boot-manifest.json';
  var DEFAULT_CATALOG = '/wwj-posts.json';

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
        startWithPosts(posts);
      })
      .catch(function () {});
  }

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
})();
