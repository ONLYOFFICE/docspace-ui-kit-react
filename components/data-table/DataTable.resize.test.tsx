import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InterfaceDirectionProvider } from "../../context/InterfaceDirectionContext";

import { DataTable } from "./DataTable";
import type { DataTableColumn, DataTableProps } from "./DataTable.types";
import { createMemoryWidths } from "./layout/storage";

type Row = { id: number };

// 1068 px of table: a 68 px menu column leaves 1000 px for the flexible ones,
// so 40/20/20/20 is 400/200/200/200 px.
const WIDTH = 1068;

const COLUMNS: DataTableColumn<Row>[] = [
  { id: "Name", title: "Name", width: { type: "fill" }, cell: () => "n" },
  { id: "Author", title: "Author", width: { type: "flex" }, cell: () => "a" },
  {
    id: "Modified",
    title: "Modified",
    width: { type: "flex" },
    cell: () => "m",
  },
  { id: "Size", title: "Size", width: { type: "flex" }, cell: () => "s" },
  {
    id: "Menu",
    title: "",
    width: { type: "fixed", size: 68 },
    cell: () => "...",
  },
];

const DEFAULT_GRID =
  "minmax(210px, 40fr) minmax(110px, 20fr) minmax(110px, 20fr) minmax(110px, 20fr) 68px";

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: WIDTH,
    bottom: 400,
    width: WIDTH,
    height: 400,
    toJSON: () => ({}),
  });
  // Run animation frames at once, so a pointer move draws immediately.
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    callback(0);
    return 0;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

const renderTable = (
  props: Partial<DataTableProps<Row>> = {},
  direction: "ltr" | "rtl" = "ltr",
) => {
  const storage = createMemoryWidths();
  const save = vi.spyOn(storage, "save");
  const clear = vi.spyOn(storage, "clear");

  render(
    <InterfaceDirectionProvider interfaceDirection={direction}>
      <DataTable
        columns={COLUMNS}
        rows={[{ id: 1 }]}
        getRowKey={(row) => row.id}
        widthStorage={storage}
        {...props}
      />
    </InterfaceDirectionProvider>,
  );

  return { storage, save, clear };
};

const grid = () =>
  screen.getByTestId("data-table").style.getPropertyValue("--data-table-grid");

const handle = (columnId: string) =>
  screen.getByTestId(`data-table-resize-${columnId}`);

const drag = (columnId: string, from: number, to: number) => {
  const target = handle(columnId);
  fireEvent.pointerDown(target, { pointerId: 1, button: 0, clientX: from });
  fireEvent.pointerMove(target, { pointerId: 1, clientX: to });
  fireEvent.pointerUp(target, { pointerId: 1, clientX: to });
};

