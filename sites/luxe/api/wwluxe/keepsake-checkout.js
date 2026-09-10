import {
  lineItemFromPayloadRow,
  siteOriginFromRequest,
} from "../../lib/wwluxe/stripe-catalog.mjs";

function flattenParams(obj, prefix = "") {
  const out = [];
  if (obj === null || obj === undefined) return out;
  if (typeof obj !== "object") {
    out.push([prefix, String(obj)]);
    return out;
  }
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      out.push(...flattenParams(item, `${prefix}[${i}]`));
    });
    return out;
  }
  for (const [key, value] of Object.entries(obj)) {
    const next = prefix ? `${prefix}[${key}]` : key;
    if (value === undefined) continue;
    if (value !== null && typeof value === "object") {
      out.push(...flattenParams(value, next));
    } else {
      out.push([next, String(value)]);
    }
  }
  return out;
}

async function stripeCreateCheckoutSession(secret, params) {
  const body = new URLSearchParams();
  for (const [k, v] of flattenParams(params)) {
    body.append(k, v);
  }
  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const json = await res.json();
  if (!res.ok) {
    const msg = json?.error?.message || "stripe_error";
    throw new Error(msg);
  }
  return json;
}

function parseBody(req) {
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return null;
    }
  }
  return body;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const secret = process.env.STRIPE_SECRET_KEY || process.env.WWLUXE_STRIPE_SECRET_KEY;
  if (!secret) {
    return res.status(503).json({
      error: "stripe_not_configured",
      hint: "Set STRIPE_SECRET_KEY or WWLUXE_STRIPE_SECRET_KEY on Vercel for /api/wwluxe/keepsake-checkout",
    });
  }

  const body = parseBody(req);
  if (!body || !Array.isArray(body.lines) || !body.lines.length) {
    return res.status(400).json({ error: "missing_lines" });
  }

  const contact = body.contact || {};
  if (!contact.email || !contact.name) {
    return res.status(400).json({ error: "missing_contact" });
  }

  const origin = siteOriginFromRequest(req);
  const successUrl =
    body.success_url ||
    `${origin}/order?checkout=success&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = body.cancel_url || `${origin}/order?checkout=cancelled`;

  let lineItems;
  try {
    lineItems = body.lines.map(lineItemFromPayloadRow);
  } catch (err) {
    return res.status(400).json({ error: err.message || "invalid_line" });
  }

  const metadata = {
    wwluxe_source: body.source || "order_web",
    wwluxe_email: String(contact.email).slice(0, 500),
    wwluxe_name: String(contact.name).slice(0, 500),
    wwluxe_senior: String(contact.senior || "").slice(0, 200),
    wwluxe_ref: String(contact.ref || "").slice(0, 200),
    wwluxe_cover: String(contact.cover || "").slice(0, 50),
    wwluxe_mode: String(contact.mode || "").slice(0, 50),
    wwluxe_terms: String(body.terms_version || "").slice(0, 50),
  };

  try {
    const seniorNote = contact.senior
      ? ` for ${String(contact.senior).slice(0, 80)}`
      : "";
    const session = await stripeCreateCheckoutSession(secret, {
      mode: "payment",
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: contact.email,
      client_reference_id: contact.ref || undefined,
      metadata,
      payment_intent_data: {
        metadata,
        description: `Whispering Woods Luxe · Chalet reservation${seniorNote}`,
        receipt_email: contact.email,
      },
      custom_text: {
        submit: {
          message:
            "Complete your reservation. Stripe will email your receipt. Our studio will follow up with your Chalet design consult.",
        },
        after_submit: {
          message:
            "Thank you. Your heirloom collection is in motion. We will reach out shortly with next steps from the Chalet atelier.",
        },
      },
      allow_promotion_codes: false,
      billing_address_collection: "auto",
      phone_number_collection: { enabled: true },
    });

    return res.status(200).json({
      checkout_url: session.url,
      session_id: session.id,
    });
  } catch (err) {
    console.error("wwluxe keepsake checkout", err);
    return res.status(502).json({ error: "checkout_failed", message: err.message });
  }
}
