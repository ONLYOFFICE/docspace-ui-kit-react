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
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ToolCallHeader } from "./index";
import { ToolCallPlacement, ToolCallStatus } from "../tool-call/ToolCall.enum";
import { useMessageStore } from "../../../../../../store/messageStore";
import type { TToolCallContent } from "../../../../../../../../types/ai";
import { ContentType } from "../../../../../../../../enums";

// Mock store
vi.mock("../../../../../../store/messageStore", () => ({
  useMessageStore: vi.fn(),
}));

// Mock child components
vi.mock("./search-tool-content", () => ({
  SearchToolContent: () => <div data-testid="search-tool-content" />,
}));
vi.mock("./mcp-tool-content", () => ({
  MCPToolContent: () => <div data-testid="mcp-tool-content" />,
}));
vi.mock("../../../../../../../../components/loader", () => ({
  Loader: ({ "data-testid": testId }: { "data-testid"?: string }) => (
    <div data-testid={testId || "loader"} />
  ),
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
      />,
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
      />,
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
      />,
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
      />,
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
      />,
    );
    const header = screen.getByTestId("tool-call-header");
    fireEvent.click(header);
    expect(mockSetCollapsed).toHaveBeenCalledWith(false);
  });
});
