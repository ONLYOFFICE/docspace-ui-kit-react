import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Interactive elements/MainButtonMobile"
// → prefix: "ui-interactive-elements-mainbuttonmobile"
const STORY_BASE = "ui-interactive-elements-mainbuttonmobile";

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

test.describe("MainButtonMobile — light", () => {
  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot(
      "main-button-mobile-css-customization.png",
    );
  });

  test("with submenu", async ({ page }) => {
    await gotoStory(page, "with-submenu");
    await expect(page).toHaveScreenshot("main-button-mobile-with-submenu.png");
  });

  test("without menu", async ({ page }) => {
    await gotoStory(page, "without-menu");
    await expect(page).toHaveScreenshot("main-button-mobile-without-menu.png");
  });
});

test.describe("MainButtonMobile — dark", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        document.body.classList.add("dark");
      });
    });
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot(
      "main-button-mobile-css-customization-dark.png",
    );
  });
});
