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
import { describe, it, expect, afterEach, vi } from "vitest";
import { screen, fireEvent, render } from "@testing-library/react";

import ErrorContainer from "./ErrorContainer";

describe("ErrorContainer", () => {
  const mockOnClick = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders without error", () => {
    render(<ErrorContainer id="error-container" />);
    expect(screen.getByTestId("ErrorContainer")).toBeInTheDocument();
  });

  it("renders with header and body text", () => {
    const headerText = "Some error has happened";
    const bodyText = "Try again later";

    render(<ErrorContainer headerText={headerText} bodyText={bodyText} />);

    expect(screen.getByText(headerText)).toBeInTheDocument();
    expect(screen.getByText(bodyText)).toBeInTheDocument();
  });

  it("renders with customized body text", () => {
    const customText = "Custom error message";

    render(<ErrorContainer customizedBodyText={customText} />);

    expect(screen.getByText(customText)).toBeInTheDocument();
  });

  it("renders with button and handles click", () => {
    const buttonText = "Retry";

    render(
      <ErrorContainer buttonText={buttonText} onClickButton={mockOnClick} />,
    );

    const button = screen.getByText(buttonText);
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("renders with primary button style", () => {
    const buttonText = "Primary Button";

    render(
      <ErrorContainer
        buttonText={buttonText}
        onClickButton={mockOnClick}
        isPrimaryButton
      />,
    );

    const button = screen.getByText(buttonText);
    expect(button).toBeInTheDocument();
  });

  it("renders in editor mode", () => {
    render(<ErrorContainer isEditor />);

    const container = screen.getByTestId("ErrorContainer");
    expect(container.className).toContain("isEditor");
  });

  it("renders with additional className", () => {
    const className = "custom-class";

    render(<ErrorContainer className={className} />);

    const container = screen.getByTestId("ErrorContainer");
    expect(container.className).toContain(className);
  });

  it("renders with children", () => {
    const childText = "Child component";

    render(
      <ErrorContainer>
        <div>{childText}</div>
      </ErrorContainer>,
    );

    expect(screen.getByText(childText)).toBeInTheDocument();
  });
});
