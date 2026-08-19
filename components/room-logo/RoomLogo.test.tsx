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
