import React from "react";
import type { ComponentProps } from "react";
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import type { DateTime } from "luxon";
import { expect, fn, within } from "storybook/test";

import {
  addToDate,
  createDateTime,
  now,
  parseToDateTime,
  startOf,
} from "../../utils/date";

import { DatePicker } from ".";

const meta = {
  title: "UI/Form controls/DatePicker",
  component: DatePicker,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    locale: {
      control: "text",
      description:
        "BCP 47 tag the calendar and the chip's date are written in.",
    },
    selectDateText: {
      control: "text",
      description: "Text of the button shown while no date is chosen.",
      table: {
        defaultValue: { summary: '"Select date"' },
      },
    },
    showCalendarIcon: {
      control: "boolean",
      description:
        "Whether a calendar glyph is drawn before the date in the chip.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    hideCross: {
      control: "boolean",
      description: "Whether the chip's clearing cross is hidden.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    autoPosition: {
      control: "boolean",
      description:
        "Whether the calendar flips to the right edge when there is less than 340px of room to its right. Measured when it opens, not while it is open.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    openDate: {
      control: false,
      description: "Month the calendar opens on.",
    },
    minDate: {
      control: false,
      description:
        "Earliest selectable day in the calendar; its own day stays selectable, whatever its time.",
    },
    maxDate: {
      control: false,
      description: "Latest selectable day in the calendar.",
    },
    initialDate: {
      control: false,
      description:
        "Date the component starts with. On its own it does not survive the first effect — pass `outerDate` as well, or instead.",
    },
    outerDate: {
      control: false,
      description:
        "The chosen date, held by you, and what the chip shows. The component copies it on every render and clears its own date whenever this is empty.",
    },
    onChange: {
      action: "onChange",
      description:
        "Called with the chosen date, and with `null` when the cross clears it. Feed the value back through `outerDate` or the chip never appears.",
    },
    isMobile: {
      control: "boolean",
      description: "Whether the calendar uses its larger touch layout.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    useMaxTime: {
      control: "boolean",
      description:
        "Whether a picked day is reported at the end of that day rather than at midnight.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    className: {
      control: "text",
      description: "Applied to the outermost element.",
    },
    id: {
      control: "text",
      description: "Applied to the outermost element.",
    },
    testId: {
      control: "text",
      description: "`data-testid` of the outermost element.",
      table: {
        defaultValue: { summary: '"date-picker"' },
      },
    },
  },
} satisfies Meta<typeof DatePicker>;

type Story = StoryObj<ComponentProps<typeof DatePicker>>;

export default meta;

// A day of the shown month, not one of the greyed neighbours.
const dayButton = (calendar: HTMLElement, day: number) =>
  Array.from(calendar.querySelectorAll<HTMLButtonElement>("button.day")).find(
    (button) =>
      !/isSecondary/.test(button.className) &&
      button.textContent === String(day),
  ) as HTMLButtonElement;

const chipText = (date: DateTime) => date.toFormat("dd MMM yyyy");

const DatePickerWrapper = (props: { children: React.ReactNode }) => {
  return (
    <div style={{ height: "350px", padding: "20px" }}>{props.children}</div>
  );
};

const ControlledDatePicker = (
  props: Omit<ComponentProps<typeof DatePicker>, "onChange"> & {
    onChange?: (d: null | DateTime) => void;
  },
) => {
  const { initialDate, onChange, ...rest } = props;
  const [selectedDate, setSelectedDate] = useState<DateTime | null>(
    initialDate ? parseToDateTime(initialDate) : null,
  );

  return (
    <DatePickerWrapper>
      <DatePicker
        {...rest}
        initialDate={initialDate}
        onChange={(date) => {
          setSelectedDate(date);
          onChange?.(date);
        }}
        outerDate={selectedDate}
      />
    </DatePickerWrapper>
  );
};

