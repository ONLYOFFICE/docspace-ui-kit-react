/*
 * (c) Copyright Ascensio System SIA 2009-2026
 *
 * This program is a free software product.
 * You can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
 * Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
 * to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
 * any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
 * the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions of the Program must
 * display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product logo when
 * distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
 * trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
 * content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
 * International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
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
vi.mock("../../../../../../../utils", () => ({
  getCommonTranslation: vi.fn((key) => key),
  IconSizeType: { scale: "scale" },
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
