import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { settingsColumn } from "./columns/settingsColumn";
import { DataTable } from "./DataTable";
import type { DataTableColumn, DataTableProps } from "./DataTable.types";
import { createMemoryWidths } from "./layout/storage";

type Row = { id: number };

// Name + Author + Modified + Size need 210 + 3 * 110 = 540 px, plus 68 px of
// menu and 24 px of settings: 632 px.
const REQUIRED = 632;

const makeColumns = (
  overrides: Partial<Record<string, Partial<DataTableColumn<Row>>>> = {},
): DataTableColumn<Row>[] =>
  [
    { id: "Name", title: "Name", width: { type: "fill" }, cell: () => "n" },
    {
      id: "Author",
      title: "Author",
      width: { type: "flex" },
      hideable: true,
      sortKey: "author",
      cell: () => "a",
    },
    {
      id: "Modified",
      title: "Modified",
      width: { type: "flex" },
      hideable: true,
      cell: () => "m",
    },
    {
      id: "Size",
      title: "Size",
      width: { type: "flex" },
      hideable: true,
      cell: () => "s",
    },
    {
      id: "Menu",
      title: "",
      width: { type: "fixed", size: 68 },
      cell: () => "...",
    },
    settingsColumn<Row>({ title: "Columns" }),
  ].map((column) => ({
    ...column,
    ...overrides[column.id],
  })) as DataTableColumn<Row>[];

let width = 1092;
let observers: Array<() => void> = [];

const resizeTo = (next: number) => {
  width = next;
  act(() => observers.forEach((notify) => notify()));
};

beforeEach(() => {
  width = 1092;
  observers = [];
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    () =>
      ({
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: width,
        bottom: 400,
        width,
        height: 400,
        toJSON: () => ({}),
      }) as DOMRect,
  );
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    callback(0);
    return 0;
  });
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: () => void) {
        observers.push(callback);
      }

      observe() {}

      disconnect() {}
    },
  );
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const renderTable = (props: Partial<DataTableProps<Row>> = {}) => {
  const all: DataTableProps<Row> = {
    columns: makeColumns(),
    rows: [{ id: 1 }, { id: 2 }],
    getRowKey: (row) => row.id,
    ...props,
  };
  const view = render(<DataTable {...all} />);

  return {
    rerenderWith: (next: Partial<DataTableProps<Row>>) =>
      view.rerender(<DataTable {...all} {...next} />),
  };
};

const headerIds = () =>
  within(screen.getByTestId("data-table-header"))
    .getAllByRole("columnheader")
    .map((cell) => cell.getAttribute("data-column-id"));

const rowIds = () =>
  screen.getAllByTestId("data-table-row").map((row) =>
    within(row)
      .getAllByRole("cell")
      .map((cell) => cell.getAttribute("data-column-id")),
  );

const grid = () =>
  screen.getByTestId("data-table").style.getPropertyValue("--data-table-grid");

const settingsButton = () => screen.getByRole("button", { name: "Columns" });

describe("DataTable column settings", () => {
  it("offers the hideable columns, ticked when visible", async () => {
    renderTable({
      columns: makeColumns({ Modified: { visible: false } }),
      onColumnVisibilityChange: vi.fn(),
    });

    await userEvent.click(settingsButton());

    expect(settingsButton()).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByTestId("data-table-settings-Author"),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("data-table-settings-Name"),
    ).not.toBeInTheDocument();

    const checkbox = (id: string) =>
      within(screen.getByTestId(`data-table-settings-${id}`)).getByRole(
        "checkbox",
      );
    expect(checkbox("Author")).toBeChecked();
    expect(checkbox("Modified")).not.toBeChecked();
  });

  it("reports a tick and an untick, and hides nothing itself", async () => {
    const onColumnVisibilityChange = vi.fn();
    renderTable({
      columns: makeColumns({ Modified: { visible: false } }),
      onColumnVisibilityChange,
    });

    const item = (id: string) =>
      within(screen.getByTestId(`data-table-settings-${id}`)).getByRole(
        "checkbox",
      );

    await userEvent.click(settingsButton());
    await userEvent.click(item("Author"));
    await userEvent.click(item("Modified"));

    expect(onColumnVisibilityChange.mock.calls).toEqual([
      ["Author", false],
      ["Modified", true],
    ]);
    expect(headerIds()).toContain("Author");
  });

  it("names a column by settingsLabel when its title is not text", async () => {
    renderTable({
      columns: makeColumns({
        Size: { title: <b>Size</b>, settingsLabel: "File size" },
      }),
      onColumnVisibilityChange: vi.fn(),
    });

    await userEvent.click(settingsButton());
    expect(screen.getByText("File size")).toBeInTheDocument();
  });

  it("keeps the last visible flexible column from being unticked", async () => {
    const columns: DataTableColumn<Row>[] = [
      {
        id: "A",
        title: "A",
        width: { type: "flex" },
        hideable: true,
        cell: () => "a",
      },
      {
        id: "B",
        title: "B",
        width: { type: "flex" },
        hideable: true,
        visible: false,
        cell: () => "b",
      },
      settingsColumn<Row>({ title: "Columns" }),
    ];
    renderTable({ columns, onColumnVisibilityChange: vi.fn() });

    await userEvent.click(settingsButton());
    expect(
      within(screen.getByTestId("data-table-settings-A")).getByRole("checkbox"),
    ).toBeDisabled();
    expect(
      within(screen.getByTestId("data-table-settings-B")).getByRole("checkbox"),
    ).not.toBeDisabled();
  });

  it("is disabled without onColumnVisibilityChange", () => {
    renderTable();

    expect(settingsButton()).toBeDisabled();
  });

  it("closes on Escape and gives the focus back to the button", async () => {
    renderTable({ onColumnVisibilityChange: vi.fn() });

    await userEvent.click(settingsButton());
    fireEvent.keyDown(
      within(screen.getByTestId("data-table-settings-Author")).getByRole(
        "checkbox",
      ),
      { key: "Escape" },
    );

    expect(settingsButton()).toHaveAttribute("aria-expanded", "false");
    expect(settingsButton()).toHaveFocus();
  });
});

