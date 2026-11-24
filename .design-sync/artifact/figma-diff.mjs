// Compares the styles a Figma file publishes with what the kit's code uses,
// and writes the differences as Markdown.
//
//   node .design-sync/artifact/figma-diff.mjs <figma-styles.json> --out <diff.md>
//
// <figma-styles.json> comes from figma-styles.mjs. The code side is the same
// inventory the design system's tokens are built from (tokens.mjs): both
// palettes, used or not, the text styles Text / Link elements use, and every
// literal shadow. Nothing is matched by name - Figma and the code name things
// differently - only by value.
//
// The portal's colour schemes are not in the kit: the server defines them
// (CustomColorThemesSettings.cs). When a DocSpace server checkout is beside
// this one - ../DocSpace/server, or DOCSPACE_SERVER_ROOT - their colours are
// a third source; without it those styles count as not in code.
import fs from "node:fs";
import path from "node:path";

import { SOURCE_DIRS } from "./scss-scan.mjs";
import { buildTokens } from "./tokens.mjs";

const argv = process.argv.slice(2);
const input = argv.find((a) => !a.startsWith("--"));
const out = argv[argv.indexOf("--out") + 1];
if (!input || !argv.includes("--out")) {
  console.error("usage: figma-diff.mjs <figma-styles.json> --out <diff.md>");
  process.exit(2);
}
const F = JSON.parse(fs.readFileSync(input, "utf8"));
const T = buildTokens(process.cwd());

// ---------- normalising ----------
const rgba = (v) => {
  v = String(v).trim().toLowerCase();
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
const ckey = (v) => rgba(v)?.join(",");
const shadowKey = (v) =>
  String(v)
    .toLowerCase()
    .split(/,(?![^(]*\))/)
    .map((layer) =>
      layer
        .trim()
        .replace(/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)/g, (c) => `c(${ckey(c)})`)
        .replace(/\b0(?!\.)(px)?\b/g, "0px")
        .split(/\s+/)
        // a missing spread is 0
        .filter((t, i, a) => !(t === "0px" && i === 3 && a.length === 5)),
    )
    .map((t) => t.join(" "))
    .join(", ");

// ---------- the code's inventory ----------
const codeColours = new Map(); // value key -> [{name, theme, token}]
const addColour = (v, entry) => {
  const k = ckey(v);
  if (!k) return;
  codeColours.set(k, [...(codeColours.get(k) ?? []), entry]);
};
for (const t of T.color) {
  if (typeof t.value === "string")
    addColour(t.value, { name: t.name, theme: "any", token: true });
  else
    for (const [theme, v] of Object.entries(t.value))
      addColour(v, { name: t.name, theme, token: true });
}
for (const c of T.inventory.unusedColors)
  addColour(c.value, { name: c.name, theme: "", token: false });
// A globalColors entry whose value differs from its Sass twin is still a
// named entry, under its own name.
for (const c of T.inventory.mismatched ?? [])
  addColour(c.ts, {
    name: `${c.name} (globalColors)`,
    theme: "",
    token: false,
  });

