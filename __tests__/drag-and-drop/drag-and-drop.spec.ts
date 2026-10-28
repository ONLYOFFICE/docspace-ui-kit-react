import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Interactive elements/DragAndDrop"
// → prefix: "ui-interactive-elements-draganddrop"
const STORY_BASE = "ui-interactive-elements-draganddrop";

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

test.describe("DragAndDrop — light", () => {
  test("nested targets", async ({ page }) => {
    await gotoStory(page, "nested-targets");
    await expect(page).toHaveScreenshot("drag-and-drop-nested-targets.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("drag-and-drop-css-customization.png");
  });
});

test.describe("DragAndDrop — dark", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        document.body.classList.add("dark");
      });
    });
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot(
      "drag-and-drop-css-customization-dark.png",
    );
  });
});
