import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Navigation/Tabs" → "ui-navigation-tabs"
const STORY_BASE = "ui-navigation-tabs";

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

test.describe("Tabs — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("tabs-default.png");
  });

  test("secondary", async ({ page }) => {
    await gotoStory(page, "secondary");
    await expect(page).toHaveScreenshot("tabs-secondary.png");
  });

  test("scaled", async ({ page }) => {
    await gotoStory(page, "scaled");
    await expect(page).toHaveScreenshot("tabs-scaled.png");
  });

  test("loading", async ({ page }) => {
    await gotoStory(page, "loading");
    await expect(page).toHaveScreenshot("tabs-loading.png");
  });

  test("with badges", async ({ page }) => {
    await gotoStory(page, "with-badges");
    await expect(page).toHaveScreenshot("tabs-with-badges.png");
  });

  test("with icons", async ({ page }) => {
    await gotoStory(page, "with-icons");
    await expect(page).toHaveScreenshot("tabs-with-icons.png");
  });

  test("animated selection", async ({ page }) => {
    await gotoStory(page, "animated-selection");
    await expect(page).toHaveScreenshot("tabs-animated-selection.png");
  });

  test("with sticky header", async ({ page }) => {
    await gotoStory(page, "with-sticky-header");
    // The play function scrolls the box by 200px, but where the list lands
    // varies with when the layout settles; scroll it again on the final one.
    await page.getByText("Project files").evaluate((heading) => {
      const box = heading.closest<HTMLElement>('[style*="overflow"]');
      if (box) box.scrollTop = 200;
    });
    await expect(page).toHaveScreenshot("tabs-with-sticky-header.png");
  });

  test("overflowing tabs", async ({ page }) => {
    await gotoStory(page, "overflowing-tabs");
    await expect(page).toHaveScreenshot("tabs-overflowing-tabs.png");
  });

  test("right to left", async ({ page }) => {
    await gotoStory(page, "right-to-left");
    await expect(page).toHaveScreenshot("tabs-right-to-left.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("tabs-css-customization.png");
  });
});

test.describe("Tabs — dark", () => {
  // The theme is set the way the dark-mode toolbar sets it, so the preview
  // decorator paints the story's surface and ThemeProvider themes it; a
  // class on <body> alone leaves a dark component on a white page.
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "sb-addon-themes-3",
        JSON.stringify({ current: "dark" }),
      );
    });
  });

  test("default dark", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("tabs-default-dark.png");
  });

  test("secondary dark", async ({ page }) => {
    await gotoStory(page, "secondary");
    await expect(page).toHaveScreenshot("tabs-secondary-dark.png");
  });

  test("scaled dark", async ({ page }) => {
    await gotoStory(page, "scaled");
    await expect(page).toHaveScreenshot("tabs-scaled-dark.png");
  });

  test("loading dark", async ({ page }) => {
    await gotoStory(page, "loading");
    await expect(page).toHaveScreenshot("tabs-loading-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("tabs-css-customization-dark.png");
  });
});
