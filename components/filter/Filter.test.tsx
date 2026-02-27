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

import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DeviceType } from "../../enums";
import { Filter } from ".";
import { TGetSelectedSortData, TSortDataItem } from "./Filter.types";
import { TViewAs } from "../../types";
import {
  ViewSelector,
  TViewSelectorOption,
} from "./sub-components/ViewSelector";

// Mock selectors
vi.mock("../../selectors/Groups", () => ({
  __esModule: true,
  default: ({ onSelect }: { onSelect: (items: unknown) => void }) => (
    <div data-testid="groups-selector">
      <button
        type="button"
        onClick={() => onSelect({ key: "group1", label: "Group 1" })}
      >
        Select Group
      </button>
    </div>
  ),
}));

vi.mock("../../selectors/People", () => ({
  __esModule: true,
  default: ({ onSelect }: { onSelect: (items: unknown) => void }) => (
    <div data-testid="people-selector">
      <button
        type="button"
        onClick={() => onSelect({ key: "user1", label: "User 1" })}
      >
        Select User
      </button>
    </div>
  ),
}));

vi.mock("../../selectors/Room", () => ({
  __esModule: true,
  default: ({ onSelect }: { onSelect: (items: unknown) => void }) => (
    <div data-testid="room-selector">
      <button
        type="button"
        onClick={() => onSelect({ key: "room1", label: "Room 1" })}
      >
        Select Room
      </button>
    </div>
  ),
}));

const baseProps = {
  onSearch: vi.fn(),
  onClearFilter: vi.fn(),
  clearSearch: false,
  setClearSearch: vi.fn(),
  getSelectedInputValue: vi.fn(() => ""),
  placeholder: "Search...",
  isIndexEditingMode: false,
  getSortData: vi.fn(() => []),
  getSelectedSortData: vi.fn(
    () => ({}) as TSortDataItem,
  ) as TGetSelectedSortData,
  onChangeViewAs: vi.fn(),
  view: "tile",
  viewAs: "tile" as TViewAs,
  viewSelectorVisible: true,
  onSort: vi.fn(),
  getFilterData: vi.fn(() => Promise.resolve([])),
  getSelectedFilterData: vi.fn(() => Promise.resolve([])),
  getViewSettingsData: vi.fn(() => []),
  clearAll: vi.fn(),
  isRecentFolder: false,
  removeSelectedItem: vi.fn(),
  isRooms: false,
  isContactsPage: false,
  isContactsPeoplePage: false,
  isContactsGroupsPage: false,
  isContactsInsideGroupPage: false,
  isContactsGuestsPage: false,
  isIndexing: false,
  filterTitle: "Filter",
  sortByTitle: "Sort by",
  currentDeviceType: DeviceType.desktop,
  userId: "1",
  filterHeader: "Filter",
  selectorLabel: "Select",
  onFilter: vi.fn(),
  onSortButtonClick: vi.fn(() => Promise.resolve([])),
  setEditRoomGroupsDialogVisible: vi.fn(),
};

describe("Filter Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(<Filter {...baseProps} {...props} />);
  };

  describe("Search Input", () => {
    it("clears search when clearSearch prop is true", async () => {
      const onClearFilter = vi.fn();
      const setClearSearch = vi.fn();

      await act(async () => {
        renderComponent({
          clearSearch: true,
          onClearFilter,
          setClearSearch,
        });
      });

      expect(onClearFilter).toHaveBeenCalled();
      expect(setClearSearch).toHaveBeenCalledWith(false);
    });
  });
});

vi.mock("react-svg", () => ({
  ReactSVG: () => <div data-testid="mocked-svg" />,
}));

const mockViewSettings: TViewSelectorOption[] = [
  {
    value: "row",
    icon: "rowIcon.svg",
    id: "row-view",
  },
  {
    value: "tile",
    icon: "tileIcon.svg",
    id: "tile-view",
  },
  {
    value: "compact",
    icon: "compactIcon.svg",
    id: "compact-view",
  },
];

const viewSelectorDefaultProps = {
  isDisabled: false,
  isFilter: false,
  onChangeView: vi.fn(),
  viewAs: "row",
  viewSettings: mockViewSettings,
};

describe("<ViewSelector />", () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renders without error", () => {
    render(<ViewSelector {...viewSelectorDefaultProps} />);
    expect(screen.getByTestId("view-selector")).toBeInTheDocument();
  });

  it("renders all view options", () => {
    render(<ViewSelector {...viewSelectorDefaultProps} />);
    const icons = screen.getAllByTestId("view-selector-icon");
    expect(icons).toHaveLength(mockViewSettings.length);
  });

  it("calls onChangeView when clicking a view option", async () => {
    const onChangeView = vi.fn();
    render(
      <ViewSelector
        {...viewSelectorDefaultProps}
        onChangeView={onChangeView}
      />,
    );

    const icons = screen.getAllByTestId("view-selector-icon");
    const tileIcon = icons.find(
      (icon) => icon.getAttribute("data-view") === "tile",
    );
    await userEvent.click(tileIcon!);

    expect(onChangeView).toHaveBeenCalledWith("tile");
  });

  it("does not call onChangeView when disabled", async () => {
    const onChangeView = vi.fn();
    render(
      <ViewSelector
        {...viewSelectorDefaultProps}
        onChangeView={onChangeView}
        isDisabled
      />,
    );

    const icons = screen.getAllByTestId("view-selector-icon");
    const tileIcon = icons.find(
      (icon) => icon.getAttribute("data-view") === "tile",
    );
    await userEvent.click(tileIcon!);

    expect(onChangeView).not.toHaveBeenCalled();
  });

  it("applies custom className and style", () => {
    const customStyle = { backgroundColor: "red" };
    render(
      <ViewSelector
        {...viewSelectorDefaultProps}
        className="custom-class"
        style={customStyle}
      />,
    );

    const viewSelector = screen.getByTestId("view-selector");
    expect(viewSelector).toHaveClass("custom-class");
    expect(viewSelector.style.backgroundColor).toBe("red");
  });

  it("renders only one icon when isFilter is true", () => {
    render(
      <ViewSelector {...viewSelectorDefaultProps} viewAs="row" isFilter />,
    );

    const icons = screen.getAllByTestId("view-selector-icon");
    expect(icons).toHaveLength(1);
  });

  it("executes callback function when provided in viewSettings", async () => {
    const callback = vi.fn();
    const settingsWithCallback = [
      { ...mockViewSettings[0], callback },
      mockViewSettings[1],
    ];

    render(
      <ViewSelector
        {...viewSelectorDefaultProps}
        viewAs="tile"
        viewSettings={settingsWithCallback}
      />,
    );

    const icons = screen.getAllByTestId("view-selector-icon");
    const rowIcon = icons.find(
      (icon) => icon.getAttribute("data-view") === "row",
    );
    await userEvent.click(rowIcon!);

    expect(callback).toHaveBeenCalled();
  });
});
