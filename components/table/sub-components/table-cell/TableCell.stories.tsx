/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { TableCell } from "./TableCell";
import { Avatar, AvatarRole, AvatarSize } from "../../../avatar";
import { Checkbox } from "../../../checkbox";

const meta = {
  title: "UI/Table/TableCell",
  component: TableCell,
  parameters: {
    docs: {
      description: {
        component: `TableCell is an individual cell within a TableRow, supporting text content and interactive elements.

### Features

- **Text Content**: Render simple text or formatted content
- **Interactive Elements**: Supports avatars, checkboxes, and other components
- **Access Control**: Conditionally enables interactions based on user access
- **Flexible Layout**: Adapts to the column grid defined by the parent table

### Usage

\`\`\`tsx
import { TableCell } from "@docspace/ui-kit/components/table/sub-components/table-cell";

// Simple text cell
<TableCell>Cell Content</TableCell>

// Cell with interactive elements
<TableCell hasAccess checked>
  <div className="table-container_element">
    <Avatar role={AvatarRole.none} size={AvatarSize.min} />
  </div>
  <Checkbox className="table-container_row-checkbox" isChecked />
</TableCell>
\`\`\``,
      },
    },
  },
  argTypes: {
    hasAccess: {
      control: "boolean",
      description: "Whether the user has access to interact with the cell element",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    checked: {
      control: "boolean",
      description: "Whether the cell checkbox is checked",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    className: {
      control: "text",
      description: "Custom CSS class name for the cell",
    },
    children: {
      control: false,
      description: "Cell content (text or React elements)",
    },
    forwardedRef: {
      control: false,
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof TableCell>;

type Story = StoryObj<ComponentProps<typeof TableCell>>;

export default meta;

export const Default: Story = {
  render: (args) => <TableCell {...args} />,
  args: {
    className: "custom-cell",
    children: "Cell Content",
    hasAccess: false,
    checked: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default table cell with simple text content.",
      },
      source: {
        code: `<TableCell className="custom-cell">Cell Content</TableCell>`,
      },
    },
  },
};

export const WithElement: Story = {
  render: (args) => (
    <TableCell {...args}>
      <div className="table-container_element">
        <Avatar
          role={AvatarRole.none}
          size={AvatarSize.min}
          source=""
          noClick={!args.hasAccess}
        />
      </div>
      <Checkbox
        className="table-container_row-checkbox"
        isChecked={args.checked}
      />
    </TableCell>
  ),
  args: {
    className: "custom-cell",
    hasAccess: true,
    checked: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Table cell with an avatar and unchecked checkbox. The user has access to interact with the element.",
      },
      source: {
        code: `<TableCell hasAccess>
  <div className="table-container_element">
    <Avatar role={AvatarRole.none} size={AvatarSize.min} source="" />
  </div>
  <Checkbox className="table-container_row-checkbox" isChecked={false} />
</TableCell>`,
      },
    },
  },
};

export const WithElementChecked: Story = {
  render: (args) => (
    <TableCell {...args}>
      <div className="table-container_element">
        <Avatar
          role={AvatarRole.none}
          size={AvatarSize.min}
          source=""
          noClick={!args.hasAccess}
        />
      </div>
      <Checkbox
        className="table-container_row-checkbox"
        isChecked={args.checked}
      />
    </TableCell>
  ),
  args: {
    className: "custom-cell",
    hasAccess: true,
    checked: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Table cell with an avatar and checked checkbox, indicating the row is selected.",
      },
      source: {
        code: `<TableCell hasAccess checked>
  <div className="table-container_element">
    <Avatar role={AvatarRole.none} size={AvatarSize.min} source="" />
  </div>
  <Checkbox className="table-container_row-checkbox" isChecked />
</TableCell>`,
      },
    },
  },
};

export const WithElementNoAccess: Story = {
  render: (args) => (
    <TableCell {...args}>
      <div className="table-container_element">
        <Avatar
          role={AvatarRole.none}
          size={AvatarSize.min}
          source=""
          noClick={!args.hasAccess}
        />
      </div>
      <Checkbox
        className="table-container_row-checkbox"
        isChecked={args.checked}
      />
    </TableCell>
  ),
  args: {
    className: "custom-cell",
    hasAccess: false,
    checked: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Table cell where the user does not have access. The avatar click is disabled.",
      },
      source: {
        code: `<TableCell hasAccess={false}>
  <div className="table-container_element">
    <Avatar role={AvatarRole.none} size={AvatarSize.min} source="" noClick />
  </div>
  <Checkbox className="table-container_row-checkbox" isChecked={false} />
</TableCell>`,
      },
    },
  },
};
