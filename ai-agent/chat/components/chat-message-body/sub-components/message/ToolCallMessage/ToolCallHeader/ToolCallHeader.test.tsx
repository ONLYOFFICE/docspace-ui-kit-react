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
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ToolCallHeader } from "./index";
import { ToolCallPlacement, ToolCallStatus } from "../ToolCall.enum";
import { useMessageStore } from "../../../../../../store/messageStore";
import type { TToolCallContent } from "../../../../../../../../types/ai";
import { ContentType } from "../../../../../../../../enums";

// Mock store
vi.mock("../../../../../../store/messageStore", () => ({
  useMessageStore: vi.fn(),
}));

// Mock child components
vi.mock("./SearchToolContent", () => ({
  SearchToolContent: () => <div data-testid="search-tool-content" />,
}));
vi.mock("./MCPToolContent", () => ({
  MCPToolContent: () => <div data-testid="mcp-tool-content" />,
}));
vi.mock("../../../../../../../../components/loader", () => ({
  Loader: ({ "data-testid": testId }: { "data-testid"?: string }) => <div data-testid={testId || "loader"} />,
  LoaderTypes: { track: "track" },
}));

describe("<ToolCallHeader />", () => {
  const mockContent: TToolCallContent = {
    type: ContentType.Tool,
    callId: "call-1",
    name: "test-tool",
    arguments: {},
  };

  const mockSetCollapsed = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMessageStore).mockReturnValue({
      webCrawlingToolName: "crawl",
    } as unknown as ReturnType<typeof useMessageStore>);
  });

  it("renders loader in Loading status", () => {
    render(
      <ToolCallHeader
        content={mockContent}
        collapsed={true}
        setCollapsed={mockSetCollapsed}
        status={ToolCallStatus.Loading}
        placement={ToolCallPlacement.Message}
      />
    );
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renders finish icon in Finished status", () => {
    render(
      <ToolCallHeader
        content={mockContent}
        collapsed={true}
        setCollapsed={mockSetCollapsed}
        status={ToolCallStatus.Finished}
        placement={ToolCallPlacement.Message}
      />
    );
    expect(screen.getByTestId("tool-finish-icon")).toBeInTheDocument();
  });

  it("renders alert icon in Failed status", () => {
    render(
      <ToolCallHeader
        content={mockContent}
        collapsed={true}
        setCollapsed={mockSetCollapsed}
        status={ToolCallStatus.Failed}
        placement={ToolCallPlacement.Message}
      />
    );
    expect(screen.getByTestId("alert-icon")).toBeInTheDocument();
  });

  it("renders SearchToolContent when isSearchTool=true", () => {
    render(
      <ToolCallHeader
        content={mockContent}
        collapsed={true}
        setCollapsed={mockSetCollapsed}
        status={ToolCallStatus.Finished}
        placement={ToolCallPlacement.Message}
        isSearchTool={true}
      />
    );
    expect(screen.getByTestId("search-tool-content")).toBeInTheDocument();
  });

  it("calls setCollapsed on click when expandable", () => {
    render(
      <ToolCallHeader
        content={mockContent}
        collapsed={true}
        setCollapsed={mockSetCollapsed}
        status={ToolCallStatus.Finished}
        placement={ToolCallPlacement.Message}
        expandable={true}
      />
    );
    const header = screen.getByTestId("tool-call-header");
    fireEvent.click(header);
    expect(mockSetCollapsed).toHaveBeenCalledWith(false);
  });
});
