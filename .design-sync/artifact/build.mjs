// Builds the files of the "ONLYOFFICE Apps UI Kit" Design System artifact
// (claude.ai) from the verified design-sync output in ds-bundle/.
//
//   node .design-sync/artifact/build.mjs --out <dir> [--assets <assets.json>]
//
// Run from the repository root, after a design-sync build has produced
// ds-bundle/ (see .design-sync/README.md). Writes <dir>/project/... in the
// artifact's file layout; publishing is a separate step. --assets is the
// record of uploaded logos and screenshots ({group: {file: {blob, size,
// type}}}); without it the index is written with no asset groups.
import fs from "node:fs";
import path from "node:path";

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const REPO = process.cwd();
const DS = path.join(REPO, "ds-bundle");
const HERE = path.join(REPO, ".design-sync", "artifact");
const OUT = arg("out");
if (!OUT) throw new Error("--out <dir> is required");
if (!fs.existsSync(path.join(DS, "_ds_bundle.js")))
  throw new Error("ds-bundle/ is missing: run the design-sync build first");

const P = (p) => path.join(OUT, "project", p);
const write = (rel, data) => {
  fs.mkdirSync(path.dirname(P(rel)), { recursive: true });
  fs.writeFileSync(P(rel), data);
};
fs.rmSync(path.join(OUT, "project"), { recursive: true, force: true });

const config = JSON.parse(
  fs.readFileSync(path.join(REPO, ".design-sync", "config.json"), "utf8"),
);
const overrides = config.overrides || {};
const pkg = JSON.parse(
  fs.readFileSync(path.join(REPO, "package.json"), "utf8"),
);
const nice = (g) =>
  g
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

// ---------- components ----------
const map = JSON.parse(
  fs.readFileSync(path.join(DS, ".stories-map.json"), "utf8"),
);
const comps = map.components.map((c) => ({ name: c.name, group: c.group }));

// bundle.js: header in the type's format, no literal "<!--" or "</script"
// (the page inlines it). Every occurrence in the kit's bundle sits inside a
// string, where \x3C is the same character.
let bundle = fs.readFileSync(path.join(DS, "_ds_bundle.js"), "utf8");
bundle = bundle.replace(/^\/\* @ds-bundle:.*?\*\/\n?/, "");
bundle = bundle
  .replace(/<!--/g, "\\x3C!--")
  .replace(/<\/script/gi, "\\x3C/script");
const header = {
  format: 4,
  namespace: config.globalName,
  components: comps.map((c) => ({ name: c.name })),
};
write(
  "components/bundle.js",
  `/* @ds-bundle: ${JSON.stringify(header)} */\n${bundle}`,
);
write(
  "components/bundle.css",
  fs.readFileSync(path.join(DS, "_ds_bundle.css")),
);
// React 19, as the kit's previews were verified with. The converter merges
// React DOM into react.js, which assigns both globals.
write(
  "components/lib/react.js",
  fs.readFileSync(path.join(DS, "_vendor", "react.js")),
);
write(
  "components/lib/react-dom.js",
  "/* React DOM ships inside lib/react.js, which assigns window.React and window.ReactDOM. */\n",
);

