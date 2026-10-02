import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Layout/ThemeProviderComponent" -> prefix "ui-layout-themeprovidercomponent"
const STORY_BASE = "ui-layout-themeprovidercomponent";

async function gotoStory(page: Page, storyId: string, globals = "") {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story${globals}`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  // Guard: Storybook returns 200 even for missing stories
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("ThemeProviderComponent", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("theme-provider-default.png");
  });

  test("dark theme", async ({ page }) => {
    await gotoStory(page, "dark-theme");
    await expect(page).toHaveScreenshot("theme-provider-dark-theme.png");
  });

  test("with accent colors", async ({ page }) => {
    await gotoStory(page, "with-accent-colors");
    await expect(page).toHaveScreenshot(
      "theme-provider-with-accent-colors.png",
    );
  });

  test("right to left", async ({ page }) => {
    await gotoStory(page, "right-to-left", "&globals=direction:rtl");
    await expect(page).toHaveScreenshot("theme-provider-right-to-left.png");
  });
});
