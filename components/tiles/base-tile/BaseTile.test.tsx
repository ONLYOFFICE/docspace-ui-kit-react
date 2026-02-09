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
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";

import { BaseTile } from ".";
import { BaseTileProps } from "./BaseTile.types";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("./BaseTile.module.scss", () => ({
  default: {
    baseTile: "baseTile",
    checked: "checked",
    isActive: "isActive",
    isBlockingOperation: "isBlockingOperation",
    showHotkeyBorder: "showHotkeyBorder",
    isEdit: "isEdit",
    iconContainer: "iconContainer",
    icon: "icon",
    checkbox: "checkbox",
    content: "content",
    optionButton: "optionButton",
    expandButton: "expandButton",
    topContent: "topContent",
    bottomContent: "bottomContent",
    loader: "loader",
  },
}));

vi.mock("../../checkbox", () => ({
  Checkbox: ({
    isChecked,
    onChange,
  }: {
    isChecked?: boolean;
    onChange?: (e: { target: { checked: boolean } }) => void;
  }) => (
    <input
      type="checkbox"
      checked={isChecked}
      onChange={() => onChange?.({ target: { checked: !isChecked } })}
      data-testid="checkbox"
    />
  ),
}));

describe("BaseTile", () => {
  const mockItem = {
    id: "1",
    title: "Test Tile",
  };

  const mockContextOptions = [
    { key: "edit", label: "Edit" },
    { key: "delete", label: "Delete" },
  ];

  const defaultProps: BaseTileProps = {
    item: mockItem,
    contextOptions: mockContextOptions,
    element: <div data-testid="tile-icon">Tile Icon</div>,
  };

  const TileTopContent = () => (
    <div data-testid="top-content">Top Content</div>
  );

  it("renders tile correctly", () => {
    render(
      <BaseTile {...defaultProps} topContent={<TileTopContent />} />,
    );
    expect(screen.getByTestId("tile")).toBeTruthy();
    expect(screen.getByTestId("top-content")).toBeTruthy();
  });

  it("shows checkbox when checked prop is provided", () => {
    render(
      <BaseTile {...defaultProps} checked topContent={<TileTopContent />} />,
    );

    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox).toBeTruthy();
    expect(checkbox.checked).toBe(true);
  });

  it("calls onSelect when checkbox is clicked", () => {
    const onSelect = vi.fn();
    render(
      <BaseTile
        {...defaultProps}
        onSelect={onSelect}
        topContent={<TileTopContent />}
      />,
    );

    const checkbox = screen.getByTestId("checkbox");
    fireEvent.click(checkbox);

    expect(onSelect).toHaveBeenCalledWith(true, mockItem);
  });

  it("shows loader when inProgress is true", () => {
    render(
      <BaseTile {...defaultProps} inProgress topContent={<TileTopContent />} />,
    );
    const loader = screen.getByTestId("loader");
    expect(loader).toBeTruthy();
  });

  it("renders element icon when provided", () => {
    render(
      <BaseTile {...defaultProps} topContent={<TileTopContent />} />,
    );
    expect(screen.getByTestId("tile-icon")).toBeTruthy();
  });

  it("renders bottom content when provided", () => {
    const bottomContent = <div data-testid="bottom-content">Bottom</div>;
    render(
      <BaseTile
        {...defaultProps}
        topContent={<TileTopContent />}
        bottomContent={bottomContent}
      />,
    );
    expect(screen.getByTestId("bottom-content")).toBeTruthy();
  });

  it("applies active class when isActive is true", () => {
    const { container } = render(
      <BaseTile {...defaultProps} isActive topContent={<TileTopContent />} />,
    );
    const element = container.querySelector("[class*='isActive']");
    expect(element).toBeTruthy();
  });

  it("shows hotkey border when showHotkeyBorder is true", () => {
    const { container } = render(
      <BaseTile
        {...defaultProps}
        showHotkeyBorder
        topContent={<TileTopContent />}
      />,
    );
    const element = container.querySelector("[class*='showHotkeyBorder']");
    expect(element).toBeTruthy();
  });

  it("applies checked class when checked is true", () => {
    const { container } = render(
      <BaseTile {...defaultProps} checked topContent={<TileTopContent />} />,
    );
    const element = container.querySelector("[class*='checked']");
    expect(element).toBeTruthy();
  });

  it("calls onRoomClick when tile is clicked", () => {
    const onRoomClick = vi.fn();
    render(
      <BaseTile
        {...defaultProps}
        onRoomClick={onRoomClick}
        topContent={<TileTopContent />}
      />,
    );

    const tile = screen.getByTestId("tile");
    fireEvent.click(tile);

    expect(onRoomClick).toHaveBeenCalled();
  });

  it("renders with custom className", () => {
    const { container } = render(
      <BaseTile
        {...defaultProps}
        className="custom-class"
        topContent={<TileTopContent />}
      />,
    );
    const element = container.querySelector(".custom-class");
    expect(element).toBeTruthy();
  });

  it("applies edit mode class when isEdit is true", () => {
    const { container } = render(
      <BaseTile {...defaultProps} isEdit topContent={<TileTopContent />} />,
    );
    const element = container.querySelector("[class*='isEdit']");
    expect(element).toBeTruthy();
  });
});
