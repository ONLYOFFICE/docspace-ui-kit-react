import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Feedback/PublicRoomBar"
// → prefix: "ui-feedback-publicroombar"
const STORY_BASE = "ui-feedback-publicroombar";

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

test.describe("PublicRoomBar — light", () => {
  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot(
      "public-room-bar-css-customization.png",
    );
  });

  test("with close button", async ({ page }) => {
    await gotoStory(page, "with-close-button");
    await expect(page).toHaveScreenshot(
      "public-room-bar-with-close-button.png",
    );
  });

  test("without header", async ({ page }) => {
    await gotoStory(page, "without-header");
    await expect(page).toHaveScreenshot("public-room-bar-without-header.png");
  });
});

test.describe("PublicRoomBar — dark", () => {
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
      "public-room-bar-css-customization-dark.png",
    );
  });
});
