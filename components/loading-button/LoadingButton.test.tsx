import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { LoadingButton } from ".";

describe("<LoadingButton />", () => {
  it("renders without crashing", () => {
    render(<LoadingButton />);
    const container = screen.getByTestId("loading-button-container");
    expect(container).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<LoadingButton onClick={handleClick} />);
    const container = screen.getByTestId("loading-button-container");
    fireEvent.click(container);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("has a keyboard-operable, named cancel control when onClick is set", () => {
    const handleClick = vi.fn();
    render(<LoadingButton onClick={handleClick} />);
    const cancel = screen.getByRole("button", { name: "Cancel" });
    expect(cancel).toHaveAttribute("tabindex", "0");

    fireEvent.keyDown(cancel, { key: "Enter" });
    fireEvent.keyDown(cancel, { key: " " });
    expect(handleClick).toHaveBeenCalledTimes(2);

    // A click on the control bubbles to the square and counts once.
    fireEvent.click(cancel);
    expect(handleClick).toHaveBeenCalledTimes(3);
  });

  it("has no cancel control without onClick", () => {
    render(<LoadingButton />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("takes the cancel control's name from cancelLabel", () => {
    render(<LoadingButton onClick={vi.fn()} cancelLabel="Stop upload" />);
    expect(
      screen.getByRole("button", { name: "Stop upload" }),
    ).toBeInTheDocument();
  });

  it("reports a clamped percent through a progress bar", () => {
    const { rerender } = render(<LoadingButton percent={40} />);
    const bar = screen.getByRole("progressbar", { name: "Progress" });
    expect(bar).toHaveAttribute("aria-valuenow", "40");

    rerender(<LoadingButton percent={140} />);
    expect(bar).toHaveAttribute("aria-valuenow", "100");

    rerender(<LoadingButton percent={0} />);
    expect(bar).not.toHaveAttribute("aria-valuenow");
  });

  it("applies id, className and style to the square", () => {
    render(
      <LoadingButton id="upload-1" className="mine" style={{ margin: 4 }} />,
    );
    const container = screen.getByTestId("loading-button-container");
    expect(container).toHaveAttribute("id", "upload-1");
    expect(container).toHaveClass("mine");
    expect(container).toHaveStyle({ margin: "4px" });
  });
});
