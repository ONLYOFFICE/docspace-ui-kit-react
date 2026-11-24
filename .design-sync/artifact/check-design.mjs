// Checks a design made from the ONLYOFFICE Apps UI Kit design system against
// that system, and lists every value the design made up.
//
//   node .design-sync/artifact/check-design.mjs <file.html|dir> ...
//        [--tokens ds-export/project/tokens.json] [--json]
//
// A design passes when every colour, shadow, font size, spacing value and
// radius it writes is a token's value, it draws no icon of its own (inline
// <svg>), and it loads every Open Sans file the system ships, so that no
// script falls back to a system font. Exit code 1 when anything is found.
//
// What it cannot see: a hand-drawn look-alike of a kit component built only
// from token values. Rule 4 of the system's README still applies.
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = argv.indexOf(`--${name}`);
  if (i < 0) return dflt;
  const v = argv[i + 1];
  argv.splice(i, 2);
  return v;
};
const tokensPath = opt(
  "tokens",
  path.join("ds-export", "project", "tokens.json"),
);
const asJson = argv.includes("--json");
const inputs = argv.filter((a) => a !== "--json");
if (!inputs.length) {
  console.error(
    "usage: check-design.mjs <file.html|dir> ... [--tokens tokens.json] [--json]",
  );
  process.exit(2);
}
if (!fs.existsSync(tokensPath)) {
  console.error(
    `${tokensPath} not found: export the design system first (node .design-sync/artifact/export.mjs)`,
  );
  process.exit(2);
}

// ---------- what the system allows ----------
const T = JSON.parse(fs.readFileSync(tokensPath, "utf8"));
const norm = (v) => v.toLowerCase().replace(/\s+/g, "");
const rgbaOf = (v) => {
  v = v.trim().toLowerCase();
  let m = /^#([0-9a-f]{3,8})$/.exec(v);
  if (m) {
    let h = m[1];
    if (h.length <= 4) h = [...h].map((c) => c + c).join("");
    const n = (i) => parseInt(h.slice(i, i + 2), 16);
    return [n(0), n(2), n(4), h.length === 8 ? +(n(6) / 255).toFixed(2) : 1];
  }
  m = /^rgba?\(([^)]+)\)$/.exec(v);
  if (m) {
    const p = m[1]
      .split(/[\s,/]+/)
      .filter(Boolean)
      .map(Number);
    return [p[0], p[1], p[2], p.length > 3 ? +p[3].toFixed(2) : 1];
  }
  return null;
};
const key = (rgba) => rgba?.join(",");
const colorTokens = new Map();
for (const t of T.color?.tokens ?? []) {
  const vals = typeof t.value === "string" ? [t.value] : Object.values(t.value);
  for (const v of vals) {
    const k = key(rgbaOf(v));
    if (k && !colorTokens.has(k)) colorTokens.set(k, t.name);
  }
}
const lengths = (family) =>
  new Set((T[family]?.tokens ?? []).map((t) => String(t.value)));
const spacing = lengths("spacing");
const radius = lengths("radius");
const shadows = new Map(
  (T.shadow?.tokens ?? []).map((t) => [norm(t.value), t.name]),
);
const fontSizes = new Set(
  (T.type?.groups ?? []).flatMap((g) => g.styles.map((s) => s.fontSize)),
);
const normalFonts = (T.type?.fonts ?? [])
  .filter((f) => (f.style ?? "normal") === "normal")
  .map((f) => path.basename(f.file));

// ---------- what the design writes ----------
const files = inputs.flatMap(function collect(p) {
  const st = fs.statSync(p);
  if (st.isDirectory())
    return fs
      .readdirSync(p)
      .flatMap((n) =>
        n === "node_modules" || n === "ds" ? [] : collect(path.join(p, n)),
      );
  return /\.html?$/i.test(p) ? [p] : [];
});

