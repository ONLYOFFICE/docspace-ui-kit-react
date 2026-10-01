// What a page shows as a picture, named so that `pnpm docs:screenshots`
// (which takes them) and `pnpm run docs` (which places them) agree.
//
// A picture is `<category>/<page>--<name>-{light,dark}.png` under SHOTS_DIR.
// Its name says what it is: `primary` and a story's kebab-case name are
// stories photographed in story view; `block<n>` is the n-th React element
// of an MDX page, photographed on the Docs page; `controls` is the args
// table of a page that has no README to carry a props table.

import path from "node:path";

import { BLOCK_RENDERERS } from "./blocks.mjs";
import { SHOTS_DIR } from "./config.mjs";
import { storyId, storyNameFromExport } from "./story-tree.mjs";

export const THEMES = ["light", "dark"];

/** `WithIcon` -> `with-icon`, the way Storybook keys the story. */
export const storyKey = (exportName) =>
  storyId(storyNameFromExport(exportName));

/**
 * The shots a page needs, in page order. `kind` is `story` (with
 * `exportName`, or `primary: true` for the one the page opens with),
 * `block` (with `index` among the page's custom elements) or `controls`.
 */
export const shotsOf = (page) => {
  const shots = [];

  if (page.kind === "readme" || page.kind === "autodocs") {
    shots.push({ name: "primary", kind: "story", primary: true });
    if (page.kind === "autodocs")
      shots.push({ name: "controls", kind: "controls" });
    for (const story of page.stories ?? []) {
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

/** The two files of a picture, absolute. */
export const pictureFiles = (root, category, page, name) =>
  THEMES.map((theme) =>
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
