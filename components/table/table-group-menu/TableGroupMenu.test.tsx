import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TableGroupMenu } from "./TableGroupMenu";

const mockMenuItems = [
  {
    id: "menu-change-type",
    disabled: false,
    label: "Change type",
    title: "Change type",
    iconUrl: "",
    onClick: vi.fn(),
    withDropDown: true,
    options: [
      {
        key: "option-1",
        label: "Option 1",
        onClick: vi.fn(),
      },
    ],
  },
];

const defaultProps = {
  isChecked: false,
  isIndeterminate: false,
  headerMenu: mockMenuItems,
  checkboxOptions: (
    <>
      <div>1</div>
      <div>2</div>
    </>
  ),
  onClick: vi.fn(),
  onChange: vi.fn(),
  withoutInfoPanelToggler: false,
  isInfoPanelVisible: false,
  toggleInfoPanel: vi.fn(),
  isBlocked: false,
  withComboBox: true,
};

vi.mock("@onlyoffice/apps-ui-kit/components/combobox", () => ({
  ComboBox: ({ title }: { title: string }) => (
    <div data-testid="combobox" title={title}>
      Mocked ComboBox
    </div>
  ),
  TOption: {},
}));

describe("<TableGroupMenu />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without errors", () => {
    render(<TableGroupMenu {...defaultProps} />);
    expect(screen.getByTestId("table-group-menu")).toBeInTheDocument();
  });

  it("calls onClick when the menu is clicked", async () => {
    render(<TableGroupMenu {...defaultProps} />);
    await userEvent.click(screen.getByTestId("table-group-menu"));
    expect(defaultProps.onClick).toHaveBeenCalled();
  });

  it("calls onChange when checkbox is clicked", async () => {
    render(<TableGroupMenu {...defaultProps} />);
    const checkbox = screen.getByRole("checkbox");
    await userEvent.click(checkbox);
    expect(defaultProps.onChange).toHaveBeenCalledWith(true);
  });

  it("renders header label if provided", () => {
    render(<TableGroupMenu {...defaultProps} headerLabel="Label text" />);
    expect(screen.getByText("Label text")).toBeInTheDocument();
  });

  it("renders combobox if withComboBox is true", () => {
    render(<TableGroupMenu {...defaultProps} />);
    expect(screen.getByTestId("table_group_menu_combobox")).toBeInTheDocument();
  });

  it("does not render combobox if withComboBox is false", () => {
    render(<TableGroupMenu {...defaultProps} withComboBox={false} />);
    expect(screen.queryByTestId("table_group_menu_combobox")).not.toBeInTheDocument();
  });

  it("renders close button if isCloseable is true", () => {
    render(
      <TableGroupMenu {...defaultProps} isCloseable onCloseClick={vi.fn()} />,
    );
    expect(screen.getByTestId("close-button")).toBeInTheDocument();
  });

  it("calls onCloseClick when close button is clicked", async () => {
    const onCloseClick = vi.fn();
    render(
      <TableGroupMenu
        {...defaultProps}
        isCloseable
        onCloseClick={onCloseClick}
      />,
    );
    const closeButton = screen.getByTestId("close-button");
    await userEvent.click(closeButton);
    expect(onCloseClick).toHaveBeenCalled();
  });

  it("calls toggleInfoPanel when info panel toggle button is clicked", async () => {
    render(<TableGroupMenu {...defaultProps} />);
    const infoPanelButton = screen.getByTestId("info-panel-toggle-button");
    await userEvent.click(infoPanelButton);
    expect(defaultProps.toggleInfoPanel).toHaveBeenCalled();
  });

  it("does not render info panel toggle when withoutInfoPanelToggler is true", () => {
    render(<TableGroupMenu {...defaultProps} withoutInfoPanelToggler />);
    expect(
      screen.queryByTestId("info-panel-toggle-button"),
    ).not.toBeInTheDocument();
  });
});
