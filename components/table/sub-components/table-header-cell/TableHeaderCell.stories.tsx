import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fireEvent, fn, within } from "storybook/test";

import { TableHeaderCell } from "./TableHeaderCell";
import { SortByFieldName } from "../../../../enums";

const meta = {
  title: "UI/Table/TableHeaderCell",
  component: TableHeaderCell,
  parameters: {
    docs: {
      description: {
        component: `TableHeaderCell is the title of one column in a TableHeader, with its sort arrow and the handle that resizes it.

The Table README describes it in full.`,
      },
    },
  },
  argTypes: {
    column: {
      control: false,
      description: "The column this cell renders.",
    },
    index: {
      control: "number",
      description:
        "Position of the column, which becomes the cell's `column_<index>` id.",
    },
    sortBy: {
      control: "select",
      options: [SortByFieldName.Name, SortByFieldName.Author],
      description:
        "Field the table is sorted by. The column with the same `sortBy` keeps its arrow shown.",
    },
    sorted: {
      control: "boolean",
      description:
        "Direction of the sort; turning it off turns the arrow over.",
    },
    sortingVisible: {
      control: "boolean",
      description:
        "Shows the sort arrow and lets the title and the arrow sort the table.",
    },
    resizable: {
      control: "boolean",
      description: "Draws the resize handle at the end of the cell.",
    },
    defaultSize: {
      control: "number",
      description:
        "Fixed width of the column, written to the cell for the header to read.",
    },
    testId: {
      control: "text",
      description: "Value of `data-testid` on the cell.",
      table: {
        defaultValue: { summary: "table-header-cell" },
      },
    },
    onMouseDown: {
      control: false,
      description: "Called when the resize handle is pressed.",
    },
    tagRef: {
      control: false,
      description:
        "Ref attached to this cell when the column asks for it with `withTagRef`.",
    },
  },

  decorators: [
    (Story) => {
      return (
        <div style={{ maxWidth: "300px" }}>
          <Story />
        </div>
      );
    },
  ],
} satisfies Meta<typeof TableHeaderCell>;

type Story = StoryObj<ComponentProps<typeof TableHeaderCell>>;

export default meta;

const onSortClick = fn();
const onResizeStart = fn();
const onSelectAll = fn();

const cellOf = (canvas: { getByTestId: (id: string) => HTMLElement }) =>
  canvas.getByTestId("table-header-cell");

export const Default: Story = {
  name: "Not sorted",
  render: (args) => <TableHeaderCell {...args} />,
  args: {
    column: {
      key: "name",
      title: "Name",
      enable: true,
      sortBy: SortByFieldName.Name,
      minWidth: 200,
      resizable: false,
      onClick: onSortClick,
    },
    index: 0,
    onMouseDown: onResizeStart,
    resizable: false,
    sortBy: SortByFieldName.Author,
    sorted: true,
    sortingVisible: true,
  },
  beforeEach: () => {
    onSortClick.mockClear();
    onResizeStart.mockClear();
    onSelectAll.mockClear();
  },
  play: async ({ canvas, userEvent }) => {
    const cell = cellOf(canvas);
    // Sorted by another column, so this one is not highlighted.
    await expect(cell.className).not.toMatch(/isActive/);
    await userEvent.click(within(cell).getByText("Name"));
    await expect(onSortClick).toHaveBeenCalledWith(
      SortByFieldName.Name,
      expect.anything(),
    );
    await userEvent.click(within(cell).getByTestId("sort-icon"));
    await expect(onSortClick).toHaveBeenCalledTimes(2);
    await expect(within(cell).queryByTestId("resize-handle")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The title of a column the table is not sorted by. Its arrow shows on hover or keyboard focus, and a click on the title sorts by the column.",
      },
      source: {
        code: `<TableHeaderCell
  column={{
    key: "name",
    title: "Name",
    enable: true,
    sortBy: SortByFieldName.Name,
    minWidth: 200,
    resizable: false,
    onClick: handleClick,
  }}
  index={0}
  sortBy={SortByFieldName.Author}
  sorted
  sortingVisible
/>`,
      },
    },
  },
};

