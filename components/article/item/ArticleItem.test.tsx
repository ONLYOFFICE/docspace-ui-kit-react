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

import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ArticleFolderReactSvgUrl from "../../../assets/icons/16/catalog.folder.react.svg?url";

import { ArticleItem } from ".";

const mockOnClick = vi.fn();
const mockOnClickBadge = vi.fn();
const mockOnDrop = vi.fn();

const baseProps = {
  icon: ArticleFolderReactSvgUrl,
  text: "Documents",
  showText: true,
  onClick: mockOnClick,
  showInitial: true,
  showBadge: true,
  isEndOfBlock: true,
  labelBadge: "2",
  onClickBadge: mockOnClickBadge,
  linkData: { path: "", state: {} },
};

describe("<ArticleItem />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without error", () => {
    render(<ArticleItem {...baseProps} />);
    expect(screen.getByTestId("article-item")).toBeInTheDocument();
  });

  it("displays text when showText is true", () => {
    render(<ArticleItem {...baseProps} />);
    expect(screen.getByText("Documents")).toBeInTheDocument();
  });

  it("hides text when showText is false", () => {
    render(<ArticleItem {...baseProps} showText={false} />);
    expect(screen.queryByText("Documents")).not.toBeInTheDocument();
  });

  it("shows initial letter when showInitial is true", () => {
    render(<ArticleItem {...baseProps} showInitial showText={false} />);
    expect(screen.getByText("D")).toBeInTheDocument();
  });

  it("displays built-in badge when showBadge is true, iconBadge and badgeComponent are not provided", () => {
    render(<ArticleItem {...baseProps} showBadge />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("handles click events", async () => {
    render(<ArticleItem {...baseProps} />);
    const articleItemSibling = screen.getByTestId("article-item-sibling");
    await userEvent.click(articleItemSibling);
    expect(mockOnClick).toHaveBeenCalled();
  });

  it("handles badge click events", async () => {
    render(<ArticleItem {...baseProps} />);
    const badge = screen.getByText("2");
    await userEvent.click(badge);
    expect(mockOnClickBadge).toHaveBeenCalled();
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it("renders as header when isHeader is true", () => {
    render(<ArticleItem {...baseProps} isHeader />);
    const articleItemHeader = screen.getByTestId("article-item-header");
    expect(articleItemHeader).toBeInTheDocument();
  });

  it("handles drag and drop", () => {
    render(<ArticleItem {...baseProps} isDragging onDrop={mockOnDrop} />);
    const articleItemSibling = screen.getByTestId("article-item-sibling");
    fireEvent.mouseUp(articleItemSibling);
    expect(mockOnDrop).toHaveBeenCalledWith(undefined, "Documents", undefined);
  });

  it("applies active styles when isActive is true", () => {
    render(<ArticleItem {...baseProps} isActive />);
    expect(screen.getByTestId("article-item")).toHaveStyle({
      backgroundColor: expect.any(String),
    });
  });

  it("renders with custom className and style", () => {
    const customStyle = { width: "200px" };
    render(
      <ArticleItem
        {...baseProps}
        className="custom-class"
        style={customStyle}
      />,
    );
    const articleItem = screen.getByTestId("article-item");
    expect(articleItem).toHaveClass("custom-class");
    expect(articleItem).toHaveStyle({ width: "200px" });
  });

  it("renders with custom badge component", () => {
    const CustomBadge = () => (
      <div data-testid="custom-badge">Custom Badge</div>
    );
    render(<ArticleItem {...baseProps} badgeComponent={<CustomBadge />} />);
    expect(screen.getByTestId("custom-badge")).toBeInTheDocument();
  });
});
