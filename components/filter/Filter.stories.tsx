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

import React, { useState, useEffect } from "react";

import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import ViewRowsReactSvg from "../../assets/view-rows.react.svg";
import ViewTilesReactSvg from "../../assets/view-tiles.react.svg";

import { DeviceType, FilterGroups, FilterKeys } from "../../enums";
import { Filter } from ".";
import type { FilterProps, TSortDataItem } from "./Filter.types";
import {
  ViewSelector,
  type ViewSelectorProps,
} from "./sub-components/ViewSelector";

const mockSortData: TSortDataItem[] = [
  {
    key: "name",
    label: "Name",
    isSelected: false,
    id: "1",
    className: "",
    sortDirection: "asc",
    sortId: "1",
  },
  {
    key: "modified",
    label: "Modified",
    isSelected: false,
    id: "2",
    className: "",
    sortDirection: "asc",
    sortId: "1",
  },
  {
    key: "size",
    label: "Size",
    isSelected: false,
    id: "3",
    className: "",
    sortDirection: "asc",
    sortId: "1",
  },
];

const mockViewSettings = [
  { id: "1", label: "Grid", value: "tile", icon: <ViewTilesReactSvg /> },
  { id: "2", label: "List", value: "row", icon: <ViewRowsReactSvg /> },
];

const defaultViewSettings = [
  { id: "row-view", value: "row", icon: <ViewRowsReactSvg /> },
  { id: "tile-view", value: "tile", icon: <ViewTilesReactSvg /> },
];

const baseFilterArgs: Partial<FilterProps> = {
  viewAs: "row",
  view: "row",
  getSortData: () => mockSortData,
  getSelectedSortData: () => ({ sortDirection: "asc", sortId: "AZ" }),
  getViewSettingsData: () => mockViewSettings,
  getSelectedFilterData: () => Promise.resolve([]),
  onSearch: (value) => console.log("Search:", value),
  onClearFilter: () => console.log("Clear filter"),
  onChangeViewAs: () => console.log("View changed"),
  onSort: (key, direction) => console.log("Sort by:", key, direction),
  onFilter: (items) => console.log("Filter applied:", items),
  onSortButtonClick: (value) => console.log("Sort button clicked:", value),
  filterTitle: "Filter",
  sortByTitle: "Sort by",
  filterHeader: "Filter",
  selectorLabel: "Select",
  viewSelectorVisible: true,
  placeholder: "Search...",
  userId: "1",
  currentDeviceType: DeviceType.desktop,
  initSelectedFilterData: [],
};

