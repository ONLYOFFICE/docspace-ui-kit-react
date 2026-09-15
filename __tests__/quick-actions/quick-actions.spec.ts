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

  test("collapsible", async ({ page }) => {
    await gotoStory(page, "collapsible");
    await expect(page).toHaveScreenshot("quick-actions-collapsible.png");
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

  test("collapsible dark", async ({ page }) => {
    await gotoStory(page, "collapsible");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("quick-actions-collapsible-dark.png");
  });
});
