const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ ok: false, error: "Invalid JSON" });
    }
  }

  const email = (body?.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ ok: false, error: "Valid email required" });
  }

  const payload = {
    email,
    source: body?.source || "blog",
    page: body?.page || "",
    tags: Array.isArray(body?.tags) ? body.tags : ["weddings-blog"],
    capturedAt: new Date().toISOString(),
    site: process.env.WW_WEDDINGS_SITE_ORIGIN || "https://whisperingwoodsweddings.com"
  };

  const webhook = process.env.N8N_WEDDINGS_SUBSCRIBE_WEBHOOK;
  if (webhook) {
    try {
      const upstream = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!upstream.ok) {
        return res.status(502).json({ ok: false, error: "Upstream failed" });
      }
    } catch {
      return res.status(502).json({ ok: false, error: "Upstream unreachable" });
    }
  }

  return res.status(200).json({ ok: true, queued: Boolean(webhook) });
}
