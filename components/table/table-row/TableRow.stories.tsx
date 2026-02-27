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

import { ContextMenuModel } from "../../context-menu";
import { TableCell } from "../sub-components/table-cell";
import { TableRow } from "./TableRow";

const meta = {
  title: "UI/Table/TableRow",
  component: TableRow,
  parameters: {
    docs: {
      description: {
        component: `TableRow represents a single row within a table, with context menu and selection support.

### Features

- **Context Menu**: Right-click to show configurable context menu options
- **Selection State**: Visual feedback for checked and active rows
- **Drag Support**: Rows can indicate a dragging state
- **Index Editing Mode**: Special styling for index reordering operations
- **Column Hiding**: Supports hiding columns dynamically

### Usage

\`\`\`tsx
import { TableRow } from "@docspace/ui-kit/components/table/table-row";
import { TableCell } from "@docspace/ui-kit/components/table/sub-components/table-cell";

<TableRow
  checked={isSelected}
  contextOptions={menuItems}
  style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr) 24px" }}
>
  <TableCell>Name</TableCell>
  <TableCell>Type</TableCell>
  <TableCell>Modified</TableCell>
</TableRow>
\`\`\``,
      },
    },
  },
  argTypes: {
    checked: {
      control: "boolean",
      description: "Whether the row is selected/checked",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isActive: {
      control: "boolean",
      description: "Whether the row is in an active/focused state",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    dragging: {
      control: "boolean",
      description: "Whether the row is currently being dragged",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isIndexEditingMode: {
      control: "boolean",
      description: "Enable index editing mode for row reordering",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hideColumns: {
      control: "boolean",
      description: "Whether to hide optional columns",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    fileContextClick: { control: false, table: { disable: true } },
    onHideContextMenu: { control: false, table: { disable: true } },
    getContextModel: { control: false, table: { disable: true } },
    forwardedRef: { control: false, table: { disable: true } },
    onClick: { control: false, table: { disable: true } },
  },
  args: {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr) 24px",
    },
  },
} satisfies Meta<typeof TableRow>;

type Story = StoryObj<ComponentProps<typeof TableRow>>;

export default meta;

const contextOptions: ContextMenuModel[] = [
  {
    key: "edit",
    label: "Edit",
    onClick: () => console.log("Edit clicked"),
  },
  {
    key: "delete",
    label: "Delete",
    onClick: () => console.log("Delete clicked"),
  },
];

const RowContent = (
  <>
    <TableCell>
      <span>Cell 1</span>
    </TableCell>
    <TableCell>
      <span>Cell 2</span>
    </TableCell>
    <TableCell>
      <span>Cell 3</span>
    </TableCell>
  </>
);

export const Default: Story = {
  render: (args) => <TableRow {...args} />,
  args: {
    children: RowContent,
    className: "custom-row-class",
    selectionProp: { className: "selection-class" },
    title: "Context menu",
    contextOptions,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default table row with context menu support. Right-click to see the context menu.",
      },
      source: {
        code: `<TableRow
  contextOptions={contextOptions}
  style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr) 24px" }}
>
  <TableCell><span>Cell 1</span></TableCell>
  <TableCell><span>Cell 2</span></TableCell>
  <TableCell><span>Cell 3</span></TableCell>
</TableRow>`,
      },
    },
  },
};

export const IndexEditingMode: Story = {
  render: (args) => <TableRow {...args} />,
  args: {
    children: RowContent,
    className: "custom-row-class",
    selectionProp: { className: "selection-class" },
    isIndexEditingMode: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Table row in index editing mode. Applies special styling for reordering operations.",
      },
      source: {
        code: `<TableRow
  isIndexEditingMode
  style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr) 24px" }}
>
  <TableCell><span>Cell 1</span></TableCell>
  <TableCell><span>Cell 2</span></TableCell>
  <TableCell><span>Cell 3</span></TableCell>
</TableRow>`,
      },
    },
  },
};
