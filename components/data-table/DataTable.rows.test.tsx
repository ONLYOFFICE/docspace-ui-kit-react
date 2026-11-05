import { useState } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DataTable } from "./DataTable";
import { DATA_TABLE_CONTEXT_MENU_CELL_CLASS } from "./DataTable.constants";
import type {
  DataTableColumn,
  DataTableProps,
  DataTableRowState,
} from "./DataTable.types";
import { contextMenuColumn } from "./columns/contextMenuColumn";
import { settingsColumn } from "./columns/settingsColumn";
import { DataTableRow } from "./sub-components/row/DataTableRow";

type File = { id: number; name: string; author: string };

const FILES: File[] = [
  { id: 1, name: "Report.docx", author: "Ann" },
  { id: 2, name: "Budget.xlsx", author: "Bob" },
];

const BASE_COLUMNS: DataTableColumn<File>[] = [
  {
    id: "Name",
    title: "Name",
    width: { type: "fill" },
    cell: (row) => row.name,
  },
  {
    id: "Author",
    title: "Author",
    width: { type: "flex" },
    cell: (row) => row.author,
  },
];

const renderTable = (props: Partial<DataTableProps<File>> = {}) =>
  render(
    <DataTable<File>
      columns={BASE_COLUMNS}
      rows={FILES}
      getRowKey={(row) => row.id}
      {...props}
    />,
  );

const rows = () => screen.getAllByTestId("data-table-row");
const cellsOf = (row: HTMLElement) => within(row).getAllByRole("cell");

describe("DataTable rows", () => {
  it("applies the state getRowProps returns to the row", () => {
    renderTable({
      getRowProps: (row) => ({
        checked: row.id === 1,
        active: row.id === 2,
        className: `file-${row.id}`,
        testId: `row-${row.id}`,
      }),
    });

    const first = screen.getByTestId("row-1");
    expect(first).toHaveClass("table-container_row", "checked", "file-1");
    expect(first).toHaveAttribute("aria-selected", "true");

    const second = screen.getByTestId("row-2");
    expect(second).not.toHaveClass("checked");
    expect(second).toHaveAttribute("aria-selected", "false");
  });

  it("leaves aria-selected off a row whose selection is not given", () => {
    renderTable();
    expect(rows()[0]).not.toHaveAttribute("aria-selected");
  });

  it("puts cellProps on every cell of the row", () => {
    renderTable({
      getRowProps: (row) => ({
        cellProps: {
          className: `files-item ${row.id}`,
          value: `file_${row.id}`,
          documentTitle: row.name,
          style: { opacity: 0.4 },
        },
      }),
    });

    for (const cell of cellsOf(rows()[0])) {
      expect(cell).toHaveClass("table-container_cell", "files-item", "1");
      expect(cell).toHaveAttribute("value", "file_1");
      expect(cell).toHaveAttribute("data-document-title", "Report.docx");
      expect(cell).toHaveStyle({ opacity: "0.4" });
    }
  });

  it("finds every cell of a row by the cellProps class, as drag and drop does", () => {
    renderTable({
      columns: [...BASE_COLUMNS, settingsColumn({ withContextMenu: true })],
      getRowProps: (row) => ({ cellProps: { className: `drop-${row.id}` } }),
    });

    expect(document.getElementsByClassName("drop-2")).toHaveLength(3);
  });

  it("calls the row's click handlers", async () => {
    const onClick = vi.fn();
    const onDoubleClick = vi.fn();
    renderTable({
      getRowProps: (row) => ({
        onClick: () => onClick(row.id),
        onDoubleClick: () => onDoubleClick(row.id),
      }),
    });

    await userEvent.click(screen.getByText("Budget.xlsx"));
    expect(onClick).toHaveBeenCalledWith(2);

    await userEvent.dblClick(screen.getByText("Report.docx"));
    expect(onDoubleClick).toHaveBeenCalledWith(1);
  });

  it("renders the rows renderRow returns, with the cells of the table", () => {
    renderTable({
      getRowProps: (row) => ({ checked: row.id === 2 }),
      renderRow: ({ row, index, rowProps }) => (
        <div className="drag-and-drop" data-testid={`wrapper-${row.id}`}>
          <DataTableRow row={row} index={index} {...rowProps} />
        </div>
      ),
    });

    const wrapper = screen.getByTestId("wrapper-2");
    const row = within(wrapper).getByTestId("data-table-row");
    expect(row).toHaveClass("checked");
    expect(
      cellsOf(row).map((cell) => cell.getAttribute("data-column-id")),
    ).toEqual(["Name", "Author"]);
    expect(within(row).getByText("Bob")).toBeInTheDocument();
  });

  it("does not ask for a row's props again when nothing about it changed", () => {
    const getRowProps = vi.fn((): DataTableRowState => ({}));

    const Harness = () => {
      const [count, setCount] = useState(0);
      return (
        <>
          <button type="button" onClick={() => setCount(count + 1)}>
            Render again
          </button>
          <DataTable<File>
            columns={BASE_COLUMNS}
            rows={FILES}
            getRowKey={(row) => row.id}
            getRowProps={getRowProps}
          />
        </>
      );
    };

    render(<Harness />);
    expect(getRowProps).toHaveBeenCalledTimes(2);

    fireEvent.click(screen.getByRole("button", { name: "Render again" }));
    expect(getRowProps).toHaveBeenCalledTimes(2);
  });
});

