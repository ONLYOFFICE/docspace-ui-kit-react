import { type Page, expect, test } from "@playwright/test";

const COMPONENTS: { id: string; name: string; stories?: string[] }[] = [
  {
    id: "ui-tiles-basetile",
    name: "base-tile",
    stories: ["with-menu-button", "renaming-state", "blocking-operation"],
  },
  {
    id: "ui-tiles-filetile",
    name: "file-tile",
    stories: ["with-thumbnail", "with-hotkey-border", "renaming-state"],
  },
  {
    id: "ui-tiles-foldertile",
    name: "folder-tile",
    stories: ["with-hotkey-border", "renaming-state", "right-to-left"],
  },
  {
    id: "ui-tiles-roomtile",
    name: "room-tile",
    stories: [
      "generated-tags",
      "with-hotkey-border",
      "renaming-state",
      "custom-bottom-row",
    ],
  },
  {
    id: "ui-tiles-templatetile",
    name: "template-tile",
    stories: ["in-progress", "with-hotkey-border", "renaming-state"],
  },
  {
    id: "ui-tiles-tilecontainer",
    name: "tile-container",
    stories: ["folders-and-files"],
  },
  {
    id: "ui-tiles-tilecontent",
    name: "tile-content",
    stories: ["fixed-title-width"],
  },
];

async function gotoStory(page: Page, storyBase: string, storyId: string) {
  const url = `/iframe.html?id=${storyBase}--${storyId}&viewMode=story`;
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

for (const { id, name, stories = [] } of COMPONENTS) {
  test.describe(`${name} — light`, () => {
    test("default", async ({ page }) => {
      await gotoStory(page, id, "default");
      await expect(page).toHaveScreenshot(`${name}-default.png`);
    });

    test("css customization", async ({ page }) => {
      await gotoStory(page, id, "css-customization");
      await expect(page).toHaveScreenshot(`${name}-css-customization.png`);
    });

    for (const storyId of stories) {
      test(storyId, async ({ page }) => {
        await gotoStory(page, id, storyId);
        await expect(page).toHaveScreenshot(`${name}-${storyId}.png`);
      });
    }
  });

  test.describe(`${name} — dark`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript(() => {
        document.addEventListener("DOMContentLoaded", () => {
          document.body.classList.add("dark");
        });
      });
    });

    test("default dark", async ({ page }) => {
      await gotoStory(page, id, "default");
      await page.evaluate(() => document.body.classList.add("dark"));
      await expect(page).toHaveScreenshot(`${name}-default-dark.png`);
    });

    test("css customization dark", async ({ page }) => {
      await gotoStory(page, id, "css-customization");
      await page.evaluate(() => document.body.classList.add("dark"));
      await expect(page).toHaveScreenshot(`${name}-css-customization-dark.png`);
    });

    for (const storyId of stories) {
      test(`${storyId} dark`, async ({ page }) => {
        await gotoStory(page, id, storyId);
        await page.evaluate(() => document.body.classList.add("dark"));
        await expect(page).toHaveScreenshot(`${name}-${storyId}-dark.png`);
      });
    }
  });
}
