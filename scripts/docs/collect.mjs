// Decides what is published and where: one page per Storybook docs entry,
// in Storybook's tree and order. Nothing here reads or writes page content
// beyond the metadata block, the titles and the story lists.

import fs from "node:fs";
import path from "node:path";

import { toPosix, walk } from "../lib/fs-ids.mjs";
import { parseMetadata } from "../lib/readme-meta.mjs";
import {
  EXTRA_PAGES,
  MDX_PAGES,
  README_DIRS,
  SKIPPED_ROOTS,
  STORY_DIRS,
  STORY_ORDER_FILE,
} from "./config.mjs";
import { slugify } from "./markdown.mjs";
import { parseMdx } from "./mdx.mjs";
import {
  collectStories,
  csfDescription,
  csfStories,
  orderLevel,
  readStoryOrder,
  storyId,
} from "./story-tree.mjs";

const SKIP_DIRS = new Set(["node_modules", "dist"]);

/**
 * @typedef {Object} Page
 * @property {"readme" | "docs" | "autodocs" | "mdx" | "markdown"} kind
 *   readme: a component's README, Storybook's autodocs page for it;
 *   docs: an MDX page with `<Meta of>`, Storybook's docs page for a CSF file;
 *   autodocs: a CSF file with neither, Storybook's generated page;
 *   mdx: an MDX page with `<Meta title>`; markdown: a plain file (EXTRA_PAGES)
 * @property {string} source       POSIX path of the page's source file
 * @property {string} label        sidebar label (the Storybook leaf name)
 * @property {string} slug         file name on the site, without `.md`
 * @property {string} order        the file whose position orders the page
 * @property {string} [title]      Storybook title
 * @property {string} [storiesFile] the CSF file the page's stories come from
 * @property {Array} [stories]     csfStories() of that file
 * @property {Array} [blocks]      parseMdx() blocks of an MDX page
 * @property {Object} [meta]       README metadata block
 * @property {Object} [options]    MDX_PAGES entry
 *
 * @typedef {Object} Category
 * @property {string} key        Storybook path: "UI/Form controls", "UI"
 * @property {string} label
 * @property {string} slug       directory on the site: "ui/form-controls"
 * @property {string} order      first story file under it
 * @property {Category[]} children
 * @property {Page[]} pages
 * @property {Page} [readme]     a README that describes the whole group
 */

const readmes = (root) => {
  const found = new Map();
  for (const dir of README_DIRS) {
    const base = path.join(root, dir);
    if (!fs.existsSync(base)) continue;
    for (const entry of walk(base, {
      sort: true,
      enterDir: (dirent) => !SKIP_DIRS.has(dirent.name),
    })) {
      if (entry.isDir || entry.name !== "README.md") continue;
      const source = toPosix(path.posix.join(dir, entry.id));
      const { meta } = parseMetadata(fs.readFileSync(entry.full, "utf8"));
      if (meta) found.set(path.posix.dirname(source), { source, meta });
    }
  }
  return found;
};

const parentOf = (title) => title.split("/").slice(0, -1).join("/");
const leafOf = (title) => title.split("/").at(-1);

/** `./Button.stories` from `components/button/Button.stories.tsx` -> that file. */
const resolveModule = (root, fromFile, specifier) => {
  if (!specifier.startsWith(".")) return undefined;
  const base = path.posix.join(path.posix.dirname(fromFile), specifier);
  for (const candidate of [
    base,
    ...[".tsx", ".ts", ".jsx", ".js", ".mdx"].map((ext) => base + ext),
    ...[".tsx", ".ts", ".jsx", ".js"].map((ext) => `${base}/index${ext}`),
  ]) {
    const full = path.join(root, candidate);
    if (fs.existsSync(full) && fs.statSync(full).isFile()) return candidate;
  }
  return undefined;
};

