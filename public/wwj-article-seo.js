/**
 * WWJ — per-guide title + meta from git catalog (article shell uses generic WeWeb meta).
 */
(function () {
  var SITE = 'https://www.whisperingwoodsweddings.com';
  var DEFAULT_IMAGE = '/images/384-wwj-favicon.png';

  function slugFromPath() {
    var m = (location.pathname || '').match(/^\/p\/([^/]+)\/?$/);
    return m ? decodeURIComponent(m[1]) : '';
  }

  function findPost(posts, slug) {
    if (!slug || !Array.isArray(posts)) return null;
    for (var i = 0; i < posts.length; i++) {
      if (posts[i] && posts[i].slug === slug) return posts[i];
    }
    return null;
  }

  function setMeta(attr, key, value) {
    if (!value) return;
    var sel =
      attr === 'name'
        ? 'meta[name="' + key + '"]'
        : 'meta[property="' + key + '"]';
    var el = document.querySelector(sel);
    if (!el) {
      el = document.createElement('meta');
      if (attr === 'name') el.setAttribute('name', key);
      else el.setAttribute('property', key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', value);
  }

  function absImage(url) {
    if (!url) return SITE + DEFAULT_IMAGE;
    if (url.indexOf('http') === 0) return url;
    return SITE + (url.charAt(0) === '/' ? url : '/' + url);
  }

  function applyPost(post) {
    if (!post) return;
    var title = (post.title || post.listTitle || 'Whispering Woods Journal') + ' · Whispering Woods Journal';
    var desc = (post.dek || post.hook || '').trim();
    if (desc.length > 160) desc = desc.slice(0, 157) + '…';
    document.title = title;
    setMeta('name', 'description', desc);
    setMeta('property', 'og:title', post.title || post.listTitle || title);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:type', 'article');
    setMeta('name', 'twitter:title', post.title || post.listTitle || title);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:card', 'summary_large_image');
    var img = absImage(post.image || post.hero_image);
    setMeta('property', 'og:image', img);
    setMeta('name', 'twitter:image', img);
  }

  function run() {
    var slug = slugFromPath();
    if (!slug) return;
    var cached = window.__wwjPostsCatalogPosts;
    var post = findPost(cached, slug);
    if (post) {
      applyPost(post);
      return;
    }
    fetch('/wwj-posts.json', { credentials: 'same-origin' })
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (body) {
        var posts = Array.isArray(body) ? body : body && body.posts;
        if (posts && posts.length) window.__wwjPostsCatalogPosts = posts;
        applyPost(findPost(posts, slug));
      })
      .catch(function () {});
  }

  window.addEventListener('wwj-spa-nav', run);
  window.addEventListener('wwj-posts-hydrated', run);
  window.addEventListener('popstate', run);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
