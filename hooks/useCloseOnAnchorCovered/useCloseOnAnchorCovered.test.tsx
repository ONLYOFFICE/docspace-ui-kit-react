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

import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useRef } from "react";

import { useCloseOnAnchorCovered } from "./index";

describe("useCloseOnAnchorCovered", () => {
  let anchorElement: HTMLDivElement;
  let rafSpy: ReturnType<typeof vi.spyOn>;
  let cancelRafSpy: ReturnType<typeof vi.spyOn>;
  let rafIdCounter: number;

  beforeEach(() => {
    anchorElement = document.createElement("div");
    document.body.appendChild(anchorElement);


    rafIdCounter = 0;
    rafSpy = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation(() => ++rafIdCounter);
    cancelRafSpy = vi.spyOn(window, "cancelAnimationFrame");

    if (!document.elementFromPoint) {
      document.elementFromPoint = vi.fn(() => null);
    }
  });

  afterEach(() => {
    document.body.removeChild(anchorElement);
    rafSpy.mockRestore();
    cancelRafSpy.mockRestore();
    vi.clearAllMocks();
  });

  it("should start rAF loop on mount when enabled", () => {
    const onClose = vi.fn();

    renderHook(() => {
      const anchorRef = useRef<HTMLDivElement>(anchorElement);
      useCloseOnAnchorCovered({ anchorRef, onClose });
    });

    expect(rafSpy).toHaveBeenCalledTimes(1);
  });

  it("should not start rAF loop when disabled", () => {
    const onClose = vi.fn();

    renderHook(() => {
      const anchorRef = useRef<HTMLDivElement>(anchorElement);
      useCloseOnAnchorCovered({ anchorRef, onClose, enabled: false });
    });

    expect(rafSpy).not.toHaveBeenCalled();
  });

  it("should call onClose and stop loop when anchor is covered", () => {
    const onClose = vi.fn();
    const isElementCovered = vi.fn(() => true);

    rafSpy.mockImplementationOnce((callback: FrameRequestCallback) => {
      callback(0);
      return ++rafIdCounter;
    });

    renderHook(() => {
      const anchorRef = useRef<HTMLDivElement>(anchorElement);
      useCloseOnAnchorCovered({ anchorRef, onClose, isElementCovered });
    });

    expect(isElementCovered).toHaveBeenCalledWith(anchorElement);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(rafSpy).toHaveBeenCalledTimes(1);
  });

  it("should not call onClose and reschedule when anchor is not covered", () => {
    const onClose = vi.fn();
    const isElementCovered = vi.fn(() => false);

    rafSpy.mockImplementationOnce((callback: FrameRequestCallback) => {
      callback(0);
      return ++rafIdCounter;
    });

    renderHook(() => {
      const anchorRef = useRef<HTMLDivElement>(anchorElement);
      useCloseOnAnchorCovered({ anchorRef, onClose, isElementCovered });
    });

    expect(isElementCovered).toHaveBeenCalledWith(anchorElement);
    expect(onClose).not.toHaveBeenCalled();
    expect(rafSpy).toHaveBeenCalledTimes(2);
  });

  it("should cancel rAF on unmount", () => {
    const onClose = vi.fn();
    const isElementCovered = vi.fn(() => false);

    const { unmount } = renderHook(() => {
      const anchorRef = useRef<HTMLDivElement>(anchorElement);
      useCloseOnAnchorCovered({ anchorRef, onClose, isElementCovered });
    });

    const scheduledId = rafIdCounter;
    unmount();

    expect(cancelRafSpy).toHaveBeenCalledWith(scheduledId);
  });

  it("should not call isElementCovered when anchor is null", () => {
    const onClose = vi.fn();
    const isElementCovered = vi.fn(() => true);

    rafSpy.mockImplementationOnce((callback: FrameRequestCallback) => {
      callback(0);
      return ++rafIdCounter;
    });

    renderHook(() => {
      const anchorRef = useRef<HTMLDivElement>(null);
      useCloseOnAnchorCovered({ anchorRef, onClose, isElementCovered });
    });

    expect(isElementCovered).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
    expect(rafSpy).toHaveBeenCalledTimes(2);
  });

  it("should restart loop when enabled changes from false to true", () => {
    const onClose = vi.fn();

    const { rerender } = renderHook(
      ({ enabled }: { enabled: boolean }) => {
        const anchorRef = useRef<HTMLDivElement>(anchorElement);
        useCloseOnAnchorCovered({ anchorRef, onClose, enabled });
      },
      { initialProps: { enabled: false } },
    );

    expect(rafSpy).not.toHaveBeenCalled();

    rerender({ enabled: true });

    expect(rafSpy).toHaveBeenCalledTimes(1);
  });

  it("should use default isElementCovered when not provided", () => {
    const onClose = vi.fn();

    // elementFromPoint returns body which contains anchorElement → not covered
    const elementFromPointSpy = vi
      .spyOn(document, "elementFromPoint")
      .mockReturnValue(document.body);

    rafSpy.mockImplementationOnce((callback: FrameRequestCallback) => {
      callback(0);
      return ++rafIdCounter;
    });

    renderHook(() => {
      const anchorRef = useRef<HTMLDivElement>(anchorElement);
      useCloseOnAnchorCovered({ anchorRef, onClose });
    });

    expect(onClose).not.toHaveBeenCalled();
    expect(rafSpy).toHaveBeenCalledTimes(2);

    elementFromPointSpy.mockRestore();
  });
});
