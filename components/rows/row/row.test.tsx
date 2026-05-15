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
import { Row } from ".";
import styles from "./Row.module.scss";

const baseProps = {
  checked: false,
  element: <span>1</span>,
  contextOptions: [{ key: "1", label: "test" }],
  children: <span>Some text</span>,
  onChangeIndex: () => () => {},
};

describe("<Row />", () => {
  it("renders without error", () => {
    render(
      <Row {...baseProps} isIndexEditingMode={false} onRowClick={() => {}} />,
    );

    expect(screen.getByTestId("row")).toBeInTheDocument();
  });

  it("renders checkbox with correct styling", () => {
    render(
      <Row
        {...baseProps}
        isIndexEditingMode={false}
        onRowClick={() => {}}
        mode="modern"
      />,
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox.parentElement).toHaveClass("checkbox");
  });

  it("handles checkbox state changes", () => {
    const onSelect = vi.fn();
    render(
      <Row
        {...baseProps}
        onSelect={onSelect}
        isIndexEditingMode={false}
        onRowClick={() => {}}
      />,
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(onSelect).toHaveBeenCalled();
  });

  it("shows checkbox when row is checked", () => {
    render(
      <Row
        {...baseProps}
        checked
        isIndexEditingMode={false}
        onRowClick={() => {}}
      />,
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeVisible();
    expect(checkbox).toBeChecked();
  });

  it("applies modern styling class", () => {
    render(
      <Row
        {...baseProps}
        isIndexEditingMode={false}
        onRowClick={() => {}}
        mode="modern"
      />,
    );

    const row = screen.getByTestId("row");
    expect(row).toHaveClass(styles.modern);
  });

  it("handles indeterminate checkbox state", () => {
    render(
      <Row
        {...baseProps}
        indeterminate
        isIndexEditingMode={false}
        onRowClick={() => {}}
      />,
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveProperty("indeterminate", true);
  });

  it("renders children content", () => {
    render(
      <Row {...baseProps} isIndexEditingMode={false} onRowClick={() => {}} />,
    );

    expect(screen.getByText("Some text")).toBeInTheDocument();
  });

  it("handles row click events", () => {
    const onRowClick = vi.fn();
    render(
      <Row {...baseProps} isIndexEditingMode={false} onRowClick={onRowClick} />,
    );

    const content = screen.getByText("Some text").closest(".row_content");
    expect(content).not.toBeNull();
    if (content) {
      fireEvent.click(content);
      expect(onRowClick).toHaveBeenCalled();
    }
  });
});
