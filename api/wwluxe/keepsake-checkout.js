import { siteOriginFromRequest } from "../../sites/luxe/lib/wwluxe/stripe-catalog.mjs";
import {
  MMI_BRANDS,
  MMI_STATEMENT_SUFFIX,
  wwluxeKeepsakeSessionMetadata,
} from "../../lib/mmi/stripe-metadata.mjs";
import { stripeLineItemsForKeepsakeRows } from "../../lib/mmi/keepsake-checkout-lines.mjs";
import {
  wwlGuestCheckoutPromoParams,
  wwlGuestCheckoutTaxAndAddressParams,
  wwlStripeSecretFromEnv,
} from "../../lib/mmi/stripe-guest-checkout.mjs";

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

  const secret = wwlStripeSecretFromEnv();
  if (!secret) {
    return res.status(503).json({
      error: "stripe_not_configured",
      hint:
        "Set STRIPE_SECRET_KEY, WWLUXE_STRIPE_SECRET_KEY, or WWL_STRIPE_SECRET_KEY on Vercel",
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
    `${origin}/heirloom?checkout=success&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = body.cancel_url || `${origin}/heirloom?checkout=cancelled`;

  let lineItems;
  try {
    lineItems = stripeLineItemsForKeepsakeRows(body.lines, secret);
  } catch (err) {
    return res.status(400).json({ error: err.message || "invalid_line" });
  }

  const metadata = wwluxeKeepsakeSessionMetadata(body, contact);

  try {
    const session = await stripeCreateCheckoutSession(secret, {
      mode: "payment",
      line_items: lineItems,
      ...wwlGuestCheckoutTaxAndAddressParams(),
      ...wwlGuestCheckoutPromoParams(),
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: contact.email,
      payment_intent_data: {
        metadata,
        receipt_email: contact.email,
        statement_descriptor_suffix: MMI_STATEMENT_SUFFIX[MMI_BRANDS.WWLUXE],
      },
      metadata,
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
