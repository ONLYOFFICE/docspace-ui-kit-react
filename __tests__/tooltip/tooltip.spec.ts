import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Overlays/Tooltip" → "ui-overlays-tooltip"
const STORY_BASE = "ui-overlays-tooltip";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("Tooltip — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("tooltip-default.png");
  });

  test("custom styling", async ({ page }) => {
    await gotoStory(page, "custom-styling");
    await expect(page).toHaveScreenshot("tooltip-custom-styling.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    const tooltip = page.locator(".__react_component_tooltip").first();
    await tooltip.waitFor({ state: "visible" });
    // Compare only the tooltip element to avoid full-page position flakiness
    await expect(tooltip).toHaveScreenshot("tooltip-css-customization.png");
  });
});

test.describe("Tooltip — dark", () => {
  test("default dark", async ({ page }) => {
    await gotoStory(page, "default");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("tooltip-default-dark.png");
  });

  test("custom styling dark", async ({ page }) => {
    await gotoStory(page, "custom-styling");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("tooltip-custom-styling-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    const tooltip = page.locator(".__react_component_tooltip").first();
    await tooltip.waitFor({ state: "visible" });
    // Compare only the tooltip element to avoid full-page position flakiness
    await expect(tooltip).toHaveScreenshot("tooltip-css-customization-dark.png");
  });
});
