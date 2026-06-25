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
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RowContainer } from ".";

const baseProps = {
  manualHeight: "500px",
  useReactWindow: true,
  onScroll: vi.fn(),
  fetchMoreFiles: vi.fn().mockResolvedValue(undefined),
  hasMoreFiles: true,
  itemCount: 2,
  filesLength: 2,
  itemHeight: 50,
};

describe("<RowContainer />", () => {
  it("renders without error", () => {
    render(
      <RowContainer {...baseProps}>
        <span>Demo1</span>
        <span>Demo2</span>
      </RowContainer>,
    );

    expect(screen.getByTestId("row-container")).toBeInTheDocument();
    expect(
      screen.getByTestId("row-container").querySelector(".List"),
    ).toBeInTheDocument();
  });

  it("renders without react-window", () => {
    render(
      <RowContainer {...baseProps} useReactWindow={false}>
        <span>Demo1</span>
        <span>Demo2</span>
      </RowContainer>,
    );

    const container = screen.getByTestId("row-container");
    expect(container).not.toHaveClass("useReactWindow");
    expect(screen.getByText("Demo1")).toBeInTheDocument();
    expect(screen.getByText("Demo2")).toBeInTheDocument();
  });

  it("renders with manual height", () => {
    render(
      <RowContainer {...baseProps}>
        <span>Demo1</span>
        <span>Demo2</span>
      </RowContainer>,
    );

    const container = screen.getByTestId("row-container");
    expect(container).toHaveStyle({ "--manual-height": "500px" });
  });

  it("applies custom className", () => {
    const customClass = "custom-class";
    render(
      <RowContainer {...baseProps} className={customClass}>
        <span>Demo1</span>
        <span>Demo2</span>
      </RowContainer>,
    );

    const container = screen.getByTestId("row-container");
    expect(container).toHaveClass(customClass);
  });

  it("applies custom id", () => {
    const customId = "custom-id";
    render(
      <RowContainer {...baseProps} id={customId}>
        <span>Demo1</span>
        <span>Demo2</span>
      </RowContainer>,
    );

    const container = screen.getByTestId("row-container");
    expect(container).toHaveAttribute("id", customId);
  });

  it("applies custom style", () => {
    const customStyle = { backgroundColor: "red" };
    render(
      <RowContainer {...baseProps} style={customStyle}>
        <span>Demo1</span>
        <span>Demo2</span>
      </RowContainer>,
    );

    const container = screen.getByTestId("row-container");
    expect(container.style.backgroundColor).toBe("red");
  });

  it("renders InfiniteLoaderComponent when useReactWindow is true", () => {
    render(
      <RowContainer {...baseProps}>
        <span>Demo1</span>
        <span>Demo2</span>
      </RowContainer>,
    );

    expect(
      screen.getByTestId("row-container").querySelector(".List"),
    ).toBeInTheDocument();
  });

  it("renders children directly when useReactWindow is false", () => {
    render(
      <RowContainer {...baseProps} useReactWindow={false}>
        <span>Demo1</span>
        <span>Demo2</span>
      </RowContainer>,
    );

    expect(
      screen.getByTestId("row-container").querySelector(".List"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Demo1")).toBeInTheDocument();
    expect(screen.getByText("Demo2")).toBeInTheDocument();
  });
});
