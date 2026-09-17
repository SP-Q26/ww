#!/usr/bin/env node
/**
 * Seed WWLuxe products on MMI Stripe (test or live).
 * Usage:
 *   STRIPE_SECRET_KEY=sk_test_… node scripts/seed-mmi-wwluxe-stripe-test.mjs
 *   STRIPE_SECRET_KEY=sk_live_… node scripts/seed-mmi-wwluxe-stripe.mjs
 * Idempotent: skips SKUs that already exist (metadata.mmi_internal_sku).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  WWLUXE_STRIPE_PRODUCTS,
  stripePostProductParams,
} from "../lib/mmi/wwluxe-stripe-products.mjs";
import { WWLUXE_SKU_TAX } from "../lib/mmi/stripe-product-tax.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const secret = process.env.STRIPE_SECRET_KEY || process.env.WWLUXE_STRIPE_SECRET_KEY;
const live = secret?.startsWith("sk_live_");
const test = secret?.startsWith("sk_test_");
if (!secret || (!live && !test)) {
  console.error("Set STRIPE_SECRET_KEY=sk_test_… or sk_live_… (MMI account only)");
  process.exit(1);
}

async function stripe(path, body) {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body).toString(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || res.statusText);
  return json;
}

function flatten(obj, prefix = "") {
  const pairs = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}[${k}]` : k;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      pairs.push(...flatten(v, key));
    } else if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (typeof item === "object") pairs.push(...flatten(item, `${key}[${i}]`));
        else pairs.push([`${key}[${i}]`, String(item)]);
      });
    } else {
      pairs.push([key, String(v)]);
    }
  }
  return pairs;
}

async function listExistingSkus() {
  const res = await fetch("https://api.stripe.com/v1/products?limit=100", {
    headers: { Authorization: `Bearer ${secret}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || "list failed");
  const set = new Set();
  for (const p of json.data || []) {
    const sku = p.metadata?.mmi_internal_sku || p.metadata?.wwluxe_sku;
    if (sku) set.add(sku);
  }
  return set;
}

async function listAllBySku() {
  const res = await fetch("https://api.stripe.com/v1/products?limit=100", {
    headers: { Authorization: `Bearer ${secret}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || "list failed");
  const map = new Map();
  for (const p of json.data || []) {
    const sku = p.metadata?.mmi_internal_sku || p.metadata?.wwluxe_sku;
    if (sku) map.set(sku, p);
  }
  return map;
}

async function patchProductTax(productId, sku) {
  const tax = WWLUXE_SKU_TAX[sku];
  if (!tax) return;
  const body = {
    tax_code: tax.tax_code,
    shippable: tax.shippable ? "true" : "false",
  };
  await stripe(`/products/${productId}`, body);
}

async function main() {
  const existing = await listExistingSkus();
  const created = [];
  for (const row of WWLUXE_STRIPE_PRODUCTS) {
    if (existing.has(row.sku)) {
      console.log("skip", row.sku);
      continue;
    }
    const params = stripePostProductParams(row);
    const body = Object.fromEntries(flatten(params));
    const product = await stripe("/products", body);
    await patchProductTax(product.id, row.sku);
    created.push({
      sku: row.sku,
      product_id: product.id,
      price_id: product.default_price,
    });
    console.log("created", row.sku, product.id, product.default_price);
  }

  const bySku = await listAllBySku();
  const xanoRows = [];
  const mdLines = [
    `# MMI Stripe · ${live ? "live" : "test"} mode · WWLuxe catalog IDs`,
    "",
    `**Account:** MMI · mode \`${live ? "live" : "test"}\``,
    "",
    "| \`mmi_internal_sku\` | \`prod_…\` | \`price_…\` | ¢ |",
    "|--------------------|----------|-----------|---|",
  ];
  for (const row of WWLUXE_STRIPE_PRODUCTS) {
    const p = bySku.get(row.sku);
    if (!p) continue;
    const priceId =
      typeof p.default_price === "string" ? p.default_price : p.default_price?.id || "";
    mdLines.push(
      `| \`${row.sku}\` | \`${p.id}\` | \`${priceId}\` | ${row.unit_amount} |`
    );
    xanoRows.push({
      sku: row.sku,
      stripe_price_id: priceId,
      amount_cents: row.unit_amount,
      mmi_lane: row.sku.startsWith("WWL-DEPOSIT") || row.sku.startsWith("WWL-ESTATE") || row.sku.startsWith("WWL-CHALET")
        ? "wwluxe_estate_booking"
        : "wwluxe_heirloom",
      active: row.active !== false,
    });
  }

  const mdPath = path.join(root, "docs/luxe", live ? "STRIPE_IDS_LIVE.md" : "STRIPE_IDS_TEST.md");
  fs.writeFileSync(mdPath, mdLines.join("\n") + "\n");
  console.log("\nWrote", mdPath);
  if (live) {
    const jsonPath = path.join(root, "docs/luxe/xano-pastes/wwl_stripe_sku_seed.live.json");
    fs.writeFileSync(jsonPath, JSON.stringify(xanoRows, null, 2) + "\n");
    console.log("Wrote", jsonPath);
  }
  if (created.length) {
    console.log("\nNewly created:", JSON.stringify(created, null, 2));
  }
  if (live) {
    console.log("\nNext: Xano WWL_STRIPE_SECRET_KEY=sk_live_… + update wwl_stripe_sku from .live.json");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
