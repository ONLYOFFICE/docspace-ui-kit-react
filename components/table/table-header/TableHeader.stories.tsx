import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fireEvent, fn, screen, waitFor, within } from "storybook/test";
import type { TableHeaderProps } from "../Table.types";

import { useRef } from "react";
import { TableHeader } from ".";
import { SortByFieldName } from "../../../enums";

const COLUMN_STORAGE_NAME = "storybook-table-header-column-storage";
const COLUMN_INFO_PANEL_STORAGE_NAME =
  "storybook-table-header-info-panel-storage";

const onColumnSort = fn();
const onColumnToggle = fn();

// Each cell is tagged with its column's key.
const headerCells = (root: HTMLElement) =>
  within(root).getAllByTestId(/^column-/);

const TableHeaderWrapper = (args: Omit<TableHeaderProps, "containerRef">) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      id="table-container"
      ref={containerRef}
      style={{ marginInline: "40px", position: "relative" }}
    >
      <TableHeader {...args} containerRef={containerRef} />
    </div>
  );
};

const meta = {
  title: "UI/Table/TableHeader",
  component: TableHeader,
  parameters: {
    docs: {
      description: {
        component: `TableHeader is the row of column titles at the top of a table; it also decides the width of every column and writes them onto the table's grid.

The Table README describes it in full.`,
      },
    },
  },
  argTypes: {
    columns: {
      control: false,
      description:
        "The columns in order: title, sort field, callbacks and the flags that shape each one",
    },
    containerRef: {
      control: false,
      description:
        "Ref of the TableContainer, whose grid columns the header writes",
    },
    columnStorageName: {
      control: "text",
      description:
        "`localStorage` key the column widths are saved under; each table on a site needs its own",
    },
    columnInfoPanelStorageName: {
      control: "text",
      description:
        "`localStorage` key used instead while an info panel narrows the table",
    },
    sortBy: {
      control: "select",
      options: [
        SortByFieldName.Name,
        SortByFieldName.Type,
        SortByFieldName.Tags,
        SortByFieldName.Author,
      ],
      description:
        "Field the table is sorted by; the column with the same `sortBy` keeps its arrow on screen",
    },
    sorted: {
      control: "boolean",
      description: "Direction of the sort; turning it off turns the arrow over",
    },
    sortingVisible: {
      control: "boolean",
      description:
        "Shows the sort arrows and lets a click on a title sort the table",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    showSettings: {
      control: "boolean",
      description: "Shows the cog at the end that lists the columns to hide",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    settingsTitle: {
      control: "text",
      description: "Hover tooltip of the cog",
    },
    infoPanelVisible: {
      control: "boolean",
      description:
        "Saves and restores the widths under `columnInfoPanelStorageName`, for the narrower table next to an open info panel",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isIndexEditingMode: {
      control: "boolean",
      description:
        "Stops columns being resized and greys the cog out while rows are reordered",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withoutWideColumn: {
      control: "boolean",
      description:
        "Shares the width equally between the columns instead of giving the `default` column 40%",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    resetColumnsSize: {
      control: "boolean",
      description: "Discards the saved widths and lays the columns out afresh",
    },
    isLengthenHeader: {
      control: "boolean",
      description:
        "Draws the line under the header across its full width instead of stopping short of the edges",
    },
    useReactWindow: {
      control: "boolean",
      description:
        "Set when the body is virtualised, so the header rewrites the widths of the rows it renders",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    sectionWidth: {
      control: "number",
      description:
        "Width of the section around the table in pixels; required, but the header reads its container instead",
    },
    setHideColumns: {
      control: false,
      description:
        "Called with `true` when the columns stop fitting and with `false` when they fit again",
    },
    tagRef: {
      control: false,
      description:
        "Ref attached to the header cell of the column that asks for it with `withTagRef`",
    },
    onClick: {
      control: false,
      description: "Accepted, but the header never calls it",
    },
    style: {
      control: false,
      description: "Accepted, but never applied to the header",
    },
  },
  tags: ["!autodocs"],
  decorators: [
    (Story) => {
      return (
        <div>
          <div style={{ marginBottom: "20px", fontSize: "14px" }}>
            <p>
              <strong>Note:</strong> TableHeader component for displaying table
              headers with support for column resizing, sorting, and column
              visibility settings.
            </p>
          </div>
          <Story />
        </div>
      );
    },
  ],
} satisfies Meta<typeof TableHeader>;

type Story = StoryObj<ComponentProps<typeof TableHeader>>;

export default meta;

export const Default: Story = {
  render: (args) => <TableHeaderWrapper {...args} />,
  args: {
    containerRef: { current: null },
    columns: [
      {
        key: "Name",
        title: "Name",
        resizable: true,
        enable: true,
        default: true,
        sortBy: SortByFieldName.Name,
        minWidth: 210,
        onChange: onColumnToggle,
        onClick: onColumnSort,
      },
      {
        key: "Type",
        title: "Type",
        enable: true,
        resizable: true,
        sortBy: SortByFieldName.Type,
        onChange: onColumnToggle,
        onClick: onColumnSort,
      },
      {
        key: "Tags",
        title: "Tags",
        enable: true,
        resizable: true,
        sortBy: SortByFieldName.Tags,
        withTagRef: true,
        onChange: onColumnToggle,
        onClick: onColumnSort,
      },
      {
        key: "Owner",
        title: "Owner",
        enable: true,
        resizable: true,
        sortBy: SortByFieldName.Author,
        onChange: onColumnToggle,
        onClick: onColumnSort,
      },
    ],
    columnStorageName: COLUMN_STORAGE_NAME,
    columnInfoPanelStorageName: COLUMN_INFO_PANEL_STORAGE_NAME,
    sectionWidth: 1000,
    sortBy: SortByFieldName.Name,
    sorted: true,
    useReactWindow: false,
    showSettings: true,
    sortingVisible: true,
    isLengthenHeader: false,
    resetColumnsSize: false,
    infoPanelVisible: false,
    settingsTitle: "Column Settings",
    isIndexEditingMode: false,
    withoutWideColumn: false,
  },
  beforeEach: () => {
    onColumnSort.mockClear();
    onColumnToggle.mockClear();
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const cells = headerCells(canvasElement);
    await expect(cells).toHaveLength(4);
    // The column sorted by is highlighted.
    await expect(cells[0].className).toMatch(/isActive/);
    await expect(cells[1].className).not.toMatch(/isActive/);

    // The header writes the column widths onto the table's grid.
    const container = canvasElement.querySelector(
      "#table-container",
    ) as HTMLElement;
    await waitFor(() =>
      expect(container.style.gridTemplateColumns).not.toBe(""),
    );

    await userEvent.click(within(cells[1]).getByText("Type"));
    await expect(onColumnSort).toHaveBeenCalledWith(
      SortByFieldName.Type,
      expect.anything(),
    );

    // Dragging a column's edge resizes it.
    const before = container.style.gridTemplateColumns;
    const handle = within(cells[0]).getByTestId("resize-handle");
    const x = handle.getBoundingClientRect().left;
    fireEvent.mouseDown(handle, { clientX: x });
    fireEvent.mouseMove(window, { clientX: x + 60 });
    fireEvent.mouseUp(window, { clientX: x + 60 });
    await waitFor(() =>
      expect(container.style.gridTemplateColumns).not.toBe(before),
    );

    // The cog lists the columns that can be hidden.
    await userEvent.click(canvas.getByTestId("table-settings-button"));
    const owner = await waitFor(() => {
      const row = screen.getByTestId("table_settings_Owner");
      expect(row).toBeVisible();
      return row;
    });
    await userEvent.click(within(owner).getByText("Owner"));
    await expect(onColumnToggle).toHaveBeenCalledWith("Owner");
  },
  parameters: {
    docs: {
      description: {
        story:
          "The header of a four-column list, sorted by Name: drag the handles between the titles to resize the columns, hover a title to see its arrow, and click the cog to choose columns. Change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<TableHeader
  containerRef={ref}
  columns={columns}
  columnStorageName="my-columns"
  columnInfoPanelStorageName="my-info-panel"
  sectionWidth={1000}
  sortBy={SortByFieldName.Name}
  sorted
  showSettings
  sortingVisible
/>`,
      },
    },
  },
};

export const WithoutSettings: Story = {
  render: (args) => <TableHeaderWrapper {...args} />,
  args: {
    ...Default.args,
    showSettings: false,
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByTestId("table-settings-button")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The same header without the cog, for a table whose columns are fixed (`showSettings` off).",
      },
      source: {
        code: `<TableHeader
  containerRef={ref}
  columns={columns}
  columnStorageName="my-columns"
  columnInfoPanelStorageName="my-info-panel"
  sectionWidth={1000}
  sortBy={SortByFieldName.Name}
  sorted
  showSettings={false}
  sortingVisible
/>`,
      },
    },
  },
};

export const WithoutSorting: Story = {
  render: (args) => <TableHeaderWrapper {...args} />,
  args: {
    ...Default.args,
    sortingVisible: false,
  },
  beforeEach: () => {
    onColumnSort.mockClear();
  },
  play: async ({ canvasElement, userEvent }) => {
    const [name] = headerCells(canvasElement);
    await expect(within(name).queryByTestId("sort-icon")).toBeNull();
    await userEvent.click(within(name).getByText("Name"));
    await expect(onColumnSort).not.toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The same header for a list in a fixed order: no arrows, and a click on a title does nothing (`sortingVisible` off).",
      },
      source: {
        code: `<TableHeader
  containerRef={ref}
  columns={columns}
  columnStorageName="my-columns"
  columnInfoPanelStorageName="my-info-panel"
  sectionWidth={1000}
  sortBy={SortByFieldName.Name}
  sorted
  showSettings
  sortingVisible={false}
/>`,
      },
    },
  },
};

export const RightToLeft: Story = {
  render: (args) => (
    <div dir="rtl">
      <TableHeaderWrapper {...args} />
    </div>
  ),
  args: {
    ...Default.args,
    columnStorageName: "storybook-table-header-rtl-column-storage",
    columnInfoPanelStorageName: "storybook-table-header-rtl-info-panel-storage",
  },
  globals: { direction: "rtl" },
  play: async ({ canvasElement }) => {
    // The first column starts at the right edge.
    const [name, type] = headerCells(canvasElement);
    await waitFor(() =>
      expect(name.getBoundingClientRect().left).toBeGreaterThan(
        type.getBoundingClientRect().left,
      ),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "In a right-to-left interface the first column starts at the right edge and the cog sits at the left; dragging a handle to the left widens the column on its right.",
      },
      source: {
        code: `<div dir="rtl">
  <TableHeader
    containerRef={ref}
    columns={columns}
    columnStorageName="my-columns"
    columnInfoPanelStorageName="my-info-panel"
    sectionWidth={1000}
    sortBy={SortByFieldName.Name}
    sorted
  />
</div>`,
      },
    },
  },
};
