import { test, expect, type Page } from "@playwright/test";

// Storybook story IDs for the Button component.
// Title: "UI/Interactive elements/Button" → prefix: "ui-interactive-elements-button"
const STORY_BASE = "ui-interactive-elements-button";

function storyUrl(storyId: string): string {
  return `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
}

async function gotoStory(page: Page, storyId: string) {
  await page.goto(storyUrl(storyId));
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
  // Wait for Storybook to finish rendering
  await page.waitForSelector("#storybook-root", { state: "visible" });
  // Wait for fonts and layout to stabilise
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

// ─── Screenshot tests (visual regression) ────────────────────────────────────
// These are the primary tests — they capture a visual baseline for every
// Button variant. When styles change the test will fail with a pixel diff.
// To update baseline after an intentional design change run:
//   pnpm test:e2e:docker:update-screenshots

test.describe("Button — screenshots (light theme)", () => {
  test("primary variants — all sizes", async ({ page }) => {
    await gotoStory(page, "primary-buttons");
    await expect(page).toHaveScreenshot("button-primary-all-sizes.png", {
      fullPage: false,
    });
  });

  test("secondary variants — all sizes", async ({ page }) => {
    await gotoStory(page, "secondary-buttons");
    await expect(page).toHaveScreenshot("button-secondary-all-sizes.png");
  });

  test("disabled variants — all sizes", async ({ page }) => {
    await gotoStory(page, "disabled-buttons");
    await expect(page).toHaveScreenshot("button-disabled-all-sizes.png");
  });

  test("loading variants — all sizes", async ({ page }) => {
    await gotoStory(page, "is-loading-buttons");
    await expect(page).toHaveScreenshot("button-loading-all-sizes.png");
  });

  test("hovered variants — all sizes", async ({ page }) => {
    await gotoStory(page, "hovered-buttons");
    await expect(page).toHaveScreenshot("button-hovered-all-sizes.png");
  });

  test("clicked variants — all sizes", async ({ page }) => {
    await gotoStory(page, "clicked-buttons");
    await expect(page).toHaveScreenshot("button-clicked-all-sizes.png");
  });

  test("filled variants — all sizes", async ({ page }) => {
    await gotoStory(page, "filled-buttons");
    await expect(page).toHaveScreenshot("button-filled-all-sizes.png");
  });

  test("filledStroke variants — all sizes", async ({ page }) => {
    await gotoStory(page, "filled-stroke-buttons");
    await expect(page).toHaveScreenshot("button-filled-stroke-all-sizes.png");
  });

  test("scale variants — all sizes", async ({ page }) => {
    await gotoStory(page, "scale-buttons");
    await expect(page).toHaveScreenshot("button-scale-all-sizes.png");
  });

  test("with icon — all sizes", async ({ page }) => {
    await gotoStory(page, "with-icon-buttons");
    await expect(page).toHaveScreenshot("button-with-icon-all-sizes.png");
  });

  test("accent variants — all sizes", async ({ page }) => {
    await gotoStory(page, "accent-buttons");
    await expect(page).toHaveScreenshot("button-accent-all-sizes.png");
  });

  test("hover state via mouse", async ({ page }) => {
    await gotoStory(page, "secondary-buttons");
    const firstButton = page
      .locator("#storybook-root [data-testid='button']")
      .first();
    await firstButton.hover();
    await expect(page).toHaveScreenshot("button-secondary-hover-mouse.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("button-css-customization.png");
  });
});

test.describe("Button — screenshots (dark theme)", () => {
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

  test("primary variants — all sizes dark", async ({ page }) => {
    await gotoStory(page, "primary-buttons");
    await expect(page).toHaveScreenshot("button-primary-all-sizes-dark.png");
  });

  test("secondary variants — all sizes dark", async ({ page }) => {
    await gotoStory(page, "secondary-buttons");
    await expect(page).toHaveScreenshot("button-secondary-all-sizes-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("button-css-customization-dark.png");
  });
});

// ─── Behaviour tests ──────────────────────────────────────────────────────────

test.describe("Button — behaviour", () => {
  test("renders with aria-label", async ({ page }) => {
    await gotoStory(page, "default");
    const button = page.locator("[data-testid='button']").first();
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute("aria-label", "Button");
  });

  test("has default data-testid", async ({ page }) => {
    await gotoStory(page, "default");
    const button = page.locator("[data-testid='button']").first();
    await expect(button).toHaveAttribute("data-testid", "button");
  });

  test("disabled button has aria-disabled and is not clickable", async ({
    page,
  }) => {
    await gotoStory(page, "disabled-buttons");
    const button = page
      .locator("#storybook-root [data-testid='button']")
      .first();
    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute("aria-disabled", "true");
  });

  test("loading button has aria-busy", async ({ page }) => {
    await gotoStory(page, "is-loading-buttons");
    const button = page
      .locator("#storybook-root [data-testid='button']")
      .first();
    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute("aria-busy", "true");
  });

  test("each size has data-size attribute", async ({ page }) => {
    await gotoStory(page, "primary-buttons");
    const sizes = ["extraSmall", "small", "normal", "medium"];
    for (const size of sizes) {
      const button = page.locator(
        `#storybook-root [data-testid='button'][data-size='${size}']`,
      );
      await expect(button).toBeVisible();
    }
  });
});
