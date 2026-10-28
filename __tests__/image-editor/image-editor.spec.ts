import { type Page, expect, test } from "@playwright/test";

// Title: "ImageEditor"
const STORY_BASE = "ui-interactive-elements-imageeditor";

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
  await page.waitForSelector('[data-testid="image-cropper"] canvas');
}

test.describe("ImageEditor -- light", () => {
  test("with-zoom-controls", async ({ page }) => {
    await gotoStory(page, "with-zoom-controls");
    await page.waitForSelector('[data-testid="zoom_in_icon_button"]');
    await expect(page).toHaveScreenshot("image-editor-with-zoom-controls.png");
  });

  test("disabled-state", async ({ page }) => {
    await gotoStory(page, "disabled-state");
    await page.waitForSelector('[data-testid="zoom_in_icon_button"]');
    await expect(page).toHaveScreenshot("image-editor-disabled-state.png");
  });

  test("fixed-framing", async ({ page }) => {
    await gotoStory(page, "fixed-framing");
    await expect(page).toHaveScreenshot("image-editor-fixed-framing.png");
  });
});
