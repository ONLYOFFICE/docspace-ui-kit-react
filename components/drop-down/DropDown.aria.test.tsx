import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { DropDownItem } from "../drop-down-item";
import { DropDown } from ".";

describe("DropDown aria-*", () => {
  it("puts a passed aria-* on the menu, its aria-label over ariaLabel", () => {
    render(
      <DropDown
        open
        directionX="left"
        directionY="bottom"
        ariaLabel="Menu"
        aria-label="Sort by"
        aria-describedby="sort-hint"
      >
        <DropDownItem label="Name" />
      </DropDown>,
    );

    expect(screen.getByRole("listbox", { name: "Sort by" })).toHaveAttribute(
      "aria-describedby",
      "sort-hint",
    );
  });
});
