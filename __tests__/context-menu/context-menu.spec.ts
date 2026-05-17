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

import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Overlays/ContextMenu" → "ui-overlays-contextmenu"
const STORY_BASE = "ui-overlays-contextmenu";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("ContextMenu — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("context-menu-default.png");
  });

  test("simple menu", async ({ page }) => {
    await gotoStory(page, "simple-menu");
    await expect(page).toHaveScreenshot("context-menu-simple-menu.png");
  });

  test("with backdrop", async ({ page }) => {
    await gotoStory(page, "with-backdrop");
    await expect(page).toHaveScreenshot("context-menu-with-backdrop.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.click('[data-testid="trigger"]', { button: "right" });
    const menu = page.locator(".p-contextmenu").first();
    await menu.waitFor({ state: "visible" });
    await expect(menu).toHaveScreenshot("context-menu-css-customization.png");
  });
});

test.describe("ContextMenu — dark", () => {
  test("default dark", async ({ page }) => {
    await gotoStory(page, "default");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("context-menu-default-dark.png");
  });

  test("simple menu dark", async ({ page }) => {
    await gotoStory(page, "simple-menu");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("context-menu-simple-menu-dark.png");
  });

  test("with backdrop dark", async ({ page }) => {
    await gotoStory(page, "with-backdrop");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("context-menu-with-backdrop-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await page.click('[data-testid="trigger"]', { button: "right" });
    const menu = page.locator(".p-contextmenu").first();
    await menu.waitFor({ state: "visible" });
    await expect(menu).toHaveScreenshot(
      "context-menu-css-customization-dark.png",
    );
  });
});
