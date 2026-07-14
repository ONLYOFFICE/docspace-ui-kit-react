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
import { SourceView } from "./index";
import type { TToolCallContent } from "../../../../../../../../../types/ai";
import { ContentType } from "../../../../../../../../../enums";

// Mock child components
vi.mock("../../../../../../../../../components/link", () => ({
  Link: ({
    children,
    href,
    "data-testid": testId,
  }: {
    children: React.ReactNode;
    href?: string;
    "data-testid"?: string;
  }) => (
    <a href={href} data-testid={testId}>
      {children}
    </a>
  ),
  LinkTarget: { blank: "_blank" },
}));
vi.mock("../../../../../../../../../components/text", () => ({
  Text: ({
    children,
    title,
  }: {
    children: React.ReactNode;
    title?: string;
  }) => <div title={title}>{children}</div>,
}));
vi.mock("../../../../../../../../../components/tooltip", () => ({
  Tooltip: () => <div data-testid="tooltip" />,
}));
vi.mock("../../../../../../../../../assets/universe.react.svg", () => ({
  default: () => <div data-testid="fallback-icon" />,
}));
vi.mock("../../../../../../../../../assets/external.link.svg", () => ({
  default: () => <div data-testid="external-link-icon" />,
}));

// Mock utils
vi.mock("../../tool-call/ToolCall.utils", () => ({
  getKnowledgeDocumentIconByFileName: vi.fn(() => (
    <div data-testid="doc-icon" />
  )),
  getRootDomain: vi.fn((url) => url),
}));

vi.mock("../../../../../../../../../providers/api", () => ({
  useApi: () => ({ baseUrl: "mock-url" }),
}));

describe("<SourceView />", () => {
  const mockContent: TToolCallContent = {
    type: ContentType.Tool,
    callId: "call-1",
    name: "test-tool",
    arguments: {},
    result: {
      data: [
        {
          title: "Source 1",
          url: "https://example.com/1",
          text: "content",
          faviconUrl: "https://example.com/fav1.ico",
        },
        {
          title: "Document 1",
          fileId: 1,
          relativeUrl: "/path/to/doc",
          text: "Document content preview",
        },
      ],
    },
  };

  it("renders multiple source items", () => {
    render(<SourceView content={mockContent} />);
    const items = screen.getAllByTestId("source-item");
    expect(items).toHaveLength(2);
  });

  it("renders web source with link and icon", () => {
    render(<SourceView content={mockContent} />);
    const webSource = screen.getByText("Source 1").closest("a");
    expect(webSource).toHaveAttribute("href", "https://example.com/1");
    expect(screen.getByAltText("source icon")).toHaveAttribute(
      "src",
      "https://example.com/fav1.ico",
    );
  });

  it("renders knowledge source with document icon", () => {
    render(<SourceView content={mockContent} />);
    expect(screen.getByText("Document 1")).toBeInTheDocument();
    expect(screen.getByTestId("doc-icon")).toBeInTheDocument();
  });


});
