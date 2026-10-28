import { type Page, expect, test } from "@playwright/test";

const STORY_BASE = "ui-rows-row";

const STORIES = [
  "default",
  "modern-layout",
  "indeterminate-state",
  "disabled-state",
  "loading-state",
  "index-editing",
  "with-badges",
  "without-border",
  "context-menu-header",
  "right-to-left",
];

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

test.describe("row — light", () => {
  for (const storyId of STORIES) {
    test(storyId, async ({ page }) => {
      await gotoStory(page, storyId);
      await expect(page).toHaveScreenshot(`row-${storyId}.png`);
    });
  }
});

test.describe("row — dark", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        document.body.classList.add("dark");
      });
    });
  });

  for (const storyId of STORIES) {
    test(`${storyId} dark`, async ({ page }) => {
      await gotoStory(page, storyId);
      await page.evaluate(() => document.body.classList.add("dark"));
      await expect(page).toHaveScreenshot(`row-${storyId}-dark.png`);
    });
  }
});
