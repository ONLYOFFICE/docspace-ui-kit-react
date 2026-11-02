import { useCallback, useMemo, useRef, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

import {
  DataTable,
  type DataTableApi,
  type DataTableColumn,
  DataTableRow,
  type DataTableRowState,
  type DataTableSort,
  createLocalStorageWidths,
  createMemoryWidths,
  settingsColumn,
} from ".";

type FileRow = {
  id: number;
  name: string;
  author: string;
  modified: string;
  size: string;
  type: string;
};

const AUTHORS = ["Ann Smith", "Bob Lee", "Chen Wei", "Dana Cruz"];
const TYPES = ["Document", "Spreadsheet", "Presentation", "PDF form"];

const ROWS: FileRow[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `Quarterly report ${String(i + 1).padStart(2, "0")}.docx`,
  author: AUTHORS[i % AUTHORS.length],
  modified: `2026-10-${String((i % 28) + 1).padStart(2, "0")}`,
  size: `${(i * 37) % 900} KB`,
  type: TYPES[i % TYPES.length],
}));

const COLUMNS: DataTableColumn<FileRow>[] = [
  {
    id: "Name",
    title: "Name",
    width: { type: "fill" },
    sortKey: "title",
    cell: (row) => row.name,
  },
  {
    id: "Author",
    title: "Author",
    width: { type: "flex" },
    sortKey: "author",
    hideable: true,
    cell: (row) => row.author,
  },
  {
    id: "Modified",
    title: "Modified",
    width: { type: "flex" },
    sortKey: "modified",
    hideable: true,
    cell: (row) => row.modified,
  },
  {
    id: "Size",
    title: "Size",
    width: { type: "flex" },
    sortKey: "size",
    hideable: true,
    // <bdi>, as user data in a table should be: in right-to-left "0 KB" stays
    // "0 KB" instead of turning into "KB 0".
    cell: (row) => <bdi>{row.size}</bdi>,
  },
  {
    id: "Type",
    title: "Type",
    width: { type: "flex" },
    hideable: true,
    cell: (row) => row.type,
  },
  settingsColumn<FileRow>({ title: "Choose columns" }),
];

/** Holds which columns are hidden, as a consumer's store would. */
const useColumnVisibility = (columns: DataTableColumn<FileRow>[]) => {
  const [hidden, setHidden] = useState<string[]>(() =>
    columns.filter((c) => c.visible === false).map((c) => c.id),
  );

  const visibleColumns = useMemo(
    () => columns.map((c) => ({ ...c, visible: !hidden.includes(c.id) })),
    [columns, hidden],
  );

  const onColumnVisibilityChange = useCallback(
    (id: string, visible: boolean) =>
      setHidden((prev) =>
        visible ? prev.filter((x) => x !== id) : [...prev, id],
      ),
    [],
  );

  return { columns: visibleColumns, onColumnVisibilityChange };
};

// An instantiation of the generic component, so that the story's args are
// typed for these rows.
const FilesTable = DataTable<FileRow>;

