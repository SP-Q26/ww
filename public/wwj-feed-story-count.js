/**
 * WWJ — Feed H2: "· {count} stories from the grounds" from journal_posts length.
 * Target: #wwj-feed-h2 (Home · Feed H2). Load after wwj-posts-hydrate.js.
 */
(function () {
  var POSTS_UID = 'd8cf1f9d-24cf-4073-aa40-a22606ea7797';
  var CATALOG_URL = '/wwj-posts.json';
  var TARGET_ID = 'wwj-feed-h2';

  var ONES = [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
  ];
  var TENS = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ];

  function countWord(n) {
    n = Math.floor(Number(n) || 0);
    if (n < 0) return String(n);
    if (n < 20) return ONES[n];
    if (n < 100) {
      var t = Math.floor(n / 10);
      var o = n % 10;
      return o ? TENS[t] + '-' + ONES[o] : TENS[t];
    }
    return String(n);
  }

  function feedH2Html(n) {
    return '<div> · ' + countWord(n) + ' stories from the grounds</div>';
  }

  function readCountFromVariable() {
    var lib = typeof wwLib !== 'undefined' ? wwLib : null;
    if (!lib || !lib.wwVariable || !lib.wwVariable.getValue) return 0;
    var posts = lib.wwVariable.getValue(POSTS_UID);
    return Array.isArray(posts) ? posts.length : 0;
  }

  function fetchCatalogCount(done) {
    fetch(CATALOG_URL, { credentials: 'same-origin' })
      .then(function (r) {
        if (!r.ok) throw new Error('catalog');
        return r.json();
      })
      .then(function (body) {
        var posts = Array.isArray(body) ? body : body && body.posts;
        var n =
          typeof body.count === 'number'
            ? body.count
            : Array.isArray(posts)
              ? posts.length
              : 0;
        done(n);
      })
      .catch(function () {
        done(0);
      });
  }

  function resolveCount(done) {
    var fromVar = readCountFromVariable();
    fetchCatalogCount(function (n) {
      if (n > 0) done(n);
      else if (fromVar > 0) done(fromVar);
      else done(0);
    });
  }

  function applyCount(n) {
    if (!n) return false;
    var el = document.getElementById(TARGET_ID);
    if (!el) return false;
    var html = feedH2Html(n);
    if (el.innerHTML !== html) el.innerHTML = html;
    return true;
  }

  function run() {
    var tries = 0;
    var maxTries = 100;
    function tick() {
      resolveCount(function (n) {
        if (applyCount(n) || tries++ >= maxTries) return;
        setTimeout(tick, 50);
      });
    }
    tick();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
  window.addEventListener('wwj-posts-hydrated', run);
  window.addEventListener('wwj-spa-nav', run);
})();
