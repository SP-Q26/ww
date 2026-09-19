const DESTINATIONS = {
  venue: "https://whisperingwoodsevents.com/",
  luxe: "https://whisperingwoodsluxe.com/home",
  tour: "https://whisperingwoodsevents.com/"
};

export default function handler(req, res) {
  const destKey = (req.query.dest || "venue").toLowerCase();
  const base = DESTINATIONS[destKey] || DESTINATIONS.venue;

  const params = new URLSearchParams();
  params.set("utm_source", req.query.utm_source || "ww_journal");
  params.set("utm_medium", req.query.utm_medium || "blog");
  params.set("utm_campaign", req.query.utm_campaign || "estate_rebrand_2026");
  if (req.query.utm_content) params.set("utm_content", req.query.utm_content);

  const join = base.includes("?") ? "&" : "?";
  const target = base + join + params.toString();

  res.setHeader("Cache-Control", "no-store");
  res.writeHead(302, { Location: target });
  res.end();
}