export const collect = (root, { warn }) => {
  const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
  const entries = collectStories(root, STORY_DIRS, warn);
  const stories = entries.filter((e) => e.kind === "story");
  const order = readStoryOrder(read(STORY_ORDER_FILE), STORY_ORDER_FILE);
  const skippedRoot = (title) => SKIPPED_ROOTS.includes(title.split("/")[0]);

  // Where each group first appears in Storybook's index -- its first story,
  // published or not -- which is where the sidebar places it.
  const firstFile = new Map();
  for (const story of stories) {
    for (let key = parentOf(story.title); key; key = parentOf(key)) {
      if (!firstFile.has(key)) firstFile.set(key, story.file);
    }
  }

  /** @type {Map<string, Category>} */
  const categories = new Map();
  const categoryFor = (key) => {
    if (!categories.has(key)) {
      const parent = parentOf(key);
      const category = {
        key,
        label: leafOf(key),
        slug: parent
          ? `${categoryFor(parent).slug}/${slugify(leafOf(key))}`
          : slugify(key),
        order: firstFile.get(key) ?? "",
        children: [],
        pages: [],
      };
      categories.set(key, category);
      if (parent) categoryFor(parent).children.push(category);
    }
    return categories.get(key);
  };

  // MDX pages: `<Meta of={X}>` makes the page the docs of X's CSF file;
  // `<Meta title>` makes it a page of its own.
  const docsFor = new Map();
  const titled = [];
  for (const entry of entries) {
    if (entry.kind !== "mdx") continue;
    const parsed = parseMdx(read(entry.file));
    if (parsed.metaOf) {
      const specifier = parsed.imports.get(parsed.metaOf.split(".")[0]);
      const storiesFile =
        specifier && resolveModule(root, entry.file, specifier);
      if (!storiesFile) {
        warn(`${entry.file}: <Meta of={${parsed.metaOf}}> resolves to no file`);
        continue;
      }
      docsFor.set(storiesFile, { file: entry.file, blocks: parsed.blocks });
    } else if (parsed.metaTitle) {
      titled.push({
        file: entry.file,
        title: parsed.metaTitle,
        blocks: parsed.blocks,
      });
    }
  }

  const readmeByFolder = readmes(root);
  const usedReadmes = new Set();

  // One page per CSF file, as Storybook has one docs entry per CSF file:
  // its MDX docs page when one points at it, else the README beside it
  // (Storybook renders it as the autodocs page), else the generated page.
  for (const story of stories) {
    if (skippedRoot(story.title)) continue;
    if (story.title.split("/").length < 2) {
      warn(`${story.file}: story title "${story.title}" has no group`);
      continue;
    }
    const docs = docsFor.get(story.file);
    const readme = docs ? undefined : readmeByFolder.get(story.dir);
    const common = {
      label: leafOf(story.title),
      order: story.file,
      title: story.title,
      storiesFile: story.file,
      stories: csfStories(read(story.file), story.file),
    };
    let page;
    if (docs) {
      page = {
        ...common,
        kind: "docs",
        source: docs.file,
        slug: slugify(common.label),
        blocks: docs.blocks,
      };
    } else if (readme && !usedReadmes.has(readme.source)) {
      usedReadmes.add(readme.source);
      page = {
        ...common,
        kind: "readme",
        source: readme.source,
        slug: path.posix.basename(story.dir),
        meta: readme.meta,
      };
    } else {
      page = {
        ...common,
        kind: "autodocs",
        source: story.file,
        slug: slugify(common.label),
        description: csfDescription(read(story.file), story.file),
      };
    }
    categoryFor(parentOf(story.title)).pages.push(page);
  }

  for (const entry of titled) {
    if (skippedRoot(entry.title)) continue;
    if (entry.title.split("/").length < 2) {
      warn(`${entry.file}: MDX title "${entry.title}" has no group`);
      continue;
    }
    categoryFor(parentOf(entry.title)).pages.push({
      kind: "mdx",
      source: entry.file,
      label: leafOf(entry.title),
      slug: slugify(leafOf(entry.title)),
      order: entry.file,
      title: entry.title,
      blocks: entry.blocks,
      options: MDX_PAGES[entry.title] ?? {},
    });
  }

  // A README with no story in its folder but stories below it
  // (components/rows, components/tiles, components/table) describes the
  // group those stories sit in, and becomes that category's page.
  for (const [folder, readme] of readmeByFolder) {
    if (usedReadmes.has(readme.source)) continue;
    const below = stories.filter(
      (story) =>
        story.dir.startsWith(`${folder}/`) && !skippedRoot(story.title),
    );
    const groups = new Set(below.map((story) => parentOf(story.title)));
    if (groups.size !== 1) {
      warn(
        `${readme.source}: no story in its folder` +
          (groups.size > 1
            ? `, and its subfolders' stories span ${[...groups].join(", ")}`
            : ", nor below it"),
      );
      continue;
    }
    const category = categoryFor([...groups][0]);
    if (category.readme) {
      warn(
        `${readme.source}: ${category.readme.source} already describes "${category.key}"`,
      );
      continue;
    }
    category.readme = {
      kind: "readme",
      source: readme.source,
      label: category.label,
      slug: "index",
      order: below[0].file,
      meta: readme.meta,
    };
  }

  const roots = [...categories.values()].filter((c) => !parentOf(c.key));
  const result = orderTree(roots, order);

  for (const extra of EXTRA_PAGES) {
    const category = categories.get(extra.group);
    if (!category) {
      warn(`${extra.source}: category "${extra.group}" is not published`);
      continue;
    }
    const after = category.pages.findIndex((p) => p.label === extra.after);
    if (after === -1)
      warn(`${extra.source}: no page "${extra.after}" to follow`);
    category.pages.splice(after + 1, 0, {
      kind: "markdown",
      source: extra.source,
      label: extra.label,
      slug: slugify(extra.label),
      order: "",
    });
  }

  for (const category of categories.values()) {
    const seen = new Map();
    const own = category.slug.split("/").at(-1);
    for (const page of category.pages) {
      // Docusaurus reads `navigation/navigation.md` as the folder's index,
      // which the category page already is.
      if (page.slug === own) page.slug = `${page.slug}-component`;
      if (seen.has(page.slug)) {
        warn(
          `${page.source}: slug "${category.slug}/${page.slug}" is taken by ${seen.get(page.slug)}`,
        );
        page.slug = `${page.slug}-${slugify(page.label)}`;
      }
      seen.set(page.slug, page.source);
    }
  }

  return { categories: result, storyId };
};

/**
 * Storybook's order, level by level: `storySort.order` where it lists names,
 * story-file order -- the index's -- where it does not. Children and pages
 * share one level, as they do in Storybook's sidebar.
 */
const orderTree = (siblings, childOrder) => {
  const byOrder = (a, b) =>
    a.order < b.order ? -1 : a.order > b.order ? 1 : 0;
  const sorted = [...siblings].sort(byOrder);
  const { ordered, children } = orderLevel(
    sorted.map((c) => c.label),
    childOrder,
  );
  const result = ordered.map((label) => sorted.find((c) => c.label === label));

  for (const category of result) {
    const own = children.get(category.label) ?? [];
    category.children = orderTree(category.children, own);
    const pages = [...category.pages].sort(byOrder);
    const level = orderLevel(
      pages.map((p) => p.label),
      own,
    );
    category.pages = level.ordered.map((label) =>
      pages.find((p) => p.label === label),
    );
  }

  return result;
};
