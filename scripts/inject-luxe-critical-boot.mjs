/**
 * DEPRECATED — do not inject splash on Vercel (breaks preview parity).
 * Kept so postbuild bridge scripts still find the path; delegates to uninject.
 */
import { spawnSync } from "node:child_process";
import path from "path";

const script = path.join(path.resolve(import.meta.dirname), "uninject-luxe-vercel-splash.mjs");
const r = spawnSync(process.execPath, [script], { stdio: "inherit" });
process.exit(r.status ?? 0);
