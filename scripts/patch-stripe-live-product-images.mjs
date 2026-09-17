#!/usr/bin/env node
/**
 * Set live Stripe product images to Vercel-hosted WWLuxe medallion SVGs.
 * Usage:
 *   WWLUXE_STRIPE_IMAGE_ORIGIN=https://luxe-omega.vercel.app \
 *   STRIPE_SECRET_KEY=sk_live_… node scripts/patch-stripe-live-product-images.mjs
 */
import { WWLUXE_STRIPE_PRODUCTS } from "../lib/mmi/wwluxe-stripe-products.mjs";

const secret = process.env.STRIPE_SECRET_KEY || process.env.WWLUXE_STRIPE_SECRET_KEY;
const origin = (process.env.WWLUXE_STRIPE_IMAGE_ORIGIN || "https://luxe-omega.vercel.app").replace(
  /\/$/,
  ""
);

if (!secret?.startsWith("sk_live_")) {
  console.error("Set STRIPE_SECRET_KEY=sk_live_… (MMI live only)");
  process.exit(1);
}

/** @type {Record<string, string>} */
const SKU_FILE = {
  "WWL-DEPOSIT-710": "estate-deposit.png",
  "WWL-ESTATE-BALANCE-710": "estate-remainder.png",
  "WWL-ESTATE-1420": "estate-deposit.png",
  "WWL-CHALET-PREORDER-1420": "chalet.png",
  "WWL-ALBUM-HEIRLOOM-955": "album.png",
  "WWL-DIGITAL-395": "digital.png",
  "WWL-FRAME-425": "frame.png",
  "WWL-RETOUCH-7-195": "retouch.png",
  "WWL-UPGRADE-FINEART-395": "fineart.png",
  "WWL-MINI-PARENT-345": "mini.png",
  "WWL-SPREAD-1-55": "spread.png",
  "WWL-SPREAD-5-255": "spread.png",
};

async function listProducts() {
  const res = await fetch("https://api.stripe.com/v1/products?limit=100", {
    headers: { Authorization: `Bearer ${secret}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || "list products failed");
  const bySku = new Map();
  for (const p of json.data || []) {
    const sku = p.metadata?.mmi_internal_sku || p.metadata?.wwluxe_sku;
    if (sku) bySku.set(sku, p.id);
  }
  return bySku;
}

async function patchImage(productId, url) {
  const body = new URLSearchParams();
  body.append("images[0]", url);
  const res = await fetch(`https://api.stripe.com/v1/products/${productId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || `patch ${productId} failed`);
  return json;
}

async function main() {
  const bySku = await listProducts();
  for (const row of WWLUXE_STRIPE_PRODUCTS) {
    const file = SKU_FILE[row.sku];
    if (!file) continue;
    const productId = bySku.get(row.sku);
    if (!productId) {
      console.warn("missing live product for", row.sku);
      continue;
    }
    const url = `${origin}/heirloom/assets/stripe-products/${file}`;
    await patchImage(productId, url);
    console.log("ok", row.sku, url);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
