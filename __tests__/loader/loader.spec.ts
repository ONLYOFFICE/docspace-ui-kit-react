import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Status components/Loader"
// sanitize() lowercases and replaces spaces/slashes with dashes — no camelCase split for title segments
// → prefix: "ui-status-components-loader" (Loader → loader)
const STORY_BASE = "ui-status-components-loader";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  // Guard: Storybook returns 200 even for missing stories
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("Loader — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("loader-default.png");
  });

  test("oval", async ({ page }) => {
    await gotoStory(page, "oval");
    await page.evaluate(() =>
      document.querySelectorAll<SVGSVGElement>("svg").forEach((s) => {
        s.setCurrentTime?.(0);
        s.pauseAnimations?.();
      }),
    );
    await expect(page).toHaveScreenshot("loader-oval.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() =>
      document.querySelectorAll<SVGSVGElement>("svg").forEach((s) => {
        s.setCurrentTime?.(0);
        s.pauseAnimations?.();
      }),
    );
    await expect(page).toHaveScreenshot("loader-css-customization.png");
  });
});

test.describe("Loader — dark", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        document.body.classList.add("dark");
      });
    });
  });

  test("default dark", async ({ page }) => {
    await gotoStory(page, "default");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("loader-default-dark.png");
  });

  test("oval dark", async ({ page }) => {
    await gotoStory(page, "oval");
    await page.evaluate(() => document.body.classList.add("dark"));
    await page.evaluate(() =>
      document.querySelectorAll<SVGSVGElement>("svg").forEach((s) => {
        s.setCurrentTime?.(0);
        s.pauseAnimations?.();
      }),
    );
    await expect(page).toHaveScreenshot("loader-oval-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await page.evaluate(() =>
      document.querySelectorAll<SVGSVGElement>("svg").forEach((s) => {
        s.setCurrentTime?.(0);
        s.pauseAnimations?.();
      }),
    );
    await expect(page).toHaveScreenshot("loader-css-customization-dark.png");
  });
});
