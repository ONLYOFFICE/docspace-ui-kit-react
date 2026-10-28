import { type Page, expect, test } from "@playwright/test";

// Title: "CollapsibleCard"
const STORY_BASE = "ui-data-display-collapsiblecard";

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

test.describe("CollapsibleCard -- light", () => {
  test("collapsed", async ({ page }) => {
    await gotoStory(page, "collapsed");
    await expect(page).toHaveScreenshot("collapsible-card-collapsed.png");
  });

  test("expanded", async ({ page }) => {
    await gotoStory(page, "expanded");
    await expect(page).toHaveScreenshot("collapsible-card-expanded.png");
  });

  test("title only", async ({ page }) => {
    await gotoStory(page, "title-only");
    await expect(page).toHaveScreenshot("collapsible-card-title-only.png");
  });

  test("controlled state", async ({ page }) => {
    await gotoStory(page, "controlled-state");
    await expect(page).toHaveScreenshot(
      "collapsible-card-controlled-state.png",
    );
  });
});

test.describe("CollapsibleCard -- dark", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        document.body.classList.add("dark");
      });
    });
  });

  test("collapsed dark", async ({ page }) => {
    await gotoStory(page, "collapsed");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("collapsible-card-collapsed-dark.png");
  });

  test("expanded dark", async ({ page }) => {
    await gotoStory(page, "expanded");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("collapsible-card-expanded-dark.png");
  });
});
