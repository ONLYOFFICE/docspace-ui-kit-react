// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

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
        component: `TableHeaderCell renders a single column header with sorting and resizing capabilities.

### Features

- **Sorting Indicator**: Displays an arrow icon when the column is the active sort field
- **Resizable**: Drag handle for adjusting column width
- **Checkbox Column**: Optional checkbox for row selection in the header
- **Short Column Mode**: Compact layout for narrow columns like index numbers

### Usage

\`\`\`tsx
import { TableHeaderCell } from "@docspace/ui-kit/components/table/sub-components/table-header-cell";

<TableHeaderCell
  column={{
    key: "name",
    title: "Name",
    enable: true,
    sortBy: SortByFieldName.Name,
    resizable: true,
  }}
  index={0}
  sortBy={SortByFieldName.Name}
  sorted
  sortingVisible
  resizable
  onMouseDown={handleResize}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    column: { control: false },
    onMouseDown: { control: false, table: { disable: true } },
    tagRef: { control: false, table: { disable: true } },
    sortBy: {
      control: "select",
      options: [SortByFieldName.Name, SortByFieldName.Author],
      description: "Current sort field for the table",
    },
    sorted: {
      control: "boolean",
      description: "Whether the table is currently sorted",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    sortingVisible: {
      control: "boolean",
      description: "Whether sorting indicators are visible on hover",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    resizable: {
      control: "boolean",
      description: "Whether the column can be resized by dragging",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    index: {
      control: "number",
      description: "Column index position in the header",
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
          "Default header cell for a non-resizable column. Sorting is visible but the column is not the current sort field.",
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
    column: { ...Default.args?.column, resizable: true },
    resizable: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Resizable header cell with a drag handle for adjusting column width.",
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
          "Header cell where the current sort field matches this column, showing an active sort indicator.",
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
          "Header cell with sorting indicators hidden. No sort icon appears on hover.",
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
          "Header cell with an unchecked checkbox. The checkbox is visually hidden when not checked.",
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
          "Header cell with a checked checkbox, indicating all rows are selected.",
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
          "Header cell with an indeterminate checkbox, indicating partial row selection.",
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
      title: "#",
      resizable: false,
      isShort: true,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Short column header with a compact layout. The gap between the title and resize handle is reduced to 12px.",
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
