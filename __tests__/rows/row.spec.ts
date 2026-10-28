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

  for (const storyId of STORIES) {
    test(`${storyId} dark`, async ({ page }) => {
      await gotoStory(page, storyId);
      await expect(page).toHaveScreenshot(`row-${storyId}-dark.png`);
    });
  }
});
