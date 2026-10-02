import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Layout/Article"
// → prefix: "ui-layout-article"
const STORY_BASE = "ui-layout-article";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("Article — light", () => {
  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("article-css-customization.png");
  });

  test("with main button", async ({ page }) => {
    await gotoStory(page, "with-main-button");
    await expect(page).toHaveScreenshot("article-with-main-button.png");
  });

  test("custom header", async ({ page }) => {
    await gotoStory(page, "custom-header");
    await expect(page).toHaveScreenshot("article-custom-header.png");
  });

  test("with back button", async ({ page }) => {
    await gotoStory(page, "with-back-button");
    await expect(page).toHaveScreenshot("article-with-back-button.png");
  });

  test("loading state", async ({ page }) => {
    await gotoStory(page, "loading-state");
    await expect(page).toHaveScreenshot("article-loading-state.png");
  });

  test("with custom slot", async ({ page }) => {
    await gotoStory(page, "with-custom-slot");
    await expect(page).toHaveScreenshot("article-with-custom-slot.png");
  });

  test("without footer blocks", async ({ page }) => {
    await gotoStory(page, "without-footer-blocks");
    await expect(page).toHaveScreenshot("article-without-footer-blocks.png");
  });

  test("collapsed on tablet", async ({ page }) => {
    await page.setViewportSize({ width: 834, height: 640 });
    await gotoStory(page, "collapsed-on-tablet");
    await expect(page).toHaveScreenshot("article-collapsed-on-tablet.png");
  });

  test("on phone", async ({ page }) => {
    await page.setViewportSize({ width: 414, height: 640 });
    await gotoStory(page, "on-phone");
    await expect(page).toHaveScreenshot("article-on-phone.png");
  });

  test("right to left", async ({ page }) => {
    await gotoStory(page, "right-to-left");
    await expect(page).toHaveScreenshot("article-right-to-left.png");
  });
});

test.describe("Article — dark", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        document.body.classList.add("dark");
      });
    });
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("article-css-customization-dark.png");
  });
});
