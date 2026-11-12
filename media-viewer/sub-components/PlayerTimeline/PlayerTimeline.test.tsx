import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PlayerTimeline } from "./index";
import { PlayerTimelineRef } from "./PlayerTimeline.props";

// Mock react-device-detect
vi.mock("react-device-detect", () => ({
  isMobile: false,
  isMobileOnly: false,
  isIOS: false,
}));

describe("PlayerTimeline", () => {
  const mockClientWidth = 200;
  const defaultProps = {
    value: 50,
    duration: 300, // 5 minutes
    onChange: vi.fn(),
    onMouseEnter: vi.fn(),
    onMouseLeave: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: mockClientWidth,
      height: 10,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));

    // Mock clientWidth
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      value: mockClientWidth,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders timeline with correct ARIA attributes", () => {
    render(<PlayerTimeline {...defaultProps} />);

    const timeline = screen.getByTestId("player-timeline");
    expect(timeline).toBeInTheDocument();
    expect(timeline).toHaveAttribute("role", "group");
    expect(timeline).toHaveAttribute("aria-label", "Video timeline");

    const progress = screen.getByTestId("timeline-progress");
    expect(progress).toHaveAttribute("role", "progressbar");
    expect(progress).toHaveAttribute("aria-valuenow", "50");
    expect(progress).toHaveAttribute("aria-valuemin", "0");
    expect(progress).toHaveAttribute("aria-valuemax", "100");

    const slider = screen.getByTestId("timeline-slider");
    expect(slider).toHaveAttribute("type", "range");
  });

  it("handles slider value changes", () => {
    render(<PlayerTimeline {...defaultProps} />);

    const slider = screen.getByTestId("timeline-slider");
    fireEvent.change(slider, { target: { value: "75" } });

    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it("handles mouse enter and leave events", () => {
    render(<PlayerTimeline {...defaultProps} />);

    const timeline = screen.getByTestId("player-timeline");

    fireEvent.mouseEnter(timeline);
    expect(defaultProps.onMouseEnter).toHaveBeenCalled();

    fireEvent.mouseLeave(timeline);
    expect(defaultProps.onMouseLeave).toHaveBeenCalled();
  });

  it("updates progress through ref", () => {
    const ref = React.createRef<PlayerTimelineRef>();
    render(<PlayerTimeline {...defaultProps} ref={ref} />);

    const progress = screen.getByTestId("timeline-progress");
    ref.current?.setProgress(0.75);

    // Wait for style updates
    vi.advanceTimersByTime(0);
    expect(progress.style.width).toBe("75%");
  });

  it("shows hover progress on mouse move", () => {
    render(<PlayerTimeline {...defaultProps} />);

    const timeline = screen.getByTestId("player-timeline");

    // Move mouse to 50% of the timeline width
    fireEvent.mouseMove(timeline, {
      nativeEvent: { offsetX: mockClientWidth / 2 },
    });

    // Wait for style updates
    vi.advanceTimersByTime(0);
  });
});
