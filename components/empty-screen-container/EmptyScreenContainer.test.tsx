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

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import styles from "./EmptyScreenContainer.module.scss";

import { EmptyScreenContainer } from ".";

const baseProps = {
  imageSrc: "empty_screen_filter.png",
  imageAlt: "Empty Screen Filter image",
  headerText: "No results found",
  descriptionText: "No results matching your search could be found",
  buttons: <a href="/">Go to home</a>,
};

describe("<EmptyScreenContainer />", () => {
  it("renders without error", () => {
    render(<EmptyScreenContainer {...baseProps} />);
    expect(screen.getByTestId("empty-screen-container")).toBeInTheDocument();
  });

  it("renders all provided content correctly", () => {
    render(<EmptyScreenContainer {...baseProps} />);

    expect(
      screen.getByRole("img", { name: baseProps.imageAlt }),
    ).toBeInTheDocument();
    expect(screen.getByText(baseProps.headerText)).toBeInTheDocument();
    expect(screen.getByText(baseProps.descriptionText)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Go to home" }),
    ).toBeInTheDocument();
  });

  it("applies custom className correctly", () => {
    const customClass = "custom-class";
    render(<EmptyScreenContainer {...baseProps} className={customClass} />);

    const container = screen.getByTestId("empty-screen-container");
    expect(container).toHaveClass(customClass);
  });

  it("renders with subheading text when provided", () => {
    const subheadingText = "This is a subheading";
    render(
      <EmptyScreenContainer {...baseProps} subheadingText={subheadingText} />,
    );

    expect(screen.getByText(subheadingText)).toBeInTheDocument();
    expect(screen.getByTestId("empty-screen-container")).toHaveClass(
      styles.withSubheading,
    );
  });

  it("applies withoutFilter class when prop is true", () => {
    render(<EmptyScreenContainer {...baseProps} withoutFilter />);

    expect(screen.getByTestId("empty-screen-container")).toHaveClass(
      styles.withoutFilter,
    );
  });

  it("applies custom styles to image when provided", () => {
    const imageStyle = { width: "200px" };
    render(<EmptyScreenContainer {...baseProps} imageStyle={imageStyle} />);

    const image = screen.getByRole("img", { name: baseProps.imageAlt });
    expect(image).toHaveStyle(imageStyle);
  });

  it("applies custom styles to buttons when provided", () => {
    const buttonStyle = { marginTop: "20px" };
    render(<EmptyScreenContainer {...baseProps} buttonStyle={buttonStyle} />);

    const buttonsContainer = screen.getByRole("link", {
      name: "Go to home",
    }).parentElement;
    expect(buttonsContainer).toHaveStyle(buttonStyle);
  });
});
