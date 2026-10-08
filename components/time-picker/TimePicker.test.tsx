import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { TimePicker, type TimePickerProps } from ".";

describe("<TimePicker />", () => {
  const mockOnChange = vi.fn();
  const mockOnBlur = vi.fn();

  const baseProps = {
    initialTime: "2025-01-09T14:30:00",
    onChange: mockOnChange,
    onBlur: mockOnBlur,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without error", () => {
    const { container } = render(<TimePicker {...baseProps} />);
    expect(container).toBeTruthy();
  });

  it("renders with correct initial time", () => {
    render(<TimePicker {...baseProps} />);
    const hoursInput = screen.getByLabelText("Hours") as HTMLInputElement;
    const minutesInput = screen.getByLabelText("Minutes") as HTMLInputElement;

    expect(hoursInput.value).toBe("14");
    expect(minutesInput.value).toBe("30");
  });

  it("handles hours input correctly", () => {
    render(<TimePicker {...baseProps} />);
    const hoursInput = screen.getByLabelText("Hours") as HTMLInputElement;

    fireEvent.change(hoursInput, { target: { value: "15" } });
    expect(hoursInput.value).toBe("15");
    expect(mockOnChange).toHaveBeenCalled();
  });

  it("handles minutes input correctly", () => {
    render(<TimePicker {...baseProps} />);
    const minutesInput = screen.getByLabelText("Minutes") as HTMLInputElement;

    fireEvent.change(minutesInput, { target: { value: "45" } });
    expect(minutesInput.value).toBe("45");
    expect(mockOnChange).toHaveBeenCalled();
  });

  it("validates hours input range", () => {
    render(<TimePicker {...baseProps} />);
    const hoursInput = screen.getByLabelText("Hours") as HTMLInputElement;

    fireEvent.change(hoursInput, { target: { value: "24" } });
    expect(hoursInput.value).toBe("02");
  });

  it("handles blur events", () => {
    render(<TimePicker {...baseProps} />);
    const minutesInput = screen.getByLabelText("Minutes");
    fireEvent.focus(minutesInput);
    fireEvent.change(minutesInput, { target: { value: "59" } });
    fireEvent.blur(minutesInput);

    expect(mockOnBlur).toHaveBeenCalled();
  });

  it("has correct accessibility attributes", () => {
    render(<TimePicker {...baseProps} />);
    const timePicker = screen.getByRole("group");
    expect(timePicker).toHaveAttribute("aria-label", "Time picker");
    const hoursInput = screen.getByLabelText("Hours");
    expect(hoursInput).toHaveAttribute("data-test-id", "hours-input");
    const minutesInput = screen.getByLabelText("Minutes");
    expect(minutesInput).toHaveAttribute("data-test-id", "minutes-input");
  });

  it("renders plain text fields, not search fields", () => {
    render(<TimePicker {...baseProps} />);
    expect(screen.getByLabelText("Hours")).toHaveAttribute("type", "text");
    expect(screen.getByLabelText("Minutes")).toHaveAttribute("type", "text");
    expect(screen.queryAllByRole("searchbox")).toHaveLength(0);
  });

  it("takes translated names for the group and both fields", () => {
    render(
      <TimePicker
        {...baseProps}
        ariaLabel="Uhrzeit"
        hoursLabel="Stunden"
        minutesLabel="Minuten"
      />,
    );
    expect(screen.getByRole("group", { name: "Uhrzeit" })).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Stunden" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Minuten" }),
    ).toBeInTheDocument();
  });

  it("marks both fields invalid under hasError", () => {
    const { rerender } = render(<TimePicker {...baseProps} />);
    expect(screen.getByLabelText("Hours")).not.toHaveAttribute("aria-invalid");

    rerender(<TimePicker {...baseProps} hasError />);
    expect(screen.getByLabelText("Hours")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByLabelText("Minutes")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("keeps the focus where it is with autoAdvance off", () => {
    render(<TimePicker {...baseProps} autoAdvance={false} />);
    const hoursInput = screen.getByLabelText("Hours") as HTMLInputElement;
    const minutesInput = screen.getByLabelText("Minutes") as HTMLInputElement;

    hoursInput.focus();
    fireEvent.change(hoursInput, { target: { value: "09" } });
    expect(hoursInput).toHaveFocus();
    expect(mockOnChange).toHaveBeenCalled();

    minutesInput.focus();
    fireEvent.change(minutesInput, { target: { value: "45" } });
    expect(minutesInput).toHaveFocus();
    expect(minutesInput.value).toBe("45");
    expect(mockOnBlur).not.toHaveBeenCalled();
  });

  it("automatically formats and blurs when entering a single digit > 5 in minutes", () => {
    render(<TimePicker {...baseProps} />);
    const minutesInput = screen.getByLabelText("Minutes") as HTMLInputElement;

    fireEvent.change(minutesInput, { target: { value: "6" } });

    expect(minutesInput.value).toBe("06");
    expect(mockOnBlur).toHaveBeenCalled();
  });

  it("prevents context menu on inputs", () => {
    render(<TimePicker {...baseProps} />);
    const hoursInput = screen.getByLabelText("Hours");
    const minutesInput = screen.getByLabelText("Minutes");

    const hoursEvent = new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
    });
    const minutesEvent = new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
    });

    fireEvent(hoursInput, hoursEvent);
    fireEvent(minutesInput, minutesEvent);

    expect(hoursEvent.defaultPrevented).toBe(true);
    expect(minutesEvent.defaultPrevented).toBe(true);
  });

  it("formats hours/minutes with leading zero on blur if single digit entered", () => {
    render(<TimePicker {...baseProps} initialTime="2025-01-09T14:30:00" />);
    const hoursInput = screen.getByLabelText("Hours") as HTMLInputElement;
    const minutesInput = screen.getByLabelText("Minutes") as HTMLInputElement;

    fireEvent.change(hoursInput, { target: { value: "5" } });
    fireEvent.blur(hoursInput);
    expect(hoursInput.value).toBe("05");

    fireEvent.change(minutesInput, { target: { value: "3" } });
    fireEvent.blur(minutesInput);
    expect(minutesInput.value).toBe("03");
  });

  it("handles empty input in hours and minutes", () => {
    render(<TimePicker {...baseProps} />);
    const hoursInput = screen.getByLabelText("Hours") as HTMLInputElement;
    const minutesInput = screen.getByLabelText("Minutes") as HTMLInputElement;

    fireEvent.change(hoursInput, { target: { value: "" } });
    expect(hoursInput.value).toBe("00");

    fireEvent.change(minutesInput, { target: { value: "" } });
    expect(minutesInput.value).toBe("00");
  });

  it("blurs minutes input if length exceeds 2", () => {
    const focusSpy = vi.spyOn(HTMLInputElement.prototype, "blur");
    render(<TimePicker {...baseProps} />);
    const minutesInput = screen.getByLabelText("Minutes") as HTMLInputElement;

    fireEvent.change(minutesInput, { target: { value: "123" } });

    expect(focusSpy).toHaveBeenCalled();
    expect(mockOnBlur).toHaveBeenCalled();
    focusSpy.mockRestore();
  });

  it("calls onBlur if minutes value exceeds 59", () => {
    render(<TimePicker {...baseProps} />);
    const minutesInput = screen.getByLabelText("Minutes") as HTMLInputElement;

    fireEvent.change(minutesInput, { target: { value: "60" } });

    expect(mockOnBlur).toHaveBeenCalled();
  });

  it("renders correctly with default props", () => {
    const { container } = render(<TimePicker />);
    expect(container).toBeTruthy();

    const hoursInput = screen.getByLabelText("Hours") as HTMLInputElement;
    fireEvent.change(hoursInput, { target: { value: "10" } });
    // Should not throw even if onChange is not provided
  });

  it("selects hours input when clicking on the container but not on minutes", () => {
    render(<TimePicker {...baseProps} />);
    const container = screen.getByTestId("time-picker");
    const hoursInput = screen.getByLabelText("Hours") as HTMLInputElement;
    const selectSpy = vi.spyOn(hoursInput, "select");

    // Click on container (target is the div itself)
    fireEvent.click(container);

    expect(selectSpy).toHaveBeenCalled();
    selectSpy.mockRestore();
  });

  it("focuses minutes input if hours input length exceeds 2", () => {
    render(<TimePicker {...baseProps} />);
    const hoursInput = screen.getByLabelText("Hours") as HTMLInputElement;
    const minutesInput = screen.getByLabelText("Minutes") as HTMLInputElement;
    const selectSpy = vi.spyOn(minutesInput, "select");

    fireEvent.change(hoursInput, { target: { value: "123" } });

    expect(selectSpy).toHaveBeenCalled();
    selectSpy.mockRestore();
  });

  it("folds the meridiem into the value reported in the 12-hour mode", () => {
    render(
      <TimePicker
        initialTime="2025-01-09T14:30:00"
        isTwelveHourFormat
        meridiem="PM"
        onChange={mockOnChange}
      />,
    );
    const hoursInput = screen.getByLabelText("Hours") as HTMLInputElement;
    expect(hoursInput.value).toBe("02");

    fireEvent.change(hoursInput, { target: { value: "03" } });

    expect(mockOnChange).toHaveBeenCalled();
    expect(mockOnChange.mock.lastCall?.[0].toFormat("HH:mm")).toBe("15:30");
  });

  it("requires meridiem with isTwelveHourFormat (checked by tsc)", () => {
    // @ts-expect-error meridiem is required in the 12-hour mode
    const props: TimePickerProps = { isTwelveHourFormat: true };
    expect(props.isTwelveHourFormat).toBe(true);
  });

  it("caps hours at 12 in the 12-hour mode", () => {
    render(<TimePicker {...baseProps} isTwelveHourFormat meridiem="AM" />);
    const hoursInput = screen.getByLabelText("Hours") as HTMLInputElement;

    fireEvent.change(hoursInput, { target: { value: "13" } });

    expect(hoursInput.value).toBe("01");
  });

  // Both fields used to inherit TextInput's -1 and Tab left the picker; the
  // fields are in the natural tab order now, and tabIndex only moves them.
  it("passes tabIndex to both fields and leaves them in the Tab order without it", () => {
    const { rerender } = render(<TimePicker {...baseProps} tabIndex={0} />);
    expect(screen.getByLabelText("Hours")).toHaveAttribute("tabindex", "0");
    expect(screen.getByLabelText("Minutes")).toHaveAttribute("tabindex", "0");

    rerender(<TimePicker {...baseProps} />);
    expect(screen.getByLabelText("Hours")).not.toHaveAttribute("tabindex");
    expect(screen.getByLabelText("Minutes")).not.toHaveAttribute("tabindex");
  });

  it("prefixes the field class names with classNameInput and adds none without it", () => {
    const { rerender } = render(
      <TimePicker {...baseProps} classNameInput="picker" />,
    );
    expect(screen.getByLabelText("Hours")).toHaveClass("picker-hours-input");
    expect(screen.getByLabelText("Minutes")).toHaveClass(
      "picker-minutes-input",
    );

    rerender(<TimePicker {...baseProps} />);
    expect(screen.getByLabelText("Hours").className).not.toMatch(/undefined/);
    expect(screen.getByLabelText("Minutes").className).not.toMatch(/undefined/);
  });
});