// Every colour literal anywhere in the shipped source - room covers, badge
// colours and other values written straight into a component - so that "not
// in code" means not anywhere, not just not in a palette.
const literals = new Map(); // value key -> Set of "file:line"
const lineOf = (text, index) => text.slice(0, index).split(/\r?\n/).length;
const walk = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === "node_modules" ? [] : walk(p);
    return /\.(tsx?|scss|svg)$/.test(e.name) &&
      !/\.(stories|test)\./.test(e.name)
      ? [p]
      : [];
  });
};
for (const dir of [
  ...SOURCE_DIRS,
  "providers",
  "utils",
  "hooks",
  "constants",
  "assets",
])
  for (const abs of walk(dir)) {
    const file = abs.split(path.sep).join("/");
    const text = fs.readFileSync(abs, "utf8");
    const record = (k, index) => {
      if (!k) return;
      const s = literals.get(k) ?? new Set();
      s.add(`${file}:${lineOf(text, index)}`);
      literals.set(k, s);
    };
    for (const m of text.matchAll(/#[0-9a-f]{3,8}\b|rgba?\([0-9.,\s%]+\)/gi))
      record(ckey(m[0]), m.index);
    // Colours written as numbers in code: [20, 20, 20, 0.8].
    if (/\.tsx?$/.test(file))
      for (const m of text.matchAll(
        /\[\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(0|1|0?\.\d+)\s*\]/g,
      ))
        if ([m[1], m[2], m[3]].every((n) => Number(n) <= 255))
          record(
            `${m[1]},${m[2]},${m[3]},${+Number(m[4]).toFixed(2)}`,
            m.index,
          );
  }
// A colour found only in SVG drawings (illustrations, icons) is in the code,
// but is no basis for deriving a state: it says nothing about the UI's palette.
const svgOnly = (k) =>
  literals.has(k) && [...literals.get(k)].every((at) => /\.svg:\d+$/.test(at));

const codeShadows = new Map(T.shadow.map((s) => [shadowKey(s.value), s.name]));
const codeText = T.inventory.textStyles;
const headingSizes = new Set(T.headings.map((h) => h.fontSize));

// ---------- comparing ----------
const lines = [];
const row = (...cells) => `| ${cells.join(" | ")} |`;
const theme = (name) => (/^dark\//i.test(name) ? "dark" : "light");
const codeHits = new Set();

// Colours
const fills = F.styles.filter((s) => s.type === "FILL");
const colourRows = {
  literal: [],
  token: [],
  themeOnly: [],
  unused: [],
  missing: [],
  other: [],
};
// The kit stores no colour for most states: it derives them from the base
// colour at render time (Button: hover opacity 0.85, disabled 0.6, pressed
// brightness 90% / 82%; Badge: hover color-mix 85% with transparent, pressed
// 90% with black). Figma writes the result out - the base with an alpha, or
// the base under a black overlay. Such a style is "derived" when its base
// colour is in the kit.
// Portal colour schemes, from the server's defaults.
const SERVER_SCHEMES = path.join(
  process.env.DOCSPACE_SERVER_ROOT ?? path.join("..", "DocSpace", "server"),
  "web",
  "ASC.Web.Core",
  "Utility",
  "Settings",
  "CustomColorThemesSettings.cs",
);
const serverColours = new Map(); // value key -> "scheme <name> accent|buttons"
let serverSchemes = [];
if (fs.existsSync(SERVER_SCHEMES)) {
  const cs = fs.readFileSync(SERVER_SCHEMES, "utf8");
  for (const m of cs.matchAll(
    /Name = "([^"]+)",\s*Main = new \w+ \{ Accent = "(#[0-9A-Fa-f]{6})", Buttons = "(#[0-9A-Fa-f]{6})" \}/g,
  )) {
    serverSchemes.push(m[1]);
    for (const [part, v] of [
      ["accent", m[2]],
      ["buttons", m[3]],
    ]) {
      const k = ckey(v);
      if (!serverColours.has(k))
        serverColours.set(k, `scheme "${m[1]}" ${part}`);
    }
  }
}
colourRows.server = [];

// A value off by rounding: every channel within NEAR of a kit, palette,
// literal or server colour with the same alpha.
const NEAR = 1;
colourRows.near = [];
const nearestKit = (v) => {
  const c = rgba(v);
  if (!c) return null;
  let best = null;
  const pools = [
    ...[...codeColours].map(([k, hits]) => [
      k,
      hits.map((h) => h.name).join(", "),
    ]),
    ...[...literals]
      .filter(([k]) => !svgOnly(k))
      .map(([k, at]) => [k, [...at][0]]),
    ...[...serverColours].map(([k, name]) => [k, `server ${name}`]),
  ];
  for (const [k, name] of pools) {
    const o = k.split(",").map(Number);
    const d = Math.max(...[0, 1, 2].map((i) => Math.abs(o[i] - c[i])));
    // The same colour at another opacity.
    if (d === 0 && Math.abs(o[3] - c[3]) > 0.01) {
      if (!best || best.d > 0)
        best = { d: 0, text: `${name} (same rgb at alpha ${o[3]})` };
      continue;
    }
    if (Math.abs(o[3] - c[3]) > 0.01) continue;
    if (d > 0 && d <= NEAR && (!best || d < best.d))
      best = {
        d,
        text: `${name} (rgb ${o.slice(0, 3).join(", ")}, off by ${d})`,
      };
  }
  return best?.text ?? null;
};

// The kit's name for a colour that a derived state starts from. SVG-only
// literals do not count (see svgOnly).
const PAGE_VARS = new Set(
  T.color.filter((t) => /^Page-wide variable/.test(t.usage)).map((t) => t.name),
);
const kitNameOf = (key) => {
  const hits = codeColours.get(key);
  if (hits?.length) {
    // Name the palette entry, not every token that happens to share the value.
    // A token whose own (light) value this is comes before one that only
    // takes it in the dark theme (white is #333333 there).
    const own = hits.filter((h) => h.theme !== "dark");
    const names = [...new Set((own.length ? own : hits).map((h) => h.name))];
    const palette = names.filter((n) => !PAGE_VARS.has(n));
    return (palette.length ? palette : names).slice(0, 2).join(", ");
  }
  if (literals.has(key) && !svgOnly(key)) return [...literals.get(key)][0];
  if (serverColours.has(key)) return `server ${serverColours.get(key)}`;
  return null;
};
const opaque = (v) => {
  const c = rgba(v);
  return c ? [c[0], c[1], c[2], 1].join(",") : null;
};
const alphaOf = (v) => rgba(v)?.[3] ?? 1;
const STATE_OF_ALPHA = {
  0.85: "hover (opacity 0.85)",
  0.6: "disabled (opacity 0.6)",
  0.1: "10% tint",
};
const derivedOf = (values) => {
  if (values.length === 1 && alphaOf(values[0]) < 1) {
    const base = kitNameOf(opaque(values[0]));
    if (!base) return null;
    const a = alphaOf(values[0]);
    return `${base} at alpha ${a}${STATE_OF_ALPHA[a] ? ` - ${STATE_OF_ALPHA[a]}` : ""}`;
  }
  const over = values[1] && rgba(values[1]);
  if (values.length === 2 && over && over[0] + over[1] + over[2] === 0) {
    const base = kitNameOf(opaque(values[0])) ?? kitNameOf(ckey(values[0]));
    if (!base) return null;
    return `${base} under black at ${over[3]} - pressed (brightness)`;
  }
  if (values.length === 2 && over && over[0] + over[1] + over[2] === 765) {
    const base = kitNameOf(opaque(values[0])) ?? kitNameOf(ckey(values[0]));
    if (!base) return null;
    return `${base} under white at ${over[3]}`;
  }
  // A solid value Figma flattened from a state the kit computes: the base
  // mixed with black (Badge pressed: color-mix 90% black) or with the page
  // (Badge hover: color-mix 85% transparent, over white or the dark page).
  const c = values.length === 1 && rgba(values[0]);
  if (c && c[3] === 1) {
    const MIXES = [
      [[0, 0, 0], 0.9, "pressed (color-mix 90% black)"],
      [[255, 255, 255], 0.85, "hover (85% over the light page)"],
      [[51, 51, 51], 0.85, "hover (85% over the dark page)"],
    ];
    for (const [k] of [...codeColours, ...literals, ...serverColours]) {
      const b = k.split(",").map(Number);
      if (b[3] !== 1) continue;
      for (const [with_, p, what] of MIXES) {
        const m = [0, 1, 2].map((i) => b[i] * p + with_[i] * (1 - p));
        if ([0, 1, 2].every((i) => Math.abs(m[i] - c[i]) <= 1))
          return `${kitNameOf(k)} - ${what}`;
      }
    }
  }
  return null;
};
colourRows.derived = [];

// A colour under an opaque-black overlay is one colour on screen: flatten it,
// so a pressed state the kit stores ready-made (a token) still matches.
const flatten = (values) => {
  const base = values.length === 2 && rgba(values[0]);
  const over = base && rgba(values[1]);
  if (!over || base[3] !== 1) return null;
  const sum = over[0] + over[1] + over[2];
  if (sum !== 0 && sum !== 765) return null; // black or white overlays only
  const a = over[3];
  return `#${[0, 1, 2]
    .map((i) =>
      Math.round(base[i] * (1 - a) + over[i] * a)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
};

for (const s of fills) {
  const flat = flatten(s.value ?? []);
  // Use the flattened colour only when a token has it in this style's theme;
  // a match in the other theme is a coincidence of values.
  const flatHit = (codeColours.get(ckey(flat)) ?? []).some(
    (h) => h.token && (h.theme === "any" || h.theme === theme(s.name)),
  );
  const values = flat && flatHit ? [flat] : (s.value ?? []);
  const derived = derivedOf(values);
  const exact =
    values.length === 1 &&
    (codeColours.has(ckey(values[0])) ||
      literals.has(ckey(values[0])) ||
      serverColours.has(ckey(values[0])));
  if (derived && !exact) {
    colourRows.derived.push(
      row(s.name, values.map((v) => `\`${v}\``).join(" + "), derived),
    );
    continue;
  }
  if (values.length !== 1 || !ckey(values[0])) {
    colourRows.other.push(
      row(s.name, values.map((v) => `\`${v}\``).join(", ")),
    );
    continue;
  }
  const hits = codeColours.get(ckey(values[0])) ?? [];
  const tokens = hits.filter((h) => h.token);
  const sameTheme = tokens.filter(
    (h) => h.theme === "any" || h.theme === theme(s.name),
  );
  for (const h of tokens) codeHits.add(h.name);
  const v = `\`${values[0]}\``;
  if (sameTheme.length)
    colourRows.token.push(
      row(s.name, v, [...new Set(sameTheme.map((h) => h.name))].join(", ")),
    );
  else if (tokens.length)
    colourRows.themeOnly.push(
      row(s.name, v, tokens.map((h) => `${h.name} (${h.theme})`).join(", ")),
    );
  else if (hits.length) {
    // Named but used by no component: say where else the same value is.
    const k = ckey(values[0]);
    // The palette files themselves define it; any other place is news.
    const elsewhere = [...(literals.get(k) ?? [])].filter(
      (at) => !/_colors\.scss:|globalColors\.ts:/.test(at),
    );
    const also = [
      serverColours.has(k) ? `server ${serverColours.get(k)}` : "",
      elsewhere.length
        ? `also written in ${elsewhere.slice(0, 2).join(", ")}${elsewhere.length > 2 ? ` +${elsewhere.length - 2}` : ""}`
        : "",
    ].filter(Boolean);
    colourRows.unused.push(
      row(
        s.name,
        v,
        hits.map((h) => h.name).join(", ") +
          (also.length ? `; ${also.join("; ")}` : ""),
      ),
    );
  } else if (
    !literals.has(ckey(values[0])) &&
    serverColours.has(ckey(values[0]))
  )
    colourRows.server.push(row(s.name, v, serverColours.get(ckey(values[0]))));
  else if (literals.has(ckey(values[0]))) {
    const at = [...literals.get(ckey(values[0]))];
    colourRows.literal.push(
      row(
        s.name,
        v,
        `${at.slice(0, 3).join(", ")}${at.length > 3 ? ` +${at.length - 3}` : ""}`,
      ),
    );
  } else {
    const near = nearestKit(values[0]);
    if (near) colourRows.near.push(row(s.name, v, near));
    else colourRows.missing.push(row(s.name, v));
  }
}
const notInFigma = T.color.filter((t) => {
  const vals = typeof t.value === "string" ? [t.value] : Object.values(t.value);
  return !vals.some((v) =>
    fills.some((s) => s.value?.length === 1 && ckey(s.value[0]) === ckey(v)),
  );
});

