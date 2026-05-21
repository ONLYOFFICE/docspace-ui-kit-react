/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { test, expect, type Page } from "@playwright/test";

// Storybook story IDs for the Button component.
// Title: "UI/Interactive elements/Button" → prefix: "ui-interactive-elements-button"
const STORY_BASE = "ui-interactive-elements-button";

function storyUrl(storyId: string): string {
  return `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
}

async function gotoStory(page: Page, storyId: string) {
  await page.goto(storyUrl(storyId));
  // Wait for Storybook to finish rendering
  await page.waitForSelector("#storybook-root", { state: "visible" });
  // Wait for fonts and layout to stabilise
  await page.waitForLoadState("networkidle");
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
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        document.body.classList.add("dark");
      });
    });
  });

  test("primary variants — all sizes dark", async ({ page }) => {
    await gotoStory(page, "primary-buttons");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("button-primary-all-sizes-dark.png");
  });

  test("secondary variants — all sizes dark", async ({ page }) => {
    await gotoStory(page, "secondary-buttons");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("button-secondary-all-sizes-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
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

