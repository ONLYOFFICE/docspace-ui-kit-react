import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Interactive elements/IconButton"
// sanitize() lowercases and replaces spaces/slashes with dashes — no camelCase split for title segments
// → prefix: "ui-interactive-elements-iconbutton" (IconButton → iconbutton, not icon-button)
const STORY_BASE = "ui-interactive-elements-iconbutton";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  // Guard: Storybook returns 200 even for missing stories
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("IconButton — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("icon-button-default.png");
  });

  test("sizes", async ({ page }) => {
    await gotoStory(page, "sizes");
    await expect(page).toHaveScreenshot("icon-button-sizes.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("icon-button-css-customization.png");
  });
});

test.describe("IconButton — dark", () => {
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
    await expect(page).toHaveScreenshot("icon-button-default-dark.png");
  });

  test("sizes dark", async ({ page }) => {
    await gotoStory(page, "sizes");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("icon-button-sizes-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot(
      "icon-button-css-customization-dark.png",
    );
  });
});
