import React from "react";
import { describe, it, expect, vi } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";

import { Slider } from "./index";

const defaultProps = {
  min: 0,
  max: 100,
  value: 50,
  onChange: vi.fn(),
};

describe("<Slider />", () => {
  it("renders without error", () => {
    render(<Slider {...defaultProps} />);
    expect(screen.getByTestId("slider")).toBeInTheDocument();
  });

  it("accepts and applies custom props", () => {
    const props = {
      id: "testId",
      className: "test-class",
      step: 5,
      withPouring: true,
      isDisabled: false,
      ...defaultProps,
    };

    render(<Slider {...props} />);
    const slider = screen.getByTestId("slider");

    expect(slider).toHaveAttribute("id", "testId");
    expect(slider).toHaveAttribute("class");
    expect(slider.className).toContain("test-class");
    expect(slider).toHaveAttribute("min", "0");
    expect(slider).toHaveAttribute("max", "100");
    expect(slider).toHaveAttribute("value", "50");
    expect(slider).toHaveAttribute("step", "5");
  });

  it("handles value changes correctly", () => {
    render(<Slider {...defaultProps} />);

    const slider = screen.getByTestId("slider");
    fireEvent.change(slider, { target: { value: "75" } });

    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it("respects disabled state", () => {
    render(<Slider {...defaultProps} isDisabled />);

    const slider = screen.getByTestId("slider");
    expect(slider).toBeDisabled();
  });

  it("applies custom dimensions", () => {
    render(
      <Slider
        {...defaultProps}
        thumbHeight="20px"
        thumbWidth="20px"
        thumbBorderWidth="2px"
        runnableTrackHeight="4px"
      />,
    );

    const slider = screen.getByTestId("slider");

    expect(slider.style.getPropertyValue("--thumb-width")).toBe("20px");
    expect(slider.style.getPropertyValue("--thumb-height")).toBe("20px");
    expect(slider.style.getPropertyValue("--thumb-border-width")).toBe("2px");
    expect(slider.style.getPropertyValue("--runnable-track-height")).toBe(
      "4px",
    );
  });

  it("sizes the poured fill from the value's place in the range", () => {
    render(
      <Slider {...defaultProps} min={100} max={200} value={150} withPouring />,
    );

    const slider = screen.getByTestId("slider");

    expect(slider.style.getPropertyValue("--size-prop")).toBe("50%");
    expect(slider.style.backgroundSize).toBe("50% 100%");
  });

  it("leaves the track unfilled without withPouring", () => {
    render(<Slider {...defaultProps} />);

    expect(screen.getByTestId("slider").style.backgroundSize).toBe("auto");
  });

  it("pours from the right in a right-to-left document", () => {
    document.dir = "rtl";
    render(<Slider {...defaultProps} withPouring />);
    document.dir = "";

    expect(screen.getByTestId("slider").style.backgroundPosition).toBe(
      "right center",
    );
  });

  it("marks the poured and disabled states with modifier classes", () => {
    render(<Slider {...defaultProps} withPouring isDisabled />);

    const slider = screen.getByTestId("slider");

    expect(slider.className).toContain("withPouring");
    expect(slider.className).toContain("disabled");
  });
});
