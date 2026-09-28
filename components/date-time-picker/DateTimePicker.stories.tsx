import React from "react";
import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import type { DateTime } from "luxon";

import { now } from "../../utils/date";

import { DateTimePicker } from ".";

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
  title: "UI/Form controls/DateTimePicker",
  component: DateTimePicker,
  parameters: {
    docs: {
      description: {
        component: `Combined date and time input component that allows users to select both date and time values.

### Features

- **Calendar Date Selection**: Opens a calendar from the "select date" button, then shows the picked day as a chip that reopens the calendar on click
- **Time Input**: Shows the time beside the chip once a day is picked, and turns it into an hours-and-minutes editor on click
- **Locale Support**: Writes the calendar in the given locale and takes the clock from it, 12-hour for English locales and 24-hour for every other
- **Date Range Constraints**: Limits the days the calendar lets you pick to the range between the earliest and the latest date
- **Error State**: Draws the shown time in red and marks the whole control as invalid for assistive technology
- **AM/PM Support**: Adds an AM/PM drop-down to the time editor on a 12-hour clock, labelled from \`translations\`, and moves the time by twelve hours when switched
- **Clearing**: Clears the day and hides the time through the chip's cross, which can be hidden, and reports \`null\` to \`onChange\`

### Accessibility

The control names its parts for screen readers and moves focus into the time editor.

- The outer element carries \`aria-label\` set to \`selectDateText\`, and \`aria-invalid\` while \`hasError\` is set
- The "select date" button has \`role="button"\`, is named by \`selectDateText\` and reports \`aria-expanded\` while the calendar is open
- The shown time is reachable with Tab and announced as a button named "Current time" followed by the time
- The time editor takes focus as soon as it opens, and Enter or Tab closes it

### Usage

\`\`\`tsx
import { DateTimePicker } from "@onlyoffice/apps-ui-kit/components/date-time-picker";

// Basic usage
<DateTimePicker
  locale="en"
  openDate={new Date()}
  selectDateText="Select date"
  translations={{ AM: "AM", PM: "PM" }}
  onChange={(date) => console.log(date)}
/>

// With date constraints
<DateTimePicker
  locale="en"
  openDate={new Date()}
  minDate={new Date("2024/01/01")}
  maxDate={new Date("2030/01/01")}
  selectDateText="Select date"
  translations={{ AM: "AM", PM: "PM" }}
  onChange={(date) => console.log(date)}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    locale: {
      control: "select",
      options: locales,
      description:
        "BCP 47 tag the calendar is written in; it also picks the clock: 12-hour with an AM/PM drop-down for English locales, 24-hour for every other",
    },
    hasError: {
      control: "boolean",
      description:
        "Draws the shown time in red and marks the control as invalid",
    },
    minDate: {
      control: "date",
      description: "Earliest day the calendar lets you pick",
    },
    maxDate: {
      control: "date",
      description: "Latest day the calendar lets you pick",
    },
    initialDate: {
      control: "date",
      description:
        "Date and time the component starts on; read once, when it mounts",
    },
    openDate: {
      control: "date",
      description: "Month the calendar opens on",
    },
    selectDateText: {
      control: "text",
      description:
        "Text of the button shown while no date is chosen, also the control's accessible name",
    },
    className: {
      control: "text",
      description: "Class added to the outermost element",
    },
    id: {
      control: "text",
      description: "`id` of the outermost element",
    },
    dataTestId: {
      control: "text",
      description: "`data-testid` of the outermost element",
      table: {
        defaultValue: { summary: "date-time-picker" },
      },
    },
    hideCross: {
      control: "boolean",
      description:
        "Hides the cross on the date chip, so the picked day cannot be cleared",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    useMaxTime: {
      control: "boolean",
      description:
        "Reports the first day picked at the end of that day rather than at the current time of day",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    translations: {
      control: "object",
      description:
        "Labels of the AM and PM options in the drop-down; required, as nothing translates them for you",
    },
    onChange: {
      action: "onChange",
      description:
        "Called whenever the day or the time changes, with the combined date and time, or `null` when the day is cleared",
    },
  },
} satisfies Meta<typeof DateTimePicker>;

type Story = StoryObj<ComponentProps<typeof DateTimePicker>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return <div style={{ height: "500px" }}>{props.children}</div>;
};

// The date control hands over a timestamp, which the component does not parse.
const fromControl = <T,>(value: T): T =>
  (typeof value === "number" ? new Date(value) : value) as T;

export const Default: Story = {
  render: (args) => (
    <Wrapper>
      <DateTimePicker
        {...args}
        // initialDate is read once on mount, so a new value remounts the picker.
        key={String(args.initialDate)}
        initialDate={fromControl(args.initialDate)}
        minDate={fromControl(args.minDate)}
        maxDate={fromControl(args.maxDate)}
        openDate={fromControl(args.openDate)}
      />
    </Wrapper>
  ),
  args: {
    locale: "en",
    maxDate: new Date(`${new Date().getFullYear() + 10}/01/01`),
    minDate: new Date("1970/01/01"),
    openDate: now(),
    selectDateText: "Select date",
    className: "date-time-picker",
    id: "default-date-time-picker",
    hasError: false,
    translations: { AM: "AM", PM: "PM" },
  },
  parameters: {
    docs: {
      description: {
        story:
          'The picker as a form shows it before anything is chosen: only the "Select date" button. Pick a day to see the time appear beside it, click the time to edit it, and change any other prop live in the Controls panel below.',
      },
      source: {
        code: `<DateTimePicker
  locale="en"
  openDate={new Date()}
  minDate={new Date("1970/01/01")}
  maxDate={new Date("2036/01/01")}
  selectDateText="Select date"
  translations={{ AM: "AM", PM: "PM" }}
  onChange={(date) => console.log(date)}
/>`,
      },
    },
  },
};

const WithErrorTemplate = () => {
  return (
    <Wrapper>
      <DateTimePicker
        locale="en"
        maxDate={new Date(`${new Date().getFullYear() + 10}/01/01`)}
        minDate={new Date("1970/01/01")}
        openDate={now()}
        initialDate={now()}
        selectDateText="Select date"
        className="date-time-picker"
        id="error-date-time-picker"
        hasError
        onChange={(date) => console.log("Date changed:", date)}
        translations={{ AM: "AM", PM: "PM" }}
      />
    </Wrapper>
  );
};

export const WithError: Story = {
  render: () => <WithErrorTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Use it when the chosen moment fails validation: the time turns red and the control is marked invalid for screen readers (`hasError`). A day is picked here because the time, the only part drawn in the error colour, shows only once there is one.",
      },
      source: {
        code: `<DateTimePicker
  locale="en"
  openDate={now()}
  initialDate={now()}
  selectDateText="Select date"
  translations={{ AM: "AM", PM: "PM" }}
  hasError
  onChange={(date) => console.log(date)}
/>`,
      },
    },
  },
};

const WithInitialDateTemplate = () => {
  return (
    <Wrapper>
      <DateTimePicker
        locale="en"
        maxDate={new Date(`${new Date().getFullYear() + 10}/01/01`)}
        minDate={new Date("1970/01/01")}
        openDate={now()}
        initialDate={now()}
        selectDateText="Select date"
        className="date-time-picker"
        id="initial-date-time-picker"
        hasError={false}
        onChange={(date) => console.log("Date changed:", date)}
        translations={{ AM: "AM", PM: "PM" }}
      />
    </Wrapper>
  );
};

export const WithInitialDate: Story = {
  render: () => <WithInitialDateTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Use it to edit a moment that already exists, such as a saved deadline: the day chip and the time show it from the first render (`initialDate`). The English locale gives a 12-hour clock; click the time to see the AM/PM drop-down beside the editor.",
      },
      source: {
        code: `<DateTimePicker
  locale="en"
  openDate={now()}
  initialDate={now()}
  selectDateText="Select date"
  translations={{ AM: "AM", PM: "PM" }}
  onChange={(date) => console.log(date)}
/>`,
      },
    },
  },
};

const HiddenCrossTemplate = () => {
  return (
    <Wrapper>
      <DateTimePicker
        locale="en"
        maxDate={new Date(`${new Date().getFullYear() + 10}/01/01`)}
        minDate={new Date("1970/01/01")}
        openDate={now()}
        initialDate={now()}
        selectDateText="Select date"
        className="date-time-picker"
        id="hidden-cross-date-time-picker"
        hasError={false}
        hideCross
        onChange={(date) => console.log("Date changed:", date)}
        translations={{ AM: "AM", PM: "PM" }}
      />
    </Wrapper>
  );
};

export const HiddenCross: Story = {
  render: () => <HiddenCrossTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Use it for a field that must always hold a moment: the day chip has no cross, so the day can be changed in the calendar but never cleared (`hideCross`).",
      },
      source: {
        code: `<DateTimePicker
  locale="en"
  openDate={now()}
  initialDate={now()}
  selectDateText="Select date"
  translations={{ AM: "AM", PM: "PM" }}
  hideCross
  onChange={(date) => console.log(date)}
/>`,
      },
    },
  },
};

const TwentyFourHourClockTemplate = () => {
  return (
    <Wrapper>
      <DateTimePicker
        locale="de"
        maxDate={new Date(`${new Date().getFullYear() + 10}/01/01`)}
        minDate={new Date("1970/01/01")}
        openDate={now()}
        initialDate={now()}
        selectDateText="Select date"
        className="date-time-picker"
        id="twenty-four-hour-date-time-picker"
        hasError={false}
        onChange={(date) => console.log("Date changed:", date)}
        translations={{ AM: "AM", PM: "PM" }}
      />
    </Wrapper>
  );
};

export const TwentyFourHourClock: Story = {
  render: () => <TwentyFourHourClockTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          'Any locale that is not English switches the clock to 24 hours (`locale`): the time reads "14:30" rather than "02:30 PM", and the editor opened by a click on it has no AM/PM drop-down. The calendar is written in the same locale.',
      },
      source: {
        code: `<DateTimePicker
  locale="de"
  openDate={now()}
  initialDate={now()}
  selectDateText="Select date"
  translations={{ AM: "AM", PM: "PM" }}
  onChange={(date) => console.log(date)}
/>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          height: "500px",
          // DateTimePicker time cell
          "--date-time-picker-cell-bg": "#cce5f6",
          "--date-time-picker-icon": "#0082c9",
          "--date-time-picker-cell-height": "28px",
          "--date-time-picker-cell-radius": "6px",
          "--date-time-picker-cell-padding": "6px 12px",
          // TimePicker sub-component
          "--time-input-focus-border": "#0082c9",
          "--time-input-bg": "#e6f3fb",
          "--time-input-radius": "6px",
          // Calendar sub-component
          "--calendar-bg": "#e6f3fb",
          "--calendar-border": "#0082c9",
          "--calendar-title": "#0082c9",
          "--calendar-accent": "#0082c9",
          "--calendar-hover-bg": "#cce5f6",
        } as React.CSSProperties
      }
    >
      <DateTimePicker
        locale="en"
        maxDate={new Date(`${new Date().getFullYear() + 10}/01/01`)}
        minDate={new Date("1970/01/01")}
        openDate={now()}
        initialDate={now()}
        selectDateText="Select date"
        className="date-time-picker"
        id="css-customization-date-time-picker"
        hasError={false}
        onChange={() => {}}
        translations={{ AM: "AM", PM: "PM" }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
| --- | --- | --- |
| \`--date-time-picker-cell-bg\` | Background of the shown time | theme-based |
| \`--date-time-picker-icon\` | Colour of the clock icon before the time | theme-based |
| \`--date-time-picker-cell-height\` | Height of the shown time | \`32px\` |
| \`--date-time-picker-cell-radius\` | Corner radius of the shown time | \`3px\` |
| \`--date-time-picker-cell-padding\` | Padding inside the shown time | \`6px 8px\` |
| \`--time-input-focus-border\` | Border colour of the time editor, which opens focused after a click on the time | theme-based |
| \`--time-input-bg\` | Background of the time editor | theme-based |
| \`--time-input-radius\` | Corner radius of the time editor | \`3px\` |
| \`--calendar-bg\` | Background of the calendar, shown after a click on the day chip | theme-based |
| \`--calendar-border\` | Colour of the calendar's one-pixel border | theme-based |
| \`--calendar-title\` | Colour of the month and year title | theme-based |
| \`--calendar-accent\` | Fill of today, ring of the picked day and the title chevron | theme-based |
| \`--calendar-hover-bg\` | Background of a day under the pointer | theme-based |

One instance sets every variable on a wrapper. Click the time to see the time editor and the day chip to see the calendar; the day chip, the "select date" button and the AM/PM drop-down keep their own variables, listed in the SelectedItem, AddButton and ComboBox stories.`,
      },
      source: {
        code: `<div
  style={{
    "--date-time-picker-cell-bg": "#cce5f6",
    "--date-time-picker-icon": "#0082c9",
    "--date-time-picker-cell-height": "28px",
    "--date-time-picker-cell-radius": "6px",
    "--date-time-picker-cell-padding": "6px 12px",
    "--time-input-focus-border": "#0082c9",
    "--time-input-bg": "#e6f3fb",
    "--time-input-radius": "6px",
    "--calendar-bg": "#e6f3fb",
    "--calendar-border": "#0082c9",
    "--calendar-title": "#0082c9",
    "--calendar-accent": "#0082c9",
    "--calendar-hover-bg": "#cce5f6",
  }}
>
  <DateTimePicker
    locale="en"
    openDate={now()}
    initialDate={now()}
    selectDateText="Select date"
    translations={{ AM: "AM", PM: "PM" }}
    onChange={(date) => console.log(date)}
  />
</div>`,
      },
    },
  },
};
