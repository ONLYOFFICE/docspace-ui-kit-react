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

import { describe, it, expect } from "vitest";
import { getTextColor } from ".";
import { globalColors } from "../../themes";

describe("getTextColor", () => {
  const { black, white } = globalColors;

  describe("light backgrounds (should return black text)", () => {
    it("returns black for white background", () => {
      expect(getTextColor("#ffffff")).toBe(black);
    });

    it("returns black for light gray background", () => {
      expect(getTextColor("#f0f0f0")).toBe(black);
    });

    it("returns black for light yellow background", () => {
      expect(getTextColor("#ffff00")).toBe(black);
    });

    it("returns black for light cyan background", () => {
      expect(getTextColor("#00ffff")).toBe(black);
    });

    it("returns black for light green background", () => {
      expect(getTextColor("#90EE90")).toBe(black);
    });
  });

  describe("dark backgrounds (should return white text)", () => {
    it("returns white for black background", () => {
      expect(getTextColor("#000000")).toBe(white);
    });

    it("returns white for dark gray background", () => {
      expect(getTextColor("#333333")).toBe(white);
    });

    it("returns white for dark blue background", () => {
      expect(getTextColor("#000080")).toBe(white);
    });

    it("returns white for dark red background", () => {
      expect(getTextColor("#800000")).toBe(white);
    });

    it("returns white for dark green background", () => {
      expect(getTextColor("#006400")).toBe(white);
    });

    it("returns white for purple background", () => {
      expect(getTextColor("#800080")).toBe(white);
    });
  });

  describe("medium brightness colors", () => {
    it("returns black for medium blue (#4781D1)", () => {
      expect(getTextColor("#4781D1")).toBe(white);
    });

    it("returns white for medium gray (#808080)", () => {
      expect(getTextColor("#808080")).toBe(white);
    });
  });

  describe("custom brightness threshold", () => {
    it("returns black when threshold is high (200) for light gray", () => {
      // #cccccc has brightness of 204, which is > 200, so returns black
      expect(getTextColor("#cccccc", 200)).toBe(black);
    });

    it("returns black when threshold is low (50) for dark gray", () => {
      expect(getTextColor("#555555", 50)).toBe(black);
    });

    it("changes result based on threshold for medium color", () => {
      const mediumColor = "#888888";
      // #888888 has brightness of 136
      // With default threshold (128), 136 > 128, returns black
      expect(getTextColor(mediumColor)).toBe(black);
      // With higher threshold (150), 136 <= 150, returns white
      expect(getTextColor(mediumColor, 150)).toBe(white);
      // With very low threshold (50), 136 > 50, returns black
      expect(getTextColor(mediumColor, 50)).toBe(black);
    });
  });

  describe("hex format variations", () => {
    it("handles 6-digit hex without hash", () => {
      expect(getTextColor("#FFFFFF")).toBe(black);
    });

    it("handles lowercase hex", () => {
      expect(getTextColor("#ffffff")).toBe(black);
    });

    it("handles uppercase hex", () => {
      expect(getTextColor("#FFFFFF")).toBe(black);
    });

    it("handles mixed case hex", () => {
      expect(getTextColor("#FfFfFf")).toBe(black);
    });
  });

  describe("brand colors", () => {
    it("returns appropriate color for main blue (#4781D1)", () => {
      expect(getTextColor("#4781D1")).toBe(white);
    });

    it("returns appropriate color for main green (#2DB482)", () => {
      // #2DB482 (45, 180, 130) has brightness ~134, which is > 128, returns black
      expect(getTextColor("#2DB482")).toBe(black);
    });

    it("returns appropriate color for main orange (#F97A0B)", () => {
      expect(getTextColor("#F97A0B")).toBe(black);
    });

    it("returns appropriate color for main red (#F2675A)", () => {
      expect(getTextColor("#F2675A")).toBe(black);
    });
  });
});
