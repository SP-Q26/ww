/**
 * Site bridge — SEO helpers, CTAs, mailto, reviews, env
 * Safe boot: one pass + optional single footer retry. No observers/polling.
 * @ww-head-module site-bridge
 */
(function wwSiteBridge() {
  "use strict";

  var cfg = window.WW_SITE_CONFIG || {};
  var FOOTER_UID = "1255087b-18e5-40e9-9ebf-5331b87c470e";
  var SOCIAL_UID = "8ec0279f-29d5-4bad-a787-826510df5a0a";
  var booted = false;
  var finished = false;
  var EMAIL = (cfg.email || "info@whisperingwoodsevents.com").replace(/^mailto:/i, "");
  var MAILTO = "mailto:" + EMAIL;
  var TOUR_URL = cfg.tour_booking_url || "https://calendly.com/whisperingwoodsinfo/private-venue-tour";
  var TOUR_RE = /book a tour|tour the grounds|^tour$/i;

  function setEnv() {
    var host = location.hostname || "";
    var isProd =
      host.indexOf("whisperingwoodsevents.com") !== -1 ||
      (host.indexOf("weweb.io") === -1 &&
        host.indexOf("localhost") === -1 &&
        host.indexOf("vercel.app") !== -1);
    document.documentElement.setAttribute("data-ww-env", isProd ? "production" : "preview");
  }

  function cleanMailto(raw) {
    var value = String(raw || "").trim();
    while (/^mailto:/i.test(value)) {
      value = value.replace(/^mailto:/i, "");
    }
    return value.replace(/^mailto:/i, "");
  }

  function sanitizeMailtoHrefs() {
    document.querySelectorAll('a[href*="mailto"], a[to*="mailto"]').forEach(function (a) {
      var href = a.getAttribute("href") || a.getAttribute("to") || "";
      var email = cleanMailto(href);
      if (!email) return;
      var fixed = "mailto:" + email;
      if (a.getAttribute("href") !== fixed) a.setAttribute("href", fixed);
      if (a.hasAttribute("to") && a.getAttribute("to") !== fixed) a.setAttribute("to", fixed);
    });
  }

  function wireMailtoClick() {
    if (document.documentElement.dataset.wwMailtoDelegated) return;
    document.documentElement.dataset.wwMailtoDelegated = "1";

    document.addEventListener(
      "click",
      function (ev) {
        var a = ev.target.closest('a[href*="mailto"], a[to*="mailto"]');
        if (!a) return;
        ev.preventDefault();
        ev.stopPropagation();
        window.location.href = MAILTO;
      },
      true
    );
  }

  function openTour(ev) {
    if (typeof window.wwOpenTourModal === "function") {
      window.wwOpenTourModal();
      return;
    }
    window.open(TOUR_URL, "_blank", "noopener,noreferrer");
  }

  function isTourControl(el) {
    if (!el) return false;
    if (el.closest("[data-ww-tour]")) return true;
    var text = (el.textContent || "").trim();
    if (TOUR_RE.test(text)) return true;
    var href = (el.getAttribute("href") || "").toLowerCase();
    return href.indexOf("calendly.com") !== -1 || href.indexOf("calendar.app.google") !== -1;
  }

  function wireTourDelegation() {
    if (document.documentElement.dataset.wwTourDelegated) return;
    document.documentElement.dataset.wwTourDelegated = "1";

    document.addEventListener(
      "click",
      function (ev) {
        var el = ev.target.closest("a, button");
        if (!el || !isTourControl(el)) return;
        if (el.closest("#ww-sticky-nav") && !el.closest("#ww-sticky-nav.is-expanded")) return;
        ev.preventDefault();
        ev.stopPropagation();
        openTour(ev);
      },
      true
    );

    document.querySelectorAll("[data-ww-tour]").forEach(function (node) {
      if (node.dataset.wwTourBound) return;
      node.dataset.wwTourBound = "1";
      node.setAttribute("href", "#tour");
      node.removeAttribute("target");
    });
  }

  function labelTrustLinks() {
    if (document.documentElement.dataset.wwTrustLabeled) return;
    var labeled = false;
    var map = [
      { match: /theknot\.com/i, label: "5.0 The Knot", stars: "5.0" },
      { match: /facebook\.com/i, label: "Facebook", stars: "5.0" },
      { match: /google\.com\/maps/i, label: "Google 4.9", stars: "4.9" },
    ];

    document.querySelectorAll("a").forEach(function (a) {
      if (a.dataset.wwTrustLabeled) return;
      var href = a.href || "";
      var text = (a.textContent || "").trim();
      if (!/^[0-9.]+$/.test(text) && text.length > 2) return;

      for (var i = 0; i < map.length; i++) {
        if (!map[i].match.test(href)) continue;
        a.setAttribute("aria-label", map[i].label + " reviews");
        a.title = map[i].label;
        if (a.childElementCount === 0 || text.length <= 4) {
          a.textContent = map[i].label;
        }
        a.classList.add("ww-trust-badge");
        a.dataset.wwTrustLabeled = "1";
        labeled = true;
        break;
      }
    });

    if (labeled) document.documentElement.dataset.wwTrustLabeled = "1";
  }

  function footerEl() {
    return document.querySelector(".ww-element-" + FOOTER_UID);
  }

  function injectFooterReviews() {
    var footer = footerEl();
    if (!footer) return false;
    if (footer.querySelector(".ww-footer-reviews")) return true;

    var ratings = cfg.ratings || {};
    var items = [ratings.knot, ratings.google, ratings.facebook].filter(function (r) {
      return r && r.url;
    });
    if (!items.length) return true;

    var nav = document.createElement("nav");
    nav.className = "ww-footer-reviews";
    nav.setAttribute("aria-label", "Guest reviews");

    items.forEach(function (r) {
      var a = document.createElement("a");
      a.className = "ww-footer-reviews__link";
      a.href = r.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.innerHTML =
        '<span class="ww-footer-reviews__stars">' +
        r.stars +
        "</span> " +
        (r.label || "Reviews");
      nav.appendChild(a);
    });

    var social = footer.querySelector(".ww-element-" + SOCIAL_UID);
    if (social && social.parentElement) {
      social.parentElement.insertBefore(nav, social);
    } else {
      footer.appendChild(nav);
    }
    return true;
  }

  function injectFooterSeo() {
    var footer = footerEl();
    if (!footer) return false;
    if (footer.querySelector(".ww-footer-seo")) return true;

    var p = document.createElement("p");
    p.className = "ww-footer-seo";
    p.textContent =
      "40-acre outdoor wedding estate in Harvard, Illinois — private ceremony and reception grounds " +
      "15 minutes from Lake Geneva. One wedding per weekend.";
    footer.appendChild(p);
    return true;
  }

  function injectJsonLd() {
    if (document.getElementById("ww-jsonld")) return;

    var script = document.createElement("script");
    script.id = "ww-jsonld";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "EventVenue",
      name: "Whispering Woods Events",
      description:
        "Private 40-acre outdoor wedding estate south of Lake Geneva. Ceremony and reception on pine, pond, and meadow grounds. One event per weekend.",
      url: "https://www.whisperingwoodsevents.com/",
      email: EMAIL,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Harvard",
        addressRegion: "IL",
        addressCountry: "US",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 42.423,
        longitude: -88.614,
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.95",
        reviewCount: "55",
      },
    });
    document.head.appendChild(script);
  }

  function runPass() {
    if (finished) return;
    setEnv();
    sanitizeMailtoHrefs();
    wireMailtoClick();
    wireTourDelegation();
    labelTrustLinks();
    injectJsonLd();

    if (injectFooterReviews() && injectFooterSeo()) {
      finished = true;
    }
  }

  function boot() {
    if (booted) return;
    booted = true;
    runPass();
    [400, 1200, 2500].forEach(function (ms) {
      window.setTimeout(function () {
        sanitizeMailtoHrefs();
        runPass();
        if (ms >= 1200) finished = true;
      }, ms);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