const meta = {
  title: "UI/Data display/DataTable",
  component: FilesTable,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    columns: {
      control: false,
      description:
        "Every column, in order, with how it is sized and how its cells render",
    },
    rows: { control: false, description: "The rows, in display order" },
    getRowKey: { control: false, description: "Stable key of a row" },
    sort: {
      control: "object",
      description: "Current sort, highlighted in the header",
    },
    widthStorage: {
      control: false,
      description: "Where the column widths are remembered",
    },
  },
  args: {
    columns: COLUMNS,
    rows: ROWS,
    getRowKey: (row: FileRow) => row.id,
    ariaLabel: "Files",
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "0 20px", maxWidth: "100%" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FilesTable>;

type Story = StoryObj<typeof meta>;

export default meta;

const SortingTemplate = (args: React.ComponentProps<typeof FilesTable>) => {
  const [sort, setSort] = useState<DataTableSort>({
    key: "title",
    desc: false,
  });

  const rows = useMemo(() => {
    const field: Record<string, keyof FileRow> = {
      title: "name",
      author: "author",
      modified: "modified",
      size: "id",
    };
    const key = field[sort.key];
    const sorted = [...args.rows].sort((a, b) =>
      String(a[key]).localeCompare(String(b[key]), undefined, {
        numeric: true,
      }),
    );
    return sort.desc ? sorted.reverse() : sorted;
  }, [args.rows, sort]);

  const visibility = useColumnVisibility(args.columns);

  return (
    <FilesTable
      {...args}
      {...visibility}
      rows={rows}
      sort={sort}
      onSortChange={(key) =>
        setSort((prev) => ({
          key,
          desc: prev.key === key ? !prev.desc : false,
        }))
      }
    />
  );
};

export const Default: Story = {
  render: (args) => <SortingTemplate {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "Name fills 40 % and the other columns share 60 %. A click on a sortable header sorts by it, a second click reverses the order; the table only reports the click, the story sorts the rows. The button at the end of the header shows and hides columns: a hidden column gives its width to its left neighbour, a shown one takes its share from the widest.",
      },
      source: {
        code: `const [sort, setSort] = useState<DataTableSort>({ key: "title", desc: false });
const [hidden, setHidden] = useState<string[]>([]);

const columns = useMemo(
  () => [
    ...allColumns.map((c) => ({ ...c, visible: !hidden.includes(c.id) })),
    settingsColumn({ title: "Choose columns" }),
  ],
  [hidden],
);

<DataTable
  columns={columns}
  rows={rows}
  getRowKey={(row) => row.id}
  sort={sort}
  onSortChange={(key) =>
    setSort((prev) => ({ key, desc: prev.key === key ? !prev.desc : false }))
  }
  onColumnVisibilityChange={(id, visible) =>
    setHidden((prev) => (visible ? prev.filter((x) => x !== id) : [...prev, id]))
  }
/>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = (id: string) =>
      canvas.queryByTestId(`data-table-header-${id}`);

    await expect(header("Name")).toHaveAttribute("aria-sort", "ascending");

    await userEvent.click(canvas.getByRole("button", { name: "Name" }));
    await waitFor(() =>
      expect(header("Name")).toHaveAttribute("aria-sort", "descending"),
    );

    await userEvent.click(canvas.getByRole("button", { name: "Author" }));
    await waitFor(() =>
      expect(header("Author")).toHaveAttribute("aria-sort", "ascending"),
    );
    await expect(header("Name")).not.toHaveAttribute("aria-sort");

    // Hide Type through the settings menu, then show it again.
    const typeItem = () =>
      within(screen.getByTestId("data-table-settings-Type")).getByRole(
        "checkbox",
      );
    await userEvent.click(
      canvas.getByRole("button", { name: "Choose columns" }),
    );
    await userEvent.click(typeItem());
    await waitFor(() => expect(header("Type")).toBeNull());
    await userEvent.click(typeItem());
    await waitFor(() => expect(header("Type")).not.toBeNull());
    await userEvent.keyboard("{Escape}");
  },
};

const NarrowTemplate = (args: React.ComponentProps<typeof FilesTable>) => {
  const visibility = useColumnVisibility(args.columns);

  return (
    <div style={{ width: 560 }}>
      <FilesTable {...args} {...visibility} />
    </div>
  );
};

export const Compact: Story = {
  render: (args) => <NarrowTemplate {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "560 px cannot hold Name at 210 px and four columns at 110 px, so only Name and the fixed columns render, and the settings button is disabled: the design's rule for a small screen or an open side panel. The columns come back, in their old proportions, as soon as they fit.",
      },
      source: {
        code: `<div style={{ width: 560 }}>
  <DataTable
    columns={columns}
    rows={rows}
    getRowKey={(row) => row.id}
    onCompactChange={setCompact}
  />
</div>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() =>
      expect(
        canvas
          .getAllByRole("columnheader")
          .map((cell) => cell.getAttribute("data-column-id")),
      ).toEqual(["Name", "Settings"]),
    );
    await expect(
      canvas.getByRole("button", { name: "Choose columns" }),
    ).toBeDisabled();
  },
};

