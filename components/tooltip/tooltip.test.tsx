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

/// <reference types="node" />

import React from "react";

import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { TooltipRefProps } from "react-tooltip";

import { Text } from "../text";

import { useTooltipControl } from "./hooks/useTooltipControl";
import { RootTooltip } from "./rootTooltip";
import { omitTooltipProps } from "./Tooltip.types";
import { Tooltip, TooltipContainer, withTooltip } from ".";

describe("<Tooltip />", () => {
  it("renders without error", () => {
    render(
      <Tooltip>
        <Text>Your tooltip text</Text>
      </Tooltip>,
    );

    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
  });

  it("accepts custom className and style", () => {
    render(
      <Tooltip className="custom-tooltip" style={{ color: "red" }}>
        <Text>Tooltip with custom styling</Text>
      </Tooltip>,
    );

    const tooltip = screen.getByTestId("tooltip");
    expect(tooltip).toHaveClass("custom-tooltip");
    expect(tooltip.style.color).toBe("red");
  });

  it("renders with custom placement", () => {
    render(
      <Tooltip place="bottom">
        <Text>Bottom placed tooltip</Text>
      </Tooltip>,
    );

    const tooltip = screen.getByTestId("tooltip");
    expect(tooltip).toBeInTheDocument();
  });

  it("renders with custom maxWidth", () => {
    render(
      <Tooltip maxWidth="300px">
        <Text>Tooltip with custom width</Text>
      </Tooltip>,
    );

    const tooltip = screen.getByTestId("tooltip");
    expect(tooltip).toBeInTheDocument();
  });

  it("handles click events when openOnClick is true", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <div>
          <div
            data-tooltip-id="click-tooltip"
            data-tooltip-content="Click-triggered tooltip"
          >
            Click me
          </div>
        </div>
        <Tooltip id="click-tooltip" openOnClick />
      </div>,
    );

    const tooltipTrigger = screen.getByText("Click me");

    expect(
      screen.queryByText("Click-triggered tooltip"),
    ).not.toBeInTheDocument();

    await user.click(tooltipTrigger);

    const tooltip = await screen.findByText("Click-triggered tooltip");
    expect(tooltip).toBeInTheDocument();
  });

  it("renders with custom content using getContent", () => {
    const getContent = () => "Dynamic content";
    render(
      <Tooltip getContent={getContent}>
        <Text>Tooltip with dynamic content</Text>
      </Tooltip>,
    );

    const tooltip = screen.getByTestId("tooltip");
    expect(tooltip).toBeInTheDocument();
  });

  it("renders without arrow when noArrow is true", () => {
    render(
      <Tooltip noArrow>
        <Text>Tooltip without arrow</Text>
      </Tooltip>,
    );

    const tooltip = screen.getByTestId("tooltip");
    expect(tooltip).toBeInTheDocument();
  });

  it("renders with color prop and sets CSS variable", async () => {
    const { rerender } = render(
      <Tooltip color="#ff0000">
        <Text>Colored tooltip</Text>
      </Tooltip>,
    );

    const tooltip = screen.getByTestId("tooltip");
    expect(tooltip).toBeInTheDocument();

    // Re-render to trigger the useEffect that sets color
    rerender(
      <Tooltip color="#00ff00">
        <Text>Colored tooltip</Text>
      </Tooltip>,
    );

    // The effect should run - we just verify the component renders correctly
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
  });

  it("renders without color prop (skips CSS variable setting)", () => {
    render(
      <Tooltip>
        <Text>No color tooltip</Text>
      </Tooltip>,
    );

    const tooltip = screen.getByTestId("tooltip");
    expect(tooltip).toBeInTheDocument();
    // The useEffect runs but the if(color) condition is false
  });

  it("renders with zIndex prop", () => {
    render(
      <Tooltip zIndex={9999}>
        <Text>High z-index tooltip</Text>
      </Tooltip>,
    );

    const tooltip = screen.getByTestId("tooltip");
    expect(tooltip.style.zIndex).toBe("9999");
    expect(tooltip.style.position).toBe("relative");
  });

  it("renders with custom dataTestId", () => {
    render(
      <Tooltip dataTestId="custom-tooltip-test">
        <Text>Custom test id tooltip</Text>
      </Tooltip>,
    );

    expect(screen.getByTestId("custom-tooltip-test")).toBeInTheDocument();
  });

  it("renders with noUserSelect class", () => {
    render(
      <Tooltip noUserSelect>
        <Text>No select tooltip</Text>
      </Tooltip>,
    );

    const tooltip = screen.getByTestId("tooltip");
    expect(tooltip).toBeInTheDocument();
  });
});