let dts = `// ${pkg.name} - component props, generated from the package's declarations.\n`;
for (const c of comps) {
  const dir = path.join(DS, "components", c.group, c.name);
  const d = fs.readFileSync(path.join(dir, `${c.name}.d.ts`), "utf8");
  dts += `\n// ---- ${c.name} ----\n${d}\n`;
  write(`components/${c.name}/${c.name}.d.ts`, d);
  let readme = fs.readFileSync(path.join(dir, `${c.name}.prompt.md`), "utf8");
  if (Buffer.byteLength(readme) > 63000)
    readme = `${readme.slice(0, 62000)}\n\n_(truncated)_\n`;
  write(`components/${c.name}/README.md`, readme);

  // Preview: the Storybook-verified card, minus what the frame preloads
  // (React, the bundle, the stylesheets).
  let html = fs.readFileSync(path.join(dir, `${c.name}.html`), "utf8");
  html = html
    .replace(/^<!-- @dsCard[^\n]*-->\n/, "")
    .replace(
      /\s*<link rel="stylesheet" href="\.\.\/\.\.\/\.\.\/(styles\.css|_ds_bundle\.css)">/g,
      "",
    )
    .replace(
      /\s*<script src="\.\.\/\.\.\/\.\.\/(_vendor\/react\.js|_vendor\/react-dom\.js|_ds_bundle\.js)"><\/script>/g,
      "",
    )
    .replace(/\.\.\/\.\.\/\.\.\/_preview\/[A-Za-z0-9]+\.js/g, "./preview.js")
    .replace(/\.\.\/\.\.\/\.\.\/_preview\/[A-Za-z0-9]+\.css/g, "./preview.css");
  const left = [...html.matchAll(/(?:src|href)="(\.\.\/[^"]*)"/g)].map(
    (m) => m[1],
  );
  if (left.length)
    throw new Error(`unresolved references in ${c.name}: ${left.join(", ")}`);
  const height = overrides[c.name]?.cardMode === "single" ? 700 : 480;
  write(
    `components/${c.name}/preview.html`,
    `<!-- @dsCard group="${nice(c.group)}" height=${height} -->\n${html}`,
  );
  write(
    `components/${c.name}/preview.js`,
    fs.readFileSync(path.join(DS, "_preview", `${c.name}.js`)),
  );
  const css = path.join(DS, "_preview", `${c.name}.css`);
  if (fs.existsSync(css))
    write(`components/${c.name}/preview.css`, fs.readFileSync(css));
}
write("components/index.d.ts", dts);
write(
  "components/Cover/preview.html",
  fs.readFileSync(path.join(HERE, "cover.html")),
);

// ---------- fonts ----------
const fontsCss = fs.readFileSync(path.join(DS, "fonts", "fonts.css"), "utf8");
const faces = new Map();
for (const m of fontsCss.matchAll(/@font-face\s*{([^}]*)}/g)) {
  const b = m[1];
  const style = /font-style:\s*(\w+)/.exec(b)?.[1] || "normal";
  const weight = Number(/font-weight:\s*(\d+)/.exec(b)?.[1]);
  const file = /url\(["']?([^"')]+)["']?\)/.exec(b)?.[1].split("/").pop();
  if (!file) continue;
  const key = `${file}|${style}`;
  const prev = faces.get(key);
  if (!prev) faces.set(key, { file, style, min: weight, max: weight });
  else {
    prev.min = Math.min(prev.min, weight);
    prev.max = Math.max(prev.max, weight);
  }
}
const fonts = [];
for (const f of faces.values()) {
  write(`fonts/${f.file}`, fs.readFileSync(path.join(DS, "fonts", f.file)));
  fonts.push({
    family: "Open Sans",
    file: `fonts/${f.file}`,
    weight: f.min === f.max ? String(f.min) : `${f.min} ${f.max}`,
    style: f.style,
  });
}

// ---------- tokens ----------
// Palette: the kit's Sass colours. Theme colours: the light/dark variables
// ThemeProviderComponent defines (read from components/theme-provider).
const palette = [];
for (const m of fs
  .readFileSync(path.join(REPO, "styles", "variables", "_colors.scss"), "utf8")
  .matchAll(/^\$([a-z0-9-]+):\s*([^;]+);/gim)) {
  const v = m[2].trim();
  if (/^#|^rgba?\(/i.test(v))
    palette.push({ name: m[1], value: v.toLowerCase() });
}
const themeCss = fs.readFileSync(path.join(DS, "_ds_bundle.css"), "utf8");
const theme = new Map();
for (const m of themeCss.matchAll(/(?:^|[\s,}])\.(light|dark)\s*{([^}]*)}/g)) {
  for (const d of m[2].matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    if (!theme.has(d[1])) theme.set(d[1], {});
    theme.get(d[1])[m[1]] ??= d[2].trim();
  }
}
const isColor = (v) =>
  /^#[0-9a-f]{3,8}$/i.test(v) || /^(rgba?|hsla?)\([0-9.,%\s]+\)$/i.test(v);
