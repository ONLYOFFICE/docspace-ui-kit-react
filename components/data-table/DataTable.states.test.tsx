import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DataTable } from "./DataTable";
import { DATA_TABLE_ROW_ACTIONS_CLASS } from "./DataTable.constants";
import type {
  DataTableColumn,
  DataTableProps,
  DataTableRowState,
} from "./DataTable.types";
import styles from "./DataTable.module.scss";
import { DataTableRowActions } from "./sub-components/row/RowActions";
import { DataTableRowCheckbox } from "./sub-components/row/RowCheckbox";

type File = { id: number; name: string };

const FILES: File[] = [
  { id: 1, name: "Report.docx" },
  { id: 2, name: "Budget.xlsx" },
];

const COLUMNS: DataTableColumn<File>[] = [
  {
    id: "Name",
    title: "Name",
    width: { type: "fill" },
    cell: (row) => row.name,
  },
];

const renderTable = (props: Partial<DataTableProps<File>> = {}) =>
  render(
    <DataTable<File>
      columns={COLUMNS}
      rows={FILES}
      getRowKey={(row) => row.id}
      {...props}
    />,
  );

const rows = () => screen.getAllByTestId("data-table-row");

describe("DataTable row states", () => {
  it.each<[keyof DataTableRowState, string]>([
    ["checked", styles.isChecked],
    ["active", styles.isActive],
    ["caret", styles.isCaret],
    ["dropTarget", styles.isDropTarget],
    ["dropOver", styles.isDropOver],
    ["dimmed", styles.isDimmed],
    ["highlight", styles.isHighlight],
    ["busy", styles.isBusy],
  ])("marks a row given %s", (state, className) => {
    expect(className).toBeTruthy();
    renderTable({
      getRowProps: (row) => (row.id === 2 ? { [state]: true } : {}),
    });

    expect(rows()[1]).toHaveClass(className);
    expect(rows()[0]).not.toHaveClass(className);
  });

  it("tints rows under the pointer unless hover is turned off", () => {
    renderTable({ getRowProps: (row) => ({ hover: row.id === 1 }) });

    expect(rows()[0]).toHaveClass(styles.hasHover);
    expect(rows()[1]).not.toHaveClass(styles.hasHover);
  });

  it("marks the first row, which the header's line follows", () => {
    renderTable();

    expect(rows()[0]).toHaveClass(styles.isFirstRow);
    expect(rows()[1]).not.toHaveClass(styles.isFirstRow);
  });

  it("gives a clickable row the pointer cursor, and no other", () => {
    renderTable({
      getRowProps: (row) => (row.id === 1 ? { onClick: () => {} } : {}),
    });

    expect(rows()[0]).toHaveClass(styles.isClickable);
    expect(rows()[1]).not.toHaveClass(styles.isClickable);
  });
});

describe("DataTableRowCheckbox", () => {
  it("shows the icon and a named checkbox that reports the new state", async () => {
    const onChange = vi.fn();
    render(
      <DataTableRowCheckbox
        icon={<span data-testid="icon" />}
        label="Select file"
        onChange={onChange}
      />,
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("checkbox", { name: "Select file" }),
    );
    expect(onChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("keeps the checkbox ticked and shown on a selected row", () => {
    render(<DataTableRowCheckbox icon="i" label="Select file" checked />);

    expect(screen.getByTestId("data-table-row-checkbox")).toHaveClass(
      styles.isRowChecked,
    );
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("is reachable from the keyboard while the icon shows", async () => {
    render(<DataTableRowCheckbox icon="i" label="Select file" />);

    await userEvent.tab();
    expect(screen.getByRole("checkbox", { name: "Select file" })).toHaveFocus();
  });

  it("offers no checkbox when disabled", () => {
    render(<DataTableRowCheckbox icon="i" label="Select file" disabled />);

    expect(screen.queryByRole("checkbox")).toBeNull();
    expect(screen.getByText("i")).toBeInTheDocument();
  });

  it("shows a loader instead of both while loading", () => {
    render(
      <DataTableRowCheckbox
        icon={<span data-testid="icon" />}
        label="Select file"
        loading
      />,
    );

    expect(screen.queryByTestId("icon")).toBeNull();
    expect(screen.queryByRole("checkbox")).toBeNull();
  });
});

describe("DataTableRowActions", () => {
  it("wraps its content in the class the rows hide until hovered", () => {
    renderTable({
      columns: [
        {
          ...COLUMNS[0],
          cell: (row) => (
            <DataTableRowActions>
              <button type="button">Share {row.name}</button>
            </DataTableRowActions>
          ),
        },
      ],
    });

    const button = within(rows()[0]).getByRole("button", {
      name: "Share Report.docx",
    });
    expect(button.parentElement).toHaveClass(DATA_TABLE_ROW_ACTIONS_CLASS);
  });
});
