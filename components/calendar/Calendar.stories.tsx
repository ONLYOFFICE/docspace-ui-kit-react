import React, { useState } from "react";

import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateTime } from "luxon";
import { expect, fn, within } from "storybook/test";

import { now } from "../../utils/date";

import { Calendar } from ".";

const locales = [
  "az",
  "ar-SA",
  "zh-cn",
  "cs",
  "nl",
  "en-gb",
  "en",
  "fi",
  "fr",
  "de",
  "de-ch",
  "el",
  "it",
  "ja",
  "ko",
  "lv",
  "pl",
  "pt",
  "pt-br",
  "ru",
  "sk",
  "sl",
  "es",
  "tr",
  "uk",
  "vi",
];

const meta = {
  title: "UI/Form controls/Calendar",
  component: Calendar,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=651-4406&mode=design&t=RrB9MOQGCnUPghij-0",
    },
  },
  argTypes: {
    locale: {
      control: "select",
      options: locales,
      description:
        "Locale tag the month and weekday names are written in; any tag the browser knows works, the list holds common ones",
      table: {
        defaultValue: { summary: "en" },
      },
    },
    minDate: {
      control: "date",
      description:
        "Earliest selectable day; earlier days are greyed out and the arrows stop at its month",
      table: {
        defaultValue: { summary: "1970-01-01" },
      },
    },
    maxDate: {
      control: "date",
      description:
        "Latest selectable day; later days are greyed out and the arrows stop at its month",
      table: {
        defaultValue: { summary: "ten years from today" },
      },
    },
    initialDate: {
      control: "date",
      description:
        "First shown date when the calendar opens; a date outside the range opens the nearer boundary instead",
      table: {
        defaultValue: { summary: "today" },
      },
    },
    isMobile: {
      control: "boolean",
      description:
        "Widens the gap between the two arrow buttons from 8px to 12px; the larger touch layout itself switches on by window width",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    className: {
      control: "text",
      description: "Additional CSS class for the calendar container",
    },
    id: {
      control: "text",
      description: "Id of the calendar container",
    },
    style: {
      control: "object",
      description: "Inline styles of the calendar container",
    },
    selectedDate: {
      control: false,
      description:
        "The highlighted day, as a Luxon DateTime; its time is kept when another day is picked",
    },
    setSelectedDate: {
      action: "setSelectedDate",
      description: "Called with the newly picked day, before onChange",
    },
    onChange: {
      action: "onChange",
      description:
        "Called with the newly picked day, right after setSelectedDate and with the same value",
    },
    useMaxTime: {
      control: "boolean",
      description:
        "Reports a picked day at 23:59:59.999 instead of keeping the time of the previous selection",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isScroll: {
      control: "boolean",
      description:
        "Wraps the grid in a scroll area and drops the calendar's top, right and bottom padding",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    dataTestId: {
      control: "text",
      description: "data-testid of the calendar container",
      table: {
        defaultValue: { summary: "calendar" },
      },
    },
    forwardedRef: {
      control: false,
      description: "Ref to the calendar container",
    },
  },
} satisfies Meta<typeof Calendar>;

type Story = StoryObj<ComponentProps<typeof Calendar>>;

export default meta;

const title = (calendar: HTMLElement) =>
  calendar.querySelector("h2") as HTMLElement;

// A day of the shown month, not one of the greyed neighbours.
const dayButton = (calendar: HTMLElement, day: number) =>
  Array.from(calendar.querySelectorAll<HTMLButtonElement>("button.day")).find(
    (button) =>
      !/isSecondary/.test(button.className) &&
      button.textContent === String(day),
  ) as HTMLButtonElement;

const monthTitle = (date: DateTime, locale = "en") =>
  date.setLocale(locale).toFormat("MMMM yyyy").toLowerCase();

// The date control hands back a timestamp, which the component does not parse.
const toDate = (value?: DateTime | Date | number) =>
  typeof value === "number" ? new Date(value) : value;

const InteractiveCalendar = ({
  locale,
  minDate,
  maxDate,
  initialDate,
  isMobile,
  className,
  id,
  style,
  onChange,
  setSelectedDate: onSetSelectedDate,
  useMaxTime,
  isScroll,
  dataTestId,
}: Omit<ComponentProps<typeof Calendar>, "selectedDate">) => {
  const [selectedDate, setSelectedDate] = useState<DateTime>(now());
  return (
    <Calendar
      locale={locale}
      selectedDate={selectedDate}
      setSelectedDate={(date) => {
        setSelectedDate(date);
        onSetSelectedDate?.(date);
      }}
      onChange={onChange}
      minDate={toDate(minDate)}
      maxDate={toDate(maxDate)}
      initialDate={toDate(initialDate)}
      isMobile={isMobile}
      className={className}
      id={id}
      style={style}
      useMaxTime={useMaxTime}
      isScroll={isScroll}
      dataTestId={dataTestId}
    />
  );
};

export const Default: Story = {
  render: (args) => <InteractiveCalendar {...args} />,
  args: {
    locale: "en",
    maxDate: new Date(`${new Date().getFullYear() + 10}/01/01`),
    minDate: new Date("1970/01/01"),
    initialDate: new Date(),
    onChange: fn(),
    setSelectedDate: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const calendar = canvas.getByTestId("calendar");
    const today = now();
    await expect(title(calendar).textContent?.toLowerCase()).toBe(
      monthTitle(today),
    );
    const fullDate = (date: DateTime) =>
      date.setLocale("en").toLocaleString(DateTime.DATE_FULL);
    // Today is also the selected day here: it carries both marks and both
    // states, and is named by its full date rather than by its number.
    const todayButton = within(calendar).getByRole("button", {
      name: fullDate(today),
    });
    await expect(todayButton).toHaveTextContent(String(today.day));
    await expect(todayButton).toHaveAttribute("aria-current", "date");
    await expect(todayButton).toHaveAttribute("aria-pressed", "true");
    await expect(todayButton.className).toMatch(/isCurrent/);
    await expect(todayButton.className).toMatch(/focused/);
    // The selection ring is drawn around today's fill, not swallowed by it.
    await expect(getComputedStyle(todayButton).boxShadow).not.toBe("none");

    // Picking a day reports it to both callbacks and rings it.
    const target = today.day === 15 ? 16 : 15;
    await userEvent.click(dayButton(calendar, target));
    await expect(args.setSelectedDate).toHaveBeenCalledTimes(1);
    const picked = (args.setSelectedDate as ReturnType<typeof fn>).mock
      .calls[0][0] as DateTime;
    await expect(picked.toISODate()).toBe(
      today.set({ day: target }).toISODate(),
    );
    await expect(args.onChange).toHaveBeenCalledWith(picked);
    await expect(dayButton(calendar, target).className).toMatch(/focused/);
    await expect(
      within(calendar).getByRole("button", {
        name: fullDate(today.set({ day: target })),
      }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(todayButton).toHaveAttribute("aria-pressed", "false");

    // The arrows page through months.
    await userEvent.click(
      within(calendar).getByRole("button", { name: "Next" }),
    );
    await expect(title(calendar).textContent?.toLowerCase()).toBe(
      monthTitle(today.plus({ months: 1 })),
    );
    await userEvent.click(
      within(calendar).getByRole("button", { name: "Previous" }),
    );
    await expect(title(calendar).textContent?.toLowerCase()).toBe(
      monthTitle(today),
    );

    // The title opens the months, then the years; a year leads back to
    // its months, and a month back to its days.
    await userEvent.click(title(calendar));
    await expect(title(calendar)).toHaveClass("months-header");
    await userEvent.click(title(calendar));
    await expect(title(calendar)).toHaveClass("years-header");
    const nextYear = String(today.year + 1);
    const year = Array.from(
      calendar.querySelectorAll<HTMLButtonElement>("button.year"),
    ).find((button) => button.textContent === nextYear) as HTMLElement;
    await userEvent.click(year);
    await expect(title(calendar)).toHaveClass("months-header");
    await expect(title(calendar)).toHaveTextContent(nextYear);
    const [january] =
      calendar.querySelectorAll<HTMLButtonElement>("button.month");
    await userEvent.click(january);
    await expect(title(calendar)).toHaveClass("days-header");
    await expect(title(calendar).textContent?.toLowerCase()).toBe(
      monthTitle(today.set({ year: today.year + 1, month: 1 })),
    );
    // Browsing selects nothing.
    await expect(args.setSelectedDate).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          'The calendar as it opens: today is filled with the accent colour and, being the selected day too, ringed as well. Each day is named by its full date, the selected one is `aria-pressed` and today is `aria-current="date"`. Click a day to select it and watch the Actions panel, click the title to switch to months and then years, and change any other prop live in the Controls panel below.',
      },
      source: {
        code: `const [selectedDate, setSelectedDate] = useState(now());

<Calendar
  locale="en"
  selectedDate={selectedDate}
  setSelectedDate={setSelectedDate}
  onChange={handleChange}
/>`,
      },
    },
  },
};

const WithDateConstraintsTemplate = () => {
  const [selectedDate, setSelectedDate] = useState<DateTime>(now());
  const currentYear = new Date().getFullYear();
  return (
    <Calendar
      locale="en"
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      minDate={new Date(`${currentYear}/01/01`)}
      maxDate={new Date(`${currentYear}/12/31`)}
    />
  );
};

export const WithDateConstraints: Story = {
  render: () => <WithDateConstraintsTemplate />,
  play: async ({ canvas, userEvent }) => {
    const calendar = canvas.getByTestId("calendar");
    const today = now();
    const previous = within(calendar).getByRole("button", { name: "Previous" });
    const next = within(calendar).getByRole("button", { name: "Next" });

    // The arrows stop at January and December of this year.
    for (let month = today.month; month > 1; month -= 1) {
      await userEvent.click(previous);
    }
    await expect(previous).toBeDisabled();
    await expect(title(calendar).textContent?.toLowerCase()).toBe(
      monthTitle(today.set({ month: 1 })),
    );
    for (let month = 1; month < 12; month += 1) {
      await userEvent.click(next);
    }
    await expect(next).toBeDisabled();

    // Only this year is enabled in the years view.
    await userEvent.click(title(calendar));
    await userEvent.click(title(calendar));
    const enabled = Array.from(
      calendar.querySelectorAll<HTMLButtonElement>("button.year"),
    )
      .filter((button) => !button.disabled)
      .map((button) => button.textContent);
    await expect(enabled).toEqual([String(today.year)]);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Calendar with min and max date constraints. Only dates within the current year are selectable.",
      },
      source: {
        code: `<Calendar
  locale="en"
  selectedDate={selectedDate}
  setSelectedDate={setSelectedDate}
  minDate={new Date("2026/01/01")}
  maxDate={new Date("2026/12/31")}
/>`,
      },
    },
  },
};

