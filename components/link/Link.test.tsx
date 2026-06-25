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
import { describe, it, expect, vi } from "vitest";
import { screen, render } from "@testing-library/react";

import { Link, LinkType } from "./index";

// Mock CSS modules - return default export for CSS Modules
vi.mock("./Link.module.scss", () => ({
  default: {
    link: "link",
    semitransparent: "semitransparent",
    isHovered: "isHovered",
    textOverflow: "textOverflow",
    noHover: "noHover",
    enableUserSelect: "enableUserSelect",
    page: "page",
  },
}));

const baseProps = {
  type: LinkType.page,
  color: "black",
  href: "https://github.com",
};

describe("<Link />", () => {
  it("renders without error", () => {
    render(<Link {...baseProps}>link</Link>);
    expect(screen.queryByTestId("link")).toBeInTheDocument();
  });

  it("renders with custom data-testid", () => {
    render(
      <Link {...baseProps} dataTestId="custom-link">
        link
      </Link>,
    );
    expect(screen.queryByTestId("custom-link")).toBeInTheDocument();
  });

  it("renders with isBold prop", () => {
    render(
      <Link {...baseProps} isBold>
        link
      </Link>,
    );
    const link = screen.getByTestId("link");
    expect(link).toHaveStyle({ fontWeight: "700" });
  });

  it("renders with isHovered prop", () => {
    render(
      <Link {...baseProps} isHovered>
        link
      </Link>,
    );
    const link = screen.getByTestId("link");
    expect(link.className).toContain("isHovered");
  });

  it("renders with isSemitransparent prop", () => {
    render(
      <Link {...baseProps} isSemitransparent>
        link
      </Link>,
    );
    const link = screen.getByTestId("link");
    expect(link.className).toContain("semitransparent");
  });

  it("renders with isTextOverflow prop", () => {
    render(
      <Link {...baseProps} isTextOverflow>
        link
      </Link>,
    );
    const link = screen.getByTestId("link");
    expect(link.className).toContain("textOverflow");
  });

  it("renders with noHover prop", () => {
    render(
      <Link {...baseProps} noHover>
        link
      </Link>,
    );
    const link = screen.getByTestId("link");
    expect(link.className).toContain("noHover");
  });

  it("renders with enableUserSelect prop", () => {
    render(
      <Link {...baseProps} enableUserSelect>
        link
      </Link>,
    );
    const link = screen.getByTestId("link");
    expect(link.className).toContain("enableUserSelect");
  });

  it("renders with type prop action", () => {
    render(
      <Link {...baseProps} type={LinkType.action}>
        link
      </Link>,
    );
    const link = screen.getByTestId("link");
    expect(link.className).not.toContain("page");
  });

  it("renders with custom fontSize and lineHeight", () => {
    render(
      <Link {...baseProps} fontSize="16px" lineHeight="24px">
        link
      </Link>,
    );
    const link = screen.getByTestId("link");
    expect(link).toHaveStyle({ fontSize: "16px", lineHeight: "24px" });
  });

  it("accepts id", () => {
    render(
      <Link {...baseProps} id="testId">
        link
      </Link>,
    );
    const link = screen.getByTestId("link");
    expect(link).toHaveAttribute("id", "testId");
  });

  it("accepts className", () => {
    const className = "custom-class";
    render(
      <Link {...baseProps} className={className}>
        link
      </Link>,
    );
    const link = screen.getByTestId("link");
    expect(link).toHaveClass(className);
  });

  it("sets aria-label", () => {
    render(
      <Link {...baseProps} ariaLabel="Custom label">
        link
      </Link>,
    );
    const link = screen.getByTestId("link");
    expect(link).toHaveAttribute("aria-label", "Custom label");
  });

  it("uses children as aria-label when ariaLabel prop is not provided", () => {
    render(<Link {...baseProps}>Custom text</Link>);
    const link = screen.getByTestId("link");
    expect(link).toHaveAttribute("aria-label", "Custom text");
  });

  it("renders with custom rel attribute", () => {
    render(
      <Link {...baseProps} rel="noopener">
        link
      </Link>,
    );
    const link = screen.getByTestId("link");
    expect(link).toHaveAttribute("rel", "noopener");
  });

  it("renders with custom tabIndex", () => {
    render(
      <Link {...baseProps} tabIndex={-1}>
        link
      </Link>,
    );
    const link = screen.getByTestId("link");
    expect(link).toHaveAttribute("tabindex", "-1");
  });
});
