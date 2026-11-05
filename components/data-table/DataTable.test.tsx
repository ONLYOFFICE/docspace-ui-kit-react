import { createRef } from "react";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DataTable } from "./DataTable";
import type { DataTableColumn, DataTableProps } from "./DataTable.types";
import { createMemoryWidths } from "./layout/storage";

type File = { id: number; name: string; author: string; size: string };

const FILES: File[] = [
  { id: 1, name: "Report.docx", author: "Ann", size: "12 KB" },
  { id: 2, name: "Budget.xlsx", author: "Bob", size: "40 KB" },
];

const makeColumns = (
  overrides: Partial<Record<string, Partial<DataTableColumn<File>>>> = {},
): DataTableColumn<File>[] =>
  [
    {
      id: "Name",
      title: "Name",
      width: { type: "fill" },
      sortKey: "title",
      cell: (row: File) => row.name,
    },
    {
      id: "Author",
      title: "Author",
      width: { type: "flex" },
      sortKey: "author",
      cell: (row: File) => row.author,
    },
    {
      id: "Modified",
      title: "Modified",
      width: { type: "flex" },
      cell: () => "today",
    },
    {
      id: "Size",
      title: "Size",
      width: { type: "flex" },
      cell: (row: File) => row.size,
    },
    {
      id: "Menu",
      title: "",
      width: { type: "fixed", size: 68 },
      cell: () => "...",
    },
  ].map((column) => ({
    ...column,
    ...overrides[column.id],
  })) as DataTableColumn<File>[];

