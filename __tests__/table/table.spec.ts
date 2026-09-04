import { type Page, expect, test } from "@playwright/test";

// Table is nine sub-components, each with its own Storybook title, so this
// spec carries a prefix per group rather than a single STORY_BASE:
//   "UI/Table/TableContainer"  -> "ui-table-tablecontainer"
//   "UI/Table/TableHeaderCell" -> "ui-table-tableheadercell"
//   ... and so on.
//
// Coverage is representative rather than exhaustive, matching the rest of the
// suite: across the existing specs roughly a third of stories are covered, at
// about four screenshots per component.
const BASE = {
  container: "ui-table-tablecontainer",
  header: "ui-table-tableheader",
  headerCell: "ui-table-tableheadercell",
  body: "ui-table-tablebody",
  row: "ui-table-tablerow",
  cell: "ui-table-tablecell",
  groupMenu: "ui-table-tablegroupmenu",
  settings: "ui-table-tablesettings",
  groupMenuItem: "ui-table-groupmenuitem",
} as const;

async function gotoStory(page: Page, base: string, storyId: string) {
  const url = `/iframe.html?id=${base}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

type Case = { name: string; base: string; story: string; shot: string };

const CASES: Case[] = [
  {
    name: "container",
    base: BASE.container,
    story: "default",
    shot: "table-container",
  },
  { name: "header", base: BASE.header, story: "default", shot: "table-header" },
  {
    name: "header without sorting",
    base: BASE.header,
    story: "without-sorting",
    shot: "table-header-without-sorting",
  },
  {
    name: "header cell",
    base: BASE.headerCell,
    story: "default",
    shot: "table-header-cell",
  },
  {
    name: "header cell sorted",
    base: BASE.headerCell,
    story: "sorted-by-this-column",
    shot: "table-header-cell-sorted",
  },
  {
    name: "header cell checked",
    base: BASE.headerCell,
    story: "with-checked-checkbox",
    shot: "table-header-cell-checked",
  },
  { name: "body", base: BASE.body, story: "default", shot: "table-body" },
  { name: "row", base: BASE.row, story: "default", shot: "table-row" },
  {
    name: "row index editing",
    base: BASE.row,
    story: "index-editing-mode",
    shot: "table-row-index-editing",
  },
  { name: "cell", base: BASE.cell, story: "default", shot: "table-cell" },
  {
    name: "cell with element checked",
    base: BASE.cell,
    story: "with-element-checked",
    shot: "table-cell-with-element-checked",
  },
  {
    name: "group menu",
    base: BASE.groupMenu,
    story: "default",
    shot: "table-group-menu",
  },
  {
    name: "group menu indeterminate",
    base: BASE.groupMenu,
    story: "indeterminate",
    shot: "table-group-menu-indeterminate",
  },
  {
    name: "group menu css customization",
    base: BASE.groupMenu,
    story: "css-customization",
    shot: "table-group-menu-css-customization",
  },
  {
    name: "settings",
    base: BASE.settings,
    story: "default",
    shot: "table-settings",
  },
  {
    name: "settings disabled",
    base: BASE.settings,
    story: "disabled",
    shot: "table-settings-disabled",
  },
  {
    name: "group menu item",
    base: BASE.groupMenuItem,
    story: "default",
    shot: "table-group-menu-item",
  },
  {
    name: "group menu item with dropdown",
    base: BASE.groupMenuItem,
    story: "with-dropdown",
    shot: "table-group-menu-item-with-dropdown",
  },
];

test.describe("Table — light", () => {
  for (const { name, base, story, shot } of CASES) {
    test(name, async ({ page }) => {
      await gotoStory(page, base, story);
      await expect(page).toHaveScreenshot(`${shot}.png`);
    });
  }
});

test.describe("Table — dark", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        document.body.classList.add("dark");
      });
    });
  });

  for (const { name, base, story, shot } of CASES) {
    test(`${name} dark`, async ({ page }) => {
      await gotoStory(page, base, story);
      await page.evaluate(() => document.body.classList.add("dark"));
      await expect(page).toHaveScreenshot(`${shot}-dark.png`);
    });
  }
});
