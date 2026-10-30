import { useCallback, useMemo, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

import {
  DataTable,
  type DataTableColumn,
  type DataTableSort,
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
    cell: (row) => row.size,
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
  const widthStorage = useMemo(() => createMemoryWidths(), []);
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