for (let i = palette.length - 1; i >= 0; i--)
  if (theme.has(palette[i].name)) palette.splice(i, 1);
const used = new Set(palette.map((p) => p.name));
const accent = palette.find((p) => p.name === "light-blue-main")?.value;
const colorTokens = [
  {
    name: "color-scheme-main-accent",
    value: { light: accent, dark: accent },
    usage:
      "The accent. ThemeProviderComponent writes it on <html> from currentColorScheme.main.accent (portal owners can change it): active nav item, selected tab underline, links, focus. Read the variable; never hard-code the blue.",
  },
  {
    name: "color-scheme-main-buttons",
    value: { light: accent, dark: accent },
    usage: "Primary button fill, from currentColorScheme.main.buttons.",
  },
];
for (const n of ["color-scheme-main-accent", "color-scheme-main-buttons"])
  used.add(n);
const spacing = [];
const skipped = [];
for (const [n, v] of theme) {
  if (used.has(n)) continue;
  const vals = {};
  for (const th of ["light", "dark"])
    if (v[th] && isColor(v[th])) vals[th] = v[th].toLowerCase();
  if (Object.keys(vals).length) {
    colorTokens.push({
      name: n,
      value: vals,
      usage:
        "Theme variable set by ThemeProviderComponent (.light / .dark on <html>).",
    });
    used.add(n);
    continue;
  }
  const one = v.light ?? v.dark;
  if (/^\d+(\.\d+)?(px|rem|%)$/.test(one)) {
    spacing.push({ name: n, value: one, usage: "Theme variable." });
    used.add(n);
  } else skipped.push(n);
}
const paletteUsage = (n) =>
  n === "light-blue-main"
    ? "Default accent. Replaced at runtime by the portal's colour scheme - use --color-scheme-main-accent in designs."
    : "Kit palette colour (styles/variables/_colors.scss); components expose it through their own variables.";
const tokens = {
  name: "ONLYOFFICE Apps UI Kit",
  version: 1,
  color: {
    themes: [
      { id: "light", name: "Light" },
      { id: "dark", name: "Dark" },
    ],
    tokens: [
      ...palette.map((p) => ({
        name: p.name,
        value: p.value,
        usage: paletteUsage(p.name),
      })),
      ...colorTokens,
    ],
  },
  type: {
    fonts,
    families: { sans: '"Open Sans", sans-serif, Arial' },
    groups: [
      {
        name: "Headings",
        family: "sans",
        styles: [
          {
            name: "heading-xlarge",
            fontSize: "27px",
            fontWeight: 600,
            usage: "Heading size xlarge.",
          },
          {
            name: "heading-large",
            fontSize: "23px",
            fontWeight: 600,
            usage: "Heading size large.",
          },
          {
            name: "heading-medium",
            fontSize: "21px",
            fontWeight: 600,
            usage: "Heading size medium.",
          },
          {
            name: "heading-small",
            fontSize: "19px",
            fontWeight: 600,
            usage: "Heading size small.",
          },
          {
            name: "heading-xsmall",
            fontSize: "15px",
            fontWeight: 600,
            usage: "Heading size xsmall.",
          },
        ],
      },
      {
        name: "Text",
        family: "sans",
        styles: [
          {
            name: "text",
            fontSize: "13px",
            fontWeight: 400,
            usage:
              "Text default (--text-size): body copy, table cells, menu items.",
          },
          {
            name: "text-semibold",
            fontSize: "13px",
            fontWeight: 600,
            usage: "Labels, names in lists, buttons.",
          },
          {
            name: "text-small",
            fontSize: "12px",
            fontWeight: 400,
            usage: "Secondary cells, descriptions, hints.",
          },
          {
            name: "text-caption",
            fontSize: "11px",
            fontWeight: 600,
            usage: "Status bars and tiny meta.",
          },
        ],
      },
    ],
  },
  spacing: { tokens: spacing },
  radius: {
    tokens: [
      {
        name: "radius-control",
        value: "3px",
        usage:
          "Buttons, inputs, nav items (Button --button-root-border-radius).",
      },
      {
        name: "radius-layer",
        value: "6px",
        usage: "Floating layers and cards: DropDown, ContextMenu, ModalDialog.",
      },
    ],
  },
  meta: {
    source: "github",
    repo: "ONLYOFFICE/docspace-ui-kit-react",
    package: `${pkg.name}@${pkg.version}`,
    paths: {
      tokens: [
        "styles/variables/_colors.scss",
        "components/theme-provider/ThemeProvider.scss",
      ],
      fonts: ["css/fonts.css"],
      assets: ["assets/logo"],
      docs: [".design-sync/artifact/README.md", "docs/guides/screens.md"],
    },
    synced: new Date().toISOString().slice(0, 10),
  },
};
write("tokens.json", `${JSON.stringify(tokens, null, 2)}\n`);

