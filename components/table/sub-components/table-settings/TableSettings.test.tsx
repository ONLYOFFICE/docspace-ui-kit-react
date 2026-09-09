import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SortByFieldName } from "../../../../enums";
import { TableSettings } from "./TableSettings";

const mockColumns = [
  {
    key: "name",
    title: "Name",
    enable: true,
    sortBy: SortByFieldName.Name,
    onChange: vi.fn(),
  },
];

vi.mock("@onlyoffice/apps-ui-kit/components/drop-down", () => ({
  __esModule: true,
  DropDown: ({ open }: { open?: boolean }) => (
    <div data-testid="drop-down" data-open={open}>
      MockDropDown
    </div>
  ),
}));

describe("<TableSettings />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without errors", () => {
    render(<TableSettings columns={mockColumns} />);

    expect(screen.getByTestId("table-settings")).toBeInTheDocument();
  });

  it("open DropDown by click on settings icon", async () => {
    render(<TableSettings columns={mockColumns} />);

    const button = screen.getByTestId("table-settings-button");
    const dropDown = screen.getByTestId("dropdown");

    expect(dropDown).not.toHaveClass("open");

    await userEvent.click(button);

    expect(dropDown).toHaveClass("open");
  });

  it("doesn't open DropDown by click on settings icon if settings are disabled", async () => {
    render(<TableSettings columns={mockColumns} disableSettings />);

    const button = screen.getByTestId("table-settings-button");
    const dropDown = screen.getByTestId("dropdown");

    expect(dropDown).not.toHaveClass("open");

    await userEvent.click(button);

    expect(dropDown).not.toHaveClass("open");
  });
});