describe("DataTable resizing", () => {
  it("draws a handle between resizable columns only", () => {
    renderTable();

    expect(
      screen
        .getAllByRole("separator")
        .map((el) => el.getAttribute("data-testid")),
    ).toEqual([
      "data-table-resize-Name",
      "data-table-resize-Author",
      "data-table-resize-Modified",
    ]);
  });

  it("reports the column's share as its value", () => {
    renderTable();

    expect(handle("Name")).toHaveAttribute("aria-valuenow", "40");
    expect(handle("Name")).toHaveAttribute("aria-valuetext", "40%");
    expect(handle("Name")).toHaveAccessibleName("Name");
  });

  it("drags an edge: the column grows and the next ones shrink, cascading at 110 px", () => {
    const { save } = renderTable();
    drag("Name", 500, 600);

    // Name 500, Author 200 -> 110, Modified 200 -> 190, Size 200.
    expect(grid()).toBe(
      "minmax(210px, 50fr) minmax(110px, 11fr) minmax(110px, 19fr) minmax(110px, 20fr) 68px",
    );
    expect(save).toHaveBeenCalledTimes(1);
    expect(save.mock.calls[0][0].Name).toBeCloseTo(0.5, 9);
    expect(save.mock.calls[0][0].Size).toBeCloseTo(0.2, 9);
    expect(handle("Name")).toHaveAttribute("aria-valuenow", "50");
  });

  it("updates the grid while dragging and stores only when the pointer is released", () => {
    const { save } = renderTable();
    const target = handle("Name");

    fireEvent.pointerDown(target, { pointerId: 1, button: 0, clientX: 500 });
    fireEvent.pointerMove(target, { pointerId: 1, clientX: 550 });

    expect(grid()).toContain("minmax(210px, 45fr)");
    expect(screen.getByTestId("data-table")).toHaveClass("isResizing");
    expect(save).not.toHaveBeenCalled();

    fireEvent.pointerUp(target, { pointerId: 1, clientX: 550 });
    expect(save).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("data-table")).not.toHaveClass("isResizing");
  });

  it("follows every move of a drag, not just the first", () => {
    renderTable();
    const target = handle("Name");

    fireEvent.pointerDown(target, { pointerId: 1, button: 0, clientX: 500 });
    fireEvent.pointerMove(target, { pointerId: 1, clientX: 520 });
    expect(grid()).toContain("minmax(210px, 42fr)");
    fireEvent.pointerMove(target, { pointerId: 1, clientX: 540 });
    expect(grid()).toContain("minmax(210px, 44fr)");
    fireEvent.pointerMove(target, { pointerId: 1, clientX: 560 });
    expect(grid()).toContain("minmax(210px, 46fr)");
    fireEvent.pointerUp(target, { pointerId: 1, clientX: 560 });
  });

  it("puts the grid back and stores nothing when the pointer is cancelled", () => {
    const { save } = renderTable();
    const target = handle("Name");

    fireEvent.pointerDown(target, { pointerId: 1, button: 0, clientX: 500 });
    fireEvent.pointerMove(target, { pointerId: 1, clientX: 650 });
    fireEvent.pointerCancel(target, { pointerId: 1 });

    expect(grid()).toBe(DEFAULT_GRID);
    expect(save).not.toHaveBeenCalled();
  });

  it("ignores another pointer and the right mouse button", () => {
    const { save } = renderTable();
    const target = handle("Name");

    fireEvent.pointerDown(target, { pointerId: 1, button: 2, clientX: 500 });
    fireEvent.pointerMove(target, { pointerId: 1, clientX: 650 });
    fireEvent.pointerUp(target, { pointerId: 1, clientX: 650 });
    expect(grid()).toBe(DEFAULT_GRID);

    fireEvent.pointerDown(target, { pointerId: 1, button: 0, clientX: 500 });
    fireEvent.pointerMove(target, { pointerId: 2, clientX: 650 });
    fireEvent.pointerUp(target, { pointerId: 2, clientX: 650 });
    expect(grid()).toBe(DEFAULT_GRID);
    expect(save).not.toHaveBeenCalled();
  });

  it("does not store a drag that moved nothing", () => {
    const { save } = renderTable();
    drag("Name", 500, 500);

    expect(save).not.toHaveBeenCalled();
  });

  it("mirrors the pointer in right-to-left", () => {
    renderTable({}, "rtl");
    // Moving left in RTL moves the edge forward, growing Name.
    drag("Name", 600, 500);

    expect(grid()).toContain("minmax(210px, 50fr)");
  });

  it("moves an edge by 10 px with the arrow keys, 50 px with Shift", () => {
    const { save } = renderTable();

    fireEvent.keyDown(handle("Name"), { key: "ArrowRight" });
    expect(grid()).toContain("minmax(210px, 41fr)");

    fireEvent.keyDown(handle("Name"), { key: "ArrowLeft", shiftKey: true });
    expect(grid()).toContain("minmax(210px, 36fr)");

    expect(save).toHaveBeenCalledTimes(2);
  });

  it("mirrors the arrow keys in right-to-left", () => {
    renderTable({}, "rtl");

    fireEvent.keyDown(handle("Name"), { key: "ArrowLeft" });
    expect(grid()).toContain("minmax(210px, 41fr)");
  });

  it("leaves other keys alone", () => {
    const { save } = renderTable();
    fireEvent.keyDown(handle("Name"), { key: "Enter" });

    expect(grid()).toBe(DEFAULT_GRID);
    expect(save).not.toHaveBeenCalled();
  });

  it("resets the layout and forgets the record on a double click", () => {
    const { clear } = renderTable();
    drag("Name", 500, 600);
    expect(grid()).not.toBe(DEFAULT_GRID);

    act(() => {
      fireEvent.doubleClick(handle("Author"));
    });

    expect(grid()).toBe(DEFAULT_GRID);
    expect(clear).toHaveBeenCalledTimes(1);
  });

  it("never sorts when an edge is pressed", () => {
    const onSortChange = vi.fn();
    renderTable({
      columns: COLUMNS.map((c) =>
        c.id === "Name" ? { ...c, sortKey: "title" } : c,
      ),
      onSortChange,
    });

    drag("Name", 500, 520);
    fireEvent.click(handle("Name"));

    expect(onSortChange).not.toHaveBeenCalled();
  });

  it("restores a stored drag on the next mount", () => {
    const { storage } = renderTable();
    drag("Name", 500, 600);
    const stored = storage.load();

    render(
      <DataTable
        columns={COLUMNS}
        rows={[{ id: 1 }]}
        getRowKey={(row) => row.id}
        widthStorage={createMemoryWidths(stored ?? undefined)}
        testId="second"
      />,
    );

    expect(
      screen.getByTestId("second").style.getPropertyValue("--data-table-grid"),
    ).toContain("minmax(210px, 50fr)");
  });
});
