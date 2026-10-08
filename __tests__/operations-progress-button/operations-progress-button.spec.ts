import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Feedback/OperationsProgressButton"
// → prefix: "ui-feedback-operationsprogressbutton"
const STORY_BASE = "ui-feedback-operationsprogressbutton";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("OperationsProgressButton — light", () => {
  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot(
      "operations-progress-button-css-customization.png",
    );
  });

  test("stopped operation", async ({ page }) => {
    await gotoStory(page, "stopped-operation");
    await expect(page).toHaveScreenshot(
      "operations-progress-button-stopped-operation.png",
    );
  });

  test("opens panel on click", async ({ page }) => {
    await gotoStory(page, "opens-panel-on-click");
    await expect(page).toHaveScreenshot(
      "operations-progress-button-opens-panel-on-click.png",
    );
  });

  test("drag preview", async ({ page }) => {
    await gotoStory(page, "drag-preview");
    await expect(page).toHaveScreenshot(
      "operations-progress-button-drag-preview.png",
    );
  });

  test("right to left", async ({ page }) => {
    await gotoStory(page, "right-to-left");
    await expect(page).toHaveScreenshot(
      "operations-progress-button-right-to-left.png",
    );
  });
});

test.describe("OperationsProgressButton — dark", () => {
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
      "operations-progress-button-css-customization-dark.png",
    );
  });
});
