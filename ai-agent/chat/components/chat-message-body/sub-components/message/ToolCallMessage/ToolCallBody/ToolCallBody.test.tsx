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
import { render, screen } from "@testing-library/react";
import { ToolCallBody } from "./index";
import { ToolCallPlacement } from "../tool-call/ToolCall.enum";
import { useMessageStore } from "../../../../../../store/messageStore";
import type { TToolCallContent } from "../../../../../../../../types/ai";
import { ContentType } from "../../../../../../../../enums";

// Mock store
vi.mock("../../../../../../store/messageStore", () => ({
  useMessageStore: vi.fn(),
}));

// Mock child components
vi.mock("./code-view", () => ({
  CodeView: () => <div data-testid="code-view" />,
}));
vi.mock("./source-view", () => ({
  SourceView: () => <div data-testid="source-view" />,
}));
vi.mock("../../../../../../../../components/text", () => ({
  Text: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("<ToolCallBody />", () => {
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
    } as unknown as ReturnType<typeof useMessageStore>);
  });

  it("renders error message when result has error", () => {
    const errorContent: TToolCallContent = {
      ...mockContent,
      result: { error: "something went wrong" },
    };
    render(
      <ToolCallBody
        content={errorContent}
        placement={ToolCallPlacement.Message}
      />
    );
    expect(screen.getByText("something went wrong")).toBeInTheDocument();
  });

  it("renders SourceView for knowledge search tool", () => {
    const knowledgeContent: TToolCallContent = {
      ...mockContent,
      name: "knowledge",
      result: { data: [] },
    };
    render(
      <ToolCallBody
        content={knowledgeContent}
        placement={ToolCallPlacement.Message}
      />
    );
    expect(screen.getByTestId("source-view")).toBeInTheDocument();
  });

  it("renders CodeView for regular tools", () => {
    const regularContent: TToolCallContent = {
      ...mockContent,
      name: "regular",
      result: { data: {} },
    };
    render(
      <ToolCallBody
        content={regularContent}
        placement={ToolCallPlacement.Message}
      />
    );
    expect(screen.getByTestId("code-view")).toBeInTheDocument();
  });
});
