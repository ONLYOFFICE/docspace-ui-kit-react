import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { FilterGroups, FilterSelectorTypes } from "../../../enums";
import FilterBlockItem from "./FilterBlockItem";
import type { TGroupItem } from "../Filter.types";

const renderItem = (groupItem: TGroupItem[], showSelector = vi.fn()) =>
  render(
    <FilterBlockItem
      group={FilterGroups.roomFilterContent}
      label="Instructions"
      groupItem={groupItem}
      isLast={false}
      withoutHeader={false}
      withoutSeparator={false}
      changeFilterValue={vi.fn()}
      showSelector={showSelector}
      isFirst={false}
      withMultiItems={false}
    />,
  );

describe("<FilterBlockItem /> selector item", () => {
  afterEach(cleanup);

  it("opens the selector named by selectorType, not the group's default", async () => {
    const showSelector = vi.fn();
    renderItem(
      [
        {
          key: "pick-room",
          group: FilterGroups.roomFilterContent,
          label: "Select room",
          displaySelectorType: "button",
          selectorType: FilterSelectorTypes.rooms,
        },
      ],
      showSelector,
    );

    await userEvent.click(screen.getByText("Select room"));

    expect(showSelector).toHaveBeenCalledWith(
      FilterSelectorTypes.rooms,
      FilterGroups.roomFilterContent,
    );
  });

  it("stays an add button while a plain option of its group is the choice", () => {
    renderItem([
      {
        key: "has",
        group: FilterGroups.roomFilterContent,
        label: "Has rooms",
        isSelected: true,
      },
      {
        key: "pick-room",
        group: FilterGroups.roomFilterContent,
        label: "Select room",
        displaySelectorType: "button",
        selectorType: FilterSelectorTypes.rooms,
        isSelected: true,
        selectedKey: "has",
        selectedLabel: "Has rooms",
      },
    ]);

    expect(screen.getByTestId("filter_selector_pick-room")).toBeTruthy();
    expect(
      screen.queryByTestId("filter_selector_selected_pick-room"),
    ).toBeNull();
  });

  it("shows the picked item in place of the button", () => {
    renderItem([
      {
        key: "has",
        group: FilterGroups.roomFilterContent,
        label: "Has rooms",
      },
      {
        key: "pick-room",
        group: FilterGroups.roomFilterContent,
        label: "Select room",
        displaySelectorType: "button",
        selectorType: FilterSelectorTypes.rooms,
        isSelected: true,
        selectedKey: "42",
        selectedLabel: "Brand voice",
      },
    ]);

    expect(
      screen.getByTestId("filter_selector_selected_pick-room").textContent,
    ).toContain("Brand voice");
  });
});
