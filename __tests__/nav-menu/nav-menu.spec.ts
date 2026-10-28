import { type Page, expect, test } from "@playwright/test";

// Title: "NavMenu"
const STORY_BASE = "ui-navigation-navmenu";

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

test.describe("NavMenu -- light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("nav-menu-default.png");
  });

  test("with-badge", async ({ page }) => {
    await gotoStory(page, "with-badge");
    await expect(page).toHaveScreenshot("nav-menu-with-badge.png");
  });

  test("collapsed-rail", async ({ page }) => {
    await gotoStory(page, "collapsed-rail");
    await expect(page).toHaveScreenshot("nav-menu-collapsed-rail.png");
  });

  test("with-expand-control", async ({ page }) => {
    await gotoStory(page, "with-expand-control");
    await expect(page).toHaveScreenshot("nav-menu-with-expand-control.png");
  });

  test("section-badges", async ({ page }) => {
    await gotoStory(page, "section-badges");
    await expect(page).toHaveScreenshot("nav-menu-section-badges.png");
  });

  test("with-separator", async ({ page }) => {
    await gotoStory(page, "with-separator");
    await expect(page).toHaveScreenshot("nav-menu-with-separator.png");
  });

  test("click-without-expanding", async ({ page }) => {
    await gotoStory(page, "click-without-expanding");
    await expect(page).toHaveScreenshot("nav-menu-click-without-expanding.png");
  });

  test("right-to-left", async ({ page }) => {
    await gotoStory(page, "right-to-left");
    await expect(page).toHaveScreenshot("nav-menu-right-to-left.png");
  });

  test("css-customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("nav-menu-css-customization.png");
  });
});

test.describe("NavMenu -- dark", () => {
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
    await expect(page).toHaveScreenshot("nav-menu-default-dark.png");
  });

  test("with-badge dark", async ({ page }) => {
    await gotoStory(page, "with-badge");
    await expect(page).toHaveScreenshot("nav-menu-with-badge-dark.png");
  });
});
