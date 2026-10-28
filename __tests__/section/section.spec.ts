import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Layout/Section"
// → prefix: "ui-layout-section"
const STORY_BASE = "ui-layout-section";

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

test.describe("Section — light", () => {
  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("section-css-customization.png");
  });

  test("with info panel", async ({ page }) => {
    await gotoStory(page, "with-info-panel");
    await expect(page).toHaveScreenshot("section-with-info-panel.png");
  });

  test("with chat panel", async ({ page }) => {
    await gotoStory(page, "with-chat-panel");
    await expect(page).toHaveScreenshot("section-with-chat-panel.png");
  });

  test("with banner", async ({ page }) => {
    await gotoStory(page, "with-banner");
    await expect(page).toHaveScreenshot("section-with-banner.png");
  });

  test("with submenu", async ({ page }) => {
    await gotoStory(page, "with-submenu");
    await expect(page).toHaveScreenshot("section-with-submenu.png");
  });

  test("with operations progress", async ({ page }) => {
    await gotoStory(page, "with-operations-progress");
    await expect(page).toHaveScreenshot("section-with-operations-progress.png");
  });

  test("with context menu", async ({ page }) => {
    await gotoStory(page, "with-context-menu");
    await expect(page).toHaveScreenshot("section-with-context-menu.png");
  });

  test("on tablet", async ({ page }) => {
    await gotoStory(page, "on-tablet");
    await expect(page).toHaveScreenshot("section-on-tablet.png");
  });

  test("on phone", async ({ page }) => {
    await gotoStory(page, "on-phone");
    await expect(page).toHaveScreenshot("section-on-phone.png");
  });

  test("right to left", async ({ page }) => {
    await gotoStory(page, "right-to-left");
    await expect(page).toHaveScreenshot("section-right-to-left.png");
  });
});

test.describe("Section — dark", () => {
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
    await expect(page).toHaveScreenshot("section-css-customization-dark.png");
  });
});
