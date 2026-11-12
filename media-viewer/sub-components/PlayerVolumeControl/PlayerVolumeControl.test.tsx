import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PlayerVolumeControl } from "./index";

// Mock SVG icons
vi.mock("../../../assets/media.volumemax.react.svg", () => {
  const VolumeMaxIcon = () => <div>VolumeMaxIcon</div>;
  return { default: VolumeMaxIcon };
});

vi.mock("../../../assets/media.volumeoff.react.svg", () => {
  const VolumeOffIcon = () => <div>VolumeOffIcon</div>;
  return { default: VolumeOffIcon };
});

vi.mock("../../../assets/media.volumemin.react.svg", () => {
  const VolumeMinIcon = () => <div>VolumeMinIcon</div>;
  return { default: VolumeMinIcon };
});

describe("PlayerVolumeControl", () => {
  const defaultProps = {
    volume: 50,
    isMuted: false,
    toggleVolumeMute: vi.fn(),
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with correct ARIA attributes", () => {
    render(<PlayerVolumeControl {...defaultProps} />);

    const volumeControl = screen.getByTestId("player-volume-control");
    expect(volumeControl).toBeInTheDocument();
    expect(volumeControl).toHaveAttribute("role", "group");
    expect(volumeControl).toHaveAttribute("aria-label", "Volume controls");

    const muteButton = screen.getByTestId("volume-mute-button");
    expect(muteButton).toHaveAttribute("aria-label", "Mute");
    expect(muteButton).toHaveAttribute("aria-pressed", "false");

    const volumeSlider = screen.getByTestId("volume-slider");
    expect(volumeSlider).toHaveAttribute("type", "range");
    expect(volumeSlider).toHaveAttribute("aria-label", "Volume");
    expect(volumeSlider).toHaveAttribute("aria-valuemin", "0");
    expect(volumeSlider).toHaveAttribute("aria-valuemax", "100");
    expect(volumeSlider).toHaveAttribute("aria-valuenow", "50");
    expect(volumeSlider).toHaveAttribute("aria-valuetext", "50%");
  });

  it("handles volume slider changes", () => {
    render(<PlayerVolumeControl {...defaultProps} />);

    const volumeSlider = screen.getByTestId("volume-slider");
    fireEvent.change(volumeSlider, { target: { value: "75" } });

    expect(defaultProps.onChange).toHaveBeenCalled();
    expect(volumeSlider).toHaveValue("50"); // Value doesn't change because it's controlled by parent
  });

  it("handles mute button click", () => {
    render(<PlayerVolumeControl {...defaultProps} />);

    const muteButton = screen.getByTestId("volume-mute-button");
    fireEvent.click(muteButton);

    expect(defaultProps.toggleVolumeMute).toHaveBeenCalled();
  });

  it("shows correct button state when muted", () => {
    render(<PlayerVolumeControl {...defaultProps} isMuted />);

    const muteButton = screen.getByTestId("volume-mute-button");
    expect(muteButton).toHaveAttribute("aria-label", "Unmute");
    expect(muteButton).toHaveAttribute("aria-pressed", "true");
  });
});
