/**
 * WWLuxe keepsake order · tablet / Chalet kiosk
 * Tap to pay: Stripe Checkout Session (Apple Pay / Google Pay / card)
 */
(function () {
  "use strict";

  var SPLASH_MIN_MS = 2200;
  var splashStarted = Date.now();

  function initSplash() {
    var splash = document.getElementById("wwl-splash");
    if (!splash) return;
    document.body.classList.add("wwl-splash-active");
    var reduced =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var minMs = reduced ? 400 : SPLASH_MIN_MS;

    function dismiss() {
      var elapsed = Date.now() - splashStarted;
      var wait = Math.max(0, minMs - elapsed);
      window.setTimeout(function () {
        splash.classList.add("is-out");
        splash.setAttribute("aria-busy", "false");
        document.body.classList.remove("wwl-splash-active");
        window.setTimeout(function () {
          if (splash.parentNode) splash.parentNode.removeChild(splash);
        }, 600);
      }, wait);
    }

    if (document.readyState === "complete") {
      dismiss();
    } else {
      window.addEventListener("load", dismiss, { once: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSplash);
  } else {
    initSplash();
  }

  var SPREAD_UNIT = 55;
  var SPREAD_BUNDLE = { qty: 5, price: 255 };
  var MAX_SPREADS = 10;
  var PREORDER_CLOSE_DAYS = 7;
  var DRAFT_KEY = "wwluxe_order_draft_v2";

  var CONFIG = window.WWLUXE_CONFIG || {};
  var TERMS_URL = CONFIG.termsUrl || "https://whisperingwoodsluxe.com/terms";
  var PRIVACY_URL = CONFIG.privacyUrl || "https://whisperingwoodsluxe.com/privacypolicy";

  function resolveCheckoutApi() {
    if (CONFIG.checkoutApi) return CONFIG.checkoutApi;
    if (typeof window !== "undefined" && window.location && window.location.origin) {
      return window.location.origin + "/api/wwluxe/keepsake-checkout";
    }
    return "https://api.whisperingwoodsluxe.com/v1/keepsake-checkout";
  }

  var CHECKOUT_URL = resolveCheckoutApi();

  var state = {
    step: 1,
    mode: "preorder",
    chalet: false,
    items: {},
    spreadsSelected: false,
    spreads: 0,
    cover: "leather",
    expanded: null,
    preorderOpen: true,
    eventDate: null,
    contact: {}
  };

  function spreadPrice(n) {
    if (n <= 0) return 0;
    var bundles = Math.floor(n / SPREAD_BUNDLE.qty);
    var rest = n % SPREAD_BUNDLE.qty;
    return bundles * SPREAD_BUNDLE.price + rest * SPREAD_UNIT;
  }

  function catalog() {
    return {
      chalet: {
        sku: "WWL-CHALET-PREORDER-1420",
        label: "Chalet Collection · Pre-order only",
        price: 1420
      },
      album: { sku: "WWL-ALBUM-HEIRLOOM-955", label: "Heirloom Album 10×10", price: 955 },
      digital: { sku: "WWL-DIGITAL-395", label: "Digital Gallery", price: 395 },
      frame: { sku: "WWL-FRAME-425", label: "Framed Print 20×24", price: 425 },
      retouch: { sku: "WWL-RETOUCH-7-195", label: "Extra Retouches (7)", price: 195 },
      fineart: { sku: "WWL-UPGRADE-FINEART-395", label: "Fine Art paper upgrade", price: 395 },
      mini: { sku: "WWL-MINI-PARENT-345", label: "Parent Mini 6×6", price: 345 }
    };
  }

  function coverLabel() {
    return state.cover === "linen" ? "Natural linen cover" : "Luxe leather cover";
  }

  var CHALET_BUNDLE_KEYS = ["album", "digital", "frame"];

  function isIncludedInChalet(key) {
    return (
      state.chalet &&
      state.mode === "preorder" &&
      state.preorderOpen &&
      CHALET_BUNDLE_KEYS.indexOf(key) !== -1
    );
  }

  /** Album, Chalet, spreads, or Fine Art upgrade — not retouch/mini/frame-only */
  function needsCoverChoice() {
    return !!(
      state.chalet ||
      state.items.album ||
      state.spreadsSelected ||
      state.items.fineart
    );
  }

  function buildLines() {
    var lines = [];
    var cat = catalog();
    var total = 0;

    if (state.mode === "preorder" && state.chalet && state.preorderOpen) {
      lines.push({
        sku: cat.chalet.sku,
        label: cat.chalet.label,
        price: cat.chalet.price
      });
      total += cat.chalet.price;
    }

    if (state.mode === "preorder" && !state.chalet) {
      ["album", "digital", "frame"].forEach(function (key) {
        if (state.items[key]) {
          lines.push({ sku: cat[key].sku, label: cat[key].label, price: cat[key].price });
          total += cat[key].price;
        }
      });
    }

    ["retouch", "fineart", "mini"].forEach(function (key) {
      if (state.items[key]) {
        lines.push({ sku: cat[key].sku, label: cat[key].label, price: cat[key].price });
        total += cat[key].price;
      }
    });

    if (state.spreadsSelected && state.spreads > 0) {
      var n = state.spreads;
      var bundles = Math.floor(n / SPREAD_BUNDLE.qty);
      var rest = n % SPREAD_BUNDLE.qty;
      var spreadLabel =
        "Extra spreads (" + n + ")";
      for (var bi = 0; bi < bundles; bi++) {
        lines.push({
          sku: "WWL-SPREAD-5-255",
          label: spreadLabel,
          price: SPREAD_BUNDLE.price
        });
        total += SPREAD_BUNDLE.price;
      }
      for (var si = 0; si < rest; si++) {
        lines.push({
          sku: "WWL-SPREAD-1-55",
          label: spreadLabel,
          price: SPREAD_UNIT
        });
        total += SPREAD_UNIT;
      }
    }

    if (needsCoverChoice()) {
      lines.push({
        sku: state.cover === "linen" ? "WWL-COVER-LINEN-0" : "WWL-COVER-LEATHER-0",
        label: "Cover preference · " + coverLabel(),
        price: 0
      });
    }

    return { lines: lines, total: total };
  }

  function $(sel) {
    return document.querySelector(sel);
  }

  function $$(sel) {
    return Array.prototype.slice.call(document.querySelectorAll(sel));
  }

  function daysUntilEvent() {
    if (!state.eventDate) return null;
    var now = new Date();
    now.setHours(0, 0, 0, 0);
    var ev = new Date(state.eventDate);
    ev.setHours(0, 0, 0, 0);
    return Math.ceil((ev - now) / 86400000);
  }

  function saveDraft() {
    try {
      readContact();
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          state: {
            mode: state.mode,
            chalet: state.chalet,
            items: state.items,
            spreadsSelected: state.spreadsSelected,
            spreads: state.spreads,
            cover: state.cover,
            contact: state.contact
          },
          savedAt: Date.now()
        })
      );
    } catch (e) {
      /* private mode / quota */
    }
  }

  function loadDraft() {
    try {
      var raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return false;
      var parsed = JSON.parse(raw);
      if (!parsed || !parsed.state) return false;
      var s = parsed.state;
      state.mode = s.mode || state.mode;
      state.chalet = !!s.chalet;
      state.items = s.items || {};
      state.spreadsSelected = !!s.spreadsSelected;
      state.spreads = Number(s.spreads) || 0;
      state.cover = s.cover || "leather";
      if (s.contact) {
        state.contact = s.contact;
        if ($("#name") && s.contact.name) $("#name").value = s.contact.name;
        if ($("#email") && s.contact.email) $("#email").value = s.contact.email;
        if ($("#senior") && s.contact.senior) $("#senior").value = s.contact.senior;
        if ($("#ref") && s.contact.ref) $("#ref").value = s.contact.ref;
        if ($("#notes") && s.contact.notes) $("#notes").value = s.contact.notes;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  function clearDraft() {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch (e) {
      /* ignore */
    }
  }

  var EMPTY_SUB_COPY = "Keepsakes are optional · published prices always";

  function hideTransientBanners() {
    [
      "banner-checkout-success",
      "banner-checkout-cancel",
      "banner-draft-restored",
      "banner-addons"
    ].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.classList.add("wwl-hidden");
    });
  }

  function clearContactFields() {
    ["#name", "#email", "#senior", "#ref", "#notes"].forEach(function (sel) {
      var el = $(sel);
      if (el) el.value = "";
    });
    var terms = $("#terms-accept");
    if (terms) terms.checked = false;
  }

  function resetSessionForNextGuest() {
    var kiosk = document.body.classList.contains("kiosk");
    if (
      !kiosk &&
      !window.confirm(
        "Clear all selections and form fields on this device for the next family?"
      )
    ) {
      return;
    }
    clearDraft();
    hideTransientBanners();
    var urlMode = new URLSearchParams(window.location.search).get("mode");
    state.step = 1;
    state.chalet = false;
    state.items = {};
    state.spreadsSelected = false;
    state.spreads = 0;
    state.cover = "leather";
    state.expanded = null;
    state.contact = {};
    clearContactFields();
    if (urlMode === "addons") {
      setMode("addons");
    } else {
      state.mode = "preorder";
      var introNote = $("#intro-mode-note");
      if (introNote) {
        introNote.textContent =
          "You have seen the albums and papers at the Chalet table. When you are ready, curate your once-in-a-lifetime collection here. We refine every detail together in a relaxed design consult after you reserve.";
      }
      var addonsBanner = $("#banner-addons");
      if (addonsBanner) addonsBanner.classList.add("wwl-hidden");
      syncModeLinks();
      updatePageContext();
      applySectionVisibility();
    }
    updatePreorderWindow();
    setStep(1);
    render();
  }

  function updatePreorderWindow() {
    var days = daysUntilEvent();
    if (days !== null && days <= PREORDER_CLOSE_DAYS) {
      state.preorderOpen = false;
      if (state.chalet) {
        state.chalet = false;
      }
      var closed = $("#banner-preorder-closed");
      if (closed) closed.classList.remove("wwl-hidden");
      var chaletSection = $("#section-chalet");
      if (chaletSection) chaletSection.classList.add("wwl-hidden");
      if (state.mode === "preorder") {
        setMode("addons");
      }
    }
    syncModeLinks();
    updatePageContext();
  }

  function updatePageContext() {
    var title = $("#page-title");
    var lede = $(".wwl-intro__lede");
    if (!title) return;
    if (!state.preorderOpen) {
      title.textContent = "Refine your collection";
      if (lede) lede.textContent = "Add to your Chalet reservation";
      return;
    }
    if (state.mode === "addons") {
      title.textContent = "Add to your reservation";
      if (lede) lede.textContent = "Chalet refinements";
      return;
    }
    title.textContent = "Design your collection";
    if (lede) lede.textContent = "Reserve your heirlooms";
  }

  function syncModeLinks() {
    var wrap = $("#mode-quiet-wrap");
    var linkAddons = $("#link-addons-mode");
    var linkPreorder = $("#link-preorder-mode");
    if (!state.preorderOpen) {
      if (wrap) wrap.classList.add("wwl-hidden");
      return;
    }
    if (wrap) wrap.classList.remove("wwl-hidden");
    if (linkAddons) linkAddons.classList.toggle("wwl-hidden", state.mode === "addons");
    if (linkPreorder) linkPreorder.classList.toggle("wwl-hidden", state.mode !== "addons");
  }

  function setMode(mode) {
    state.mode = mode;
    if (mode === "addons") {
      state.chalet = false;
      ["album", "digital", "frame"].forEach(function (k) {
        state.items[k] = false;
      });
    }
    var introNote = $("#intro-mode-note");
    if (introNote) {
      introNote.textContent =
        mode === "addons"
          ? "Your Chalet Collection is already reserved. Album, digital gallery, and framed print are included. Add refinements at your pace."
          : "You have seen the albums and papers at the Chalet table. When you are ready, curate your once-in-a-lifetime collection here. We refine every detail together in a relaxed design consult after you reserve.";
    }
    var addonsBanner = $("#banner-addons");
    if (addonsBanner) {
      addonsBanner.classList.toggle("wwl-hidden", mode !== "addons");
    }
    syncModeLinks();
    updatePageContext();
    applySectionVisibility();
    saveDraft();
    render();
  }

  function applySectionVisibility() {
    var chaletSection = $("#section-chalet");
    var alacarte = $("#section-alacarte");
    var addonsLabel = $("#section-addons-label");
    var addonsSection = $("#section-addons");
    if (state.mode === "addons") {
      if (chaletSection) chaletSection.classList.add("wwl-hidden");
      if (alacarte) alacarte.classList.add("wwl-hidden");
      if (addonsLabel) addonsLabel.textContent = "Refinements for your reservation";
    } else {
      if (chaletSection && state.preorderOpen) chaletSection.classList.remove("wwl-hidden");
      if (alacarte) alacarte.classList.remove("wwl-hidden");
      if (addonsLabel) addonsLabel.textContent = "Atelier refinements";
    }
    if (addonsSection) addonsSection.classList.remove("wwl-hidden");
    var coverSection = $("#section-cover");
    if (coverSection) {
      coverSection.classList.toggle("wwl-hidden", !needsCoverChoice());
    }
  }

  function setStep(n) {
    state.step = n;
    $$(".wwl-step").forEach(function (el, i) {
      el.classList.toggle("is-on", i + 1 <= n);
    });
    $$(".wwl-screen").forEach(function (el) {
      el.classList.toggle("is-active", Number(el.dataset.step) === n);
    });
    syncPayLabels(n);
    render();
  }

  function syncPayLabels(n) {
    var label =
      n === 3 ? "Complete reservation" : n === 2 ? "Continue" : "Review collection";
    var payLabel = $("#pay-btn-label-main");
    if (payLabel) payLabel.textContent = label;
  }

  function renderCartPreview(data) {
    var el = $("#cart-preview");
    if (!el) return;
    var paidLines = data.lines.filter(function (row) {
      return row.price > 0;
    });
    if (!paidLines.length || state.step > 1) {
      el.classList.add("wwl-hidden");
      el.innerHTML = "";
      return;
    }
    el.classList.remove("wwl-hidden");
    el.innerHTML =
      '<p class="wwl-eyebrow" style="margin:12px 0 6px;">Your collection so far</p>' +
      paidLines
        .map(function (row) {
          return (
            '<div class="wwl-summary-line wwl-summary-line--compact"><span>' +
            row.label +
            '</span><span>$' +
            row.price.toLocaleString() +
            "</span></div>"
          );
        })
        .join("");
  }

  function render() {
    var data = buildLines();
    ["#total-amount-main"].forEach(function (sel) {
      var el = $(sel);
      if (el) el.textContent = "$" + data.total.toLocaleString();
    });
    var paidCount = data.lines.filter(function (r) {
      return r.price > 0;
    }).length;
    var sub =
      paidCount === 0
        ? EMPTY_SUB_COPY
        : paidCount + " piece" + (paidCount > 1 ? "s" : "") + " · published prices";
    ["#total-sub-main"].forEach(function (sel) {
      var el = $(sel);
      if (el) el.textContent = sub;
    });

    renderCartPreview(data);

    var linesEl = $("#review-lines");
    if (linesEl) {
      if (!data.lines.length) {
        linesEl.innerHTML =
          '<p class="wwl-cover__intro">Nothing reserved yet. Return to curate your collection.</p>';
      } else {
        linesEl.innerHTML = data.lines
          .map(function (row) {
            var price =
              row.price > 0 ? "$" + row.price.toLocaleString() : "Included";
            return (
              '<div class="wwl-summary-line"><span>' +
              row.label +
              '</span><span>' +
              price +
              "</span></div>"
            );
          })
          .join("");
      }
    }

    var termsOk = $("#terms-accept") && $("#terms-accept").checked;
    var emailOk = $("#email") && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("#email").value.trim());
    var nameOk = $("#name") && $("#name").value.trim().length > 1;
    var disabled = data.total === 0;
    if (state.step === 2) disabled = !nameOk || !emailOk;
    if (state.step === 3) disabled = data.total === 0 || !termsOk || !nameOk || !emailOk;

    var payBtn = $("#pay-btn-main");
    if (payBtn) payBtn.disabled = disabled;

    syncProducts();
    updateSpreadUI();
    applySectionVisibility();
    saveDraft();
  }

  function syncProducts() {
    $$(".wwl-product").forEach(function (card) {
      var key = card.dataset.product;
      var included = isIncludedInChalet(key);
      var selected = false;
      if (key === "chalet") selected = state.chalet;
      else if (key === "spreads") selected = state.spreadsSelected;
      else if (included) selected = false;
      else selected = !!state.items[key];
      card.classList.toggle("is-selected", selected);
      card.classList.toggle("is-included", included);
      card.classList.toggle("is-expanded", state.expanded === key);
      var head = card.querySelector(".wwl-product__head");
      if (head) {
        head.setAttribute("aria-expanded", state.expanded === key ? "true" : "false");
        head.setAttribute("aria-disabled", included ? "true" : "false");
      }
      var badge = card.querySelector("[data-included-badge]");
      if (badge) badge.classList.toggle("wwl-hidden", !included);
      var chip = card.querySelector("[data-select]");
      if (chip) {
        chip.disabled = included;
        if (included) {
          chip.textContent = "Included in Chalet";
          chip.classList.add("is-on");
        } else if (key === "spreads") {
          chip.textContent = state.spreadsSelected ? "Remove" : "Reserve spreads";
          chip.classList.toggle("is-on", state.spreadsSelected);
        } else {
          chip.textContent = selected ? "Reserved" : "Reserve";
          chip.classList.toggle("is-on", selected);
        }
      }
    });
    $$(".wwl-cover-card").forEach(function (btn) {
      btn.classList.toggle("is-selected", btn.dataset.cover === state.cover);
    });
  }

  function updateSpreadUI() {
    var stepper = $("#spread-stepper");
    var hint = $("#spread-price-hint");
    if (stepper) stepper.classList.toggle("is-visible", state.spreadsSelected);
    if (hint) {
      hint.textContent = state.spreadsSelected
        ? "$" + spreadPrice(state.spreads).toLocaleString()
        : "—";
    }
    var count = $("#spread-count");
    if (count) {
      count.textContent =
        state.spreads +
        " spread" +
        (state.spreads !== 1 ? "s" : "") +
        " · $" +
        spreadPrice(state.spreads).toLocaleString();
    }
  }

  function toggleExpand(key) {
    state.expanded = state.expanded === key ? null : key;
    render();
  }

  function toggleSelect(key) {
    if (key === "chalet") {
      if (!state.preorderOpen || state.mode !== "preorder") return;
      state.chalet = !state.chalet;
      if (state.chalet) {
        state.items.album = false;
        state.items.digital = false;
        state.items.frame = false;
      }
    } else if (key === "spreads") {
      state.spreadsSelected = !state.spreadsSelected;
      if (state.spreadsSelected) {
        state.spreads = Math.max(1, state.spreads || 1);
        state.expanded = "spreads";
      } else {
        state.spreads = 0;
      }
    } else {
      if (isIncludedInChalet(key)) return;
      state.items[key] = !state.items[key];
    }
    render();
  }

  function initProducts() {
    $$(".wwl-product").forEach(function (card) {
      var key = card.dataset.product;
      var head = card.querySelector(".wwl-product__head");
      if (head) {
        head.addEventListener("click", function () {
          toggleExpand(key);
        });
      }
      var chip = card.querySelector("[data-select]");
      if (chip) {
        chip.addEventListener("click", function (e) {
          e.stopPropagation();
          toggleSelect(key);
        });
      }
    });

    var minus = $("#spread-minus");
    var plus = $("#spread-plus");
    if (minus) {
      minus.addEventListener("click", function (e) {
        e.stopPropagation();
        if (!state.spreadsSelected) return;
        if (state.spreads <= 1) {
          state.spreads = 0;
          state.spreadsSelected = false;
        } else {
          state.spreads -= 1;
        }
        render();
      });
    }
    if (plus) {
      plus.addEventListener("click", function (e) {
        e.stopPropagation();
        if (!state.spreadsSelected) {
          state.spreadsSelected = true;
          state.spreads = 1;
        } else {
          state.spreads = Math.min(MAX_SPREADS, state.spreads + 1);
        }
        render();
      });
    }

    $$(".wwl-cover-card").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.cover = btn.dataset.cover;
        render();
      });
    });
  }

  function initMode() {
    var linkAddons = $("#link-addons-mode");
    var linkPreorder = $("#link-preorder-mode");
    if (linkAddons) {
      linkAddons.addEventListener("click", function () {
        setMode("addons");
      });
    }
    if (linkPreorder) {
      linkPreorder.addEventListener("click", function () {
        setMode("preorder");
      });
    }
  }

  function initLegalLinks() {
    var termsHtml =
      'I agree to the <a href="' +
      TERMS_URL +
      '" target="_blank" rel="noopener">Terms of Service</a> and <a href="' +
      PRIVACY_URL +
      '" target="_blank" rel="noopener">Privacy Policy</a>. Heirlooms are custom-made with limited refund rights once production begins.';
    var termsCopy = $("#terms-copy");
    if (termsCopy) termsCopy.innerHTML = termsHtml;
    ["#foot-terms"].forEach(function (sel) {
      var el = $(sel);
      if (el) el.href = TERMS_URL;
    });
    ["#foot-privacy"].forEach(function (sel) {
      var el = $(sel);
      if (el) el.href = PRIVACY_URL;
    });
  }

  function readContact() {
    state.contact = {
      name: ($("#name") && $("#name").value.trim()) || "",
      email: ($("#email") && $("#email").value.trim()) || "",
      senior: ($("#senior") && $("#senior").value.trim()) || "",
      ref: ($("#ref") && $("#ref").value.trim()) || "",
      notes: ($("#notes") && $("#notes").value.trim()) || "",
      cover: state.cover,
      mode: state.mode
    };
  }

  function buildPayload() {
    readContact();
    var data = buildLines();
    var origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "https://whisperingwoodsluxe.com";
    return {
      contact: state.contact,
      lines: data.lines
        .filter(function (r) {
          return r.price > 0;
        })
        .map(function (r) {
          return { sku: r.sku, label: r.label, amount_cents: r.price * 100 };
        }),
      total_cents: data.total * 100,
      terms_version: "2026-09-18",
      source: document.body.classList.contains("kiosk") ? "chalet_kiosk" : "order_web",
      success_url: origin + "/heirloom?checkout=success&session_id={CHECKOUT_SESSION_ID}",
      cancel_url: origin + "/heirloom?checkout=cancelled"
    };
  }

  async function startCheckout() {
    var payload = buildPayload();
    if (!payload.lines.length) return;

    var payBtn = $("#pay-btn-main");
    if (payBtn) payBtn.disabled = true;
    syncPayLabels(3);
    var labels = $$("#pay-btn-label-main");
    labels.forEach(function (el) {
      el.textContent = "Opening checkout…";
    });

    try {
      var res = await fetch(CHECKOUT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      var json = {};
      try {
        json = await res.json();
      } catch (parseErr) {
        json = {};
      }
      if (!res.ok) {
        var hint =
          json.message || json.hint || json.error || "checkout_unavailable";
        throw new Error(hint);
      }
      if (json.checkout_url) {
        clearDraft();
        window.location.href = json.checkout_url;
        return;
      }
      throw new Error("no_checkout_url");
    } catch (err) {
      console.warn("WWLuxe checkout failed", payload, err.message);
      var reason = String(err.message || "checkout_unavailable").replace(/_/g, " ");
      alert(
        "We could not open secure checkout.\n\nTotal: $" +
          (payload.total_cents / 100).toLocaleString() +
          "\n\n" +
          reason +
          "\n\nIf this continues, email bookings@whisperingwoodsluxe.com and we will complete your reservation manually."
      );
      labels.forEach(function (el) {
        el.textContent = "Complete reservation";
      });
      render();
    }
  }

  function onPayClick() {
    if (state.step === 1) {
      if (buildLines().total === 0) return;
      setStep(2);
      return;
    }
    if (state.step === 2) {
      readContact();
      if (!state.contact.name || !state.contact.email) return;
      setStep(3);
      return;
    }
    if (!$("#terms-accept") || !$("#terms-accept").checked) return;
    startCheckout();
  }

  function handleCheckoutReturn(params) {
    var status = params.get("checkout");
    if (status === "success") {
      clearDraft();
      var ok = $("#banner-checkout-success");
      if (ok) ok.classList.remove("wwl-hidden");
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, "", window.location.pathname + window.location.search.replace(/[?&]checkout=[^&]+/, "").replace(/[?&]session_id=[^&]+/, ""));
      }
    } else if (status === "cancelled") {
      var cancel = $("#banner-checkout-cancel");
      if (cancel) cancel.classList.remove("wwl-hidden");
    }
  }

  function initKiosk() {
    var params = new URLSearchParams(window.location.search);
    if (params.get("kiosk") === "1") {
      document.body.classList.add("kiosk");
      var back = $("#back-home");
      if (back) back.style.display = "none";
    }
    if (params.get("mode") === "addons") setMode("addons");
    if (params.get("event")) state.eventDate = params.get("event");
    if (CONFIG.eventDate) state.eventDate = CONFIG.eventDate;
    var ref = params.get("ref");
    if (ref && $("#ref")) $("#ref").value = ref;
    handleCheckoutReturn(params);
    updatePreorderWindow();
  }

  function init() {
    initLegalLinks();
    var restored = loadDraft();
    if (restored) {
      var draftBanner = $("#banner-draft-restored");
      if (draftBanner) draftBanner.classList.remove("wwl-hidden");
    }
    initKiosk();
    initMode();
    initProducts();
    $$("#name, #email, #senior, #ref, #notes, #terms-accept").forEach(function (el) {
      if (el) el.addEventListener("input", render);
      if (el) el.addEventListener("change", render);
    });
    var mainPay = $("#pay-btn-main");
    if (mainPay) mainPay.addEventListener("click", onPayClick);
    var backBtn = $("#back-step");
    if (backBtn) {
      backBtn.addEventListener("click", function () {
        if (state.step > 1) setStep(state.step - 1);
      });
    }
    var backReview = $("#back-step-review");
    if (backReview) {
      backReview.addEventListener("click", function () {
        if (state.step > 1) setStep(state.step - 1);
      });
    }
    var resetBtn = $("#reset-session");
    if (resetBtn) {
      resetBtn.addEventListener("click", resetSessionForNextGuest);
    }
    if (state.mode === "addons") {
      setMode("addons");
    } else {
      syncModeLinks();
      updatePageContext();
      applySectionVisibility();
    }
    setStep(1);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
