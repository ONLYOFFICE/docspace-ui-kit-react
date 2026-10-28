import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Form controls/InputBlock"
// → prefix: "ui-form-controls-inputblock"
const STORY_BASE = "ui-form-controls-inputblock";

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

test.describe("InputBlock — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("input-block-default.png");
  });

  test("states", async ({ page }) => {
    await gotoStory(page, "states");
    await expect(page).toHaveScreenshot("input-block-states.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("input-block-css-customization.png");
  });

  test("with prefix", async ({ page }) => {
    await gotoStory(page, "with-prefix");
    await expect(page).toHaveScreenshot("input-block-with-prefix.png");
  });

  test("right to left", async ({ page }) => {
    await gotoStory(page, "right-to-left");
    await expect(page).toHaveScreenshot("input-block-right-to-left.png");
  });
});

test.describe("InputBlock — dark", () => {
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
    await expect(page).toHaveScreenshot("input-block-default-dark.png");
  });

  test("states dark", async ({ page }) => {
    await gotoStory(page, "states");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("input-block-states-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot(
      "input-block-css-customization-dark.png",
    );
  });
});
