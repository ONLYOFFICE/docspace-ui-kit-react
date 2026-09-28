import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Navigation/Filter"
// → prefix: "ui-navigation-filter"
const STORY_BASE = "ui-navigation-filter";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("Filter — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("filter-default.png");
  });

  test("with filter chips", async ({ page }) => {
    await gotoStory(page, "with-filter-chips");
    await expect(page).toHaveScreenshot("filter-with-filter-chips.png");
  });

  test("panel option kinds", async ({ page }) => {
    await gotoStory(page, "panel-option-kinds");
    await page.waitForSelector('[data-testid="filter_modal_dialog"]');
    await expect(page).toHaveScreenshot("filter-panel-option-kinds.png");
  });

  test("sort menu on tablet", async ({ page }) => {
    await gotoStory(page, "sort-menu-on-tablet");
    await page.waitForSelector('[data-testid="filter_sort_option_AZ"]');
    await expect(page).toHaveScreenshot("filter-sort-menu-on-tablet.png");
  });

  test("with grouping row", async ({ page }) => {
    await gotoStory(page, "with-grouping-row");
    await page.waitForSelector('[data-testid="rooms_groups_overflow_trigger"]');
    await expect(page).toHaveScreenshot("filter-with-grouping-row.png");
  });

  test("with main button", async ({ page }) => {
    await gotoStory(page, "with-main-button");
    await expect(page).toHaveScreenshot("filter-with-main-button.png");
  });

  test("right to left", async ({ page }) => {
    await gotoStory(page, "right-to-left");
    await expect(page).toHaveScreenshot("filter-right-to-left.png");
  });

  test("disabled filter", async ({ page }) => {
    await gotoStory(page, "disabled-filter");
    await expect(page).toHaveScreenshot("filter-disabled.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("filter-css-customization.png");
  });
});

test.describe("Filter — dark", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        document.body.classList.add("dark");
      });
    });
  });

  test("disabled filter dark", async ({ page }) => {
    await gotoStory(page, "disabled-filter");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("filter-disabled-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("filter-css-customization-dark.png");
  });
});
