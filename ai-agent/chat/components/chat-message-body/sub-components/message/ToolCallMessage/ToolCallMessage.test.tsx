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
      <button onClick={onClose} data-testid="close-confirm-dialog">
        Close
      </button>
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
    render(<ToolCallMessage content={mockContent} />);
    const toolCall = screen.getByTestId("tool-call");
    expect(toolCall).toBeInTheDocument();
    expect(toolCall).toHaveAttribute("data-status", ToolCallStatus.Loading);
  });

  it("renders ToolCall with Finished status when result is present", () => {
    const contentWithResult: TToolCallContent = {
      ...mockContent,
      result: { data: "ok" },
    };
    render(<ToolCallMessage content={contentWithResult} />);
    const toolCall = screen.getByTestId("tool-call");
    expect(toolCall).toHaveAttribute("data-status", ToolCallStatus.Finished);
  });

  it("renders ToolCall with Failed status when result has error", () => {
    const contentWithError: TToolCallContent = {
      ...mockContent,
      result: { error: "error message" },
    };
    render(<ToolCallMessage content={contentWithError} />);
    const toolCall = screen.getByTestId("tool-call");
    expect(toolCall).toHaveAttribute("data-status", ToolCallStatus.Failed);
  });

  it("shows confirmation dialog when managed is true", () => {
    const contentManaged: TToolCallContent = {
      ...mockContent,
      managed: true,
    };
    render(<ToolCallMessage content={contentManaged} />);
    expect(screen.getByTestId("tool-call-confirm-dialog")).toBeInTheDocument();
    const toolCall = screen.getByTestId("tool-call");
    expect(toolCall).toHaveAttribute(
      "data-status",
      ToolCallStatus.Confirmation,
    );
  });
});
