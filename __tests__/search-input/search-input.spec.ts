// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import { type Page, expect, test } from "@playwright/test";

// Title: "UI/Interactive elements/SearchInput"
// → prefix: "ui-interactive-elements-searchinput"
const STORY_BASE = "ui-interactive-elements-searchinput";

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("SearchInput — light", () => {
  test("default", async ({ page }) => {
    await gotoStory(page, "default");
    await expect(page).toHaveScreenshot("search-input-default.png");
  });

  test("states", async ({ page }) => {
    await gotoStory(page, "states");
    await expect(page).toHaveScreenshot("search-input-states.png");
  });

  test("css customization", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("search-input-css-customization.png");
  });
});

test.describe("SearchInput — dark", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        document.body.classList.add("dark");
      });
    });
  });

  test("default dark", async ({ page }) => {
    await gotoStory(page, "default");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("search-input-default-dark.png");
  });

  test("states dark", async ({ page }) => {
    await gotoStory(page, "states");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("search-input-states-dark.png");
  });

  test("css customization dark", async ({ page }) => {
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("search-input-css-customization-dark.png");
  });
});
