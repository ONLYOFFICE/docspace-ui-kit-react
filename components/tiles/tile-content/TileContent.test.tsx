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

import { TileContent } from ".";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("./TileContent.module.scss", () => ({
  default: {
    tileContent: "tileContent",
    mainContainerWrapper: "mainContainerWrapper",
    mainContainer: "mainContainer",
  },
}));

describe("TileContent", () => {
  const MockChild = ({ containerWidth }: { containerWidth?: string }) => (
    <div data-testid="child-content">Child Content</div>
  );

  it("renders children correctly", () => {
    render(
      <TileContent>
        <MockChild />
      </TileContent>,
    );
    expect(screen.getByTestId("child-content")).toBeTruthy();
    expect(screen.getByTestId("child-content").textContent).toBe(
      "Child Content",
    );
  });

  it("applies custom className", () => {
    const { container } = render(
      <TileContent className="custom-class">
        <MockChild />
      </TileContent>,
    );
    const element = container.querySelector(".custom-class");
    expect(element).toBeTruthy();
  });

  it("applies custom id", () => {
    const { container } = render(
      <TileContent id="custom-id">
        <MockChild />
      </TileContent>,
    );
    const element = container.querySelector("#custom-id");
    expect(element).toBeTruthy();
  });

  it("applies custom style", () => {
    const customStyle = { backgroundColor: "red" };
    const { container } = render(
      <TileContent style={customStyle}>
        <MockChild />
      </TileContent>,
    );
    const element = container.querySelector("[class*='tileContent']");
    expect(element?.getAttribute("style")).toContain("background-color");
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(
      <TileContent onClick={onClick}>
        <MockChild />
      </TileContent>,
    );

    const element = screen.getByTestId("child-content").parentElement
      ?.parentElement?.parentElement;
    if (element) {
      fireEvent.click(element);
      expect(onClick).toHaveBeenCalled();
    }
  });

  it("renders with containerWidth from child props", () => {
    const { container } = render(
      <TileContent>
        <MockChild containerWidth="200px" />
      </TileContent>,
    );
    const wrapper = container.querySelector(".row-main-wrapper");
    expect(wrapper).toBeTruthy();
  });

  it("renders main container wrapper with correct class", () => {
    const { container } = render(
      <TileContent>
        <MockChild />
      </TileContent>,
    );
    const wrapper = container.querySelector(".row-main-wrapper");
    expect(wrapper).toBeTruthy();
  });

  it("renders main container with correct class", () => {
    const { container } = render(
      <TileContent>
        <MockChild />
      </TileContent>,
    );
    const mainContainer = container.querySelector(".row-main-container");
    expect(mainContainer).toBeTruthy();
  });

  it("combines className with default classes", () => {
    const { container } = render(
      <TileContent className="extra-class">
        <MockChild />
      </TileContent>,
    );
    const element = container.querySelector("[class*='tileContent']");
    expect(element?.className).toContain("extra-class");
  });
});
