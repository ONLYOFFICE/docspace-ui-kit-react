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