// ---------- docs ----------
write("README.md", fs.readFileSync(path.join(HERE, "README.md")));
const screens = fs
  .readFileSync(path.join(REPO, "docs", "guides", "screens.md"), "utf8")
  .replace(/^# ONLYOFFICE Apps screens: layout guide/m, "# Screens")
  .replace(
    /The\s+pictures themselves are in the project under `screenshots\/`/,
    "The pictures are in the Screenshots asset group",
  )
  .replace(/`screenshots\/([^`]+)`/g, "`$1`");
write("screens.md", screens);

// ---------- index ----------
const assets = arg("assets")
  ? JSON.parse(fs.readFileSync(arg("assets"), "utf8"))
  : {};
const assetGroups = {};
for (const [group, files] of Object.entries(assets)) {
  const names = Object.keys(files).sort();
  assetGroups[group] = {
    name: group,
    tile: group === "Logos" ? "l" : "m",
    order: names,
    files: Object.fromEntries(
      names.map((n) => [
        n.replace(
          /[^A-Za-z0-9_./-]/g,
          (ch) => `~${ch.charCodeAt(0).toString(16).padStart(2, "0")}`,
        ),
        { name: n, ...files[n] },
      ]),
    ),
  };
}
const index = {
  v: 3,
  layout: "files",
  createdOnFiles: { v: 1, at: new Date().toISOString() },
  title: "ONLYOFFICE Apps UI Kit",
  namespace: config.globalName,
  editing: "code",
  libraries: [
    {
      name: "react",
      version: "19.2.8",
      global: "React",
      file: "components/lib/react.js",
    },
    {
      name: "react-dom",
      version: "19.2.8",
      global: "ReactDOM",
      file: "components/lib/react-dom.js",
    },
  ],
  sections: {},
  groups: Object.keys(assetGroups),
  assetGroups,
  blobs: {},
  docs: { readme: "project/README.md", sections: [] },
  lastChange: {
    by: arg("by") || "design-sync",
    at: new Date().toISOString(),
    via: `Claude Code · ${pkg.name}@${pkg.version}`,
    note:
      arg("note") || "Built from the Storybook-verified design-sync output.",
  },
};
fs.writeFileSync(
  path.join(OUT, "design-system.index.json"),
  `${JSON.stringify(index, null, 2)}\n`,
);

console.log(
  `components ${comps.length}, fonts ${fonts.length}, palette ${palette.length}, theme colours ${colorTokens.length}, spacing ${spacing.length}, skipped ${skipped.length}`,
);
