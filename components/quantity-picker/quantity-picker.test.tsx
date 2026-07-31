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

import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import QuantityPicker from ".";

type HarnessProps = {
  initialValue?: number;
  minValue?: number;
  maxValue?: number;
  enableZero?: boolean;
  showPlusSign?: boolean;
  onChange?: (value: number) => void;
};

const Harness = ({
  initialValue = 10,
  minValue = 10,
  maxValue = 999,
  enableZero,
  showPlusSign,
  onChange,
}: HarnessProps) => {
  const [value, setValue] = useState(initialValue);

  return (
    <QuantityPicker
      value={value}
      minValue={minValue}
      maxValue={maxValue}
      step={1}
      enableZero={enableZero}
      showPlusSign={showPlusSign}
      onChange={(newValue) => {
        setValue(newValue);
        onChange?.(newValue);
      }}
    />
  );
};

const getInput = () => screen.getByTestId("quantity_picker_input");

describe("<QuantityPicker />", () => {
  it("renders the current value", () => {
    render(<Harness initialValue={10} />);

    expect(getInput()).toHaveValue("10");
  });

  it("lets the field be emptied without snapping back to the minimum", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness initialValue={10} minValue={10} onChange={onChange} />);

    const input = getInput();
    await user.click(input);
    await user.keyboard("{End}{Backspace}{Backspace}");

    expect(input).toHaveValue("");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("replaces the value instead of appending to it after the field is cleared", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness initialValue={10} minValue={10} onChange={onChange} />);

    const input = getInput();
    await user.click(input);
    await user.keyboard("{End}{Backspace}{Backspace}50");

    expect(input).toHaveValue("50");
    expect(onChange).toHaveBeenLastCalledWith(50);
  });

  it("keeps intermediate values below the minimum in the field while typing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness initialValue={50} minValue={10} onChange={onChange} />);

    const input = getInput();
    await user.clear(input);
    await user.keyboard("5");

    expect(input).toHaveValue("5");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("clamps to the minimum on blur when the field is left empty", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness initialValue={50} minValue={10} onChange={onChange} />);

    const input = getInput();
    await user.clear(input);
    await user.tab();

    expect(input).toHaveValue("10");
    expect(onChange).toHaveBeenLastCalledWith(10);
  });

  it("clamps to the minimum on blur when the typed value is below it", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness initialValue={50} minValue={10} onChange={onChange} />);

    const input = getInput();
    await user.clear(input);
    await user.keyboard("3");
    await user.tab();

    expect(input).toHaveValue("10");
    expect(onChange).toHaveBeenLastCalledWith(10);
  });

  it("clamps to the minimum on Enter", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness initialValue={50} minValue={10} onChange={onChange} />);

    const input = getInput();
    await user.clear(input);
    await user.keyboard("2{Enter}");

    expect(input).toHaveValue("10");
    expect(onChange).toHaveBeenLastCalledWith(10);
  });

  it("ignores non-digit characters", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness initialValue={10} minValue={10} onChange={onChange} />);

    const input = getInput();
    await user.clear(input);
    await user.keyboard("1e5-,.");

    expect(input).toHaveValue("15");
    expect(onChange).toHaveBeenLastCalledWith(15);
  });

  it("caps typed values above the maximum and shows them with a plus sign", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Harness
        initialValue={10}
        minValue={10}
        maxValue={999}
        showPlusSign
        onChange={onChange}
      />,
    );

    const input = getInput();
    await user.clear(input);
    await user.keyboard("9999");

    expect(input).toHaveValue("999+");
    expect(onChange).toHaveBeenLastCalledWith(1000);
  });

  it("does not let the value grow past the cap on further typing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Harness
        initialValue={10}
        minValue={10}
        maxValue={999}
        showPlusSign
        onChange={onChange}
      />,
    );

    const input = getInput();
    await user.clear(input);
    await user.keyboard("9999999999");
    await user.tab();

    expect(input).toHaveValue("999+");
    expect(onChange).toHaveBeenLastCalledWith(1000);
  });

  it("lets the capped value be edited back down with the keyboard", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Harness
        initialValue={10}
        minValue={10}
        maxValue={999}
        showPlusSign
        onChange={onChange}
      />,
    );

    const input = getInput();
    await user.clear(input);
    await user.keyboard("9999");
    await user.click(input);
    await user.keyboard("{End}{Backspace}{Backspace}");

    expect(input).toHaveValue("99");
    expect(onChange).toHaveBeenLastCalledWith(99);
  });

  it("clamps to the maximum when the plus sign is not used", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Harness
        initialValue={10}
        minValue={10}
        maxValue={999}
        onChange={onChange}
      />,
    );

    const input = getInput();
    await user.clear(input);
    await user.keyboard("9999");

    expect(input).toHaveValue("999");
    expect(onChange).toHaveBeenLastCalledWith(999);
  });

  it("allows zero on blur when enableZero is set", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Harness initialValue={10} minValue={10} enableZero onChange={onChange} />,
    );

    const input = getInput();
    await user.clear(input);
    await user.tab();

    expect(input).toHaveValue("0");
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it("still increments and decrements with the control buttons", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness initialValue={10} minValue={10} onChange={onChange} />);

    await user.click(screen.getByTestId("quantity_picker_plus_icon"));
    expect(getInput()).toHaveValue("11");

    await user.click(screen.getByTestId("quantity_picker_minus_icon"));
    expect(getInput()).toHaveValue("10");
  });

  it("drops an uncommitted draft when a control button is used", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness initialValue={10} minValue={10} onChange={onChange} />);

    const input = getInput();
    await user.click(input);
    await user.keyboard("{End}{Backspace}{Backspace}");
    await user.click(screen.getByTestId("quantity_picker_plus_icon"));

    expect(input).toHaveValue("11");
  });
});
