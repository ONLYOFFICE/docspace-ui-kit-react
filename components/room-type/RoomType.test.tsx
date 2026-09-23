import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { RoomsType } from "../../enums";

import RoomType from ".";

const baseProps = {
  isOpen: false,
  selectedId: "room-1",
};

const getArrow = (root: HTMLElement) =>
  root.querySelector(".choose_room-forward_btn") as HTMLElement;

describe("<RoomType />", () => {
  it("renders the list item by default with the room's title", () => {
    render(
      <RoomType
        {...baseProps}
        roomType={RoomsType.EditingRoom}
        onClick={vi.fn()}
      />,
    );

    const root = screen.getByTestId("room-type-list-item");
    expect(root).toHaveAttribute("data-selected-id", "room-1");
    expect(root).toHaveTextContent("Collaboration room");
  });

  describe.each([
    ["listItem", "room-type-list-item"],
    ["dropdownButton", "room-type-dropdown-button"],
    ["dropdownItem", "room-type-dropdown-item"],
  ] as const)("%s", (type, testId) => {
    it("calls onClick once when the body is clicked", () => {
      const onClick = vi.fn();
      render(
        <RoomType
          {...baseProps}
          type={type}
          roomType={RoomsType.CustomRoom}
          onClick={onClick}
        />,
      );

      fireEvent.click(screen.getByText("Custom room"));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("calls onClick once when the arrow is clicked", () => {
      const onClick = vi.fn();
      render(
        <RoomType
          {...baseProps}
          type={type}
          roomType={RoomsType.CustomRoom}
          onClick={onClick}
        />,
      );

      fireEvent.click(getArrow(screen.getByTestId(testId)));

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("disabled", () => {
    it.each([
      ["listItem", "room-type-list-item"],
      ["dropdownItem", "room-type-dropdown-item"],
    ] as const)("%s ignores clicks on a disabled FormRoom", (type, testId) => {
      const onClick = vi.fn();
      render(
        <RoomType
          {...baseProps}
          type={type}
          roomType={RoomsType.FormRoom}
          disabledFormRoom
          onClick={onClick}
        />,
      );

      const root = screen.getByTestId(testId);
      fireEvent.click(root);
      fireEvent.click(getArrow(root));

      expect(onClick).not.toHaveBeenCalled();
      expect(root).toHaveAttribute("aria-disabled", "true");
      expect(root).toHaveAttribute("data-tooltip-id", "create-room-tooltip");
    });

    it("ignores clicks on a disabled PublicRoom", () => {
      const onClick = vi.fn();
      render(
        <RoomType
          {...baseProps}
          roomType={RoomsType.PublicRoom}
          disabledPublicRoom
          onClick={onClick}
        />,
      );

      fireEvent.click(screen.getByTestId("room-type-list-item"));

      expect(onClick).not.toHaveBeenCalled();
    });

    it("does not disable a room type the flag does not apply to", () => {
      const onClick = vi.fn();
      render(
        <RoomType
          {...baseProps}
          roomType={RoomsType.CustomRoom}
          disabledFormRoom
          disabledPublicRoom
          onClick={onClick}
        />,
      );

      const root = screen.getByTestId("room-type-list-item");
      fireEvent.click(root);

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(root).not.toHaveAttribute("aria-disabled");
    });
  });
});
