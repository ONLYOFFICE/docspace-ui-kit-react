import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Data display/Tabs" → "ui-data-display-tabs"
const STORY_BASE = "ui-data-display-tabs";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("Tabs — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("tabs-default.png");
  });

  test("secondary", async ({ page }) => {
    await gotoStory(page, "secondary");
    await expect(page).toHaveScreenshot("tabs-secondary.png");
  });

  test("scaled", async ({ page }) => {
    await gotoStory(page, "scaled");
    await expect(page).toHaveScreenshot("tabs-scaled.png");
  });

  test("loading", async ({ page }) => {
    await gotoStory(page, "loading");
    await expect(page).toHaveScreenshot("tabs-loading.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("tabs-css-customization.png");
  });
});

test.describe("Tabs — dark", () => {
  test("default dark", async ({ page }) => {
    await gotoStory(page, "default");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("tabs-default-dark.png");
  });

  test("secondary dark", async ({ page }) => {
    await gotoStory(page, "secondary");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("tabs-secondary-dark.png");
  });

  test("scaled dark", async ({ page }) => {
    await gotoStory(page, "scaled");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("tabs-scaled-dark.png");
  });

  test("loading dark", async ({ page }) => {
    await gotoStory(page, "loading");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("tabs-loading-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("tabs-css-customization-dark.png");
  });
});
