import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Form controls/AccessRightSelect"
// → prefix: "ui-form-controls-accessrightselect"
const STORY_BASE = "ui-form-controls-accessrightselect";

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
  // The loader spins through SVG <animateTransform>, which the screenshot's
  // `animations: "disabled"` does not reach: stop it at its first frame.
  await page.evaluate(() =>
    document.querySelectorAll<SVGSVGElement>("svg").forEach((s) => {
      s.setCurrentTime?.(0);
      s.pauseAnimations?.();
    }),
  );
}

test.describe("AccessRightSelect — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("access-right-select-default.png");
  });

  test("display types", async ({ page }) => {
    await gotoStory(page, "display-types");
    await expect(page).toHaveScreenshot(
      "access-right-select-display-types.png",
    );
  });

  test("restricted choices", async ({ page }) => {
    await gotoStory(page, "restricted-choices");
    await expect(page).toHaveScreenshot(
      "access-right-select-restricted-choices.png",
    );
  });

  test("disabled state", async ({ page }) => {
    await gotoStory(page, "disabled-state");
    await expect(page).toHaveScreenshot(
      "access-right-select-disabled-state.png",
    );
  });

  test("loading state", async ({ page }) => {
    await gotoStory(page, "loading-state");
    await expect(page).toHaveScreenshot(
      "access-right-select-loading-state.png",
    );
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot(
      "access-right-select-css-customization.png",
    );
  });
});

test.describe("AccessRightSelect — dark", () => {
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
      "access-right-select-css-customization-dark.png",
    );
  });
});
