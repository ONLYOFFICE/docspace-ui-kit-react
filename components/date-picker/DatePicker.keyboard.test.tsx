import { describe, it, expect, vi } from "vitest";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DatePicker } from "./index";
import { now } from "../../utils/date";

// DatePicker.test.tsx mocks AddButton; the real one is a tab stop of its own,
// so the keyboard path is tested here with it in place.
describe("DatePicker keyboard, with the real AddButton", () => {
  const props = {
    locale: "en",
    selectDateText: "Select date",
    openDate: now(),
    onChange: vi.fn(),
  };

  it("is one tab stop while no date is picked", async () => {
    const user = userEvent.setup();
    render(
      <>
        <DatePicker {...props} />
        <button type="button">After</button>
      </>,
    );

    await user.tab();
    expect(screen.getByTestId("date-selector")).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
  });

  it("opens the calendar on Enter on the selector", async () => {
    const user = userEvent.setup();
    render(<DatePicker {...props} />);

    await user.tab();
    await user.keyboard("{Enter}");

    expect(screen.getByTestId("date-selector")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });
});
