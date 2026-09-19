(function () {
  "use strict";

  const AUTO_MS = 5000;
  const PAUSE_AFTER_INTERACT_MS = 10000;

  function origin() {
    const html = document.documentElement;
    return (html.getAttribute("data-origin") || "").replace(/\/$/, "") || window.location.origin;
  }

  function appendUtm(href, medium, slug) {
    try {
      const u = new URL(href, origin());
      if (!u.searchParams.get("utm_source")) u.searchParams.set("utm_source", "ww_journal");
      if (!u.searchParams.get("utm_medium")) u.searchParams.set("utm_medium", medium || "blog");
      if (!u.searchParams.get("utm_campaign")) u.searchParams.set("utm_campaign", "estate_rebrand_2026");
      if (slug) u.searchParams.set("utm_content", slug);
      return u.toString();
    } catch {
      return href;
    }
  }

  document.querySelectorAll("[data-ww-out]").forEach((el) => {
    const slug = el.getAttribute("data-ww-slug") || "";
    const medium = el.classList.contains("ww-tour-link") ? "deck" : "blog";
    const href = el.getAttribute("href");
    if (href && href.startsWith("/go/")) {
      const sep = href.includes("?") ? "&" : "?";
      el.setAttribute(
        "href",
        href + sep + "utm_content=" + encodeURIComponent(slug || "home")
      );
    } else if (href && href.startsWith("http")) {
      el.setAttribute("href", appendUtm(href, medium, slug));
    }
  });

  const form = document.getElementById("ww-capture-form");
  const msg = document.getElementById("ww-capture-msg");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("ww-email")?.value?.trim();
      if (!email) return;
      msg.textContent = "Sending…";
      msg.className = "ww-msg";
      try {
        const res = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            source: "ww_journal_home",
            page: "/",
            tags: ["weddings-blog", "journal-luxe-expand"]
          })
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.ok) {
          msg.textContent = "You are on the list. Watch for the next tip.";
          msg.className = "ww-msg ww-msg--ok";
          form.reset();
        } else {
          msg.textContent = "Something went wrong. Try again in a moment.";
          msg.className = "ww-msg ww-msg--err";
        }
      } catch {
        msg.textContent = "Could not reach the server. Try again later.";
        msg.className = "ww-msg ww-msg--err";
      }
    });
  }

  const deck = document.getElementById("ww-deck");
  if (!deck) return;

  const cards = deck.querySelectorAll(".ww-deck-card");
  const total = cards.length;
  if (!total) return;

  let index = 0;
  let timer = null;
  let pausedUntil = 0;

  const counter = document.getElementById("ww-deck-counter");
  const prev = document.getElementById("ww-deck-prev");
  const next = document.getElementById("ww-deck-next");

  function cardWidth() {
    const first = cards[0];
    if (!first) return deck.clientWidth;
    const gap = 14;
    return first.offsetWidth + gap;
  }

  function scrollToIndex(i) {
    index = ((i % total) + total) % total;
    deck.scrollTo({ left: index * cardWidth(), behavior: "smooth" });
    if (counter) counter.textContent = `${index + 1} / ${total}`;
  }

  function pause(ms) {
    pausedUntil = Date.now() + (ms || PAUSE_AFTER_INTERACT_MS);
    if (timer) clearInterval(timer);
    timer = null;
    schedule();
  }

  function schedule() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      if (Date.now() < pausedUntil) return;
      scrollToIndex(index + 1);
    }, AUTO_MS);
  }

  prev?.addEventListener("click", () => {
    scrollToIndex(index - 1);
    pause();
  });
  next?.addEventListener("click", () => {
    scrollToIndex(index + 1);
    pause();
  });
  deck.addEventListener("pointerdown", () => pause());
  deck.addEventListener("wheel", () => pause(), { passive: true });

  scrollToIndex(0);
  schedule();
})();
