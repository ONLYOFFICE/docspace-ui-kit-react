import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Overlays/AsideHeader"
// → prefix: "ui-overlays-asideheader"
const STORY_BASE = "ui-overlays-asideheader";

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
