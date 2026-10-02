import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Layout components/EmptyView"
// → prefix: "ui-layout-components-emptyview"
const STORY_BASE = "ui-layout-components-emptyview";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("EmptyView — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("empty-view-default.png");
  });

  test("no options", async ({ page }) => {
    await gotoStory(page, "no-options");
    await expect(page).toHaveScreenshot("empty-view-no-options.png");
  });

  test("with multiple options", async ({ page }) => {
    await gotoStory(page, "with-multiple-options");
    await expect(page).toHaveScreenshot("empty-view-with-multiple-options.png");
  });

  test("suggestion cards", async ({ page }) => {
    await gotoStory(page, "suggestion-cards");
    await expect(page).toHaveScreenshot("empty-view-suggestion-cards.png");
  });

  test("with buttons", async ({ page }) => {
    await gotoStory(page, "with-buttons");
    await expect(page).toHaveScreenshot("empty-view-with-buttons.png");
  });

  test("text actions with separator", async ({ page }) => {
    await gotoStory(page, "text-actions-with-separator");
    await expect(page).toHaveScreenshot(
      "empty-view-text-actions-with-separator.png",
    );
  });

  test("with extra content", async ({ page }) => {
    await gotoStory(page, "with-extra-content");
    await expect(page).toHaveScreenshot("empty-view-with-extra-content.png");
  });

  test("right to left", async ({ page }) => {
    await gotoStory(page, "right-to-left");
    await expect(page).toHaveScreenshot("empty-view-right-to-left.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("empty-view-css-customization.png");
  });
});

test.describe("EmptyView — dark", () => {
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
    await expect(page).toHaveScreenshot("empty-view-default-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot(
      "empty-view-css-customization-dark.png",
    );
  });
});
