import { type Page, expect, test } from "@playwright/test";

const STORY_BASE = "ui-rows-row";

const STORIES = [
  "default",
  "modern-layout",
  "indeterminate-state",
  "disabled-state",
  "loading-state",
  "index-editing",
  "with-badges",
  "without-border",
  "context-menu-header",
  "right-to-left",
];

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("row — light", () => {
  for (const storyId of STORIES) {
    test(storyId, async ({ page }) => {
      await gotoStory(page, storyId);
      await expect(page).toHaveScreenshot(`row-${storyId}.png`);
    });
  }
});

test.describe("row — dark", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        document.body.classList.add("dark");
      });
    });
  });

  for (const storyId of STORIES) {
    test(`${storyId} dark`, async ({ page }) => {
      await gotoStory(page, storyId);
      await page.evaluate(() => document.body.classList.add("dark"));
      await expect(page).toHaveScreenshot(`row-${storyId}-dark.png`);
    });
  }
});
