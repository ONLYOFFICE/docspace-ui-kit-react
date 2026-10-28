import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Layout components/ErrorContainer"
// → prefix: "ui-layout-components-errorcontainer"
const STORY_BASE = "ui-layout-components-errorcontainer";

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

test.describe("ErrorContainer — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("error-container-default.png");
  });

  test("with secondary button", async ({ page }) => {
    await gotoStory(page, "with-secondary-button");
    await expect(page).toHaveScreenshot(
      "error-container-with-secondary-button.png",
    );
  });

  test("without logo", async ({ page }) => {
    await gotoStory(page, "without-logo");
    await expect(page).toHaveScreenshot("error-container-without-logo.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot(
      "error-container-css-customization.png",
    );
  });
});

test.describe("ErrorContainer — dark", () => {
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
    await expect(page).toHaveScreenshot("error-container-default-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot(
      "error-container-css-customization-dark.png",
    );
  });
});