const LocaleCalendarItem = ({ locale }: { locale: string }) => {
  const [selectedDate, setSelectedDate] = useState<DateTime>(now());
  return (
    <div>
      <div
        style={{
          marginBottom: "8px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {locale}
      </div>
      <Calendar
        locale={locale}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </div>
  );
};

const LocaleExamplesTemplate = () => {
  const sampleLocales = ["en", "ru", "de", "ja"];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridGap: "24px",
      }}
    >
      {sampleLocales.map((locale) => (
        <LocaleCalendarItem key={locale} locale={locale} />
      ))}
    </div>
  );
};

export const LocaleExamples: Story = {
  render: () => <LocaleExamplesTemplate />,
  play: async ({ canvas }) => {
    const today = now();
    const calendars = canvas.getAllByTestId("calendar");
    await expect(calendars).toHaveLength(4);
    // Each title is the month written in its own locale.
    for (const [index, locale] of ["en", "ru", "de", "ja"].entries()) {
      await expect(title(calendars[index]).textContent?.toLowerCase()).toBe(
        monthTitle(today, locale),
      );
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Calendar rendered in different locales. Shows how month names, weekday headers, and date formatting adapt to each locale.",
      },
      source: {
        code: `<Calendar locale="en" selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
<Calendar locale="ru" selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
<Calendar locale="de" selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
<Calendar locale="ja" selectedDate={selectedDate} setSelectedDate={setSelectedDate} />`,
      },
    },
  },
};

