// The postcss plugin emits the stylesheet next to the bundle, because rollup
// rejects an asset name that is an absolute or relative path. This promotes it
// to dist/styles.css -- the single path the package exports.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIST = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../dist",
);

const FORMAT_COPIES = ["esm/styles.css"].map((rel) => path.join(DIST, rel));
const TARGET = path.join(DIST, "styles.css");

const present = FORMAT_COPIES.filter((p) => fs.existsSync(p));

// Idempotent: a re-run after a completed build finds the stylesheet already
// promoted and only refreshes the format markers.
if (present.length === 0 && !fs.existsSync(TARGET)) {
  console.error(
    "No stylesheet found. Expected the postcss plugin to emit " +
      "dist/esm/styles.css -- check the `extract` option in rollup.config.mjs.",
  );
  process.exit(1);
}

if (present.length > 0) {
  // Identical by construction; assert it rather than trust it, since a mismatch
  // would mean the two formats disagree about styling.
  const contents = new Set(present.map((p) => fs.readFileSync(p, "utf8")));

  if (contents.size > 1) {
    console.error(
      "The per-format stylesheets differ. One of them would be dropped, so " +
        "the package would ship styles that do not match one of its entry " +
        "points.",
    );
    process.exit(1);
  }

  fs.renameSync(present[0], TARGET);

  for (const copy of present.slice(1)) fs.rmSync(copy);
}

// Node decides a .js file's format from the nearest package.json "type". The
// output tree uses the .js extension, so without this marker every file under
// dist/esm is parsed as CommonJS -- publint flagged all 849 of them. A
// per-directory marker is the standard fix and needs no renaming.
const FORMAT_MARKERS = [["esm", "module"]];

for (const [dir, type] of FORMAT_MARKERS) {
  const target = path.join(DIST, dir, "package.json");

  if (!fs.existsSync(path.dirname(target))) {
    console.error(`dist/${dir} is missing -- the build did not emit it.`);
    process.exit(1);
  }

  fs.writeFileSync(target, `${JSON.stringify({ type }, null, 2)}\n`);
}

const kb = Math.round(fs.statSync(TARGET).size / 1024);

const dropped = Math.max(present.length - 1, 0);

console.log(
  `dist/styles.css ready (${kb} KB)` +
    (dropped > 0 ? `, ${dropped} duplicate dropped` : "") +
    "; esm format marker written.",
);
