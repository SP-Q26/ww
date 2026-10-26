#!/usr/bin/env node
/**
 * WW dual-project gates: luxe=main, journal=journal; gate-only commits skip.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const script = path.join(root, "scripts/vercel-should-build-ww.sh");

function run(product, files) {
  const r = spawnSync("bash", [script, product], {
    cwd: root,
    env: { ...process.env, WW_IGNORE_TEST_FILES: files.join("\n"), VERCEL_GIT_COMMIT_REF: product === "luxe" ? "main" : "journal" },
    encoding: "utf8",
  });
  return r.status ?? 1;
}

const cases = [
  { label: "journal export only", product: "journal", files: ["public/data/pages.json"], want: 1 },
  { label: "gate-only restore", product: "journal", files: ["scripts/ensure-package-scripts.mjs", "package.json"], want: 0 },
  { label: "wrong branch luxe on journal paths", product: "luxe", files: ["public/foo"], want: 0, ref: "journal" },
  { label: "docs only", product: "journal", files: ["docs/foo.md"], want: 0 },
];

let fail = 0;
for (const c of cases) {
  const env = {
    ...process.env,
    WW_IGNORE_TEST_FILES: c.files.join("\n"),
    VERCEL_GIT_COMMIT_REF: c.ref ?? (c.product === "luxe" ? "main" : "journal"),
  };
  const r = spawnSync("bash", [script, c.product], { cwd: root, env, encoding: "utf8" });
  const exit = r.status ?? 1;
  const build = exit === 1;
  const wantBuild = c.want === 1;
  if (build !== wantBuild) {
    console.log(`FAIL ${c.label}: exit ${exit} (want build=${wantBuild})`);
    fail++;
  } else {
    console.log(`OK ${c.label}: ${build ? "BUILD" : "SKIP"}`);
  }
}

process.exit(fail ? 1 : 0);