const InfoPanelTemplate = (args: React.ComponentProps<typeof FilesTable>) => {
  const visibility = useColumnVisibility(args.columns);
  // A real record, so that what the panel does not write can be checked.
  const widthStorage = useMemo(
    () => createLocalStorageWidths("storybook-data-table-info-panel"),
    [],
  );
  const [panel, setPanel] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setPanel((open) => !open)}>
        {panel ? "Close the info panel" : "Open the info panel"}
      </button>
      <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <FilesTable {...args} {...visibility} widthStorage={widthStorage} />
        </div>
        {panel ? (
          <aside
            style={{ width: 400, flex: "none", border: "1px dashed gray" }}
            data-testid="info-panel"
          >
            Info panel
          </aside>
        ) : null}
      </div>
    </>
  );
};

export const WithInfoPanel: Story = {
  render: (args) => <InfoPanelTemplate {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "Opening a side panel only narrows the table. The proportions are shares of the table, so they stay as they were and nothing is stored; the old table kept a second record for this case. If the narrower table cannot fit every column at its minimum, it turns compact until the panel closes.",
      },
      source: {
        code: `<div style={{ display: "flex" }}>
  <div style={{ flex: 1, minWidth: 0 }}>
    <DataTable columns={columns} rows={rows} getRowKey={(row) => row.id} />
  </div>
  {infoPanelVisible ? <InfoPanel /> : null}
</div>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByTestId("data-table");
    const grid = () => table.style.getPropertyValue("--data-table-grid");
    const before = grid();
    const wide = table.getBoundingClientRect().width;

    await userEvent.click(
      canvas.getByRole("button", { name: "Open the info panel" }),
    );
    await waitFor(() =>
      expect(table.getBoundingClientRect().width).toBeLessThan(wide),
    );

    await userEvent.click(
      canvas.getByRole("button", { name: "Close the info panel" }),
    );
    await waitFor(() => expect(grid()).toBe(before));
  },
};

const savedWidths = createMemoryWidths({
  Name: 0.3,
  Author: 0.3,
  Modified: 0.15,
  Size: 0.1,
  Type: 0.15,
});

export const SavedWidths: Story = {
  args: {
    widthStorage: savedWidths,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Widths restored from a stored record, as shares of the table rather than pixels, so they look the same at any window width. The record here lives in memory; `createLocalStorageWidths(key)` keeps it between visits.",
      },
      source: {
        code: `const widthStorage = useMemo(
  () => createLocalStorageWidths(\`filesColumnsWidths=\${userId}\`),
  [userId],
);

<DataTable columns={columns} rows={rows} getRowKey={(row) => row.id} widthStorage={widthStorage} />`,
      },
    },
  },
};

const RememberedWidthsTemplate = (
  args: React.ComponentProps<typeof FilesTable>,
) => {
  const files = useMemo(
    () => createLocalStorageWidths("storybook-data-table-files"),
    [],
  );
  const trash = useMemo(
    () => createLocalStorageWidths("storybook-data-table-trash"),
    [],
  );

  return (
    <div style={{ display: "grid", gap: 32 }}>
      <FilesTable
        {...args}
        rows={args.rows.slice(0, 4)}
        widthStorage={files}
        ariaLabel="Files"
        testId="data-table-files"
      />
      <FilesTable
        {...args}
        rows={args.rows.slice(4, 8)}
        widthStorage={trash}
        ariaLabel="Trash"
        testId="data-table-trash"
      />
    </div>
  );
};

export const RememberedWidths: Story = {
  render: (args) => <RememberedWidthsTemplate {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "Two tables on one page, each remembering its widths in `localStorage` under its own key. Resize one and reload: each comes back as it was, and neither reads the other's record. A window of another width shows the same proportions.",
      },
      source: {
        code: `const files = useMemo(() => createLocalStorageWidths(\`filesColumnsWidths=\${userId}\`), [userId]);
const trash = useMemo(() => createLocalStorageWidths(\`trashColumnsWidths=\${userId}\`), [userId]);

<DataTable columns={columns} rows={files} getRowKey={(row) => row.id} widthStorage={files} />
<DataTable columns={columns} rows={trash} getRowKey={(row) => row.id} widthStorage={trash} />`,
      },
    },
  },
  // No play function: anything it did would be stored, and the story is about
  // what a visit finds. __tests__/data-table/data-table-storage.spec.ts drives
  // it across reloads and windows.
};

