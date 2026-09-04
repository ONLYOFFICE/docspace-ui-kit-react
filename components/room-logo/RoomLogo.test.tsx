import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { RoomsType } from "../../enums";
import { RoomLogo } from "./RoomLogo";

// Mock react-device-detect
vi.mock("react-device-detect", () => ({
  isMobile: false,
}));

const baseProps = {
  type: RoomsType.CustomRoom,
  isPrivacy: false,
  isArchive: false,
};

describe("<RoomLogo />", () => {
  it("renders without error", () => {
    render(<RoomLogo {...baseProps} />);
    expect(screen.getByTestId("room-logo")).toBeInTheDocument();
  });

  it("renders with custom props", () => {
    render(
      <RoomLogo
        {...baseProps}
        id="testId"
        className="test-class"
        style={{ color: "red" }}
      />,
    );
    const logo = screen.getByTestId("room-logo");

    expect(logo).toHaveAttribute("id", "testId");
    expect(logo).toHaveClass("test-class");
    expect(logo.style.color).toBe("red");
  });

  describe("Checkbox functionality", () => {
    it("handles checkbox change", () => {
      const onChangeMock = vi.fn();
      render(
        <RoomLogo
          {...baseProps}
          withCheckbox
          isChecked={false}
          onChange={onChangeMock}
        />,
      );

      const checkbox = screen.getByRole("checkbox");
      fireEvent.click(checkbox);

      expect(onChangeMock).toHaveBeenCalled();
    });
  });

  describe("Room Types", () => {
    const testRoomType = (type: RoomsType) => {
      it(`renders icon for ${RoomsType[type]} type`, () => {
        render(<RoomLogo {...baseProps} type={type} />);

        const container = screen.getByTestId("room-logo");
        const icon = container.querySelector(".room-logo_icon");
        expect(icon).toBeInTheDocument();
      });
    };

    testRoomType(RoomsType.EditingRoom);
    testRoomType(RoomsType.CustomRoom);
    testRoomType(RoomsType.PublicRoom);
    testRoomType(RoomsType.FormRoom);
    testRoomType(RoomsType.VirtualDataRoom);
  });

  describe("Special States", () => {
    it("renders icon when isArchive is true", () => {
      render(<RoomLogo {...baseProps} isArchive />);

      const container = screen.getByTestId("room-logo");
      const icon = container.querySelector(".room-logo_icon");
      expect(icon).toBeInTheDocument();
    });

    it("renders icon when archive and room type are set", () => {
      render(
        <RoomLogo {...baseProps} isArchive type={RoomsType.EditingRoom} />,
      );

      const container = screen.getByTestId("room-logo");
      const icon = container.querySelector(".room-logo_icon");
      expect(icon).toBeInTheDocument();
    });

    it("renders icon when isTemplate is true", () => {
      render(<RoomLogo {...baseProps} isTemplate />);

      const container = screen.getByTestId("room-logo");
      const icon = container.querySelector(".room-logo_icon");
      expect(icon).toBeInTheDocument();
    });

    it("renders icon when isTemplateRoom is true", () => {
      render(
        <RoomLogo {...baseProps} isTemplateRoom type={RoomsType.FormRoom} />,
      );

      const container = screen.getByTestId("room-logo");
      const icon = container.querySelector(".room-logo_icon");
      expect(icon).toBeInTheDocument();
    });
  });
});
