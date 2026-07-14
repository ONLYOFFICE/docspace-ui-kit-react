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
import { SearchToolContent } from "./index";
import { useMessageStore } from "../../../../../../../store/messageStore";
import type { TToolCallContent } from "../../../../../../../../../types/ai";
import { ContentType } from "../../../../../../../../../enums";

// Mock store
vi.mock("../../../../../../../store/messageStore", () => ({
  useMessageStore: vi.fn(),
}));

// Mock components
vi.mock("../../../../../../../../../components/text", () => ({
  Text: ({
    children,
    title,
  }: {
    children: React.ReactNode;
    title?: string;
  }) => <div title={title}>{children}</div>,
}));
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

// Mock utils
vi.mock("../../../../../../../../../utils/i18n", () => ({
  useCommonTranslation: () => vi.fn((key) => key),
}));

describe("<SearchToolContent />", () => {
  const mockContent: TToolCallContent = {
    type: ContentType.Tool,
    callId: "call-1",
    name: "test-tool",
    arguments: { query: "test query", url: "https://example.com" },
  };

  beforeEach(() => {
    vi.mocked(useMessageStore).mockReturnValue({
      knowledgeSearchToolName: "knowledge",
      webSearchToolName: "search",
      webCrawlingToolName: "crawl",
    } as unknown as ReturnType<typeof useMessageStore>);
  });

  it("renders KnowledgeSearchToolContent correctly", () => {
    const knowledgeContent: TToolCallContent = {
      ...mockContent,
      name: "knowledge",
    };
    render(<SearchToolContent content={knowledgeContent} />);
    expect(screen.getByTestId("documents-icon")).toBeInTheDocument();
    expect(screen.getByText(/KnowledgeSearch/)).toBeInTheDocument();
    expect(screen.getByText(/test query/)).toBeInTheDocument();
  });

  it("renders WebSearchToolContent correctly", () => {
    const webSearchContent: TToolCallContent = {
      ...mockContent,
      name: "search",
    };
    render(<SearchToolContent content={webSearchContent} />);
    expect(screen.getByTestId("universe-icon")).toBeInTheDocument();
    expect(screen.getByText(/WebSearch/)).toBeInTheDocument();
    expect(screen.getByText(/test query/)).toBeInTheDocument();
  });

  it("renders WebCrawlingToolContent as link when allowed", () => {
    const crawlingContent: TToolCallContent = {
      ...mockContent,
      name: "crawl",
      result: { data: { title: "Page Title" } },
    };
    render(<SearchToolContent content={crawlingContent} />);
    expect(screen.getByTestId("universe-icon")).toBeInTheDocument();
    expect(screen.getByText(/WebCrawling/)).toBeInTheDocument();
    expect(screen.getByText(/Page Title/)).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://example.com",
    );
    expect(screen.getByTestId("external-link-icon")).toBeInTheDocument();
  });
});
