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
import { render, screen, fireEvent, act } from "@testing-library/react";

import { Scrollbar } from "./Scrollbar";
import styles from "./Scrollbar.module.scss";

vi.useFakeTimers();

describe("<Scrollbar />", () => {
  afterEach(() => {
    vi.clearAllTimers();
  });

  it("renders without error", () => {
    render(<Scrollbar>Some content</Scrollbar>);
    expect(screen.getByTestId("scrollbar")).toBeInTheDocument();
  });

  it("accepts and applies className", () => {
    render(<Scrollbar className="test-class">Content</Scrollbar>);
    expect(screen.getByTestId("scrollbar")).toHaveClass("test-class");
  });

  it("handles scroll events", () => {
    const onScroll = vi.fn();
    render(
      <Scrollbar onScroll={onScroll}>
        <div style={{ height: "200px" }}>Scrollable content</div>
      </Scrollbar>,
    );

    const scroller = screen.getByTestId("scroller");
    fireEvent.scroll(scroller);
    expect(onScroll).toHaveBeenCalled();
  });

  it("handles autoHide prop correctly", () => {
    render(
      <Scrollbar autoHide>
        <div>Content</div>
      </Scrollbar>,
    );

    const scrollbar = screen.getByTestId("scrollbar");

    expect(scrollbar).toHaveClass(styles.autoHide);

    // Initially scrollVisible should not be present
    expect(scrollbar).not.toHaveClass(styles.scrollVisible);
  });

  it("applies correct tabIndex", () => {
    render(<Scrollbar tabIndex={0}>Content</Scrollbar>);
    const content = screen.getByTestId("scroll-body");
    expect(content).toHaveAttribute("tabIndex", "0");
  });

  it("handles autoFocus prop", () => {
    const focusSpy = vi.spyOn(HTMLElement.prototype, "focus");
    render(<Scrollbar autoFocus>Content</Scrollbar>);

    expect(focusSpy).toHaveBeenCalled();
    focusSpy.mockRestore();
  });

  it("applies paddingAfterLastItem prop", () => {
    render(<Scrollbar paddingAfterLastItem="50px">Content</Scrollbar>);

    const scrollbar = screen.getByTestId("scrollbar");

    expect(scrollbar).toHaveClass(styles.paddingAfterLastItem);
  });

  it("handles fixedSize prop", () => {
    render(
      <Scrollbar fixedSize style={{ width: "200px", height: "200px" }}>
        <div style={{ width: "300px", height: "300px" }}>Content</div>
      </Scrollbar>,
    );

    const scrollbar = screen.getByTestId("scrollbar");

    expect(scrollbar).toHaveClass(styles.fixedSize);
  });
});
