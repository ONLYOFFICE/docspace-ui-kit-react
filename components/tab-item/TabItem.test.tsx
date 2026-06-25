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
import { render, screen, fireEvent } from "@testing-library/react";
import { TabItem } from ".";
import styles from "./TabItem.module.scss";

const baseProps = {
  label: "Test Tab",
  isActive: false,
  onSelect: vi.fn(),
};

describe("<TabItem />", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders tab item with default props", () => {
    render(<TabItem {...baseProps} />);

    const tabItem = screen.getByTestId("tab-item");
    const tabText = screen.getByTestId("tab-item-text");

    expect(tabItem).toBeInTheDocument();
    expect(tabText).toHaveTextContent("Test Tab");
    expect(tabItem).toHaveClass(styles.tabItem);
    expect(tabItem).not.toHaveClass(styles.active);
    expect(tabItem).toHaveAttribute("aria-selected", "false");
  });

  it("renders tab item with active state", () => {
    render(<TabItem {...baseProps} isActive />);

    const tabItem = screen.getByTestId("tab-item");

    expect(tabItem).toBeInTheDocument();
    expect(tabItem).toHaveClass(styles.active);
    expect(tabItem).toHaveAttribute("aria-selected", "true");
  });

  it("calls onSelect when clicked", () => {
    render(<TabItem {...baseProps} />);

    const tabItem = screen.getByTestId("tab-item");
    fireEvent.click(tabItem);

    expect(baseProps.onSelect).toHaveBeenCalledTimes(1);
  });

  it("toggles active state when clicked", () => {
    const { rerender } = render(<TabItem {...baseProps} />);

    const tabItem = screen.getByTestId("tab-item");
    expect(tabItem).not.toHaveClass(styles.active);
    expect(tabItem).toHaveAttribute("aria-selected", "false");

    fireEvent.click(tabItem);

    // Re-render with updated isActive prop to simulate state change from parent
    rerender(<TabItem {...baseProps} isActive />);
    expect(tabItem).toHaveClass(styles.active);
    expect(tabItem).toHaveAttribute("aria-selected", "true");
  });

  it("renders with custom className", () => {
    render(<TabItem {...baseProps} className="custom-class" />);

    const tabItem = screen.getByTestId("tab-item");
    expect(tabItem).toHaveClass("custom-class");
  });

  it("renders with React node as label", () => {
    const customLabel = <span data-testid="custom-label">Custom Label</span>;

    render(<TabItem {...baseProps} label={customLabel} />);

    expect(screen.getByTestId("custom-label")).toBeInTheDocument();
    expect(screen.getByText("Custom Label")).toBeInTheDocument();
  });

  it("does not call onSelect when disabled", () => {
    render(<TabItem {...baseProps} isDisabled />);

    const tabItem = screen.getByTestId("tab-item");
    expect(tabItem).toHaveClass(styles.disabled);

    fireEvent.click(tabItem);

    expect(baseProps.onSelect).not.toHaveBeenCalled();
  });

  it("renders with custom dataTestId", () => {
    render(<TabItem {...baseProps} dataTestId="custom-test-id" />);

    const tabItem = screen.getByTestId("custom-test-id");
    expect(tabItem).toBeInTheDocument();
  });

  it("does not change state when allowNoSelection is true", () => {
    render(<TabItem {...baseProps} allowNoSelection />);

    const tabItem = screen.getByTestId("tab-item");
    expect(tabItem).not.toHaveClass(styles.active);

    fireEvent.click(tabItem);

    expect(tabItem).not.toHaveClass(styles.active);
    expect(baseProps.onSelect).toHaveBeenCalledTimes(1);
  });

  it("allows toggling when withMultiSelect is true", () => {
    render(<TabItem {...baseProps} withMultiSelect />);

    const tabItem = screen.getByTestId("tab-item");

    fireEvent.click(tabItem);
    expect(baseProps.onSelect).toHaveBeenCalledTimes(1);

    fireEvent.click(tabItem);
    expect(baseProps.onSelect).toHaveBeenCalledTimes(2);
  });

  it("prevents deselection when lockLastSelection is true and tab is active", () => {
    render(<TabItem {...baseProps} isActive lockLastSelection />);

    const tabItem = screen.getByTestId("tab-item");
    expect(tabItem).toHaveClass(styles.active);

    fireEvent.click(tabItem);

    expect(baseProps.onSelect).not.toHaveBeenCalled();
  });
});
