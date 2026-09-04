import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Status components/ProgressBar"
// sanitize() lowercases and replaces spaces/slashes with dashes — no camelCase split for title segments
// → prefix: "ui-status-components-progressbar" (ProgressBar → progressbar, not progress-bar)
const STORY_BASE = "ui-status-components-progressbar";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  // Guard: Storybook returns 200 even for missing stories
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("ProgressBar — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("progress-bar-default.png");
  });

  test("with status", async ({ page }) => {
    await gotoStory(page, "with-status");
    await expect(page).toHaveScreenshot("progress-bar-with-status.png");
  });

  test("with error", async ({ page }) => {
    await gotoStory(page, "with-error");
    await expect(page).toHaveScreenshot("progress-bar-with-error.png");
  });

  test("complete", async ({ page }) => {
    await gotoStory(page, "complete");
    await expect(page).toHaveScreenshot("progress-bar-complete.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("progress-bar-css-customization.png");
  });
});

test.describe("ProgressBar — dark", () => {
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
    await expect(page).toHaveScreenshot("progress-bar-default-dark.png");
  });

  test("with status dark", async ({ page }) => {
    await gotoStory(page, "with-status");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("progress-bar-with-status-dark.png");
  });

  test("with error dark", async ({ page }) => {
    await gotoStory(page, "with-error");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("progress-bar-with-error-dark.png");
  });

  test("complete dark", async ({ page }) => {
    await gotoStory(page, "complete");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("progress-bar-complete-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot(
      "progress-bar-css-customization-dark.png",
    );
  });
});
