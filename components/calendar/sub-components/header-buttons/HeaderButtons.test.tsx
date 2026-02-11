/*
 * (c) Copyright Ascensio System SIA 2009-2026
 *
 * This program is a free software product.
 * You can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
 * Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
 * to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
 * any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
 * the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions of the Program must
 * display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product logo when
 * distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
 * trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
 * content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
 * International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HeaderButtons } from "./HeaderButtons";

// Mock SCSS
vi.mock("../../Calendar.module.scss", () => ({
  default: {
    buttonsContainer: "buttonsContainer",
    roundButton: "roundButton",
    disabled: "disabled",
    arrowIcon: "arrowIcon",
    prev: "prev",
    next: "next",
  },
}));

describe("HeaderButtons Component", () => {
  const mockOnLeftClick = vi.fn();
  const mockOnRightClick = vi.fn();

  const defaultProps = {
    onLeftClick: mockOnLeftClick,
    onRightClick: mockOnRightClick,
    isLeftDisabled: false,
    isRightDisabled: false,
    isMobile: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render both buttons", () => {
    render(<HeaderButtons {...defaultProps} />);

    const prevButton = screen.getByLabelText("Previous");
    const nextButton = screen.getByLabelText("Next");

    expect(prevButton).toBeDefined();
    expect(nextButton).toBeDefined();
  });

  it("should call onLeftClick when previous button is clicked", () => {
    render(<HeaderButtons {...defaultProps} />);

    const prevButton = screen.getByLabelText("Previous");
    fireEvent.click(prevButton);

    expect(mockOnLeftClick).toHaveBeenCalledTimes(1);
  });

  it("should call onRightClick when next button is clicked", () => {
    render(<HeaderButtons {...defaultProps} />);

    const nextButton = screen.getByLabelText("Next");
    fireEvent.click(nextButton);

    expect(mockOnRightClick).toHaveBeenCalledTimes(1);
  });

  it("should disable previous button when isLeftDisabled is true", () => {
    render(<HeaderButtons {...defaultProps} isLeftDisabled={true} />);

    const prevButton = screen.getByLabelText("Previous");
    expect(prevButton).toBeDisabled();
  });

  it("should disable next button when isRightDisabled is true", () => {
    render(<HeaderButtons {...defaultProps} isRightDisabled={true} />);

    const nextButton = screen.getByLabelText("Next");
    expect(nextButton).toBeDisabled();
  });

  it("should not call onLeftClick when previous button is disabled", () => {
    render(<HeaderButtons {...defaultProps} isLeftDisabled={true} />);

    const prevButton = screen.getByLabelText("Previous");
    fireEvent.click(prevButton);

    expect(mockOnLeftClick).not.toHaveBeenCalled();
  });

  it("should not call onRightClick when next button is disabled", () => {
    render(<HeaderButtons {...defaultProps} isRightDisabled={true} />);

    const nextButton = screen.getByLabelText("Next");
    fireEvent.click(nextButton);

    expect(mockOnRightClick).not.toHaveBeenCalled();
  });

  it("should apply mobile margin when isMobile is true", () => {
    render(<HeaderButtons {...defaultProps} isMobile={true} />);

    const prevButton = screen.getByLabelText("Previous");
    expect(prevButton.style.marginInlineEnd).toBe("12px");
  });

  it("should apply desktop margin when isMobile is false", () => {
    render(<HeaderButtons {...defaultProps} isMobile={false} />);

    const prevButton = screen.getByLabelText("Previous");
    expect(prevButton.style.marginInlineEnd).toBe("8px");
  });

  it("should have correct CSS classes", () => {
    render(<HeaderButtons {...defaultProps} />);

    const prevButton = screen.getByLabelText("Previous");
    const nextButton = screen.getByLabelText("Next");

    expect(prevButton.className).toContain("roundButton");
    expect(prevButton.className).toContain("arrow-previous");
    expect(nextButton.className).toContain("roundButton");
    expect(nextButton.className).toContain("arrow-next");
  });

  it("should add disabled class when buttons are disabled", () => {
    render(
      <HeaderButtons
        {...defaultProps}
        isLeftDisabled={true}
        isRightDisabled={true}
      />,
    );

    const prevButton = screen.getByLabelText("Previous");
    const nextButton = screen.getByLabelText("Next");

    expect(prevButton.className).toContain("disabled");
    expect(nextButton.className).toContain("disabled");
  });
});
