import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PlayerSpeedControl } from "./index";

vi.mock("react-device-detect", () => ({
  isMobile: false,
  isMobileOnly: false,
  isIOS: false,
}));

describe("PlayerSpeedControl", () => {
  const defaultProps = {
    handleSpeedChange: vi.fn(),
    onMouseLeave: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders speed control button with default speed", () => {
    render(<PlayerSpeedControl {...defaultProps} />);

    const button = screen.getByTestId("speed-control");
    expect(button).toBeInTheDocument();

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-haspopup", "listbox");
  });

  it("opens speed menu on click in desktop mode", () => {
    render(<PlayerSpeedControl {...defaultProps} />);

    const button = screen.getByTestId("speed-control");
    fireEvent.click(button);

    const menu = screen.getByTestId("speed-menu");
    expect(menu).toBeInTheDocument();

    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("changes speed on option click", () => {
    render(<PlayerSpeedControl {...defaultProps} />);

    fireEvent.click(screen.getByTestId("speed-control"));
    fireEvent.click(screen.getByTestId("speed-option-X1.5"));

    expect(defaultProps.handleSpeedChange).toHaveBeenCalledWith(1.5);
    expect(defaultProps.onMouseLeave).toHaveBeenCalled();
  });
});