const ResizingTemplate = (args: React.ComponentProps<typeof FilesTable>) => {
  const widthStorage = useMemo(() => createMemoryWidths(), []);

  return <FilesTable {...args} widthStorage={widthStorage} />;
};

export const Resizing: Story = {
  render: (args) => <ResizingTemplate {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "Drag the edge of a header: the column grows and the columns on the side the pointer moves to shrink, nearest first, down to 110 px (210 px for Name), so the table never gets wider. A focused edge moves with the arrow keys, 10 px a press or 50 px with Shift; a double click resets to 40/60. The widths are stored when the pointer is released.",
      },
      source: {
        code: `<DataTable
  columns={columns}
  rows={rows}
  getRowKey={(row) => row.id}
  widthStorage={widthStorage}
/>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const edge = canvas.getByTestId("data-table-resize-Name");
    const before = Number(edge.getAttribute("aria-valuenow"));

    edge.focus();
    await userEvent.keyboard("{Shift>}{ArrowRight}{/Shift}");

    // ArrowRight grows the column in left-to-right and shrinks it in
    // right-to-left; either way the share moves.
    await waitFor(() =>
      expect(Number(edge.getAttribute("aria-valuenow"))).not.toBe(before),
    );

    await userEvent.dblClick(edge);
    await waitFor(() =>
      expect(Number(edge.getAttribute("aria-valuenow"))).toBe(before),
    );
  },
};

const MENU_OPTIONS = [
  { key: "open", label: "Open" },
  { key: "rename", label: "Rename" },
  { key: "delete", label: "Delete" },
];

const ROW_COLUMNS: DataTableColumn<FileRow>[] = [
  ...COLUMNS.slice(0, -1),
  settingsColumn<FileRow>({ title: "Choose columns", withContextMenu: true }),
];

const RowsTemplate = (args: React.ComponentProps<typeof FilesTable>) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [menuRow, setMenuRow] = useState<number | null>(null);
  const visibility = useColumnVisibility(args.columns);

  const getRowProps = useCallback(
    (row: FileRow): DataTableRowState => ({
      checked: selected.includes(row.id),
      active: menuRow === row.id,
      onClick: () =>
        setSelected((prev) =>
          prev.includes(row.id)
            ? prev.filter((id) => id !== row.id)
            : [...prev, row.id],
        ),
      contextMenu: {
        options: MENU_OPTIONS,
        title: "Actions",
        onOpen: () => setMenuRow(row.id),
        onClose: () => setMenuRow(null),
      },
    }),
    [selected, menuRow],
  );

  return <FilesTable {...args} {...visibility} getRowProps={getRowProps} />;
};

export const RowsAndMenus: Story = {
  args: { columns: ROW_COLUMNS, rows: ROWS.slice(0, 8) },
  render: (args) => <RowsTemplate {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "`getRowProps` gives each row its state: a click selects it, and every row has a menu, opened by the button at its end or a right-click anywhere in it. The button shares the settings column, as in the old table; `contextMenuColumn()` gives it a column of its own in a table without settings.",
      },
      source: {
        code: `const getRowProps = useCallback(
  (row: FileRow): DataTableRowState => ({
    checked: selected.includes(row.id),
    active: menuRow === row.id,
    onClick: () => toggle(row.id),
    contextMenu: {
      options,
      title: "Actions",
      onOpen: () => setMenuRow(row.id),
      onClose: () => setMenuRow(null),
    },
  }),
  [selected, menuRow],
);

<DataTable
  columns={[...columns, settingsColumn({ title: "Choose columns", withContextMenu: true })]}
  rows={rows}
  getRowKey={(row) => row.id}
  getRowProps={getRowProps}
/>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const row = () => canvas.getAllByTestId("data-table-row")[1];

    await userEvent.click(within(row()).getByText(ROWS[1].name));
    await waitFor(() => expect(row()).toHaveClass("checked"));

    await userEvent.pointer({
      keys: "[MouseRight]",
      target: within(row()).getByText(ROWS[1].author),
    });
    await waitFor(() => expect(screen.getByText("Rename")).toBeInTheDocument());
    await userEvent.keyboard("{Escape}");
  },
};

