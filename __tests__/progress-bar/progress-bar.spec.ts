import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Status components/ProgressBar"
// sanitize() lowercases and replaces spaces/slashes with dashes — no camelCase split for title segments
// → prefix: "ui-status-components-progressbar" (ProgressBar → progressbar, not progress-bar)
const STORY_BASE = "ui-status-components-progressbar";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  // Storybook answers 200 for an unknown id and shows its error display
  // instead of the story: fail on that now, not on a timeout further down.
  await page.waitForSelector("body.sb-show-main, body.sb-show-errordisplay", {
    state: "attached",
  });
  await expect(page.locator("body")).not.toHaveClass(/sb-show-errordisplay/);
  // Screenshot the end state: wait until the story's play function, if it
  // has one, is done (playDelay.ts runs it at full speed under Playwright).
  // Under load Storybook may render the story a second time and run play
  // again, so the render has to stay finished for a while, not just get there.
  await page.waitForFunction(
    () => {
      const w = window as {
        __STORYBOOK_PREVIEW__?: { currentRender?: { phase?: string } };
        __settled?: { render: unknown; since: number };
      };
      const render = w.__STORYBOOK_PREVIEW__?.currentRender;
      if (render?.phase !== "finished") {
        w.__settled = undefined;
        return false;
      }
      if (w.__settled?.render !== render) {
        w.__settled = { render, since: performance.now() };
      }
      return performance.now() - w.__settled.since > 500;
    },
    undefined,
    { polling: 50 },
  );
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await page.waitForLoadState("networkidle");
  // A tooltip or menu the play function left open was placed before the
  // web font arrived, a pixel off where it lands once the text settles; have
  // it place itself again on the final layout. floating-ui's autoUpdate, which
  // react-tooltip uses, listens for scroll, not resize.
  await page.evaluate(async () => {
    await document.fonts.ready;
    window.dispatchEvent(new Event("resize"));
    window.dispatchEvent(new Event("scroll"));
  });
}

test.describe("ProgressBar — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("progress-bar-default.png");
  });

  test("with status", async ({ page }) => {
    await gotoStory(page, "with-status");
    await expect(page).toHaveScreenshot("progress-bar-with-status.png");
  });

  test("with error", async ({ page }) => {
    await gotoStory(page, "with-error");
    await expect(page).toHaveScreenshot("progress-bar-with-error.png");
  });

  test("complete", async ({ page }) => {
    await gotoStory(page, "complete");
    await expect(page).toHaveScreenshot("progress-bar-complete.png");
  });

  test("right to left", async ({ page }) => {
    await gotoStory(page, "right-to-left");
    await expect(page).toHaveScreenshot("progress-bar-right-to-left.png", {
      animations: "disabled",
    });
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("progress-bar-css-customization.png");
  });
});

test.describe("ProgressBar — dark", () => {
  test.beforeEach(async ({ page }) => {
    // The theme is set the way the dark-mode toolbar sets it, so the preview
    // decorator paints the story's surface and ThemeProvider themes it; a
    // class on <body> alone leaves a dark component on a white page.
    await page.addInitScript(() => {
      localStorage.setItem(
        "sb-addon-themes-3",
        JSON.stringify({ current: "dark" }),
      );
    });
  });

  test("default dark", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("progress-bar-default-dark.png");
  });

  test("with status dark", async ({ page }) => {
    await gotoStory(page, "with-status");
    await expect(page).toHaveScreenshot("progress-bar-with-status-dark.png");
  });

  test("with error dark", async ({ page }) => {
    await gotoStory(page, "with-error");
    await expect(page).toHaveScreenshot("progress-bar-with-error-dark.png");
  });

  test("complete dark", async ({ page }) => {
    await gotoStory(page, "complete");
    await expect(page).toHaveScreenshot("progress-bar-complete-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot(
      "progress-bar-css-customization-dark.png",
    );
  });
});
