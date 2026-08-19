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

import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent, render } from "@testing-library/react";
import { RoomIcon } from ".";
import type { TModel } from "./RoomIcon.types";
import styles from "./RoomIcon.module.scss";

const mockImgSrc = "test-image.jpg";
const mockTitle = "Test Room";
const mockSize = "96px";
const mockColor = "FFFFFF";

const baseProps = {
  title: mockTitle,
  size: mockSize,
  color: mockColor,
  imgSrc: mockImgSrc,
  showDefault: true,
};

const mockModel: TModel[] = [
  {
    label: "Upload",
    icon: "upload.svg",
    key: "upload",
    onClick: vi.fn(),
  },
  {
    label: "Remove",
    icon: "remove.svg",
    key: "remove",
    onClick: vi.fn(),
  },
];

describe("<RoomIcon />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without error", () => {
    render(<RoomIcon {...baseProps} />);
    expect(screen.getByTestId("room-icon")).toBeInTheDocument();
  });

  it("renders title when showDefault is true", () => {
    render(<RoomIcon {...baseProps} />);
    const title = screen.getByTestId("room-title");
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("TR");
  });

  it("renders empty icon state correctly", () => {
    render(<RoomIcon {...baseProps} isEmptyIcon />);
    const emptyIcon = screen.getByTestId("empty-icon");
    expect(emptyIcon).toBeInTheDocument();
    expect(screen.getByTestId("icon-button")).toBeInTheDocument();
  });

  it("renders edit mode correctly", () => {
    render(<RoomIcon {...baseProps} withEditing model={mockModel} />);
    const editButton = screen.getByTestId("icon-button");
    expect(editButton).toBeInTheDocument();
    expect(screen.getByTestId("room-icon")).toHaveAttribute(
      "data-has-editing",
      "true",
    );
  });

  it("opens dropdown on edit icon click", () => {
    render(<RoomIcon {...baseProps} withEditing model={mockModel} />);
    const editButton = screen.getByTestId("icon-button");
    fireEvent.click(editButton);
    expect(screen.getByText(mockModel[0].label)).toBeInTheDocument();
  });

  it("handles file input change", () => {
    const onChangeFile = vi.fn();
    render(
      <RoomIcon
        {...baseProps}
        withEditing
        model={mockModel}
        onChangeFile={onChangeFile}
      />,
    );
    const input = screen.getByTestId("customFileInput");
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    fireEvent.change(input, { target: { files: [file] } });
    expect(onChangeFile).toHaveBeenCalled();
  });

  it("renders badge correctly", () => {
    const badgeUrl = "badge.svg";
    const onBadgeClick = vi.fn();
    render(
      <RoomIcon
        {...baseProps}
        badgeUrl={badgeUrl}
        onBadgeClick={onBadgeClick}
      />,
    );
    const badge = screen.getByTestId("icon-button");
    expect(badge).toBeInTheDocument();
    fireEvent.click(badge);
    expect(onBadgeClick).toHaveBeenCalled();
  });

  it("handles hover state correctly", () => {
    const hoverSrc = "hover-image.jpg";
    render(<RoomIcon {...baseProps} hoverSrc={hoverSrc} />);
    const hoverImg = screen.getByTestId("hover-image");
    expect(hoverImg).toHaveAttribute("src", hoverSrc);
  });

  it("handles archive state correctly", () => {
    render(<RoomIcon {...baseProps} isArchive />);
    expect(screen.getByTestId("room-icon")).toHaveAttribute(
      "data-is-archive",
      "true",
    );
  });

  it("adds tooltip attributes to badge when tooltipContent is provided", () => {
    const tooltipId = "room-tooltip";
    render(
      <RoomIcon
        {...baseProps}
        badgeUrl="badge.svg"
        tooltipContent="Tooltip content"
        tooltipId={tooltipId}
      />,
    );

    const badgeButton = screen.getByTestId("icon-button");
    expect(badgeButton).toHaveAttribute("data-tooltip-id", tooltipId);
  });

  it("adds isHovered class when tooltipContent is provided", () => {
    render(
      <RoomIcon
        {...baseProps}
        badgeUrl="badge.svg"
        tooltipContent="Tooltip content"
        tooltipId="room-tooltip"
      />,
    );
    const badgeButton = screen.getByTestId("icon-button");
    expect(badgeButton).toHaveClass(styles.isHovered);
  });

  it("does not add tooltip attributes when tooltipContent is not provided", () => {
    render(<RoomIcon {...baseProps} badgeUrl="badge.svg" />);
    const badgeButton = screen.getByTestId("icon-button");
    expect(badgeButton).not.toHaveAttribute("data-tooltip-id");
    const buttonWithClass = screen.getByTestId("icon-button");
    expect(buttonWithClass).not.toHaveClass(styles.isHovered);
  });

  it("handles template icon state", () => {
    render(<RoomIcon {...baseProps} isTemplate />);
    const roomIcon = screen.getByTestId("room-icon");
    expect(roomIcon).toHaveAttribute("data-is-template", "true");
  });
});
