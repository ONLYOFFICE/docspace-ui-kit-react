import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { DateTime } from "luxon";

import { Calendar } from "./Calendar";

describe("Calendar from the keyboard", () => {
  it("opens the month and year views from the title, keeping the focus", () => {
    const { container } = render(
      <Calendar
        locale="en"
        selectedDate={DateTime.now()}
        setSelectedDate={vi.fn()}
      />,
    );

    const daysTitle = container.querySelector(".days-header") as HTMLElement;
    expect(daysTitle).toHaveAttribute("role", "button");
    expect(daysTitle).toHaveAttribute("tabindex", "0");

    daysTitle.focus();
    fireEvent.keyDown(daysTitle, { key: "Enter" });

    const monthsTitle = container.querySelector(".months-header");
    expect(monthsTitle).toHaveAttribute("role", "button");
    expect(document.activeElement).toBe(monthsTitle);

    fireEvent.keyDown(monthsTitle as HTMLElement, { key: " " });

    expect(document.activeElement).toBe(
      container.querySelector(".years-header"),
    );
  });
});
