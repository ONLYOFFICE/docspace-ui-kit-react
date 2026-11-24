// Builds the files of the "ONLYOFFICE Apps UI Kit" Design System artifact
// (claude.ai) from the verified design-sync output in ds-bundle/.
//
//   node .design-sync/artifact/build.mjs --out <dir> [--assets <assets.json>]
//
// Run from the repository root, after a design-sync build has produced
// ds-bundle/ (see .design-sync/README.md). Writes <dir>/project/... in the
// artifact's file layout; publishing is a separate step. --assets is the
// record of uploaded logos, screenshots and icons ({group: {file: {blob,
// size, type}}}); without it the index is written with no asset groups.
import fs from "node:fs";
import path from "node:path";

import { GROUPS, diffGroup } from "./asset-groups.mjs";
import { buildTokens, RULES } from "./tokens.mjs";

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
// Every token is a value the kit's code uses, with where and how often in its
// usage note (tokens.mjs); token-sources.md is the full inventory, what
// became a token and what did not.
const T = buildTokens(REPO);
const tokens = {
  name: "ONLYOFFICE Apps UI Kit",
  version: 1,
  color: {
    themes: [
      { id: "light", name: "Light" },
      { id: "dark", name: "Dark" },
    ],
    tokens: T.color,
  },
  type: {
    fonts,
    families: { sans: '"Open Sans", sans-serif, Arial' },
    groups: [
      { name: "Headings", family: "sans", styles: T.headings },
      { name: "Text", family: "sans", styles: T.textStyles },
    ],
  },
  spacing: { tokens: T.spacing },
  radius: { tokens: T.radius },
  shadow: { tokens: T.shadow },
  meta: {
    source: "github",
    repo: "ONLYOFFICE/docspace-ui-kit-react",
    package: `${pkg.name}@${pkg.version}`,
    paths: {
      tokens: [
        "styles/variables/_colors.scss",
        "components/**/*.scss",
        "components/**/*.tsx",
        "components/theme-provider/index.tsx",
      ],
      fonts: ["css/fonts.css"],
      assets: ["assets/logo"],
      docs: [".design-sync/artifact/README.md", "docs/guides/screens.md"],
    },
    rules: RULES,
    synced: new Date().toISOString().slice(0, 10),
  },
};
write("tokens.json", `${JSON.stringify(tokens, null, 2)}\n`);
write(
  "token-sources.md",
  [
    "# Token sources",
    "",
    "Where every token comes from, and what the code has that did not become one. Generated from the kit's source by `.design-sync/artifact/tokens.mjs` on every build; nothing here is chosen by hand. A colour, size or shadow that is in neither the tokens nor this inventory is not in the product.",
    "",
    T.report,
  ].join("\n"),
);

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

// Every asset group mirrors a folder of this repository (asset-groups.mjs),
// and its uploads are made by hand (assets.mjs), so a refresh of a folder
// leaves the record behind without anyone noticing: refuse to build until
// every file on disk has an upload of the same size, and nothing is recorded
// that is gone from disk. Sizes are compared with CRLF folded to LF, so a
// checkout's line endings do not count as a change.
//
// Logos are not checked yet: the artifact holds another revision of the three
// logos (re-serialized, `></path>` for `/>`), and the check would refuse the
// build until they are uploaded again from assets/logo.
const README_OF = {
  Icons: "icons-readme.md",
  Navigation: "nav-icons-readme.md",
};
for (const group of ["Screenshots", "Icons", "Navigation"]) {
  if (!assets[group]) continue;
  const { missing, changed, gone } = diffGroup(REPO, group, assets[group]);
  const dir = GROUPS[group].dir;
  const problems = [
    ...missing.map((n) => `not uploaded: ${dir}/${n}`),
    ...changed.map((n) => `changed since upload: ${dir}/${n}`),
    ...gone.map((n) => `gone from disk: ${dir}/${n}`),
  ];
  if (problems.length)
    throw new Error(
      `the ${group} record in ${arg("assets")} is out of date ` +
        `(run assets.mjs plan; see .design-sync/README.md):\n  ${problems.join("\n  ")}`,
    );
  if (README_OF[group])
    write(
      `assets/${group}/README.md`,
      fs.readFileSync(path.join(HERE, README_OF[group])),
    );
}

const TILES = { Logos: "l", Icons: "xs", Navigation: "xs" };
const assetGroups = {};
for (const [group, files] of Object.entries(assets)) {
  const names = Object.keys(files).sort();
  assetGroups[group] = {
    name: group,
    tile: TILES[group] || "m",
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
  `components ${comps.length}, fonts ${fonts.length}, colours ${T.color.length}, text styles ${T.headings.length + T.textStyles.length}, spacing ${T.spacing.length}, radius ${T.radius.length}, shadows ${T.shadow.length}`,
);