const RightToLeftTemplate = () => {
  const [selectedDate, setSelectedDate] = useState<DateTime>(now());
  return (
    <div dir="rtl">
      <Calendar
        locale="ar-SA"
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </div>
  );
};

// Framed on Docs: the theme provider stamps data-dir on <html>, which would flip the whole page.
export const RightToLeft: Story = {
  render: () => <RightToLeftTemplate />,
  globals: { direction: "rtl" },
  play: async ({ canvas }) => {
    const calendar = canvas.getByTestId("calendar");
    await expect(getComputedStyle(calendar).direction).toBe("rtl");
    // The title sits at the right edge, the arrows at the left.
    const heading = title(calendar).getBoundingClientRect();
    const next = within(calendar)
      .getByRole("button", { name: "Next" })
      .getBoundingClientRect();
    await expect(next.right).toBeLessThan(heading.left);
  },
  parameters: {
    noPadding: true,
    docs: {
      story: { inline: false, height: "402px" },
      description: {
        story:
          'The calendar in a right-to-left layout with Arabic names: the weeks run from right to left, the title moves to the right edge and the arrows to the left, while the chevron after the title stays on its right, before the text. The wrapper carries `dir="rtl"`; the direction also comes from the theme\'s `interfaceDirection` (the Direction toolbar).',
      },
      source: {
        code: `<div dir="rtl">
  <Calendar
    locale="ar-SA"
    selectedDate={selectedDate}
    setSelectedDate={setSelectedDate}
  />
</div>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => {
    const today = now();
    const [selectedDate, setSelectedDate] = useState<DateTime>(
      today.set({ day: today.day === 15 ? 16 : 15 }),
    );
    return (
      <div
        style={
          {
            // Calendar container
            "--calendar-bg": "#e6f3fb",
            "--calendar-border": "#0082c9",
            "--calendar-shadow": "0 4px 16px rgba(0,130,201,0.25)",
            "--calendar-radius": "12px",
            "--calendar-padding": "24px",
            "--calendar-width": "340px",
            "--calendar-height": "360px",
            // Title
            "--calendar-title": "#0082c9",
            "--calendar-title-size": "16px",
            // Navigation arrows
            "--calendar-outline": "#0082c9",
            "--calendar-arrow": "#0082c9",
            "--calendar-disabled-arrow": "#cce5f6",
            // Weekday labels
            "--calendar-weekday": "#0082c9",
            // Date items
            "--calendar-accent": "#0082c9",
            "--calendar-selected-text": "#ffffff",
            "--calendar-current-radius": "8px",
            "--calendar-focused-radius": "8px",
            "--calendar-focused-bg": "#ffffff",
            "--calendar-focused-text": "#0082c9",
            "--calendar-hover-bg": "#cce5f6",
            "--calendar-hover-radius": "8px",
            "--calendar-past": "#5ab4e5",
            "--calendar-disabled": "#cce5f6",
          } as React.CSSProperties
        }
      >
        <Calendar
          locale="en"
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          minDate={today.startOf("month")}
        />
      </div>
    );
  },
  play: async ({ canvas }) => {
    const calendar = canvas.getByTestId("calendar");
    const box = getComputedStyle(calendar);
    await expect(box.width).toBe("340px");
    await expect(box.backgroundColor).toBe("rgb(230, 243, 251)");
    await expect(box.borderTopLeftRadius).toBe("12px");
    const current = calendar.querySelector('[class*="isCurrent"]') as Element;
    await expect(getComputedStyle(current).backgroundColor).toBe(
      "rgb(0, 130, 201)",
    );
    // minDate at the start of this month disables the way back.
    await expect(
      within(calendar).getByRole("button", { name: "Previous" }),
    ).toBeDisabled();
  },
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. The calendar opens with a selected day other than today, so the today and selected-day variables both show, and with \`minDate\` at the start of this month, so the days of the previous month and the left arrow show their disabled colours. Hover a day and an arrow to see the hover variables.`,
      },
      source: {
        code: `<div
  style={{
    "--calendar-bg": "#e6f3fb",
    "--calendar-border": "#0082c9",
    "--calendar-radius": "12px",
    "--calendar-title": "#0082c9",
    "--calendar-accent": "#0082c9",
    "--calendar-focused-bg": "#ffffff",
    "--calendar-hover-bg": "#cce5f6",
    "--calendar-past": "#5ab4e5",
    "--calendar-disabled": "#cce5f6",
  }}
>
  <Calendar
    locale="en"
    selectedDate={selectedDate}
    setSelectedDate={setSelectedDate}
    minDate={startOfThisMonth}
  />
</div>`,
      },
    },
  },
};
