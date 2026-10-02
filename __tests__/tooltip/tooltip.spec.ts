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

  test("shared by many anchors", async ({ page }) => {
    await gotoStory(page, "shared-by-many-anchors");
    await expect(page).toHaveScreenshot("tooltip-shared-by-many-anchors.png");
  });

  test("fixed content", async ({ page }) => {
    await gotoStory(page, "fixed-content");
    await expect(page).toHaveScreenshot("tooltip-fixed-content.png");
  });

  test("anchored by selector", async ({ page }) => {
    await gotoStory(page, "anchored-by-selector");
    await expect(page).toHaveScreenshot("tooltip-anchored-by-selector.png");
  });

  test("clickable content", async ({ page }) => {
    await gotoStory(page, "clickable-content");
    await expect(page).toHaveScreenshot("tooltip-clickable-content.png");
  });

  test("delayed appearance", async ({ page }) => {
    await gotoStory(page, "delayed-appearance");
    await expect(page).toHaveScreenshot("tooltip-delayed-appearance.png");
  });

  test("controlled open", async ({ page }) => {
    await gotoStory(page, "controlled-open");
    await expect(page).toHaveScreenshot("tooltip-controlled-open.png");
  });

  test("opened from code", async ({ page }) => {
    await gotoStory(page, "opened-from-code");
    await expect(page).toHaveScreenshot("tooltip-opened-from-code.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    // The story only renders the anchor -- react-tooltip mounts the bubble on
    // hover, so without this the locator below waits for something that never
    // appears.
    await page.getByText("Hover to see custom tooltip").hover();
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
    await page.getByText("Hover to see custom tooltip").hover();
    const tooltip = page.locator(".__react_component_tooltip").first();
    await tooltip.waitFor({ state: "visible" });
    // Compare only the tooltip element to avoid full-page position flakiness
    await expect(tooltip).toHaveScreenshot(
      "tooltip-css-customization-dark.png",
    );
  });
});
