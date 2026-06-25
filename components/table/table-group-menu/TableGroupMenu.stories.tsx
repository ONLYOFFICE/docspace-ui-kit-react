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

import type { ComponentProps, CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { TGroupMenuItem } from "../Table.types";

import ChangeToEmployeeReactSvgUrl from "../../../assets/change.to.employee.react.svg?url";
import InfoReactSvgUrl from "../../../assets/info.outline.react.svg?url";
import InviteAgainReactSvgUrl from "../../../assets/invite.again.react.svg?url";

import { TableGroupMenu } from "./TableGroupMenu";
import { DropDownItem } from "../../drop-down-item";

const meta = {
  title: "UI/Table/TableGroupMenu",
  component: TableGroupMenu,
  parameters: {
    docs: {
      description: {
        component: `TableGroupMenu displays a bulk action toolbar when table rows are selected.

### Features

- **Checkbox with ComboBox**: Select all or filter selection via dropdown options
- **Action Buttons**: Configurable menu items with icons and optional dropdowns
- **Indeterminate State**: Visual indicator for partial selection
- **Header Label**: Optional label displayed next to the checkbox
- **Info Panel Toggle**: Built-in button to toggle the info panel
- **Closeable**: Optional close button to dismiss the group menu
- **Blocked State**: Disables all actions while an operation is in progress

### Usage

\`\`\`tsx
import { TableGroupMenu } from "@docspace/ui-kit/components/table/table-group-menu";

<TableGroupMenu
  isChecked={allSelected}
  isIndeterminate={someSelected}
  headerMenu={menuItems}
  checkboxOptions={checkboxDropdown}
  onChange={handleCheckboxChange}
  onClick={handleCheckboxClick}
  withComboBox
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    isChecked: {
      control: "boolean",
      description: "Whether the select-all checkbox is checked",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isIndeterminate: {
      control: "boolean",
      description:
        "Whether the checkbox is in an indeterminate state (partial selection)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isBlocked: {
      control: "boolean",
      description:
        "Block all interactions while an operation is in progress",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isMobileView: {
      control: "boolean",
      description: "Enable mobile-optimized layout",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isInfoPanelVisible: {
      control: "boolean",
      description: "Whether the info panel is currently visible",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withComboBox: {
      control: "boolean",
      description:
        "Show a dropdown combo box next to the checkbox for selection filtering",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isCloseable: {
      control: "boolean",
      description: "Show a close button to dismiss the group menu",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    headerLabel: {
      control: "text",
      description: "Optional label displayed next to the checkbox",
    },
    onChange: { control: false },
    onClick: { control: false },
    toggleInfoPanel: { control: false },
    onCloseClick: { control: false },
    headerMenu: { control: false },
    checkboxOptions: { control: false },
  },
  decorators: [
    (Story) => {
      return (
        <div style={{ height: "68px" }}>
          <Story />
        </div>
      );
    },
  ],
} satisfies Meta<typeof TableGroupMenu>;

type TableGroupMenuProps = ComponentProps<typeof TableGroupMenu>;
type Story = StoryObj<TableGroupMenuProps>;

export default meta;

const createMenuItems = (): TGroupMenuItem[] => [
  {
    id: "menu-change-type",
    disabled: false,
    label: "Change type",
    title: "Change type",
    iconUrl: ChangeToEmployeeReactSvgUrl,
    onClick: () => {},
    withDropDown: true,
    options: [
      {
        key: "option-1",
        label: "Option 1",
        onClick: () => {},
      },
      {
        key: "option-2",
        label: "Option 2",
        onClick: () => {},
      },
    ],
  },
  {
    id: "menu-info",
    label: "Info",
    title: "Info",
    disabled: false,
    onClick: () => {},
    iconUrl: InfoReactSvgUrl,
  },
  {
    id: "menu-invite",
    label: "Invite",
    title: "Invite",
    disabled: false,
    onClick: () => {},
    iconUrl: InviteAgainReactSvgUrl,
  },
];

const checkboxOptions = (
  <>
    <DropDownItem key="all" label="All" data-index={0} onClick={() => {}} />
    <DropDownItem
      key="active"
      label="Active"
      data-index={1}
      onClick={() => {}}
    />
  </>
);

export const Default: Story = {
  render: (args: TableGroupMenuProps) => <TableGroupMenu {...args} />,
  args: {
    isChecked: false,
    isIndeterminate: false,
    headerMenu: createMenuItems(),
    checkboxOptions,
    onClick: () => {},
    onChange: () => {},
    withoutInfoPanelToggler: false,
    isInfoPanelVisible: false,
    toggleInfoPanel: () => {},
    isBlocked: false,
    withComboBox: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default group menu with checkbox, combo box, and action buttons. Appears when rows are selected.",
      },
      source: {
        code: `<TableGroupMenu
  isChecked={false}
  isIndeterminate={false}
  headerMenu={menuItems}
  checkboxOptions={checkboxDropdown}
  onChange={handleChange}
  onClick={handleClick}
  withComboBox
/>`,
      },
    },
  },
};

export const Checked: Story = {
  render: (args: TableGroupMenuProps) => <TableGroupMenu {...args} />,
  args: {
    ...Default.args,
    isChecked: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Group menu with the select-all checkbox in a checked state, indicating all items are selected.",
      },
      source: {
        code: `<TableGroupMenu
  isChecked
  headerMenu={menuItems}
  checkboxOptions={checkboxDropdown}
  onChange={handleChange}
  onClick={handleClick}
  withComboBox
/>`,
      },
    },
  },
};

export const Indeterminate: Story = {
  render: (args: TableGroupMenuProps) => <TableGroupMenu {...args} />,
  args: {
    ...Default.args,
    isIndeterminate: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Group menu with the checkbox in an indeterminate state, indicating partial selection.",
      },
      source: {
        code: `<TableGroupMenu
  isIndeterminate
  headerMenu={menuItems}
  checkboxOptions={checkboxDropdown}
  onChange={handleChange}
  onClick={handleClick}
  withComboBox
/>`,
      },
    },
  },
};

export const WithHeaderLabel: Story = {
  render: (args: TableGroupMenuProps) => <TableGroupMenu {...args} />,
  args: {
    ...Default.args,
    headerLabel: "Custom header label",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Group menu with a custom header label displayed next to the checkbox.",
      },
      source: {
        code: `<TableGroupMenu
  headerLabel="Custom header label"
  headerMenu={menuItems}
  checkboxOptions={checkboxDropdown}
  onChange={handleChange}
  onClick={handleClick}
  withComboBox
/>`,
      },
    },
  },
};

export const Closeable: Story = {
  render: (args: TableGroupMenuProps) => <TableGroupMenu {...args} />,
  args: {
    ...Default.args,
    isCloseable: true,
    onCloseClick: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "Group menu with a close button that allows users to dismiss the toolbar.",
      },
      source: {
        code: `<TableGroupMenu
  isCloseable
  onCloseClick={handleClose}
  headerMenu={menuItems}
  checkboxOptions={checkboxDropdown}
  onChange={handleChange}
  onClick={handleClick}
  withComboBox
/>`,
      },
    },
  },
};

export const Blocked: Story = {
  render: (args: TableGroupMenuProps) => <TableGroupMenu {...args} />,
  args: {
    ...Default.args,
    isBlocked: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Group menu in a blocked state. All actions are disabled while an operation is in progress.",
      },
      source: {
        code: `<TableGroupMenu
  isBlocked
  headerMenu={menuItems}
  checkboxOptions={checkboxDropdown}
  onChange={handleChange}
  onClick={handleClick}
  withComboBox
/>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: (args: TableGroupMenuProps) => (
    <div
      style={
        {
          "--table-group-menu-checkbox-margin": "12px",
        } as CSSProperties
      }
    >
      <TableGroupMenu {...args} />
    </div>
  ),
  args: {
    ...Default.args,
  },
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--table-group-menu-checkbox-margin\` | \`margin-inline-start\` of the checkbox / label element on desktop | \`28px\` |`,
      },
    },
  },
};
