import { useState } from "react";
import type { ComponentProps } from "react";
import { describe, it, expect, vi } from "vitest";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import QuantityPicker from ".";

type HarnessProps = Partial<
  Omit<ComponentProps<typeof QuantityPicker>, "value" | "onChange">
> & {
  initialValue?: number;
  onChange?: (value: number) => void;
};

const Harness = ({
  initialValue = 10,
  minValue = 10,
  maxValue = 999,
  step = 1,
  onChange,
  ...rest
}: HarnessProps) => {
  const [value, setValue] = useState(initialValue);

  return (
    <QuantityPicker
      value={value}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      {...rest}
      onChange={(newValue) => {
        setValue(newValue);
        onChange?.(newValue);
      }}
    />
  );
};

const getInput = () => screen.getByTestId("quantity_picker_input");
const getPlus = () => screen.getByTestId("quantity_picker_plus_icon");
const getMinus = () => screen.getByTestId("quantity_picker_minus_icon");

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
      <Harness
        initialValue={10}
        minValue={10}
        enableZero
        onChange={onChange}
      />,
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

  describe("upper bound", () => {
    it("does not step past maxValue with plus", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <Harness
          initialValue={100}
          minValue={1}
          maxValue={100}
          onChange={onChange}
        />,
      );

      await user.click(getPlus());

      expect(getInput()).toHaveValue("100");
      expect(onChange).not.toHaveBeenCalled();
    });

    it("shortens the last step so plus stops at maxValue", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <Harness
          initialValue={98}
          minValue={1}
          maxValue={100}
          step={5}
          onChange={onChange}
        />,
      );

      await user.click(getPlus());

      expect(onChange).toHaveBeenLastCalledWith(100);
    });

    it("steps once into the overflow state with showPlusSign, and no further", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <Harness
          initialValue={100}
          minValue={1}
          maxValue={100}
          step={10}
          showPlusSign
          onChange={onChange}
        />,
      );

      await user.click(getPlus());
      expect(onChange).toHaveBeenLastCalledWith(101);
      expect(getInput()).toHaveValue("100+");

      await user.click(getPlus());
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("caps a preset tab at maxValue", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <Harness
          initialValue={95}
          minValue={1}
          maxValue={100}
          items={[10]}
          onChange={onChange}
        />,
      );

      await user.click(screen.getByTestId("add_10_tab_item"));

      expect(onChange).toHaveBeenLastCalledWith(100);
    });

    it("caps a preset tab at the overflow state with showPlusSign", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <Harness
          initialValue={95}
          minValue={1}
          maxValue={100}
          items={[50]}
          showPlusSign
          onChange={onChange}
        />,
      );

      await user.click(screen.getByTestId("add_50_tab_item"));

      expect(onChange).toHaveBeenLastCalledWith(101);
      expect(getInput()).toHaveValue("100+");
    });

    it("bounds the slider at maxValue without showPlusSign", () => {
      render(
        <Harness initialValue={5} minValue={1} maxValue={100} showSlider />,
      );

      expect(screen.getByRole("slider")).toHaveAttribute("max", "100");
    });

    it("bounds the slider at the overflow state with showPlusSign", () => {
      render(
        <Harness
          initialValue={5}
          minValue={1}
          maxValue={100}
          showSlider
          showPlusSign
        />,
      );

      expect(screen.getByRole("slider")).toHaveAttribute("max", "101");
    });
  });

  describe("controls", () => {
    it("renders the controls as buttons with the given accessible names", () => {
      render(<Harness decreaseLabel="Decrease" increaseLabel="Increase" />);

      expect(screen.getByRole("button", { name: "Decrease" })).toBe(getMinus());
      expect(screen.getByRole("button", { name: "Increase" })).toBe(getPlus());
      expect(getPlus()).toHaveAttribute("type", "button");
    });

    it("renders no aria-label when no label is given", () => {
      render(<Harness />);

      expect(getPlus()).not.toHaveAttribute("aria-label");
      expect(getMinus()).not.toHaveAttribute("aria-label");
    });

    it("is operable from the keyboard", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Harness initialValue={10} minValue={1} onChange={onChange} />);

      await user.tab();
      expect(getMinus()).toHaveFocus();
      await user.keyboard("{Enter}");
      expect(onChange).toHaveBeenLastCalledWith(9);

      await user.tab();
      expect(getInput()).toHaveFocus();

      await user.tab();
      expect(getPlus()).toHaveFocus();
      await user.keyboard(" ");
      expect(onChange).toHaveBeenLastCalledWith(10);
    });

    it("disables both controls and the preset tabs with isDisabled", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Harness isDisabled items={[10]} onChange={onChange} />);

      expect(getMinus()).toBeDisabled();
      expect(getPlus()).toBeDisabled();

      await user.click(getPlus());
      await user.click(screen.getByTestId("add_10_tab_item"));

      expect(onChange).not.toHaveBeenCalled();
    });

    it("keeps a minusDisabled control focusable but inert", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Harness initialValue={20} minusDisabled onChange={onChange} />);

      const minus = getMinus();
      expect(minus).not.toBeDisabled();
      expect(minus).toHaveAttribute("aria-disabled", "true");

      await user.click(minus);
      minus.focus();
      await user.keyboard("{Enter}");

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("disabled styling", () => {
    it("marks the subtitle disabled", () => {
      render(<Harness subtitle="Included" isDisabled />);

      expect(screen.getByText("Included").className).toMatch(/disabled/);
    });

    it("sizes the field to its content only while disableValue is shown", () => {
      const { rerender } = render(
        <QuantityPicker
          value={5}
          minValue={1}
          maxValue={100}
          step={1}
          disableValue="Unlimited"
          onChange={() => {}}
        />,
      );

      expect(getInput().className).not.toMatch(/isConstant/);

      rerender(
        <QuantityPicker
          value={5}
          minValue={1}
          maxValue={100}
          step={1}
          disableValue="Unlimited"
          isDisabled
          onChange={() => {}}
        />,
      );

      expect(screen.getByText("Unlimited").className).toMatch(/isConstant/);
    });
  });

  it("treats the deprecated isZeroAllowed as enableZero", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Harness
        initialValue={10}
        minValue={10}
        isZeroAllowed
        onChange={onChange}
      />,
    );

    await user.click(getMinus());

    expect(onChange).toHaveBeenLastCalledWith(0);
  });
});
