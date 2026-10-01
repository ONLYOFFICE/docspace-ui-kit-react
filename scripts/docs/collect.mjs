// Decides what is published and where: which README or MDX page becomes a
// page, which Storybook group it sits in, and in what order. Nothing here
// reads or writes page content beyond the metadata block and the titles.

import fs from "node:fs";
import path from "node:path";

import { toPosix, walk } from "../lib/fs-ids.mjs";
import { parseMetadata } from "../lib/readme-meta.mjs";
import {
  EXTRA_PAGES,
  FLATTEN_ROOTS,
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
 * @property {string} [title]  Storybook title, for the Storybook link
 * @property {Object} [meta]   README metadata block
 * @property {Object} [options] MDX_PAGES entry
 *
 * @typedef {Object} Category
 * @property {string} key      Storybook path: "UI/Form controls", "Getting started"
 * @property {string} label
 * @property {string} slug
 * @property {Page[]} pages
 * @property {Page} [readme]   a README that describes the whole group
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

/**
 * The site category a Storybook group lands in: its first two segments under
 * a flattened root ("UI/Form controls"), its first segment otherwise.
 */
const categoryKeyOf = (group) => {
  const parts = group.split("/");
  return FLATTEN_ROOTS.includes(parts[0])
    ? parts.slice(0, 2).join("/")
    : parts[0];
};

export const collect = (root, { includeInternal = false, statuses, warn }) => {
  const published = new Set(statuses);
  if (includeInternal) published.add("portal-internal");

  const stories = collectStories(root, STORY_DIRS, warn);
  const order = readStoryOrder(
    fs.readFileSync(path.join(root, STORY_ORDER_FILE), "utf8"),
    STORY_ORDER_FILE,
  );

  /** @type {Map<string, Category>} */
  const categories = new Map();
  const categoryFor = (group) => {
    const key = categoryKeyOf(group);
    if (!categories.has(key)) {
      categories.set(key, {
        key,
        label: leafOf(key),
        slug: slugify(leafOf(key)),
        pages: [],
      });
    }
    return categories.get(key);
  };

  /** READMEs that exist but are not published, for the link rewriter. */
  const unpublished = new Set();
  const skippedRoot = (title) => SKIPPED_ROOTS.includes(title.split("/")[0]);

  for (const readme of readmes(root)) {
    if (!readme.meta) continue;
    if (!published.has(readme.meta.status)) {
      unpublished.add(readme.source);
      continue;
    }

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
        title: own.title,
        meta: readme.meta,
      });
      continue;
    }

    // No story of its own: a README at the root of a compound folder
    // (components/rows, components/tiles) describes the group its children's
    // stories sit in, and becomes that category's page.
    const groups = new Set(
      stories
        .filter(
          (story) =>
            story.kind === "story" &&
            story.dir.startsWith(`${readme.folder}/`) &&
            !skippedRoot(story.title),
        )
        .map((story) => categoryKeyOf(parentOf(story.title))),
    );

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
      title: story.title,
      options,
    });
  }

  // Order: Storybook's, with flattened roots replaced by their children.
  const rootNames = [
    ...new Set([...categories.keys()].map((k) => k.split("/")[0])),
  ];
  const top = orderLevel(rootNames, order);
  const ordered = [];

  for (const rootName of top.ordered) {
    const childOrder = top.children.get(rootName) ?? [];
    if (FLATTEN_ROOTS.includes(rootName)) {
      const names = [...categories.keys()]
        .filter((key) => key.startsWith(`${rootName}/`))
        .map(leafOf);
      const level = orderLevel(names, childOrder);
      for (const name of level.ordered) {
        const category = categories.get(`${rootName}/${name}`);
        sortPages(category, level.children.get(name));
        ordered.push(category);
      }
    } else {
      const category = categories.get(rootName);
      sortPages(category, childOrder);
      ordered.push(category);
    }
  }

  for (const extra of EXTRA_PAGES) {
    const category = ordered.find((c) => c.key === extra.group);
    if (!category) {
      warn(`${extra.source}: category "${extra.group}" is not published`);
      continue;
    }
    const page = {
      kind: "markdown",
      source: extra.source,
      label: extra.label,
      slug: slugify(extra.label),
    };
    const after = category.pages.findIndex((p) => p.label === extra.after);
    category.pages.splice(after + 1, 0, page);
  }

  // A compound README whose children have no README of their own
  // (components/table) would be a category with nothing under it: a single
  // page styled as a leaf between the folders. It is one page, so it goes
  // where its own metadata files it -- `category` names a Storybook group
  // under UI/ -- in alphabetical place among that group's pages.
  for (const category of [...ordered]) {
    if (category.pages.length > 0 || !category.readme) continue;
    const homeKey = `UI/${category.readme.meta.category}`;
    const home = ordered.find((c) => c.key === homeKey);
    if (!home) {
      warn(
        `${category.readme.source}: no pages under "${category.key}" and no published category "${homeKey}" to file it in`,
      );
      continue;
    }
    const page = {
      ...category.readme,
      slug: path.posix.basename(path.posix.dirname(category.readme.source)),
    };
    const at = home.pages.findIndex(
      (p) => p.label.localeCompare(page.label) > 0,
    );
    home.pages.splice(at === -1 ? home.pages.length : at, 0, page);
    ordered.splice(ordered.indexOf(category), 1);
  }

  const result = ordered.filter(
    (category) => category.pages.length > 0 || category.readme,
  );

  for (const category of result) {
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

  const slugs = new Map();
  for (const category of result) {
    if (slugs.has(category.slug)) {
      warn(
        `category "${category.key}" has the slug of "${slugs.get(category.slug)}"`,
      );
    }
    slugs.set(category.slug, category.key);
  }

  return { categories: result, unpublished, storyId };
};

const sortPages = (category, childOrder = []) => {
  const { ordered } = orderLevel(
    category.pages.map((page) => page.label),
    childOrder,
  );
  category.pages.sort(
    (a, b) => ordered.indexOf(a.label) - ordered.indexOf(b.label),
  );
};
