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
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { InputSize } from "../text-input";
import { FileInput } from "./FileInput";
import styles from "./FileInput.module.scss";

// Mock images
vi.mock(
  "PUBLIC_DIR/images/icons/16/catalog.folder.react.svg?url",
  () => "test-file-stub",
);
vi.mock("PUBLIC_DIR/images/document.react.svg?url", () => "test-file-stub");

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock toastr
vi.mock("@docspace/ui-kit/components/toast", () => ({
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
});