type IndexedRow = FileRow & { index: number };

const INDEXED_ROWS: IndexedRow[] = ROWS.slice(0, 8).map((row, i) => ({
  ...row,
  index: i + 1,
}));

const indexColumn = (
  move?: (id: number, by: number) => void,
): DataTableColumn<IndexedRow> => ({
  id: "Index",
  title: "#",
  width: { type: "fixed", size: move ? 88 : 48 },
  cell: (row) =>
    move ? (
      <span style={{ display: "flex", gap: 4 }}>
        <button
          type="button"
          aria-label={`Move ${row.name} up`}
          onClick={() => move(row.id, -1)}
        >
          ↑
        </button>
        <button
          type="button"
          aria-label={`Move ${row.name} down`}
          onClick={() => move(row.id, 1)}
        >
          ↓
        </button>
      </span>
    ) : (
      row.index
    ),
});

const IndexedTable = DataTable<IndexedRow>;

const IndexEditingTemplate = () => {
  const [rows, setRows] = useState(INDEXED_ROWS);
  const [editing, setEditing] = useState(false);

  const move = useCallback((id: number, by: number) => {
    setRows((prev) => {
      const from = prev.findIndex((row) => row.id === id);
      const to = from + by;
      if (to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      [next[from], next[to]] = [next[to], next[from]];
      return next.map((row, i) => ({ ...row, index: i + 1 }));
    });
  }, []);

  // Reordering is another set of columns, not a mode the table knows: the
  // index column grows its buttons, and the settings lose the row menu.
  const columns = useMemo<DataTableColumn<IndexedRow>[]>(
    () => [
      indexColumn(editing ? move : undefined),
      ...(COLUMNS.slice(0, -1) as DataTableColumn<IndexedRow>[]),
      settingsColumn<IndexedRow>({
        title: "Choose columns",
        withContextMenu: !editing,
        disabled: editing,
      }),
    ],
    [editing, move],
  );

  const getRowProps = useCallback(
    (): DataTableRowState => ({
      contextMenu: { options: MENU_OPTIONS, title: "Actions" },
    }),
    [],
  );

  return (
    <>
      <button type="button" onClick={() => setEditing((value) => !value)}>
        {editing ? "Done" : "Reorder"}
      </button>
      <div style={{ marginTop: 16 }}>
        <IndexedTable
          columns={columns}
          rows={rows}
          getRowKey={(row) => row.id}
          getRowProps={getRowProps}
          renderRow={({ row, index, rowProps }) => (
            <DataTableRow
              row={row}
              index={index}
              {...rowProps}
              style={editing ? { cursor: "grab" } : undefined}
            />
          )}
          ariaLabel="Files"
        />
      </div>
    </>
  );
};

export const IndexEditing: Story = {
  render: () => <IndexEditingTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "A virtual data room numbers its files. Reordering them is a different set of columns rather than a mode of the table: a wider index column with buttons, the settings disabled and no row menu. `renderRow` changes the cursor of every row while it lasts.",
      },
      source: {
        code: `const columns = useMemo(
  () => [
    indexColumn(editing ? move : undefined),
    ...fileColumns,
    settingsColumn({ title: "Choose columns", withContextMenu: !editing, disabled: editing }),
  ],
  [editing],
);

<DataTable
  columns={columns}
  rows={rows}
  getRowKey={(row) => row.id}
  renderRow={({ row, index, rowProps }) => (
    <DataTableRow
      row={row}
      index={index}
      {...rowProps}
      style={editing ? { cursor: "grab" } : undefined}
    />
  )}
/>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const menuButtons = () =>
      canvas.queryAllByTestId("data-table-context-menu-button");

    await expect(menuButtons()).toHaveLength(INDEXED_ROWS.length);

    await userEvent.click(canvas.getByRole("button", { name: "Reorder" }));
    await waitFor(() => expect(menuButtons()).toHaveLength(0));
    await expect(
      canvas.getByRole("button", { name: "Choose columns" }),
    ).toBeDisabled();

    const second = INDEXED_ROWS[1].name;
    await userEvent.click(
      canvas.getByRole("button", { name: `Move ${second} up` }),
    );
    await waitFor(() =>
      expect(
        within(canvas.getAllByTestId("data-table-row")[0]).getByText(second),
      ).toBeInTheDocument(),
    );

    await userEvent.click(canvas.getByRole("button", { name: "Done" }));
    await waitFor(() =>
      expect(menuButtons()).toHaveLength(INDEXED_ROWS.length),
    );
  },
};

const MANY_ROWS: FileRow[] = Array.from({ length: 10_000 }, (_, i) => ({
  id: i + 1,
  name: `Scan ${String(i + 1).padStart(5, "0")}.pdf`,
  author: AUTHORS[i % AUTHORS.length],
  modified: `2026-10-${String((i % 28) + 1).padStart(2, "0")}`,
  size: `${(i * 37) % 900} KB`,
  type: TYPES[i % TYPES.length],
}));

const VirtualizedTemplate = (args: React.ComponentProps<typeof FilesTable>) => {
  const visibility = useColumnVisibility(args.columns);
  const [scroller, setScroller] = useState<HTMLDivElement | null>(null);
  const apiRef = useRef<DataTableApi>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => apiRef.current?.scrollToIndex(4999, { align: "start" })}
      >
        Go to row 5000
      </button>
      <div
        ref={setScroller}
        data-testid="scroller"
        style={{ height: 520, overflowY: "auto", marginTop: 16 }}
      >
        <div style={{ height: 120, padding: 16, boxSizing: "border-box" }}>
          A filter bar above the table, inside the same scroller
        </div>
        <FilesTable
          {...args}
          {...visibility}
          virtualize={{ scrollElement: scroller }}
          apiRef={apiRef}
        />
      </div>
    </>
  );
};

export const Virtualized: Story = {
  args: { rows: MANY_ROWS },
  render: (args) => <VirtualizedTemplate {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "10 000 rows, of which only those in and near the view are in the DOM. The scroller is named by `virtualize.scrollElement`; the content above the table scrolls with it, and the header sticks to its top. `apiRef.scrollToIndex` brings a row into view.",
      },
      source: {
        code: `const apiRef = useRef<DataTableApi>(null);

<div ref={setScroller} style={{ height: 520, overflowY: "auto" }}>
  <Filter />
  <DataTable
    columns={columns}
    rows={rows}
    getRowKey={(row) => row.id}
    virtualize={{ scrollElement: scroller }}
    apiRef={apiRef}
  />
</div>

apiRef.current?.scrollToIndex(4999, { align: "start" });`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const rendered = () => canvas.getAllByTestId("data-table-row");

    await waitFor(() => expect(rendered().length).toBeGreaterThan(5));
    await expect(rendered().length).toBeLessThan(40);

    await userEvent.click(
      canvas.getByRole("button", { name: "Go to row 5000" }),
    );
    await waitFor(() =>
      expect(canvas.getByText("Scan 05000.pdf")).toBeInTheDocument(),
    );
    await expect(rendered().length).toBeLessThan(40);

    const scroller = canvas.getByTestId("scroller");
    scroller.scrollTop = scroller.scrollHeight;
    await waitFor(() =>
      expect(canvas.getByText("Scan 10000.pdf")).toBeInTheDocument(),
    );
  },
};

const PAGE_SIZE = 100;
const TOTAL = 1000;

const InfiniteScrollTemplate = (
  args: React.ComponentProps<typeof FilesTable>,
) => {
  const visibility = useColumnVisibility(args.columns);
  const [scroller, setScroller] = useState<HTMLDivElement | null>(null);
  const [rows, setRows] = useState(() => MANY_ROWS.slice(0, PAGE_SIZE));
  const [requests, setRequests] = useState(0);

  // A server that answers in 600 ms.
  const onLoadMore = useCallback(async () => {
    setRequests((count) => count + 1);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setRows((prev) => MANY_ROWS.slice(0, prev.length + PAGE_SIZE));
  }, []);

  return (
    <>
      <p data-testid="load-status">
        {rows.length} of {TOTAL} loaded, {requests} requests
      </p>
      <div
        ref={setScroller}
        data-testid="scroller"
        style={{ height: 520, overflowY: "auto" }}
      >
        <FilesTable
          {...args}
          {...visibility}
          rows={rows}
          virtualize={{ scrollElement: scroller }}
          loadMore={{ hasMore: rows.length < TOTAL, onLoadMore }}
        />
      </div>
    </>
  );
};

export const InfiniteScroll: Story = {
  render: (args) => <InfiniteScrollTemplate {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "Pages of 100 rows from a server that takes 600 ms, 1 000 in all. Scrolling within 15 rows of the end asks for the next page, once; two skeleton rows stand at the end while it loads. Fling the list and the rows give way to skeletons until it slows down.",
      },
      source: {
        code: `<DataTable
  columns={columns}
  rows={files}
  getRowKey={(file) => file.id}
  virtualize={{ scrollElement: scroller }}
  loadMore={{ hasMore: files.length < total, onLoadMore: fetchMoreFiles }}
/>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const scroller = canvas.getByTestId("scroller");
    const status = canvas.getByTestId("load-status");

    await waitFor(() =>
      expect(canvas.getAllByTestId("data-table-row").length).toBeGreaterThan(5),
    );
    await expect(status).toHaveTextContent("100 of 1000 loaded, 0 requests");

    scroller.scrollTop = scroller.scrollHeight;
    await waitFor(() =>
      expect(
        canvas.getAllByTestId("data-table-skeleton-row").length,
      ).toBeGreaterThan(0),
    );
    await waitFor(
      () => expect(status).toHaveTextContent("200 of 1000 loaded, 1 requests"),
      { timeout: 3000 },
    );
  },
};

