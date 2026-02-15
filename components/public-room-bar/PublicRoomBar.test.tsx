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

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { PublicRoomBar } from "./index";

describe("PublicRoomBar", () => {
  const defaultProps = {
    headerText: "Test Header",
    bodyText: "Test Body",
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with default props", () => {
    render(<PublicRoomBar {...defaultProps} />);

    expect(screen.getByText("Test Header")).toBeInTheDocument();
    expect(screen.getByText("Test Body")).toBeInTheDocument();
  });

  it("renders with custom icon", () => {
    const customIcon = "custom-icon-path.svg";
    render(<PublicRoomBar {...defaultProps} iconName={customIcon} />);

    const iconElement = screen.getByTestId("icon-button");
    expect(iconElement).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(<PublicRoomBar {...defaultProps} />);

    const closeButton = screen.getByTestId("icon-button");
    fireEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("does not render close button when onClose is not provided", () => {
    const { onClose: _, ...propsWithoutClose } = defaultProps;
    render(<PublicRoomBar {...propsWithoutClose} />);

    const closeButton = screen.queryByRole("button");
    expect(closeButton).not.toBeInTheDocument();
  });

  it("applies barVisible class when barIsVisible prop is true", () => {
    render(<PublicRoomBar {...defaultProps} barIsVisible />);

    const container = screen
      .getByText("Test Header")
      .closest("div[class*='container']");
    expect(container?.className).toContain("barVisible");
  });

  it("renders header as div when headerText is not a string", () => {
    const customHeader = <span>Custom Header</span>;
    render(<PublicRoomBar {...defaultProps} headerText={customHeader} />);

    const headerContainer = screen.getByText("Custom Header").closest("div");
    expect(headerContainer).toBeInTheDocument();
  });

  it("renders body as div when bodyText is not a string", () => {
    const customBody = <span>Custom Body</span>;
    render(<PublicRoomBar {...defaultProps} bodyText={customBody} />);

    const bodyContainer = screen.getByText("Custom Body").closest("div");
    expect(bodyContainer).toBeInTheDocument();
  });
});
