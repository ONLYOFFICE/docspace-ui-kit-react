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

import { SortByFieldName } from "../../../../enums";

import { TableSettings } from "./TableSettings";

const meta = {
  title: "UI/Table/TableSettings",
  component: TableSettings,
  parameters: {
    docs: {
      description: {
        component: `TableSettings provides a dropdown for managing column visibility in tables.

### Features

- **Column Toggles**: Enable or disable individual columns via checkboxes
- **Disabled State**: Entire settings panel can be disabled during operations
- **Persistent Configuration**: Works with column storage for saving user preferences

### Usage

\`\`\`tsx
import { TableSettings } from "@docspace/ui-kit/components/table/sub-components/table-settings";

<TableSettings
  columns={[
    { key: "name", title: "Name", enable: true, sortBy: SortByFieldName.Name, onChange: handleToggle },
    { key: "type", title: "Type", enable: true, sortBy: SortByFieldName.Type, onChange: handleToggle },
    { key: "modified", title: "Modified", enable: false, sortBy: SortByFieldName.ModifiedDate, onChange: handleToggle },
  ]}
  disableSettings={false}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    columns: {
      control: false,
      description:
        "Array of column configuration objects with visibility toggles",
    },
    disableSettings: {
      control: "boolean",
      description: "Disable the entire settings panel",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<typeof TableSettings>;

type Story = StoryObj<ComponentProps<typeof TableSettings>>;

export default meta;

export const Default: Story = {
  render: (args) => <TableSettings {...args} />,
  args: {
    columns: [
      {
        key: "name",
        title: "Name",
        enable: true,
        sortBy: SortByFieldName.Name,
        onChange: () => {},
      },
      {
        key: "type",
        title: "Type",
        enable: true,
        sortBy: SortByFieldName.Type,
        onChange: () => {},
      },
      {
        key: "modified",
        title: "Modified",
        enable: false,
        sortBy: SortByFieldName.ModifiedDate,
        onChange: () => {},
      },
      {
        key: "owner",
        title: "Owner",
        enable: true,
        sortBy: SortByFieldName.Author,
        onChange: () => {},
      },
    ],
    disableSettings: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default table settings dropdown with four columns. The Modified column is disabled by default.",
      },
      source: {
        code: `<TableSettings
  columns={[
    { key: "name", title: "Name", enable: true, sortBy: SortByFieldName.Name, onChange: handleToggle },
    { key: "type", title: "Type", enable: true, sortBy: SortByFieldName.Type, onChange: handleToggle },
    { key: "modified", title: "Modified", enable: false, sortBy: SortByFieldName.ModifiedDate, onChange: handleToggle },
    { key: "owner", title: "Owner", enable: true, sortBy: SortByFieldName.Author, onChange: handleToggle },
  ]}
  disableSettings={false}
/>`,
      },
    },
  },
};

export const Disabled: Story = {
  render: (args) => <TableSettings {...args} />,
  args: {
    ...Default.args,
    disableSettings: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Table settings in a disabled state. The settings dropdown cannot be opened or interacted with.",
      },
      source: {
        code: `<TableSettings
  columns={columns}
  disableSettings
/>`,
      },
    },
  },
};
