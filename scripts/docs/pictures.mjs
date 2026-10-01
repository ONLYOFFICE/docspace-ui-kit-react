// What a page shows as a picture, named so that `pnpm docs:screenshots`
// (which takes them) and `pnpm run docs` (which places them) agree.
//
// A picture is `<category>/<page>--<name>-{light,dark}.png` under SHOTS_DIR.
// Its name says what it is: `primary` and a story's kebab-case name are
// stories photographed in story view; `block<n>` is the n-th React element
// of an MDX page, photographed on the Docs page; `controls` is the args
// table Storybook builds for the page, read off the Docs page as data into
// one JSON file rather than photographed, so the site shows a table.

import path from "node:path";

import { BLOCK_RENDERERS } from "./blocks.mjs";
import { SHOTS_DIR } from "./config.mjs";
import { storyId, storyNameFromExport } from "./story-tree.mjs";

export const THEMES = ["light", "dark"];

/** A story tagged this in its CSF is listed but not photographed. */
export const NO_PICTURE_TAG = "no-picture";

/** `WithIcon` -> `with-icon`, the way Storybook keys the story. */
export const storyKey = (exportName) =>
  storyId(storyNameFromExport(exportName));

/**
 * The shots a page needs, in page order. `kind` is `story` (with
 * `exportName`, or `primary: true` for the one the page opens with),
 * `block` (with `index` among the page's custom elements) or `controls`
 * (named `args-table`, a name no story export can take).
 */
export const shotsOf = (page) => {
  const shots = [];
  if (page.options?.pictures === false) return shots;

  if (page.kind === "readme" || page.kind === "autodocs") {
    shots.push({ name: "primary", kind: "story", primary: true });
    if (page.kind === "autodocs")
      shots.push({ name: "args-table", kind: "controls" });
    for (const story of page.stories ?? []) {
      if (story.tags?.includes(NO_PICTURE_TAG)) continue;
      shots.push({
        name: storyKey(story.exportName),
        kind: "story",
        exportName: story.exportName,
      });
    }
  }

  if (page.kind === "docs" || page.kind === "mdx") {
    let blocks = 0;
    for (const block of page.blocks ?? []) {
      if (block.tag === "import" || block.tag === "Meta") continue;
      if (/^[a-z]/.test(block.tag) || block.tag in BLOCK_RENDERERS) continue;
      if (block.tag === "Story" && block.of) {
        const exportName = block.of.split(".").at(-1);
        shots.push({ name: storyKey(exportName), kind: "story", exportName });
      } else if (block.tag === "Controls") {
        shots.push({ name: "args-table", kind: "controls" });
      } else {
        shots.push({ name: `block${blocks}`, kind: "block", index: blocks });
        blocks += 1;
      }
    }
  }

  // The same story shown twice is one picture.
  const seen = new Set();
  return shots.filter((shot) => !seen.has(shot.name) && seen.add(shot.name));
};

/** The files of a shot, absolute: two pictures, or one JSON for the args table. */
export const pictureFiles = (root, category, page, name) =>
  name === "args-table"
    ? [
        path.join(
          root,
          SHOTS_DIR,
          category.slug,
          `${page.slug}--args-table.json`,
        ),
      ]
    : THEMES.map((theme) =>
        path.join(
          root,
          SHOTS_DIR,
          category.slug,
          `${page.slug}--${name}-${theme}.png`,
        ),
      );

/** The two file names of a picture, as the page references them. */
export const pictureNames = (page, name) =>
  THEMES.map((theme) => `${page.slug}--${name}-${theme}.png`);