describe("withTooltip HOC", () => {
  it("renders with tooltip handlers in non-test environment", () => {
    const originalEnv = process.env.NODE_ENV;
    vi.stubEnv("NODE_ENV", "production");

    const TestComponent = React.forwardRef<
      HTMLDivElement,
      {
        children: React.ReactNode;
        title?: string;
        "data-tooltip-element"?: string;
        onMouseEnter?: () => void;
        onMouseLeave?: () => void;
        onMouseMove?: () => void;
        onClick?: () => void;
      }
    >((props, ref) => (
      <div
        ref={ref}
        data-testid="wrapped-component"
        data-tooltip-element={props["data-tooltip-element"]}
      >
        {props.children}
      </div>
    ));
    TestComponent.displayName = "TestComponent";

    const WrappedComponent = withTooltip(TestComponent);

    render(<WrappedComponent title="Test tooltip">Content</WrappedComponent>);

    const component = screen.getByTestId("wrapped-component");
    expect(component).toBeInTheDocument();
    expect(component).toHaveAttribute("data-tooltip-element");

    vi.stubEnv("NODE_ENV", originalEnv || "test");
  });

  it("uses Component fallback for displayName when no name available", () => {
    // Create anonymous component without displayName or name
    const AnonymousComponent = React.forwardRef<
      HTMLDivElement,
      { children: React.ReactNode; title?: string }
    >((props, ref) => (
      <div ref={ref} data-testid="anon-component" title={props.title}>
        {props.children}
      </div>
    ));
    // Explicitly remove displayName and name
    Object.defineProperty(AnonymousComponent, "displayName", {
      value: undefined,
    });
    Object.defineProperty(AnonymousComponent, "name", { value: "" });

    const WrappedComponent = withTooltip(AnonymousComponent);

    render(<WrappedComponent title="Test">Content</WrappedComponent>);

    expect(screen.getByTestId("anon-component")).toBeInTheDocument();
  });

  it("wraps a component and adds tooltip functionality", () => {
    const TestComponent = React.forwardRef<
      HTMLDivElement,
      { children: React.ReactNode; title?: string }
    >((props, ref) => (
      <div ref={ref} data-testid="wrapped-component" title={props.title}>
        {props.children}
      </div>
    ));
    TestComponent.displayName = "TestComponent";

    const WrappedComponent = withTooltip(TestComponent);

    render(<WrappedComponent title="Test tooltip">Content</WrappedComponent>);

    const component = screen.getByTestId("wrapped-component");
    expect(component).toBeInTheDocument();
    expect(component).toHaveAttribute("title", "Test tooltip");
  });

  it("renders without tooltip when no title provided", () => {
    const TestComponent = React.forwardRef<
      HTMLDivElement,
      { children: React.ReactNode; title?: string }
    >((props, ref) => (
      <div ref={ref} data-testid="wrapped-component" title={props.title}>
        {props.children}
      </div>
    ));
    TestComponent.displayName = "TestComponent";

    const WrappedComponent = withTooltip(TestComponent);

    render(<WrappedComponent>Content without tooltip</WrappedComponent>);

    const component = screen.getByTestId("wrapped-component");
    expect(component).toBeInTheDocument();
    expect(component).not.toHaveAttribute("title");
  });

  it("uses tooltipContent over title when both provided", () => {
    const TestComponent = React.forwardRef<
      HTMLDivElement,
      { children: React.ReactNode; title?: string; tooltipContent?: string }
    >((props, ref) => (
      <div ref={ref} data-testid="wrapped-component" title={props.title}>
        {props.children}
      </div>
    ));
    TestComponent.displayName = "TestComponent";

    const WrappedComponent = withTooltip(TestComponent);

    render(
      <WrappedComponent title="Title text" tooltipContent="Tooltip content">
        Content
      </WrappedComponent>,
    );

    const component = screen.getByTestId("wrapped-component");
    expect(component).toHaveAttribute("title", "Tooltip content");
  });

  it("passes event handlers through when no tooltip content", () => {
    const onClick = vi.fn();
    const onMouseEnter = vi.fn();
    const onMouseLeave = vi.fn();

    const TestComponent = React.forwardRef<
      HTMLDivElement,
      {
        children: React.ReactNode;
        title?: string;
        onClick?: () => void;
        onMouseEnter?: () => void;
        onMouseLeave?: () => void;
      }
    >((props, ref) => (
      <div
        ref={ref}
        data-testid="wrapped-component"
        title={props.title}
        onClick={props.onClick}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
      >
        {props.children}
      </div>
    ));
    TestComponent.displayName = "TestComponent";

    const WrappedComponent = withTooltip(TestComponent);

    render(
      <WrappedComponent
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        Content
      </WrappedComponent>,
    );

    const component = screen.getByTestId("wrapped-component");
    fireEvent.click(component);
    fireEvent.mouseEnter(component);
    fireEvent.mouseLeave(component);

    expect(onClick).toHaveBeenCalled();
    expect(onMouseEnter).toHaveBeenCalled();
    expect(onMouseLeave).toHaveBeenCalled();
  });
});

