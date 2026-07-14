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
import { render, screen } from "@testing-library/react";
import { MCPToolContent } from "./index";
import { useMessageStore } from "../../../../../../../store/messageStore";
import { useTheme } from "../../../../../../../../../context/ThemeContext";
import { useApi } from "../../../../../../../../../providers";
import type { TToolCallContent } from "../../../../../../../../../types/ai";
import { ContentType, ServerType } from "../../../../../../../../../enums";

// Mock store and providers
vi.mock("../../../../../../../store/messageStore", () => ({
  useMessageStore: vi.fn(),
}));
vi.mock("../../../../../../../../../context/ThemeContext", () => ({
  useTheme: vi.fn(),
}));
vi.mock("../../../../../../../../../providers", () => ({
  useApi: vi.fn(),
}));

// Mock components
vi.mock("../../../../../../../../../components/text", () => ({
  Text: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
}));
vi.mock("../../../../../../../../../components/mcp-icon", () => ({
  MCPIcon: ({ title, imgSrc }: { title: string; imgSrc?: string }) => (
    <div data-testid="mcp-icon" title={title} data-imgsrc={imgSrc} />
  ),
  MCPIconSize: { Small: "small" },
}));

// Mock utils
vi.mock("../../../../../../../../../utils/i18n", () => ({
  useCommonTranslation: () => vi.fn((key) => key),
}));
vi.mock("../../../../../../../../../utils/ai/getServerIcon", () => ({
  getServerIcon: vi.fn(() => <div data-testid="server-icon" />),
}));

describe("<MCPToolContent />", () => {
  const mockContent: TToolCallContent = {
    type: ContentType.Tool,
    callId: "call-1",
    name: "test-tool",
    arguments: {},
    mcpServerInfo: {
      serverId: "server-1",
      serverName: "test-server",
      serverType: ServerType.Custom,
      icon: {
        icon48: "",
        icon32: "",
        icon24: "",
        icon16: "",
      },
    },
  };

  beforeEach(() => {
    vi.mocked(useMessageStore).mockReturnValue({
      generateDocxToolName: "docx",
      generateFormToolName: "form",
      generatePresentationToolName: "pres",
    } as unknown as ReturnType<typeof useMessageStore>);

    vi.mocked(useTheme).mockReturnValue({
      isBase: true,
    } as unknown as ReturnType<typeof useTheme>);

    vi.mocked(useApi).mockReturnValue({
      baseUrl: "https://api.url",
    } as unknown as ReturnType<typeof useApi>);
  });

  it("renders tool name correctly", () => {
    render(<MCPToolContent content={mockContent} />);
    expect(screen.getByText("test-tool")).toBeInTheDocument();
  });

  it("renders MCPIcon with server name", () => {
    render(<MCPToolContent content={mockContent} />);
    const icon = screen.getByTestId("mcp-icon");
    expect(icon).toHaveAttribute("title", "test-server");
  });

  it("renders Word icon for generate docx tool", () => {
    const docxContent: TToolCallContent = {
      ...mockContent,
      name: "docx",
    };
    render(<MCPToolContent content={docxContent} />);
    expect(screen.getByTestId("word-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("mcp-icon")).not.toBeInTheDocument();
  });

  it("renders custom icon when provided in mcpServerInfo", () => {
    const customIconContent: TToolCallContent = {
      ...mockContent,
      mcpServerInfo: {
        ...mockContent.mcpServerInfo!,
        icon: {
          icon48: "",
          icon32: "",
          icon24: "",
          icon16: "https://custom.icon",
        },
      },
    };
    render(<MCPToolContent content={customIconContent} />);
    const icon = screen.getByTestId("mcp-icon");
    expect(icon).toHaveAttribute("data-imgsrc", "https://custom.icon");
  });
});
