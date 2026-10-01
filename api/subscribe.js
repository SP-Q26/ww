/**
 * WW Journal newsletter bridge · POST /api/subscribe
 * Forwards validated signups to JOURNAL_SUBSCRIBE_WEBHOOK_URL (n8n or similar).
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseBody(req) {
  const raw = req.body;
  if (raw == null || raw === "") return {};
  if (typeof raw === "object") return raw;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  const body = parseBody(req);
  if (body === null) {
    return res.status(400).json({ ok: false, error: "invalid_json" });
  }

  const email = String(body.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ ok: false, error: "invalid_email" });
  }

  const webhookUrl = process.env.JOURNAL_SUBSCRIBE_WEBHOOK_URL;
  if (!webhookUrl) {
    return res.status(503).json({ ok: false, error: "subscribe_not_configured" });
  }

  const payload = {
    email,
    source: typeof body.source === "string" ? body.source : "ww_journal_home",
    page: typeof body.page === "string" ? body.page : null,
    tags: Array.isArray(body.tags) ? body.tags.map(String) : ["weddings-blog", "wwj"],
    receivedAt: new Date().toISOString(),
  };

  const headers = { "Content-Type": "application/json" };
  const secret = process.env.JOURNAL_SUBSCRIBE_WEBHOOK_SECRET;
  if (secret) {
    headers["x-wwj-subscribe-secret"] = secret;
  }

  try {
    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!upstream.ok) {
      return res.status(502).json({
        ok: false,
        error: "upstream_failed",
        status: upstream.status,
      });
    }
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ ok: false, error: "upstream_error" });
  }
}
