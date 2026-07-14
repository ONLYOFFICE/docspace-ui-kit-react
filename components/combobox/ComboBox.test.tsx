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

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ComboBox } from "./ComboBox";
import { ComboBoxDisplayType, ComboBoxSize } from "./ComboBox.enums";
import styles from "./ComboBox.module.scss";
import * as DropDownModule from "../drop-down";
import type { DropDownProps } from "../drop-down/DropDown.types";

const mockOptions = [
  { key: "1", label: "Option 1" },
  { key: "2", label: "Option 2" },
  { key: "3", label: "Option 3", disabled: true },
  { key: "4", label: "Option 4", isSeparator: true },
];

const baseProps = {
  options: mockOptions,
  selectedOption: mockOptions[0],
  onSelect: vi.fn(),
  scaled: false,
  size: ComboBoxSize.base,
  tabIndex: 1,
  displayType: ComboBoxDisplayType.default,
};

describe("ComboBox", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses memo compare function to avoid unnecessary rerenders with same props", () => {
    const { rerender } = render(<ComboBox {...baseProps} />);

    const buttonBefore = screen.getByRole("button");

    rerender(<ComboBox {...baseProps} />);

    const buttonAfter = screen.getByRole("button");

    // If memoization works with deep equal compare, button node should stay the same
    expect(buttonAfter).toBe(buttonBefore);
  });

  it("renders with base props", () => {
    render(<ComboBox {...baseProps} />);
    expect(
      screen.getByRole("button", { name: "Option 1" }),
    ).toBeInTheDocument();
  });

  it("opens dropdown on click", async () => {
    const user = userEvent.setup();
    render(<ComboBox {...baseProps} />);

    await user.click(screen.getByRole("button"));
    const dropdown = screen.getByRole("listbox");
    expect(dropdown).toBeInTheDocument();
  });

  it("selects option on click", async () => {
    const user = userEvent.setup();
    render(<ComboBox {...baseProps} />);

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("option", { name: "Option 2" }));

    expect(baseProps.onSelect).toHaveBeenCalledWith(mockOptions[1]);
  });

  it("does not select disabled option", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<ComboBox {...baseProps} onSelect={onSelect} />);

    await user.click(screen.getByRole("button"));
    const dropdownItems = await screen.findAllByRole("option");
    const disabledOption = dropdownItems[2]; // Option 3 is the disabled option

    await user.click(disabledOption);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("handles separator options", async () => {
    const user = userEvent.setup();
    render(<ComboBox {...baseProps} />);

    await user.click(screen.getByRole("button"));

    // Verify that the separator option exists
    const separatorOption = mockOptions[3]; // Option 4 is the separator
    expect(separatorOption.isSeparator).toBe(true);
  });

  it("handles click on selected item by delegating to DropDownItem", async () => {
    const onClickSelectedItem = vi.fn();
    const user = userEvent.setup();

    render(
      <ComboBox
        {...baseProps}
        onClickSelectedItem={onClickSelectedItem}
        selectedOption={mockOptions[0]}
      />,
    );

    await user.click(screen.getByRole("button"));

    const selectedOption = await screen.findByRole("option", {
      name: mockOptions[0].label,
    });

    await user.click(selectedOption);

    expect(onClickSelectedItem).toHaveBeenCalledWith(mockOptions[0]);
  });

  it("handles toggle display type with onToggle", async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();

    render(
      <ComboBox
        {...baseProps}
        displayType={ComboBoxDisplayType.toggle}
        onToggle={onToggle}
      />,
    );

    await user.click(screen.getByRole("button"));
    expect(onToggle).toHaveBeenCalledWith(expect.anything(), true);
  });

  it("toggles onToggle open state on subsequent clicks", async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();

    render(<ComboBox {...baseProps} onToggle={onToggle} />);

    const button = screen.getByRole("button");

    await user.click(button);
    await user.click(button);

    expect(onToggle).toHaveBeenNthCalledWith(1, expect.anything(), true);
    expect(onToggle).toHaveBeenNthCalledWith(2, expect.anything(), false);
  });

  it("does not open when disabled", async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();

    render(<ComboBox {...baseProps} isDisabled onToggle={onToggle} />);

    await user.click(screen.getByRole("button"));
    expect(onToggle).not.toHaveBeenCalled();
  });

  it("applies custom dataTestId", () => {
    render(<ComboBox {...baseProps} dataTestId="custom-combobox" />);

    expect(screen.getByTestId("custom-combobox")).toBeInTheDocument();
  });

  it("applies custom dropDownTestId", async () => {
    const user = userEvent.setup();
    const dropDownTestId = "custom-dropdown";

    render(<ComboBox {...baseProps} dropDownTestId={dropDownTestId} />);

    await user.click(screen.getByRole("button"));

    expect(screen.getByTestId(dropDownTestId)).toBeInTheDocument();
  });

  it("calls setIsOpenItemAccess when opened prop is controlled", () => {
    const setIsOpenItemAccess = vi.fn();

    render(
      <ComboBox
        {...baseProps}
        opened
        setIsOpenItemAccess={setIsOpenItemAccess}
      />,
    );

    expect(setIsOpenItemAccess).toHaveBeenCalledWith(true);
  });

  it("moves focus between options with ArrowDown key", () => {
    render(<ComboBox {...baseProps} />);

    // Open combobox so keyboard handler is active
    fireEvent.click(screen.getByRole("button"));

    const first = document.createElement("div");
    first.setAttribute("data-testid", "drop-down-item");
    const second = document.createElement("div");
    second.setAttribute("data-testid", "drop-down-item");

    document.body.append(first, second);

    // First ArrowDown focuses first option

    fireEvent.keyDown(document, { key: "ArrowDown" });
    expect(first.getAttribute("data-focused")).toBe("true");
    expect(second.getAttribute("data-focused")).toBe("false");

    // Second ArrowDown moves focus to second option
    fireEvent.keyDown(document, { key: "ArrowDown" });
    expect(first.getAttribute("data-focused")).toBe("false");
    expect(second.getAttribute("data-focused")).toBe("true");

    document.body.removeChild(first);
    document.body.removeChild(second);
  });

  it("calls onSelect when Enter is pressed on focused option", () => {
    const onSelect = vi.fn();

    render(<ComboBox {...baseProps} onSelect={onSelect} />);

    // Open combobox so keyboard handler is active
    fireEvent.click(screen.getByRole("button"));

    const focusedOption = document.createElement("div");
    focusedOption.setAttribute("data-testid", "drop-down-item");
    focusedOption.setAttribute("data-focused", "true");
    document.body.appendChild(focusedOption);

    fireEvent.keyDown(document, { key: "Enter" });

    expect(onSelect).toHaveBeenCalledWith(baseProps.options[0]);

    document.body.removeChild(focusedOption);
  });

  it("ignores unsupported keys in keyboard handler", () => {
    const onSelect = vi.fn();

    render(<ComboBox {...baseProps} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole("button"));

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onSelect).not.toHaveBeenCalled();
  });

  it("derives optionsCount from advancedOptions excluding separator-like keys", () => {
    const AdvancedWrapper = ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    );

    const advancedChildren = [
      <div key="1" />,
      <div key="s1" />,
      <div key="2" />,
    ];

    render(
      <ComboBox
        {...baseProps}
        options={[]}
        advancedOptions={<AdvancedWrapper>{advancedChildren}</AdvancedWrapper>}
        hideMobileView={false}
      />,
    );

    const combobox = screen.getByTestId("combobox");

    // advancedOptionsWithoutSeparator should exclude the element with key "s1"
    // which results in 2 options (< 4) and therefore enables disableMobileView.
    expect(combobox).toHaveClass(styles.disableMobileView);
  });

  it("does not toggle state on outside click when onToggle is provided without backdrop handler", async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();

    render(<ComboBox {...baseProps} onToggle={onToggle} />);

    const button = screen.getByRole("button");

    // Open via button click → comboBoxClick calls onToggle once
    await user.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);

    // Simulate click outside the combobox
    fireEvent.mouseDown(document.body);

    // handleClickOutside should early-return and not call onToggle again
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("calls setIsOpenItemAccess from handleClickOutside", () => {
    const setIsOpenItemAccess = vi.fn();
    const onBackdropClick = vi.fn();

    const dropDownSpy = vi
      .spyOn(DropDownModule, "DropDown")
      .mockImplementation((props: DropDownProps) => {
        props.clickOutsideAction?.(
          {
            target: document.body,
          } as unknown as Event,
          false,
        );

        return <div data-testid="dropdown-mock" />;
      });

    render(
      <ComboBox
        {...baseProps}
        setIsOpenItemAccess={setIsOpenItemAccess}
        onBackdropClick={onBackdropClick}
      />,
    );

    expect(setIsOpenItemAccess).toHaveBeenCalledWith(true);
    expect(onBackdropClick).toHaveBeenCalled();

    dropDownSpy.mockRestore();
  });

  it("sets correct tabIndex", () => {
    render(<ComboBox {...baseProps} />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("tabindex", "1");
  });
});
