import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Navigation/Navigation"
// → prefix: "ui-navigation-navigation"
const STORY_BASE = "ui-navigation-navigation";

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

test.describe("Navigation — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("navigation-default.png");
  });

  test("with action buttons", async ({ page }) => {
    await gotoStory(page, "with-action-buttons");
    await expect(page).toHaveScreenshot("navigation-with-action-buttons.png");
  });

  test("with ai chat button", async ({ page }) => {
    await gotoStory(page, "with-ai-chat-button");
    await expect(page).toHaveScreenshot("navigation-with-ai-chat-button.png");
  });

  test("right to left", async ({ page }) => {
    await gotoStory(page, "right-to-left");
    await expect(page).toHaveScreenshot("navigation-right-to-left.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("navigation-css-customization.png");
  });
});

test.describe("Navigation — dark", () => {
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
    await expect(page).toHaveScreenshot("navigation-default-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot(
      "navigation-css-customization-dark.png",
    );
  });
});
