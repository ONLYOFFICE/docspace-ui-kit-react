// Derives the design system's tokens from what the kit's code uses, and a
// report of where every value came from.
//
//   buildTokens(repo) -> { color, type, spacing, radius, shadow, report }
//
// Nothing here is picked by hand. Every token is a value the code uses, and
// its usage note says where and how often. The inclusion rules are the
// constants below; the report lists what each rule left out, so a reader can
// see the whole inventory, not just the part that became tokens.
import fs from "node:fs";
import path from "node:path";

import { SOURCE_DIRS, scanScss } from "./scss-scan.mjs";

// A spacing value becomes a token when this many component folders use it in
// padding, margin or gap; a radius, in border-radius; a text style, when this
// many Text / Link / Heading elements are rendered with it.
export const RULES = {
  spacingMinComponents: 10,
  radiusMinComponents: 5,
  textStyleMinUses: 5,
};

const COLORS_FILE = "styles/variables/_colors.scss";
const TS_COLORS_FILE = "providers/theme/themes/globalColors.ts";
const THEME_FILE = "components/theme-provider/ThemeProvider.scss";
const lineAt = (text, index) => text.slice(0, index).split("\n").length;

const comp = (file) =>
  file
    .split("/")
    .slice(0, 2)
    .filter((s, i) => i === 0 || !s.includes("."))
    .join("/");
const short = (file) => file.split("/")[1] ?? file;
const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
const examples = (set, n = 4) => {
  const a = [...set].map(short).sort();
  return a.length > n ? `${a.slice(0, n).join(", ")}, ...` : a.join(", ");
};
const tally = () => new Map();
const bump = (m, key, file, extra) => {
  const e = m.get(key) ?? { n: 0, comps: new Set(), at: [] };
  e.n++;
  e.comps.add(comp(file));
  if (extra) e.at.push(extra);
  m.set(key, e);
  return e;
};
const pxOf = (v) =>
  (v.match(/-?\d+(?:\.\d+)?px/g) ?? []).map((x) => x.replace(/^-/, ""));
const isColor = (v) =>
  /^#[0-9a-f]{3,8}$/i.test(v) || /^(rgba?|hsla?)\([0-9.,%\s]+\)$/i.test(v);

// Source files under dir whose name matches ext; stories and tests excluded.
const walkCode = (dir, ext, out = []) => {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name !== "node_modules") walkCode(p, ext, out);
    } else if (ext.test(e.name) && !/\.(stories|test)\./.test(e.name))
      out.push(p);
  }
  return out;
};

