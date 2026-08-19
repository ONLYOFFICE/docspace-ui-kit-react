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

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-content-loader", () => ({
  default: ({
    children,
    title,
    width,
    height,
    className,
    style,
    ...rest
  }: {
    children?: React.ReactNode;
    title?: string;
    width?: string;
    height?: string;
    className?: string;
    style?: React.CSSProperties;
    [key: string]: unknown;
  }) => (
    <svg
      data-testid="circle-skeleton"
      width={width}
      height={height}
      className={className}
      style={style}
      {...rest}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  ),
}));

import { CircleSkeleton } from ".";

describe("<CircleSkeleton />", () => {
  it("renders with default props", () => {
    render(<CircleSkeleton />);
    const skeleton = screen.getByTestId("circle-skeleton");
    expect(skeleton).toBeInTheDocument();
  });

  it("renders with custom dimensions", () => {
    render(<CircleSkeleton width="200px" height="200px" />);
    const skeleton = screen.getByTestId("circle-skeleton");
    expect(skeleton).toHaveAttribute("width", "200px");
    expect(skeleton).toHaveAttribute("height", "200px");
  });

  it("renders circle element with correct attributes", () => {
    render(<CircleSkeleton x="50" y="50" radius="25" />);
    const skeleton = screen.getByTestId("circle-skeleton");
    const circle = skeleton.querySelector("circle");
    expect(circle).toBeInTheDocument();
    expect(circle).toHaveAttribute("cx", "50");
    expect(circle).toHaveAttribute("cy", "50");
    expect(circle).toHaveAttribute("r", "25");
  });

  it("renders with default position values", () => {
    render(<CircleSkeleton />);
    const skeleton = screen.getByTestId("circle-skeleton");
    const circle = skeleton.querySelector("circle");
    expect(circle).toHaveAttribute("cx", "3");
    expect(circle).toHaveAttribute("cy", "12");
    expect(circle).toHaveAttribute("r", "12");
  });

  it("renders with custom title", () => {
    render(<CircleSkeleton title="Loading avatar..." />);
    const skeleton = screen.getByTestId("circle-skeleton");
    const title = skeleton.querySelector("title");
    expect(title).toHaveTextContent("Loading avatar...");
  });

  it("renders with empty title by default", () => {
    render(<CircleSkeleton />);
    const skeleton = screen.getByTestId("circle-skeleton");
    const title = skeleton.querySelector("title");
    expect(title).toBeNull();
  });

  it("renders with custom className", () => {
    render(<CircleSkeleton className="custom-skeleton" />);
    const skeleton = screen.getByTestId("circle-skeleton");
    expect(skeleton).toHaveClass("custom-skeleton");
  });

  it("renders with custom style", () => {
    render(<CircleSkeleton style={{ margin: "10px" }} />);
    const skeleton = screen.getByTestId("circle-skeleton");
    expect(skeleton).toHaveStyle({ margin: "10px" });
  });

  it("renders with different radius sizes", () => {
    const { rerender } = render(<CircleSkeleton radius="10" />);
    let skeleton = screen.getByTestId("circle-skeleton");
    let circle = skeleton.querySelector("circle");
    expect(circle).toHaveAttribute("r", "10");

    rerender(<CircleSkeleton radius="50" />);
    skeleton = screen.getByTestId("circle-skeleton");
    circle = skeleton.querySelector("circle");
    expect(circle).toHaveAttribute("r", "50");
  });

  it("passes additional props to ContentLoader", () => {
    render(<CircleSkeleton data-custom="test-value" />);
    const skeleton = screen.getByTestId("circle-skeleton");
    expect(skeleton).toHaveAttribute("data-custom", "test-value");
  });

  it("renders with default width and height", () => {
    render(<CircleSkeleton />);
    const skeleton = screen.getByTestId("circle-skeleton");
    expect(skeleton).toHaveAttribute("width", "100%");
    expect(skeleton).toHaveAttribute("height", "100%");
  });
});
