import { type Page, expect, test } from "@playwright/test";

// Title: "Card"
const STORY_BASE = "ui-data-display-card";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("Card -- light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("card-default.png");
  });

  test("with-extra", async ({ page }) => {
    await gotoStory(page, "with-extra");
    await expect(page).toHaveScreenshot("card-with-extra.png");
  });
});

test.describe("Card -- dark", () => {
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
    await expect(page).toHaveScreenshot("card-default-dark.png");
  });

  test("with-extra dark", async ({ page }) => {
    await gotoStory(page, "with-extra");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("card-with-extra-dark.png");
  });
});
