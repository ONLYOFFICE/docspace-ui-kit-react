import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Navigation/Link"
// sanitize() lowercases and replaces spaces/slashes with dashes — no camelCase split for title segments
// → prefix: "ui-navigation-link" (Link → link)
const STORY_BASE = "ui-navigation-link";

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

test.describe("Link — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("link-default.png");
  });

  test("page links", async ({ page }) => {
    await gotoStory(page, "page-links");
    await expect(page).toHaveScreenshot("link-page-links.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("link-css-customization.png");
  });

  test("with text overflow", async ({ page }) => {
    await gotoStory(page, "with-text-overflow");
    await expect(page).toHaveScreenshot("link-with-text-overflow.png");
  });

  test("keyboard accessible action", async ({ page }) => {
    await gotoStory(page, "keyboard-accessible-action");
    // The story's play function has already tabbed to the link and clicked
    // it; restart the Tab order from the body: a plain blur() keeps the link
    // as the starting point, and the next Tab moves past it.
    await page.evaluate(() => {
      document.body.tabIndex = -1;
      document.body.focus();
      document.body.removeAttribute("tabindex");
    });
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("button", { name: "Move to archive" }),
    ).toBeFocused();
    await expect(page).toHaveScreenshot("link-keyboard-accessible-action.png");
  });

  test("with tooltip", async ({ page }) => {
    await gotoStory(page, "with-tooltip");
    await page.getByTestId("link").hover();
    await expect(page.getByText("Opens the shared folder")).toBeVisible();
    await expect(page).toHaveScreenshot("link-with-tooltip.png");
  });

  test("custom color", async ({ page }) => {
    await gotoStory(page, "custom-color");
    await expect(page).toHaveScreenshot("link-custom-color.png");
  });

  test("text decorations", async ({ page }) => {
    await gotoStory(page, "text-decorations");
    await expect(page).toHaveScreenshot("link-text-decorations.png");
  });
});

test.describe("Link — dark", () => {
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
    await expect(page).toHaveScreenshot("link-default-dark.png");
  });

  test("page links dark", async ({ page }) => {
    await gotoStory(page, "page-links");
    await expect(page).toHaveScreenshot("link-page-links-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("link-css-customization-dark.png");
  });
});
