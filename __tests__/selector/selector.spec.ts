import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Overlays/Selector"
// -> prefix: "ui-overlays-selector"
const STORY_BASE = "ui-overlays-selector";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("Selector — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("selector-default.png");
  });

  test("content loading", async ({ page }) => {
    await gotoStory(page, "content-loading");
    await expect(page).toHaveScreenshot("selector-content-loading.png");
  });

  test("breadcrumbs", async ({ page }) => {
    await gotoStory(page, "bread-crumbs");
    await expect(page).toHaveScreenshot("selector-bread-crumbs.png");
  });

  test("new name", async ({ page }) => {
    await gotoStory(page, "new-name");
    await expect(page).toHaveScreenshot("selector-new-name.png");
  });
});

test.describe("Selector — dark", () => {
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
    await expect(page).toHaveScreenshot("selector-default-dark.png");
  });

  test("content loading dark", async ({ page }) => {
    await gotoStory(page, "content-loading");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("selector-content-loading-dark.png");
  });

  test("breadcrumbs dark", async ({ page }) => {
    await gotoStory(page, "bread-crumbs");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("selector-bread-crumbs-dark.png");
  });

  test("new name dark", async ({ page }) => {
    await gotoStory(page, "new-name");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("selector-new-name-dark.png");
  });
});
