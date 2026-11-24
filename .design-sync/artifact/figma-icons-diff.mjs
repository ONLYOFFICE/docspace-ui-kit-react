// Compares the icons a Figma file publishes on its Icons page with the kit's
// SVG files.
//
//   node .design-sync/artifact/figma-icons-diff.mjs <components.json> --out <icons.json>
//
// Two parts.
//
// File-type icons. Figma draws them as sets "Master / 24|32|64|96" with a
// Format property named by extension (doc, xlsx, ics, "in process"). The kit
// names them by kind (word, cellCommon, calendar, folderInProgress), and
// utils/image-helpers/index.ts holds the kit's own table from extension to
// icon. A Figma format is matched through that table: the extension with a
// leading dot (".docx" -> word.svg), else a table key or file name equal to it
// ("archive" -> archive.svg). FORMAT_WORDS covers the few Figma names that are
// words, not extensions; each is listed in the output. Then the kit file must
// exist in assets/icons/<size>/.
//
// Other icons. Matched by name only: the Figma name and the kit file name,
// both reduced to lowercase letters and digits. Names differ often between
// the two ("Pencil" / pen-edit), so an unmatched name is a lead, not proof:
// comparing the drawings needs Figma's image export, which this token's seat
// is not allowed to call.
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const input = argv.find((a) => !a.startsWith("--"));
const out = argv[argv.indexOf("--out") + 1];
if (!input || !argv.includes("--out")) {
  console.error(
    "usage: figma-icons-diff.mjs <components.json> --out <icons.json>",
  );
  process.exit(2);
}
const F = JSON.parse(fs.readFileSync(input, "utf8"));
const repo = process.cwd();

// ---------- the kit's extension table ----------
const HELPERS = "utils/image-helpers/index.ts";
const src = fs.readFileSync(path.join(repo, HELPERS), "utf8");
const enumNames = Object.fromEntries(
  [...src.matchAll(/^\s+(\w+) = "([^"]+)",/gm)].map((m) => [m[1], m[2]]),
);
const table = {}; // file -> [keys]
for (const m of src.matchAll(/\[IconNames\.(\w+)\]:\s*\[([^\]]*)\]/g))
  table[enumNames[m[1]]] = [...m[2].matchAll(/"([^"]+)"/g)].map((x) => x[1]);

// Figma format names that are words, not extensions.
export const FORMAT_WORDS = {
  book: "ebook",
  complete: "folderComplete",
  "in process": "folderInProgress",
  neutral: "file",
  media: "video",
};
const iconForFormat = (fmt) => {
  const f = fmt.toLowerCase();
  const keys = [`.${f}`, f, FORMAT_WORDS[f]].filter(Boolean);
  for (const [file, list] of Object.entries(table))
    if (list.some((k) => keys.includes(k)))
      return { file, via: list.find((k) => keys.includes(k)) };
  for (const file of Object.keys(table)) {
    const name = file.replace(/\.svg$/, "").toLowerCase();
    if (name === f || name === FORMAT_WORDS[f]?.toLowerCase())
      return { file, via: "file name" };
  }
  return null;
};

const formats = [];
for (const s of F.sets.filter((s) => /^Master \/ \d+$/.test(s.name))) {
  const size = s.name.split("/ ")[1];
  for (const fmt of s.properties.Format?.options ?? []) {
    const hit = iconForFormat(fmt);
    const exists =
      hit && fs.existsSync(path.join(repo, "assets", "icons", size, hit.file));
    formats.push({
      size,
      format: fmt,
      kit: hit ? `${size}/${hit.file}` : null,
      via: hit?.via ?? null,
      status: !hit ? "no-kit-icon" : exists ? "ok" : "no-file-at-size",
    });
  }
}
// Kit file-type icons Figma draws no format for.
const figmaFiles = new Set(
  formats.filter((f) => f.kit).map((f) => f.kit.split("/").pop()),
);
const kitOnlyFormats = Object.keys(table).filter(
  (f) => !f.startsWith("room/") && !figmaFiles.has(f),
);

// ---------- other icons, by name ----------
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const svgs = [];
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".svg"))
      svgs.push(path.relative(repo, p).split(path.sep).join("/"));
  }
};
walk(path.join(repo, "assets"));
const kitByName = new Map();
for (const f of svgs) {
  const base = path.basename(f).replace(/\.react\.svg$|\.svg$/, "");
  // The whole name ("external.link" -> externallink) is an exact match; the
  // last dotted word ("catalog.trash" -> trash) a partial one.
  const whole = norm(base);
  const last = norm(base.split(".").pop());
  for (const [key, how] of [
    [whole, "exact"],
    [last, "last word"],
  ]) {
    if (key.length < 2) continue;
    if (!kitByName.has(key)) kitByName.set(key, []);
    if (!kitByName.get(key).some((h) => h.file === f))
      kitByName.get(key).push({ file: f, how });
  }
}
const SKIP_SETS = /^Master \/|^For empty screen$|^Flags\d+$|^Component \d+$/;
const named = [];
const seen = new Set();
const add = (name, frame, kind) => {
  const key = `${frame}|${name}`;
  if (seen.has(key)) return;
  seen.add(key);
  const n = norm(name);
  const hits = n.length < 2 ? [] : (kitByName.get(n) ?? []);
  const exact = hits.filter((h) => h.how === "exact");
  named.push({
    name,
    frame,
    kind,
    kit: (exact.length ? exact : hits).slice(0, 4).map((h) => h.file),
    status: exact.length ? "ok" : hits.length ? "partial" : "no-name-match",
  });
};
for (const c of F.components.filter((c) => c.page === "Icons"))
  add(c.name, c.frame ?? "", "icon");
for (const s of F.sets.filter(
  (s) => s.page === "Icons" && !SKIP_SETS.test(s.name),
))
  add(s.name, s.frame ?? "", "set");

const result = {
  helpers: HELPERS,
  formatWords: FORMAT_WORDS,
  formats,
  kitOnlyFormats,
  named,
  kitSvgCount: svgs.length,
};
fs.writeFileSync(out, `${JSON.stringify(result, null, 2)}\n`);
const c = (a, s) => a.filter((x) => x.status === s).length;
console.error(
  `formats ${formats.length}: ok ${c(formats, "ok")}, no kit icon ${c(formats, "no-kit-icon")}, no file at size ${c(formats, "no-file-at-size")}; kit-only formats ${kitOnlyFormats.length}; named icons ${named.length}: exact ${c(named, "ok")}, by last word ${c(named, "partial")}, none ${c(named, "no-name-match")}`,
);
