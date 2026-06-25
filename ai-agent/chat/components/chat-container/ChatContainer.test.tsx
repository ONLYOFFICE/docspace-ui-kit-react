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
import React from "react";

import ChatContainer from "./index";

describe("<ChatContainer />", () => {
  it("renders children without error", () => {
    render(
      <ChatContainer>
        <div data-testid="child">Child Content</div>
      </ChatContainer>,
    );

    expect(screen.getByTestId("chat-container")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("shows loading state when isLoadingChat is true", () => {
    render(
      <ChatContainer isLoadingChat>
        <div>Content</div>
      </ChatContainer>,
    );

    expect(screen.getByTestId("chat-container-loading")).toBeInTheDocument();
    expect(screen.queryByTestId("chat-container")).not.toBeInTheDocument();
  });

  it("renders Scrollbar when useExternalScroll is false", () => {
    render(
      <ChatContainer useExternalScroll={false}>
        <div data-testid="child">Child Content</div>
      </ChatContainer>,
    );

    // Check if Scrollbar content (or scroller/scroll-body from Scrollbar.tsx) is present
    expect(screen.getByTestId("scroll-body")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("applies custom width, height and style", () => {
    const customStyle = { backgroundColor: "red" };
    render(
      <ChatContainer width="500px" height="600px" style={customStyle}>
        <div>Content</div>
      </ChatContainer>,
    );

    const mainDiv = screen.getByTestId("chat-container");
    expect(mainDiv.style.width).toBe("500px");
    expect(mainDiv.style.height).toBe("600px");
    expect(mainDiv.style.backgroundColor).toBe("red");
  });

  it("renders children directly when useExternalScroll true", () => {
    render(
      <ChatContainer useExternalScroll>
        <div data-testid="child">Child Content</div>
      </ChatContainer>,
    );

    expect(screen.queryByTestId("scroll-body")).not.toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
