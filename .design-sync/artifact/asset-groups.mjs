// Where each asset group of the Design System artifact comes from. Every
// group mirrors one folder of this repository file for file, so any artifact
// - ours or one another organization publishes - can be filled from a
// checkout alone. build.mjs, assets.mjs and export.mjs all read this table.
import fs from "node:fs";
import path from "node:path";

export const GROUPS = {
  Logos: { dir: "assets/logo", ext: ".svg" },
  Screenshots: { dir: ".design-sync/screenshots", ext: ".png" },
  Icons: { dir: "assets/icons", ext: ".svg" },
  Navigation: { dir: ".design-sync/artifact/nav-icons", ext: ".svg" },
};

// The file's bytes as they are uploaded and copied: an SVG with CRLF folded to
// LF, so a checkout's line endings never count as a change.
export const assetBytes = (file) => {
  const bytes = fs.readFileSync(file);
  return file.endsWith(".svg")
    ? Buffer.from(bytes.toString("utf8").replace(/\r\n/g, "\n"))
    : bytes;
};

// Map of name (path below the group folder, `/`-separated) to
// { file, size } for every file of the group on disk.
export const listGroup = (repo, group) => {
  const { dir, ext } = GROUPS[group];
  const root = path.join(repo, ...dir.split("/"));
  const out = new Map();
  if (!fs.existsSync(root)) return out;
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.name.endsWith(ext))
        out.set(path.relative(root, full).split(path.sep).join("/"), {
          file: full,
          size: assetBytes(full).length,
        });
    }
  };
  walk(root);
  return out;
};

// What a record ({group: {name: {blob, size, type}}}) lacks against the disk:
// files never uploaded, files changed since their upload, and records whose
// file is gone.
export const diffGroup = (repo, group, record = {}) => {
  const onDisk = listGroup(repo, group);
  const missing = [];
  const changed = [];
  for (const [name, { size }] of onDisk) {
    if (!record[name]) missing.push(name);
    else if (record[name].size !== size) changed.push(name);
  }
  const gone = Object.keys(record).filter((name) => !onDisk.has(name));
  return { onDisk, missing, changed, gone };
};
