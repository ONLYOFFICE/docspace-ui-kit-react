import { expect, test } from "@playwright/test";

import { gotoStory } from "./data-table.helpers";

// The pictures. What the table does is in the three other specs here --
// layout, storage, behaviour -- which assert geometry rather than pixels;
// these catch what geometry cannot, a colour or a glyph gone wrong.
//
// Baselines come from the Docker image (`pnpm test:e2e:docker:dev`), like
// every other screenshot in __tests__/screenshots: fonts render differently
// on each OS.

type Case = { name: string; story: string; shot: string; dark?: boolean };

const CASES: Case[] = [
  { name: "default", story: "default", shot: "data-table-default", dark: true },
  { name: "compact", story: "compact", shot: "data-table-compact", dark: true },
  {
    name: "rows and menus",
    story: "rows-and-menus",
    shot: "data-table-rows-and-menus",
    dark: true,
  },
  {
    name: "index editing",
    story: "index-editing",
    shot: "data-table-index-editing",
  },
  {
    name: "hidden columns",
    story: "hidden-columns",
    shot: "data-table-hidden-columns",
  },
  {
    name: "virtualized",
    story: "virtualized",
    shot: "data-table-virtualized",
    dark: true,
  },
  // Its own dark wrapper on a light page; the toolbar's dark mode is the
  // `dark` cases below.
  { name: "dark theme", story: "dark-theme", shot: "data-table-dark-theme" },
  {
    name: "right to left",
    story: "right-to-left",
    shot: "data-table-right-to-left",
    dark: true,
  },
  {
    name: "css customization",
    story: "css-customization",
    shot: "data-table-css-customization",
  },
];

test.describe("DataTable — light", () => {
  for (const { name, story, shot } of CASES) {
    test(name, async ({ page }) => {
      await gotoStory(page, story);
      await expect(page).toHaveScreenshot(`${shot}.png`);
    });
  }
});

test.describe("DataTable — dark", () => {
  test.beforeEach(async ({ page }) => {
    // The theme is set the way the dark-mode toolbar sets it, so the preview
    // decorator paints the story's surface and ThemeProvider themes it.
    await page.addInitScript(() => {
      localStorage.setItem(
        "sb-addon-themes-3",
        JSON.stringify({ current: "dark" }),
      );
    });
  });

  for (const { name, story, shot } of CASES.filter((c) => c.dark)) {
    test(`${name} dark`, async ({ page }) => {
      await gotoStory(page, story);
      await expect(page).toHaveScreenshot(`${shot}-dark.png`);
    });
  }
});
