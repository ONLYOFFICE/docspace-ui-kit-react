import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Data display/Badge"
// sanitize() lowercases and replaces spaces/slashes with dashes — no camelCase split for title segments
// → prefix: "ui-data-display-badge" (Badge → badge)
const STORY_BASE = "ui-data-display-badge";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  // Guard: Storybook returns 200 even for missing stories
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("Badge — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("badge-default.png");
  });

  test("badge types", async ({ page }) => {
    await gotoStory(page, "badge-types");
    await expect(page).toHaveScreenshot("badge-badge-types.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("badge-css-customization.png");
  });
});

test.describe("Badge — dark", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        document.body.classList.add("dark");
      });
    });
  });

  test("default dark", async ({ page }) => {
    await gotoStory(page, "default");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("badge-default-dark.png");
  });

  test("badge types dark", async ({ page }) => {
    await gotoStory(page, "badge-types");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("badge-badge-types-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("badge-css-customization-dark.png");
  });
});
