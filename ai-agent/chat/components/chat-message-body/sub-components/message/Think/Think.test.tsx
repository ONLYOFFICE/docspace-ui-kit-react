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
import Think from "./index";

// Mock child components
vi.mock("../../../../../../../components/loader", () => ({
  Loader: ({ "data-testid": testId }: { "data-testid"?: string }) => (
    <div data-testid={testId || "loader"} />
  ),
  LoaderTypes: { track: "track" },
}));
vi.mock("../../../../../../../components/text", () => ({
  Text: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock utils
vi.mock("../../../../../../../utils/i18n", () => ({
  useCommonTranslation: () => vi.fn((key) => key),
}));

describe("<Think />", () => {
  it("renders loader by default when not finished", () => {
    render(
      <Think isFinished={false}>
        <div data-testid="child-content">Think content</div>
      </Think>,
    );

    expect(screen.getByTestId("think-loader")).toBeInTheDocument();
    expect(screen.queryByTestId("think-finished-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("child-content")).not.toBeInTheDocument();
  });

  it("renders finished icon when isFinished is true", () => {
    render(
      <Think isFinished={true}>
        <div data-testid="child-content">Think content</div>
      </Think>,
    );

    expect(screen.getByTestId("think-finished-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("think-loader")).not.toBeInTheDocument();
  });

  it("toggles content visibility on click", () => {
    render(
      <Think>
        <div data-testid="child-content">Think content</div>
      </Think>,
    );

    const title = screen.getByTestId("think-title");

    // Initial state: hidden
    expect(screen.queryByTestId("child-content")).not.toBeInTheDocument();

    // Toggle: open
    fireEvent.click(title);
    expect(screen.getByTestId("child-content")).toBeInTheDocument();

    // Toggle: close
    fireEvent.click(title);
    expect(screen.queryByTestId("child-content")).not.toBeInTheDocument();
  });

  it("applies correct styles based on isFirst prop", () => {
    const { rerender } = render(<Think isFirst={true}>Content</Think>);
    const think = screen.getByTestId("think");

    // When isFirst is true, it shouldn't have withMarginTop
    expect(think.className).not.toContain("withMarginTop");

    rerender(<Think isFirst={false}>Content</Think>);
    expect(think.className).toContain("withMarginTop");
  });
});
