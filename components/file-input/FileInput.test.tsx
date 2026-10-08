import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import { InputSize } from "../text-input";
import { FileInput } from "./FileInput";
import styles from "./FileInput.module.scss";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock toastr
vi.mock("@onlyoffice/apps-ui-kit/components/toast", () => ({
  toastr: {
    error: vi.fn(),
  },
}));

describe("<FileInput />", () => {
  const mockOnInput = vi.fn();
  const defaultProps = {
    size: InputSize.base,
    onInput: mockOnInput,
  };

  beforeEach(() => {
    mockOnInput.mockClear();
    vi.clearAllMocks();
  });

  it("renders without error", () => {
    render(<FileInput {...defaultProps} />);
    expect(screen.getByTestId("file-input")).toBeInTheDocument();
    expect(screen.getByTestId("icon-button")).toBeInTheDocument();
  });

  it("handles file input correctly", async () => {
    render(<FileInput {...defaultProps} />);
    const fileInput = screen.getByRole("button");
    const file = new File(["test"], "test.txt", { type: "text/plain" });

    await act(async () => {
      fireEvent.drop(fileInput, {
        dataTransfer: {
          files: [file],
          types: ["Files"],
        },
      });
    });
  });

  it("applies correct size class", () => {
    render(<FileInput {...defaultProps} size={InputSize.base} />);
    const input = screen.getByTestId("text-input");
    expect(input).toHaveAttribute("data-size", "base");
  });

  it("handles disabled state correctly", () => {
    render(<FileInput {...defaultProps} isDisabled />);
    const fileInput = screen.getByTestId("file-input");

    // Check for disabled class
    expect(fileInput).toHaveClass(styles.disabled);

    // Check that the TextInput is disabled
    const textInput = screen.getByRole("textbox");
    expect(textInput).toBeDisabled();

    // Verify dropzone is disabled via noClick prop
    expect(fileInput).toHaveAttribute("aria-disabled", "true");
  });

  it("handles loading state correctly", () => {
    render(<FileInput {...defaultProps} isLoading />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
    expect(screen.queryByTestId("icon-button")).not.toBeInTheDocument();
  });

  it("handles error state correctly", () => {
    render(<FileInput {...defaultProps} hasError />);
    const input = screen.getByTestId("text-input");
    expect(input).toHaveAttribute("data-error", "true");
  });

  it("handles warning state correctly", () => {
    render(<FileInput {...defaultProps} hasWarning />);
    const input = screen.getByTestId("text-input");
    expect(input).toHaveAttribute("data-warning", "true");
  });

  const drop = async (target: HTMLElement, files: File[]) => {
    await act(async () => {
      fireEvent.drop(target, {
        dataTransfer: { files, types: ["Files"] },
      });
    });
  };

  const pdf = () =>
    new File(["%PDF"], "report.pdf", { type: "application/pdf" });

  it("accepts any file when accept is left out", async () => {
    render(<FileInput {...defaultProps} />);
    await drop(screen.getByTestId("file-input"), [pdf()]);

    await waitFor(() => expect(mockOnInput).toHaveBeenCalledTimes(1));
    expect(screen.getByRole("textbox")).toHaveValue("report.pdf");
  });

  it('reads accept={[""]} as any file too', async () => {
    render(<FileInput {...defaultProps} accept={[""]} />);
    await drop(screen.getByTestId("file-input"), [pdf()]);

    await waitFor(() => expect(mockOnInput).toHaveBeenCalledTimes(1));
  });

  it("calls onReject with the files accept turned away", async () => {
    const onReject = vi.fn();
    render(
      <FileInput {...defaultProps} accept={["image/*"]} onReject={onReject} />,
    );
    const file = pdf();
    await drop(screen.getByTestId("file-input"), [file]);

    await waitFor(() => expect(onReject).toHaveBeenCalledWith([file]));
    expect(mockOnInput).not.toHaveBeenCalled();
  });

  it.each([
    ["isDisabled", { isDisabled: true }],
    ["isLoading", { isLoading: true }],
  ])("is inert under %s: no tab stop, no drop", async (_, props) => {
    render(<FileInput {...defaultProps} {...props} />);
    const root = screen.getByTestId("file-input");

    expect(root).not.toHaveAttribute("tabindex");
    expect(root).toHaveAttribute("aria-disabled", "true");
    await drop(root, [pdf()]);
    expect(mockOnInput).not.toHaveBeenCalled();
  });

  it("keeps the wrapper as the only focus stop", () => {
    render(<FileInput {...defaultProps} buttonLabel="Browse" />);

    expect(screen.getByTestId("file-input")).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("textbox")).toHaveAttribute("tabindex", "-1");
    expect(screen.getByText("Browse").closest("button")).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });
});