export const Default: Story = {
  render: (args) => <ControlledDatePicker {...args} />,
  args: {
    locale: "en",
    openDate: now(),
    maxDate: startOf(
      addToDate(now(), 10, "years") as DateTime,
      "year",
    ) as DateTime,
    minDate: createDateTime(1970, 1, 1),
    selectDateText: "Select date",
    showCalendarIcon: true,
    onChange: fn(),
  },
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const today = now();
    const selector = canvas.getByTestId("date-selector");
    await expect(selector).toHaveAttribute("aria-expanded", "false");
    await expect(canvas.queryByTestId("calendar")).toBeNull();
    // One button, not the selector with AddButton's own button inside it.
    await expect(
      canvas.getAllByRole("button", { name: "Select date" }),
    ).toEqual([selector]);

    // The selector opens and closes from the keyboard.
    selector.focus();
    await userEvent.keyboard("{Enter}");
    await expect(selector).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByTestId("calendar")).toBeVisible();
    await userEvent.keyboard(" ");
    await expect(selector).toHaveAttribute("aria-expanded", "false");
    await expect(canvas.queryByTestId("calendar")).toBeNull();

    await userEvent.click(selector);
    await expect(selector).toHaveAttribute("aria-expanded", "true");
    const calendar = canvas.getByTestId("calendar");

    // The days are buttons, so the keyboard picks one too.
    const target = today.day === 15 ? 16 : 15;
    dayButton(calendar, target).focus();
    await userEvent.keyboard("{Enter}");
    const picked = today.set({ day: target });
    await expect(args.onChange).toHaveBeenCalledTimes(1);
    await expect(
      (
        (args.onChange as ReturnType<typeof fn>).mock.calls[0][0] as DateTime
      ).toISODate(),
    ).toBe(picked.toISODate());
    await expect(canvas.queryByTestId("calendar")).toBeNull();
    const chip = canvas.getByTestId("selected-item");
    await expect(chip).toHaveTextContent(chipText(picked));
    await expect(within(chip).getByTestId("calendar-icon")).toBeVisible();

    // The chip reopens the calendar; a click elsewhere closes it.
    await userEvent.click(canvas.getByTestId("selected-label"));
    await expect(canvas.getByTestId("calendar")).toBeVisible();
    await userEvent.click(canvasElement.ownerDocument.body);
    await expect(canvas.queryByTestId("calendar")).toBeNull();

    // The cross clears the date and brings the button back.
    await userEvent.click(within(chip).getByTestId("icon-button"));
    await expect(args.onChange).toHaveBeenLastCalledWith(null);
    await expect(canvas.getByTestId("date-selector")).toBeVisible();
    await expect(canvas.queryByTestId("calendar")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The picker as a form shows it before a date is chosen: a **Select date** button. A click, Enter or Space opens the calendar, and a picked day turns the button into a chip.",
      },
      source: {
        code: `const [date, setDate] = useState<DateTime | null>(null);

<DatePicker
  locale="en"
  openDate={now()}
  minDate={createDateTime(1970, 1, 1)}
  maxDate={startOf(addToDate(now(), 10, "years"), "year")}
  outerDate={date}
  onChange={setDate}
  selectDateText="Select date"
/>`,
      },
    },
  },
};

const WithInitialDateTemplate = () => {
  return (
    <ControlledDatePicker
      locale="en"
      openDate={now()}
      initialDate={now()}
      maxDate={startOf(addToDate(now(), 10, "years")!, "year")!}
      minDate={createDateTime(1970, 1, 1)}
      selectDateText="Date with initial value"
    />
  );
};

export const WithInitialDate: Story = {
  name: "With a date",
  render: () => <WithInitialDateTemplate />,
  play: async ({ canvas }) => {
    const chip = canvas.getByTestId("selected-item");
    await expect(chip).toHaveTextContent(chipText(now()));
    await expect(within(chip).getByTestId("calendar-icon")).toBeVisible();
    await expect(within(chip).getByTestId("icon-button")).toBeVisible();
    await expect(canvas.queryByTestId("date-selector")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A picker that starts on today's date, shown as a chip with a cross that removes it.",
      },
      source: {
        code: `const [date, setDate] = useState<DateTime | null>(now());

<DatePicker
  locale="en"
  openDate={now()}
  initialDate={now()}
  selectDateText="Date with initial value"
  outerDate={date}
  onChange={setDate}
/>`,
      },
    },
  },
};

const FutureDatesOnlyTemplate = () => {
  return (
    <ControlledDatePicker
      locale="en"
      openDate={now()}
      minDate={startOf(now(), "day") as DateTime}
      maxDate={startOf(addToDate(now(), 10, "years")!, "year")!}
      selectDateText="Only future dates"
    />
  );
};