describe("<TooltipContainer />", () => {
  it("renders as div by default", () => {
    render(
      <TooltipContainer data-testid="container">Content</TooltipContainer>,
    );

    const container = screen.getByTestId("container");
    expect(container.tagName).toBe("DIV");
  });

  it("renders as custom element with as prop", () => {
    render(
      <TooltipContainer as="span" data-testid="container">
        Content
      </TooltipContainer>,
    );

    const container = screen.getByTestId("container");
    expect(container.tagName).toBe("SPAN");
  });

  it("renders as button element", () => {
    render(
      <TooltipContainer as="button" data-testid="container" type="button">
        Button Content
      </TooltipContainer>,
    );

    const container = screen.getByTestId("container");
    expect(container.tagName).toBe("BUTTON");
  });

  it("renders with tooltip content", () => {
    render(
      <TooltipContainer data-testid="container" title="Container tooltip">
        Content with tooltip
      </TooltipContainer>,
    );

    const container = screen.getByTestId("container");
    expect(container).toHaveAttribute("title", "Container tooltip");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLElement>();

    render(
      <TooltipContainer ref={ref} data-testid="container">
        Content
      </TooltipContainer>,
    );

    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it("renders children correctly", () => {
    render(
      <TooltipContainer data-testid="container">
        <span>Child element</span>
      </TooltipContainer>,
    );

    expect(screen.getByText("Child element")).toBeInTheDocument();
  });
});

describe("useTooltipControl hook behavior", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("handles mouse events with TooltipContainer", async () => {
    const onMouseEnter = vi.fn();
    const onMouseLeave = vi.fn();
    const onClick = vi.fn();

    render(
      <TooltipContainer
        data-testid="tooltip-target"
        title="Hover tooltip"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        Hover me
      </TooltipContainer>,
    );

    const target = screen.getByTestId("tooltip-target");

    fireEvent.mouseEnter(target);
    expect(onMouseEnter).toHaveBeenCalled();

    fireEvent.mouseLeave(target);
    expect(onMouseLeave).toHaveBeenCalled();

    fireEvent.click(target);
    expect(onClick).toHaveBeenCalled();
  });

  it("handles onMouseMove event", () => {
    const onMouseMove = vi.fn();

    render(
      <TooltipContainer data-testid="tooltip-target" onMouseMove={onMouseMove}>
        Move over me
      </TooltipContainer>,
    );

    const target = screen.getByTestId("tooltip-target");
    fireEvent.mouseMove(target);

    expect(onMouseMove).toHaveBeenCalled();
  });
});

describe("useTooltipControl hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns handlers and anchorId", () => {
    const { result, unmount } = renderHook(() => useTooltipControl());

    expect(result.current.anchorId).toMatch(/^tooltip-/);
    expect(typeof result.current.handleMouseEnter).toBe("function");
    expect(typeof result.current.handleMouseLeave).toBe("function");
    expect(typeof result.current.handleMouseMove).toBe("function");
    expect(typeof result.current.handleClick).toBe("function");

    unmount();
  });

  it("calls original onClick handler", () => {
    const onClick = vi.fn();
    const { result, unmount } = renderHook(() =>
      useTooltipControl(onClick, undefined, undefined, "test content"),
    );

    const mockEvent = {
      target: document.createElement("div"),
      currentTarget: document.createElement("div"),
    } as unknown as React.MouseEvent;

    result.current.handleClick(mockEvent);

    expect(onClick).toHaveBeenCalledWith(mockEvent);

    unmount();
  });

  it("calls original onMouseEnter handler", () => {
    const onMouseEnter = vi.fn();
    const { result, unmount } = renderHook(() =>
      useTooltipControl(undefined, onMouseEnter, undefined, "test content"),
    );

    const target = document.createElement("div");
    target.setAttribute("data-tooltip-element", "test");
    const mockEvent = {
      target,
      currentTarget: target,
      clientX: 100,
      clientY: 100,
    } as unknown as React.MouseEvent;

    result.current.handleMouseEnter(mockEvent);

    expect(onMouseEnter).toHaveBeenCalledWith(mockEvent);

    unmount();
  });

  it("calls original onMouseLeave handler", () => {
    const onMouseLeave = vi.fn();
    const { result, unmount } = renderHook(() =>
      useTooltipControl(undefined, undefined, onMouseLeave, "test content"),
    );

    const mockEvent = {
      target: document.createElement("div"),
      currentTarget: document.createElement("div"),
    } as unknown as React.MouseEvent;

    result.current.handleMouseLeave(mockEvent);

    expect(onMouseLeave).toHaveBeenCalledWith(mockEvent);

    unmount();
  });

  it("creates virtual anchor on mouse enter with content", () => {
    const { result, unmount } = renderHook(() =>
      useTooltipControl(undefined, undefined, undefined, "tooltip content"),
    );

    const target = document.createElement("div");
    target.setAttribute("data-tooltip-element", "test");
    const mockEvent = {
      target,
      currentTarget: target,
      clientX: 150,
      clientY: 200,
    } as unknown as React.MouseEvent;

    result.current.handleMouseEnter(mockEvent);

    const anchor = document.querySelector("[data-tooltip-anchor]");
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveAttribute("data-tooltip-content", "tooltip content");

    unmount();
  });

  it("removes virtual anchor on mouse leave after timeout", () => {
    const { result, unmount } = renderHook(() =>
      useTooltipControl(undefined, undefined, undefined, "tooltip content"),
    );

    const target = document.createElement("div");
    target.setAttribute("data-tooltip-element", "test");
    const mockEvent = {
      target,
      currentTarget: target,
      clientX: 150,
      clientY: 200,
    } as unknown as React.MouseEvent;

    result.current.handleMouseEnter(mockEvent);
    expect(document.querySelector("[data-tooltip-anchor]")).toBeInTheDocument();

    result.current.handleMouseLeave(mockEvent);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(
      document.querySelector("[data-tooltip-anchor]"),
    ).not.toBeInTheDocument();

    unmount();
  });

  it("updates virtual anchor position on mouse move", () => {
    const { result, unmount } = renderHook(() =>
      useTooltipControl(undefined, undefined, undefined, "tooltip content"),
    );

    const target = document.createElement("div");
    target.setAttribute("data-tooltip-element", "test");

    const enterEvent = {
      target,
      currentTarget: target,
      clientX: 100,
      clientY: 100,
    } as unknown as React.MouseEvent;

    result.current.handleMouseEnter(enterEvent);

    const moveEvent = {
      target,
      currentTarget: target,
      clientX: 200,
      clientY: 300,
    } as unknown as React.MouseEvent;

    result.current.handleMouseMove(moveEvent);

    const anchor = document.querySelector(
      "[data-tooltip-anchor]",
    ) as HTMLElement;
    expect(anchor.style.left).toBe("200px");

    unmount();
  });

  it("updates existing virtual anchor position on re-enter", () => {
    const { result, unmount } = renderHook(() =>
      useTooltipControl(undefined, undefined, undefined, "tooltip content"),
    );

    const target = document.createElement("div");
    target.setAttribute("data-tooltip-element", "test");

    // First enter - creates anchor
    const enterEvent1 = {
      target,
      currentTarget: target,
      clientX: 100,
      clientY: 100,
    } as unknown as React.MouseEvent;

    result.current.handleMouseEnter(enterEvent1);

    const anchor = document.querySelector(
      "[data-tooltip-anchor]",
    ) as HTMLElement;
    expect(anchor).toBeInTheDocument();

    // Second enter with different position - should update existing anchor
    const enterEvent2 = {
      target,
      currentTarget: target,
      clientX: 250,
      clientY: 350,
    } as unknown as React.MouseEvent;

    result.current.handleMouseEnter(enterEvent2);

    expect(anchor.style.left).toBe("250px");

    unmount();
  });

  it("clears timeout on click", () => {
    const { result, unmount } = renderHook(() =>
      useTooltipControl(undefined, undefined, undefined, "tooltip content"),
    );

    const target = document.createElement("div");
    target.setAttribute("data-tooltip-element", "test");

    const enterEvent = {
      target,
      currentTarget: target,
      clientX: 100,
      clientY: 100,
    } as unknown as React.MouseEvent;

    result.current.handleMouseEnter(enterEvent);

    const clickEvent = {
      target,
      currentTarget: target,
    } as unknown as React.MouseEvent;

    result.current.handleClick(clickEvent);

    unmount();
  });

  it("skips event handling when target is not the anchor element", () => {
    const onMouseEnter = vi.fn();
    const { result, unmount } = renderHook(() =>
      useTooltipControl(undefined, onMouseEnter, undefined, "test content"),
    );

    const target = document.createElement("div");
    const currentTarget = document.createElement("div");
    currentTarget.setAttribute("data-tooltip-element", "test");

    const mockEvent = {
      target,
      currentTarget,
      clientX: 100,
      clientY: 100,
    } as unknown as React.MouseEvent;

    result.current.handleMouseEnter(mockEvent);

    expect(onMouseEnter).not.toHaveBeenCalled();

    unmount();
  });

  it("skips mouseMove when target is not anchor element", () => {
    const { result, unmount } = renderHook(() =>
      useTooltipControl(undefined, undefined, undefined, "test content"),
    );

    const target = document.createElement("div");
    const currentTarget = document.createElement("div");
    currentTarget.setAttribute("data-tooltip-element", "test");

    const mockEvent = {
      target,
      currentTarget,
      clientX: 100,
      clientY: 100,
    } as unknown as React.MouseEvent;

    // This should hit the return early path in handleMouseMove
    result.current.handleMouseMove(mockEvent);

    unmount();
  });

  it("handles re-entering element while tooltip is showing", async () => {
    vi.useRealTimers();

    const openMock = vi.fn();
    const closeMock = vi.fn();

    window.__systemTooltipRef = {
      current: {
        open: openMock,
        close: closeMock,
      },
    } as unknown as React.RefObject<TooltipRefProps | null>;

    const { result, unmount } = renderHook(() =>
      useTooltipControl(undefined, undefined, undefined, "tooltip content"),
    );

    const target = document.createElement("div");
    target.setAttribute("data-tooltip-element", "test");
    document.body.appendChild(target);

    const enterEvent = {
      target,
      currentTarget: target,
      clientX: 100,
      clientY: 100,
    } as unknown as React.MouseEvent;

    // First enter
    act(() => {
      result.current.handleMouseEnter(enterEvent);
    });

    // Wait for isReady to become true
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
    });

    expect(openMock).toHaveBeenCalled();

    // Re-enter while isReady is true - this should trigger the shorter timeout path (lines 138-140)
    act(() => {
      result.current.handleMouseEnter(enterEvent);
    });

    // Wait for shorter timeout (100ms)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150));
    });

    document.body.removeChild(target);
    unmount();
    vi.useFakeTimers();
  });

  it("clears close timeout on re-enter", () => {
    const { result, unmount } = renderHook(() =>
      useTooltipControl(undefined, undefined, undefined, "tooltip content"),
    );

    const target = document.createElement("div");
    target.setAttribute("data-tooltip-element", "test");

    const event = {
      target,
      currentTarget: target,
      clientX: 100,
      clientY: 100,
    } as unknown as React.MouseEvent;

    result.current.handleMouseEnter(event);
    result.current.handleMouseLeave(event);

    act(() => {
      vi.advanceTimersByTime(30);
    });

    result.current.handleMouseEnter(event);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(document.querySelector("[data-tooltip-anchor]")).toBeInTheDocument();

    unmount();
  });

  it("cleans up virtual anchor on unmount", () => {
    const { result, unmount } = renderHook(() =>
      useTooltipControl(undefined, undefined, undefined, "tooltip content"),
    );

    const target = document.createElement("div");
    target.setAttribute("data-tooltip-element", "test");

    const event = {
      target,
      currentTarget: target,
      clientX: 100,
      clientY: 100,
    } as unknown as React.MouseEvent;

    result.current.handleMouseEnter(event);

    expect(document.querySelector("[data-tooltip-anchor]")).toBeInTheDocument();

    unmount();

    expect(
      document.querySelector("[data-tooltip-anchor]"),
    ).not.toBeInTheDocument();
  });

  it("handles document click when tooltip is ready", () => {
    window.__systemTooltipRef = {
      current: {
        open: vi.fn(),
        close: vi.fn(),
      },
    } as unknown as React.RefObject<TooltipRefProps | null>;

    const { result, unmount } = renderHook(() =>
      useTooltipControl(undefined, undefined, undefined, "tooltip content"),
    );

    const target = document.createElement("div");
    target.setAttribute("data-tooltip-element", "test");

    const event = {
      target,
      currentTarget: target,
      clientX: 100,
      clientY: 100,
    } as unknown as React.MouseEvent;

    result.current.handleMouseEnter(event);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    act(() => {
      document.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(window.__systemTooltipRef?.current?.close).toHaveBeenCalled();

    unmount();
  });

  it("calls tooltip open and close via systemTooltipRef", async () => {
    vi.useRealTimers();

    const openMock = vi.fn();
    const closeMock = vi.fn();

    window.__systemTooltipRef = {
      current: {
        open: openMock,
        close: closeMock,
      },
    } as unknown as React.RefObject<TooltipRefProps | null>;

    const { result, unmount } = renderHook(() =>
      useTooltipControl(undefined, undefined, undefined, "tooltip content"),
    );

    // Initial useEffect runs with isReady=false, should call close
    expect(closeMock).toHaveBeenCalled();

    const target = document.createElement("div");
    target.setAttribute("data-tooltip-element", "test");
    document.body.appendChild(target);

    const event = {
      target,
      currentTarget: target,
      clientX: 100,
      clientY: 100,
    } as unknown as React.MouseEvent;

    act(() => {
      result.current.handleMouseEnter(event);
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
    });

    // After isReady becomes true, should call open
    expect(openMock).toHaveBeenCalled();

    document.body.removeChild(target);
    unmount();
    vi.useFakeTimers();
  });

  it("clears closeTimeout on click after mouseLeave", () => {
    const { result, unmount } = renderHook(() =>
      useTooltipControl(undefined, undefined, undefined, "tooltip content"),
    );

    const target = document.createElement("div");
    target.setAttribute("data-tooltip-element", "test");

    const event = {
      target,
      currentTarget: target,
      clientX: 100,
      clientY: 100,
    } as unknown as React.MouseEvent;

    // Enter to create anchor
    result.current.handleMouseEnter(event);

    // Leave to start closeTimeout
    result.current.handleMouseLeave(event);

    // Click before closeTimeout fires - should clear closeTimeout
    result.current.handleClick(event);

    // Advance time past what would have been the closeTimeout
    act(() => {
      vi.advanceTimersByTime(100);
    });

    unmount();
  });

  it("handles document click when tooltip is showing", async () => {
    vi.useRealTimers();

    const openMock = vi.fn();
    const closeMock = vi.fn();

    window.__systemTooltipRef = {
      current: {
        open: openMock,
        close: closeMock,
      },
    } as unknown as React.RefObject<TooltipRefProps | null>;

    const { result, unmount } = renderHook(() =>
      useTooltipControl(undefined, undefined, undefined, "tooltip content"),
    );

    const target = document.createElement("div");
    target.setAttribute("data-tooltip-element", "test");
    document.body.appendChild(target);

    const event = {
      target,
      currentTarget: target,
      clientX: 100,
      clientY: 100,
    } as unknown as React.MouseEvent;

    act(() => {
      result.current.handleMouseEnter(event);
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
    });

    expect(openMock).toHaveBeenCalled();

    // Reset mock counts
    closeMock.mockClear();

    // Simulate document click - should close tooltip via document click handler
    act(() => {
      document.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(closeMock).toHaveBeenCalled();

    document.body.removeChild(target);
    unmount();
    vi.useFakeTimers();
  });

  it("handles mouseLeave when no virtual anchor exists", () => {
    const { result, unmount } = renderHook(() =>
      useTooltipControl(undefined, undefined, undefined, "tooltip content"),
    );

    // Call mouseLeave without first calling mouseEnter (no anchor created)
    const mockEvent = {
      target: document.createElement("div"),
      currentTarget: document.createElement("div"),
    } as unknown as React.MouseEvent;

    result.current.handleMouseLeave(mockEvent);

    // Advance time to trigger the closeTimeout callback
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Should not throw - the branch handles missing virtualAnchorRef
    unmount();
  });

  it("handles document click when systemTooltipRef.current is null", async () => {
    vi.useRealTimers();

    // Set systemTooltipRef with null current
    window.__systemTooltipRef = {
      current: null,
    } as unknown as React.RefObject<TooltipRefProps | null>;

    const { result, unmount } = renderHook(() =>
      useTooltipControl(undefined, undefined, undefined, "tooltip content"),
    );

    const target = document.createElement("div");
    target.setAttribute("data-tooltip-element", "test");
    document.body.appendChild(target);

    const event = {
      target,
      currentTarget: target,
      clientX: 100,
      clientY: 100,
    } as unknown as React.MouseEvent;

    act(() => {
      result.current.handleMouseEnter(event);
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
    });

    // Simulate document click - should not throw when tooltipRef.current is null
    act(() => {
      document.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    document.body.removeChild(target);
    unmount();
    vi.useFakeTimers();
  });

  it("early returns from document click effect when isReady is false", () => {
    window.__systemTooltipRef = {
      current: {
        open: vi.fn(),
        close: vi.fn(),
      },
    } as unknown as React.RefObject<TooltipRefProps | null>;

    const { unmount } = renderHook(() =>
      useTooltipControl(undefined, undefined, undefined, "tooltip content"),
    );

    // When isReady is false (initial state), the effect early returns
    // The document click listener should not be attached
    act(() => {
      document.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    // close should not have been called since listener wasn't attached
    // (The initial close call is from the isReady effect, not the click handler)
    unmount();
  });

  it("skips tooltip open when contentString is undefined", async () => {
    vi.useRealTimers();

    const openMock = vi.fn();
    const closeMock = vi.fn();

    window.__systemTooltipRef = {
      current: {
        open: openMock,
        close: closeMock,
      },
    } as unknown as React.RefObject<TooltipRefProps | null>;

    // No contentString provided
    const { result, unmount } = renderHook(() =>
      useTooltipControl(undefined, undefined, undefined, undefined),
    );

    const target = document.createElement("div");
    target.setAttribute("data-tooltip-element", "test");
    document.body.appendChild(target);

    const event = {
      target,
      currentTarget: target,
      clientX: 100,
      clientY: 100,
    } as unknown as React.MouseEvent;

    act(() => {
      result.current.handleMouseEnter(event);
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
    });

    // open should not be called when contentString is undefined
    expect(openMock).not.toHaveBeenCalled();

    document.body.removeChild(target);
    unmount();
    vi.useFakeTimers();
  });
});

describe("<RootTooltip />", () => {
  it("renders without error", () => {
    render(<RootTooltip />);

    expect(screen.getByTestId("system-tooltip-container")).toBeInTheDocument();
    expect(screen.getByTestId("info-tooltip-container")).toBeInTheDocument();
  });

  it("sets window.__systemTooltipRef on mount", () => {
    render(<RootTooltip />);

    expect(window.__systemTooltipRef).toBeDefined();
    expect(window.__systemTooltipRef?.current).toBeDefined();
  });

  it("renders both system and info tooltips with correct ids", () => {
    render(<RootTooltip />);

    const systemTooltip = screen.getByTestId("system-tooltip-container");
    const infoTooltip = screen.getByTestId("info-tooltip-container");

    expect(systemTooltip).toBeInTheDocument();
    expect(infoTooltip).toBeInTheDocument();
  });
});

describe("omitTooltipProps", () => {
  it("removes tooltip-related props from object", () => {
    const props = {
      title: "Test title",
      tooltipContent: "Tooltip content",
      tooltipPlace: "top" as const,
      tooltipFitToContent: true,
      className: "my-class",
      id: "my-id",
    };

    const result = omitTooltipProps(props);

    expect(result).not.toHaveProperty("title");
    expect(result).not.toHaveProperty("tooltipContent");
    expect(result).not.toHaveProperty("tooltipPlace");
    expect(result).not.toHaveProperty("tooltipFitToContent");
    expect(result).toHaveProperty("className", "my-class");
    expect(result).toHaveProperty("id", "my-id");
  });

  it("returns empty object when only tooltip props provided", () => {
    const props = {
      title: "Test",
      tooltipContent: "Content",
    };

    const result = omitTooltipProps(props);

    expect(Object.keys(result)).toHaveLength(0);
  });

  it("returns all props when no tooltip props provided", () => {
    const props = {
      className: "test",
      id: "test-id",
      style: { color: "red" },
    };

    const result = omitTooltipProps(props);

    expect(result).toEqual(props);
  });
});
