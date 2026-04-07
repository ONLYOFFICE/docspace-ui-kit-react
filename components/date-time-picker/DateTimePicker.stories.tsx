// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

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
  title: "UI/Interactive elements/DateTimePicker",
  component: DateTimePicker,
  parameters: {
    docs: {
      description: {
        component: `Combined date and time input component that allows users to select both date and time values.

### Features

- **Calendar Date Selection**: Integrated calendar for picking dates
- **Time Input**: Built-in time picker with validation
- **Locale Support**: Supports 25+ locales for date/time formatting
- **Date Range Constraints**: Configurable min/max date boundaries
- **Error State**: Visual error indicator for validation
- **AM/PM Support**: Configurable 12-hour time format translations

### Usage

\`\`\`tsx
import { DateTimePicker } from "@docspace/ui-kit/components/date-time-picker";

// Basic usage
<DateTimePicker
  locale="en"
  openDate={new Date()}
  selectDateText="Select date"
  onChange={(date) => console.log(date)}
/>

// With date constraints
<DateTimePicker
  locale="en"
  openDate={new Date()}
  minDate={new Date("2024/01/01")}
  maxDate={new Date("2030/01/01")}
  selectDateText="Select date"
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
        "Locale for date and time formatting (affects calendar and time display)",
      table: {
        defaultValue: { summary: "en" },
      },
    },
    hasError: {
      control: "boolean",
      description: "Indicates if the picker is in an error state",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    minDate: {
      control: "date",
      description: "Minimum selectable date and time",
    },
    maxDate: {
      control: "date",
      description: "Maximum selectable date and time",
    },
    initialDate: {
      control: "date",
      description: "Initial selected date and time value",
    },
    openDate: {
      control: "date",
      description: "Date to display when the calendar initially opens",
    },
    selectDateText: {
      control: "text",
      description: "Placeholder text shown before a date is selected",
    },
    className: {
      control: "text",
      description: "Additional CSS class for the date-time picker container",
    },
    hideCross: {
      control: "boolean",
      description: "Hides the clear (cross) button",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onChange: {
      action: "onChange",
      description:
        "Callback function called when the selected date/time changes",
    },
  },
} satisfies Meta<typeof DateTimePicker>;

type Story = StoryObj<ComponentProps<typeof DateTimePicker>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return <div style={{ height: "500px" }}>{props.children}</div>;
};

export const Default: Story = {
  render: (args) => (
    <Wrapper>
      <DateTimePicker {...args} />
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
    onChange: (date: null | DateTime) =>
      console.log("Date changed:", date),
    translations: { AM: "AM", PM: "PM" },
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
          "DateTimePicker in an error state. The input field displays a visual error indicator.",
      },
      source: {
        code: `<DateTimePicker
  locale="en"
  openDate={now()}
  selectDateText="Select date"
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
          "DateTimePicker with an initial date pre-selected. The picker opens with the date already filled in.",
      },
      source: {
        code: `<DateTimePicker
  locale="en"
  openDate={now()}
  initialDate={now()}
  selectDateText="Select date"
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
          "DateTimePicker with the clear (cross) button hidden. Users cannot clear the selected date.",
      },
      source: {
        code: `<DateTimePicker
  locale="en"
  openDate={now()}
  initialDate={now()}
  selectDateText="Select date"
  hideCross
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
          "--date-time-picker-cell-radius": "6px",
          "--date-time-picker-cell-padding": "6px 12px",
          // DatePicker sub-component
          "--date-picker-bg": "#e6f3fb",
          "--date-picker-header-border": "1px solid #0082c9",
          // AddButton sub-component
          "--add-button-background": "#e6f3fb",
          "--add-button-icon": "#0082c9",
          // SelectedItem sub-component
          "--selected-item-background": "#cce5f6",
          "--selected-item-background-hover": "#b3d9f0",
          "--selected-item-active-background": "#0082c9",
          "--selected-item-active-color": "#ffffff",
          // TimePicker sub-component
          "--time-input-border": "1px solid #0082c9",
          "--time-input-bg": "#e6f3fb",
          "--time-input-radius": "6px",
          // Calendar sub-component
          "--calendar-bg": "#e6f3fb",
          "--calendar-border": "#0082c9",
          "--calendar-title": "#0082c9",
          "--calendar-accent": "#0082c9",
          "--calendar-hover-bg": "#cce5f6",
          // ComboBox sub-component (AM/PM selector)
          "--combobox-background": "#e6f3fb",
          // IconButton (in SelectedItem close button)
          "--icon-button-color": "#0082c9",
          "--icon-button-hover-color": "#006fa6",
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
        onChange={() => {}}
        translations={{ AM: "AM", PM: "PM" }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "CSS custom property overrides for the date-time picker and its DatePicker, TimePicker, Calendar, AddButton, SelectedItem, and ComboBox sub-components.",
      },
    },
  },
};
