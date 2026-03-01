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
import ToolCallMessage from "./index";
import { ToolCallStatus } from "./tool-call/ToolCall.enum";
import type { TToolCallContent } from "../../../../../../../types/ai";
import { ContentType } from "../../../../../../../enums";

// Mock child components
vi.mock("./tool-call", () => ({
  ToolCall: ({ status }: { status: ToolCallStatus }) => (
    <div data-testid="tool-call" data-status={status} />
  ),
}));

vi.mock("./tool-call-confirm-dialog", () => ({
  ToolCallConfirmDialog: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="tool-call-confirm-dialog">
      <button onClick={onClose} data-testid="close-confirm-dialog">Close</button>
    </div>
  ),
}));

describe("<ToolCallMessage />", () => {
  const mockContent: TToolCallContent = {
    type: ContentType.Tool,
    callId: "call-1",
    name: "test-tool",
    arguments: {},
    managed: false,
  };

  it("renders ToolCall with Loading status when no result", () => {
    render(<ToolCallMessage content={mockContent} allowExternalNavigation={true} />);
    const toolCall = screen.getByTestId("tool-call");
    expect(toolCall).toBeInTheDocument();
    expect(toolCall).toHaveAttribute("data-status", ToolCallStatus.Loading);
  });

  it("renders ToolCall with Finished status when result is present", () => {
    const contentWithResult: TToolCallContent = {
      ...mockContent,
      result: { data: "ok" },
    };
    render(<ToolCallMessage content={contentWithResult} allowExternalNavigation={true} />);
    const toolCall = screen.getByTestId("tool-call");
    expect(toolCall).toHaveAttribute("data-status", ToolCallStatus.Finished);
  });

  it("renders ToolCall with Failed status when result has error", () => {
    const contentWithError: TToolCallContent = {
      ...mockContent,
      result: { error: "error message" },
    };
    render(<ToolCallMessage content={contentWithError} allowExternalNavigation={true} />);
    const toolCall = screen.getByTestId("tool-call");
    expect(toolCall).toHaveAttribute("data-status", ToolCallStatus.Failed);
  });

  it("shows confirmation dialog when managed is true", () => {
    const contentManaged: TToolCallContent = {
      ...mockContent,
      managed: true,
    };
    render(<ToolCallMessage content={contentManaged} allowExternalNavigation={true} />);
    expect(screen.getByTestId("tool-call-confirm-dialog")).toBeInTheDocument();
    const toolCall = screen.getByTestId("tool-call");
    expect(toolCall).toHaveAttribute("data-status", ToolCallStatus.Confirmation);
  });
});
