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

vi.mock("../../../../../../../utils", () => ({
  getCommonTranslation: vi.fn((key: string) => key),
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
