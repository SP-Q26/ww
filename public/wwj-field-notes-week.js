/**
 * Whispering Woods Journal — expand {{WWJ_WEEK_OF_MONDAY}} in journal_posts at runtime.
 * Project Head: <script src="/wwj-field-notes-week.js" defer></script>
 */
(function () {
  var POSTS_UID = 'd8cf1f9d-24cf-4073-aa40-a22606ea7797';
  var TOKEN = '{{WWJ_WEEK_OF_MONDAY}}';
  var MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  function weekOfMondayLabel(d) {
    d = d || new Date();
    var day = d.getDay();
    var monday = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var diff = day === 0 ? -6 : 1 - day;
    monday.setDate(monday.getDate() + diff);
    return 'Monday, ' + MONTHS[monday.getMonth()] + ' ' + monday.getDate();
  }

  function expandParagraph(text, label) {
    if (!text || text.indexOf('Field notes from the ponds') === -1) return text;
    if (text.indexOf(TOKEN) !== -1) return text.split(TOKEN).join(label);
    return text.replace(
      /for the week of Monday, [^:]+:/,
      'for the week of ' + label + ':',
    );
  }

  function expandPosts(posts) {
    if (!Array.isArray(posts) || !posts.length) return posts;
    var label = weekOfMondayLabel(new Date());
    return posts.map(function (p) {
      if (!p || !p.body_paragraphs || !p.body_paragraphs.length) return p;
      var paras = p.body_paragraphs.map(function (t) {
        return expandParagraph(t, label);
      });
      return Object.assign({}, p, { body_paragraphs: paras });
    });
  }

  function patchOnce() {
    var lib = typeof wwLib !== 'undefined' ? wwLib : null;
    if (!lib || !lib.wwVariable || !lib.wwVariable.getValue || !lib.wwVariable.updateValue) {
      return false;
    }
    var posts = lib.wwVariable.getValue(POSTS_UID);
    if (!Array.isArray(posts) || !posts.length) return false;
    var next = expandPosts(posts);
    if (JSON.stringify(next) === JSON.stringify(posts)) return true;
    lib.wwVariable.updateValue(POSTS_UID, next);
    return true;
  }

  var tries = 0;
  var maxTries = 80;
  function tick() {
    if (patchOnce() || tries++ >= maxTries) return;
    setTimeout(tick, 50);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tick);
  } else {
    tick();
  }
})();
