import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Interactive elements/FloatingButton"
// → prefix: "ui-interactive-elements-floatingbutton"
const STORY_BASE = "ui-interactive-elements-floatingbutton";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  // Storybook answers 200 for an unknown id and shows its error display
  // instead of the story: fail on that now, not on a timeout further down.
  await page.waitForSelector("body.sb-show-main, body.sb-show-errordisplay", {
    state: "attached",
  });
  await expect(page.locator("body")).not.toHaveClass(/sb-show-errordisplay/);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await page.waitForLoadState("networkidle");
}

test.describe("FloatingButton — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("floating-button-default.png");
  });

  test("without progress", async ({ page }) => {
    await gotoStory(page, "without-progress");
    await expect(page).toHaveScreenshot("floating-button-without-progress.png");
  });

  test("without status badge", async ({ page }) => {
    await gotoStory(page, "without-status-badge");
    await expect(page).toHaveScreenshot(
      "floating-button-without-status-badge.png",
    );
  });

  test("custom color", async ({ page }) => {
    await gotoStory(page, "custom-color");
    await expect(page).toHaveScreenshot("floating-button-custom-color.png");
  });

  test("custom icon image", async ({ page }) => {
    await gotoStory(page, "custom-icon-image");
    await expect(page).toHaveScreenshot(
      "floating-button-custom-icon-image.png",
    );
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot(
      "floating-button-css-customization.png",
    );
  });
});

test.describe("FloatingButton — dark", () => {
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
    await expect(page).toHaveScreenshot("floating-button-default-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot(
      "floating-button-css-customization-dark.png",
    );
  });
});
