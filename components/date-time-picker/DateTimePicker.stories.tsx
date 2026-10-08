import React from "react";
import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateTime } from "luxon";
import { expect, fn, screen, waitFor, within } from "storybook/test";

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
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
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

type PlayContext = Parameters<NonNullable<Story["play"]>>[0];

// The time shown beside a picked day: hh:mm AM/PM on a 12-hour clock.
const TWELVE_HOUR = /^\d{2}:\d{2} (AM|PM)$/;
const TWENTY_FOUR_HOUR = /^\d{2}:\d{2}$/;

// Opens the time editor from the time display.
const openTimeEditor = async ({ canvas, userEvent }: PlayContext) => {
  await userEvent.click(canvas.getByTestId("date-time-picker-time-display"));
  await waitFor(() =>
    expect(canvas.getByLabelText("Time picker")).toBeInTheDocument(),
  );
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
    onChange: fn(),
  },
  play: async (context) => {
    const { args, canvas, userEvent } = context;
    // Nothing chosen: only the "Select date" button, and no time. The
    // AddButton drawn inside it is hidden, so there is one button by that name.
    const select = canvas.getByTestId("date-selector");
    await expect(
      canvas.getAllByRole("button", { name: "Select date" }),
    ).toEqual([select]);
    await expect(select).toHaveAttribute("aria-expanded", "false");
    await expect(
      canvas.queryByTestId("date-time-picker-time-display"),
    ).toBeNull();

    await userEvent.click(select);
    await expect(select).toHaveAttribute("aria-expanded", "true");
    const calendar = await canvas.findByTestId("calendar");
    // Days are named by their full date; the 15th of the shown month.
    const fifteenth = now()
      .set({ day: 15 })
      .setLocale("en")
      .toLocaleString(DateTime.DATE_FULL);
    await userEvent.click(
      within(calendar).getByRole("button", { name: fifteenth }),
    );

    // The day is reported with a time, and the time appears beside it.
    await waitFor(() => expect(args.onChange).toHaveBeenCalled());
    const picked = (args.onChange as ReturnType<typeof fn>).mock
      .lastCall?.[0] as DateTime;
    await expect(picked.day).toBe(15);
    await expect(
      canvas.getByTestId("date-time-picker-time-display"),
    ).toHaveTextContent(TWELVE_HOUR);

    // The time display opens the editor from the keyboard too.
    const display = canvas.getByTestId("date-time-picker-time-display");
    display.focus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() =>
      expect(canvas.getByLabelText("Time picker")).toBeInTheDocument(),
    );

    // The English clock has an AM/PM drop-down in the editor.
    await expect(canvas.getByRole("button", { name: /AM|PM/ })).toBeVisible();
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
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId("date-time-picker")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(
      canvas.getByTestId("date-time-picker-time-display"),
    ).toBeVisible();
  },
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
  play: async (context) => {
    const { canvas } = context;
    // initialDate shows the day chip and the time from the first render.
    await expect(canvas.getByTestId("selected-item")).toBeVisible();
    const time = canvas.getByTestId("date-time-picker-time-display");
    await expect(time).toHaveTextContent(TWELVE_HOUR);
    // The spoken time is the time shown, on the same 12-hour clock.
    await expect(time).toHaveAttribute(
      "aria-label",
      `Current time: ${time.textContent}`,
    );

    await openTimeEditor(context);
    await expect(canvas.getByRole("button", { name: /AM|PM/ })).toBeVisible();

    // The drop-down sets the half of the day rather than toggling it:
    // choosing the half already shown leaves the time and the day alone,
    // and the other half moves the time by twelve hours within the same day.
    const { userEvent } = context;
    const shown = time.textContent ?? "";
    const day = canvas.getByTestId("selected-item").textContent;
    const half = shown.endsWith("PM") ? "PM" : "AM";
    const other = half === "PM" ? "AM" : "PM";
    const choose = async (meridiem: string) => {
      await userEvent.click(canvas.getByRole("button", { name: /AM|PM/ }));
      await userEvent.click(
        await screen.findByRole("option", { name: meridiem }),
      );
    };
    const closeEditor = async () => {
      await userEvent.keyboard("{Enter}");
      await waitFor(() =>
        expect(
          canvas.getByTestId("date-time-picker-time-display"),
        ).toBeInTheDocument(),
      );
    };

    await choose(half);
    await closeEditor();
    await expect(
      canvas.getByTestId("date-time-picker-time-display"),
    ).toHaveTextContent(shown);
    await expect(canvas.getByTestId("selected-item")).toHaveTextContent(
      day ?? "",
    );

    await openTimeEditor(context);
    await choose(other);
    await closeEditor();
    await expect(
      canvas.getByTestId("date-time-picker-time-display"),
    ).toHaveTextContent(shown.replace(half, other));
    await expect(canvas.getByTestId("selected-item")).toHaveTextContent(
      day ?? "",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use it to edit a moment that already exists, such as a saved deadline: the day chip and the time show it from the first render (`initialDate`). The English locale gives a 12-hour clock; click the time to see the AM/PM drop-down beside the editor. Choosing AM or PM sets that half of the day: the half already shown changes nothing, and the day never moves.",
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
  play: async ({ canvas }) => {
    // The day chip has no cross, so the day cannot be cleared.
    const chip = canvas.getByTestId("selected-item");
    await expect(within(chip).queryByTestId("icon-button")).toBeNull();
  },
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
  play: async (context) => {
    const { canvas } = context;
    // A non-English locale gives a 24-hour clock with no AM/PM control.
    await expect(
      canvas.getByTestId("date-time-picker-time-display"),
    ).toHaveTextContent(TWENTY_FOUR_HOUR);
    await openTimeEditor(context);
    await expect(canvas.queryByRole("button", { name: /AM|PM/ })).toBeNull();
  },
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
        onChange={fn()}
        translations={{ AM: "AM", PM: "PM" }}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const time = canvas.getByTestId("date-time-picker-time-display");
    await expect(getComputedStyle(time).backgroundColor).toBe(
      "rgb(204, 229, 246)",
    );
  },
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page. Click the time to see the time editor and the day chip to see the calendar; the day chip, the "select date" button and the AM/PM drop-down keep their own variables, listed in the SelectedItem, AddButton and ComboBox stories.`,
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
