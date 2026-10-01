// `pnpm docs`: the API-site pages for api.onlyoffice.com, built from the
// component READMEs and the Storybook "Getting started" pages and laid out in
// the Storybook tree. See docs-generation.md.
//
//   node scripts/docs/index.mjs [--strict] [--check] [--include-internal]
//
// --strict            a [warn] line fails the run
// --check             also compiles every page as MDX, the way Docusaurus will
// --include-internal  publish portal-internal components as well
//
// DOCS_REVISION sets the branch or commit the edit and source links point at
// (default: master). STORYBOOK_URL adds "Open in Storybook" links.

import fs from "node:fs";
import path from "node:path";

import { collect } from "./collect.mjs";
import { OUT_DIR, PUBLISHED_STATUSES, ROOT, SIDEBAR_FILE } from "./config.mjs";
import {
  layout,
  renderCategory,
  renderMarkdown,
  renderMdx,
  renderReadme,
  renderRoot,
  summaryOf,
} from "./render.mjs";
import { renderSidebar } from "./sidebar.mjs";

const args = process.argv.slice(2);
const known = ["--strict", "--check", "--include-internal"];
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

// The links point at the GitHub mirror, which carries `master` and little
// else -- feature branches live on the internal Gitea -- so the branch name
// is not a usable default the way it is in docspace-sdk-js. DOCS_REVISION
// opts into a branch or commit that is known to exist there.
const revision = () => process.env.DOCS_REVISION || "master";

const { categories, storyId } = collect(ROOT, {
  includeInternal: args.includes("--include-internal"),
  statuses: PUBLISHED_STATUSES,
  warn,
});
const pages = layout(categories, storyId);
const rev = revision();
const outDir = path.join(ROOT, OUT_DIR);

const read = (source) => fs.readFileSync(path.join(ROOT, source), "utf8");

const summaries = new Map();
for (const category of categories) {
  for (const page of category.pages) {
    summaries.set(page.source, summaryOf(page, read(page.source)));
  }
}

/** @type {Map<string, string>} output path -> content */
const files = new Map();
const RENDER = {
  readme: renderReadme,
  mdx: renderMdx,
  markdown: renderMarkdown,
};

for (const category of categories) {
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
    files.set(
      out,
      RENDER[page.kind](read(page.source), {
        root: ROOT,
        source: page.source,
        out,
        page,
        pages,
        revision: rev,
        storyId,
        warn,
      }),
    );
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
