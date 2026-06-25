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
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InputSize } from "../text-input";
import type { EmailInputProps } from "./EmailInput.types";
import { EmailInput } from ".";

const defaultProps: EmailInputProps = {
  id: "emailInputId",
  name: "emailInputName",
  value: "",
  size: InputSize.base,
  scale: false,
  isDisabled: false,
  isReadOnly: false,
  maxLength: 255,
  placeholder: "Enter email",
  onChange: vi.fn(),
  onValidateInput: vi.fn(),
  handleAnimationStart: vi.fn(),
  onBlur: vi.fn(),
  dataTestId: "email-input",
};

describe("<EmailInput />", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders without error", () => {
    render(<EmailInput {...defaultProps} />);
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
  });

  it("renders with initial invalid value", () => {
    const email = "invalid-email";
    render(<EmailInput {...defaultProps} value={email} />);
    const input = screen.getByTestId("email-input");
    expect(input).toHaveValue(email);
  });

  it("handles input value changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onValidateInput = vi.fn();
    render(
      <EmailInput
        {...defaultProps}
        onChange={onChange}
        onValidateInput={onValidateInput}
      />,
    );

    const input = screen.getByTestId("email-input");
    const testEmail = "test@example.com";

    await user.type(input, testEmail);

    expect(onChange).toHaveBeenCalled();
    expect(onValidateInput).toHaveBeenCalled();
    expect(input).toHaveValue(testEmail);
  });

  it("validates correct email formats", async () => {
    const onValidateInput = vi.fn();

    render(<EmailInput {...defaultProps} onValidateInput={onValidateInput} />);

    const validEmails = [
      "simple@example.com",
      "disposable.style.email.with+symbol@example.com",
      "user.name+tag+sorting@example.com",
      "example-indeed@strange-example.com",
      "example@s.example",
    ];

    const input = screen.getByTestId("email-input");

    for (const email of validEmails) {
      onValidateInput.mockClear();

      fireEvent.change(input, { target: { value: email } });

      await waitFor(() => {
        expect(onValidateInput).toHaveBeenLastCalledWith(
          expect.objectContaining({
            isValid: true,
            errors: [],
          }),
        );
      });
    }
  });

  it("validates incorrect email formats", async () => {
    const onValidateInput = vi.fn();

    render(<EmailInput {...defaultProps} onValidateInput={onValidateInput} />);

    const invalidEmails = [
      "Abc.example.com",
      "A@b@c@example.com",
      'just"not"right@example.com',
      'this is"not\\allowed@example.com',
    ];

    const input = screen.getByTestId("email-input");

    for (const email of invalidEmails) {
      onValidateInput.mockClear();

      fireEvent.change(input, { target: { value: email } });

      await waitFor(() => {
        expect(onValidateInput).toHaveBeenLastCalledWith(
          expect.objectContaining({
            isValid: false,
            errors: expect.any(Array),
          }),
        );
      });
    }
  });

  it("handles custom validation", async () => {
    const user = userEvent.setup();
    const customValidate = (value: string) => ({
      value,
      isValid: value.includes("custom"),
      errors: [],
    });

    const onValidateInput = vi.fn();
    render(
      <EmailInput
        {...defaultProps}
        customValidate={customValidate}
        onValidateInput={onValidateInput}
      />,
    );

    const input = screen.getByTestId("email-input");

    await user.type(input, "test@other-domain.com");
    expect(onValidateInput).toHaveBeenLastCalledWith({
      value: "test@other-domain.com",
      isValid: false,
      errors: [],
    });

    await user.clear(input);
    await user.type(input, "test@custom-domain.com");
    expect(onValidateInput).toHaveBeenLastCalledWith({
      value: "test@custom-domain.com",
      isValid: true,
      errors: [],
    });
  });

  it("handles disabled state", () => {
    render(<EmailInput {...defaultProps} isDisabled />);
    expect(screen.getByTestId("email-input")).toBeDisabled();
  });

  it("handles readonly state", () => {
    render(<EmailInput {...defaultProps} isReadOnly />);
    expect(screen.getByTestId("email-input")).toHaveAttribute("readonly");
  });

  it("handles blur events", async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();
    const onValidateInput = vi.fn();
    render(
      <EmailInput
        {...defaultProps}
        onBlur={onBlur}
        onValidateInput={onValidateInput}
      />,
    );

    const input = screen.getByTestId("email-input");
    await user.click(input);
    await user.tab();

    expect(onBlur).toHaveBeenCalled();
  });

  it("respects maxLength prop", () => {
    render(<EmailInput {...defaultProps} maxLength={10} />);
    expect(screen.getByTestId("email-input")).toHaveAttribute(
      "maxLength",
      "10",
    );
  });

  it("validates empty value", () => {
    const onValidateInput = vi.fn();
    render(
      <EmailInput
        {...defaultProps}
        value=""
        onValidateInput={onValidateInput}
      />,
    );
    expect(onValidateInput).not.toHaveBeenCalled();
  });

  it("validates initial value on mount", () => {
    const onValidateInput = vi.fn();
    const email = "test@example.com";
    render(
      <EmailInput
        {...defaultProps}
        value={email}
        onValidateInput={onValidateInput}
      />,
    );
    expect(onValidateInput).not.toHaveBeenCalled();
  });

  it("handles maxLength boundary", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const maxLength = 10;
    const testString = "a".repeat(maxLength + 5);

    render(
      <EmailInput
        {...defaultProps}
        maxLength={maxLength}
        onChange={onChange}
      />,
    );

    const input = screen.getByTestId("email-input");
    await user.type(input, testString);

    // Only first maxLength characters should be entered
    expect(input).toHaveValue(testString.slice(0, maxLength));
    expect(onChange).toHaveBeenCalledTimes(maxLength);
  });
});
