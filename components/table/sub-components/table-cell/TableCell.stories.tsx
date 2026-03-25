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
