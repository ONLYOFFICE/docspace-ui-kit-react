import { type Page, expect, test } from "@playwright/test";

// Title: "QuickActions"
const STORY_BASE = "ui-data-display-quickactions";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("QuickActions -- light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("quick-actions-default.png");
  });

  // `collapsible` is gone: 0647ad64 turned the tile grid into a carousel with
  // floating controls, and the story went with it.
  test("carousel", async ({ page }) => {
    await gotoStory(page, "carousel");
    await expect(page).toHaveScreenshot("quick-actions-carousel.png");
  });
});

test.describe("QuickActions -- dark", () => {
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
    await expect(page).toHaveScreenshot("quick-actions-default-dark.png");
  });

  test("carousel dark", async ({ page }) => {
    await gotoStory(page, "carousel");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("quick-actions-carousel-dark.png");
  });
});
