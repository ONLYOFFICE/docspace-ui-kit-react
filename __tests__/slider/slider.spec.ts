import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Interactive elements/Slider"
// → prefix: "ui-interactive-elements-slider"
const STORY_BASE = "ui-interactive-elements-slider";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("Slider — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("slider-default.png");
  });

  test("disabled state", async ({ page }) => {
    await gotoStory(page, "disabled-state");
    await expect(page).toHaveScreenshot("slider-disabled-state.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("slider-css-customization.png");
  });

  test("with custom steps", async ({ page }) => {
    await gotoStory(page, "with-custom-steps");
    await expect(page).toHaveScreenshot("slider-with-custom-steps.png");
  });

  test("without pouring", async ({ page }) => {
    await gotoStory(page, "without-pouring");
    await expect(page).toHaveScreenshot("slider-without-pouring.png");
  });

  test("with custom size", async ({ page }) => {
    await gotoStory(page, "with-custom-size");
    await expect(page).toHaveScreenshot("slider-with-custom-size.png");
  });

  test("rtl", async ({ page }) => {
    await gotoStory(page, "rtl");
    await expect(page).toHaveScreenshot("slider-rtl.png");
  });

  test("focus ring", async ({ page }) => {
    await gotoStory(page, "default");
    await page.keyboard.press("Tab");
    await expect(page).toHaveScreenshot("slider-focus-ring.png");
  });
});

test.describe("Slider — dark", () => {
  // The preview decorator paints the story's surface from the dark-mode
  // addon's state rather than from a class, so the theme is set the way the
  // toolbar sets it; a class alone leaves a dark component on a white page.
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "sb-addon-themes-3",
        JSON.stringify({ current: "dark" }),
      );
    });
  });

  test("default dark", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("slider-default-dark.png");
  });

  test("disabled state dark", async ({ page }) => {
    await gotoStory(page, "disabled-state");
    await expect(page).toHaveScreenshot("slider-disabled-state-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("slider-css-customization-dark.png");
  });

  test("with custom steps dark", async ({ page }) => {
    await gotoStory(page, "with-custom-steps");
    await expect(page).toHaveScreenshot("slider-with-custom-steps-dark.png");
  });

  test("without pouring dark", async ({ page }) => {
    await gotoStory(page, "without-pouring");
    await expect(page).toHaveScreenshot("slider-without-pouring-dark.png");
  });

  test("with custom size dark", async ({ page }) => {
    await gotoStory(page, "with-custom-size");
    await expect(page).toHaveScreenshot("slider-with-custom-size-dark.png");
  });

  test("rtl dark", async ({ page }) => {
    await gotoStory(page, "rtl");
    await expect(page).toHaveScreenshot("slider-rtl-dark.png");
  });

  test("focus ring dark", async ({ page }) => {
    await gotoStory(page, "default");
    await page.keyboard.press("Tab");
    await expect(page).toHaveScreenshot("slider-focus-ring-dark.png");
  });
});
