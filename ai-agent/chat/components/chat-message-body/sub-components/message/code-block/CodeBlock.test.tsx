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
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CodeBlock from "./index";
import copy from "copy-to-clipboard";
import { toastr } from "../../../../../../../components/toast";
import { useTheme } from "../../../../../../../context/ThemeContext";

vi.mock("copy-to-clipboard", () => ({
  default: vi.fn(),
}));

vi.mock("../../../../../../../components/toast", () => ({
  toastr: {
    success: vi.fn(),
  },
}));

vi.mock("../../../../../../../context/ThemeContext", () => ({
  useTheme: vi.fn(),
}));

vi.mock("react-syntax-highlighter", () => ({
  Prism: ({ children, language }: { children: string; language: string }) => (
    <pre data-testid="syntax-highlighter" data-language={language}>
      {children}
    </pre>
  ),
}));

vi.mock("../../../../../../../components/text", () => ({
  Text: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

vi.mock("../../../../../../../components/icon-button", () => ({
  IconButton: ({
    onClick,
    "aria-label": ariaLabel,
  }: {
    onClick: () => void;
    "aria-label": string;
  }) => (
    <button
      data-testid="copy-button"
      onClick={onClick}
      aria-label={ariaLabel}
      type="button"
    />
  ),
}));

vi.mock("../../../../../../../components/scrollbar", () => ({
  Scrollbar: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("../../../../../../../utils/i18n", () => ({
  useCommonTranslation: () => vi.fn((key: string) => key),
}));

describe("CodeBlock component", () => {
  const defaultProps = {
    language: "typescript",
    content: "const a = 1;",
    successCopyMessage: "Copied!",
  };

  const mockedUseTheme = vi.mocked(useTheme);

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseTheme.mockReturnValue({
      isBase: true,
      theme: "Base",
      currentColorScheme: undefined,
    });
  });

  it("renders code block correctly", () => {
    render(<CodeBlock {...defaultProps} />);

    expect(screen.getByText("typescript")).toBeInTheDocument();
    expect(screen.getByTestId("syntax-highlighter")).toHaveTextContent(
      "const a = 1;",
    );
    expect(screen.getByTestId("syntax-highlighter")).toHaveAttribute(
      "data-language",
      "typescript",
    );
    expect(screen.getByTestId("code-block")).toBeInTheDocument();
  });

  it("calls copy and toast on copy button click", () => {
    render(<CodeBlock {...defaultProps} />);

    fireEvent.click(screen.getByTestId("copy-button"));

    expect(copy).toHaveBeenCalledWith("const a = 1;");
    expect(toastr.success).toHaveBeenCalledWith("Copied!");
  });

  it("uses default copy message if not provided", () => {
    render(<CodeBlock {...defaultProps} successCopyMessage={undefined} />);

    fireEvent.click(screen.getByTestId("copy-button"));

    expect(toastr.success).toHaveBeenCalledWith("CopiedToClipboard");
  });

  it("has correct aria-label on copy button", () => {
    render(<CodeBlock {...defaultProps} />);
    const copyButton = screen.getByTestId("copy-button");
    expect(copyButton).toHaveAttribute("aria-label", "copy button");
  });
});
