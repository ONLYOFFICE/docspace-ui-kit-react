import React, { useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import ViewRowsReactSvg from "../../assets/view-rows.react.svg";
import ViewTilesReactSvg from "../../assets/view-tiles.react.svg";

import { DeviceType, FilterGroups, SortByFieldName } from "../../enums";

import Navigation from "../navigation/Navigation";
import Filter from "../filter";
import {
  TableContainer,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../table";

import Section from "./index";

const COLUMN_STORAGE_NAME = "section-story-columns";
const COLUMN_INFO_PANEL_STORAGE_NAME = "section-story-columns-info";

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
    onChange: () => {},
    onClick: () => {},
  },
  {
    key: "type",
    title: "Type",
    enable: true,
    resizable: true,
    sortBy: SortByFieldName.Type,
    onChange: () => {},
    onClick: () => {},
  },
  {
    key: "tags",
    title: "Tags",
    enable: true,
    resizable: true,
    sortBy: SortByFieldName.Tags,
    withTagRef: true,
    onChange: () => {},
    onClick: () => {},
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

const noop = () => {};

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
        {
          id: "filter_type-presentations",
          key: "presentations",
          group: FilterGroups.filterType,
          label: "Presentations",
        },
        {
          id: "filter_type-images",
          key: "images",
          group: FilterGroups.filterType,
          label: "Images",
        },
      ])
    }
    getSelectedFilterData={() => Promise.resolve([])}
  />
);

const TableContent = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const rows = mockFiles.map((file, index) => (
    <TableRow key={`row-${index}`}>
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

const meta: Meta<typeof Section> = {
  title: "Components/Layout Components/Section",
  component: Section,
  parameters: {
    docs: {
      description: {
        component:
          "Section component with header, filter, body, and footer sub-components. " +
          "This example demonstrates a realistic layout with Navigation in the header, " +
          "Filter in the filter area, and a Table in the body.",
      },
    },
  },
  argTypes: {
    currentDeviceType: {
      control: "select",
      options: Object.values(DeviceType),
      defaultValue: DeviceType.desktop,
    },
    withBodyScroll: {
      control: "boolean",
      defaultValue: true,
    },
    isHeaderVisible: {
      control: "boolean",
      defaultValue: true,
    },
    isInfoPanelAvailable: {
      control: "boolean",
      defaultValue: false,
    },
    isInfoPanelVisible: {
      control: "boolean",
      defaultValue: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Section>;

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
  args: {
    currentDeviceType: DeviceType.desktop,
    withBodyScroll: true,
    isHeaderVisible: true,
    isInfoPanelAvailable: false,
  },
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
};