describe("DataTable compact mode", () => {
  it("renders only the fill and fixed columns once the minimums do not fit", () => {
    width = REQUIRED - 1;
    const onCompactChange = vi.fn();
    renderTable({ onCompactChange, onColumnVisibilityChange: vi.fn() });

    const expected = ["Name", "Menu", "Settings"];
    expect(headerIds()).toEqual(expected);
    expect(rowIds()).toEqual([expected, expected]);
    expect(grid()).toBe("minmax(0px, 1fr) 68px 24px");
    expect(onCompactChange).toHaveBeenCalledTimes(1);
    expect(onCompactChange).toHaveBeenCalledWith(true);
  });

  it("still fits at exactly the minimums", () => {
    width = REQUIRED;
    const onCompactChange = vi.fn();
    renderTable({ onCompactChange });

    expect(headerIds()).toHaveLength(6);
    expect(onCompactChange).not.toHaveBeenCalled();
  });

  it("disables the settings and the resize handles", () => {
    width = 500;
    renderTable({ onColumnVisibilityChange: vi.fn() });

    expect(settingsButton()).toBeDisabled();
    expect(screen.queryAllByRole("separator")).toHaveLength(0);
  });

  it("follows the container both ways and brings the proportions back", () => {
    const onCompactChange = vi.fn();
    renderTable({
      onCompactChange,
      widthStorage: createMemoryWidths({
        Name: 0.5,
        Author: 0.2,
        Modified: 0.2,
        Size: 0.1,
      }),
    });
    const wide = grid();
    expect(wide).toContain("minmax(210px, 50fr)");

    resizeTo(600);
    expect(grid()).toBe("minmax(0px, 1fr) 68px 24px");
    expect(onCompactChange).toHaveBeenLastCalledWith(true);

    resizeTo(1400);
    expect(grid()).toBe(wide);
    expect(onCompactChange).toHaveBeenLastCalledWith(false);
    expect(onCompactChange).toHaveBeenCalledTimes(2);
  });

  it("is never compact in a collapsed container", () => {
    width = 0;
    const onCompactChange = vi.fn();
    renderTable({ onCompactChange });

    expect(headerIds()).toHaveLength(6);
    expect(onCompactChange).not.toHaveBeenCalled();
  });

  it("takes a column turned on while compact into account at once", () => {
    width = 700;
    const onCompactChange = vi.fn();
    const { rerenderWith } = renderTable({
      columns: makeColumns({ Size: { visible: false } }),
      onCompactChange,
    });
    // 210 + 2 * 110 + 92 = 522 fits in 700.
    expect(headerIds()).toContain("Author");

    rerenderWith({
      columns: makeColumns({ Size: { visible: true } }),
      onCompactChange,
    });
    // 632 still fits in 700.
    expect(headerIds()).toContain("Size");

    width = 600;
    rerenderWith({ columns: makeColumns(), onCompactChange });
    expect(headerIds()).toContain("Size");

    resizeTo(600);
    expect(headerIds()).toEqual(["Name", "Menu", "Settings"]);
  });
});

describe("DataTable visibility and storage", () => {
  it("stores the shares after a column is hidden or shown", () => {
    const storage = createMemoryWidths({
      Name: 0.4,
      Author: 0.2,
      Modified: 0.2,
      Size: 0.2,
    });
    const save = vi.spyOn(storage, "save");
    const { rerenderWith } = renderTable({ widthStorage: storage });
    expect(save).not.toHaveBeenCalled();

    rerenderWith({ columns: makeColumns({ Modified: { visible: false } }) });
    expect(save).toHaveBeenCalledTimes(1);
    expect(save.mock.calls[0][0].Author).toBeCloseTo(0.4, 9);
    expect(save.mock.calls[0][0]).not.toHaveProperty("Modified");

    rerenderWith({ columns: makeColumns() });
    expect(save).toHaveBeenCalledTimes(2);
    expect(save.mock.calls[1][0]).toHaveProperty("Modified");
  });

  it("turns a hidden column on when the sort moves to it", () => {
    const onColumnVisibilityChange = vi.fn();
    const columns = makeColumns({ Author: { visible: false } });
    const { rerenderWith } = renderTable({
      columns,
      onColumnVisibilityChange,
      sort: { key: "title", desc: false },
    });
    expect(onColumnVisibilityChange).not.toHaveBeenCalled();

    rerenderWith({ sort: { key: "author", desc: false } });
    expect(onColumnVisibilityChange).toHaveBeenCalledWith("Author", true);
  });

  it("does not turn on a hidden column that is not hideable", () => {
    const onColumnVisibilityChange = vi.fn();
    const { rerenderWith } = renderTable({
      columns: makeColumns({ Author: { visible: false, hideable: false } }),
      onColumnVisibilityChange,
    });

    rerenderWith({ sort: { key: "author", desc: true } });
    expect(onColumnVisibilityChange).not.toHaveBeenCalled();
  });
});
