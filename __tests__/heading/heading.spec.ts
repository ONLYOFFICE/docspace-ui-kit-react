import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Data display/Heading"
// sanitize() lowercases and replaces spaces/slashes with dashes — no camelCase split for title segments
// → prefix: "ui-data-display-heading" (Heading → heading)
const STORY_BASE = "ui-data-display-heading";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  // Guard: Storybook returns 200 even for missing stories
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("Heading — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("heading-default.png");
  });

  test("levels", async ({ page }) => {
    await gotoStory(page, "levels");
    await expect(page).toHaveScreenshot("heading-levels.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("heading-css-customization.png");
  });
});

test.describe("Heading — dark", () => {
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
    await expect(page).toHaveScreenshot("heading-default-dark.png");
  });

  test("levels dark", async ({ page }) => {
    await gotoStory(page, "levels");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("heading-levels-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("heading-css-customization-dark.png");
  });
});
