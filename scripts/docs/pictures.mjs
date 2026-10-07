// What a page shows as a picture, named so that `pnpm docs:screenshots`
// (which takes them) and `pnpm run docs` (which places them) agree.
//
// A picture is `<category>/<page>--<name>-{light,dark}.png` under SHOTS_DIR.
// Its name says what it is: `primary` and a story's kebab-case name are
// stories photographed in story view; `block<n>` is the n-th React element
// of an MDX page, photographed on the Docs page; `controls` is the args
// table Storybook builds for the page, read off the Docs page as data into
// one JSON file rather than photographed, so the site shows a table.

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { toPosix, walk } from "../lib/fs-ids.mjs";
import { BLOCK_RENDERERS } from "./blocks.mjs";
import { SHOTS_DIR } from "./config.mjs";
import { storyId, storyNameFromExport } from "./story-tree.mjs";

export const THEMES = ["light", "dark"];

/** A story tagged this in its CSF is listed but not photographed. */
export const NO_PICTURE_TAG = "no-picture";

/**
 * Shot names that are not a story's: `primary` is the page's opening story
 * and `args-table` its args table. A story export that keys to one of them
 * (`export const Primary`) is named `<key>-story` instead.
 */
const RESERVED = new Set(["primary", "args-table"]);

/** `WithIcon` -> `with-icon`, the way Storybook keys the story. */
export const storyKey = (exportName) => {
  const key = storyId(storyNameFromExport(exportName));
  return RESERVED.has(key) ? `${key}-story` : key;
};

/**
 * The shots a page needs, in page order. `kind` is `story` (with
 * `exportName`, or `primary: true` for the one the page opens with),
 * `block` (with `index` among the page's custom elements) or `controls`
 * (named `args-table`, which storyKey keeps no story export from taking).
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

/**
 * What `pnpm docs:screenshots` photographed each page from, by
 * `<category>/<page>`: a fingerprint of the sources, so `--changed` can
 * skip a page whose sources are as they were.
 */
export const MANIFEST = "manifest.json";

/** Files that shape every picture: the canvas, the recipes, the camera. */
const SHOT_INPUTS = [
  ".storybook/preview.tsx",
  "scripts/docs/config.mjs",
  "scripts/docs/screenshots.mjs",
];

const TEST_FILE = /\.test\.[^.]+$/;

/**
 * A hash of the page's source, every file beside its stories (tests apart)
 * and SHOT_INPUTS. A component another page composes is not in it: a change
 * to Button alone does not re-photograph the dialogs that use it, so a full
 * run is still what the site is built from.
 */
export const pageFingerprint = (root, page) => {
  const dir = path.posix.dirname(page.storiesFile ?? page.source);
  const files = new Set([page.source, ...SHOT_INPUTS]);
  for (const entry of walk(path.join(root, dir), { sort: true })) {
    if (entry.isDir || TEST_FILE.test(entry.name)) continue;
    files.add(toPosix(path.posix.join(dir, entry.id)));
  }
  const hash = crypto.createHash("sha1");
  for (const file of [...files].sort()) {
    hash.update(file);
    hash.update(fs.readFileSync(path.join(root, file)));
  }
  return hash.digest("hex");
};

export const readManifest = (root) => {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(root, SHOTS_DIR, MANIFEST), "utf8"),
    );
  } catch {
    return {};
  }
};

export const writeManifest = (root, manifest) => {
  const sorted = Object.fromEntries(
    Object.keys(manifest)
      .sort()
      .map((key) => [key, manifest[key]]),
  );
  fs.mkdirSync(path.join(root, SHOTS_DIR), { recursive: true });
  fs.writeFileSync(
    path.join(root, SHOTS_DIR, MANIFEST),
    `${JSON.stringify(sorted, null, 2)}\n`,
  );
};
