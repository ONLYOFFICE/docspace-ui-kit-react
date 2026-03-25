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
import type { TableHeaderProps } from "../Table.types";

import { useRef } from "react";
import { TableHeader } from ".";
import { SortByFieldName } from "../../../enums";

const COLUMN_STORAGE_NAME = "storybook-table-header-column-storage";
const COLUMN_INFO_PANEL_STORAGE_NAME =
  "storybook-table-header-info-panel-storage";

const TableHeaderWrapper = (args: Omit<TableHeaderProps, "containerRef">) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      id="table-container"
      ref={containerRef}
      style={{ marginInline: "40px" }}
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
        component: `TableHeader displays column headers with interactive features for data tables.

### Features

- **Resizable Columns**: Drag column borders to adjust widths
- **Sorting**: Click column headers to sort by that field
- **Column Settings**: Toggle column visibility via a settings dropdown
- **Info Panel Support**: Adjusts layout when the info panel is visible
- **Index Editing Mode**: Special mode for reordering items

### Usage

\`\`\`tsx
import { TableHeader } from "@docspace/ui-kit/components/table/table-header";

const ref = useRef<HTMLDivElement>(null);

<TableHeader
  containerRef={ref}
  columns={columns}
  columnStorageName="my-columns"
  columnInfoPanelStorageName="my-info-panel"
  sectionWidth={1000}
  sortBy={SortByFieldName.Name}
  sorted
  showSettings
  sortingVisible
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    onClick: { control: false, table: { disable: true } },
    containerRef: { control: false, table: { disable: true } },
    setHideColumns: { control: false, table: { disable: true } },
    tagRef: { control: false, table: { disable: true } },
    sortBy: {
      control: "select",
      options: [
        SortByFieldName.Name,
        SortByFieldName.Type,
        SortByFieldName.Tags,
        SortByFieldName.Author,
      ],
      description: "Field name used for the current sort order",
    },
    sorted: {
      control: "boolean",
      description: "Whether the table is currently sorted",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    showSettings: {
      control: "boolean",
      description: "Show the column settings dropdown",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    sortingVisible: {
      control: "boolean",
      description: "Show sorting indicators on column headers",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    infoPanelVisible: {
      control: "boolean",
      description: "Whether the info panel is visible",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isIndexEditingMode: {
      control: "boolean",
      description: "Enable index editing mode for reordering",
      table: {
        defaultValue: { summary: "false" },
      },
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
        onChange: () => {},
        onClick: () => {},
      },
      {
        key: "Type",
        title: "Type",
        enable: true,
        resizable: true,
        sortBy: SortByFieldName.Type,
        onChange: () => {},
        onClick: () => {},
      },
      {
        key: "Tags",
        title: "Tags",
        enable: true,
        resizable: true,
        sortBy: SortByFieldName.Tags,
        withTagRef: true,
        onChange: () => {},
        onClick: () => {},
      },
      {
        key: "Owner",
        title: "Owner",
        enable: true,
        resizable: true,
        sortBy: SortByFieldName.Author,
        onChange: () => {},
        onClick: () => {},
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
  parameters: {
    docs: {
      description: {
        story:
          "Default table header with four resizable columns, sorting enabled, and column settings visible.",
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
  parameters: {
    docs: {
      description: {
        story:
          "Table header without the column settings dropdown. Users cannot toggle column visibility.",
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
  parameters: {
    docs: {
      description: {
        story:
          "Table header with sorting indicators hidden. Column headers do not display sort direction arrows.",
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
