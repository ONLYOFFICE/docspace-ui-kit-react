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
  let popupElement: HTMLDivElement;
  let rafSpy: ReturnType<typeof vi.spyOn>;
  let cancelRafSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    anchorElement = document.createElement("div");
    popupElement = document.createElement("div");
    document.body.appendChild(anchorElement);
    document.body.appendChild(popupElement);

    rafSpy = vi.spyOn(window, "requestAnimationFrame");
    cancelRafSpy = vi.spyOn(window, "cancelAnimationFrame");

    // Mock document.elementFromPoint if not available (jsdom)
    if (!document.elementFromPoint) {
      document.elementFromPoint = vi.fn(() => null);
    }
  });

  afterEach(() => {
    document.body.removeChild(anchorElement);
    document.body.removeChild(popupElement);
    rafSpy.mockRestore();
    cancelRafSpy.mockRestore();
    vi.clearAllMocks();
  });

  it("should not call onClose when wheel event happens inside popup", () => {
    const onClose = vi.fn();
    const isElementCovered = vi.fn(() => true);

    renderHook(() => {
      const anchorRef = useRef<HTMLDivElement>(anchorElement);
      const popupRef = useRef<HTMLDivElement>(popupElement);

      useCloseOnAnchorCovered({
        anchorRef,
        popupRef,
        onClose,
        isElementCovered,
      });
    });

    const wheelEvent = new WheelEvent("wheel", {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(wheelEvent, "target", {
      value: popupElement,
      writable: false,
    });

    window.dispatchEvent(wheelEvent);

    expect(rafSpy).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("should schedule check when wheel event happens outside popup", () => {
    const onClose = vi.fn();
    const isElementCovered = vi.fn(() => false);

    renderHook(() => {
      const anchorRef = useRef<HTMLDivElement>(anchorElement);
      const popupRef = useRef<HTMLDivElement>(popupElement);

      useCloseOnAnchorCovered({
        anchorRef,
        popupRef,
        onClose,
        isElementCovered,
      });
    });

    const wheelEvent = new WheelEvent("wheel", {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(wheelEvent, "target", {
      value: document.body,
      writable: false,
    });

    window.dispatchEvent(wheelEvent);

    expect(rafSpy).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when anchor is covered", () => {
    const onClose = vi.fn();
    const isElementCovered = vi.fn(() => true);

    rafSpy.mockImplementation((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });

    renderHook(() => {
      const anchorRef = useRef<HTMLDivElement>(anchorElement);
      const popupRef = useRef<HTMLDivElement>(popupElement);

      useCloseOnAnchorCovered({
        anchorRef,
        popupRef,
        onClose,
        isElementCovered,
      });
    });

    const wheelEvent = new WheelEvent("wheel", {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(wheelEvent, "target", {
      value: document.body,
      writable: false,
    });

    window.dispatchEvent(wheelEvent);

    expect(isElementCovered).toHaveBeenCalledWith(anchorElement);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should not call onClose when anchor is not covered", () => {
    const onClose = vi.fn();
    const isElementCovered = vi.fn(() => false);

    rafSpy.mockImplementation((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });

    renderHook(() => {
      const anchorRef = useRef<HTMLDivElement>(anchorElement);
      const popupRef = useRef<HTMLDivElement>(popupElement);

      useCloseOnAnchorCovered({
        anchorRef,
        popupRef,
        onClose,
        isElementCovered,
      });
    });

    const wheelEvent = new WheelEvent("wheel", {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(wheelEvent, "target", {
      value: document.body,
      writable: false,
    });

    window.dispatchEvent(wheelEvent);

    expect(isElementCovered).toHaveBeenCalledWith(anchorElement);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("should not schedule check when disabled", () => {
    const onClose = vi.fn();
    const isElementCovered = vi.fn(() => true);

    renderHook(() => {
      const anchorRef = useRef<HTMLDivElement>(anchorElement);
      const popupRef = useRef<HTMLDivElement>(popupElement);

      useCloseOnAnchorCovered({
        anchorRef,
        popupRef,
        onClose,
        isElementCovered,
        enabled: false,
      });
    });

    const wheelEvent = new WheelEvent("wheel", {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(wheelEvent, "target", {
      value: document.body,
      writable: false,
    });

    window.dispatchEvent(wheelEvent);

    expect(rafSpy).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("should not schedule multiple checks simultaneously", () => {
    const onClose = vi.fn();
    const isElementCovered = vi.fn(() => false);

    let rafCallback: FrameRequestCallback | undefined;
    rafSpy.mockImplementation((callback: FrameRequestCallback) => {
      rafCallback = callback;
      return 1;
    });

    renderHook(() => {
      const anchorRef = useRef<HTMLDivElement>(anchorElement);
      const popupRef = useRef<HTMLDivElement>(popupElement);

      useCloseOnAnchorCovered({
        anchorRef,
        popupRef,
        onClose,
        isElementCovered,
      });
    });

    const wheelEvent = new WheelEvent("wheel", {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(wheelEvent, "target", {
      value: document.body,
      writable: false,
    });

    window.dispatchEvent(wheelEvent);
    window.dispatchEvent(wheelEvent);
    window.dispatchEvent(wheelEvent);

    expect(rafSpy).toHaveBeenCalledTimes(1);

    if (rafCallback) {
      rafCallback(0);
    }

    window.dispatchEvent(wheelEvent);
    expect(rafSpy).toHaveBeenCalledTimes(2);
  });

  it("should cancel RAF on unmount", () => {
    const onClose = vi.fn();
    const isElementCovered = vi.fn(() => false);

    rafSpy.mockImplementation(() => 123);

    const { unmount } = renderHook(() => {
      const anchorRef = useRef<HTMLDivElement>(anchorElement);
      const popupRef = useRef<HTMLDivElement>(popupElement);

      useCloseOnAnchorCovered({
        anchorRef,
        popupRef,
        onClose,
        isElementCovered,
      });
    });

    const wheelEvent = new WheelEvent("wheel", {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(wheelEvent, "target", {
      value: document.body,
      writable: false,
    });

    window.dispatchEvent(wheelEvent);

    expect(rafSpy).toHaveBeenCalledTimes(1);

    unmount();

    expect(cancelRafSpy).toHaveBeenCalledWith(123);
  });

  it("should not call onClose when anchor element is null", () => {
    const onClose = vi.fn();
    const isElementCovered = vi.fn(() => true);

    rafSpy.mockImplementation((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });

    renderHook(() => {
      const anchorRef = useRef<HTMLDivElement>(null);
      const popupRef = useRef<HTMLDivElement>(popupElement);

      useCloseOnAnchorCovered({
        anchorRef,
        popupRef,
        onClose,
        isElementCovered,
      });
    });

    const wheelEvent = new WheelEvent("wheel", {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(wheelEvent, "target", {
      value: document.body,
      writable: false,
    });

    window.dispatchEvent(wheelEvent);

    expect(isElementCovered).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("should use default isElementCovered when not provided", () => {
    const onClose = vi.fn();

    rafSpy.mockImplementation((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });

    renderHook(() => {
      const anchorRef = useRef<HTMLDivElement>(anchorElement);
      const popupRef = useRef<HTMLDivElement>(popupElement);

      useCloseOnAnchorCovered({
        anchorRef,
        popupRef,
        onClose,
      });
    });

    const wheelEvent = new WheelEvent("wheel", {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(wheelEvent, "target", {
      value: document.body,
      writable: false,
    });

    window.dispatchEvent(wheelEvent);

    expect(rafSpy).toHaveBeenCalledTimes(1);
  });
});
