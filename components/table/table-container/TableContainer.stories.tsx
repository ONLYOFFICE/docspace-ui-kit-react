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
import type { TableContainerProps } from "../Table.types";

import { useRef } from "react";
import { uuid as uuidv4 } from "../../../utils/";

import { TableContainer } from "./TableContainer";
import { Scrollbar } from "../../scrollbar";
import { TableRow } from "../table-row";
import { TableCell } from "../sub-components/table-cell";
import { TableHeader } from "../table-header";
import { SortByFieldName } from "../../../enums";
import { TableBody } from "../table-body";

const COLUMN_STORAGE_NAME = "storybook-table-container-column-storage";
const COLUMN_INFO_PANEL_STORAGE_NAME =
  "storybook-table-container-info-panel-storage";

const mockColumns = [
  {
    key: "Column 1",
    title: "Column 1",
    resizable: true,
    enable: true,
    default: true,
    sortBy: SortByFieldName.Name,
    minWidth: 210,
    onChange: () => {},
    onClick: () => {},
  },
  {
    key: "Column 2",
    title: "Column 2",
    enable: true,
    resizable: true,
    sortBy: SortByFieldName.Type,
    onChange: () => {},
    onClick: () => {},
  },
  {
    key: "Column 3",
    title: "Column 3",
    enable: true,
    resizable: true,
    sortBy: SortByFieldName.Tags,
    withTagRef: true,
    onChange: () => {},
    onClick: () => {},
  },
];

const createTableRows = (count: number) => {
  return Array.from({ length: count }, (_, index) => {
    return (
      <TableRow key={uuidv4()}>
        <TableCell>{`Cell ${index + 1}-1`}</TableCell>
        <TableCell>{`Cell ${index + 1}-2`}</TableCell>
        <TableCell>{`Cell ${index + 1}-3`}</TableCell>
      </TableRow>
    );
  });
};

const TableContainerWrapper = (props: TableContainerProps) => {
  const { useReactWindow } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <TableContainer {...props} forwardedRef={containerRef}>
      <TableHeader
        containerRef={containerRef}
        columns={mockColumns}
        columnStorageName={COLUMN_STORAGE_NAME}
        columnInfoPanelStorageName={COLUMN_INFO_PANEL_STORAGE_NAME}
        sectionWidth={800}
        useReactWindow={useReactWindow}
        showSettings
        sortingVisible
        sorted
      />
      <TableBody
        columnStorageName={COLUMN_STORAGE_NAME}
        columnInfoPanelStorageName={COLUMN_INFO_PANEL_STORAGE_NAME}
        fetchMoreFiles={async () => {}}
        filesLength={10}
        hasMoreFiles={false}
        itemCount={10}
        itemHeight={50}
        useReactWindow={useReactWindow}
      >
        {createTableRows(10)}
      </TableBody>
    </TableContainer>
  );
};

const meta = {
  title: "UI/Table/TableContainer",
  component: TableContainerWrapper,
  tags: ["!autodocs"],
  parameters: {
    docs: {
      description: {
        component: `TableContainer is a wrapper for table elements including header, body, rows, and cells.

### Features

- **Grid Layout**: Applies CSS grid styling for consistent column alignment
- **React-Window Support**: Configures specific styles for virtualized table content
- **Scrolling Behavior**: Manages scroll context for child components
- **Composable**: Works with TableHeader, TableBody, TableRow, and TableCell

### Usage

\`\`\`tsx
import { TableContainer } from "@docspace/ui-kit/components/table/table-container";

const ref = useRef<HTMLDivElement>(null);

<TableContainer forwardedRef={ref} useReactWindow={false}>
  <TableHeader {...headerProps} />
  <TableBody {...bodyProps}>
    {rows}
  </TableBody>
</TableContainer>
\`\`\``,
      },
    },
  },
  argTypes: {
    useReactWindow: {
      control: "boolean",
      description:
        "Enable react-window mode for virtualized scrolling styles",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    forwardedRef: { control: false },
    children: { control: false },
  },
  decorators: [
    (Story) => {
      return (
        <div>
          <div style={{ marginBottom: "20px", fontSize: "14px" }}>
            <p>
              <strong>Note:</strong> TableContainer is a wrapper for table
              elements (header, body, rows, cells). When used with react-window,
              it sets specific styles to properly contain virtualized content.
            </p>
          </div>
          <Scrollbar
            id="sectionScroll"
            style={{ height: "400px" }}
            autoHide={false}
          >
            <div style={{ marginTop: "25px" }}>
              <Story />
            </div>
          </Scrollbar>
        </div>
      );
    },
  ],
} satisfies Meta<typeof TableContainer>;

type Story = StoryObj<ComponentProps<typeof TableContainer>>;

export default meta;

export const Default: Story = {
  render: (args) => <TableContainerWrapper {...args} />,
  args: {
    useReactWindow: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default TableContainer with a header and body. Renders all rows without virtual scrolling.",
      },
      source: {
        code: `const ref = useRef<HTMLDivElement>(null);

<TableContainer forwardedRef={ref} useReactWindow={false}>
  <TableHeader
    containerRef={ref}
    columns={columns}
    columnStorageName="my-columns"
    columnInfoPanelStorageName="my-info-panel"
    sectionWidth={800}
    useReactWindow={false}
    showSettings
    sortingVisible
    sorted
  />
  <TableBody
    columnStorageName="my-columns"
    columnInfoPanelStorageName="my-info-panel"
    fetchMoreFiles={fetchMore}
    filesLength={10}
    hasMoreFiles={false}
    itemCount={10}
    itemHeight={50}
    useReactWindow={false}
  >
    {rows}
  </TableBody>
</TableContainer>`,
      },
    },
  },
};
