/*
 * (c) Copyright Ascensio System SIA 2009-2026
 *
 * This program is a free software product.
 * You can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
 * Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
 * to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
 * any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
 * the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions of the Program must
 * display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product logo when
 * distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
 * trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
 * content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
 * International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 */

import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as deviceDetect from "react-device-detect";
import { useTableHeaderPosition } from "./index";

vi.mock("react-device-detect", () => ({
  isSafari: false,
}));

describe("useTableHeaderPosition", () => {
  let headerRef: { current: HTMLDivElement | null };
  let mutationCallback: MutationCallback | undefined;
  const observeMock = vi.fn();
  const disconnectMock = vi.fn();

  class MockMutationObserver {
    constructor(callback: MutationCallback) {
      mutationCallback = callback;
    }
    observe = observeMock;
    disconnect = disconnectMock;
    takeRecords = vi.fn();
  }

  beforeEach(() => {
    headerRef = {
      current: document.createElement("div"),
    };
    
    global.MutationObserver = MockMutationObserver as unknown as typeof MutationObserver;

    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  const setIsSafari = (value: boolean) => {
    Object.defineProperty(deviceDetect, "isSafari", {
      value,
      configurable: true,
    });
  };

  it("should do nothing if not Safari", () => {
    setIsSafari(false);
    renderHook(() => useTableHeaderPosition(headerRef));
    expect(observeMock).not.toHaveBeenCalled();
  });

  it("should observe body if Safari", () => {
    setIsSafari(true);
    renderHook(() => useTableHeaderPosition(headerRef));
    expect(observeMock).toHaveBeenCalledWith(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });
  });

  it("should set top to unset if .filter-input_selected-row is not present", () => {
    setIsSafari(true);
    renderHook(() => useTableHeaderPosition(headerRef));
    expect(headerRef.current?.style.top).toBe("unset");
  });

  it("should set top based on .filter-input_selected-row bottom if present", () => {
    setIsSafari(true);
    const filterRow = document.createElement("div");
    filterRow.className = "filter-input_selected-row";
    filterRow.getBoundingClientRect = vi.fn(() => ({
      bottom: 50,
      top: 0,
      left: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
    document.body.appendChild(filterRow);

    renderHook(() => useTableHeaderPosition(headerRef));
    expect(headerRef.current?.style.top).toBe("52px");
  });

  it("should set top with rounded value", () => {
    setIsSafari(true);
    const filterRow = document.createElement("div");
    filterRow.className = "filter-input_selected-row";
    filterRow.getBoundingClientRect = vi.fn(() => ({
      bottom: 50.6,
      top: 0,
      left: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
    document.body.appendChild(filterRow);

    renderHook(() => useTableHeaderPosition(headerRef));
    expect(headerRef.current?.style.top).toBe("53px"); // round(50.6) = 51, 51+2=53
  });

  it("should update top on window resize", () => {
    setIsSafari(true);
    renderHook(() => useTableHeaderPosition(headerRef));
    expect(headerRef.current?.style.top).toBe("unset");

    const filterRow = document.createElement("div");
    filterRow.className = "filter-input_selected-row";
    filterRow.getBoundingClientRect = vi.fn(() => ({
      bottom: 60,
      top: 0,
      left: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
    document.body.appendChild(filterRow);

    window.dispatchEvent(new Event("resize"));
    expect(headerRef.current?.style.top).toBe("62px");
  });

  it("should update top on mutation", () => {
    setIsSafari(true);
    renderHook(() => useTableHeaderPosition(headerRef));
    
    const filterRow = document.createElement("div");
    filterRow.className = "filter-input_selected-row";
    filterRow.getBoundingClientRect = vi.fn(() => ({
      bottom: 70,
      top: 0,
      left: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
    document.body.appendChild(filterRow);

    if (mutationCallback) {
      mutationCallback([], {} as MutationObserver);
    }
    expect(headerRef.current?.style.top).toBe("72px");
  });

  it("should disconnect and remove listener on unmount", () => {
    setIsSafari(true);
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useTableHeaderPosition(headerRef));
    
    unmount();
    
    expect(disconnectMock).toHaveBeenCalled();
    expect(removeEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));
  });

  it("should not crash if headerRef.current is null during update", () => {
    setIsSafari(true);
    const nullRef = { current: null };
    renderHook(() => useTableHeaderPosition(nullRef));
    
    expect(() => {
      window.dispatchEvent(new Event("resize"));
      if (mutationCallback) {
        mutationCallback([], {} as MutationObserver);
      }
    }).not.toThrow();
  });
});
