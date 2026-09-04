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
});
