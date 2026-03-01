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
import { MCPToolContent } from "./MCPToolContent";
import { useMessageStore } from "../../../../../../store/messageStore";
import { useTheme } from "../../../../../../../../context/ThemeContext";
import { useApi } from "../../../../../../../../providers";
import type { TToolCallContent } from "../../../../../../../../types/ai";
import { ContentType, ServerType } from "../../../../../../../../enums";

// Mock store and providers
vi.mock("../../../../../../store/messageStore", () => ({
  useMessageStore: vi.fn(),
}));
vi.mock("../../../../../../../../context/ThemeContext", () => ({
  useTheme: vi.fn(),
}));
vi.mock("../../../../../../../../providers", () => ({
  useApi: vi.fn(),
}));

// Mock components
vi.mock("../../../../../../../../components/text", () => ({
  Text: ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={className}>{children}</div>,
}));
vi.mock("../../../../../../../../components/mcp-icon", () => ({
  MCPIcon: ({ title, imgSrc }: { title: string, imgSrc?: string }) => (
    <div data-testid="mcp-icon" title={title} data-imgsrc={imgSrc} />
  ),
  MCPIconSize: { Small: "small" },
}));

// Mock utils
vi.mock("../../../../../../../../utils", () => ({
  getCommonTranslation: vi.fn((key) => key),
}));
vi.mock("../../../../../../../../utils/ai/getServerIcon", () => ({
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
      apiUrl: "https://api.url",
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
