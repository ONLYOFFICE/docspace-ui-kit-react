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

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useViewTab } from "./useViewTab";
import { RefObject } from "react";
import { ScrollbarType } from "../../../scrollbar";

describe("useViewTab", () => {
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockUnobserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let intersectionObserverCallback: IntersectionObserverCallback;
  beforeEach(() => {
    mockObserve = vi.fn();
    mockUnobserve = vi.fn();
    mockDisconnect = vi.fn();

    // Mock IntersectionObserver
    vi.stubGlobal(
      "IntersectionObserver",
      vi.fn(function (
        this: IntersectionObserver,
        callback: IntersectionObserverCallback,
      ) {
        intersectionObserverCallback = callback;
        return {
          observe: mockObserve,
          unobserve: mockUnobserve,
          disconnect: mockDisconnect,
          root: null,
          rootMargin: "",
          thresholds: [],
          takeRecords: () => [],
        };
      }),
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const createMockContainerRef = () =>
    ({
      current: {
        scrollerElement: document.createElement("div"),
      },
    }) as unknown as RefObject<ScrollbarType>;

  const createMockTabRef = () => {
    const el = document.createElement("div");
    const child = document.createElement("div");
    el.appendChild(child);
    return { current: el } as RefObject<HTMLDivElement>;
  };

  it("should return true by default", () => {
    const mockContainerRef = createMockContainerRef();
    const mockTabRef = createMockTabRef();

    const { result } = renderHook(() =>
      useViewTab(mockContainerRef, mockTabRef, 0),
    );

    expect(result.current).toBe(true);
  });

  it("should create IntersectionObserver with correct options", () => {
    const mockContainerRef = createMockContainerRef();
    const mockTabRef = createMockTabRef();

    renderHook(() => useViewTab(mockContainerRef, mockTabRef, 0));

    expect(global.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        root: mockContainerRef.current.scrollerElement,
        rootMargin: "4px",
        threshold: 1,
      },
    );
  });

  it("should observe the correct child element", () => {
    const mockContainerRef = createMockContainerRef();
    const el = document.createElement("div");
    const child0 = document.createElement("div");
    const child1 = document.createElement("div");
    el.appendChild(child0);
    el.appendChild(child1);
    const mockTabRef = { current: el } as RefObject<HTMLDivElement>;

    renderHook(() => useViewTab(mockContainerRef, mockTabRef, 1));

    expect(mockObserve).toHaveBeenCalledWith(child1);
  });

  it("should update isViewTab when intersection changes", () => {
    const mockContainerRef = createMockContainerRef();
    const mockTabRef = createMockTabRef();
    const childElement = mockTabRef.current!.children[0];

    const { result } = renderHook(() =>
      useViewTab(mockContainerRef, mockTabRef, 0),
    );

    // Initially true
    expect(result.current).toBe(true);

    // Simulate not intersecting
    act(() => {
      intersectionObserverCallback(
        [
          {
            isIntersecting: false,
            target: childElement,
          } as Partial<IntersectionObserverEntry> as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    });

    expect(result.current).toBe(false);

    // Simulate intersecting
    act(() => {
      intersectionObserverCallback(
        [
          {
            isIntersecting: true,
            target: childElement,
          } as Partial<IntersectionObserverEntry> as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    });

    expect(result.current).toBe(true);
  });

  it("should not create observer if container is null", () => {
    const mockContainerRef = {
      current: null,
    } as unknown as RefObject<ScrollbarType>;
    const mockTabRef = createMockTabRef();

    renderHook(() => useViewTab(mockContainerRef, mockTabRef, 0));

    expect(global.IntersectionObserver).not.toHaveBeenCalled();
  });

  it("should not create observer if tabRef is null", () => {
    const mockContainerRef = createMockContainerRef();
    const mockTabRef = {
      current: null,
    } as unknown as RefObject<HTMLDivElement>;

    renderHook(() => useViewTab(mockContainerRef, mockTabRef, 0));

    expect(global.IntersectionObserver).not.toHaveBeenCalled();
  });

  it("should not create observer if child element does not exist", () => {
    const mockContainerRef = createMockContainerRef();
    const mockTabRef = {
      current: document.createElement("div"),
    } as unknown as RefObject<HTMLDivElement>;

    renderHook(() => useViewTab(mockContainerRef, mockTabRef, 0));

    expect(global.IntersectionObserver).not.toHaveBeenCalled();
  });

  it("should unobserve element on unmount", () => {
    const mockContainerRef = createMockContainerRef();
    const mockTabRef = createMockTabRef();
    const childElement = mockTabRef.current!.children[0];

    const { unmount } = renderHook(() =>
      useViewTab(mockContainerRef, mockTabRef, 0),
    );

    unmount();

    expect(mockUnobserve).toHaveBeenCalledWith(childElement);
  });

  it("should recreate observer when index changes", () => {
    const mockContainerRef = createMockContainerRef();
    const el = document.createElement("div");
    const child0 = document.createElement("div");
    const child1 = document.createElement("div");
    el.appendChild(child0);
    el.appendChild(child1);
    const mockTabRef = { current: el } as RefObject<HTMLDivElement>;

    const { rerender } = renderHook(
      ({ index }) => useViewTab(mockContainerRef, mockTabRef, index),
      { initialProps: { index: 0 } },
    );

    expect(mockObserve).toHaveBeenCalledWith(child0);

    // Change index
    rerender({ index: 1 });

    expect(mockUnobserve).toHaveBeenCalledWith(child0);
    expect(mockObserve).toHaveBeenCalledWith(child1);
  });
});
