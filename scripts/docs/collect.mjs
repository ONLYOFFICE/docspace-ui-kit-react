// Decides what is published and where: which README or MDX page becomes a
// page, which Storybook group it sits in, and in what order. Nothing here
// reads or writes page content beyond the metadata block and the titles.

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
import {
  collectStories,
  orderLevel,
  readStoryOrder,
  storyId,
} from "./story-tree.mjs";

const SKIP_DIRS = new Set(["node_modules", "dist"]);

/**
 * @typedef {Object} Page
 * @property {"readme" | "mdx" | "markdown"} kind
 * @property {string} source   POSIX path of the source file
 * @property {string} label    sidebar label (the Storybook leaf name)
 * @property {string} slug     file name on the site, without `.md`
 * @property {string} order    the story file whose position orders the page
 * @property {string} [title]  Storybook title, for the Storybook link
 * @property {Object} [meta]   README metadata block
 * @property {Object} [options] MDX_PAGES entry
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
  const found = [];
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
      found.push({ source, folder: path.posix.dirname(source), meta });
    }
  }
  return found;
};

const parentOf = (title) => title.split("/").slice(0, -1).join("/");
const leafOf = (title) => title.split("/").at(-1);

export const collect = (root, { includeInternal = false, statuses, warn }) => {
  const published = new Set(statuses);
  if (includeInternal) published.add("portal-internal");

  const stories = collectStories(root, STORY_DIRS, warn);
  const order = readStoryOrder(
    fs.readFileSync(path.join(root, STORY_ORDER_FILE), "utf8"),
    STORY_ORDER_FILE,
  );

  // Where each group first appears in Storybook's index -- its first story,
  // published or not -- which is where the sidebar places it.
  const firstFile = new Map();
  for (const story of stories) {
    for (let key = parentOf(story.title); key; key = parentOf(key)) {
      if (!firstFile.has(key)) firstFile.set(key, story.file);
    }
  }

  // The tree Storybook shows, built from the group of every published page:
  // "UI/Form controls" makes "UI" and, under it, "Form controls".
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

  const skippedRoot = (title) => SKIPPED_ROOTS.includes(title.split("/")[0]);

  for (const readme of readmes(root)) {
    if (!readme.meta) continue;
    if (!published.has(readme.meta.status)) continue;

    const own = stories.find(
      (story) => story.kind === "story" && story.dir === readme.folder,
    );

    if (own) {
      if (skippedRoot(own.title)) continue;
      if (own.title.split("/").length < 2) {
        warn(`${readme.source}: story title "${own.title}" has no group`);
        continue;
      }
      categoryFor(parentOf(own.title)).pages.push({
        kind: "readme",
        source: readme.source,
        label: leafOf(own.title),
        slug: path.posix.basename(readme.folder),
        order: own.file,
        title: own.title,
        meta: readme.meta,
      });
      continue;
    }

    // No story of its own: a README at the root of a compound folder
    // (components/rows, components/tiles) describes the group its children's
    // stories sit in, and becomes that category's page.
    const below = stories.filter(
      (story) =>
        story.kind === "story" &&
        story.dir.startsWith(`${readme.folder}/`) &&
        !skippedRoot(story.title),
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

  for (const story of stories) {
    if (story.kind !== "mdx" || skippedRoot(story.title)) continue;
    const options = MDX_PAGES[story.title] ?? {};
    if (options.skip) continue;
    if (story.title.split("/").length < 2) {
      warn(`${story.file}: MDX title "${story.title}" has no group`);
      continue;
    }
    categoryFor(parentOf(story.title)).pages.push({
      kind: "mdx",
      source: story.file,
      label: leafOf(story.title),
      slug: slugify(leafOf(story.title)),
      order: story.file,
      title: story.title,
      options,
    });
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
    for (const page of category.pages) {
      if (seen.has(page.slug)) {
        warn(
          `${page.source}: slug "${category.slug}/${page.slug}" is taken by ${seen.get(page.slug)}`,
        );
        page.slug = slugify(page.label);
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