export const Resizable: Story = {
  name: "With resize handle",
  render: (args) => <TableHeaderCell {...args} />,
  args: {
    ...Default.args,
    column: {
      ...Default.args?.column,
      key: "name",
      title: "Name",
      resizable: true,
    },
    resizable: true,
  },
  beforeEach: () => {
    onResizeStart.mockClear();
  },
  play: async ({ canvas }) => {
    const handle = within(cellOf(canvas)).getByTestId("resize-handle");
    await expect(handle).toHaveAttribute("data-column", "0");
    fireEvent.mouseDown(handle);
    await expect(onResizeStart).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The short bar at the end of the cell is the handle a user drags to widen the column (`resizable`). Here it only reports the press; TableHeader does the resizing.",
      },
      source: {
        code: `<TableHeaderCell
  column={{
    key: "name",
    title: "Name",
    enable: true,
    sortBy: SortByFieldName.Name,
    minWidth: 200,
    resizable: true,
    onClick: handleClick,
  }}
  index={0}
  sortBy={SortByFieldName.Author}
  sorted
  sortingVisible
  resizable
  onMouseDown={handleResize}
/>`,
      },
    },
  },
};

export const SortedByThisColumn: Story = {
  name: "Sorted by this column",
  render: (args) => <TableHeaderCell {...args} />,
  args: { ...Default.args, sortBy: SortByFieldName.Name },
  play: async ({ canvas }) => {
    await expect(cellOf(canvas).className).toMatch(/isActive/);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The column the table is sorted by keeps its arrow on screen without a hover (`sortBy` matches the column's). The user sees what the list is ordered by.",
      },
      source: {
        code: `<TableHeaderCell
  column={{
    key: "name",
    title: "Name",
    enable: true,
    sortBy: SortByFieldName.Name,
    minWidth: 200,
    resizable: false,
    onClick: handleClick,
  }}
  index={0}
  sortBy={SortByFieldName.Name}
  sorted
  sortingVisible
/>`,
      },
    },
  },
};

export const WithoutSorting: Story = {
  name: "Without sorting",
  render: (args) => (
    <div>
      <i style={{ marginBottom: 12 }}>No sorting icon on hover</i>
      <TableHeaderCell {...args} />
    </div>
  ),
  args: {
    ...Default.args,
    sortingVisible: false,
  },
  beforeEach: () => {
    onSortClick.mockClear();
  },
  play: async ({ canvas, userEvent }) => {
    const cell = cellOf(canvas);
    await expect(within(cell).queryByTestId("sort-icon")).toBeNull();
    await userEvent.click(within(cell).getByText("Name"));
    await expect(onSortClick).not.toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A column that cannot sort: no arrow on hover and clicks on the title do nothing, for a list whose order is fixed (`sortingVisible` off).",
      },
      source: {
        code: `<TableHeaderCell
  column={column}
  index={0}
  sortBy={SortByFieldName.Author}
  sorted
  sortingVisible={false}
/>`,
      },
    },
  },
};

export const WithUncheckedCheckbox: Story = {
  name: "Unticked checkbox hidden",
  render: (args) => (
    <div>
      <i style={{ marginBottom: 12 }}>Checkbox hidden if it is unchecked</i>
      <TableHeaderCell {...args} />
    </div>
  ),
  args: {
    ...Default.args,
    column: {
      key: "checkbox",
      title: "Select",
      enable: true,
      minWidth: 100,
      resizable: false,
      checkbox: {
        value: false,
        isIndeterminate: false,
        onChange: onSelectAll,
      },
    },
  },
  play: async ({ canvas }) => {
    // An unticked checkbox is not drawn at all.
    await expect(within(cellOf(canvas)).queryByRole("checkbox")).toBeNull();
    await expect(within(cellOf(canvas)).getByText("Select")).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A column with a select-all checkbox that nothing is ticked in yet shows only its title; the checkbox appears once a row is selected.",
      },
      source: {
        code: `<TableHeaderCell
  column={{
    key: "checkbox",
    title: "Select",
    enable: true,
    minWidth: 100,
    resizable: false,
    checkbox: { value: false, isIndeterminate: false, onChange: handleChange },
  }}
  index={0}
  sortBy={SortByFieldName.Author}
  sorted
  sortingVisible
/>`,
      },
    },
  },
};

