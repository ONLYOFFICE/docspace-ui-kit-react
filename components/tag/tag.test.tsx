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

import { Tag } from ".";
import { TagProps } from "./Tag.types";

vi.mock("../../assets/icons/12/cross.react.svg", () => ({
  default: () => <svg data-testid="cross-icon" />,
}));

vi.mock("react-svg", () => ({
  ReactSVG: ({ src, className }: { src: string; className?: string }) => (
    <div data-testid="react-svg" data-src={src} className={className} />
  ),
}));

vi.mock("../tooltip", () => ({
  TooltipContainer: ({
    children,
    onClick,
    className,
    id,
    "data-testid": testId,
    onMouseEnter,
    onMouseLeave,
  }: {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler;
    className?: string;
    id?: string;
    "data-testid"?: string;
    onMouseEnter?: React.MouseEventHandler;
    onMouseLeave?: React.MouseEventHandler;
  }) => (
    <div
      className={className}
      onClick={onClick}
      data-testid={testId || "tag_item"}
      id={id}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  ),
  withTooltip: (Component: React.ComponentType) => Component,
}));

vi.mock("../icon-button", () => ({
  IconButton: ({
    onClick,
    dataTestId,
  }: {
    onClick: Function;
    dataTestId?: string;
  }) => (
    <button
      onClick={(e) => onClick(e)}
      data-testid={dataTestId || "icon-button"}
      type="button"
    >
      Delete
    </button>
  ),
}));

const baseProps: TagProps = {
  tag: "script",
  label: "Script",
  isNewTag: false,
  isDisabled: false,
  onDelete: vi.fn(),
  onClick: vi.fn(),
  tagMaxWidth: "160px",
};

describe("<Tag />", () => {
  it("renders without error", () => {
    render(<Tag {...baseProps} />);
    expect(screen.getByTestId("tag_item")).toBeInTheDocument();
  });

  it("accepts id", () => {
    render(<Tag {...baseProps} id="testId" />);
    expect(screen.getByTestId("tag_item")).toHaveAttribute("id", "testId");
  });

  it("accepts className", () => {
    render(<Tag {...baseProps} className="test" />);
    expect(screen.getByTestId("tag_item")).toHaveClass("test");
  });

  it("calls onDelete when cross icon is clicked", () => {
    const onDelete = vi.fn();
    render(<Tag {...baseProps} isNewTag onDelete={onDelete} />);
    const deleteButton = screen.getByRole("button");
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledWith("script");
  });

  it("calls onClick when tag is clicked", () => {
    const onClick = vi.fn();
    render(<Tag {...baseProps} onClick={onClick} />);
    const tag = screen.getByTestId("tag_item");
    fireEvent.click(tag);
    expect(onClick).toHaveBeenCalled();
  });

  it("does not call onDelete if target is tag container", () => {
    const onDelete = vi.fn();
    render(<Tag {...baseProps} isNewTag onDelete={onDelete} />);
    const tag = screen.getByTestId("tag_item");
    const deleteButton = screen.getByRole("button");

    // Case 1: Target is NOT the container -> should call onDelete
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledWith("script");

    onDelete.mockClear();

    // Case 2: Target IS the container (simulated via ref matching) -> should NOT call onDelete
    // In Tag.tsx: e.target !== tagRef.current
    fireEvent.click(tag, { target: tag });
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("renders third party icon", () => {
    const iconUrl = "test-icon.svg";
    render(<Tag {...baseProps} icon={iconUrl} />);

    const icon = screen.getByTestId("react-svg");
    expect(icon).toHaveAttribute("data-src", iconUrl);
  });

  it("does not call onClick if disabled or deleted", () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <Tag {...baseProps} isDisabled onClick={onClick} />,
    );
    fireEvent.click(screen.getByTestId("tag_item"));
    expect(onClick).not.toHaveBeenCalled();

    rerender(<Tag {...baseProps} isDeleted onClick={onClick} />);
    fireEvent.click(screen.getByTestId("tag_item"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("calls onMouseEnter and onMouseLeave", () => {
    const onMouseEnter = vi.fn();
    const onMouseLeave = vi.fn();
    render(
      <Tag
        {...baseProps}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />,
    );

    const tag = screen.getByTestId("tag_item");
    fireEvent.mouseEnter(tag);
    expect(onMouseEnter).toHaveBeenCalled();

    fireEvent.mouseLeave(tag);
    expect(onMouseLeave).toHaveBeenCalled();
  });
});
