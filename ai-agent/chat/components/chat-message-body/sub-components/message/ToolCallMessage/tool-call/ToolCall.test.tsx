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
import { ToolCall } from "./index";
import { ToolCallPlacement, ToolCallStatus } from "./ToolCall.enum";
import { useMessageStore } from "../../../../../../store/messageStore";
import type { TToolCallContent } from "../../../../../../../../types/ai";
import { ContentType } from "../../../../../../../../enums";

// Mock store
vi.mock("../../../../../../store/messageStore", () => ({
  useMessageStore: vi.fn(),
}));

// Mock child components
vi.mock("../ToolCallHeader", () => ({
  ToolCallHeader: ({
    setCollapsed,
    expandable,
  }: {
    setCollapsed: (val: boolean) => void;
    expandable: boolean;
  }) => (
    <div data-testid="tool-call-header">
      {expandable ? (
        <button onClick={() => setCollapsed(false)} data-testid="expand-button">
          Expand
        </button>
      ) : null}
    </div>
  ),
}));

vi.mock("../ToolCallBody", () => ({
  ToolCallBody: () => <div data-testid="tool-call-body" />,
}));

describe("<ToolCall />", () => {
  const mockContent: TToolCallContent = {
    type: ContentType.Tool,
    callId: "call-1",
    name: "test-tool",
    arguments: {},
  };

  beforeEach(() => {
    vi.mocked(useMessageStore).mockReturnValue({
      knowledgeSearchToolName: "knowledge",
      webSearchToolName: "search",
      webCrawlingToolName: "crawl",
    } as unknown as ReturnType<typeof useMessageStore>);
  });

  it("renders ToolCallHeader and not ToolCallBody when collapsed by default", () => {
    render(
      <ToolCall
        content={mockContent}
        status={ToolCallStatus.Finished}
        placement={ToolCallPlacement.Message}
      />,
    );
    expect(screen.getByTestId("tool-call-header")).toBeInTheDocument();
    expect(screen.queryByTestId("tool-call-body")).not.toBeInTheDocument();
  });

  it("renders ToolCallBody when expanded", () => {
    render(
      <ToolCall
        content={mockContent}
        status={ToolCallStatus.Finished}
        placement={ToolCallPlacement.Message}
      />,
    );
    const expandButton = screen.getByTestId("expand-button");
    fireEvent.click(expandButton);
    expect(screen.getByTestId("tool-call-body")).toBeInTheDocument();
  });

  it("sets expandable to false for web crawling tool", () => {
    const crawlingContent: TToolCallContent = {
      ...mockContent,
      name: "crawl",
    };
    render(
      <ToolCall
        content={crawlingContent}
        status={ToolCallStatus.Finished}
        placement={ToolCallPlacement.Message}
      />,
    );
    expect(screen.queryByTestId("expand-button")).not.toBeInTheDocument();
  });
});
