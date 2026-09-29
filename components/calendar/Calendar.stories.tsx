import React, { useState } from "react";

import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import type { DateTime } from "luxon";

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
    docs: {
      description: {
        component: `Calendar is an always-visible month grid for picking a single day, with month and year views behind its title.

### Features

- **Date Selection**: Click to select a specific date
- **Month/Year Navigation**: The arrow buttons step one month, year or decade at a time, and clicking the title switches from days to months and from months to years
- **Locale Support**: Writes month and weekday names in the language of any locale tag passed to it
- **Date Range Constraints**: Greys out and disables the days, months and years outside \`minDate\` and \`maxDate\`, and stops the arrows at the boundary
- **Initial Date**: Set the initially visible month/year
- **Today and Selection**: Fills today's day with the accent colour and rings the selected day in it
- **Time Kept on Pick**: Keeps the time of the previous selection when another day is picked, or reports the end of the day when \`useMaxTime\` is set

### Accessibility

Every day, month, year and arrow is a native \`<button>\`, so the keyboard support comes from the platform:

- Tab and Shift+Tab move through the arrows and the grid; Enter and Space pick the focused item
- Out-of-range items and arrows are \`disabled\`, so Tab skips them and they cannot be picked
- The arrows are named \`aria-label="Previous"\` and \`aria-label="Next"\`
- The title that opens the month and year views is a heading with a click handler, reachable by mouse only

### Usage

\`\`\`tsx
import { Calendar } from "@onlyoffice/apps-ui-kit/components/calendar";

// Basic usage
<Calendar
  locale="en"
  selectedDate={selectedDate}
  setSelectedDate={setSelectedDate}
/>

// With date constraints
<Calendar
  locale="en"
  selectedDate={selectedDate}
  setSelectedDate={setSelectedDate}
  minDate={new Date("2024/01/01")}
  maxDate={new Date("2030/01/01")}
/>

// Report the picked day at 23:59:59.999, for an "until" date
<Calendar
  locale="en"
  selectedDate={selectedDate}
  onChange={setUntil}
  useMaxTime
/>
\`\`\``,
      },
    },
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
  },
  parameters: {
    docs: {
      description: {
        story:
          "The calendar as it opens: today is filled with the accent colour. Click a day to select it and watch the Actions panel, click the title to switch to months and then years, and change any other prop live in the Controls panel below.",
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
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
| --- | --- | --- |
| \`--calendar-bg\` | Background of the calendar | theme-based |
| \`--calendar-border\` | Colour of the one-pixel border | theme-based |
| \`--calendar-shadow\` | Box shadow of the calendar | theme-based |
| \`--calendar-radius\` | Corner radius of the calendar | \`6px\` |
| \`--calendar-padding\` | Inner padding; ignored with \`isScroll\` and in the mobile layout | \`30px 28px 28px 28px\` |
| \`--calendar-width\` | Width; ignored in the mobile layout, which takes the full width | \`362px\` |
| \`--calendar-height\` | Height; ignored in the mobile layout, which is 420px high | \`376px\` |
| \`--calendar-title\` | Colour of the title and of its dashed underline on hover | theme-based |
| \`--calendar-title-size\` | Font size of the title; ignored in the mobile layout | \`18px\` |
| \`--calendar-outline\` | Ring colour of the arrow buttons | theme-based |
| \`--calendar-arrow\` | Colour of the arrow chevrons | theme-based |
| \`--calendar-disabled-arrow\` | Colour of the chevron of an arrow that cannot go further | theme-based |
| \`--calendar-weekday\` | Colour of the weekday labels | theme-based |
| \`--calendar-accent\` | Fill of today, ring of the selected day, arrow ring on hover and the title chevron | theme-based |
| \`--calendar-selected-text\` | Text colour of today on the accent fill | \`#fff\` |
| \`--calendar-current-radius\` | Corner radius of today | \`50%\` |
| \`--calendar-focused-radius\` | Corner radius of the selected day | \`50%\` |
| \`--calendar-focused-bg\` | Background of the selected day | \`transparent\` |
| \`--calendar-focused-text\` | Text colour of the selected day | theme-based |
| \`--calendar-hover-bg\` | Background of a day under the pointer | theme-based |
| \`--calendar-hover-radius\` | Corner radius of a day under the pointer | \`50%\` |
| \`--calendar-past\` | Text colour of the days of the previous and next month | theme-based |
| \`--calendar-disabled\` | Text colour of the days outside \`minDate\` and \`maxDate\` | theme-based |

One calendar sets every variable on a wrapper. It opens with a selected day other than today, so the today and selected-day variables both show, and with \`minDate\` at the start of this month, so the days of the previous month and the left arrow show their disabled colours. Hover a day and an arrow to see the hover variables.`,
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
