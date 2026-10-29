import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Layout/Article"
// → prefix: "ui-layout-article"
const STORY_BASE = "ui-layout-article";

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

test.describe("Article — light", () => {
  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("article-css-customization.png");
  });

  test("with main button", async ({ page }) => {
    await gotoStory(page, "with-main-button");
    await expect(page).toHaveScreenshot("article-with-main-button.png");
  });

  test("custom header", async ({ page }) => {
    await gotoStory(page, "custom-header");
    await expect(page).toHaveScreenshot("article-custom-header.png");
  });

  test("with back button", async ({ page }) => {
    await gotoStory(page, "with-back-button");
    await expect(page).toHaveScreenshot("article-with-back-button.png");
  });

  test("loading state", async ({ page }) => {
    await gotoStory(page, "loading-state");
    await expect(page).toHaveScreenshot("article-loading-state.png");
  });

  test("with custom slot", async ({ page }) => {
    await gotoStory(page, "with-custom-slot");
    await expect(page).toHaveScreenshot("article-with-custom-slot.png");
  });

  test("without footer blocks", async ({ page }) => {
    await gotoStory(page, "without-footer-blocks");
    await expect(page).toHaveScreenshot("article-without-footer-blocks.png");
  });

  test("collapsed on tablet", async ({ page }) => {
    await page.setViewportSize({ width: 834, height: 640 });
    await gotoStory(page, "collapsed-on-tablet");
    await expect(page).toHaveScreenshot("article-collapsed-on-tablet.png");
  });

  test("on phone", async ({ page }) => {
    await page.setViewportSize({ width: 414, height: 640 });
    await gotoStory(page, "on-phone");
    await expect(page).toHaveScreenshot("article-on-phone.png");
  });

  test("right to left", async ({ page }) => {
    await gotoStory(page, "right-to-left");
    await expect(page).toHaveScreenshot("article-right-to-left.png");
  });
});

test.describe("Article — dark", () => {
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

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("article-css-customization-dark.png");
  });
});
