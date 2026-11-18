import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import OperationsProgressButton from ".";

const operation = (label: string, operation: string, percent: number) => ({
  operation,
  label,
  alert: false,
  completed: false,
  percent,
});

describe("<OperationsProgressButton /> accessible name", () => {
  it("names the progress bar after the one running operation", () => {
    render(
      <OperationsProgressButton
        operations={[operation("Re-encrypting files", "other", 40)]}
      />,
    );

    const bar = screen.getByRole("progressbar", {
      name: "Re-encrypting files",
    });
    expect(bar).toHaveAttribute("aria-valuenow", "40");
  });

  it("does not name the button after its icon", () => {
    render(
      <OperationsProgressButton
        operations={[operation("Moving folder", "move", 10)]}
      />,
    );

    expect(screen.queryByLabelText("move button")).toBeNull();
    expect(screen.getAllByLabelText("Moving folder").length).toBeGreaterThan(0);
  });
});
