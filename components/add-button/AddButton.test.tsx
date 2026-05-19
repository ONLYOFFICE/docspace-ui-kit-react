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

import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent, render } from "@testing-library/react";

import styles from "./AddButton.module.scss";

import { AddButton } from ".";

const baseProps = {
  title: "Add item",
  isDisabled: false,
};

describe("<AddButton />", () => {
  it("renders without error", () => {
    render(<AddButton {...baseProps} />);

    expect(screen.getByTestId("selector-add-button")).toBeInTheDocument();
  });

  it("renders with title", () => {
    render(<AddButton {...baseProps} />);

    expect(screen.getByTestId("selector-add-button")).toHaveAttribute(
      "title",
      "Add item",
    );
  });

  it("accepts id", () => {
    render(<AddButton {...baseProps} id="testId" />);

    expect(screen.getByTestId("selector-add-button")).toHaveAttribute(
      "id",
      "testId",
    );
  });

  it("accepts className", () => {
    render(<AddButton {...baseProps} className="test-class" />);

    expect(screen.getByTestId("selector-add-button-container")).toHaveClass(
      "test-class",
    );
  });

  it("accepts style", () => {
    render(<AddButton {...baseProps} style={{ color: "red" }} />);

    expect(screen.getByTestId("selector-add-button").style.color).toBe("red");
  });

  it("handles click when not disabled", () => {
    const onClick = vi.fn();
    render(<AddButton {...baseProps} onClick={onClick} />);

    fireEvent.click(screen.getByTestId("selector-add-button"));
    expect(onClick).toHaveBeenCalled();
  });

  it("doesn't handle click when disabled", () => {
    const onClick = vi.fn();
    render(<AddButton {...baseProps} isDisabled onClick={onClick} />);

    fireEvent.click(screen.getByTestId("selector-add-button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applies isDisabled class when disabled", () => {
    render(<AddButton {...baseProps} isDisabled />);

    const button = screen.getByTestId("selector-add-button");
    expect(button).toHaveClass(styles.isDisabled);
  });

  it("applies isAction class when isAction prop is true", () => {
    render(<AddButton {...baseProps} isAction />);

    const button = screen.getByTestId("selector-add-button");
    expect(button).toHaveClass(styles.isAction);
  });

  it("renders IconButton with correct props", () => {
    const iconSize = 16;
    render(<AddButton {...baseProps} iconSize={iconSize} isDisabled />);

    const iconButton = screen.getByTestId("icon-button");
    expect(iconButton).toBeInTheDocument();
  });
});