lines.push(
  `# Figma vs code`,
  "",
  `Figma: **${F.file}**, last modified ${F.lastModified}, fetched ${F.fetched.slice(0, 10)} - ${F.styles.length} published styles. Code: \`@onlyoffice/apps-ui-kit\` at this checkout. Styles are matched by **value**, never by name.`,
  "",
  `Figma variables: ${F.variables?.unavailable ? `not read (${F.variables.unavailable.split(".")[0]}); spacing and radius exist in Figma only as variables or as numbers on layers, so they are not compared here.` : "read."}`,
  "",
  "## Summary",
  "",
  row(
    "",
    "Figma styles",
    "Same value in code tokens",
    "In code, other theme only",
    "In a code palette, unused",
    "In code, not as a palette entry",
    "Derived from a kit colour",
    "Portal colour scheme (server)",
    "Almost the same",
    "Not in code",
  ),
  row("---", "---", "---", "---", "---", "---", "---", "---", "---", "---"),
);

// Text
const texts = F.styles.filter((s) => s.type === "TEXT");
const textRows = [];
let textMatch = 0;
for (const s of texts) {
  const v = s.value;
  const exact = codeText.filter(
    (c) =>
      c.fontSize === v.fontSize &&
      c.fontWeight === v.fontWeight &&
      (c.lineHeight ?? null) === (v.lineHeight ?? null),
  );
  const sizeWeight = codeText.filter(
    (c) => c.fontSize === v.fontSize && c.fontWeight === v.fontWeight,
  );
  const uses = (a) => a.reduce((n, c) => n + c.uses, 0);
  // Where the matching elements are: exact matches, else size and weight.
  const whereOf = (a) =>
    [...new Set(a.flatMap((c) => c.files ?? []))].sort().join(", ") || "-";
  const where = exact.length
    ? whereOf(exact)
    : sizeWeight.length
      ? whereOf(sizeWeight)
      : headingSizes.has(v.fontSize)
        ? "components/heading"
        : "-";
  let verdict;
  if (exact.length) {
    verdict = `same (${uses(exact)} elements)`;
    textMatch++;
  } else if (sizeWeight.length)
    verdict = `size and weight used (${uses(sizeWeight)} elements) but line height ${sizeWeight
      .map((c) => c.lineHeight ?? "not set")
      .filter((x, i, a) => a.indexOf(x) === i)
      .join(" / ")}`;
  else if (headingSizes.has(v.fontSize))
    verdict = `size only in \`Heading\` (600, no line height)`;
  else verdict = "**not used in code**";
  if (v.fontFamily !== "Open Sans") verdict += `; family ${v.fontFamily}`;
  textRows.push(
    row(s.name, v.fontSize, v.fontWeight, v.lineHeight ?? "-", verdict, where),
  );
}
const figmaText = new Set(
  texts.map((s) => `${s.value.fontSize}|${s.value.fontWeight}`),
);
const codeOnlyText = T.textStyles.filter(
  (t) => !figmaText.has(`${t.fontSize}|${t.fontWeight}`),
);

