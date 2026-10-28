import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Interactive elements/HelpButton"
// → prefix: "ui-interactive-elements-helpbutton"
const STORY_BASE = "ui-interactive-elements-helpbutton";

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

test.describe("HelpButton — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("help-button-default.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("help-button-css-customization.png");
  });

  test("with text content", async ({ page }) => {
    await gotoStory(page, "with-text-content");
    await expect(page).toHaveScreenshot("help-button-with-text-content.png");
  });

  test("with custom anchor", async ({ page }) => {
    await gotoStory(page, "with-custom-anchor");
    await expect(page).toHaveScreenshot("help-button-with-custom-anchor.png");
  });

  test("opens on hover", async ({ page }) => {
    await gotoStory(page, "opens-on-hover");
    await expect(page).toHaveScreenshot("help-button-opens-on-hover.png");
  });
});

test.describe("HelpButton — dark", () => {
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
    await expect(page).toHaveScreenshot("help-button-default-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot(
      "help-button-css-customization-dark.png",
    );
  });
});
