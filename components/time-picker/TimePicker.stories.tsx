/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import type { DateTime } from "luxon";

import { createDateTime, formatDate } from "../../utils/date";

import { TimePicker } from ".";

const meta = {
  title: "UI/Interactive elements/TimePicker",
  component: TimePicker,
  parameters: {
    docs: {
      description: {
        component: `Time input component that allows users to select or input time values.

### Features

- **Keyboard Input**: Users can type time values directly
- **HH:mm Format**: Supports standard 24-hour time format
- **12-Hour Format**: Optional AM/PM mode with meridiem indicator
- **Error State**: Visual error indicator for validation
- **Auto Focus**: Option to focus the input on render
- **Tab Navigation**: Configurable tab index for keyboard navigation

### Usage

\`\`\`tsx
import { TimePicker } from "@docspace/ui-kit/components/time-picker";

// Basic usage
<TimePicker
  initialTime={new Date()}
  onChange={(time) => console.log(time)}
/>

// With error state
<TimePicker initialTime={new Date()} hasError onChange={(time) => console.log(time)} />

// 12-hour format
<TimePicker initialTime={new Date()} isTwelveHourFormat meridiem="AM" />
\`\`\``,
      },
    },
  },
  argTypes: {
    initialTime: {
      control: "date",
      description: "Initial time value in the picker",
    },
    hasError: {
      control: "boolean",
      description: "Indicates if the picker is in an error state",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    tabIndex: {
      control: "number",
      description: "Tab index for keyboard navigation",
      table: {
        defaultValue: { summary: "0" },
      },
    },
    focusOnRender: {
      control: "boolean",
      description:
        "Whether to automatically focus the input when the component renders",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isTwelveHourFormat: {
      control: "boolean",
      description:
        "Whether to use 12-hour time format (with AM/PM) instead of 24-hour format",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    meridiem: {
      control: "text",
      description: "The meridiem indicator (AM/PM) for 12-hour format",
    },
    className: {
      control: "text",
      description: "Additional CSS class for the time picker container",
    },
    classNameInput: {
      control: "text",
      description: "Additional CSS class for the time picker input element",
    },
    onChange: {
      action: "onChange",
      description: "Callback function called when the time changes",
    },
  },
} satisfies Meta<typeof TimePicker>;

type Story = StoryObj<ComponentProps<typeof TimePicker>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gridGap: "16px",
        alignItems: "center",
      }}
    >
      {props.children}
    </div>
  );
};

const CssCustomizationTemplate = () => {
  return (
    <div
      style={
        {
          // === TimePicker — input box ===
          "--time-input-border": "#0082c9",
          "--time-input-bg": "#f0f8ff",
          "--time-input-focus-border": "#004f82",
          "--time-input-error-border": "#c0392b",
          "--time-input-radius": "8px",
          "--time-input-height": "36px",
          "--time-input-width": "68px",
          "--time-input-padding": "0px 10px",
          // === TextInput (inner number inputs) ===
          "--text-input-color": "#004f82",
          "--text-input-bg": "#f0f8ff",
        } as CSSProperties
      }
    >
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <TimePicker
          initialTime={createDateTime(2025, 1, 27, 10, 30, 0)}
          onChange={() => {}}
        />
        <TimePicker
          initialTime={createDateTime(2025, 1, 27, 10, 30, 0)}
          hasError
          onChange={() => {}}
        />
        <TimePicker
          initialTime={createDateTime(2025, 1, 27, 14, 45, 0)}
          isTwelveHourFormat
          meridiem="PM"
          onChange={() => {}}
        />
      </div>
    </div>
  );
};

export const CssCustomization: Story = {
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

**TimePicker — input box**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--time-input-border\` | Default border color | theme-based |
| \`--time-input-bg\` | Background color | theme-based |
| \`--time-input-focus-border\` | Focus/active border color | theme-based |
| \`--time-input-error-border\` | Error state border color | theme-based |
| \`--time-input-width\` | Input box width | \`60px\` |
| \`--time-input-height\` | Input box height | \`32px\` |
| \`--time-input-radius\` | Border radius | \`3px\` |
| \`--time-input-padding\` | Inline padding | \`0px 6px\` |

**TextInput (inner number inputs)**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--text-input-color\` | Text color | theme-based |
| \`--text-input-bg\` | Background color | theme-based |`,
      },
    },
  },
};

export const Default: Story = {
  render: (args) => <TimePicker {...args} />,
  args: {
    initialTime: createDateTime(2025, 1, 27, 10, 30, 0),
    hasError: false,
    onChange: (time: DateTime) =>
      console.log("Time changed:", formatDate(time, "HH:mm")),
    tabIndex: 0,
    focusOnRender: false,
  },
};

const WithErrorTemplate = () => {
  return (
    <Wrapper>
      <TimePicker
        initialTime={createDateTime(2025, 1, 27, 10, 30, 0)}
        hasError
        onChange={(time) =>
          console.log("Time changed:", formatDate(time, "HH:mm"))
        }
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
          "TimePicker in an error state. The input field displays a visual error indicator for validation feedback.",
      },
      source: {
        code: `<TimePicker initialTime={createDateTime(2025, 1, 27, 10, 30, 0)} hasError onChange={(time) => console.log(time)} />`,
      },
    },
  },
};

const TwelveHourFormatTemplate = () => {
  return (
    <Wrapper>
      <TimePicker
        initialTime={createDateTime(2025, 1, 27, 10, 30, 0)}
        isTwelveHourFormat
        meridiem="AM"
        onChange={(time) =>
          console.log("Time changed:", formatDate(time, "hh:mm a"))
        }
      />
      <TimePicker
        initialTime={createDateTime(2025, 1, 27, 14, 30, 0)}
        isTwelveHourFormat
        meridiem="PM"
        onChange={(time) =>
          console.log("Time changed:", formatDate(time, "hh:mm a"))
        }
      />
    </Wrapper>
  );
};

export const TwelveHourFormat: Story = {
  render: () => <TwelveHourFormatTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "TimePicker in 12-hour format with AM/PM meridiem indicator. Shows both AM and PM examples.",
      },
      source: {
        code: `<TimePicker initialTime={time} isTwelveHourFormat meridiem="AM" onChange={(time) => console.log(time)} />
<TimePicker initialTime={time} isTwelveHourFormat meridiem="PM" onChange={(time) => console.log(time)} />`,
      },
    },
  },
};

const FocusOnRenderTemplate = () => {
  return (
    <Wrapper>
      <TimePicker
        initialTime={createDateTime(2025, 1, 27, 10, 30, 0)}
        focusOnRender
        onChange={(time) =>
          console.log("Time changed:", formatDate(time, "HH:mm"))
        }
      />
    </Wrapper>
  );
};

export const FocusOnRender: Story = {
  render: () => <FocusOnRenderTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "TimePicker that automatically focuses the input when the component renders. Useful for forms where the time input should receive immediate focus.",
      },
      source: {
        code: `<TimePicker initialTime={time} focusOnRender onChange={(time) => console.log(time)} />`,
      },
    },
  },
};

