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
import { render, screen } from "@testing-library/react";

import { Tags } from ".";
import type { TagsProps } from "./Tags.types";

vi.mock("../tag", () => ({
  Tag: ({ label, advancedOptions }: { label: string; advancedOptions?: React.ReactNode[] }) => (
    <div data-testid="tag-mock" data-label={label}>
      {label || "..."}
      {advancedOptions && <div data-testid="advanced-options-mock" />}
    </div>
  ),
}));

const baseProps: TagsProps = {
  tags: ["tag1", "tag2"],
  columnCount: 2,
  onSelectTag: () => {},
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

  it("returns early if columnCount is 0", () => {
    render(<Tags {...baseProps} columnCount={0} />);
    expect(screen.getByTestId("tags")).toBeEmptyDOMElement();
  });

  it("handles a single tag as an object with isDefault", () => {
    const tags = [{ label: "Default Tag", isDefault: true }];
    render(<Tags {...baseProps} tags={tags} columnCount={1} />);
    expect(screen.getByText("Default Tag")).toBeInTheDocument();
  });

  it("handles a single tag as an object with isThirdParty", () => {
    const tags = [{ label: "TP Tag", isThirdParty: true }];
    render(<Tags {...baseProps} tags={tags} columnCount={1} />);
    expect(screen.getByText("TP Tag")).toBeInTheDocument();
  });

  it("handles multiple tags when columnCount is enough", () => {
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      value: 1000,
    });
    
    const tags = [
      { label: "TP", isThirdParty: true },
      { label: "Default", isDefault: true },
      { label: "Plain", isDefault: false, isThirdParty: false },
      "String Tag"
    ];
    render(<Tags {...baseProps} tags={tags} columnCount={5} />);
    expect(screen.getByText("TP")).toBeInTheDocument();
    expect(screen.getByText("Default")).toBeInTheDocument();
    expect(screen.getByText("Plain")).toBeInTheDocument();
    expect(screen.getByText("String Tag")).toBeInTheDocument();
  });

  it("handles special case with 2 tags (TP and Default) when columnCount is 1", () => {
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      value: 200,
    });
    const tags = [
      { label: "TP", isThirdParty: true },
      { label: "Default", isDefault: true }
    ];
    render(<Tags {...baseProps} tags={tags} columnCount={1} />);
    expect(screen.getByText("TP")).toBeInTheDocument();
    expect(screen.getByText("Default")).toBeInTheDocument();
    expect(screen.queryByText("...")).not.toBeInTheDocument();
  });

  it("handles a single tag as a plain object", () => {
    const tags = [{ label: "Plain Single" }];
    render(<Tags {...baseProps} tags={tags} columnCount={1} />);
    expect(screen.getByText("Plain Single")).toBeInTheDocument();
  });

  it("renders dropdown when tags exceed columnCount", () => {
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      value: 500,
    });
    const tags = ["tag1", "tag2", "tag3", "tag4"];
    render(<Tags {...baseProps} tags={tags} columnCount={2} />);
    
    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();
    expect(screen.getByText("...")).toBeInTheDocument();
    expect(screen.getByTestId("advanced-options-mock")).toBeInTheDocument();
  });

  it("handles mixed tags in dropdown mode (TP, Default, String)", () => {
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      value: 500,
    });
    const tags = [
      { label: "TP", isThirdParty: true },
      { label: "Default", isDefault: true },
      { label: "Plain Object" },
      "Str",
      "Hidden"
    ];
    render(<Tags {...baseProps} tags={tags} columnCount={4} />);
    
    expect(screen.getByText("TP")).toBeInTheDocument();
    expect(screen.getByText("Default")).toBeInTheDocument();
    expect(screen.getByText("Plain Object")).toBeInTheDocument();
    expect(screen.getByText("Str")).toBeInTheDocument();
    expect(screen.getByText("...")).toBeInTheDocument();
    expect(screen.getByTestId("advanced-options-mock")).toBeInTheDocument();
  });

  it("handles string labels in dropdown mode", () => {
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      value: 500,
    });
    const tags = ["str1", "str2", "str3"];
    render(<Tags {...baseProps} tags={tags} columnCount={1} />);
    expect(screen.getByText("str1")).toBeInTheDocument();
    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("handles a single string tag", () => {
    render(<Tags {...baseProps} tags={["Single String"]} columnCount={1} />);
    expect(screen.getByText("Single String")).toBeInTheDocument();
  });

  it("handles multiple string tags when columnCount is enough", () => {
    render(<Tags {...baseProps} tags={["S1", "S2"]} columnCount={2} />);
    expect(screen.getByText("S1")).toBeInTheDocument();
    expect(screen.getByText("S2")).toBeInTheDocument();
  });
});
