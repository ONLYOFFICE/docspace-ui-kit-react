import { type Page, expect, test } from "@playwright/test";

const STORY_BASE = "ui-rows-rowcontainer";

const STORIES = ["default", "no-text-selection", "virtualised"];

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("row-container — light", () => {
  for (const storyId of STORIES) {
    test(storyId, async ({ page }) => {
      await gotoStory(page, storyId);
      await expect(page).toHaveScreenshot(`row-container-${storyId}.png`);
    });
  }
});

test.describe("row-container — dark", () => {
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
      await expect(page).toHaveScreenshot(`row-container-${storyId}-dark.png`);
    });
  }
});
