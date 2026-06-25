# Filter

A compound filter bar component that combines search input, sort controls, view selector, and a filter block with various filter types (tags, checkboxes, selectors, toggle buttons, and options).

## Usage

```tsx
import { Filter } from "@docspace/ui-kit/components/filter";

<Filter
  onSearch={handleSearch}
  onClearFilter={handleClearFilter}
  clearSearch={false}
  setClearSearch={setClearSearch}
  getSelectedInputValue={() => searchValue}
  placeholder="Search..."
  getFilterData={getFilterData}
  onFilter={handleFilter}
  getSortData={getSortData}
  getSelectedSortData={getSelectedSortData}
  onSort={handleSort}
  onChangeViewAs={handleChangeView}
  view="row"
  viewAs="row"
  viewSelectorVisible
  onSortButtonClick={handleSortClick}
  getSelectedFilterData={getSelectedFilterData}
  getViewSettingsData={getViewSettingsData}
  clearAll={handleClearAll}
  isRecentFolder={false}
  removeSelectedItem={handleRemoveItem}
  isIndexing={false}
  isIndexEditingMode={false}
  filterTitle="Filter"
  sortByTitle="Sort by"
  filterHeader="Filter"
  selectorLabel="Select"
  userId="user-id"
  isRooms={false}
  isContactsPage={false}
  isContactsPeoplePage={false}
  isContactsGroupsPage={false}
  isContactsInsideGroupPage={false}
  isContactsGuestsPage={false}
  currentDeviceType={DeviceType.desktop}
/>
```

## Features

- **Search input**: Text search with clear functionality
- **Sort controls**: Configurable sort options with direction toggle
- **View selector**: Switch between row and tile views
- **Filter block**: Expandable panel with multiple filter group types
- **Selected filters**: Displays active filters as removable tags
- **Responsive**: Adapts layout based on `currentDeviceType`
- **Selector integration**: Supports custom selector rendering for complex filter types

## Sub-components

- **FilterButton** — Opens the filter block panel
- **SortButton** — Sort dropdown with direction toggle and view selector
- **FilterBlock** — Panel containing filter groups
- **ViewSelector** — Row/tile view toggle

## Key Types

- **`TItem`** — Filter item with group, key, label, and selection state
- **`TGroupItem`** — Union of tag, checkbox, selector, toggle, and option items
- **`FilterGroups`** — Enum identifying each filter group