export const FutureDatesOnly: Story = {
  name: "Today and later",
  render: () => <FutureDatesOnlyTemplate />,
  play: async ({ canvas, userEvent }) => {
    const today = now();
    await userEvent.click(canvas.getByTestId("date-selector"));
    const calendar = canvas.getByTestId("calendar");
    await expect(dayButton(calendar, today.day)).toBeEnabled();
    // Yesterday is out of range, or the way back is, on the first.
    if (today.day > 1) {
      await expect(dayButton(calendar, today.day - 1)).toBeDisabled();
    } else {
      await expect(
        within(calendar).getByRole("button", { name: "Previous" }),
      ).toBeDisabled();
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "A picker that allows today and later (`minDate` at the start of today). Past days are disabled in the calendar.",
      },
      source: {
        code: `<DatePicker
  locale="en"
  openDate={now()}
  minDate={startOf(now(), "day")}
  selectDateText="Only future dates"
  outerDate={date}
  onChange={setDate}
/>`,
      },
    },
  },
};

const SpecificYearTemplate = () => {
  return (
    <ControlledDatePicker
      locale="en"
      openDate={createDateTime(2023, 6, 15)}
      minDate={createDateTime(2023, 1, 1)}
      maxDate={createDateTime(2023, 12, 31)}
      selectDateText="Only dates from 2023"
    />
  );
};

export const SpecificYearRange: Story = {
  name: "Limited to one year",
  render: () => <SpecificYearTemplate />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByTestId("date-selector"));
    const calendar = canvas.getByTestId("calendar");
    // openDate decides the month shown, not today.
    await expect(calendar.querySelector("h2")).toHaveTextContent("June 2023");
    await userEvent.click(dayButton(calendar, 20));
    await expect(canvas.getByTestId("selected-item")).toHaveTextContent(
      "20 Jun 2023",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A picker limited to 2023 (`minDate`, `maxDate`). Only the days from 1 January to 31 December 2023 can be picked.",
      },
      source: {
        code: `<DatePicker
  locale="en"
  openDate={createDateTime(2023, 6, 15)}
  minDate={createDateTime(2023, 1, 1)}
  maxDate={createDateTime(2023, 12, 31)}
  selectDateText="Only dates from 2023"
  outerDate={date}
  onChange={setDate}
/>`,
      },
    },
  },
};

const WithoutCalendarIconTemplate = () => {
  return (
    <ControlledDatePicker
      locale="en"
      openDate={now()}
      initialDate={now()}
      maxDate={startOf(addToDate(now(), 10, "years")!, "year")!}
      minDate={createDateTime(1970, 1, 1)}
      selectDateText="No calendar icon"
      showCalendarIcon={false}
    />
  );
};

export const WithoutCalendarIcon: Story = {
  name: "Without the calendar icon",
  render: () => <WithoutCalendarIconTemplate />,
  play: async ({ canvas }) => {
    const chip = canvas.getByTestId("selected-item");
    await expect(chip).toHaveTextContent(chipText(now()));
    await expect(within(chip).queryByTestId("calendar-icon")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A chip without the calendar glyph before its date (`showCalendarIcon={false}`).",
      },
      source: {
        code: `<DatePicker
  locale="en"
  openDate={now()}
  initialDate={now()}
  showCalendarIcon={false}
  selectDateText="No calendar icon"
  outerDate={date}
  onChange={setDate}
/>`,
      },
    },
  },
};

const WithoutClearButtonTemplate = () => {
  return (
    <ControlledDatePicker
      locale="en"
      openDate={now()}
      initialDate={now()}
      maxDate={startOf(addToDate(now(), 10, "years")!, "year")!}
      minDate={createDateTime(1970, 1, 1)}
      selectDateText="Select date"
      hideCross
    />
  );
};

export const WithoutClearButton: Story = {
  name: "Without the cross",
  render: () => <WithoutClearButtonTemplate />,
  play: async ({ canvas, userEvent }) => {
    const today = now();
    const chip = canvas.getByTestId("selected-item");
    await expect(within(chip).queryByTestId("icon-button")).toBeNull();

    // The date can be replaced, though not removed.
    await userEvent.click(canvas.getByTestId("selected-label"));
    const target = today.day === 15 ? 16 : 15;
    await userEvent.click(dayButton(canvas.getByTestId("calendar"), target));
    await expect(canvas.getByTestId("selected-item")).toHaveTextContent(
      chipText(today.set({ day: target })),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A chip with no cross, for a date the form requires (`hideCross`). The date can be replaced from the calendar, but not removed.",
      },
      source: {
        code: `const [date, setDate] = useState<DateTime | null>(now());

<DatePicker
  locale="en"
  openDate={now()}
  initialDate={now()}
  outerDate={date}
  onChange={setDate}
  hideCross
/>`,
      },
    },
  },
};

