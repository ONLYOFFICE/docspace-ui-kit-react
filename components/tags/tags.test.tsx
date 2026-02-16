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
import { render, screen, fireEvent } from "@testing-library/react";

import { Tags } from ".";
import type { TagsProps } from "./Tags.types";

const baseProps: TagsProps = {
  tags: ["tag1", "tag2"],
  columnCount: 2,
  onSelectTag: vi.fn(),
};

describe("<Tags />", () => {
  it("renders without error", () => {
    render(<Tags {...baseProps} />);
    expect(screen.getByTestId("tags")).toBeInTheDocument();
    expect(screen.getByTestId("tags")).toHaveAttribute(
      "aria-label",
      "Tags container",
    );
  });

  it("renders with no tags", () => {
    render(<Tags {...baseProps} tags={[]} />);
    expect(screen.getByTestId("tags")).toBeEmptyDOMElement();
  });

  it("renders with a single tag", () => {
    render(<Tags {...baseProps} tags={["tag1"]} />);
    expect(screen.getByText("tag1")).toBeInTheDocument();
  });

  it("renders multiple tags", () => {
    render(<Tags {...baseProps} tags={["tag1", "tag2", "tag3"]} />);
    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();
  });

  it("calls onSelectTag when a tag is clicked", () => {
    const onSelectTagMock = vi.fn();
    render(
      <Tags {...baseProps} tags={["tag1"]} onSelectTag={onSelectTagMock} />,
    );
    screen.getByText("tag1").click();
    expect(onSelectTagMock).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    render(<Tags {...baseProps} className="custom-class" />);
    expect(screen.getByTestId("tags")).toHaveClass("custom-class");
  });

  it("applies custom id", () => {
    render(<Tags {...baseProps} id="custom-id" />);
    expect(screen.getByTestId("tags")).toHaveAttribute("id", "custom-id");
  });

  it("applies custom style", () => {
    render(<Tags {...baseProps} style={{ width: "200px" }} />);
    expect(screen.getByTestId("tags")).toHaveStyle({ width: "200px" });
  });

  it("calls onMouseEnter when mouse enters", () => {
    const onMouseEnterMock = vi.fn();
    render(<Tags {...baseProps} onMouseEnter={onMouseEnterMock} />);
    const tags = screen.getAllByTestId("tag_item");
    fireEvent.mouseEnter(tags[0]);
    expect(onMouseEnterMock).toHaveBeenCalled();
  });

  it("calls onMouseLeave when mouse leaves", () => {
    const onMouseLeaveMock = vi.fn();
    render(<Tags {...baseProps} onMouseLeave={onMouseLeaveMock} />);
    const tags = screen.getAllByTestId("tag_item");
    fireEvent.mouseLeave(tags[0]);
    expect(onMouseLeaveMock).toHaveBeenCalled();
  });

  it("renders with TagType objects", () => {
    const tagObjects = [
      { label: "Design", roomType: 1 },
      { label: "Development", roomType: 2 },
    ];
    render(<Tags {...baseProps} tags={tagObjects} />);
    expect(screen.getByText("Design")).toBeInTheDocument();
    expect(screen.getByText("Development")).toBeInTheDocument();
  });

  it("handles columnCount of -1 to show all tags", () => {
    render(
      <Tags
        {...baseProps}
        tags={["tag1", "tag2", "tag3", "tag4"]}
        columnCount={-1}
      />,
    );
    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();
    expect(screen.getByText("tag3")).toBeInTheDocument();
    expect(screen.getByText("tag4")).toBeInTheDocument();
  });

  it("calls onOptionTagClick when option tag is clicked", () => {
    const onOptionTagClickMock = vi.fn();
    const optionRef = React.createRef<HTMLDivElement>();

    render(
      <Tags
        {...baseProps}
        tags={["tag1", "tag2", "tag3"]}
        columnCount={2}
        optionTagRef={optionRef}
        onOptionTagClick={onOptionTagClickMock}
      />,
    );

    const optionTag = screen.getByText("+1");
    optionTag.click();
    expect(onOptionTagClickMock).toHaveBeenCalledTimes(1);
  });
});
