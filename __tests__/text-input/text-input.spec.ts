import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Form controls/TextInput"
// → prefix: "ui-form-controls-textinput"
const STORY_BASE = "ui-form-controls-textinput";

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

test.describe("TextInput — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("text-input-default.png");
  });

  test("sizes", async ({ page }) => {
    await gotoStory(page, "sizes");
    await expect(page).toHaveScreenshot("text-input-sizes.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("text-input-css-customization.png");
  });
});

test.describe("TextInput — dark", () => {
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
    await expect(page).toHaveScreenshot("text-input-default-dark.png");
  });

  test("sizes dark", async ({ page }) => {
    await gotoStory(page, "sizes");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("text-input-sizes-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot(
      "text-input-css-customization-dark.png",
    );
  });
});
