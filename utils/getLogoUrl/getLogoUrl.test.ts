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

import { describe, it, expect, vi, afterEach } from "vitest";
import { getLogoUrl } from "./index";
import { WhiteLabelLogoType } from "../../enums";

describe("getLogoUrl", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return correct URL with default parameters", () => {
    const url = getLogoUrl(WhiteLabelLogoType.LightSmall);
    expect(url).toBe("/logo.ashx?logotype=1&dark=false&default=false");
  });

  it("should return correct URL with dark parameter", () => {
    const url = getLogoUrl(WhiteLabelLogoType.LoginPage, true);
    expect(url).toBe("/logo.ashx?logotype=2&dark=true&default=false");
  });

  it("should return correct URL with default flag", () => {
    const url = getLogoUrl(WhiteLabelLogoType.Favicon, false, true);
    expect(url).toBe("/logo.ashx?logotype=3&dark=false&default=true");
  });

  it("should return correct URL with culture", () => {
    const url = getLogoUrl(
      WhiteLabelLogoType.DocsEditor,
      false,
      false,
      "en-US",
    );
    expect(url).toBe(
      "/logo.ashx?logotype=4&dark=false&default=false&culture=en-US",
    );
  });

  it("should return correct URL with update flag and no timestamp in sessionStorage", () => {
    const getItemSpy = vi
      .spyOn(Storage.prototype, "getItem")
      .mockReturnValue(null);
    const url = getLogoUrl(
      WhiteLabelLogoType.LeftMenu,
      false,
      false,
      undefined,
      true,
    );
    expect(url).toBe("/logo.ashx?logotype=6&dark=false&default=false");
    expect(getItemSpy).toHaveBeenCalledWith("logoUpdateTimestamp");
  });

  it("should return correct URL with update flag and timestamp in sessionStorage", () => {
    const getItemSpy = vi
      .spyOn(Storage.prototype, "getItem")
      .mockReturnValue("123456789");
    const url = getLogoUrl(
      WhiteLabelLogoType.AboutPage,
      false,
      false,
      undefined,
      true,
    );
    expect(url).toBe(
      "/logo.ashx?logotype=7&dark=false&default=false&t=123456789",
    );
    expect(getItemSpy).toHaveBeenCalledWith("logoUpdateTimestamp");
  });
});
