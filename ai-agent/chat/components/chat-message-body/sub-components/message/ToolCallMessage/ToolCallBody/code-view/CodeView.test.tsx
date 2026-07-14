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
}));

vi.mock("../../../../../../../utils/i18n", () => ({
  useCommonTranslation: () => vi.fn((key) => key),
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