const AlignedToRightEdgeTemplate = () => {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <ControlledDatePicker
        locale="en"
        openDate={now()}
        maxDate={startOf(addToDate(now(), 10, "years")!, "year")!}
        minDate={createDateTime(1970, 1, 1)}
        selectDateText="Select date"
        autoPosition
      />
    </div>
  );
};

export const AlignedToRightEdge: Story = {
  name: "At the right edge",
  render: () => <AlignedToRightEdgeTemplate />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByTestId("date-selector"));
    const calendar = canvas.getByTestId("calendar");
    await expect(calendar.className).toMatch(/rightAligned/);
    // The calendar stays inside the window.
    await expect(calendar.getBoundingClientRect().right).toBeLessThanOrEqual(
      window.innerWidth,
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A picker at the right edge of the window (`autoPosition`). Its calendar opens leftwards from the right edge of the nearest positioned container, instead of running off the screen.",
      },
      source: {
        code: `<div style={{ display: "flex", justifyContent: "flex-end" }}>
  <DatePicker
    locale="en"
    openDate={now()}
    outerDate={date}
    onChange={setDate}
    autoPosition
  />
</div>`,
      },
    },
  },
};

const EndOfDayValueTemplate = () => {
  const [reported, setReported] = useState<DateTime | null>(null);

  return (
    <div>
      <div style={{ padding: "20px 20px 0" }}>
        Reported value: {reported ? reported.toISO() : "none"}
      </div>
      <ControlledDatePicker
        locale="en"
        openDate={now()}
        maxDate={startOf(addToDate(now(), 10, "years")!, "year")!}
        minDate={createDateTime(1970, 1, 1)}
        selectDateText="Select date"
        useMaxTime
        onChange={setReported}
      />
    </div>
  );
};

export const EndOfDayValue: Story = {
  name: "End of the day",
  render: () => <EndOfDayValueTemplate />,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText("Reported value: none")).toBeVisible();
    await userEvent.click(canvas.getByTestId("date-selector"));
    const target = now().day === 15 ? 16 : 15;
    await userEvent.click(dayButton(canvas.getByTestId("calendar"), target));
    await expect(canvas.getByText(/^Reported value:/)).toHaveTextContent(
      /T23:59:59\.999/,
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'A "valid until" date whose picked day ends in 23:59:59.999, so the whole day is covered (`useMaxTime`). Without the prop the day is reported at the current time of day.',
      },
      source: {
        code: `<DatePicker
  locale="en"
  openDate={now()}
  outerDate={date}
  onChange={setDate}
  useMaxTime
/>`,
      },
    },
  },
};

// Framed on Docs: the theme provider stamps the direction on the page, which would flip the whole Docs page.
export const RightToLeft: Story = {
  name: "Right to left",
  render: () => (
    <div dir="rtl">
      <ControlledDatePicker
        locale="en"
        openDate={now()}
        initialDate={createDateTime(2026, 3, 15)}
        maxDate={startOf(addToDate(now(), 10, "years")!, "year")!}
        minDate={createDateTime(1970, 1, 1)}
        selectDateText="Select date"
      />
    </div>
  ),
  globals: { direction: "rtl" },
  play: async ({ canvas }) => {
    const picker = canvas.getByTestId("date-picker");
    const chip = canvas.getByTestId("selected-item");
    await expect(chip).toHaveTextContent("15 Mar 2026");
    await expect(getComputedStyle(picker).direction).toBe("rtl");
    // The chip starts at the right edge; the icon is on its right.
    const box = picker.getBoundingClientRect();
    await expect(box.right - chip.getBoundingClientRect().right).toBeLessThan(
      2,
    );
    const icon = within(chip)
      .getByTestId("calendar-icon")
      .getBoundingClientRect();
    const cross = within(chip)
      .getByTestId("icon-button")
      .getBoundingClientRect();
    await expect(cross.right).toBeLessThan(icon.left);
  },
  parameters: {
    noPadding: true,
    docs: {
      story: { inline: false, height: "470px" },
      description: {
        story:
          "A right-to-left picker. The chip starts at the right edge, with the calendar icon on its right and the cross on its left.",
      },
      source: {
        code: `<div dir="rtl">
  <DatePicker
    locale="en"
    openDate={now()}
    outerDate={date}
    onChange={setDate}
  />
</div>`,
      },
    },
  },
};

