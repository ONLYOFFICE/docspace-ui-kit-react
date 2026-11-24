import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PlayerPlayButton } from "./index";

// Mock SVG components
vi.mock("../../../assets/videoplayer.play.react.svg", () => {
  const DummyPlayIcon = ({
    ref,
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & {
    ref: React.RefObject<HTMLDivElement>;
  }) => <div {...props} ref={ref} />;
  DummyPlayIcon.displayName = "IconPlay";
  return { default: DummyPlayIcon };
});

vi.mock("../../../assets/videoplayer.stop.react.svg", () => {
  const DummyStopIcon = ({
    ref,
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & {
    ref: React.RefObject<HTMLDivElement>;
  }) => <div {...props} ref={ref} />;
  DummyStopIcon.displayName = "IconStop";
  return { default: DummyStopIcon };
});

describe("PlayerPlayButton", () => {
  const defaultProps = {
    isPlaying: false,
    onClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders play button when not playing", () => {
    render(<PlayerPlayButton {...defaultProps} />);

    const button = screen.getByTestId("player-play-button");
    expect(button).toBeInTheDocument();

    expect(button).toHaveAttribute("aria-pressed", "false");

    const icon = screen.getByTestId("play-icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("role", "presentation");
  });

  it("renders pause button when playing", () => {
    render(<PlayerPlayButton {...defaultProps} isPlaying />);

    const button = screen.getByTestId("player-play-button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-testid", "player-play-button");
    expect(button).toHaveAttribute("aria-pressed", "true");

    const icon = screen.getByTestId("pause-icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("role", "presentation");
  });

  it("calls onClick when button is clicked", () => {
    const onClick = vi.fn();
    render(<PlayerPlayButton {...defaultProps} onClick={onClick} />);

    const button = screen.getByTestId("player-play-button");
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("stops event propagation on touch start", () => {
    render(<PlayerPlayButton {...defaultProps} />);

    const button = screen.getByTestId("player-play-button");
    const touchStartEvent = new TouchEvent("touchstart", {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(touchStartEvent, "stopPropagation", {
      value: vi.fn(),
    });

    button.dispatchEvent(touchStartEvent);
    expect(touchStartEvent.stopPropagation).toHaveBeenCalledTimes(1);
  });
});
