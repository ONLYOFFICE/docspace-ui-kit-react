// Keeps a record of one artifact's uploaded assets in step with the disk.
// The record ({group: {name: {blob, size, type}}}) belongs to ONE artifact:
// an upload's id resolves only in the artifact it was uploaded to, so every
// artifact - ours is assets.json, another organization's gets a file of its
// own - has its own record.
//
//   node .design-sync/artifact/assets.mjs plan   --assets <record> [--out <plan.json>]
//   node .design-sync/artifact/assets.mjs record --assets <record> --ids <ids.json>
//
// Run from the repository root. Nothing here talks to claude.ai: uploads are
// made with Claude Code's Artifact tool (asset: true, at most 25 files per
// call), which is the only client that can.
//
// plan   lists every file to upload - never uploaded, or changed since its
//        upload - with the path to upload it from, and every record whose
//        file is gone. --out also writes it as JSON: [{group, name, file}].
//        A record that does not exist yet counts as empty, so a new artifact
//        gets a plan for all of it.
// record takes the ids the uploads returned, {"<group>/<name>": "<id>"},
//        writes them into the record with the size and type taken from the
//        disk (not from the upload result, which counts CRLF line endings),
//        and drops records whose file is gone. The record is created if
//        missing.
import fs from "node:fs";
import path from "node:path";

import { GROUPS, diffGroup, listGroup } from "./asset-groups.mjs";

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const REPO = process.cwd();
const mode = process.argv[2];
const recordPath = arg("assets");
if (!["plan", "record"].includes(mode) || !recordPath)
  throw new Error(
    "usage: assets.mjs plan --assets <record> [--out <plan.json>] | record --assets <record> --ids <ids.json>",
  );
const record = fs.existsSync(recordPath)
  ? JSON.parse(fs.readFileSync(recordPath, "utf8"))
  : {};
const TYPES = { ".svg": "image/svg+xml", ".png": "image/png" };

if (mode === "plan") {
  const plan = [];
  const gone = [];
  for (const group of Object.keys(GROUPS)) {
    const d = diffGroup(REPO, group, record[group]);
    for (const name of [...d.missing, ...d.changed])
      plan.push({
        group,
        name,
        file: path
          .relative(REPO, d.onDisk.get(name).file)
          .split(path.sep)
          .join("/"),
      });
    for (const name of d.gone) gone.push(`${group}/${name}`);
  }
  for (const p of plan)
    console.log(`upload ${p.group}/${p.name}  <-  ${p.file}`);
  for (const g of gone) console.log(`gone   ${g}`);
  console.log(
    `${plan.length} to upload, ${gone.length} to drop from ${recordPath}`,
  );
  if (arg("out"))
    fs.writeFileSync(arg("out"), `${JSON.stringify(plan, null, 2)}\n`);
} else {
  const idsPath = arg("ids");
  if (!idsPath) throw new Error("record needs --ids <ids.json>");
  const ids = JSON.parse(fs.readFileSync(idsPath, "utf8"));
  let written = 0;
  for (const [key, blob] of Object.entries(ids)) {
    const slash = key.indexOf("/");
    const group = key.slice(0, slash);
    const name = key.slice(slash + 1);
    if (!GROUPS[group]) throw new Error(`${key}: unknown group ${group}`);
    if (!/^[0-9a-f]{32}$/.test(blob))
      throw new Error(`${key}: ${blob} is not an asset id`);
    const onDisk = listGroup(REPO, group).get(name);
    if (!onDisk)
      throw new Error(`${key}: no such file in ${GROUPS[group].dir}`);
    record[group] = record[group] || {};
    record[group][name] = {
      blob,
      size: onDisk.size,
      type: TYPES[GROUPS[group].ext],
    };
    written++;
  }
  let dropped = 0;
  for (const group of Object.keys(GROUPS)) {
    if (!record[group]) continue;
    for (const name of diffGroup(REPO, group, record[group]).gone) {
      delete record[group][name];
      dropped++;
    }
    record[group] = Object.fromEntries(
      Object.entries(record[group]).sort(([a], [b]) => (a < b ? -1 : 1)),
    );
  }
  // Groups in the artifact's order.
  const ordered = Object.fromEntries(
    Object.keys(GROUPS)
      .filter((g) => record[g])
      .map((g) => [g, record[g]]),
  );
  fs.writeFileSync(recordPath, `${JSON.stringify(ordered, null, 2)}\n`);
  console.log(`${written} recorded, ${dropped} dropped in ${recordPath}`);
}
