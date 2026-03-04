// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

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

  it("applies useInternalScroll class and renders Scrollbar when useInternalScroll is true", () => {
    render(
      <ChatContainer useInternalScroll>
        <div data-testid="child">Child Content</div>
      </ChatContainer>,
    );

    const mainDiv = screen.getByTestId("chat-container");
    expect(mainDiv.className).toContain("useInternalScroll");

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

  it("renders children directly when useInternalScroll is false", () => {
    render(
      <ChatContainer useInternalScroll={false}>
        <div data-testid="child">Child Content</div>
      </ChatContainer>,
    );

    expect(screen.queryByTestId("scroll-body")).not.toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
