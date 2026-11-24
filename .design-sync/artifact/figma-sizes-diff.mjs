// Compares the sizes Figma's component variants are drawn at with the sizes
// the matched kit components' stylesheets write.
//
//   node .design-sync/artifact/figma-sizes-diff.mjs <components.json> <components-diff.json> --out <sizes.json>
//
// For every Figma page that figma-components-diff.mjs matched to kit
// components, and every variant on it, four measures are checked: the height,
// the auto-layout padding, the gap between children, and the corner radius.
// A measure is "in the kit" when the same px value appears in that property
// family in a stylesheet of a matched component's folder (heights: height,
// min-height, max-height, line-height and --*height* variables; padding:
// padding*; gap: gap, row-gap, column-gap and margins; radius: *radius).
// It is a value check, not a layout check: a height the kit writes elsewhere
// in the same component counts as present. The report says so.
import fs from "node:fs";

import { scanScss } from "./scss-scan.mjs";

const argv = process.argv.slice(2);
const [componentsPath, diffPath] = argv.filter((a) => !a.startsWith("--"));
const out = argv[argv.indexOf("--out") + 1];
if (!componentsPath || !diffPath || !argv.includes("--out")) {
  console.error(
    "usage: figma-sizes-diff.mjs <components.json> <components-diff.json> --out <sizes.json>",
  );
  process.exit(2);
}
const F = JSON.parse(fs.readFileSync(componentsPath, "utf8"));
const M = JSON.parse(fs.readFileSync(diffPath, "utf8"));
const { decls } = scanScss(process.cwd());

const FAMILY = {
  height: (p) => /^(min-|max-)?height$|^line-height$|^--.*height/.test(p),
  padding: (p) => /^padding|^--.*padding/.test(p),
  gap: (p) => /^(row-|column-)?gap$|^margin|^--.*(gap|margin)/.test(p),
  radius: (p) => /radius/.test(p),
};
const pxOf = (v) =>
  (String(v).match(/-?\d+(?:\.\d+)?px/g) ?? []).map((x) =>
    parseFloat(x.replace("-", "")),
  );

// px values per family, per kit component folder.
const kitFolder = new Map();
for (const c of JSON.parse(fs.readFileSync(diffPath, "utf8")).kitFolders ?? [])
  kitFolder.set(c.name, c.folder);
const valuesFor = (folders) => {
  const v = {
    height: new Set(),
    padding: new Set(),
    gap: new Set(),
    radius: new Set(),
  };
  for (const d of decls) {
    if (!folders.some((f) => d.file.startsWith(`${f}/`))) continue;
    for (const [fam, test] of Object.entries(FAMILY))
      if (test(d.prop)) for (const n of pxOf(d.value)) v[fam].add(n);
  }
  return v;
};

const result = { pages: [] };
for (const page of M.pages.filter((p) => p.match.kit.length)) {
  const folders = page.match.kit.map((k) => kitFolder.get(k)).filter(Boolean);
  const kv = valuesFor(folders);
  const sets = F.sets.filter((s) => s.page === page.page);
  const rows = [];
  for (const s of sets)
    for (const g of s.geometry ?? []) {
      const checks = [];
      const check = (fam, n, label) => {
        if (n == null || n === 0) return;
        checks.push({ measure: label, value: n, inKit: kv[fam].has(n) });
      };
      check("height", g.height, "height");
      if (g.padding) {
        const [t, r, b, l] = g.padding;
        if (t === b) check("padding", t, "padding top/bottom");
        else {
          check("padding", t, "padding top");
          check("padding", b, "padding bottom");
        }
        if (l === r) check("padding", l, "padding left/right");
        else {
          check("padding", l, "padding left");
          check("padding", r, "padding right");
        }
      }
      check("gap", g.gap, "gap");
      if (typeof g.radius === "number") check("radius", g.radius, "radius");
      else if (Array.isArray(g.radius))
        for (const n of new Set(g.radius)) check("radius", n, "radius");
      if (checks.length) rows.push({ set: s.name, variant: g.name, checks });
    }
  result.pages.push({
    page: page.page,
    kit: page.match.kit,
    folders,
    kitValues: Object.fromEntries(
      Object.entries(kv).map(([k, v]) => [k, [...v].sort((a, b) => a - b)]),
    ),
    variants: rows,
  });
}
fs.writeFileSync(out, `${JSON.stringify(result, null, 2)}\n`);
const all = result.pages.flatMap((p) => p.variants.flatMap((v) => v.checks));
console.error(
  `sizes: ${result.pages.length} pages, ${all.length} measures, ${all.filter((c) => c.inKit).length} in the kit`,
);