// The primary button and its states. The kit stores one colour, the fill, and
// derives the states from it with CSS in Button.module.scss: hover and
// disabled lower the button's opacity, pressed applies --button-brightness
// (one value for the light theme, another inside .dark). Every number here is
// read from that file, and a missing rule stops the build rather than letting
// a guess through.
const BUTTON_FILE = "components/button/Button.module.scss";
function buttonStates(decls, palette) {
  const inFile = decls.filter((d) => d.file === BUTTON_FILE);
  const where = (d) => `${BUTTON_FILE}:${d.line}`;
  const fill = inFile.find(
    (d) =>
      d.prop === "--button-background-primary" &&
      !d.dark &&
      /var\(--accent-button,/.test(d.raw),
  );
  const opacities = inFile.filter((d) => d.prop === "opacity");
  const hover = opacities.find((d) => d.value === "0.85");
  const disabled = opacities.find((d) => d.value === "0.6");
  const bright = (dark) =>
    inFile.find((d) => d.prop === "--button-brightness" && d.dark === dark);
  const light = bright(false);
  const dark = bright(true);
  const missing = Object.entries({ fill, hover, disabled, light, dark })
    .filter(([, d]) => !d)
    .map(([k]) => k);
  if (missing.length)
    throw new Error(
      `${BUTTON_FILE}: no rule found for ${missing.join(", ")} - the button state tokens cannot be derived`,
    );
  const base = fill.refs[0];
  const hex = palette.get(base).value.toLowerCase();
  const rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const pct = (d) => Number(/brightness\((\d+)%\)/.exec(d.value)[1]) / 100;
  const scaled = (k) =>
    `#${rgb
      .map((c) =>
        Math.round(c * k)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")}`;
  const alpha = (a) => `rgba(${rgb.join(", ")}, ${a})`;
  const fallback = `the kit's fallback when the portal sets no scheme is ${base} (${where(fill)})`;
  return [
    {
      name: "color-scheme-main-buttons",
      value: { light: hex, dark: hex },
      usage: `Primary button fill: var(--accent-button), which the portal points at --color-scheme-main-buttons (ThemeProviderComponent writes it from currentColorScheme.main.buttons). The value shown: ${fallback}.`,
    },
    {
      name: "color-scheme-main-buttons-hover",
      value: { light: alpha(0.85), dark: alpha(0.85) },
      usage: `Primary button on hover: the fill at opacity 0.85 (${where(hover)}). Shown over a white page it reads lighter; the kit stores no separate colour.`,
    },
    {
      name: "color-scheme-main-buttons-pressed",
      value: { light: scaled(pct(light)), dark: scaled(pct(dark)) },
      usage: `Primary button pressed: the fill under filter ${light.value} in the light theme (${where(light)}) and ${dark.value} in the dark one (${where(dark)}) - the same as a black overlay at ${Math.round((1 - pct(light)) * 100) / 100} / ${Math.round((1 - pct(dark)) * 100) / 100}.`,
    },
    {
      name: "color-scheme-main-buttons-disabled",
      value: { light: alpha(0.6), dark: alpha(0.6) },
      usage: `Primary button disabled: the fill at opacity 0.6 (${where(disabled)}).`,
    },
  ];
}

export function buildTokens(repo) {
  const { palette, decls } = scanScss(repo);
  const report = [];

  // ---------- colours ----------
  // Uses of each palette entry, and its dark counterpart: a custom property
  // defined once outside and once inside a `.dark` block of the same file,
  // each time as exactly one palette entry, pairs the two.
  const uses = new Map();
  for (const d of decls)
    for (const r of d.refs) {
      const e = bump(uses, r, d.file);
      e[d.dark ? "dark" : "light"] = (e[d.dark ? "dark" : "light"] ?? 0) + 1;
    }
  const sides = new Map();
  for (const d of decls) {
    if (!d.prop.startsWith("--") || d.refs.length !== 1) continue;
    const k = `${d.file}|${d.prop}`;
    const s = sides.get(k) ?? { light: new Set(), dark: new Set() };
    s[d.dark ? "dark" : "light"].add(d.refs[0]);
    sides.set(k, s);
  }
  const pairs = new Map();
  const counterpartOf = new Set();
  for (const s of sides.values()) {
    if (s.light.size !== 1 || s.dark.size !== 1) continue;
    const [l] = s.light;
    const [dk] = s.dark;
    const p = pairs.get(l) ?? new Map();
    p.set(dk, (p.get(dk) ?? 0) + 1);
    pairs.set(l, p);
    counterpartOf.add(dk);
  }

  const color = [];
  const accent = palette.get("light-blue-main")?.value.toLowerCase();
  color.push(
    {
      name: "color-scheme-main-accent",
      value: { light: accent, dark: accent },
      usage: `The portal's accent, written on <html> at runtime by ThemeProviderComponent (components/theme-provider/index.tsx) from currentColorScheme.main.accent; ${plural(decls.filter((d) => d.value.includes("var(--color-scheme-main-accent")).length, "declaration")} read it. The value shown is the default scheme's (light-blue-main); portal owners change it, so designs read the variable.`,
    },
    ...buttonStates(decls, palette),
  );
  const schemeTokens = color.length;
  // The kit has two palettes: the Sass one, which stylesheets use, and
  // globalColors in TypeScript, which components use in code. Entries with
  // the same name (camelCase = kebab-case) are one colour.
  const entries = new Map();
  for (const [name, { value, line }] of palette)
    entries.set(name, {
      value: value.toLowerCase(),
      src: [`${COLORS_FILE}:${line}`],
    });
  const tsText = fs.readFileSync(path.join(repo, TS_COLORS_FILE), "utf8");
  const tsKey = new Map();
  const mismatched = [];
  for (const m of tsText.matchAll(/^\s+([A-Za-z0-9]+):\s*"([^"]+)",/gm)) {
    const name = m[1].replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
    const value = m[2].toLowerCase();
    const src = `${TS_COLORS_FILE}:${lineAt(tsText, m.index + m[0].search(/\S/))}`;
    tsKey.set(m[1], name);
    const e = entries.get(name);
    if (!e) entries.set(name, { value, src: [src] });
    else {
      e.src.push(src);
      if (e.value.replace(/\s/g, "") !== value.replace(/\s/g, ""))
        mismatched.push({ name, scss: e.value, ts: value });
    }
  }
  for (const dir of [...SOURCE_DIRS, "providers", "hooks", "utils"])
    for (const abs of walkCode(path.join(repo, dir), /\.tsx?$/)) {
      const file = path.relative(repo, abs).split(path.sep).join("/");
      if (file.startsWith("providers/theme/themes/")) continue;
      const text = fs.readFileSync(abs, "utf8");
      for (const m of text.matchAll(/globalColors\.([A-Za-z0-9]+)/g)) {
        const name = tsKey.get(m[1]);
        if (!name) continue;
        const e = bump(uses, name, file);
        e.code = (e.code ?? 0) + 1;
      }
    }

  // Page-wide theme variables: what ThemeProviderComponent's stylesheet sets
  // on .light / .dark, when some other stylesheet reads it.
  const themeVars = new Map();
  for (const d of decls) {
    if (d.file !== THEME_FILE || !d.prop.startsWith("--")) continue;
    const e = themeVars.get(d.prop) ?? { line: d.line };
    e[d.dark ? "dark" : "light"] = d.value.toLowerCase();
    themeVars.set(d.prop, e);
  }
  const unreadThemeVars = [];
  for (const [prop, e] of themeVars) {
    const readers = decls.filter(
      (d) => d.file !== THEME_FILE && d.value.includes(`var(${prop}`),
    );
    const comps = new Set(readers.map((d) => comp(d.file)));
    if (!readers.length || !isColor(e.light ?? "")) {
      unreadThemeVars.push(prop);
      continue;
    }
    color.push({
      name: prop.slice(2),
      value:
        e.dark && isColor(e.dark) ? { light: e.light, dark: e.dark } : e.light,
      usage: `Page-wide variable set by ThemeProviderComponent (${THEME_FILE}:${e.line}); read by ${plural(readers.length, "declaration")} in ${plural(comps.size, "folder")} (${examples(comps)}). Use it as var(${prop}).`,
    });
  }

  // Room covers: an unnamed list in both palettes, globalColors.logoColors
  // (what RoomLogoCoverDialog offers) and $logo-colors. Each colour becomes
  // room-cover-<n>, in list order; the two lists must agree.
  const tsCovers = /logoColors:\s*\[([^\]]*)\]/.exec(tsText);
  const scssText = fs.readFileSync(path.join(repo, COLORS_FILE), "utf8");
  const scssCovers = /\$logo-colors:\s*\(([^)]*)\)/.exec(scssText);
  const coverList = (m) =>
    m
      ? [...m[1].matchAll(/#[0-9a-f]{3,8}/gi)].map((x) => x[0].toLowerCase())
      : [];
  const covers = coverList(tsCovers);
  if (covers.join() !== coverList(scssCovers).join())
    throw new Error(
      `globalColors.logoColors and $logo-colors differ: ${covers.join(" ")} vs ${coverList(scssCovers).join(" ")}`,
    );
  const coverReaders = [];
  for (const dir of SOURCE_DIRS)
    for (const abs of walkCode(path.join(repo, dir), /\.tsx?$/)) {
      const text = fs.readFileSync(abs, "utf8");
      if (/globalColors\.logoColors|logoColors=/.test(text))
        coverReaders.push(path.relative(repo, abs).split(path.sep).join("/"));
    }
  const coverSrc = `${TS_COLORS_FILE}:${lineAt(tsText, tsCovers.index)} (logoColors), ${COLORS_FILE}:${lineAt(scssText, scssCovers.index)} ($logo-colors)`;
  covers.forEach((value, i) =>
    color.push({
      name: `room-cover-${i + 1}`,
      value,
      usage: `Room cover colour ${i + 1} of ${covers.length}, in the order RoomLogoCoverDialog offers them; ${coverSrc}. Read by ${coverReaders
        .map(short)
        .filter((v, j, a) => a.indexOf(v) === j)
        .join(
          ", ",
        )}. The kit has no dark variant: the same colour in both themes.`,
    }),
  );

  const unusedColors = [];
  let usedPalette = 0;
  for (const [name, { value: v, src }] of entries) {
    const u = uses.get(name);
    if (!isColor(v)) continue;
    if (!u) {
      unusedColors.push({ name, value: v, src });
      continue;
    }
    const pair = pairs.get(name);
    let dark;
    let darkNote = "";
    if (pair) {
      const sorted = [...pair].sort((a, b) => b[1] - a[1]);
      const total = sorted.reduce((s, [, n]) => s + n, 0);
      dark = entries.get(sorted[0][0])?.value;
      darkNote = ` Dark theme: ${sorted[0][0]} in ${sorted[0][1]} of ${plural(total, "light/dark pair")}${
        sorted.length > 1
          ? ` (also ${sorted
              .slice(1)
              .map(([n, c]) => `${n} x${c}`)
              .join(", ")})`
          : ""
      }.`;
    } else if (!u.light && !u.code && u.dark)
      darkNote = " Used in the dark theme only.";
    const css = u.n - (u.code ?? 0);
    const where = [
      css ? plural(css, "stylesheet use") : "",
      u.code ? `${plural(u.code, "use")} in code (globalColors)` : "",
    ]
      .filter(Boolean)
      .join(", ");
    if (color.some((c) => c.name === name))
      throw new Error(
        `colour token name "${name}" is both a palette entry and a theme variable`,
      );
    usedPalette++;
    color.push({
      name,
      value: dark && isColor(dark) ? { light: v, dark } : v,
      usage: `${src.join(", ")}. ${where}; ${plural(u.comps.size, "folder")} (${examples(u.comps)}).${darkNote}`,
    });
  }
  report.push(
    "## Colours",
    "",
    `Sources: \`${COLORS_FILE}\` (Sass, used by stylesheets) and \`${TS_COLORS_FILE}\` (\`globalColors\`, used in code); an entry of both with the same name is one colour. An entry is a token when a stylesheet or the code uses it; its dark value is the entry the same custom property takes inside a \`.dark\` block. ${entries.size} entries: ${usedPalette} used, ${unusedColors.length} unused.`,
    "",
    `Also tokens: the portal's colour scheme - the accent and the primary button fill, which ThemeProviderComponent writes at runtime (components/theme-provider/index.tsx), with the button's hover, pressed and disabled states derived by the rules in \`${BUTTON_FILE}\` (${schemeTokens} tokens); the page-wide variables \`${THEME_FILE}\` sets that another stylesheet reads (${color.length - usedPalette - schemeTokens - covers.length}); and the ${covers.length} room cover colours (\`room-cover-1\` to \`room-cover-${covers.length}\`, from \`globalColors.logoColors\` and \`$logo-colors\`, which agree). Set there but read by no stylesheet: ${unreadThemeVars.map((v) => `\`${v}\``).join(", ") || "none"}.`,
    "",
    "Unused entries (in a palette, used nowhere - not tokens):",
    "",
    "| Name | Value | Defined in |",
    "| --- | --- | --- |",
    ...unusedColors.map(
      (c) => `| ${c.name} | \`${c.value}\` | ${c.src.join(", ")} |`,
    ),
    "",
    "Same name, different value in the two palettes (the token takes the Sass value):",
    "",
    "| Name | Sass | globalColors |",
    "| --- | --- | --- |",
    ...mismatched.map((c) => `| ${c.name} | \`${c.scss}\` | \`${c.ts}\` |`),
    "",
  );

  // ---------- spacing and radius ----------
  const spaceT = tally();
  const radiusT = tally();
  for (const d of decls) {
    if (/^(padding|margin|gap|row-gap|column-gap)(-|$)/.test(d.prop))
      for (const v of pxOf(d.value)) bump(spaceT, v, d.file);
    if (/(^|-)border(-[a-z]+)*-radius$/.test(d.prop))
      for (const v of pxOf(d.value)) bump(radiusT, v, d.file);
  }
  const scale = (t, min, prefix, what) => {
    const rows = [...t]
      .filter(([v]) => v !== "0px")
      .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
    const tokens = rows
      .filter(([, e]) => e.comps.size >= min)
      .map(([v, e]) => ({
        name: `${prefix}-${parseFloat(v)}`,
        value: v,
        usage: `In ${what} ${plural(e.n, "time")}, ${plural(e.comps.size, "folder")} (${examples(e.comps)}).`,
      }));
    const table = [
      "| Value | Uses | Folders | Token |",
      "| --- | --- | --- | --- |",
      ...rows
        .sort((a, b) => b[1].comps.size - a[1].comps.size)
        .map(
          ([v, e]) =>
            `| ${v} | ${e.n} | ${e.comps.size} | ${e.comps.size >= min ? "yes" : ""} |`,
        ),
    ];
    return { tokens, table };
  };
  const sp = scale(
    spaceT,
    RULES.spacingMinComponents,
    "space",
    "padding / margin / gap",
  );
  const rd = scale(
    radiusT,
    RULES.radiusMinComponents,
    "radius",
    "border-radius",
  );
  report.push(
    "## Spacing",
    "",
    `The kit has no spacing variables: components write pixels. Every px value of \`padding\`, \`margin\` and \`gap\` in component stylesheets is counted; a value used in at least ${RULES.spacingMinComponents} component folders is a token.`,
    "",
    ...sp.table,
    "",
    "## Radius",
    "",
    `Every px value of \`border-radius\`; at least ${RULES.radiusMinComponents} component folders make a token.`,
    "",
    ...rd.table,
    "",
  );

  // ---------- shadows ----------
  const shadowT = new Map();
  for (const d of decls) {
    if (!/(^|-)box-shadow$|^--.*shadow/.test(d.prop)) continue;
    const v = d.value.trim();
    if (/var\(|^none|^inherit|^unset|^initial|^0$/.test(v)) continue;
    if (!/px/.test(v)) continue;
    const e = bump(shadowT, v, d.file, `${d.file}:${d.line}`);
    e.dark = (e.dark ?? 0) + (d.dark ? 1 : 0);
    e.names ??= new Set();
    if (d.prop.startsWith("--")) e.names.add(d.prop.slice(2));
  }
  const shadow = [];
  const usedNames = new Set();
  const shadowRows = [...shadowT].sort(
    (a, b) => b[1].comps.size - a[1].comps.size || b[1].n - a[1].n,
  );
  for (const [v, e] of shadowRows) {
    let name = [...e.names][0] ?? `${short([...e.comps][0])}-box-shadow`;
    for (let i = 2; usedNames.has(name); i++)
      name = `${name.replace(/-\d+$/, "")}-${i}`;
    usedNames.add(name);
    shadow.push({
      name,
      value: v,
      usage: `${e.at[0]}${e.n > 1 ? ` and ${plural(e.n - 1, "more place")}` : ""}; ${plural(e.comps.size, "folder")} (${examples(e.comps)})${e.dark === e.n ? ", dark theme" : ""}.`,
    });
  }
  report.push(
    "## Shadows",
    "",
    "Every `box-shadow` (and `--*shadow*` variable) with a literal value, palette entries substituted; values that only forward a `var()` are left out. Named after the variable that holds it, else after its component.",
    "",
    "| Token | Value | Where |",
    "| --- | --- | --- |",
    ...shadow.map(
      (s, i) =>
        `| ${s.name} | \`${s.value}\` | ${shadowRows[i][1].at.join(", ")} |`,
    ),
    "",
  );

  // ---------- type ----------
  const styleT = new Map();
  for (const dir of SOURCE_DIRS)
    for (const abs of walkCode(path.join(repo, dir), /\.tsx$/)) {
      const file = path.relative(repo, abs).split(path.sep).join("/");
      const text = fs.readFileSync(abs, "utf8");
      for (const m of text.matchAll(/<(Text|Link)\b([^>]*?)\/?>/gs)) {
        const a = m[2];
        const size = /fontSize=\{?["'](\d+px)["']/.exec(a)?.[1] ?? "13px";
        const weight = /\bisBold\b(?!=\{false\})/.test(a)
          ? 700
          : Number(/fontWeight=\{?["']?(\d{3})/.exec(a)?.[1] ?? 400);
        const lh = /lineHeight=\{?["'](\d+px)["']/.exec(a)?.[1];
        bump(styleT, `${size}|${weight}|${lh ?? ""}`, file);
      }
    }
  const textStyles = [...styleT]
    .filter(([, e]) => e.n >= RULES.textStyleMinUses)
    .sort((a, b) => b[1].n - a[1].n)
    .map(([k, e]) => {
      const [size, weight, lh] = k.split("|");
      return {
        name: `text-${parseFloat(size)}-${weight}${lh ? `-${parseFloat(lh)}` : ""}`,
        fontSize: size,
        fontWeight: Number(weight),
        ...(lh ? { lineHeight: lh } : {}),
        usage: `Text / Link with fontSize ${size}, weight ${weight}${lh ? `, lineHeight ${lh}` : " (line height not set)"}: ${plural(e.n, "element")} in ${plural(e.comps.size, "folder")} (${examples(e.comps)}).`,
      };
    });
  const headingScss = fs.readFileSync(
    path.join(repo, "components/heading/Heading.module.scss"),
    "utf8",
  );
  const headingWeight = Number(
    /--heading-font-weight:\s*(\d+)/.exec(headingScss)?.[1] ?? 600,
  );
  const headings = [
    ...headingScss.matchAll(/--heading-font-size-([a-z]+):\s*(\d+px);/g),
  ].map((m) => ({
    name: `heading-${m[1]}`,
    fontSize: m[2],
    fontWeight: headingWeight,
    usage: `Heading size="${m[1]}" (components/heading/Heading.module.scss).`,
  }));
  report.push(
    "## Type",
    "",
    `Headings: the sizes \`Heading\` defines. Text styles: every \`<Text>\` and \`<Link>\` the kit renders (stories and tests excluded), grouped by fontSize / fontWeight / lineHeight as written (13px and 400 when not set; \`isBold\` is 700); a combination used at least ${RULES.textStyleMinUses} times is a style.`,
    "",
    "| Size | Weight | Line height | Uses | Folders | Style |",
    "| --- | --- | --- | --- | --- | --- |",
    ...[...styleT]
      .sort((a, b) => b[1].n - a[1].n)
      .map(([k, e]) => {
        const [s, w, l] = k.split("|");
        return `| ${s} | ${w} | ${l || "-"} | ${e.n} | ${e.comps.size} | ${e.n >= RULES.textStyleMinUses ? "yes" : ""} |`;
      }),
    "",
  );

  return {
    color,
    headings,
    textStyles,
    spacing: sp.tokens,
    radius: rd.tokens,
    shadow,
    report: report.join("\n"),
    // The whole inventory, tokens or not, for comparisons (figma-diff.mjs).
    inventory: {
      unusedColors,
      mismatched,
      textStyles: [...styleT].map(([k, e]) => {
        const [fontSize, fontWeight, lineHeight] = k.split("|");
        return {
          fontSize,
          fontWeight: Number(fontWeight),
          lineHeight: lineHeight || undefined,
          uses: e.n,
          files: [...e.comps].sort(),
        };
      }),
    },
  };
}
