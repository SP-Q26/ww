/**
 * Meta Pixel bootstrap — no-op when pixel id is missing (safe before ads go live).
 * Set window.WWL_META_PIXEL_ID or WW_SITE_CONFIG.meta_pixel_id before this script runs.
 */
(function (global) {
  'use strict';

  function pixelId() {
    var cfg = global.WW_SITE_CONFIG || {};
    var id = global.WWL_META_PIXEL_ID || cfg.meta_pixel_id || '';
    return String(id || '').replace(/\s/g, '');
  }

  function ensureFbq() {
    if (global.fbq) return true;
    var n = (global.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!global._fbq) global._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    return true;
  }

  function loadSdk(id) {
    try {
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://connect.facebook.net/en_US/fbevents.js';
      s.onerror = function () {};
      var first = document.getElementsByTagName('script')[0];
      if (first && first.parentNode) first.parentNode.insertBefore(s, first);
    } catch (e) {}
    try {
      global.fbq('init', id);
      global.fbq('track', 'PageView');
    } catch (e2) {}
  }

  function track(eventName, params) {
    try {
      if (!pixelId() || !global.fbq) return;
      global.fbq('track', eventName, params || {});
    } catch (e) {}
  }

  global.wwlMetaTrack = track;
  global.wwlMetaInitiateCheckout = function (params) {
    track('InitiateCheckout', params);
  };
  global.wwlMetaPurchase = function (params) {
    track('Purchase', params);
  };

  var id = pixelId();
  if (!id) return;

  ensureFbq();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      loadSdk(id);
    });
  } else {
    loadSdk(id);
  }
})(typeof window !== 'undefined' ? window : this);
