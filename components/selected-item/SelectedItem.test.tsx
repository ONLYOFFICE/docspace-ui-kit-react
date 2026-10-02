import React from "react";
import { describe, it, expect, vi } from "vitest";
import { screen, render } from "@testing-library/react";

import { SelectedItem } from ".";

const baseProps = {
  label: "sample text",
  onClose: () => vi.fn(),
  propKey: "",
};

describe("<SelectedItem />", () => {
  it("renders without error", () => {
    render(<SelectedItem {...baseProps} />);

    expect(screen.getByTestId("selected-item")).toBeInTheDocument();
  });
});