const meta = {
  title: "UI/Layout/Filter",
  component: Filter,
  parameters: {
    docs: {
      description: {
        component: `Filter component for filtering and sorting data in table or grid views.

### Features

- **Search Input**: Built-in search with clear functionality
- **Filter Groups**: Organize filters into categorized groups (type, status, author, etc.)
- **Sort Options**: Configurable sort fields with direction toggle
- **View Selector**: Switch between grid and list views
- **Pre-selected Filters**: Support for initial filter state
- **Room Filtering**: Specialized room filter mode
- **Disabled State**: Full disabled state for indexing mode
- **Responsive**: Adapts to different device types

### Usage

\`\`\`tsx
import Filter from "@docspace/ui-kit/components/filter";

<Filter
  placeholder="Search..."
  onSearch={(value) => console.log(value)}
  getSortData={() => sortData}
  getSelectedSortData={() => selectedSort}
  getFilterData={() => Promise.resolve(filterItems)}
  getSelectedFilterData={() => Promise.resolve([])}
  getViewSettingsData={() => viewSettings}
  onSort={(key, dir) => console.log(key, dir)}
  onFilter={(items) => console.log(items)}
  currentDeviceType={DeviceType.desktop}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text for the search input",
    },
    viewAs: {
      control: "select",
      options: ["row", "tile"],
      description: "Current view mode",
      table: {
        defaultValue: { summary: "row" },
      },
    },
    viewSelectorVisible: {
      control: "boolean",
      description: "Whether to show the view selector toggle",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isRooms: {
      control: "boolean",
      description: "Enables room-specific filter mode",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isIndexEditingMode: {
      control: "boolean",
      description: "Disables the filter during index editing",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isIndexing: {
      control: "boolean",
      description: "Disables the filter during indexing",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onSearch: {
      action: "onSearch",
      description: "Callback when search value changes",
    },
    onClearFilter: {
      action: "onClearFilter",
      description: "Callback when filters are cleared",
    },
    onChangeViewAs: {
      action: "onChangeViewAs",
      description: "Callback when view mode changes",
    },
    onSort: {
      action: "onSort",
      description: "Callback when sort option changes",
    },
    onFilter: {
      action: "onFilter",
      description: "Callback when filter is applied",
    },
    onSortButtonClick: {
      action: "onSortButtonClick",
      description: "Callback when sort button is clicked",
    },
  },
} satisfies Meta<typeof Filter>;

type Story = StoryObj<ComponentProps<typeof Filter>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return <div style={{ height: "140px" }}>{props.children}</div>;
};

const OpenFilterOnMount = (props: { children: React.ReactNode }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const filterButton = document.querySelector(
        '[data-testid="filter_icon_button"]',
      ) as HTMLElement;
      if (filterButton) {
        filterButton.click();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return <>{props.children}</>;
};

const DocumentTypesTemplate = () => {
  return (
    <Wrapper>
      <OpenFilterOnMount>
        <Filter
          {...(baseFilterArgs as FilterProps)}
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
                isLast: true,
              },
            ])
          }
        />
      </OpenFilterOnMount>
    </Wrapper>
  );
};

export const DocumentTypes: Story = {
  render: () => <DocumentTypesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Basic filter with document type options. Shows filter items for different document types. The filter dropdown automatically opens when the story loads.",
      },
      source: {
        code: `<Filter
  getFilterData={() => Promise.resolve([
    { key: FilterGroups.filterType, group: FilterGroups.filterType, label: "Type", isHeader: true, isLast: true },
    { id: "filter_type-documents", key: "documents", group: FilterGroups.filterType, label: "Documents" },
    { id: "filter_type-spreadsheets", key: "spreadsheets", group: FilterGroups.filterType, label: "Spreadsheets" },
    { id: "filter_type-presentations", key: "presentations", group: FilterGroups.filterType, label: "Presentations" },
    { id: "filter_type-images", key: "images", group: FilterGroups.filterType, label: "Images", isLast: true },
  ])}
  ...otherProps
/>`,
      },
    },
  },
};

const WithSelectedFiltersTemplate = () => {
  return (
    <Wrapper>
      <OpenFilterOnMount>
        <Filter
          {...(baseFilterArgs as FilterProps)}
          getSelectedFilterData={() =>
            Promise.resolve([
              {
                id: "filter_type-documents",
                key: "documents",
                group: FilterGroups.filterType,
                label: "Documents",
                isSelected: true,
              },
            ])
          }
          getFilterData={() =>
            Promise.resolve([
              {
                key: FilterGroups.filterType,
                group: FilterGroups.filterType,
                label: "Type",
                isHeader: true,
                isLast: true,
                isSelected: false,
              },
              {
                id: "filter_type-documents",
                key: "documents",
                group: FilterGroups.filterType,
                label: "Documents",
                isSelected: true,
              },
              {
                id: "filter_type-spreadsheets",
                key: "spreadsheets",
                group: FilterGroups.filterType,
                label: "Spreadsheets",
                isSelected: false,
              },
              {
                id: "filter_type-presentations",
                key: "presentations",
                group: FilterGroups.filterType,
                label: "Presentations",
                isSelected: false,
              },
              {
                id: "filter_type-images",
                key: "images",
                group: FilterGroups.filterType,
                label: "Images",
                isSelected: false,
              },
            ])
          }
          initSelectedFilterData={[
            {
              id: "filter_type-documents",
              key: "documents",
              group: FilterGroups.filterType,
              label: "Documents",
              isSelected: true,
            },
          ]}
        />
      </OpenFilterOnMount>
    </Wrapper>
  );
};

export const WithSelectedFilters: Story = {
  render: () => <WithSelectedFiltersTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Filter with pre-selected options. Shows how the filter looks with some options already selected. The filter dropdown automatically opens when the story loads.",
      },
      source: {
        code: `<Filter
  initSelectedFilterData={[
    { id: "filter_type-documents", key: "documents", group: FilterGroups.filterType, label: "Documents", isSelected: true },
  ]}
  ...otherProps
/>`,
      },
    },
  },
};

const MultipleFilterGroupsTemplate = () => {
  return (
    <Wrapper>
      <OpenFilterOnMount>
        <Filter
          {...(baseFilterArgs as FilterProps)}
          getFilterData={() =>
            Promise.resolve([
              {
                key: FilterGroups.filterType,
                group: FilterGroups.filterType,
                label: "Type",
                isHeader: true,
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
                key: FilterGroups.filterStatus,
                group: FilterGroups.filterStatus,
                label: "Status",
                isHeader: true,
              },
              {
                id: "filter_status-active",
                key: "active",
                group: FilterGroups.filterStatus,
                label: "Active",
              },
              {
                id: "filter_status-archived",
                key: "archived",
                group: FilterGroups.filterStatus,
                label: "Archived",
              },
              {
                key: FilterGroups.filterAuthor,
                group: FilterGroups.filterAuthor,
                label: "Author",
                isHeader: true,
                isLast: true,
              },
              {
                id: "filter_author-me",
                key: "me",
                group: FilterGroups.filterAuthor,
                label: "Me",
              },
              {
                id: "filter_author-shared",
                key: "shared",
                group: FilterGroups.filterAuthor,
                label: "Shared with me",
              },
            ])
          }
        />
      </OpenFilterOnMount>
    </Wrapper>
  );
};

export const MultipleFilterGroups: Story = {
  render: () => <MultipleFilterGroupsTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Filter with multiple filter groups. Shows how the filter displays different categories of filter options (Type, Status, Author). The filter dropdown automatically opens when the story loads.",
      },
      source: {
        code: `<Filter
  getFilterData={() => Promise.resolve([
    { key: FilterGroups.filterType, label: "Type", isHeader: true },
    { key: "documents", label: "Documents", group: FilterGroups.filterType },
    { key: FilterGroups.filterStatus, label: "Status", isHeader: true },
    { key: "active", label: "Active", group: FilterGroups.filterStatus },
    { key: FilterGroups.filterAuthor, label: "Author", isHeader: true, isLast: true },
    { key: "me", label: "Me", group: FilterGroups.filterAuthor },
  ])}
  ...otherProps
/>`,
      },
    },
  },
};

const RoomsFilterTemplate = () => {
  return (
    <Wrapper>
      <OpenFilterOnMount>
        <Filter
          {...(baseFilterArgs as FilterProps)}
          isRooms
          getFilterData={() =>
            Promise.resolve([
              {
                key: FilterGroups.filterRoom,
                group: FilterGroups.filterRoom,
                label: "Room",
                isHeader: true,
                isLast: true,
              },
              {
                id: "filter_room-all",
                key: FilterKeys.withContent,
                group: FilterGroups.filterRoom,
                label: "All Rooms",
              },
              {
                id: "filter_room-marketing",
                key: "room-1",
                group: FilterGroups.filterRoom,
                label: "Marketing Room",
              },
              {
                id: "filter_room-development",
                key: "room-2",
                group: FilterGroups.filterRoom,
                label: "Development Room",
              },
              {
                id: "filter_room-sales",
                key: "room-3",
                group: FilterGroups.filterRoom,
                label: "Sales Room",
                isLast: true,
              },
            ])
          }
        />
      </OpenFilterOnMount>
    </Wrapper>
  );
};

export const RoomsFilter: Story = {
  render: () => <RoomsFilterTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Filter with room options. Shows room filter items in room-specific mode. The filter dropdown automatically opens when the story loads.",
      },
      source: {
        code: `<Filter
  isRooms
  getFilterData={() => Promise.resolve([
    { key: FilterGroups.filterRoom, label: "Room", isHeader: true, isLast: true },
    { key: FilterKeys.withContent, label: "All Rooms", group: FilterGroups.filterRoom },
    { key: "room-1", label: "Marketing Room", group: FilterGroups.filterRoom },
    { key: "room-2", label: "Development Room", group: FilterGroups.filterRoom },
  ])}
  ...otherProps
/>`,
      },
    },
  },
};

const DisabledFilterTemplate = () => {
  return (
    <Wrapper>
      <Filter
        {...(baseFilterArgs as FilterProps)}
        isIndexEditingMode
        isIndexing
        getFilterData={() => Promise.resolve([])}
      />
    </Wrapper>
  );
};

export const DisabledFilter: Story = {
  render: () => <DisabledFilterTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Filter in completely disabled state. Shows how the filter appears when disabled during indexing mode.",
      },
      source: {
        code: `<Filter isIndexEditingMode isIndexing getFilterData={() => Promise.resolve([])} ...otherProps />`,
      },
    },
  },
};

// --- ViewSelector Stories ---

const InteractiveViewSelectorTemplate = ({
  viewAs: argsViewAs,
  onChangeView: _,
  ...rest
}: ViewSelectorProps) => {
  const [viewAs, setViewAs] = useState(argsViewAs);

  useEffect(() => {
    setViewAs(argsViewAs);
  }, [argsViewAs]);

  return (
    <ViewSelector
      {...rest}
      viewAs={viewAs}
      onChangeView={(view) => setViewAs(view)}
    />
  );
};

const ViewSelectorDefaultTemplate = () => {
  return (
    <InteractiveViewSelectorTemplate
      viewSettings={defaultViewSettings}
      viewAs="row"
      isDisabled={false}
      isFilter={false}
      onChangeView={() => {}}
    />
  );
};

export const ViewSelectorDefault: Story = {
  render: () => <ViewSelectorDefaultTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Default ViewSelector with row and tile view options. Click the icons to toggle between views.",
      },
      source: {
        code: `<ViewSelector
  viewSettings={[
    { id: "row-view", value: "row", icon: <ViewRowsReactSvg /> },
    { id: "tile-view", value: "tile", icon: <ViewTilesReactSvg /> },
  ]}
  viewAs="row"
  onChangeView={(view) => setViewAs(view)}
/>`,
      },
    },
  },
};

const ViewSelectorDisabledTemplate = () => {
  return (
    <InteractiveViewSelectorTemplate
      viewSettings={defaultViewSettings}
      viewAs="row"
      isDisabled
      isFilter={false}
      onChangeView={() => {}}
    />
  );
};

export const ViewSelectorDisabled: Story = {
  render: () => <ViewSelectorDisabledTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "ViewSelector in a disabled state. The view toggle icons are not interactive.",
      },
      source: {
        code: `<ViewSelector viewSettings={viewSettings} viewAs="row" isDisabled />`,
      },
    },
  },
};

const ViewSelectorFilterModeTemplate = () => {
  return (
    <InteractiveViewSelectorTemplate
      viewSettings={defaultViewSettings}
      viewAs="row"
      isDisabled={false}
      isFilter
      onChangeView={() => {}}
    />
  );
};

export const ViewSelectorFilterMode: Story = {
  render: () => <ViewSelectorFilterModeTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "ViewSelector in filter mode. Shows the selector with filter-specific styling applied.",
      },
      source: {
        code: `<ViewSelector viewSettings={viewSettings} viewAs="row" isFilter />`,
      },
    },
  },
};
