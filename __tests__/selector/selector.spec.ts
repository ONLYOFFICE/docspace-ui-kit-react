import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Overlays/Selector"
// → prefix: "ui-overlays-selector"
const STORY_BASE = "ui-overlays-selector";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("Selector — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("selector-default.png");
  });

  test("content loading", async ({ page }) => {
    await gotoStory(page, "content-loading");
    await expect(page).toHaveScreenshot("selector-content-loading.png");
  });

  test("bread crumbs", async ({ page }) => {
    await gotoStory(page, "bread-crumbs");
    await expect(page).toHaveScreenshot("selector-bread-crumbs.png");
  });

  test("new name", async ({ page }) => {
    await gotoStory(page, "new-name");
    await expect(page).toHaveScreenshot("selector-new-name.png");
  });

  test("with header", async ({ page }) => {
    await gotoStory(page, "with-header");
    await expect(page).toHaveScreenshot("selector-with-header.png");
  });

  test("with search", async ({ page }) => {
    await gotoStory(page, "with-search");
    await expect(page).toHaveScreenshot("selector-with-search.png");
  });

  test("multi select", async ({ page }) => {
    await gotoStory(page, "multi-select");
    await expect(page).toHaveScreenshot("selector-multi-select.png");
  });

  test("selection limit", async ({ page }) => {
    await gotoStory(page, "selection-limit");
    await expect(page).toHaveScreenshot("selector-selection-limit.png");
  });

  test("disabled items", async ({ page }) => {
    await gotoStory(page, "disabled-items");
    await expect(page).toHaveScreenshot("selector-disabled-items.png");
  });

  test("with access rights", async ({ page }) => {
    await gotoStory(page, "with-access-rights");
    await expect(page).toHaveScreenshot("selector-with-access-rights.png");
  });

  test("empty folder", async ({ page }) => {
    await gotoStory(page, "empty-folder");
    await expect(page).toHaveScreenshot("selector-empty-folder.png");
  });

  test("loading state", async ({ page }) => {
    await gotoStory(page, "loading-state");
    await expect(page).toHaveScreenshot("selector-loading-state.png");
  });

  test("with tabs", async ({ page }) => {
    await gotoStory(page, "with-tabs");
    await expect(page).toHaveScreenshot("selector-with-tabs.png");
  });

  test("with info", async ({ page }) => {
    await gotoStory(page, "with-info");
    await expect(page).toHaveScreenshot("selector-with-info.png");
  });

  test("with info bar", async ({ page }) => {
    await gotoStory(page, "with-info-bar");
    await expect(page).toHaveScreenshot("selector-with-info-bar.png");
  });

  test("in side panel", async ({ page }) => {
    await gotoStory(page, "in-side-panel");
    await expect(page).toHaveScreenshot("selector-in-side-panel.png");
  });

  test("right to left", async ({ page }) => {
    await gotoStory(page, "right-to-left");
    await expect(page).toHaveScreenshot("selector-right-to-left.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("selector-css-customization.png");
  });
});