const COLOR_RE = /#[0-9a-f]{3,8}\b|rgba?\([^()]*\)/gi;
const findings = [];
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const lineAt = (i) => text.slice(0, i).split("\n").length;
  const add = (kind, at, value, note) =>
    findings.push({ file, line: lineAt(at), kind, value, note });

  // CSS declarations, in <style> blocks and style="" attributes alike.
  const decls = [];
  for (const m of text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi))
    for (const d of m[1].matchAll(/([a-z-]+)\s*:\s*([^;{}]+)/gi))
      decls.push({
        prop: d[1].toLowerCase(),
        value: d[2],
        at: m.index + m[0].indexOf(m[1]) + d.index,
      });
  for (const m of text.matchAll(/\sstyle="([^"]*)"/gi))
    for (const d of m[1].matchAll(/([a-z-]+)\s*:\s*([^;]+)/gi))
      decls.push({ prop: d[1].toLowerCase(), value: d[2], at: m.index });

  for (const { prop, value, at } of decls) {
    const v = value.trim();
    if (/^(src|unicode-range|font-display)$/.test(prop)) continue;
    if (prop === "box-shadow") {
      if (/^none$/i.test(v) || /^var\([^()]*\)$/.test(v)) continue;
      if (!shadows.has(norm(v))) add("shadow", at, v, "not a shadow token");
      continue;
    }
    if (prop === "font-size") {
      if (/px$/.test(v) && !fontSizes.has(v))
        add("font-size", at, v, "no text style has this size");
    } else if (/^(padding|margin|gap|row-gap|column-gap)(-|$)/.test(prop)) {
      for (const px of v.match(/-?\d+(?:\.\d+)?px/g) ?? []) {
        const a = px.replace(/^-/, "");
        if (a !== "0px" && !spacing.has(a))
          add("spacing", at, `${prop}: ${v}`, `${a} is not a spacing token`);
      }
    } else if (/radius$/.test(prop)) {
      for (const px of v.match(/\d+(?:\.\d+)?px/g) ?? [])
        if (px !== "0px" && !radius.has(px))
          add("radius", at, `${prop}: ${v}`, `${px} is not a radius token`);
    } else if (prop === "font-family") {
      if (!/open sans|inherit|var\(/i.test(v))
        add("font", at, v, "the system's family is Open Sans");
    }
    if (
      /^--/.test(prop) ||
      /color|background|border|fill|stroke|outline|shadow/.test(prop)
    )
      for (const c of v.match(COLOR_RE) ?? []) {
        const k = key(rgbaOf(c));
        if (k && !colorTokens.has(k))
          add("colour", at, c, `${prop} - not a colour token`);
      }
  }

  // Colours written outside CSS: SVG fill/stroke attributes.
  for (const m of text.matchAll(/\s(fill|stroke|stop-color)="([^"]+)"/gi)) {
    const k = key(rgbaOf(m[2]));
    if (k && !colorTokens.has(k))
      add("colour", m.index, m[2], `${m[1]} attribute - not a colour token`);
  }

  // Icons drawn by hand.
  for (const m of text.matchAll(/<svg\b/gi))
    add(
      "icon",
      m.index,
      "<svg>",
      "inline SVG: take the icon from the Icons or Navigation group, or draw a placeholder",
    );

  // Fonts: a face for every normal-style file, or none at all.
  const faces = [
    ...text.matchAll(/@font-face\s*{[^}]*url\(["']?([^"')]+)/gi),
  ].map((m) => path.basename(m[1]));
  if (faces.length) {
    const missing = normalFonts.filter((f) => !faces.includes(f));
    if (missing.length)
      add(
        "font",
        text.search(/@font-face/i),
        `${faces.length} of ${normalFonts.length} Open Sans files`,
        `missing ${missing.length}: non-Latin text (Cyrillic, Greek, Vietnamese) falls back to a system font`,
      );
  }
}

// ---------- report ----------
if (asJson) {
  console.log(JSON.stringify({ files: files.length, findings }, null, 2));
} else {
  const byKind = new Map();
  for (const f of findings) byKind.set(f.kind, (byKind.get(f.kind) ?? 0) + 1);
  for (const f of findings)
    console.log(`${f.file}:${f.line}  ${f.kind}  ${f.value}  (${f.note})`);
  console.log(
    `\n${files.length} file(s), ${findings.length} finding(s)${
      findings.length
        ? `: ${[...byKind].map(([k, n]) => `${k} ${n}`).join(", ")}`
        : ""
    }`,
  );
}
process.exit(findings.length ? 1 : 0);
