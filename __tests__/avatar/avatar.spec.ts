import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Data display/Avatar"
// → prefix: "ui-data-display-avatar"
const STORY_BASE = "ui-data-display-avatar";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("Avatar — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("avatar-default.png");
  });

  test("all sizes", async ({ page }) => {
    await gotoStory(page, "all-sizes");
    await expect(page).toHaveScreenshot("avatar-all-sizes.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("avatar-css-customization.png");
  });
});

test.describe("Avatar — dark", () => {
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
    await expect(page).toHaveScreenshot("avatar-default-dark.png");
  });

  test("all sizes dark", async ({ page }) => {
    await gotoStory(page, "all-sizes");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("avatar-all-sizes-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("avatar-css-customization-dark.png");
  });
});
