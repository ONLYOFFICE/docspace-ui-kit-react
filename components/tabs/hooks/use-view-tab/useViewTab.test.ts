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
