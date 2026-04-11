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

import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { TableContainer } from "./table-container";
import { TableHeader } from "./table-header";
import { TableBody } from "./table-body";
import { TableGroupMenu } from "./table-group-menu";
import type { TTableColumnDef, TGroupMenuItem } from "./Table.types";

// ─── Mock data ──────────────────────────────────────────────────────────────

interface MockGroup {
  id: string;
  name: string;
  members: number;
  manager: string;
}

const MOCK_DATA: MockGroup[] = Array.from({ length: 30 }, (_, i) => ({
  id: `group-${i}`,
  name: `Group ${i + 1}`,
  members: Math.floor(Math.random() * 50) + 1,
  manager: `Manager ${(i % 5) + 1}`,
}));

// ─── Story component ─────────────────────────────────────────────────────────

interface TableDemoProps {
  infoPanelVisible?: boolean;
  isIndexEditingMode?: boolean;
  sortBy?: string;
}

function TableDemo({
  infoPanelVisible = false,
  isIndexEditingMode = false,
  sortBy,
}: TableDemoProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [membersVisible, setMembersVisible] = useState(true);
  const [managerVisible, setManagerVisible] = useState(true);

  const allChecked = selected.size === MOCK_DATA.length;
  const isIndeterminate = selected.size > 0 && !allChecked;

  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const onSelectAll = (checked: boolean) => {
    setSelected(checked ? new Set(MOCK_DATA.map((r) => r.id)) : new Set());
  };

  const columns: TTableColumnDef<MockGroup>[] = [
    {
      key: "name",
      title: "Name",
      default: true,
      enable: true,
      minWidth: 210,
      sortBy: "name",
      render: (_value, row) => {
        const isChecked = selected.has(row.id);
        return (
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => toggleRow(row.id)}
            />
            <span>{row.name}</span>
          </label>
        );
      },
    },
    {
      key: "members",
      title: "Members",
      enable: membersVisible,
      sortBy: "members",
      dataIndex: "members",
      onChange: () => setMembersVisible((v) => !v),
      render: (value) => <span>{value as number}</span>,
    },
    {
      key: "manager",
      title: "Manager",
      enable: managerVisible,
      sortBy: "manager",
      dataIndex: "manager",
      onChange: () => setManagerVisible((v) => !v),
      render: (value) => <span>{value as string}</span>,
    },
  ];

  const groupMenuItems: TGroupMenuItem[] = [
    {
      id: "delete",
      label: "Delete",
      title: "Delete selected",
      disabled: selected.size === 0,
      iconUrl: "",
      onClick: () => setSelected(new Set()),
    },
  ];

  return (
    <div
      className="light"
      style={{
        width: "100%",
        height: "600px",
        overflow: "auto",
        padding: "24px",
      }}
    >
      {selected.size > 0 && (
        <TableGroupMenu
          headerMenu={groupMenuItems}
          isChecked={allChecked}
          isIndeterminate={isIndeterminate}
          onChange={onSelectAll}
          withoutInfoPanelToggler
          withComboBox={false}
        />
      )}

      <TableContainer
        columns={columns}
        columnStorageName="storybook-table-v2-sizing"
        infoPanelVisible={infoPanelVisible}
        isIndexEditingMode={isIndexEditingMode}
      >
        <TableHeader
          activeSortBy={sortBy}
          activeSortOrder="ascending"
          showSettings
        />

        <TableBody
          data={MOCK_DATA}
          columns={columns}
          scrollContainerSelector=".section-scroll"
          onRow={(row) => ({
            className: selected.has(row.id) ? "table-row-selected" : undefined,
            onClick: () => toggleRow(row.id),
          })}
        />
      </TableContainer>
    </div>
  );
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: "UI/Data display/TableV2",
  component: TableDemo,
  parameters: {
    docs: {
      description: {
        component:
          "TanStack Table v8-based table component with cascading column resize, " +
          "virtualised rows, hideColumns mode, settings panel, and group menu.",
      },
    },
  },
  argTypes: {
    infoPanelVisible: {
      control: "boolean",
      description: "Use info panel localStorage key when true",
    },
    isIndexEditingMode: {
      control: "boolean",
      description: "Hides resize handles; enables inline editing UI",
    },
    sortBy: {
      control: "select",
      options: ["name", "members", "manager"],
      description: "External active sort key",
    },
  },
} satisfies Meta<typeof TableDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    infoPanelVisible: false,
    isIndexEditingMode: false,
    sortBy: "name",
  },
};
