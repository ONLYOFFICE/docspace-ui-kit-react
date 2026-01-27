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

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import DomHelpers from ".";

describe("DomHelpers", () => {
  describe("getViewport", () => {
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
    });

    it("returns viewport dimensions from window", () => {
      Object.defineProperty(window, "innerWidth", {
        value: 1920,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, "innerHeight", {
        value: 1080,
        writable: true,
        configurable: true,
      });

      const viewport = DomHelpers.getViewport();

      expect(viewport.width).toBe(1920);
      expect(viewport.height).toBe(1080);
    });

    it("returns object with width and height properties", () => {
      const viewport = DomHelpers.getViewport();

      expect(viewport).toHaveProperty("width");
      expect(viewport).toHaveProperty("height");
      expect(typeof viewport.width).toBe("number");
      expect(typeof viewport.height).toBe("number");
    });
  });

  describe("getOffset", () => {
    it("returns auto values when element is null", () => {
      const offset = DomHelpers.getOffset(null);

      expect(offset).toEqual({
        top: "auto",
        left: "auto",
      });
    });

    it("returns auto values when element is undefined", () => {
      const offset = DomHelpers.getOffset(undefined);

      expect(offset).toEqual({
        top: "auto",
        left: "auto",
      });
    });

    it("returns calculated offset for an element", () => {
      const mockElement = document.createElement("div");
      document.body.appendChild(mockElement);

      vi.spyOn(mockElement, "getBoundingClientRect").mockReturnValue({
        top: 100,
        left: 50,
        bottom: 200,
        right: 150,
        width: 100,
        height: 100,
        x: 50,
        y: 100,
        toJSON: () => ({}),
      });

      const offset = DomHelpers.getOffset(mockElement);

      expect(typeof offset.top).toBe("number");
      expect(typeof offset.left).toBe("number");

      document.body.removeChild(mockElement);
    });
  });

  describe("getOuterWidth", () => {
    it("returns 0 when element is falsy", () => {
      const width = DomHelpers.getOuterWidth(null as unknown as HTMLElement);

      expect(width).toBe(0);
    });

    it("returns offsetWidth for an element without margin", () => {
      const mockElement = document.createElement("div");
      mockElement.style.width = "100px";
      document.body.appendChild(mockElement);

      Object.defineProperty(mockElement, "offsetWidth", {
        value: 100,
        configurable: true,
      });

      const width = DomHelpers.getOuterWidth(mockElement);

      expect(width).toBe(100);

      document.body.removeChild(mockElement);
    });

    it("includes margin when margin parameter is provided", () => {
      const mockElement = document.createElement("div");
      mockElement.style.width = "100px";
      mockElement.style.marginLeft = "10px";
      mockElement.style.marginRight = "10px";
      document.body.appendChild(mockElement);

      Object.defineProperty(mockElement, "offsetWidth", {
        value: 100,
        configurable: true,
      });

      const width = DomHelpers.getOuterWidth(mockElement, "true");

      expect(width).toBeGreaterThanOrEqual(100);

      document.body.removeChild(mockElement);
    });
  });

  describe("getHiddenElementOuterWidth", () => {
    it("returns 0 when element is null", () => {
      const width = DomHelpers.getHiddenElementOuterWidth(null);

      expect(width).toBe(0);
    });

    it("temporarily shows element to get width", () => {
      const mockElement = document.createElement("div");
      mockElement.style.display = "none";
      mockElement.style.visibility = "hidden";
      document.body.appendChild(mockElement);

      Object.defineProperty(mockElement, "offsetWidth", {
        value: 150,
        configurable: true,
      });

      const width = DomHelpers.getHiddenElementOuterWidth(mockElement);

      expect(width).toBe(150);
      expect(mockElement.style.display).toBe("none");
      expect(mockElement.style.visibility).toBe("hidden");

      document.body.removeChild(mockElement);
    });

    it("restores original display and visibility", () => {
      const mockElement = document.createElement("div");
      mockElement.style.display = "flex";
      mockElement.style.visibility = "visible";
      document.body.appendChild(mockElement);

      DomHelpers.getHiddenElementOuterWidth(mockElement);

      expect(mockElement.style.display).toBe("flex");
      expect(mockElement.style.visibility).toBe("visible");

      document.body.removeChild(mockElement);
    });
  });

  describe("getHiddenElementOuterHeight", () => {
    it("returns 0 when element is null", () => {
      const height = DomHelpers.getHiddenElementOuterHeight(null);

      expect(height).toBe(0);
    });

    it("temporarily shows element to get height", () => {
      const mockElement = document.createElement("div");
      mockElement.style.display = "none";
      mockElement.style.visibility = "hidden";
      document.body.appendChild(mockElement);

      Object.defineProperty(mockElement, "offsetHeight", {
        value: 200,
        configurable: true,
      });

      const height = DomHelpers.getHiddenElementOuterHeight(mockElement);

      expect(height).toBe(200);
      expect(mockElement.style.display).toBe("none");
      expect(mockElement.style.visibility).toBe("hidden");

      document.body.removeChild(mockElement);
    });

    it("restores original display and visibility", () => {
      const mockElement = document.createElement("div");
      mockElement.style.display = "inline-block";
      mockElement.style.visibility = "visible";
      document.body.appendChild(mockElement);

      DomHelpers.getHiddenElementOuterHeight(mockElement);

      expect(mockElement.style.display).toBe("inline-block");
      expect(mockElement.style.visibility).toBe("visible");

      document.body.removeChild(mockElement);
    });
  });

  describe("calculateScrollbarWidth", () => {
    beforeEach(() => {
      DomHelpers.calculatedScrollbarWidth = null;
    });

    it("calculates scrollbar width for a specific element", () => {
      const mockElement = document.createElement("div");
      mockElement.style.overflow = "scroll";
      mockElement.style.width = "100px";
      document.body.appendChild(mockElement);

      Object.defineProperty(mockElement, "offsetWidth", {
        value: 100,
        configurable: true,
      });
      Object.defineProperty(mockElement, "clientWidth", {
        value: 83,
        configurable: true,
      });

      const width = DomHelpers.calculateScrollbarWidth(mockElement);

      expect(typeof width).toBe("number");

      document.body.removeChild(mockElement);
    });

    it("caches calculated scrollbar width when no element provided", () => {
      const width1 = DomHelpers.calculateScrollbarWidth();
      const width2 = DomHelpers.calculateScrollbarWidth();

      expect(width1).toBe(width2);
      expect(DomHelpers.calculatedScrollbarWidth).toBe(width1);
    });

    it("returns cached value on subsequent calls", () => {
      DomHelpers.calculatedScrollbarWidth = 17;

      const width = DomHelpers.calculateScrollbarWidth();

      expect(width).toBe(17);
    });
  });

  describe("z-index management", () => {
    beforeEach(() => {
      DomHelpers.zIndex = undefined as unknown as number;
    });

    describe("generateZIndex", () => {
      it("starts at 1001 on first call", () => {
        const zIndex = DomHelpers.generateZIndex();

        expect(zIndex).toBe(1001);
      });

      it("increments z-index on each call", () => {
        const first = DomHelpers.generateZIndex();
        const second = DomHelpers.generateZIndex();
        const third = DomHelpers.generateZIndex();

        expect(first).toBe(1001);
        expect(second).toBe(1002);
        expect(third).toBe(1003);
      });
    });

    describe("revertZIndex", () => {
      it("decrements z-index", () => {
        DomHelpers.generateZIndex();
        DomHelpers.generateZIndex();
        DomHelpers.revertZIndex();

        expect(DomHelpers.getCurrentZIndex()).toBe(1001);
      });

      it("does not go below 1000", () => {
        DomHelpers.zIndex = 1000;
        DomHelpers.revertZIndex();

        expect(DomHelpers.getCurrentZIndex()).toBe(1000);
      });

      it("stays at 1000 when already at minimum", () => {
        DomHelpers.zIndex = 999;
        DomHelpers.revertZIndex();

        expect(DomHelpers.getCurrentZIndex()).toBe(1000);
      });
    });

    describe("getCurrentZIndex", () => {
      it("returns current z-index value", () => {
        DomHelpers.zIndex = 1500;

        expect(DomHelpers.getCurrentZIndex()).toBe(1500);
      });

      it("returns undefined when not initialized", () => {
        expect(DomHelpers.getCurrentZIndex()).toBeUndefined();
      });
    });
  });
});
