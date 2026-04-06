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

// Title: "UI/Data display/PortalLogo"
// → prefix: "ui-data-display-portallogo"
const STORY_BASE = "ui-data-display-portallogo";

const MOBILE_LOGO_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="24"><rect fill="#0082c9" width="48" height="24" rx="4"/></svg>';

async function gotoStory(page: Page, storyId: string) {
  const url = `/iframe.html?id=${STORY_BASE}--${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForSelector("#storybook-root", { state: "visible" });
  await expect(page.locator("text=Story not found")).toHaveCount(0);
  await page.waitForLoadState("networkidle");
}

test.describe("PortalLogo — light", () => {
  test("css customization (mobile)", async ({ page }) => {
    // Mock logo requests so the <img> loads instead of triggering the error fallback
    await page.route(/\/logo\.ashx/, (route) =>
      route.fulfill({
        contentType: "image/svg+xml",
        body: MOBILE_LOGO_SVG,
      }),
    );
    // Use mobile viewport so the resizable header bar is visible
    await page.setViewportSize({ width: 500, height: 600 });
    await gotoStory(page, "css-customization");
    await expect(page).toHaveScreenshot("portal-logo-css-customization.png");
  });
});

test.describe("PortalLogo — dark", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        document.body.classList.add("dark");
      });
    });
  });

  test("css customization dark (mobile)", async ({ page }) => {
    await page.route(/\/logo\.ashx/, (route) =>
      route.fulfill({
        contentType: "image/svg+xml",
        body: MOBILE_LOGO_SVG,
      }),
    );
    await page.setViewportSize({ width: 500, height: 600 });
    await gotoStory(page, "css-customization");
    await page.evaluate(() => document.body.classList.add("dark"));
    await expect(page).toHaveScreenshot("portal-logo-css-customization-dark.png");
  });
});
