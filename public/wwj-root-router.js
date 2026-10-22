/**
 * WWJ — root URL canon: /home → / (replaceState + optional Vercel redirect in ww vercel.json).
 * Load synchronously before SPA boot (no defer).
 */
(function () {
  var path = location.pathname || '/';
  if (path === '/home' || path === '/home/') {
    var target = '/' + (location.search || '') + (location.hash || '');
    history.replaceState(null, '', target);
  }
})();