export const WithCheckedCheckbox: Story = {
  name: "Ticked checkbox",
  render: (args) => <TableHeaderCell {...args} />,
  args: {
    ...Default.args,
    column: {
      key: "checkbox",
      title: "Select",
      enable: true,
      minWidth: 100,
      resizable: false,
      checkbox: {
        value: true,
        isIndeterminate: false,
        onChange: onSelectAll,
      },
    },
  },
  beforeEach: () => {
    onSelectAll.mockClear();
  },
  play: async ({ canvas, userEvent }) => {
    const checkbox = within(cellOf(canvas)).getByRole("checkbox");
    await expect(checkbox).toBeChecked();
    await userEvent.click(checkbox);
    await expect(onSelectAll).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The select-all checkbox before the title once every row is selected (`checkbox.value`); a click on it calls `checkbox.onChange`.",
      },
      source: {
        code: `<TableHeaderCell
  column={{
    key: "checkbox",
    title: "Select",
    enable: true,
    minWidth: 100,
    resizable: false,
    checkbox: { value: true, isIndeterminate: false, onChange: handleChange },
  }}
  index={0}
  sortBy={SortByFieldName.Author}
  sorted
  sortingVisible
/>`,
      },
    },
  },
};

export const WithIndeterminateCheckbox: Story = {
  name: "Partly ticked checkbox",
  render: (args) => <TableHeaderCell {...args} />,
  args: {
    ...Default.args,
    column: {
      key: "checkbox",
      title: "Select",
      enable: true,
      minWidth: 100,
      resizable: false,
      checkbox: {
        value: true,
        isIndeterminate: true,
        onChange: onSelectAll,
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(
      within(cellOf(canvas)).getByRole("checkbox"),
    ).toBePartiallyChecked();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The same checkbox partly ticked, for a selection that covers some rows but not all (`checkbox.isIndeterminate`).",
      },
      source: {
        code: `<TableHeaderCell
  column={{
    key: "checkbox",
    title: "Select",
    enable: true,
    minWidth: 100,
    resizable: false,
    checkbox: { value: true, isIndeterminate: true, onChange: handleChange },
  }}
  index={0}
  sortBy={SortByFieldName.Author}
  sorted
  sortingVisible
/>`,
      },
    },
  },
};

export const ShortColumn: Story = {
  name: "Short column",
  render: (args) => (
    <div>
      <i style={{ marginBottom: 12 }}>
        Min gap between title and resize-handle is shorter (12px)
      </i>
      <TableHeaderCell {...args} />
    </div>
  ),
  args: {
    ...Default.args,
    resizable: true,
    sortingVisible: false,
    column: {
      ...Default.args?.column,
      key: "short",
      title: "#",
      resizable: false,
      isShort: true,
    },
  },
  play: async ({ canvas }) => {
    const cell = cellOf(canvas);
    await expect(cell).toHaveAttribute("data-short-colum", "true");
    await expect(within(cell).getByTestId("resize-handle")).toBeInTheDocument();
    await expect(within(cell).queryByTestId("sort-icon")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A narrow column, such as a row number, keeps 12 pixels before its handle instead of 22, so the title is not cut off (`isShort`).",
      },
      source: {
        code: `<TableHeaderCell
  column={{
    key: "name",
    title: "#",
    enable: true,
    sortBy: SortByFieldName.Name,
    minWidth: 200,
    resizable: false,
    isShort: true,
  }}
  index={0}
  sortBy={SortByFieldName.Author}
  sorted
  sortingVisible={false}
  resizable
/>`,
      },
    },
  },
};
