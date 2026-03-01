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
  ToolCallHeader: ({ setCollapsed, expandable }: { setCollapsed: (val: boolean) => void, expandable: boolean }) => (
    <div data-testid="tool-call-header">
      {expandable ? (
        <button onClick={() => setCollapsed(false)} data-testid="expand-button">Expand</button>
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
      />
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
      />
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
      />
    );
    expect(screen.queryByTestId("expand-button")).not.toBeInTheDocument();
  });
});
