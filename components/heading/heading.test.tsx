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

import { Heading } from ".";
import { HeadingLevel, HeadingSize } from "./Heading.enums";
import styles from "./Heading.module.scss";

describe("<Heading />", () => {
  it("renders without error", () => {
    render(
      <Heading
        level={HeadingLevel.h4}
        size={HeadingSize.medium}
        title="Some title"
      >
        Some text
      </Heading>,
    );

    expect(screen.getByTestId("heading")).toBeInTheDocument();
  });

  it("renders with inherited text props", () => {
    render(
      <Heading
        level={HeadingLevel.h1}
        color="red"
        fontSize="24px"
        fontWeight={700}
        truncate
        isInline
      >
        Styled heading
      </Heading>,
    );

    const heading = screen.getByTestId("heading");
    expect(heading.style.color).toBe("red");
    expect(heading.style.fontSize).toBe("24px");
    expect(heading.style.fontWeight).toBe("700");
  });

  it("renders with different heading levels", () => {
    const { rerender } = render(
      <Heading level={HeadingLevel.h1}>H1 Heading</Heading>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();

    rerender(<Heading level={HeadingLevel.h2}>H2 Heading</Heading>);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("renders with different sizes", () => {
    const { rerender } = render(
      <Heading level={HeadingLevel.h1} size={HeadingSize.large}>
        Large heading
      </Heading>,
    );
    const heading = screen.getByTestId("heading");
    expect(heading.classList.contains(styles.large)).toBe(true);

    rerender(
      <Heading level={HeadingLevel.h1} size={HeadingSize.small}>
        Small heading
      </Heading>,
    );
    const smallHeading = screen.getByTestId("heading");
    expect(smallHeading.classList.contains(styles.small)).toBe(true);
  });

  it("renders with different types", () => {
    const { rerender } = render(
      <Heading level={HeadingLevel.h1} type="menu">
        Menu heading
      </Heading>,
    );
    const heading = screen.getByTestId("heading");
    expect(heading.classList.contains(styles.menu)).toBe(true);

    rerender(
      <Heading level={HeadingLevel.h1} type="content">
        Content heading
      </Heading>,
    );
    const contentHeading = screen.getByTestId("heading");
    expect(contentHeading.classList.contains(styles.content)).toBe(true);
  });

  it("renders with custom data-testid", () => {
    render(
      <Heading level={HeadingLevel.h1} data-testid="custom-heading">
        Custom test id heading
      </Heading>,
    );
    expect(screen.getByTestId("custom-heading")).toBeInTheDocument();
  });

  it("renders with aria-label", () => {
    render(
      <Heading level={HeadingLevel.h1} aria-label="Descriptive label">
        Aria labeled heading
      </Heading>,
    );
    const heading = screen.getByTestId("heading");
    expect(heading).toHaveAttribute("aria-label", "Descriptive label");
  });
});
