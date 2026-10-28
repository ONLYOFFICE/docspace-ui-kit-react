import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Form controls/RadioButton"
// → prefix: "ui-form-controls-radiobutton"
const STORY_BASE = "ui-form-controls-radiobutton";

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

test.describe("RadioButton — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("radio-button-default.png");
  });

  test("checked states", async ({ page }) => {
    await gotoStory(page, "checked-states");
    await expect(page).toHaveScreenshot("radio-button-checked-states.png");
  });

  test("with spacing", async ({ page }) => {
    await gotoStory(page, "with-spacing");
    await expect(page).toHaveScreenshot("radio-button-with-spacing.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("radio-button-css-customization.png");
  });
});

test.describe("RadioButton — dark", () => {
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
    await expect(page).toHaveScreenshot("radio-button-default-dark.png");
  });

  test("checked states dark", async ({ page }) => {
    await gotoStory(page, "checked-states");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("radio-button-checked-states-dark.png");
  });

  test("with spacing dark", async ({ page }) => {
    await gotoStory(page, "with-spacing");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("radio-button-with-spacing-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot(
      "radio-button-css-customization-dark.png",
    );
  });
});
