// Writes a complete copy of the Design System artifact to a folder: every
// file build.mjs publishes, plus the file behind each uploaded asset, so the
// copy needs neither claude.ai nor the asset store.
//
//   node .design-sync/artifact/export.mjs [--out <dir>] [--assets <record>]
//
// <dir> defaults to ds-export/ at the repository root (gitignored).
//
// Run from the repository root. It needs ds-bundle/ (a design-sync build; see
// .design-sync/README.md) because build.mjs does. Each asset is copied from
// the folder its group mirrors (asset-groups.mjs) and checked against the
// record (default assets.json): a file missing from disk fails the export; a
// file whose size differs from its upload is copied and reported, because the
// artifact then holds another revision of it. Output: <dir>/project/ in the
// artifact's layout, design-system.json included, each asset at
// project/assets/<Group>/<file> beside that group's README.md. The copy's
// index names each asset by that path (`file`) instead of its upload id, and
// every path in it is relative to project/, so the folder stands on its own
// and is checked to: an index path with no file behind it fails the export.
// It is a copy to read and share, not something to publish: a published
// artifact needs upload ids (see "Publishing in another organization").
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { GROUPS, assetBytes, listGroup } from "./asset-groups.mjs";

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const REPO = process.cwd();
const HERE = path.join(REPO, ".design-sync", "artifact");
// Default: ds-export/ at the repository root, gitignored like ds-bundle/.
const OUT = arg("out") || path.join(REPO, "ds-export");
const RECORD = arg("assets") || path.join(HERE, "assets.json");
if (!fs.existsSync(path.join(REPO, "ds-bundle", "_ds_bundle.js")))
  throw new Error("ds-bundle/ is missing: run /design-sync first");

// 1. The artifact's own files, exactly as a publish would send them.
execFileSync(
  process.execPath,
  [
    path.join(HERE, "build.mjs"),
    "--out",
    OUT,
    "--assets",
    RECORD,
    "--by",
    "export",
    "--note",
    "Exported copy",
  ],
  { stdio: "inherit" },
);
// build.mjs leaves the index beside project/, since a publish sends it last;
// in a copy it belongs inside.
fs.renameSync(
  path.join(OUT, "design-system.index.json"),
  path.join(OUT, "project", "design-system.json"),
);

// 2. The uploaded assets, from the folders they mirror.
const record = JSON.parse(fs.readFileSync(RECORD, "utf8"));
const problems = [];
const differs = [];
let copied = 0;
for (const [group, files] of Object.entries(record)) {
  if (!GROUPS[group]) {
    problems.push(`${group}: no source folder known for this group`);
    continue;
  }
  const onDisk = listGroup(REPO, group);
  for (const [name, { size }] of Object.entries(files)) {
    const src = onDisk.get(name);
    if (!src) {
      problems.push(`${group}/${name}: not found in ${GROUPS[group].dir}`);
      continue;
    }
    if (src.size !== size)
      differs.push(
        `${group}/${name}: ${src.size} bytes on disk, ${size} uploaded`,
      );
    const dest = path.join(OUT, "project", "assets", group, ...name.split("/"));
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, assetBytes(src.file));
    copied++;
  }
}

// 3. Point the index at the copies. In the artifact an asset is named by its
// upload id, which resolves in that one artifact only; here each copied asset
// gets a `file` path instead, relative to project/ like `libraries[].file`.
// An asset that was not copied keeps its id, and is reported above.
const indexPath = path.join(OUT, "project", "design-system.json");
const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
let relinked = 0;
for (const [group, { files }] of Object.entries(index.assetGroups || {}))
  for (const [name, entry] of Object.entries(files)) {
    const file = `assets/${group}/${name}`;
    const copy = path.join(OUT, "project", ...file.split("/"));
    if (!fs.existsSync(copy)) continue;
    delete entry.blob;
    entry.file = file;
    // The size of the file in the copy, which differs from the upload's for
    // an asset reported above as another revision.
    entry.size = fs.statSync(copy).size;
    relinked++;
  }
// build.mjs names the README from the artifact's root (project/README.md);
// the copy's index sits inside project/, so every path is relative to it.
if (index.docs?.readme?.startsWith("project/"))
  index.docs.readme = index.docs.readme.slice("project/".length);
fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);

// 4. Every path the index names has to exist in the copy.
const named = [
  ...(index.libraries || []).map((l) => l.file),
  index.docs?.readme,
  ...Object.values(index.assetGroups || {}).flatMap(({ files }) =>
    Object.values(files)
      .map((f) => f.file)
      .filter(Boolean),
  ),
].filter(Boolean);
for (const file of named)
  if (!fs.existsSync(path.join(OUT, "project", ...file.split("/"))))
    problems.push(`design-system.json names ${file}, which is not in the copy`);

console.log(`${copied} asset files copied into ${path.join(OUT, "project")}`);
console.log(
  `${relinked} assets linked by local path in design-system.json, ${named.length} paths checked`,
);
if (differs.length)
  console.warn(
    `${differs.length} copied from the repository but not byte-identical to the upload ` +
      `(the artifact holds another revision; assets.mjs plan lists them):\n  ${differs.join("\n  ")}`,
  );
if (problems.length) {
  console.error(`${problems.length} left out:\n  ${problems.join("\n  ")}`);
  process.exitCode = 1;
}
