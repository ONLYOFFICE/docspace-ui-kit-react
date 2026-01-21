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

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  INFO_PANEL_WIDTH,
  MAX_INFINITE_LOADER_SHIFT,
  checkIsSSR,
  desktop,
  isDesktop,
  isMobile,
  isMobileDevice,
  isTablet,
  isTouchDevice,
  mobile,
  mobileMore,
  size,
  tablet,
  transitionalScreenSize,
} from ".";

describe("device utilities", () => {
  describe("constants", () => {
    it("exports INFO_PANEL_WIDTH as 400", () => {
      expect(INFO_PANEL_WIDTH).toBe(400);
    });

    it("exports MAX_INFINITE_LOADER_SHIFT as 800", () => {
      expect(MAX_INFINITE_LOADER_SHIFT).toBe(800);
    });

    it("exports size object with mobile and desktop breakpoints", () => {
      expect(size).toEqual({
        mobile: 600,
        desktop: 1024,
      });
    });

    it("exports mobile media query", () => {
      expect(mobile).toBe("(max-width: 600px)");
    });

    it("exports mobileMore media query", () => {
      expect(mobileMore).toBe("(min-width: 600px)");
    });

    it("exports tablet media query", () => {
      expect(tablet).toBe("(max-width: 1023.9px)");
    });

    it("exports desktop media query", () => {
      expect(desktop).toBe("(min-width: 1024px)");
    });

    it("exports transitionalScreenSize media query", () => {
      expect(transitionalScreenSize).toBe("(max-width: 1424px)");
    });

    it("exports isTouchDevice boolean", () => {
      expect(typeof isTouchDevice).toBe("boolean");
    });
  });

  describe("checkIsSSR", () => {
    it("returns false when window is defined", () => {
      expect(checkIsSSR()).toBe(false);
    });
  });

  describe("isMobile", () => {
    const originalInnerWidth = window.innerWidth;

    afterEach(() => {
      Object.defineProperty(window, "innerWidth", {
        value: originalInnerWidth,
        writable: true,
      });
    });

    it("returns true when width is less than or equal to mobile size", () => {
      expect(isMobile(500)).toBe(true);
      expect(isMobile(600)).toBe(true);
    });

    it("returns false when width is greater than mobile size", () => {
      expect(isMobile(601)).toBe(false);
      expect(isMobile(1024)).toBe(false);
    });

    it("uses window.innerWidth when no width is provided", () => {
      Object.defineProperty(window, "innerWidth", {
        value: 500,
        writable: true,
      });
      expect(isMobile()).toBe(true);

      Object.defineProperty(window, "innerWidth", {
        value: 800,
        writable: true,
      });
      expect(isMobile()).toBe(false);
    });
  });

  describe("isMobileDevice", () => {
    const originalInnerWidth = window.innerWidth;
    const originalInnerHeight = window.innerHeight;
    const originalScreen = window.screen;

    beforeEach(() => {
      Object.defineProperty(window, "innerWidth", {
        value: 400,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, "innerHeight", {
        value: 800,
        writable: true,
        configurable: true,
      });
    });

    afterEach(() => {
      Object.defineProperty(window, "innerWidth", {
        value: originalInnerWidth,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, "innerHeight", {
        value: originalInnerHeight,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, "screen", {
        value: originalScreen,
        writable: true,
        configurable: true,
      });
    });

    it("returns true for mobile device dimensions", () => {
      Object.defineProperty(window, "innerWidth", {
        value: 400,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, "innerHeight", {
        value: 800,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, "screen", {
        value: {
          orientation: { angle: 0 },
        },
        writable: true,
        configurable: true,
      });

      expect(isMobileDevice()).toBe(true);
    });

    it("returns false for desktop device dimensions", () => {
      Object.defineProperty(window, "innerWidth", {
        value: 1200,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, "innerHeight", {
        value: 800,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, "screen", {
        value: {
          orientation: { angle: 0 },
        },
        writable: true,
        configurable: true,
      });

      expect(isMobileDevice()).toBe(false);
    });

    it("handles rotated device (90 degrees)", () => {
      Object.defineProperty(window, "innerWidth", {
        value: 800,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, "innerHeight", {
        value: 400,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, "screen", {
        value: {
          orientation: { angle: 90 },
        },
        writable: true,
        configurable: true,
      });

      expect(isMobileDevice()).toBe(true);
    });

    it("uses window.orientation as fallback", () => {
      Object.defineProperty(window, "innerWidth", {
        value: 400,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, "innerHeight", {
        value: 800,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, "screen", {
        value: {},
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, "orientation", {
        value: 0,
        writable: true,
        configurable: true,
      });

      expect(isMobileDevice()).toBe(true);
    });
  });

  describe("isTablet", () => {
    const originalInnerWidth = window.innerWidth;

    afterEach(() => {
      Object.defineProperty(window, "innerWidth", {
        value: originalInnerWidth,
        writable: true,
      });
    });

    it("returns true when width is between mobile and desktop", () => {
      expect(isTablet(700)).toBe(true);
      expect(isTablet(800)).toBe(true);
      expect(isTablet(1023)).toBe(true);
    });

    it("returns false when width is mobile size or less", () => {
      expect(isTablet(600)).toBe(false);
      expect(isTablet(500)).toBe(false);
    });

    it("returns false when width is desktop size or more", () => {
      expect(isTablet(1024)).toBe(false);
      expect(isTablet(1200)).toBe(false);
    });

    it("uses window.innerWidth when no width is provided", () => {
      Object.defineProperty(window, "innerWidth", {
        value: 800,
        writable: true,
      });
      expect(isTablet()).toBe(true);

      Object.defineProperty(window, "innerWidth", {
        value: 1200,
        writable: true,
      });
      expect(isTablet()).toBe(false);
    });
  });

  describe("isDesktop", () => {
    const originalInnerWidth = window.innerWidth;

    afterEach(() => {
      Object.defineProperty(window, "innerWidth", {
        value: originalInnerWidth,
        writable: true,
      });
    });

    it("returns true when window width is desktop size or more", () => {
      Object.defineProperty(window, "innerWidth", {
        value: 1024,
        writable: true,
      });
      expect(isDesktop()).toBe(true);

      Object.defineProperty(window, "innerWidth", {
        value: 1920,
        writable: true,
      });
      expect(isDesktop()).toBe(true);
    });

    it("returns false when window width is less than desktop size", () => {
      Object.defineProperty(window, "innerWidth", {
        value: 1023,
        writable: true,
      });
      expect(isDesktop()).toBe(false);

      Object.defineProperty(window, "innerWidth", {
        value: 600,
        writable: true,
      });
      expect(isDesktop()).toBe(false);
    });
  });

  describe("isMobile edge cases", () => {
    const originalInnerWidth = window.innerWidth;

    afterEach(() => {
      Object.defineProperty(window, "innerWidth", {
        value: originalInnerWidth,
        writable: true,
        configurable: true,
      });
    });

    it("returns true when width is 0 (falsy)", () => {
      // Test the || 0 fallback branch
      expect(isMobile(0)).toBe(true);
    });

    it("uses fallback value 0 when window.innerWidth is 0", () => {
      Object.defineProperty(window, "innerWidth", {
        value: 0,
        writable: true,
        configurable: true,
      });
      // 0 <= 600, so should return true
      expect(isMobile()).toBe(true);
    });
  });

  describe("isMobileDevice edge cases", () => {
    const originalScreen = window.screen;
    const originalOrientation = window.orientation;
    const originalInnerWidth = window.innerWidth;
    const originalInnerHeight = window.innerHeight;

    afterEach(() => {
      Object.defineProperty(window, "innerWidth", {
        value: originalInnerWidth,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, "innerHeight", {
        value: originalInnerHeight,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, "screen", {
        value: originalScreen,
        writable: true,
        configurable: true,
      });
      if (originalOrientation !== undefined) {
        Object.defineProperty(window, "orientation", {
          value: originalOrientation,
          writable: true,
          configurable: true,
        });
      }
    });

    it("falls back to 0 when no orientation info available", () => {
      Object.defineProperty(window, "innerWidth", {
        value: 400,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, "innerHeight", {
        value: 800,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, "screen", {
        value: { orientation: null },
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, "orientation", {
        value: undefined,
        writable: true,
        configurable: true,
      });

      // With no orientation, angle defaults to 0, so width = innerWidth
      expect(isMobileDevice()).toBe(true);
    });

    it("handles rotated device at 270 degrees", () => {
      Object.defineProperty(window, "innerWidth", {
        value: 800,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, "innerHeight", {
        value: 400,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, "screen", {
        value: {
          orientation: { angle: 270 },
        },
        writable: true,
        configurable: true,
      });

      // At 270 degrees, width calculation uses sin/cos to get effective width
      expect(isMobileDevice()).toBe(true);
    });

    it("handles screen.orientation.angle as undefined", () => {
      // With 90 degree rotation, width and height swap in calculation
      // We need innerHeight to be <= 600 for isMobile to return true after rotation
      Object.defineProperty(window, "innerWidth", {
        value: 800,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, "innerHeight", {
        value: 400,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, "screen", {
        value: {
          orientation: { angle: undefined },
        },
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, "orientation", {
        value: 90,
        writable: true,
        configurable: true,
      });

      // Should fall back to window.orientation (90), height becomes effective width
      // sin(90°) * 400 + cos(90°) * 800 = 1 * 400 + 0 * 800 = 400
      expect(isMobileDevice()).toBe(true);
    });
  });

  describe("isTablet edge cases", () => {
    const originalInnerWidth = window.innerWidth;

    afterEach(() => {
      Object.defineProperty(window, "innerWidth", {
        value: originalInnerWidth,
        writable: true,
        configurable: true,
      });
    });

    it("uses fallback value 0 when window.innerWidth is 0", () => {
      Object.defineProperty(window, "innerWidth", {
        value: 0,
        writable: true,
        configurable: true,
      });
      // 0 > 600 is false, so should return false
      expect(isTablet()).toBe(false);
    });
  });
});
