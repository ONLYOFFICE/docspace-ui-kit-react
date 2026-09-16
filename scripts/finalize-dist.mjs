// Writes the per-directory package.json markers the emitted tree needs.
// (This used to promote the extracted stylesheet to dist/styles.css as well;
// the build now emits one CSS file per module and scripts/order-styles.mjs
// assembles the bundle from them.)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIST = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../dist",
);

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

console.log("esm format marker written.");
