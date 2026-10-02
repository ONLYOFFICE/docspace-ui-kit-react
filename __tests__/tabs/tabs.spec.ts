import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Navigation/Tabs" → "ui-navigation-tabs"
const STORY_BASE = "ui-navigation-tabs";

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

  test("with badges", async ({ page }) => {
    await gotoStory(page, "with-badges");
    await expect(page).toHaveScreenshot("tabs-with-badges.png");
  });

  test("with icons", async ({ page }) => {
    await gotoStory(page, "with-icons");
    await expect(page).toHaveScreenshot("tabs-with-icons.png");
  });

  test("animated selection", async ({ page }) => {
    await gotoStory(page, "animated-selection");
    await expect(page).toHaveScreenshot("tabs-animated-selection.png");
  });

  test("with sticky header", async ({ page }) => {
    await gotoStory(page, "with-sticky-header");
    await expect(page).toHaveScreenshot("tabs-with-sticky-header.png");
  });

  test("overflowing tabs", async ({ page }) => {
    await gotoStory(page, "overflowing-tabs");
    await expect(page).toHaveScreenshot("tabs-overflowing-tabs.png");
  });

  test("right to left", async ({ page }) => {
    await gotoStory(page, "right-to-left");
    await expect(page).toHaveScreenshot("tabs-right-to-left.png");
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
