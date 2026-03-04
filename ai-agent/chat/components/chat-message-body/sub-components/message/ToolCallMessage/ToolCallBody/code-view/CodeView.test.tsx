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
import { render, screen } from "@testing-library/react";
import { CodeView } from "./index";
import { ToolCallPlacement } from "../../tool-call/ToolCall.enum";
import type { TToolCallContent } from "../../../../../../../../../types/ai";
import { ContentType } from "../../../../../../../../../enums";

// Mock child components
vi.mock("../../../Markdown", () => ({
  default: ({ chatMessage }: { chatMessage: string }) => (
    <div data-testid="markdown">{chatMessage}</div>
  ),
}));
vi.mock("../../../../../../../../../components/text", () => ({
  Text: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock utils
vi.mock("../../../../../../../utils", () => ({
  formatJsonWithMarkdown: vi.fn((json) => JSON.stringify(json)),
  getCommonTranslation: vi.fn((key) => key),
}));

describe("<CodeView />", () => {
  const mockContent: TToolCallContent = {
    type: ContentType.Tool,
    callId: "call-1",
    name: "test-tool",
    arguments: { arg1: "val1" },
  };

  it("renders arguments by default", () => {
    render(
      <CodeView content={mockContent} placement={ToolCallPlacement.Message} />,
    );
    expect(
      screen.getByTestId("tool-call-code-view-item-arg"),
    ).toBeInTheDocument();
    expect(screen.getByText('{"arg1":"val1"}')).toBeInTheDocument();
  });

  it("renders result when present and placement is message", () => {
    const contentWithResult: TToolCallContent = {
      ...mockContent,
      result: { data: { res1: "val2" } },
    };
    render(
      <CodeView
        content={contentWithResult}
        placement={ToolCallPlacement.Message}
      />,
    );
    expect(
      screen.getByTestId("tool-call-code-view-item-result"),
    ).toBeInTheDocument();
    expect(screen.getByText('{"res1":"val2"}')).toBeInTheDocument();
  });

  it("does not render result when placement is confirmDialog", () => {
    const contentWithResult: TToolCallContent = {
      ...mockContent,
      result: { data: { res1: "val2" } },
    };
    render(
      <CodeView
        content={contentWithResult}
        placement={ToolCallPlacement.ConfirmDialog}
      />,
    );
    expect(
      screen.queryByTestId("tool-call-code-view-item-result"),
    ).not.toBeInTheDocument();
  });
});
