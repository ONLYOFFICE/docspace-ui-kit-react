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
import { useRef } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import ViewRowsReactSvg from "../../assets/view-rows.react.svg";
import ViewTilesReactSvg from "../../assets/view-tiles.react.svg";
import { DeviceType, FilterGroups, SortByFieldName } from "../../enums";
import Navigation from "../navigation/Navigation";
import { Filter } from "../filter";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHeader,
  TableRow,
} from "../table";

import { Section } from "./index";

const meta = {
  title: "UI/Layout/Section",
  component: Section,
  parameters: {
    docs: {
      description: {
        component: `Section is the main content area layout component with header, filter, body, and footer sub-components.

### Features

- **Compound Components**: Header, Filter, Body, Footer, Warning, and Submenu sub-components
- **Info Panel**: Optional side panel for displaying additional information
- **Responsive Layout**: Adapts to desktop, tablet, and mobile device types
- **Body Scroll**: Configurable scroll behavior for the body content
- **File Drop**: Built-in drag-and-drop file upload support

### Usage

\`\`\`tsx
import Section from "@docspace/ui-kit/components/section";

<Section currentDeviceType={DeviceType.desktop} withBodyScroll>
  <Section.SectionHeader>
    <Navigation title="Documents" />
  </Section.SectionHeader>
  <Section.SectionFilter>
    <Filter />
  </Section.SectionFilter>
  <Section.SectionBody>
    <TableContent />
  </Section.SectionBody>
  <Section.SectionFooter>{null}</Section.SectionFooter>
</Section>
\`\`\``,
      },
    },
  },
  argTypes: {
    currentDeviceType: {
      control: "select",
      options: Object.values(DeviceType),
      description: "Current device type for responsive layout",
      table: {
        defaultValue: { summary: "desktop" },
      },
    },
    withBodyScroll: {
      control: "boolean",
      description: "Enables scroll within the section body",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isHeaderVisible: {
      control: "boolean",
      description: "Controls header section visibility",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isInfoPanelAvailable: {
      control: "boolean",
      description: "Whether the info panel can be displayed",
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
  },
} satisfies Meta<typeof Section>;

type Story = StoryObj<ComponentProps<typeof Section>>;

export default meta;

const COLUMN_STORAGE_NAME = "section-story-columns";
const COLUMN_INFO_PANEL_STORAGE_NAME = "section-story-columns-info";

const noop = () => {};

const mockNavigationItems = [
  { id: "1", title: "Documents", isRootRoom: false },
  { id: "2", title: "Shared with me", isRootRoom: false },
  { id: "3", title: "Project files", isRootRoom: true },
];

const mockSortData = [
  {
    key: "name",
    label: "Name",
    isSelected: false,
    id: "1",
    className: "",
    sortDirection: "asc" as const,
    sortId: "1",
  },
  {
    key: "modified",
    label: "Modified",
    isSelected: false,
    id: "2",
    className: "",
    sortDirection: "asc" as const,
    sortId: "1",
  },
  {
    key: "size",
    label: "Size",
    isSelected: false,
    id: "3",
    className: "",
    sortDirection: "asc" as const,
    sortId: "1",
  },
];

const mockViewSettings = [
  { id: "1", label: "Grid", value: "tile", icon: <ViewTilesReactSvg /> },
  { id: "2", label: "List", value: "row", icon: <ViewRowsReactSvg /> },
];

const mockColumns = [
  {
    key: "name",
    title: "Name",
    resizable: true,
    enable: true,
    default: true,
    sortBy: SortByFieldName.Name,
    minWidth: 210,
    onChange: noop,
    onClick: noop,
  },
  {
    key: "type",
    title: "Type",
    enable: true,
    resizable: true,
    sortBy: SortByFieldName.Type,
    onChange: noop,
    onClick: noop,
  },
  {
    key: "tags",
    title: "Tags",
    enable: true,
    resizable: true,
    sortBy: SortByFieldName.Tags,
    withTagRef: true,
    onChange: noop,
    onClick: noop,
  },
];

const mockFiles = [
  { name: "Annual Report 2025.docx", type: "Document", tags: "Finance" },
  { name: "Q4 Budget.xlsx", type: "Spreadsheet", tags: "Finance" },
  { name: "Team Presentation.pptx", type: "Presentation", tags: "Marketing" },
  { name: "Logo Design.png", type: "Image", tags: "Design" },
  { name: "Meeting Notes.docx", type: "Document", tags: "General" },
  { name: "Product Roadmap.pdf", type: "PDF", tags: "Product" },
  { name: "User Research.docx", type: "Document", tags: "UX" },
  { name: "Sprint Backlog.xlsx", type: "Spreadsheet", tags: "Engineering" },
  { name: "Brand Guidelines.pdf", type: "PDF", tags: "Marketing" },
  { name: "Architecture Diagram.png", type: "Image", tags: "Engineering" },
];

const NavigationHeader = () => (
  <Navigation
    title="My Documents"
    isRootFolder={false}
    canCreate
    showText
    isDesktop
    isRoom={false}
    withMenu
    showTitle
    showRootFolderTitle
    showNavigationButton={false}
    isInfoPanelVisible={false}
    isCurrentFolderInfo={false}
    currentDeviceType={DeviceType.desktop}
    navigationItems={mockNavigationItems}
    onClickFolder={noop}
    onBackToParentFolder={noop}
    clearTrash={noop}
    getContextOptionsFolder={() => [
      { key: "rename", label: "Rename" },
      { key: "delete", label: "Delete" },
    ]}
    getContextOptionsPlus={() => [
      { key: "upload", label: "Upload file" },
      { key: "create", label: "Create folder" },
    ]}
    toggleInfoPanel={noop}
    hideInfoPanel={noop}
    showFolderInfo={noop}
    onPlusClick={noop}
    withLogo={false}
    burgerLogo=""
    titleIcon=""
    rootRoomTitle=""
  />
);

const FilterContent = () => (
  <Filter
    viewAs="row"
    view="row"
    placeholder="Search..."
    filterTitle="Filter"
    sortByTitle="Sort by"
    filterHeader="Filter"
    selectorLabel="Select"
    userId="1"
    currentDeviceType={DeviceType.desktop}
    viewSelectorVisible
    isRooms={false}
    isContactsPage={false}
    isContactsPeoplePage={false}
    isContactsGroupsPage={false}
    isContactsInsideGroupPage={false}
    isContactsGuestsPage={false}
    isIndexing={false}
    isIndexEditingMode={false}
    isRecentFolder={false}
    clearSearch={false}
    setClearSearch={noop}
    onSearch={noop}
    onClearFilter={noop}
    onChangeViewAs={noop}
    onSort={noop}
    onFilter={noop}
    onSortButtonClick={noop}
    removeSelectedItem={noop}
    clearAll={noop}
    getSelectedInputValue={() => ""}
    getSortData={() => mockSortData}
    getSelectedSortData={() => ({ sortDirection: "asc", sortId: "AZ" })}
    getViewSettingsData={() => mockViewSettings}
    getFilterData={() =>
      Promise.resolve([
        {
          key: FilterGroups.filterType,
          group: FilterGroups.filterType,
          label: "Type",
          isHeader: true,
          isLast: true,
        },
        {
          id: "filter_type-documents",
          key: "documents",
          group: FilterGroups.filterType,
          label: "Documents",
        },
        {
          id: "filter_type-spreadsheets",
          key: "spreadsheets",
          group: FilterGroups.filterType,
          label: "Spreadsheets",
        },
      ])
    }
    getSelectedFilterData={() => Promise.resolve([])}
  />
);

const TableContent = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const rows = mockFiles.map((file) => (
    <TableRow key={`row-${file.name}`}>
      <TableCell>{file.name}</TableCell>
      <TableCell>{file.type}</TableCell>
      <TableCell>{file.tags}</TableCell>
    </TableRow>
  ));

  return (
    <TableContainer forwardedRef={containerRef} useReactWindow={false}>
      <TableHeader
        containerRef={containerRef}
        columns={mockColumns}
        columnStorageName={COLUMN_STORAGE_NAME}
        columnInfoPanelStorageName={COLUMN_INFO_PANEL_STORAGE_NAME}
        sectionWidth={800}
        useReactWindow={false}
        showSettings
        sortingVisible
        sorted
      />
      <TableBody
        columnStorageName={COLUMN_STORAGE_NAME}
        columnInfoPanelStorageName={COLUMN_INFO_PANEL_STORAGE_NAME}
        fetchMoreFiles={async () => {}}
        filesLength={mockFiles.length}
        hasMoreFiles={false}
        itemCount={mockFiles.length}
        itemHeight={50}
        useReactWindow={false}
      >
        {rows}
      </TableBody>
    </TableContainer>
  );
};

const sectionLabelStyle: React.CSSProperties = {
  position: "absolute",
  top: "2px",
  insetInlineEnd: "4px",
  fontSize: "10px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  padding: "1px 6px",
  borderRadius: "3px",
  zIndex: 300,
  pointerEvents: "none",
};

export const Default: Story = {
  render: (args) => (
    <div style={{ width: "100%", height: "600px" }}>
      <Section {...args}>
        <Section.SectionHeader>
          <div
            style={{
              paddingBottom: "12px",
              border: "2px dashed #2196F3",
              borderRadius: "4px",
              position: "relative",
              background: "white",
              zIndex: 202,
            }}
          >
            <span
              style={{
                ...sectionLabelStyle,
                color: "#2196F3",
                backgroundColor: "#E3F2FD",
              }}
            >
              Header
            </span>
            <NavigationHeader />
          </div>
        </Section.SectionHeader>
        <Section.SectionFilter>
          <div
            style={{
              padding: "8px 0",
              border: "2px dashed #FF9800",
              borderRadius: "4px",
              position: "relative",
              background: "white",
              zIndex: 202,
            }}
          >
            <span
              style={{
                ...sectionLabelStyle,
                color: "#FF9800",
                backgroundColor: "#FFF3E0",
              }}
            >
              Filter
            </span>
            <FilterContent />
          </div>
        </Section.SectionFilter>
        <Section.SectionBody>
          <div
            style={{
              marginLeft: "-20px",
              marginTop: "8px",
              border: "2px dashed #4CAF50",
              borderRadius: "4px",
              position: "relative",
            }}
          >
            <span
              style={{
                ...sectionLabelStyle,
                color: "#4CAF50",
                backgroundColor: "#E8F5E9",
              }}
            >
              Body
            </span>
            <TableContent />
          </div>
        </Section.SectionBody>
        <Section.SectionFooter>{null}</Section.SectionFooter>
      </Section>
    </div>
  ),
  args: {
    currentDeviceType: DeviceType.desktop,
    withBodyScroll: true,
    isHeaderVisible: true,
    isInfoPanelAvailable: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Complete Section layout with Navigation header, Filter bar, and Table body. Each section is outlined with a dashed border and labeled.",
      },
      source: {
        code: `<Section currentDeviceType={DeviceType.desktop} withBodyScroll isHeaderVisible>
  <Section.SectionHeader>
    <Navigation title="My Documents" />
  </Section.SectionHeader>
  <Section.SectionFilter>
    <Filter />
  </Section.SectionFilter>
  <Section.SectionBody>
    <TableContent />
  </Section.SectionBody>
  <Section.SectionFooter>{null}</Section.SectionFooter>
</Section>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: (args) => (
    <div
      style={
        {
          width: "100%",
          height: "600px",
          // Section header background
          "--section-bg": "#e6f3fb",
          // Section header size
          "--section-header-size": "56px",
          // Section footer
          "--section-footer-margin": "24px",
          // Info panel customization
          "--info-panel-background": "#e6f3fb",
          "--info-panel-border-color": "#0082c9",
          "--info-panel-backdrop": "rgba(0, 130, 201, 0.08)",
          "--info-panel-width": "360px",
          // Navigation sub-component
          "--navigation-root-folder-title-color": "#0082c9",
          "--navigation-background": "#e6f3fb",
          "--navigation-box-shadow": "0 2px 8px rgba(0,130,201,0.15)",
          // Filter sub-component
          "--filter-button-border": "1px solid #0082c9",
          "--filter-button-hover-border": "1px solid #006fa6",
          "--filter-block-background": "#e6f3fb",
          "--filter-sort-button-background": "#e6f3fb",
          // Table sub-component (used in SectionBody)
          "--table-header-border-bottom": "1px solid #0082c9",
          // IconButton (used in Navigation and Filter)
          "--icon-button-color": "#0082c9",
          "--icon-button-hover-color": "#006fa6",
        } as React.CSSProperties
      }
    >
      <Section {...args}>
        <Section.SectionHeader>
          <NavigationHeader />
        </Section.SectionHeader>
        <Section.SectionFilter>
          <FilterContent />
        </Section.SectionFilter>
        <Section.SectionBody>
          <TableContent />
        </Section.SectionBody>
        <Section.InfoPanelHeader>
          <div style={{ padding: "8px 0", fontWeight: 600, color: "#0082c9" }}>
            Info Panel
          </div>
        </Section.InfoPanelHeader>
        <Section.InfoPanelBody>
          <div style={{ padding: "16px", color: "#0082c9" }}>
            Info panel content with custom Nextcloud-style blue theme.
          </div>
        </Section.InfoPanelBody>
        <Section.SectionFooter>{null}</Section.SectionFooter>
      </Section>
    </div>
  ),
  args: {
    currentDeviceType: DeviceType.desktop,
    withBodyScroll: true,
    isHeaderVisible: true,
    isInfoPanelAvailable: true,
    isInfoPanelVisible: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "CSS custom property overrides. Set on any ancestor element. Navigation and Filter sub-components can be customized via their own CSS vars.",
      },
    },
  },
};