// Effects
const effects = F.styles.filter((s) => s.type === "EFFECT");
const effectRows = [];
let effectMatch = 0;
const figmaShadowKeys = new Set();
for (const s of effects) {
  const v = (s.value ?? []).join(", ");
  const k = shadowKey(v);
  figmaShadowKeys.add(k);
  const hit = codeShadows.get(k);
  if (hit) effectMatch++;
  effectRows.push(
    row(
      s.name,
      `\`${v}\``,
      hit
        ? `same: ${hit}`
        : /blur/.test(v)
          ? "no blur in code"
          : "**not in code**",
    ),
  );
}
const codeOnlyShadows = T.shadow.filter(
  (s) => !figmaShadowKeys.has(shadowKey(s.value)),
);

lines.push(
  row(
    "Colours",
    fills.length,
    colourRows.token.length,
    colourRows.themeOnly.length,
    colourRows.unused.length,
    colourRows.literal.length,
    colourRows.derived.length,
    colourRows.server.length,
    colourRows.near.length,
    colourRows.missing.length + colourRows.other.length,
  ),
  row(
    "Text styles",
    texts.length,
    `${textMatch} exactly`,
    "",
    "",
    "",
    "",
    "",
    "",
    texts.length - textMatch,
  ),
  row(
    "Effects",
    effects.length,
    effectMatch,
    "",
    "",
    "",
    "",
    "",
    "",
    effects.length - effectMatch,
  ),
  "",
  `And the other way: ${notInFigma.length} of ${T.color.length} colour tokens, ${codeOnlyText.length} of ${T.textStyles.length} text styles and ${codeOnlyShadows.length} of ${T.shadow.length} shadows the code uses have no Figma style with that value.`,
  "",
  "## Colours: in Figma, derived from a kit colour",
  "",
  "The kit has the base colour and derives this state from it when it renders: an alpha (hover 0.85, disabled 0.6) or darkening (pressed). Figma writes the result out as its own style.",
  "",
  row("Figma style", "Value", "Base in the kit"),
  row("---", "---", "---"),
  ...colourRows.derived,
  "",
  "## Colours: in Figma, a portal colour scheme on the server",
  "",
  serverSchemes.length
    ? `The server defines the portal's colour schemes (${serverSchemes.join(", ")}): an accent and a buttons colour each. The kit receives them at runtime and has none of them in its source.`
    : "No DocSpace server checkout was found, so the portal's colour schemes were not compared.",
  "",
  row("Figma style", "Value", "Scheme"),
  row("---", "---", "---"),
  ...colourRows.server,
  "",
  "## Colours: in Figma, almost the same as a kit colour",
  "",
  "Every channel within 1 of a colour the kit (or the server) has: a rounding difference, most likely the same colour.",
  "",
  row("Figma style", "Value", "Nearest in the kit"),
  row("---", "---", "---"),
  ...colourRows.near,
  "",
  "## Colours: in Figma, not in code",
  "",
  `The value is nowhere in this package's source - no palette, no stylesheet, no component${serverSchemes.length ? " - and in none of the server's colour schemes" : ""}.`,
  "",
  row("Figma style", "Value"),
  row("---", "---"),
  ...colourRows.missing,
  ...colourRows.other,
  "",
  "## Colours: in Figma, in code but not as a palette entry",
  "",
  "The value is in the source, but not as a named palette entry - a Sass list (room covers: `$logo-colors`), a theme object, or a literal in a component - so it is not a token.",
  "",
  row("Figma style", "Value", "Where"),
  row("---", "---", "---"),
  ...colourRows.literal,
  "",
  "## Colours: in Figma, in a code palette that nothing uses",
  "",
  row("Figma style", "Value", "Unused palette entry"),
  row("---", "---", "---"),
  ...colourRows.unused,
  "",
  "## Colours: in Figma for one theme, in code for the other",
  "",
  row("Figma style", "Value", "Code token (theme)"),
  row("---", "---", "---"),
  ...colourRows.themeOnly,
  "",
  "## Colours: the code uses, Figma has no style for",
  "",
  row("Code token", "Value", "Where"),
  row("---", "---", "---"),
  ...notInFigma.map((t) =>
    row(
      t.name,
      typeof t.value === "string"
        ? `\`${t.value}\``
        : Object.entries(t.value)
            .map(([k, v]) => `${k} \`${v}\``)
            .join(", "),
      t.usage.replace(/\|/g, "/").slice(0, 160),
    ),
  ),
  "",
  "## Text styles",
  "",
  "Figma's text styles against the size / weight / line height the kit's `Text` and `Link` elements are rendered with.",
  "",
  row("Figma style", "Size", "Weight", "Line height", "In code", "Where"),
  row("---", "---", "---", "---", "---", "---"),
  ...textRows,
  "",
  "Text styles the code uses with no Figma style of that size and weight:",
  "",
  row("Code style", "Size", "Weight", "Line height", "Uses", "Where"),
  row("---", "---", "---", "---", "---", "---"),
  ...codeOnlyText.map((t) =>
    row(
      t.name,
      t.fontSize,
      t.fontWeight,
      t.lineHeight ?? "-",
      t.usage.match(/(\d+) elements?/)?.[1] ?? "",
      [
        ...new Set(
          codeText
            .filter(
              (c) => c.fontSize === t.fontSize && c.fontWeight === t.fontWeight,
            )
            .flatMap((c) => c.files),
        ),
      ]
        .sort()
        .join(", "),
    ),
  ),
  "",
  "## Effects",
  "",
  row("Figma style", "Value", "In code"),
  row("---", "---", "---"),
  ...effectRows,
  "",
  "Shadows the code uses that no Figma effect has:",
  "",
  row("Code shadow", "Value"),
  row("---", "---"),
  ...codeOnlyShadows.map((s) => row(s.name, `\`${s.value}\``)),
  "",
  "## Colours: the same in both",
  "",
  row("Figma style", "Value", "Code token"),
  row("---", "---", "---"),
  ...colourRows.token,
  "",
);

fs.writeFileSync(out, lines.join("\n"));
console.error(
  `colours: ${colourRows.token.length} same, ${colourRows.themeOnly.length} other theme, ${colourRows.unused.length} unused in code, ${colourRows.missing.length + colourRows.other.length} not in code; code-only colours ${notInFigma.length}; text ${textMatch}/${texts.length}; effects ${effectMatch}/${effects.length}`,
);
