import { type Page, expect, test } from "@playwright/test";

// Title: "QuantityPicker"
const STORY_BASE = "ui-form-controls-quantitypicker";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("QuantityPicker -- light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("quantity-picker-default.png");
  });

  test("with-slider", async ({ page }) => {
    await gotoStory(page, "with-slider");
    await expect(page).toHaveScreenshot("quantity-picker-with-slider.png");
  });

  test("with-plus-sign", async ({ page }) => {
    await gotoStory(page, "with-plus-sign");
    await expect(page).toHaveScreenshot("quantity-picker-with-plus-sign.png");
  });

  test("with-zero-allowed", async ({ page }) => {
    await gotoStory(page, "with-zero-allowed");
    await expect(page).toHaveScreenshot(
      "quantity-picker-with-zero-allowed.png",
    );
  });

  test("minus-locked-with-tooltip", async ({ page }) => {
    await gotoStory(page, "minus-locked-with-tooltip");
    await expect(page).toHaveScreenshot(
      "quantity-picker-minus-locked-with-tooltip.png",
    );
  });

  test("without-controls", async ({ page }) => {
    await gotoStory(page, "without-controls");
    await expect(page).toHaveScreenshot("quantity-picker-without-controls.png");
  });

  test("right-to-left", async ({ page }) => {
    await gotoStory(page, "right-to-left");
    await expect(page).toHaveScreenshot("quantity-picker-right-to-left.png");
  });
});

test.describe("QuantityPicker -- dark", () => {
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
    await expect(page).toHaveScreenshot("quantity-picker-default-dark.png");
  });

  test("with-slider dark", async ({ page }) => {
    await gotoStory(page, "with-slider");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("quantity-picker-with-slider-dark.png");
  });
});
