import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Form controls/FileInput"
// → prefix: "ui-form-controls-fileinput"
const STORY_BASE = "ui-form-controls-fileinput";

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

test.describe("FileInput — light", () => {
  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("file-input-css-customization.png");
  });

  test("with button", async ({ page }) => {
    await gotoStory(page, "with-button");
    await expect(page).toHaveScreenshot("file-input-with-button.png");
  });

  test("document icon", async ({ page }) => {
    await gotoStory(page, "document-icon");
    await expect(page).toHaveScreenshot("file-input-document-icon.png");
  });

  test("with path", async ({ page }) => {
    await gotoStory(page, "with-path");
    await expect(page).toHaveScreenshot("file-input-with-path.png");
  });
});

test.describe("FileInput — dark", () => {
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
      "file-input-css-customization-dark.png",
    );
  });
});