describe("DataTable row menu", () => {
  const options = [
    { key: "rename", label: "Rename" },
    { key: "delete", label: "Delete" },
  ];

  const withMenu = (state: DataTableRowState["contextMenu"] = {}) =>
    renderTable({
      columns: [...BASE_COLUMNS, contextMenuColumn()],
      getRowProps: () => ({
        contextMenu: { options, title: "Actions", ...state },
      }),
    });

  it("puts the menu button in its column, under the old cell class", () => {
    withMenu();

    const cell = within(rows()[0])
      .getAllByRole("cell")
      .find((c) => c.getAttribute("data-column-id") === "ContextMenu");
    expect(cell).toHaveClass(DATA_TABLE_CONTEXT_MENU_CELL_CLASS);
    expect(
      within(cell as HTMLElement).getByTestId("data-table-context-menu-button"),
    ).toBeInTheDocument();
  });

  it("draws no button for a row without options", () => {
    renderTable({
      columns: [...BASE_COLUMNS, contextMenuColumn()],
      getRowProps: (row) => (row.id === 1 ? { contextMenu: { options } } : {}),
    });

    expect(
      within(rows()[0]).getByTestId("data-table-context-menu-button"),
    ).toBeInTheDocument();
    expect(
      within(rows()[1]).queryByTestId("data-table-context-menu-button"),
    ).toBeNull();
    expect(rows()[1].querySelector(".expandButton")).not.toBeNull();
  });

  it("opens the menu on a right-click anywhere in the row", () => {
    const onOpen = vi.fn();
    withMenu({ onOpen });

    fireEvent.contextMenu(screen.getByText("Budget.xlsx"), { button: 2 });

    expect(onOpen).toHaveBeenCalledWith(true);
    expect(screen.getByText("Rename")).toBeInTheDocument();
  });

  it("does not select the row it opens the menu of", () => {
    const onClick = vi.fn();
    const outside = vi.fn();
    document.addEventListener("click", outside);
    renderTable({
      columns: [...BASE_COLUMNS, contextMenuColumn()],
      getRowProps: () => ({ contextMenu: { options }, onClick }),
    });

    fireEvent.contextMenu(screen.getByText("Budget.xlsx"), { button: 2 });
    document.removeEventListener("click", outside);

    // Listeners above the row hear the click, as with the old table, so
    // other open menus close; the row's own handler does not.
    expect(outside).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("builds the items with getModel when the menu opens", () => {
    const getModel = vi.fn(() => [{ key: "share", label: "Share" }]);
    withMenu({ getModel });

    fireEvent.contextMenu(screen.getByText("Report.docx"), { button: 2 });

    expect(getModel).toHaveBeenCalled();
    expect(screen.getByText("Share")).toBeInTheDocument();
  });

  it("keeps the menu closed when onContextMenu prevents it", () => {
    const onOpen = vi.fn();
    renderTable({
      columns: [...BASE_COLUMNS, contextMenuColumn()],
      getRowProps: () => ({
        contextMenu: { options, onOpen },
        onContextMenu: (event) => event.preventDefault(),
      }),
    });

    fireEvent.contextMenu(screen.getByText("Report.docx"), { button: 2 });

    expect(onOpen).not.toHaveBeenCalled();
    expect(screen.queryByText("Rename")).toBeNull();
  });

  it("has no menu when the table has no menu column", () => {
    const onOpen = vi.fn();
    renderTable({
      getRowProps: () => ({ contextMenu: { options, onOpen } }),
    });

    fireEvent.contextMenu(screen.getByText("Report.docx"), { button: 2 });

    expect(onOpen).not.toHaveBeenCalled();
    expect(screen.queryByText("Rename")).toBeNull();
  });

  it("shares the settings column with withContextMenu", () => {
    renderTable({
      columns: [
        ...BASE_COLUMNS,
        settingsColumn({ title: "Columns", withContextMenu: true }),
      ],
      getRowProps: () => ({ contextMenu: { options } }),
    });

    expect(
      screen
        .getAllByRole("columnheader")
        .map((cell) => cell.getAttribute("data-column-id")),
    ).toEqual(["Name", "Author", "Settings"]);
    expect(
      within(rows()[0]).getByTestId("data-table-context-menu-button"),
    ).toBeInTheDocument();
  });

  it("gives the menu button the test id either column is asked for", () => {
    const { unmount } = renderTable({
      columns: [
        ...BASE_COLUMNS,
        settingsColumn({
          withContextMenu: true,
          contextMenuButtonTestId: "context-menu-button",
        }),
      ],
      getRowProps: () => ({ contextMenu: { options } }),
    });
    expect(
      within(rows()[0]).getByTestId("context-menu-button"),
    ).toBeInTheDocument();
    unmount();

    renderTable({
      columns: [
        ...BASE_COLUMNS,
        contextMenuColumn({ contextMenuButtonTestId: "row-menu" }),
      ],
      getRowProps: () => ({ contextMenu: { options } }),
    });
    expect(within(rows()[0]).getByTestId("row-menu")).toBeInTheDocument();
  });

  it("disables the settings button with disabled", () => {
    renderTable({
      columns: [
        { ...BASE_COLUMNS[0] },
        { ...BASE_COLUMNS[1], hideable: true },
        settingsColumn({ title: "Columns", disabled: true }),
      ],
      onColumnVisibilityChange: () => {},
    });

    expect(screen.getByRole("button", { name: "Columns" })).toBeDisabled();
  });
});
