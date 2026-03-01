import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CodeBlock from "./CodeBlock";
import copy from "copy-to-clipboard";
import { toastr } from "../../../../../../components/toast";
import { useTheme } from "../../../../../../context/ThemeContext";

vi.mock("copy-to-clipboard", () => ({
  default: vi.fn(),
}));

vi.mock("../../../../../../components/toast", () => ({
  toastr: {
    success: vi.fn(),
  },
}));

vi.mock("../../../../../../context/ThemeContext", () => ({
  useTheme: vi.fn(),
}));

vi.mock("react-syntax-highlighter", () => ({
  Prism: ({ children, language }: { children: string; language: string }) => (
    <pre data-testid="syntax-highlighter" data-language={language}>
      {children}
    </pre>
  ),
}));

vi.mock("../../../../../../components/text", () => ({
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

vi.mock("../../../../../../components/icon-button", () => ({
  IconButton: ({
    onClick,
    "aria-label": ariaLabel,
  }: { onClick: () => void; "aria-label": string }) => (
    <button
      data-testid="copy-button"
      onClick={onClick}
      aria-label={ariaLabel}
      type="button"
    />
  ),
}));

vi.mock("../../../../../../components/scrollbar", () => ({
  Scrollbar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("../../../../../../utils", () => ({
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
    expect(screen.getByTestId("syntax-highlighter")).toHaveTextContent("const a = 1;");
    expect(screen.getByTestId("syntax-highlighter")).toHaveAttribute("data-language", "typescript");
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
