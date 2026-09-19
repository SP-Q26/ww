/**
 * Build heirloom-welcome.json (Lottie) for home welcome splash.
 * Tree = embedded static SVG; rings = vector layers (GPU-friendly playback).
 *
 * Regenerate after editing heirloom-splash-tree-static.svg:
 *   node scripts/generate-heirloom-welcome-lottie.mjs
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const STATIC_SVG = path.join(
  ROOT,
  "sites/luxe/public/whispering-woods-luxe/assets/heirloom-splash-tree-static.svg"
);
const OUT_JSON = path.join(
  ROOT,
  "sites/luxe/public/whispering-woods-luxe/assets/heirloom-welcome.json"
);

const FR = 30;
const DURATION_FR = 48; // 1.6s @ 30fps

const sk = (k) => ({ a: 0, k });
const anim = (keyframes) => ({ a: 1, k: keyframes });

const svgRaw = fs.readFileSync(STATIC_SVG, "utf8").trim();
const svgB64 = Buffer.from(svgRaw).toString("base64");
const dataUrl = `data:image/svg+xml;base64,${svgB64}`;

const GOLD = [0.776, 0.631, 0.357, 1];
const SAGE = [0.482, 0.553, 0.478, 1];

function ringLayer(ind, nm, size, color, w, rotEnd, rotFrames) {
  return {
    ddd: 0,
    ind,
    ty: 4,
    nm,
    sr: 1,
    ks: {
      o: sk(100),
      r: anim([
        { t: 0, s: [0] },
        { t: rotFrames, s: [rotEnd] },
      ]),
      p: sk([80, 80, 0]),
      a: sk([0, 0, 0]),
      s: sk([100, 100, 100]),
    },
    ao: 0,
    shapes: [
      {
        ty: "gr",
        it: [
          {
            ty: "el",
            p: sk([0, 0]),
            s: sk([size, size]),
            d: 1,
          },
          {
            ty: "st",
            c: sk(color),
            o: sk(100),
            w: sk(w),
            lc: 2,
            lj: 2,
          },
          {
            ty: "tr",
            p: sk([0, 0]),
            a: sk([0, 0]),
            s: sk([100, 100]),
            r: sk(0),
            o: sk(100),
          },
        ],
      },
    ],
    ip: 0,
    op: DURATION_FR,
    st: 0,
    bm: 0,
  };
}

const treeLayer = {
  ddd: 0,
  ind: 3,
  ty: 2,
  nm: "tree",
  refId: "tree_img",
  sr: 1,
  ks: {
    o: anim([
      { t: 0, s: [0] },
      { t: 21, s: [100] },
    ]),
    r: sk(0),
    p: sk([80, 80, 0]),
    a: sk([80, 80, 0]),
    s: anim([
      { t: 0, s: [94, 94, 100] },
      { t: 21, s: [100, 100, 100] },
    ]),
  },
  ao: 0,
  ip: 0,
  op: DURATION_FR,
  st: 0,
  bm: 0,
};

const lottie = {
  v: "5.7.4",
  fr: FR,
  ip: 0,
  op: DURATION_FR,
  w: 160,
  h: 160,
  nm: "Heirloom welcome",
  ddd: 0,
  assets: [
    {
      id: "tree_img",
      w: 160,
      h: 160,
      u: "",
      p: dataUrl,
      e: 1,
    },
  ],
  layers: [
    ringLayer(1, "ring_gold", 116, GOLD, 2.2, 360, 33),
    ringLayer(2, "ring_sage", 104, SAGE, 1.6, -360, 50),
    treeLayer,
  ],
};

fs.writeFileSync(OUT_JSON, JSON.stringify(lottie));
console.log("wrote", OUT_JSON, `(${Math.round(fs.statSync(OUT_JSON).size / 1024)} KB)`);
