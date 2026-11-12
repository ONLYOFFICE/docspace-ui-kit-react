import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render } from "@testing-library/react";

import { MainPanel } from ".";

// Mock react-device-detect
vi.mock("react-device-detect", () => ({
  isDesktop: false,
}));

interface GestureHandlers {
  onDrag?: (state: { offset: [number]; movement: [number] }) => void;
  onDragEnd?: (state: { movement: [number] }) => void;
}

// Mock use-gesture
vi.mock("@use-gesture/react", () => ({
  useGesture: (handlers: GestureHandlers) => {
    // Store handlers for testing
    // biome-ignore lint/suspicious/noExplicitAny: TODO fix
    (global as any).gestureHandlers = handlers;
  },
}));

describe("MainPanel component", () => {
  const mockProps = {
    src: "test.pdf",
    isLoading: false,
    isLastImage: false,
    isFistImage: false,
    setZoom: vi.fn(),
    onPrev: vi.fn(),
    onNext: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.innerWidth for swipe gesture tests
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it("renders with correct accessibility attributes", () => {
    const { getByTestId } = render(<MainPanel {...mockProps} />);

    const wrapper = getByTestId("main-panel-wrapper");
    const content = getByTestId("main-panel-content");

    expect(wrapper).toHaveAttribute("role", "region");
    expect(wrapper).toHaveAttribute("aria-label", "PDF viewer main panel");

    expect(content).toHaveAttribute("role", "document");
    expect(content).toHaveAttribute("aria-busy", "false");
    expect(content).toHaveAttribute("aria-label", "PDF document test.pdf");
  });

  it("updates loading state correctly", () => {
    const { getByTestId, rerender } = render(
      <MainPanel {...mockProps} isLoading />,
    );

    const content = getByTestId("main-panel-content");
    expect(content).toHaveAttribute("data-loading", "true");
    expect(content).toHaveAttribute("aria-busy", "true");

    rerender(<MainPanel {...mockProps} isLoading={false} />);
    expect(content).toHaveAttribute("data-loading", "false");
    expect(content).toHaveAttribute("aria-busy", "false");
  });

  it("calls onNext when swiping left", () => {
    render(<MainPanel {...mockProps} />);
    // biome-ignore lint/suspicious/noExplicitAny: TODO fix
    const handlers = (global as any).gestureHandlers as GestureHandlers;

    // Simulate drag end with left swipe
    handlers.onDragEnd?.({ movement: [-300] }); // More than width/4 (1024/4)
    expect(mockProps.onNext).toHaveBeenCalled();
  });

  it("calls onPrev when swiping right", () => {
    render(<MainPanel {...mockProps} />);
    // biome-ignore lint/suspicious/noExplicitAny: TODO fix
    const handlers = (global as any).gestureHandlers as GestureHandlers;

    // Simulate drag end with right swipe
    handlers.onDragEnd?.({ movement: [300] }); // More than width/4 (1024/4)
    expect(mockProps.onPrev).toHaveBeenCalled();
  });
});
