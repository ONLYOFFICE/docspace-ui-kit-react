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
        "Locale the calendar writes its month names and weekdays in (e.g. 'en', 'de'); the chip always shows the date as '15 Sep 2026'",
    },
    selectDateText: {
      control: "text",
      description: "Text of the button shown while no date is chosen",
      table: {
        defaultValue: { summary: '"Select date"' },
      },
    },
    showCalendarIcon: {
      control: "boolean",
      description: "Show calendar icon in the selected date chip",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    hideCross: {
      control: "boolean",
      description: "Hide the close/remove button on the selected date chip",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    autoPosition: {
      control: "boolean",
      description:
        "Opens the calendar against the right edge of the picker's positioned ancestor when less than 340px of the window is left to the picker's right; measured each time the calendar opens",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    openDate: {
      control: false,
      description:
        "Month the calendar shows each time it opens, even with a date already chosen; a month outside `minDate` to `maxDate` is replaced by the nearest limit",
    },
    minDate: {
      control: false,
      description:
        "Earliest selectable day; the days before it are drawn disabled",
    },
    maxDate: {
      control: false,
      description:
        "Latest selectable day; the days after it are drawn disabled",
    },
    initialDate: {
      control: false,
      description:
        "Date the picker starts with; cleared on the first render unless `outerDate` holds a date too",
    },
    outerDate: {
      control: false,
      description:
        "The chosen date, held by the host: the chip shows it, and the picker shows the button again whenever it is empty",
    },
    onChange: {
      action: "onChange",
      description:
        "Called with the picked day, and with `null` when the chip's cross clears it",
    },
    isMobile: {
      control: "boolean",
      description:
        "Widens the gap between the calendar's previous and next arrows from 8px to 12px; the larger day cells of a phone come from the window width, not from this prop",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    useMaxTime: {
      control: "boolean",
      description:
        "Reports a day picked while no date is chosen at 23:59:59.999 of that day instead of at the current time of day",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    className: {
      control: "text",
      description: "Class name added to the outermost element",
    },
    id: {
      control: "text",
      description: "Id of the outermost element",
    },
    testId: {
      control: "text",
      description: "`data-testid` of the outermost element",
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
          "The picker as a form shows it before a date is chosen: click **Select date**, or focus it and press Enter or Space, to open the calendar, pick a day to turn the button into a chip, and change any other prop live in the Controls panel below.",
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
          "DatePicker initialized with the current date. The selected date appears as a chip that can be removed.",
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
          "Restricts selection to future dates only by setting minDate to today. Past dates appear disabled in the calendar.",
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
          "Constrains the calendar to a specific year (2023). Only dates within January 1 - December 31, 2023 are selectable.",
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
          "The calendar icon in the selected date chip can be hidden with showCalendarIcon={false}.",
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
          "For a date the form requires: the chip has no cross, so a date can be replaced by clicking the chip and picking another day, but not removed (`hideCross`).",
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
          "For a picker near the right edge of the window, such as the last column of a toolbar: click **Select date** and the calendar opens leftwards from the right edge of the nearest positioned container, here the window, instead of running off the screen (`autoPosition`).",
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
          'For an inclusive end of a period, such as a "valid until" date: pick a day and the value above ends in 23:59:59.999, so the whole day is covered (`useMaxTime`). Without the prop the day is reported at the current time of day.',
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
          'The picker under a right-to-left interface: the chip starts at the right edge, with the calendar icon on its right and the cross on its left, and the calendar opens under the right end of the picker. The direction comes from the theme\'s `interfaceDirection` (the Direction toolbar); the wrapper also carries `dir="rtl"` for the rules that read the DOM direction.',
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
  "--calendar-bg": "#e6f3fb",
  "--calendar-border": "#0082c9",
  "--calendar-shadow": "0 4px 16px rgba(0,130,201,0.25)",
  "--calendar-radius": "12px",
  "--calendar-title": "#0082c9",
  "--calendar-title-size": "16px",
  "--calendar-outline": "#0082c9",
  "--calendar-arrow": "#0082c9",
  "--calendar-disabled-arrow": "#a0c8e8",
  "--calendar-weekday": "#0082c9",
  "--calendar-accent": "#0082c9",
  "--calendar-selected-text": "#ffffff",
  "--calendar-current-radius": "8px",
  "--calendar-focused-radius": "8px",
  "--calendar-focused-bg": "#ffffff",
  "--calendar-focused-text": "#0082c9",
  "--calendar-hover-bg": "#cce5f6",
  "--calendar-hover-radius": "8px",
  "--calendar-past": "#5ca8d9",
  "--calendar-disabled": "#a0c8e8",
  "--add-button-bg": "#cce5f6",
  "--add-button-bg-hover": "#b3d9f0",
  "--add-button-bg-active": "#99cceb",
  "--add-button-icon-color": "#0082c9",
  "--add-button-icon-color-hover": "#004f82",
  "--add-button-radius": "8px",
  "--selected-item-bg": "#cce5f6",
  "--selected-item-bg-hover": "#b3d9f0",
  "--selected-item-radius": "8px",
} as React.CSSProperties;

export const CssCustomization: Story = {
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
        story: `The variables are listed under CSS variables on this page. They are set on one wrapper around two pickers. The first holds the first day of this month, so it shows the chip; the second has no date, so it shows the **Select date** button. Open either calendar to see the calendar variables: both start at the first of this month (\`minDate\`), so the days of the previous month and the left arrow show their disabled colours, and the first picker's chosen day differs from today. Hover the chip, the button and a day to see the hover variables.`,
      },
      source: {
        code: `<div
  style={{
    "--calendar-bg": "#e6f3fb",
    "--calendar-border": "#0082c9",
    "--calendar-accent": "#0082c9",
    "--calendar-hover-bg": "#cce5f6",
    "--add-button-bg": "#cce5f6",
    "--add-button-icon-color": "#0082c9",
    "--selected-item-bg": "#cce5f6",
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
