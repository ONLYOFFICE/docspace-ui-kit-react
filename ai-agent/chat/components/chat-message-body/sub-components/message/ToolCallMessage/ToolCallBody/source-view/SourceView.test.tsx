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
    render(<SourceView content={mockContent} allowExternalNavigation={true} />);
    const items = screen.getAllByTestId("source-item");
    expect(items).toHaveLength(2);
  });

  it("renders web source with link and icon", () => {
    render(<SourceView content={mockContent} allowExternalNavigation={true} />);
    const webSource = screen.getByText("Source 1").closest("a");
    expect(webSource).toHaveAttribute("href", "https://example.com/1");
    expect(screen.getByAltText("source icon")).toHaveAttribute(
      "src",
      "https://example.com/fav1.ico",
    );
  });

  it("renders knowledge source with document icon", () => {
    render(<SourceView content={mockContent} allowExternalNavigation={true} />);
    expect(screen.getByText("Document 1")).toBeInTheDocument();
    expect(screen.getByTestId("doc-icon")).toBeInTheDocument();
  });

  it("respects allowExternalNavigation=false", () => {
    render(
      <SourceView content={mockContent} allowExternalNavigation={false} />,
    );
    const webSource = screen.getByText("Source 1").closest("div");
    expect(webSource).not.toHaveAttribute("href");
    expect(screen.queryByTestId("external-link-icon")).not.toBeInTheDocument();
  });
});
