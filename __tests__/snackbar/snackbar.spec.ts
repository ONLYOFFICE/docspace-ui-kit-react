import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Feedback/SnackBar"
// → prefix: "ui-feedback-snackbar"
const STORY_BASE = "ui-feedback-snackbar";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("SnackBar — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("snackbar-default.png");
  });

  test("with action", async ({ page }) => {
    await gotoStory(page, "with-action");
    await expect(page).toHaveScreenshot("snackbar-with-action.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("snackbar-css-customization.png");
  });
});

test.describe("SnackBar — dark", () => {
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
    await expect(page).toHaveScreenshot("snackbar-default-dark.png");
  });

  test("with action dark", async ({ page }) => {
    await gotoStory(page, "with-action");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("snackbar-with-action-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("snackbar-css-customization-dark.png");
  });
});
