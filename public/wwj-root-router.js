/**
 * WWJ — root URL canon: /home → / (replaceState + optional Vercel redirect in ww vercel.json).
 * Load synchronously before SPA boot (no defer).
 */
(function () {
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
