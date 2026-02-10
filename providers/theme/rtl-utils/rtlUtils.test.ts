import { describe, it, expect } from "vitest";

import {
  RTL_LANGUAGES,
  isLanguageRtl,
  getDirectionByLanguage,
  getCorrectTextAlign,
  getCorrectFourValuesStyle,
  getCorrectBorderRadius,
  getFontFamilyDependingOnLanguage,
} from "./index";
import { DEFAULT_FONT_FAMILY, SYSTEM_FONT_FAMILY } from "../themes/constants";

describe("rtl-utils", () => {
  describe("isLanguageRtl", () => {
    it("returns true for rtl languages", () => {
      expect(isLanguageRtl("ar-SA")).toBe(true);
      expect(isLanguageRtl("he-IL")).toBe(true);
    });

    it("returns false for ltr languages", () => {
      expect(isLanguageRtl("en-US")).toBe(false);
      expect(isLanguageRtl("fr")).toBe(false);
    });

    it("returns undefined when language is empty", () => {
      expect(isLanguageRtl("" as unknown as string)).toBeUndefined();
    });
  });

  describe("getDirectionByLanguage", () => {
    it("returns rtl for rtl locales and ltr otherwise", () => {
      expect(getDirectionByLanguage("ar-SA")).toBe("rtl");
      expect(getDirectionByLanguage("en-US")).toBe("ltr");
      expect(getDirectionByLanguage("" as unknown as string)).toBe("ltr");
    });
  });

  describe("getCorrectTextAlign", () => {
    it("swaps left/right in rtl", () => {
      expect(getCorrectTextAlign("left", "rtl")).toBe("right");
      expect(getCorrectTextAlign("right", "rtl")).toBe("left");
      expect(getCorrectTextAlign("center", "rtl")).toBe("center");
    });

    it("returns defaults when empty", () => {
      expect(getCorrectTextAlign("", "rtl")).toBe("right");
      expect(getCorrectTextAlign("", "ltr")).toBe("left");
    });
  });

  describe("getCorrectFourValuesStyle", () => {
    it("swaps horizontal values for rtl", () => {
      expect(getCorrectFourValuesStyle("1px 2px 3px 4px", "rtl")).toBe("1px 4px 3px 2px");
    });

    it("returns same string for ltr or invalid format", () => {
      expect(getCorrectFourValuesStyle("1px 2px 3px 4px", "ltr")).toBe("1px 2px 3px 4px");
      expect(getCorrectFourValuesStyle("1px 2px", "rtl")).toBe("1px 2px");
    });
  });

  describe("getCorrectBorderRadius", () => {
    it("handles 1 and 2 values", () => {
      expect(getCorrectBorderRadius("10px", "rtl")).toBe("10px");
      expect(getCorrectBorderRadius("10px 20px", "rtl")).toBe("20px 10px");
    });

    it("handles 3 and 4 values", () => {
      expect(getCorrectBorderRadius("10px 20px 30px", "rtl")).toBe("20px 10px 20px 30px");
      expect(getCorrectBorderRadius("10px 20px 30px 40px", "rtl")).toBe("20px 10px 40px 30px");
    });

    it("returns original for ltr", () => {
      const radius = "1px 2px 3px 4px";
      expect(getCorrectBorderRadius(radius, "ltr")).toBe(radius);
    });
  });

  describe("getFontFamilyDependingOnLanguage", () => {
    it("uses system font for arabic locale", () => {
      expect(getFontFamilyDependingOnLanguage("ar-SA")).toBe(SYSTEM_FONT_FAMILY);
    });

    it("uses default font for other locales", () => {
      RTL_LANGUAGES.filter((lng) => lng !== "ar-SA").forEach((lng) => {
        expect(getFontFamilyDependingOnLanguage(lng)).toBe(DEFAULT_FONT_FAMILY);
      });
      expect(getFontFamilyDependingOnLanguage("en-US")).toBe(DEFAULT_FONT_FAMILY);
    });
  });
});