const renderTable = (props: Partial<DataTableProps<File>> = {}) => {
  const all: DataTableProps<File> = {
    columns: makeColumns(),
    rows: FILES,
    getRowKey: (row) => row.id,
    ...props,
  };
  const view = render(<DataTable {...all} />);

  return {
    ...view,
    rerenderWith: (next: Partial<DataTableProps<File>>) =>
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

describe("DataTable", () => {
  describe("one column set for the header and the rows", () => {
    it("renders the same columns in the same order everywhere", () => {
      renderTable();

      const expected = ["Name", "Author", "Modified", "Size", "Menu"];
      expect(headerIds()).toEqual(expected);
      expect(rowIds()).toEqual([expected, expected]);
    });

    it("renders nothing at all for a hidden column", () => {
      renderTable({ columns: makeColumns({ Author: { visible: false } }) });

      const expected = ["Name", "Modified", "Size", "Menu"];
      expect(headerIds()).toEqual(expected);
      expect(rowIds()).toEqual([expected, expected]);
      expect(screen.queryByText("Ann")).not.toBeInTheDocument();
    });

    it("emits one grid track per rendered column", () => {
      renderTable({ columns: makeColumns({ Modified: { visible: false } }) });

      const tracks = grid().split(/ (?![^(]*\))/);
      expect(tracks).toHaveLength(headerIds().length);
    });

    it("stays in step when a column is hidden later", () => {
      const { rerenderWith } = renderTable();
      rerenderWith({ columns: makeColumns({ Modified: { visible: false } }) });

      const expected = ["Name", "Author", "Size", "Menu"];
      expect(headerIds()).toEqual(expected);
      expect(rowIds()).toEqual([expected, expected]);
    });
  });

  describe("widths", () => {
    it("sets the grid once, on the table, and nowhere else", () => {
      renderTable();

      expect(grid()).not.toBe("");
      screen.getAllByTestId("data-table-row").forEach((row) => {
        expect(row.getAttribute("style")).toBeNull();
      });
      expect(
        screen.getByTestId("data-table-header").querySelector("[style]"),
      ).toBeNull();
    });

    it("starts from 40/60 without a storage", () => {
      renderTable();

      expect(grid()).toBe(
        "minmax(210px, 40fr) minmax(110px, 20fr) minmax(110px, 20fr) minmax(110px, 20fr) 68px",
      );
    });

    it("restores the stored shares", () => {
      renderTable({
        widthStorage: createMemoryWidths({
          Name: 0.5,
          Author: 0.25,
          Modified: 0.15,
          Size: 0.1,
        }),
      });

      expect(grid()).toBe(
        "minmax(210px, 50fr) minmax(110px, 25fr) minmax(110px, 15fr) minmax(110px, 10fr) 68px",
      );
    });

    it("falls back to 40/60 for another table's record", () => {
      renderTable({
        widthStorage: createMemoryWidths({ Title: 0.5, Members: 0.5 }),
      });

      expect(grid()).toContain("minmax(210px, 40fr)");
    });

    it("gives a hidden column's share to its left neighbour", () => {
      const { rerenderWith } = renderTable();
      rerenderWith({ columns: makeColumns({ Modified: { visible: false } }) });

      expect(grid()).toBe(
        "minmax(210px, 40fr) minmax(110px, 40fr) minmax(110px, 20fr) 68px",
      );
    });

    it("never writes to the storage just by rendering", () => {
      const storage = createMemoryWidths({ Name: 0.6, Author: 0.4 });
      const save = vi.spyOn(storage, "save");
      const { rerenderWith } = renderTable({ widthStorage: storage });
      rerenderWith({ rows: [...FILES] });

      expect(save).not.toHaveBeenCalled();
    });

    it("restores again when the storage id changes, not when the adapter object does", () => {
      const files = createMemoryWidths({
        Name: 0.5,
        Author: 0.25,
        Modified: 0.15,
        Size: 0.1,
      });
      const { rerenderWith } = renderTable({ widthStorage: files });

      const sameRecord = { ...files, load: vi.fn(files.load) };
      rerenderWith({ widthStorage: sameRecord });
      expect(sameRecord.load).not.toHaveBeenCalled();

      rerenderWith({
        widthStorage: createMemoryWidths({
          Name: 0.7,
          Author: 0.1,
          Modified: 0.1,
          Size: 0.1,
        }),
      });
      expect(grid()).toContain("minmax(210px, 70fr)");
    });
  });

  describe("sorting", () => {
    it("makes a header with a sortKey a button that reports its key", async () => {
      const onSortChange = vi.fn();
      renderTable({ onSortChange });

      await userEvent.click(screen.getByRole("button", { name: "Author" }));
      expect(onSortChange).toHaveBeenCalledWith("author");
    });

    it("sorts from the keyboard", async () => {
      const onSortChange = vi.fn();
      renderTable({ onSortChange });

      screen.getByRole("button", { name: "Name" }).focus();
      await userEvent.keyboard("{Enter}");
      expect(onSortChange).toHaveBeenCalledWith("title");
    });

    it("marks only the sorted column with aria-sort", () => {
      const { rerenderWith } = renderTable({
        onSortChange: vi.fn(),
        sort: { key: "author", desc: true },
      });

      const sorted = () =>
        screen
          .getAllByRole("columnheader")
          .filter((cell) => cell.hasAttribute("aria-sort"))
          .map((cell) => [
            cell.getAttribute("data-column-id"),
            cell.getAttribute("aria-sort"),
          ]);

      expect(sorted()).toEqual([["Author", "descending"]]);

      rerenderWith({ sort: { key: "title", desc: false } });
      expect(sorted()).toEqual([["Name", "ascending"]]);
    });

    it("renders no buttons without onSortChange", () => {
      renderTable();

      expect(screen.queryAllByRole("button")).toHaveLength(0);
    });

    it("shows the sort of a column that is not sortable, without a button", () => {
      renderTable({
        onSortChange: vi.fn(),
        sort: { key: "author", desc: false },
        columns: makeColumns({ Author: { sortable: false } }),
      });

      expect(
        screen.queryByRole("button", { name: "Author" }),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId("data-table-header-Author")).toHaveAttribute(
        "aria-sort",
        "ascending",
      );
      expect(screen.getByRole("button", { name: "Name" })).toBeInTheDocument();
    });
  });

  describe("renderers", () => {
    it("tells a cell its index and whether its column is the last one with data", () => {
      const seen: string[] = [];
      const columns = makeColumns({
        Modified: {
          cell: (_, { index, isLast }) => {
            seen.push(`Modified ${index} ${isLast}`);
            return null;
          },
        },
        Size: {
          cell: (_, { index, isLast }) => {
            seen.push(`Size ${index} ${isLast}`);
            return null;
          },
        },
      });
      const { rerenderWith } = renderTable({ columns });

      // The fixed Menu column after Size does not count.
      expect(seen).toEqual([
        "Modified 0 false",
        "Size 0 true",
        "Modified 1 false",
        "Size 1 true",
      ]);

      seen.length = 0;
      rerenderWith({
        columns: columns.map((c) =>
          c.id === "Size" ? { ...c, visible: false } : c,
        ),
      });
      expect(seen).toEqual(["Modified 0 true", "Modified 1 true"]);
    });

    it("renders a custom header and hands its element to headerRef", () => {
      const headerRef = createRef<HTMLDivElement>();
      renderTable({
        columns: makeColumns({
          Size: { header: () => <span>custom size</span>, headerRef },
        }),
      });

      expect(screen.getByText("custom size")).toBeInTheDocument();
      expect(headerRef.current).toBe(
        screen.getByTestId("data-table-header-Size"),
      );
    });
  });

  describe("the element", () => {
    it("is a table with its rows grouped, and passes its own props through", () => {
      const ref = createRef<HTMLDivElement>();
      renderTable({
        ref,
        id: "table-container",
        className: "files-table",
        headerId: "table-container_caption-header",
        ariaLabel: "Files",
        testId: "files",
      });

      const table = screen.getByRole("table", { name: "Files" });
      expect(table).toBe(ref.current);
      expect(table).toHaveAttribute("id", "table-container");
      expect(table).toHaveClass("files-table", "table-container");
      expect(table).toHaveAttribute("data-testid", "files");
      expect(within(table).getAllByRole("rowgroup")).toHaveLength(2);
      expect(
        document.getElementById("table-container_caption-header"),
      ).toHaveClass("table-container_header");
    });

    it("keeps the class names the client's selectors rely on", () => {
      renderTable();

      const row = screen.getAllByTestId("data-table-row")[0];
      expect(row).toHaveClass("table-container_row");
      within(row)
        .getAllByRole("cell")
        .forEach((cell) => expect(cell).toHaveClass("table-container_cell"));
    });

    it("gives the body and a column's cells the test ids asked for", () => {
      renderTable({
        bodyTestId: "table-body",
        columns: makeColumns({
          Name: { cellTestId: (row, index) => `name-${index}-${row.id}` },
        }),
      });

      const body = screen.getByTestId("table-body");
      expect(within(body).getByTestId("name-1-2")).toHaveTextContent(
        "Budget.xlsx",
      );
      // A column without one has no test id on its cells.
      expect(
        within(screen.getAllByTestId("data-table-row")[0])
          .getAllByRole("cell")
          .filter((cell) => cell.hasAttribute("data-testid")),
      ).toHaveLength(1);
    });

    it("calls its body data-table-body by default", () => {
      renderTable();

      expect(screen.getByTestId("data-table-body")).toHaveAttribute(
        "role",
        "rowgroup",
      );
    });

    it("calls its header data-table-header, or what headerTestId says", () => {
      const { unmount } = renderTable();
      expect(screen.getByTestId("data-table-header")).toHaveClass(
        "table-container_header",
      );
      unmount();

      renderTable({ headerTestId: "table-header" });
      expect(screen.getByTestId("table-header")).toHaveClass(
        "table-container_header",
      );
    });
  });

  describe("the header line", () => {
    it("is marked stuck once rows scroll under the sticky header", () => {
      vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
        cb(0);
        return 0;
      });
      let offsetTop = 0;
      vi.spyOn(HTMLElement.prototype, "offsetTop", "get").mockImplementation(
        () => offsetTop,
      );
      render(
        <div data-testid="scroller" style={{ overflowY: "auto" }}>
          <DataTable
            columns={makeColumns()}
            rows={FILES}
            getRowKey={(row) => row.id}
          />
        </div>,
      );
      const header = screen.getByTestId("data-table-header");
      const scroller = screen.getByTestId("scroller");
      expect(header).not.toHaveClass("isStuck");

      offsetTop = 120;
      act(() => {
        scroller.dispatchEvent(new Event("scroll"));
      });
      expect(header).toHaveClass("isStuck");

      offsetTop = 0;
      act(() => {
        scroller.dispatchEvent(new Event("scroll"));
      });
      expect(header).not.toHaveClass("isStuck");
      vi.restoreAllMocks();
    });
  });
});
