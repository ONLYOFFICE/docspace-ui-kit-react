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
import { describe, it, expect } from "vitest";
import { screen, render } from "@testing-library/react";

import { FieldContainer } from "./FieldContainer";
import { InputSize, InputType, TextInput } from "../text-input";

describe("<FieldContainer />", () => {
  const defaultProps = {
    labelText: "Test Label:",
    labelVisible: true,
    isRequired: false,
    children: (
      <TextInput
        value=""
        onChange={() => {}}
        type={InputType.text}
        size={InputSize.base}
      />
    ),
  };

  it("renders without error", () => {
    render(<FieldContainer {...defaultProps} />);
    expect(screen.getByTestId("field-container")).toBeInTheDocument();
  });

  it("renders with correct label", () => {
    render(<FieldContainer {...defaultProps} />);
    expect(screen.getByText("Test Label:")).toBeInTheDocument();
  });

  it("renders with required attribute", () => {
    render(<FieldContainer {...defaultProps} isRequired />);
    const label = screen.getByText("Test Label:");
    expect(label).toHaveAttribute("aria-required", "true");
  });

  it("applies custom className", () => {
    const className = "custom-class";
    render(<FieldContainer {...defaultProps} className={className} />);
    expect(screen.getByTestId("field-container")).toHaveClass(className);
  });

  it("renders with custom id", () => {
    const id = "custom-id";
    render(<FieldContainer {...defaultProps} id={id} />);
    expect(screen.getByTestId("field-container")).toHaveAttribute("id", id);
  });

  it("renders tooltip when tooltipContent is provided", () => {
    const tooltipContent = "Help text";
    render(
      <FieldContainer tooltipContent={tooltipContent} {...defaultProps} />,
    );
    expect(screen.getByTestId("help-button")).toBeInTheDocument();
  });

  it("renders error message when hasError is true", () => {
    const errorMessage = "This field is required";
    render(
      <FieldContainer hasError errorMessage={errorMessage} {...defaultProps} />,
    );
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("applies vertical layout when isVertical is true", () => {
    render(<FieldContainer isVertical {...defaultProps} />);
    expect(screen.getByTestId("field-container")).toHaveAttribute(
      "data-vertical",
      "true",
    );
  });

  it("hides label when labelVisible is false", () => {
    render(<FieldContainer {...defaultProps} labelVisible={false} />);
    expect(screen.queryByText("Test Label:")).not.toBeInTheDocument();
  });

  it("renders with custom maxLabelWidth", () => {
    const maxLabelWidth = "150px";
    render(<FieldContainer {...defaultProps} maxLabelWidth={maxLabelWidth} />);
    expect(screen.getByTestId("field-container")).toHaveAttribute(
      "data-label-width",
      maxLabelWidth,
    );
  });
});
