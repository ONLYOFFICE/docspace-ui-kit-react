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
      data-testid="rectangle-skeleton"
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

import { RectangleSkeleton } from ".";

describe("<RectangleSkeleton />", () => {
  it("renders with default props", () => {
    render(<RectangleSkeleton />);
    const skeleton = screen.getByTestId("rectangle-skeleton");
    expect(skeleton).toBeInTheDocument();
  });

  it("renders with custom dimensions", () => {
    render(<RectangleSkeleton width="200px" height="50px" />);
    const skeleton = screen.getByTestId("rectangle-skeleton");
    expect(skeleton).toHaveAttribute("width", "200px");
    expect(skeleton).toHaveAttribute("height", "50px");
  });

  it("renders rect element with correct attributes", () => {
    render(
      <RectangleSkeleton
        x="10"
        y="20"
        width="150px"
        height="40px"
        borderRadius="8"
      />,
    );
    const skeleton = screen.getByTestId("rectangle-skeleton");
    const rect = skeleton.querySelector("rect");
    expect(rect).toBeInTheDocument();
    expect(rect).toHaveAttribute("x", "10");
    expect(rect).toHaveAttribute("y", "20");
    expect(rect).toHaveAttribute("rx", "8");
    expect(rect).toHaveAttribute("ry", "8");
    expect(rect).toHaveAttribute("width", "150px");
    expect(rect).toHaveAttribute("height", "40px");
  });

  it("renders with custom title", () => {
    render(<RectangleSkeleton title="Loading content..." />);
    const skeleton = screen.getByTestId("rectangle-skeleton");
    const title = skeleton.querySelector("title");
    expect(title).toHaveTextContent("Loading content...");
  });

  it("renders with empty title by default", () => {
    render(<RectangleSkeleton />);
    const skeleton = screen.getByTestId("rectangle-skeleton");
    const title = skeleton.querySelector("title");
    expect(title).toBeNull();
  });

  it("renders with custom className", () => {
    render(<RectangleSkeleton className="custom-skeleton" />);
    const skeleton = screen.getByTestId("rectangle-skeleton");
    expect(skeleton).toHaveClass("custom-skeleton");
  });

  it("renders with custom style", () => {
    render(<RectangleSkeleton style={{ margin: "10px" }} />);
    const skeleton = screen.getByTestId("rectangle-skeleton");
    expect(skeleton).toHaveStyle({ margin: "10px" });
  });

  it("renders with default x and y values", () => {
    render(<RectangleSkeleton />);
    const skeleton = screen.getByTestId("rectangle-skeleton");
    const rect = skeleton.querySelector("rect");
    expect(rect).toHaveAttribute("x", "0");
    expect(rect).toHaveAttribute("y", "0");
  });

  it("passes additional props to ContentLoader", () => {
    render(<RectangleSkeleton data-custom="test-value" />);
    const skeleton = screen.getByTestId("rectangle-skeleton");
    expect(skeleton).toHaveAttribute("data-custom", "test-value");
  });

  it("renders with default width and height", () => {
    render(<RectangleSkeleton />);
    const skeleton = screen.getByTestId("rectangle-skeleton");
    expect(skeleton).toHaveAttribute("width", "100%");
    expect(skeleton).toHaveAttribute("height", "32px");
  });

  it("renders rect with default border radius", () => {
    render(<RectangleSkeleton />);
    const skeleton = screen.getByTestId("rectangle-skeleton");
    const rect = skeleton.querySelector("rect");
    expect(rect).toHaveAttribute("rx", "3");
    expect(rect).toHaveAttribute("ry", "3");
  });
});
