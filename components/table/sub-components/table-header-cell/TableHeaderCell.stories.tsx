import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { TableHeaderCell } from "./TableHeaderCell";
import { SortByFieldName } from "../../../../enums";

const meta = {
  title: "UI/Table/TableHeaderCell",
  component: TableHeaderCell,
  parameters: {
    docs: {
      description: {
        component: `TableHeaderCell is the title of one column in a TableHeader, with its sort arrow and the handle that resizes it.

### Features

- **Sort Arrow**: Shows an arrow after the title while the pointer is over the cell or the column is the one sorted by, for a column that has an \`onClick\`
- **Sort Direction**: Points the arrow one way while \`sorted\` is set and turns it over while it is not
- **Click to Sort**: Calls the column's \`onClick\` with its \`sortBy\` on a click on the title, and \`onIconClick\` instead on a click on the arrow when the column has one; while \`sortingVisible\` is off the arrow is gone and clicks do nothing
- **Resize Handle**: With \`resizable\`, draws a short bar at the end of the cell and reports a press on it through \`onMouseDown\`, which TableHeader turns into a drag
- **Selection Checkbox**: Shows the column's \`checkbox\` before the title, but only while it is ticked or partly ticked
- **Short Column**: With the column's \`isShort\`, narrows the space kept before the handle from 22 to 12 pixels, for a narrow column such as a row number
- **Hidden Title**: Leaves the title out while the column's \`enable\` is off, keeping the cell's place in the grid

### Usage

\`\`\`tsx
// TableHeaderCell is not exported on its own: TableHeader renders one per column
import { TableHeader } from "@onlyoffice/apps-ui-kit/components/table";

<TableHeader
  columns={[
    { key: "name", title: "Name", enable: true, sortBy: "name", onClick: setSortBy },
    { key: "size", title: "Size", enable: true, sortBy: "size", resizable: true, onClick: setSortBy },
  ]}
  sortBy={sortBy}
  sorted={isDescending}
  {...headerProps}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    column: {
      control: false,
      description:
        "The column to render: its title, its sort field and callbacks, and the flags that shape the cell",
    },
    index: {
      control: "number",
      description:
        "Position of the column, which becomes the cell's id `column_<index>`",
    },
    sortBy: {
      control: "select",
      options: [SortByFieldName.Name, SortByFieldName.Author],
      description:
        "Field the table is sorted by; the column with the same `sortBy` keeps its arrow visible",
    },
    sorted: {
      control: "boolean",
      description: "Direction of the sort; turning it off turns the arrow over",
    },
    sortingVisible: {
      control: "boolean",
      description:
        "Shows the sort arrow and lets clicks on the title and the arrow sort the table",
    },
    resizable: {
      control: "boolean",
      description: "Draws the resize handle at the end of the cell",
    },
    defaultSize: {
      control: "number",
      description:
        "Width in pixels the column returns to when the widths are reset",
    },
    testId: {
      control: "text",
      description: "Value of the cell's `data-testid` attribute",
      table: {
        defaultValue: { summary: "table-header-cell" },
      },
    },
    onMouseDown: {
      control: false,
      description: "Called when the resize handle is pressed",
    },
    tagRef: {
      control: false,
      description:
        "Ref attached to the cell when the column asks for it with `withTagRef`",
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

export const Default: Story = {
  render: (args) => <TableHeaderCell {...args} />,
  args: {
    column: {
      key: "name",
      title: "Name",
      enable: true,
      sortBy: SortByFieldName.Name,
      minWidth: 200,
      resizable: false,
      onClick: () => {},
    },
    index: 0,
    onMouseDown: () => {},
    resizable: false,
    sortBy: SortByFieldName.Author,
    sorted: true,
    sortingVisible: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The title of a column the table is not sorted by; hover it to see the arrow that sorts by this column, and change any other prop live in the Controls panel below.",
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
  parameters: {
    docs: {
      description: {
        story:
          "The short bar at the end of the cell is the handle a user drags to widen the column (`resizable`); here it only reports the press, since TableHeader does the resizing.",
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
  render: (args) => <TableHeaderCell {...args} />,
  args: { ...Default.args, sortBy: SortByFieldName.Name },
  parameters: {
    docs: {
      description: {
        story:
          "The column the table is sorted by keeps its arrow on screen without a hover, so the user sees what the list is ordered by (`sortBy` matches the column's `sortBy`).",
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
        onChange: () => {},
      },
    },
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
        onChange: () => {},
      },
    },
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
        onChange: () => {},
      },
    },
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
