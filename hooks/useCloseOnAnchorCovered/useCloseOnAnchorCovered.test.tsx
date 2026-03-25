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
