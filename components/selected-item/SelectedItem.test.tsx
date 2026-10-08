import React from "react";
import { describe, it, expect, vi } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";

import { SelectedItem } from ".";

const baseProps = {
  label: "sample text",
  onClose: () => vi.fn(),
  propKey: "",
};

const renderWithHandlers = () => {
  const onClose = vi.fn();
  const onClick = vi.fn();

  const { container } = render(
    <SelectedItem
      {...baseProps}
      propKey="key"
      onClose={onClose}
      onClick={onClick}
    />,
  );

  const cross = container.querySelector(".selected-tag-removed") as HTMLElement;

  return { onClose, onClick, cross };
};

describe("<SelectedItem />", () => {
  it("renders without error", () => {
    render(<SelectedItem {...baseProps} />);

    expect(screen.getByTestId("selected-item")).toBeInTheDocument();
  });

  it("calls only onClose when the cross itself is clicked", () => {
    const { onClose, onClick, cross } = renderWithHandlers();

    fireEvent.click(cross);

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("calls only onClose when the icon inside the cross is clicked", () => {
    const { onClose, onClick, cross } = renderWithHandlers();
    const icon = cross.querySelector("*") as HTMLElement;

    fireEvent.click(icon);

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("calls onClick when the label is clicked", () => {
    const { onClose, onClick } = renderWithHandlers();

    fireEvent.click(screen.getByText("sample text"));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });
});
