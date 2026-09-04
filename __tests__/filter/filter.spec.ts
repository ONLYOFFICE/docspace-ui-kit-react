import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Layout/Filter"
// → prefix: "ui-layout-filter"
const STORY_BASE = "ui-layout-filter";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("Filter — light", () => {
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
