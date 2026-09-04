import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Data display/Text"
// sanitize() lowercases and replaces spaces/slashes with dashes — no camelCase split for title segments
// → prefix: "ui-data-display-text" (Text → text)
const STORY_BASE = "ui-data-display-text";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  // Guard: Storybook returns 200 even for missing stories
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("Text — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("text-default.png");
  });

  test("font sizes", async ({ page }) => {
    await gotoStory(page, "font-sizes");
    await expect(page).toHaveScreenshot("text-font-sizes.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("text-css-customization.png");
  });
});

test.describe("Text — dark", () => {
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
    await expect(page).toHaveScreenshot("text-default-dark.png");
  });

  test("font sizes dark", async ({ page }) => {
    await gotoStory(page, "font-sizes");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("text-font-sizes-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("text-css-customization-dark.png");
  });
});