const cssVariables = {
  "--calendar-bg": "light-dark(#e6f3fb, #16303e)",
  "--calendar-border": "#0082c9",
  "--calendar-shadow": "0 4px 16px rgba(0,130,201,0.25)",
  "--calendar-radius": "12px",
  "--calendar-title": "#0082c9",
  "--calendar-title-size": "16px",
  "--calendar-outline": "#0082c9",
  "--calendar-arrow": "#0082c9",
  "--calendar-disabled-arrow": "light-dark(#a0c8e8, #2f5f80)",
  "--calendar-weekday": "#0082c9",
  "--calendar-accent": "#0082c9",
  "--calendar-selected-text": "#ffffff",
  "--calendar-current-radius": "8px",
  "--calendar-focused-radius": "8px",
  "--calendar-focused-bg": "#ffffff",
  "--calendar-focused-text": "#0082c9",
  "--calendar-hover-bg": "light-dark(#cce5f6, #1f4a61)",
  "--calendar-hover-radius": "8px",
  "--calendar-past": "#5ca8d9",
  "--calendar-disabled": "light-dark(#a0c8e8, #2f5f80)",
  "--add-button-bg": "light-dark(#cce5f6, #1f4a61)",
  "--add-button-bg-hover": "light-dark(#b3d9f0, #285a75)",
  "--add-button-bg-active": "light-dark(#99cceb, #2f5f80)",
  "--add-button-icon-color": "#0082c9",
  "--add-button-icon-color-hover": "light-dark(#004f82, #7cc3ea)",
  "--add-button-radius": "8px",
  "--selected-item-bg": "light-dark(#cce5f6, #1f4a61)",
  "--selected-item-bg-hover": "light-dark(#b3d9f0, #285a75)",
  "--selected-item-radius": "8px",
} as React.CSSProperties;

export const CssCustomization: Story = {
  name: "CSS variables",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", ...cssVariables }}>
      <ControlledDatePicker
        locale="en"
        openDate={startOf(now(), "month") as DateTime}
        initialDate={startOf(now(), "month") as DateTime}
        minDate={startOf(now(), "month") as DateTime}
        maxDate={startOf(addToDate(now(), 10, "years")!, "year")!}
        selectDateText="Select date"
      />
      <ControlledDatePicker
        locale="en"
        openDate={now()}
        minDate={startOf(now(), "month") as DateTime}
        maxDate={startOf(addToDate(now(), 10, "years")!, "year")!}
        selectDateText="Select date"
      />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const chip = canvas.getByTestId("selected-item");
    await expect(getComputedStyle(chip).backgroundColor).toBe(
      "rgb(204, 229, 246)",
    );
    await expect(getComputedStyle(chip).borderTopLeftRadius).toBe("8px");

    await userEvent.click(canvas.getByTestId("date-selector"));
    const calendar = canvas.getByTestId("calendar");
    await expect(getComputedStyle(calendar).backgroundColor).toBe(
      "rgb(230, 243, 251)",
    );
    await expect(
      within(calendar).getByRole("button", { name: "Previous" }),
    ).toBeDisabled();
  },
  parameters: {
    docs: {
      description: {
        story: `Two pickers under a wrapper that sets the variables of the parts inside: one with a chip, one with the **Select date** button. Their calendars start at the first of this month (\`minDate\`).`,
      },
      source: {
        code: `<div
  style={{
    "--calendar-bg": "light-dark(#e6f3fb, #16303e)",
    "--calendar-border": "#0082c9",
    "--calendar-accent": "#0082c9",
    "--calendar-hover-bg": "light-dark(#cce5f6, #1f4a61)",
    "--add-button-bg": "light-dark(#cce5f6, #1f4a61)",
    "--add-button-icon-color": "#0082c9",
    "--selected-item-bg": "light-dark(#cce5f6, #1f4a61)",
    "--selected-item-radius": "8px",
  }}
>
  <DatePicker
    locale="en"
    openDate={now()}
    outerDate={date}
    onChange={setDate}
  />
</div>`,
      },
    },
  },
};
