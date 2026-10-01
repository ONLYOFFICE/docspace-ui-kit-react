// `pnpm docs`: the API-site pages for api.onlyoffice.com, built from the
// component READMEs and the Storybook "Getting started" pages and laid out in
// the Storybook tree. See docs-generation.md.
//
//   node scripts/docs/index.mjs [--strict] [--check]
//
// --strict   a [warn] line fails the run
// --check    also compiles every page as MDX, the way Docusaurus will
//
// DOCS_REVISION sets the branch or commit the edit and source links point at
// (default: master). STORYBOOK_URL adds "Open in Storybook" links.

import fs from "node:fs";
import path from "node:path";

import { collect } from "./collect.mjs";
import {
  OUT_DIR,
  ROOT,
  SHOTS_DIR,
  SHOT_SCALE,
  SIDEBAR_FILE,
} from "./config.mjs";
import {
  layout,
  pngWidth,
  renderAutodocs,
  renderCategory,
  renderMarkdown,
  renderMdx,
  renderReadme,
  renderRoot,
  summaryOf,
} from "./render.mjs";
import { pictureFiles, pictureNames, shotsOf } from "./pictures.mjs";
import { renderSidebar } from "./sidebar.mjs";

const args = process.argv.slice(2);
const known = ["--strict", "--check"];
const unknown = args.filter((arg) => !known.includes(arg));
if (unknown.length > 0) {
  console.error(
    `unknown option ${unknown.join(", ")}\nusage: node scripts/docs/index.mjs [${known.join("] [")}]`,
  );
  process.exit(2);
}
const STRICT = args.includes("--strict");
const CHECK = args.includes("--check");

let warnings = 0;
const warn = (message) => {
  warnings += 1;
  console.warn(`[warn] ${message}`);
};

// The GitHub mirror carries `master` and little else, so the current branch
// is not a usable default the way it is in docspace-sdk-js.
const revision = () => process.env.DOCS_REVISION || "master";

const { categories, storyId } = collect(ROOT, { warn });
const pages = layout(categories, storyId);
const rev = revision();
const outDir = path.join(ROOT, OUT_DIR);

const read = (source) => fs.readFileSync(path.join(ROOT, source), "utf8");

/** Every category, parents first. */
const flat = (list) => list.flatMap((c) => [c, ...flat(c.children)]);
const everyCategory = flat(categories);

const summaries = new Map();
for (const category of everyCategory) {
  for (const page of category.pages) {
    summaries.set(page.source, summaryOf(page, read(page.source)));
  }
}

/** @type {Map<string, string>} output path -> content */
const files = new Map();
/** @type {Map<string, string>} output path -> source file, copied as is */
const copies = new Map();
let pictured = 0;
let unpictured = 0;

/**
 * The pictures `pnpm docs:screenshots` took for a page, by shot name, each
 * queued for copying beside the page. Shots not taken are counted.
 */
const picturesOf = (category, page) => {
  const pictures = new Map();
  for (const shot of shotsOf(page)) {
    const sources = pictureFiles(ROOT, category, page, shot.name);
    if (!sources.every((file) => fs.existsSync(file))) {
      unpictured += 1;
      continue;
    }
    const names = pictureNames(page, shot.name);
    names.forEach((name, i) =>
      copies.set(`${category.slug}/${name}`, sources[i]),
    );
    pictured += 1;
    pictures.set(shot.name, {
      light: names[0],
      dark: names[1],
      width: Math.round(pngWidth(sources[0]) / SHOT_SCALE),
    });
  }
  return pictures;
};
const RENDER = {
  readme: renderReadme,
  docs: renderMdx,
  mdx: renderMdx,
  autodocs: renderAutodocs,
  markdown: renderMarkdown,
};

for (const category of everyCategory) {
  const index = `${category.slug}/index.md`;
  files.set(
    index,
    renderCategory(category, {
      root: ROOT,
      source: category.readme?.source ?? "scripts/docs/sections.mjs",
      out: index,
      readmeText: category.readme ? read(category.readme.source) : "",
      pages,
      revision: rev,
      storyId,
      summaries,
      warn,
    }),
  );

  for (const page of category.pages) {
    const out = `${category.slug}/${page.slug}.md`;
    const assets = new Map();
    files.set(
      out,
      RENDER[page.kind](read(page.source), {
        root: ROOT,
        source: page.source,
        out,
        page,
        pages,
        pictures: picturesOf(category, page),
        assets,
        revision: rev,
        storyId,
        warn,
      }),
    );
    for (const [name, from] of assets) {
      copies.set(`${category.slug}/${name}`, path.join(ROOT, from));
    }
  }
}

files.set("index.md", renderRoot(categories, { revision: rev }));
files.set(SIDEBAR_FILE, renderSidebar(categories));

fs.rmSync(outDir, { recursive: true, force: true });
for (const [file, content] of files) {
  const full = path.join(outDir, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}
for (const [file, source] of copies) {
  fs.copyFileSync(source, path.join(outDir, file));
}
if (pictured + unpictured > 0) {
  console.log(
    `${pictured} picture(s) placed, ${unpictured} not taken` +
      (unpictured > 0 ? ` (pnpm docs:screenshots takes them).` : "."),
  );
}

const pageCount = [...files.keys()].filter((f) => f.endsWith(".md")).length;
console.log(
  `Wrote ${pageCount} pages in ${categories.length} categories to ${OUT_DIR}/ (revision ${rev}).`,
);

if (CHECK) {
  const { compile } = await import("@mdx-js/mdx");
  const { default: remarkGfm } = await import("remark-gfm");
  let failed = 0;
  for (const [file, content] of files) {
    if (!file.endsWith(".md")) continue;
    const body = content.replace(/^---\n[\s\S]*?\n---\n/, "");
    try {
      await compile(body, { remarkPlugins: [remarkGfm] });
    } catch (error) {
      failed += 1;
      const where = error.place?.line ?? error.line;
      console.error(
        `[error] ${OUT_DIR}/${file}${where ? `:${where}` : ""}: ${error.reason ?? error.message}`,
      );
    }
  }
  if (failed > 0) {
    console.error(`${failed} page(s) do not compile as MDX.`);
    process.exit(1);
  }
  console.log(`All ${pageCount} pages compile as MDX.`);
}

if (warnings > 0) {
  console.log(`${warnings} [warn] line(s).`);
  if (STRICT) process.exit(1);
}
