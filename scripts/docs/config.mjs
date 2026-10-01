// Where the API-site pages come from, where they go and how they are addressed.
// Everything a run needs to know about the site lives here, so moving the
// section on api.onlyoffice.com is an edit to this file and nothing else.

import path from "node:path";

import { ROOT } from "../lib/readme-program.mjs";

export { ROOT };

/** Output directory, relative to the repository root. Gitignored. */
export const OUT_DIR = "site-docs";

/**
 * Where `pnpm docs:screenshots` keeps its pictures, relative to the root.
 * Gitignored, and outside OUT_DIR because `pnpm docs` wipes that; the pages
 * that have a picture here get it copied beside them.
 */
export const SHOTS_DIR = "site-screenshots";

/** Device scale the pictures are taken at; the page shows them at 1/SHOT_SCALE. */
export const SHOT_SCALE = 2;

/**
 * How to open a component whose first story is its trigger, keyed by folder:
 * `click`, `rightClick` or `hover` a Playwright selector, then `hideRoot`
 * (everything in #storybook-root, for a portal) or `hide` (a selector) so the
 * trigger stays out of the picture. `wait` is the settle time in ms (400).
 */
export const PICTURE_RECIPES = {
  // The container is rendered beside the button, and the toast slides in.
  "components/toast": {
    click: "text=Show Toast",
    hide: "text=Show Toast",
    wait: 1500,
  },
  "components/modal-dialog": { click: "text=Show", hideRoot: true },
  // Both render inside the root, over the story's own page.
  "components/aside": { click: "text=Open Panel" },
  "components/backdrop": { click: "text=Toggle Backdrop" },
  "components/top-loading-indicator": {
    click: "text=Start Loading",
    hideRoot: true,
    wait: 800,
  },
  "components/drop-down": { click: "text=Open Dropdown" },
  "components/context-menu": { rightClick: "text=Right click on me" },
  "components/tooltip": { hover: "text=Hover me" },
};

/** Where the pages live inside the site repository (`site/` + the doc id prefix). */
export const SITE_SECTION = "docspace/ui-kit";

/** Doc id prefix every sidebar entry carries. */
export const PATH_PREFIX = SITE_SECTION;

/** The generated sidebar the site's `sidebars.ts` spreads in. */
export const SIDEBAR_FILE = "ui-kit-sidebar.cjs";

/**
 * The api.onlyoffice.com checkout `docs:sync` copies into -- a sibling of this
 * one unless API_SITE_ROOT says otherwise.
 */
export const siteRoot = () =>
  path.resolve(ROOT, process.env.API_SITE_ROOT ?? "../api.onlyoffice.com");

/**
 * Source links and the "Edit this page" link. The GitHub mirror, not the
 * internal Gitea: the site is public.
 */
export const REPO_URL = "https://github.com/ONLYOFFICE/docspace-ui-kit-react";

/**
 * A published Storybook to link each page to, from STORYBOOK_URL. Unset, the
 * pages carry no "Open in Storybook" link and a `?path=` link in the prose is
 * reduced to its text.
 */
export const storybookUrl = () =>
  process.env.STORYBOOK_URL?.replace(/\/+$/, "") || null;

/**
 * Where the Storybook tree is read from: the directories `.storybook/main.ts`
 * globs, minus the ones that hold nothing but samples.
 */
export const STORY_DIRS = [
  "docs",
  "components",
  "providers",
  "errors",
  "selectors",
  "document-editor",
  "uploader",
  "ai-agent",
  "billing",
];

/**
 * Where `storySort.order` is read from. Storybook parses it out of the preview
 * statically and refuses anything but an inline literal, so it cannot be moved
 * into a module both sides import; the pipeline parses the same literal.
 */
export const STORY_ORDER_FILE = ".storybook/preview.tsx";

/** Top-level Storybook sections that are not published at all. */
export const SKIPPED_ROOTS = ["Samples"];

/**
 * Which README statuses are published. `portal-internal` components need
 * DocSpace context a site reader does not have (docs/public-api.md); pass
 * `--include-internal` to publish them as well.
 */
export const PUBLISHED_STATUSES = ["public"];

/**
 * Directories whose README.md becomes a page when it carries a `ui-kit-doc`
 * metadata block. A README without one is not published: it has no summary
 * for the overview tables and no status to filter on.
 */
export const README_DIRS = ["components", "providers"];

/**
 * The "Getting started" pages, by Storybook title. `drop` names the JSX
 * elements that are Storybook-only decoration and may be removed; any other
 * JSX left outside a code block fails a strict run, because the site cannot
 * render it. `skip` holds pages whose content *is* the JSX. `summary` replaces
 * the first sentence in the overview table when that sentence is not one.
 */
export const MDX_PAGES = {
  "Getting started/Welcome": {
    drop: ["WelcomePage"],
    summary:
      "What the kit is, how it is installed and the providers every application mounts.",
  },
  "Getting started/Agent skills": {
    skip: "the page is its infographics; there is no text to publish without them",
  },
  "Getting started/Types and roles": {
    skip: "the access matrices are React components reading docs/access/matrix.ts",
  },
};

/**
 * Plain Markdown pages outside the Storybook tree that README links point at,
 * published so those links resolve on the site instead of leaving it.
 */
export const EXTRA_PAGES = [
  {
    source: "docs/getting-started.md",
    group: "Getting started",
    label: "Installation",
    after: "Welcome",
  },
];
