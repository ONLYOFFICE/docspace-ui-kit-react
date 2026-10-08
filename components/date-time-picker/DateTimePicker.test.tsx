import { describe, it, expect, afterEach, vi } from "vitest";
import { screen, render, fireEvent, within } from "@testing-library/react";
import { DateTimePicker, DateTimePickerProps } from ".";
import styles from "./DateTimePicker.module.scss";
import { createDateTime } from "../../utils/date";

describe("DateTimePicker", () => {
  const defaultProps = {
    initialDate: createDateTime(2025, 1, 27, 10, 0, 0),
    selectDateText: "Select Date",
    onChange: vi.fn(),
    className: "test-date-picker",
    id: "test-date-picker",
    locale: "en",
    hasError: false,
    openDate: createDateTime(2025, 1, 27, 10, 0, 0),
    translations: { AM: "AM", PM: "PM" },
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render with default props", () => {
    render(<DateTimePicker {...defaultProps} />);

    const picker = screen.getByTestId("date-time-picker");
    expect(picker).toBeInTheDocument();
    expect(picker).toHaveClass(styles.selectors);
    expect(picker).toHaveAttribute("aria-label", "Select Date");
    expect(picker).toHaveAttribute("aria-invalid", "false");
  });

  it("should render with error state", () => {
    render(<DateTimePicker {...defaultProps} hasError />);

    const picker = screen.getByTestId("date-time-picker");
    expect(picker).toHaveClass(styles.hasError);
    expect(picker).toHaveAttribute("aria-invalid", "true");
  });

  it("should handle date change", () => {
    const onChange = vi.fn();
    render(<DateTimePicker {...defaultProps} onChange={onChange} />);

    const datePicker = screen.getByTestId("date-picker");
    expect(datePicker).toBeInTheDocument();
  });

  it("should display and handle time picker", () => {
    render(<DateTimePicker {...defaultProps} />);

    const timeDisplay = screen.getByTestId("date-time-picker-time-display");
    expect(timeDisplay).toBeInTheDocument();
    expect(timeDisplay).toHaveAttribute("role", "button");
    // The spoken time is the shown one, on the locale's 12-hour clock.
    expect(timeDisplay).toHaveTextContent("10:00 AM");
    expect(timeDisplay).toHaveAttribute("aria-label", "Current time: 10:00 AM");

    const clockIcon = screen.getByTestId("date-time-picker-clock-icon");
    expect(clockIcon).toBeInTheDocument();
    expect(clockIcon).toHaveAttribute("aria-hidden", "true");
  });

  it("should respect min and max date constraints", () => {
    const minDate = createDateTime(2025, 1, 1);
    const maxDate = createDateTime(2025, 12, 31);

    render(
      <DateTimePicker {...defaultProps} minDate={minDate} maxDate={maxDate} />,
    );

    const datePicker = screen.getByTestId("date-picker");
    expect(datePicker).toBeInTheDocument();
  });

  it("should use provided locale", () => {
    render(<DateTimePicker {...defaultProps} locale="fr" />);

    const picker = screen.getByTestId("date-time-picker");
    expect(picker).toBeInTheDocument();
  });

  it("should show time picker on click", () => {
    render(<DateTimePicker {...defaultProps} />);

    const timeDisplay = screen.getByTestId("date-time-picker-time-display");
    fireEvent.click(timeDisplay);

    const timePicker = screen.getByTestId("time-picker");
    expect(timePicker).toBeInTheDocument();
    expect(timePicker).toHaveAttribute("aria-label", "Time picker");
  });

  it("opens the time editor with Enter and Space", () => {
    const { unmount } = render(<DateTimePicker {...defaultProps} />);
    fireEvent.keyDown(screen.getByTestId("date-time-picker-time-display"), {
      key: "Enter",
    });
    expect(screen.getByTestId("time-picker")).toBeInTheDocument();
    unmount();

    render(<DateTimePicker {...defaultProps} />);
    fireEvent.keyDown(screen.getByTestId("date-time-picker-time-display"), {
      key: " ",
    });
    expect(screen.getByTestId("time-picker")).toBeInTheDocument();
  });

  it("speaks a 24-hour time for a 24-hour locale", () => {
    render(
      <DateTimePicker
        {...defaultProps}
        locale="de"
        initialDate={createDateTime(2025, 1, 27, 14, 30, 0)}
      />,
    );
    expect(screen.getByTestId("date-time-picker-time-display")).toHaveAttribute(
      "aria-label",
      "Current time: 14:30",
    );
  });

  it("sets the half of the day instead of shifting by twelve hours", () => {
    const onChange = vi.fn();
    render(
      <DateTimePicker
        {...defaultProps}
        initialDate={createDateTime(2025, 1, 27, 22, 0, 0)}
        onChange={onChange}
      />,
    );

    const choose = (meridiem: string) => {
      const editor = screen.getByTestId("time-picker").parentElement!;
      fireEvent.click(within(editor).getByRole("button", { name: /AM|PM/ }));
      fireEvent.click(screen.getByRole("option", { name: meridiem }));
    };

    fireEvent.click(screen.getByTestId("date-time-picker-time-display"));

    // Already PM: choosing PM again leaves the time on the same day.
    choose("PM");
    expect(onChange).not.toHaveBeenCalled();

    choose("AM");
    expect(onChange).toHaveBeenCalledTimes(1);
    const am = onChange.mock.calls[0][0];
    expect(am.hour).toBe(10);
    expect(am.day).toBe(27);

    // Already AM now: choosing AM again changes nothing either.
    choose("AM");
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
