import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PlayerFullScreen } from "./index";

// Mock SVG components
vi.mock("../../../assets/videoplayer.exit.react.svg", () => {
  const DummyExitFullScreen = ({
    ref,
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & {
    ref: React.RefObject<HTMLDivElement>;
  }) => <div {...props} ref={ref} />;
  DummyExitFullScreen.displayName = "IconExitFullScreen";
  return { default: DummyExitFullScreen };
});

vi.mock("../../../assets/videoplayer.full.react.svg", () => {
  const DummyFullScreen = ({
    ref,
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & {
    ref: React.RefObject<HTMLDivElement>;
  }) => <div {...props} ref={ref} />;
  DummyFullScreen.displayName = "IconFullScreen";
  return { default: DummyFullScreen };
});

describe("PlayerFullScreen", () => {
  const defaultProps = {
    isAudio: false,
    isFullScreen: false,
    onClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders enter full screen button when not in full screen mode", () => {
    render(<PlayerFullScreen {...defaultProps} />);

    const button = screen.getByTestId("player-fullscreen");
    expect(button).toBeInTheDocument();

    expect(button).toHaveAttribute("aria-pressed", "false");

    const icon = screen.getByTestId("enter-fullscreen-icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("role", "presentation");
  });

  it("calls onClick when button is clicked", () => {
    const onClick = vi.fn();
    render(<PlayerFullScreen {...defaultProps} onClick={onClick} />);

    const button = screen.getByTestId("player-fullscreen");
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not render anything when isAudio is true", () => {
    render(<PlayerFullScreen {...defaultProps} isAudio />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
