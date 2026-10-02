import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Overlays/AsideHeader"
// → prefix: "ui-overlays-asideheader"
const STORY_BASE = "ui-overlays-asideheader";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("AsideHeader — light", () => {
  test("with custom control", async ({ page }) => {
    await gotoStory(page, "with-custom-control");
    await expect(page).toHaveScreenshot("aside-header-with-custom-control.png");
  });

  test("right to left", async ({ page }) => {
    await gotoStory(page, "right-to-left");
    await expect(page).toHaveScreenshot("aside-header-right-to-left.png");
  });
});
