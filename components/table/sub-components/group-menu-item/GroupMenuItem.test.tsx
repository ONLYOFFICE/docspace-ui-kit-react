import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { GroupMenuItem } from "./GroupMenuItem";

const mockItem = {
  label: "Menu Item",
  disabled: false,
  onClick: vi.fn(),
  iconUrl: "",
  title: "Menu Item Title",
  id: "group-menu-item",
};

const mockItemWithDropDown = {
  ...mockItem,
  withDropDown: true,
  options: [
    {
      key: "option-1",
      label: "Option 1",
      onClick: () => {},
    },
    {
      key: "option-2",
      label: "Option 2",
      onClick: () => {},
    },
  ],
};

vi.mock("@docspace/ui-kit/components/drop-down", () => ({
  __esModule: true,
  DropDown: () => <div data-testid="dropdown" />,
}));

describe("<GroupMenuItem />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without errors", () => {
    render(<GroupMenuItem item={mockItem} />);

    expect(screen.getByTestId("group-menu-item")).toBeInTheDocument();
  });

  it("renders nothing if item is disabled", () => {
    render(<GroupMenuItem item={{ ...mockItem, disabled: true }} />);

    expect(screen.queryByTestId("group-menu-item")).not.toBeInTheDocument();
  });

  it("renders dropdown if item has withDropDown: true", () => {
    render(<GroupMenuItem item={mockItemWithDropDown} />);

    expect(screen.getByTestId("dropdown")).toBeInTheDocument();
  });

  it("calls item's onClick when button is clicked", async () => {
    render(<GroupMenuItem item={mockItem} />);

    const button = screen.getByTestId("group-menu-item-button");

    await userEvent.click(button);

    expect(mockItem.onClick).toHaveBeenCalled();
  });

  it("doesn't call item's onClick when button is clicked and isBlocked passed", async () => {
    render(<GroupMenuItem item={mockItem} isBlocked />);

    const button = screen.getByTestId("group-menu-item-button");

    await userEvent.click(button);

    expect(mockItem.onClick).not.toHaveBeenCalled();
  });
});