export const HiddenColumns: Story = {
  args: {
    columns: COLUMNS.map((column) =>
      column.id === "Modified" || column.id === "Type"
        ? { ...column, visible: false }
        : column,
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Columns with `visible: false` render nothing, in the header or the rows, so the header and the rows always have the same cells.",
      },
      source: {
        code: `const columns = allColumns.map((column) =>
  hidden.includes(column.id) ? { ...column, visible: false } : column,
);`,
      },
    },
  },
};

/** The brightest channel of a computed colour, 0-255. */
const brightness = (color: string) =>
  Math.max(...(color.match(/\d+/g) ?? ["0"]).slice(0, 3).map(Number));

export const DarkTheme: Story = {
  args: { columns: ROW_COLUMNS, rows: ROWS.slice(0, 8) },
  render: (args) => <RowsTemplate {...args} />,
  decorators: [
    (Story) => (
      <div
        className="dark"
        style={{ background: "#333333", color: "#ffffff", padding: 16 }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          "The table inside an element with the `dark` class: the header, the borders, the resize edges and a selected row take the dark palette. Click a row to see its tint. The settings and row menus open in a portal on the page, so they follow the page's theme rather than this wrapper: switch the toolbar to dark to see them dark as well.",
      },
      source: {
        code: `<div className="dark">
  <DataTable columns={columns} rows={rows} getRowKey={(row) => row.id} getRowProps={getRowProps} />
</div>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = canvas.getByTestId("data-table-header");

    await expect(brightness(getComputedStyle(header).backgroundColor)).toBe(51);
    await expect(
      brightness(getComputedStyle(canvas.getByText("Author")).color),
    ).toBeGreaterThan(100);

    const row = canvas.getAllByTestId("data-table-row")[0];
    await userEvent.click(within(row).getByText(ROWS[0].name));
    await waitFor(() => expect(row).toHaveClass("checked"));
    await expect(
      brightness(
        getComputedStyle(row.querySelector('[role="cell"]') as Element)
          .backgroundColor,
      ),
    ).toBeLessThan(80);
  },
};

const RightToLeftTemplate = (args: React.ComponentProps<typeof FilesTable>) => {
  const widthStorage = useMemo(() => createMemoryWidths(), []);
  return (
    <div dir="rtl">
      <RowsTemplate {...args} widthStorage={widthStorage} />
    </div>
  );
};

export const RightToLeft: Story = {
  args: { columns: ROW_COLUMNS, rows: ROWS.slice(0, 8) },
  render: (args) => <RightToLeftTemplate {...args} />,
  globals: { direction: "rtl" },
  parameters: {
    docs: {
      // Framed: an inline RTL story would flip the whole Docs page.
      story: { inline: false, height: "520px" },
      description: {
        story:
          "The table in a right-to-left layout: Name starts on the right, each resize edge sits on the left of its header, and the settings and row menus are on the left end. Dragging an edge follows the pointer; ArrowLeft on Name's edge widens it. The wrapper carries `dir=\"rtl\"` for the layout; the resize direction comes from the theme's `interfaceDirection` (the Direction toolbar).",
      },
      source: {
        code: `<div dir="rtl">
  <DataTable columns={columns} rows={rows} getRowKey={(row) => row.id} />
</div>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const box = (id: string) =>
      (
        canvas.getByTestId(`data-table-header-${id}`) as HTMLElement
      ).getBoundingClientRect();

    // Name is the rightmost column, the settings the leftmost.
    await expect(box("Name").left).toBeGreaterThan(box("Author").left);
    await expect(box("Settings").left).toBeLessThan(box("Type").left);

    // The edge is on the left of the header; ArrowLeft moves it left,
    // widening Name.
    const edge = canvas.getByTestId("data-table-resize-Name");
    await expect(edge.getBoundingClientRect().left).toBeLessThan(
      box("Name").left + 20,
    );
    const before = Number(edge.getAttribute("aria-valuenow"));
    edge.focus();
    await userEvent.keyboard("{Shift>}{ArrowLeft}{/Shift}");
    await waitFor(() =>
      expect(Number(edge.getAttribute("aria-valuenow"))).toBeGreaterThan(
        before,
      ),
    );
    // Leave the table at rest, without the edge's focus ring.
    edge.blur();
  },
};

export const CssCustomization: Story = {
  args: { columns: ROW_COLUMNS, rows: ROWS.slice(0, 8) },
  render: (args) => (
    <div
      style={
        {
          "--data-table-border-color": "#c5cae9",
          "--data-table-header-text-color": "#3949ab",
          "--data-table-header-text-hover-color": "#1a237e",
          "--data-table-resize-color": "#9fa8da",
          "--data-table-row-selected-background": "#e8eaf6",
        } as React.CSSProperties
      }
    >
      <RowsTemplate {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "An indigo table: the borders, the header text and its hover, the resize edges and the selected row's tint set on a wrapper. Click a row to see the tint.",
      },
      source: {
        code: `<div style={{
  "--data-table-border-color": "#c5cae9",
  "--data-table-header-text-color": "#3949ab",
  "--data-table-header-text-hover-color": "#1a237e",
  "--data-table-resize-color": "#9fa8da",
  "--data-table-row-selected-background": "#e8eaf6",
}}>
  <DataTable columns={columns} rows={rows} getRowKey={(row) => row.id} />
</div>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Author")).toHaveStyle({
      color: "rgb(57, 73, 171)",
    });
    await expect(canvas.getByTestId("data-table-header")).toHaveStyle({
      borderBottomColor: "rgb(197, 202, 233)",
    });

    const row = canvas.getAllByTestId("data-table-row")[0];
    await userEvent.click(within(row).getByText(ROWS[0].name));
    await waitFor(() =>
      expect(row.querySelector('[role="cell"]')).toHaveStyle({
        backgroundColor: "rgb(232, 234, 246)",
      }),
    );
  },
};
