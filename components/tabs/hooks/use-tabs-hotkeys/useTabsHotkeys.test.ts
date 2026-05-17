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
import useTabsHotkeys from "./useTabsHotkeys";

// Mock react-hotkeys-hook
const mockUseHotkeys = vi.hoisted(() => vi.fn());
vi.mock("react-hotkeys-hook", () => ({
  useHotkeys: mockUseHotkeys,
}));

// Mock react-device-detect
vi.mock("react-device-detect", () => ({
  isMobile: false,
}));

describe("useTabsHotkeys", () => {
  const mockSetHotkeysIsActive = vi.fn();
  const mockSetFocusedTabIndex = vi.fn();
  const mockScrollToTab = vi.fn();
  const mockOnSelect = vi.fn();

  const mockItems = [
    { id: "tab1", name: "Tab 1", content: "Content 1" },
    { id: "tab2", name: "Tab 2", content: "Content 2" },
    { id: "tab3", name: "Tab 3", content: "Content 3" },
  ];

  const defaultProps = {
    enabledHotkeys: true,
    setHotkeysIsActive: mockSetHotkeysIsActive,
    items: mockItems,
    focusedTabIndex: 0,
    setFocusedTabIndex: mockSetFocusedTabIndex,
    scrollToTab: mockScrollToTab,
    onSelect: mockOnSelect,
    hotkeysId: "test-tabs",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseHotkeys.mockClear();
    // Mock DOM element
    document.body.innerHTML =
      '<div class="secondary-tabs-scroll-test-tabs" tabindex="0"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should register keydown event listener on mount", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");

    renderHook(() => useTabsHotkeys(defaultProps));

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function),
    );

    addEventListenerSpy.mockRestore();
  });

  it("should remove keydown event listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useTabsHotkeys(defaultProps));
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function),
    );

    removeEventListenerSpy.mockRestore();
  });

  it("should activate hotkeys on Tab key press", () => {
    renderHook(() => useTabsHotkeys(defaultProps));

    const tabEvent = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
    });

    const focusSpy = vi.spyOn(HTMLElement.prototype, "focus");

    act(() => {
      window.dispatchEvent(tabEvent);
    });

    expect(mockSetHotkeysIsActive).toHaveBeenCalledWith(false);
    expect(focusSpy).toHaveBeenCalled();

    focusSpy.mockRestore();
  });

  it("should prevent default on navigation keys when hotkeys are enabled", () => {
    renderHook(() => useTabsHotkeys(defaultProps));

    const arrowEvent = new KeyboardEvent("keydown", {
      code: "ArrowRight",
      bubbles: true,
    });

    const preventDefaultSpy = vi.spyOn(arrowEvent, "preventDefault");

    act(() => {
      window.dispatchEvent(arrowEvent);
    });

    expect(preventDefaultSpy).toHaveBeenCalled();

    preventDefaultSpy.mockRestore();
  });

  it("should not prevent default on navigation keys when hotkeys are disabled", () => {
    const propsWithDisabledHotkeys = {
      ...defaultProps,
      enabledHotkeys: false,
    };

    renderHook(() => useTabsHotkeys(propsWithDisabledHotkeys));

    const arrowEvent = new KeyboardEvent("keydown", {
      code: "ArrowRight",
      bubbles: true,
    });

    const preventDefaultSpy = vi.spyOn(arrowEvent, "preventDefault");

    act(() => {
      window.dispatchEvent(arrowEvent);
    });

    // preventDefault should only be called by activateHotkeys for Tab key, not for navigation keys
    expect(preventDefaultSpy).not.toHaveBeenCalled();

    preventDefaultSpy.mockRestore();
  });

  it("should call setFocusedTabIndex and scrollToTab when focusing next tab", () => {
    renderHook(() => useTabsHotkeys(defaultProps));

    // Get the callback registered for "*" hotkey
    const arrowCallback = mockUseHotkeys.mock.calls.find(
      (call) => call[0] === "*",
    )?.[1];

    expect(arrowCallback).toBeDefined();

    // Simulate ArrowRight key press
    const arrowRightEvent = new KeyboardEvent("keydown", {
      key: "ArrowRight",
    });

    act(() => {
      arrowCallback?.(arrowRightEvent);
    });

    expect(mockSetFocusedTabIndex).toHaveBeenCalledWith(1);
    expect(mockScrollToTab).toHaveBeenCalledWith(1);
  });

  it("should wrap to first tab when pressing ArrowRight on last tab", () => {
    const propsWithLastTab = {
      ...defaultProps,
      focusedTabIndex: 2, // last tab
    };

    renderHook(() => useTabsHotkeys(propsWithLastTab));

    const arrowCallback = mockUseHotkeys.mock.calls.find(
      (call) => call[0] === "*",
    )?.[1];

    const arrowRightEvent = new KeyboardEvent("keydown", {
      key: "ArrowRight",
    });

    act(() => {
      arrowCallback?.(arrowRightEvent);
    });

    expect(mockSetFocusedTabIndex).toHaveBeenCalledWith(0);
    expect(mockScrollToTab).toHaveBeenCalledWith(0);
  });

  it("should wrap to last tab when pressing ArrowLeft on first tab", () => {
    renderHook(() => useTabsHotkeys(defaultProps));

    const arrowCallback = mockUseHotkeys.mock.calls.find(
      (call) => call[0] === "*",
    )?.[1];

    const arrowLeftEvent = new KeyboardEvent("keydown", {
      key: "ArrowLeft",
    });

    act(() => {
      arrowCallback?.(arrowLeftEvent);
    });

    expect(mockSetFocusedTabIndex).toHaveBeenCalledWith(2);
    expect(mockScrollToTab).toHaveBeenCalledWith(2);
  });

  it("should call onSelect when Enter or Space is pressed", () => {
    renderHook(() => useTabsHotkeys(defaultProps));

    // Get the callback registered for "Enter, Space" hotkey
    const enterCallback = mockUseHotkeys.mock.calls.find(
      (call) => call[0] === "Enter, Space",
    )?.[1];

    expect(enterCallback).toBeDefined();

    const enterEvent = new KeyboardEvent("keydown", {
      key: "Enter",
    });

    const stopPropagationSpy = vi.spyOn(enterEvent, "stopPropagation");
    const preventDefaultSpy = vi.spyOn(enterEvent, "preventDefault");

    act(() => {
      enterCallback?.(enterEvent);
    });

    expect(stopPropagationSpy).toHaveBeenCalled();
    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(mockOnSelect).toHaveBeenCalledWith(mockItems[0]);

    stopPropagationSpy.mockRestore();
    preventDefaultSpy.mockRestore();
  });

  it("should focus first tab on Home key", () => {
    const propsWithMiddleTab = {
      ...defaultProps,
      focusedTabIndex: 1,
    };

    renderHook(() => useTabsHotkeys(propsWithMiddleTab));

    const homeCallback = mockUseHotkeys.mock.calls.find(
      (call) => call[0] === "Home",
    )?.[1];

    expect(homeCallback).toBeDefined();

    act(() => {
      homeCallback?.();
    });

    expect(mockSetFocusedTabIndex).toHaveBeenCalledWith(0);
    expect(mockScrollToTab).toHaveBeenCalledWith(0);
  });

  it("should focus last tab on End key", () => {
    renderHook(() => useTabsHotkeys(defaultProps));

    const endCallback = mockUseHotkeys.mock.calls.find(
      (call) => call[0] === "End",
    )?.[1];

    expect(endCallback).toBeDefined();

    act(() => {
      endCallback?.();
    });

    expect(mockSetFocusedTabIndex).toHaveBeenCalledWith(2);
    expect(mockScrollToTab).toHaveBeenCalledWith(2);
  });

  it("should not trigger navigation when shift or ctrl is pressed", () => {
    renderHook(() => useTabsHotkeys(defaultProps));

    const arrowCallback = mockUseHotkeys.mock.calls.find(
      (call) => call[0] === "*",
    )?.[1];

    const shiftArrowEvent = new KeyboardEvent("keydown", {
      key: "ArrowRight",
      shiftKey: true,
    });

    act(() => {
      arrowCallback?.(shiftArrowEvent);
    });

    // Should not call setFocusedTabIndex when shift is pressed
    expect(mockSetFocusedTabIndex).not.toHaveBeenCalled();
  });

  it("should filter events from input elements except checkboxes", () => {
    renderHook(() => useTabsHotkeys(defaultProps));

    // Get the options object from any useHotkeys call
    const hotkeysOptions = mockUseHotkeys.mock.calls[0]?.[2];
    const filterFunction = hotkeysOptions?.filter;

    expect(filterFunction).toBeDefined();

    // Test checkbox input (should pass filter)
    const checkboxEvent = {
      target: { type: "checkbox", tagName: "INPUT" },
    } as unknown as KeyboardEvent;
    expect(filterFunction(checkboxEvent)).toBe(true);

    // Test text input (should not pass filter)
    const textInputEvent = {
      target: { type: "text", tagName: "INPUT" },
    } as unknown as KeyboardEvent;
    expect(filterFunction(textInputEvent)).toBe(false);

    // Test non-input element (should pass filter)
    const divEvent = {
      target: { tagName: "DIV" },
    } as unknown as KeyboardEvent;
    expect(filterFunction(divEvent)).toBe(true);
  });
});
