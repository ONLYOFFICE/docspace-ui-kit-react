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
import { render, screen, fireEvent } from "@testing-library/react";

import { Link, LinkType } from "../../link";
import { RowContent } from ".";
import { globalColors } from "../../../providers/theme";
import styles from "./RowContent.module.scss";

const mainLink = (
  <div style={{ width: "140px" }}>
    <Link
      type={LinkType.page}
      title="Main"
      isBold
      fontSize="15px"
      color={globalColors.black}
    >
      Main
    </Link>
  </div>
);

const iconLink = (
  <div>
    <Link
      type={LinkType.action}
      title="Icon"
      fontSize="12px"
      color={globalColors.gray}
    >
      Icon
    </Link>
  </div>
);

const sideLink = (
  <div style={{ width: "80px" }}>
    <Link
      type={LinkType.page}
      title="Side"
      fontSize="12px"
      color={globalColors.gray}
    >
      Side
    </Link>
  </div>
);

describe("<RowContent />", () => {
  it("renders without error", () => {
    render(
      <RowContent>
        {mainLink}
        {iconLink}
        {sideLink}
      </RowContent>,
    );

    expect(screen.getByTestId("row-content")).toBeInTheDocument();
    expect(screen.getByText("Main")).toBeInTheDocument();
    expect(screen.getByText("Icon")).toBeInTheDocument();
    expect(screen.getByText("Side")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const customClass = "custom-class";
    render(
      <RowContent className={customClass}>
        {mainLink}
        {iconLink}
        {sideLink}
      </RowContent>,
    );

    expect(screen.getByTestId("row-content")).toHaveClass(customClass);
  });

  it("applies custom id", () => {
    const customId = "custom-id";
    render(
      <RowContent id={customId}>
        {mainLink}
        {iconLink}
        {sideLink}
      </RowContent>,
    );

    expect(screen.getByTestId("row-content")).toHaveAttribute("id", customId);
  });

  it("applies custom style", () => {
    const customStyle = { backgroundColor: "red" };
    render(
      <RowContent style={customStyle}>
        {mainLink}
        {iconLink}
        {sideLink}
      </RowContent>,
    );

    expect(screen.getByTestId("row-content").style.backgroundColor).toBe("red");
  });

  it("handles onClick event", () => {
    const onClick = vi.fn();
    render(
      <RowContent onClick={onClick}>
        {mainLink}
        {iconLink}
        {sideLink}
      </RowContent>,
    );

    fireEvent.click(screen.getByTestId("row-content"));
    expect(onClick).toHaveBeenCalled();
  });

  it("disables side info when disableSideInfo is true", () => {
    render(
      <RowContent disableSideInfo>
        {mainLink}
        {iconLink}
        {sideLink}
      </RowContent>,
    );

    expect(screen.queryByTestId("row-content")).not.toHaveClass(
      "tabletSideInfo",
    );
  });

  it("applies side color", () => {
    const sideColor = "rgb(255, 0, 0)";
    render(
      <RowContent sideColor={sideColor}>
        {mainLink}
        {iconLink}
        {sideLink}
      </RowContent>,
    );

    const sideInfo = screen.getByTestId("tablet-side-info");
    expect(sideInfo).toHaveStyle({ color: sideColor });
  });

  it("renders main container with correct width", () => {
    render(
      <RowContent>
        {mainLink}
        {iconLink}
        {sideLink}
      </RowContent>,
    );

    const mainContainer = screen.getByTestId("main-container-wrapper");
    expect(mainContainer).toHaveStyle({ "--main-container-width": "140px" });
  });

  it("renders side container with correct width", () => {
    render(
      <RowContent>
        {mainLink}
        {iconLink}
        {sideLink}
      </RowContent>,
    );

    const sideContainer = screen.getByTestId("side-container");
    expect(sideContainer).toHaveStyle({ width: "40px" });
  });
});
