import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { PlayerBigPlayButton } from ".";
import styles from "./PlayerBigPlayButton.module.scss";

// Mock BigIconPlay SVG component
vi.mock("../../../assets/media.bgplay.react.svg", () => {
  const DummyBigIconPlay = ({
    ref,
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.RefObject<HTMLDivElement>;
  }) => (
    <div {...props} ref={ref}>
      Play Icon
    </div>
  );
  DummyBigIconPlay.displayName = "BigIconPlay";
  return { default: DummyBigIconPlay };
});

describe("PlayerBigPlayButton", () => {
  const defaultProps = {
    visible: true,
    onClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly when visible", () => {
    render(<PlayerBigPlayButton {...defaultProps} />);

    const button = screen.getByTestId("player-big-play-button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(styles.wrapper);
    expect(button).toHaveAttribute("aria-label", "Play media");

    const icon = screen.getByTestId("play-icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("role", "presentation");
  });

  it("does not render when not visible", () => {
    render(<PlayerBigPlayButton {...defaultProps} visible={false} />);
    expect(
      screen.queryByTestId("player-big-play-button"),
    ).not.toBeInTheDocument();
  });

  it("prevents context menu", () => {
    render(<PlayerBigPlayButton {...defaultProps} />);

    const button = screen.getByTestId("player-big-play-button");
    const mockEvent = new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(mockEvent, "preventDefault", {
      value: vi.fn(),
    });

    fireEvent(button, mockEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
  });
});
