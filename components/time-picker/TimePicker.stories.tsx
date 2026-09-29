import type { CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { createDateTime } from "../../utils/date";

import { TimePicker, type TimePickerProps } from ".";

const meta = {
  title: "UI/Form controls/TimePicker",
  component: TimePicker,
  parameters: {
    docs: {
      description: {
        component: `Two-field hours-and-minutes input for typing a time of day, reported to \`onChange\` as a Luxon \`DateTime\`.

### Features

- **Keyboard Input**: Takes the time as digits typed into separate hours and minutes fields, with no list or clock face to pick from
- **HH:mm Format**: Two zero-padded fields separated by a colon, always read left to right, even inside a right-to-left layout
- **12-Hour Format**: Caps the hours field at 12 and folds the required \`meridiem\` into the value reported to \`onChange\`; nothing marks AM or PM on screen
- **Error State**: Draws the border in the error colour for a time the form rejected and keeps it while a field is focused
- **Auto Focus**: Selects the hours field on mount, so the first digit typed replaces it
- **Tab Navigation**: Hours and minutes are two Tab stops of their own; \`tabIndex\` moves both in the order
- **Auto-advance**: Two digits in the hours field, or one digit that cannot start a valid hour, move the caret to minutes; two digits in minutes leave the picker and call \`onBlur\`
- **Range guard**: Accepts digits only, caps hours at 23 (12 in the 12-hour mode) and minutes at 59, and pads a single digit with a leading zero on blur

### Accessibility

The two fields are native \`<input>\`s, so typing and screen-reader announcement come from the platform; the component adds:

- \`role="group"\` with \`aria-label="Time picker"\` on the box, \`aria-label="Hours"\` and \`"Minutes"\` on the fields
- \`inputMode="numeric"\` brings up the number keypad on touch devices
- Hours and minutes are two Tab stops of their own, and two digits typed in hours move on to minutes as well; \`tabIndex\` moves both fields in the order

### Usage

\`\`\`tsx
import { TimePicker } from "@onlyoffice/apps-ui-kit/components/time-picker";

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
      control: false,
      description:
        "Time shown when the picker mounts, as an ISO string, a `Date` or a Luxon `DateTime`; read once, later changes are ignored; defaults to 00:00 of the current day",
      table: {
        defaultValue: { summary: "00:00 of the current day" },
      },
    },
    hasError: {
      control: "boolean",
      description:
        "Whether the border is drawn in the error colour; it stays while a field is focused",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    tabIndex: {
      control: "number",
      description:
        "Position of both fields in the Tab order; left out, they take their natural place in it",
    },
    focusOnRender: {
      control: "boolean",
      description:
        "Whether the hours field is focused, with its text selected, when the picker mounts",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isTwelveHourFormat: {
      control: "boolean",
      description:
        "Caps the hours field at 12 instead of 23; `meridiem` is required with it and decides the half of the day",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    meridiem: {
      control: "text",
      description:
        '"AM" or "PM", required with `isTwelveHourFormat`: combined with the typed hours to compute the time passed to `onChange`; never displayed',
    },
    className: {
      control: "text",
      description: "Additional CSS class for the time picker container",
    },
    classNameInput: {
      control: "text",
      description:
        "Prefix for the two inner fields' class names: they become `<prefix>-hours-input` and `<prefix>-minutes-input`",
    },
    onChange: {
      action: "onChange",
      description:
        "Called on every accepted keystroke with a full `DateTime`: the date from `initialTime` combined with the typed time",
    },
    onBlur: {
      action: "onBlur",
      description:
        "Called when typing completes the minutes field: after two digits, a single digit above 5, a third digit or a value above 59; leaving the field with the mouse or Tab does not call it",
    },
    forwardedRef: {
      control: false,
      description: "Ref to the outer box, a <div>",
    },
    testId: {
      control: false,
      description: "data-testid on the outer box",
      table: {
        defaultValue: { summary: "time-picker" },
      },
    },
  },
} satisfies Meta<typeof TimePicker>;

type Story = StoryObj<typeof meta>;

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

export const Default: Story = {
  render: (args) => <TimePicker {...args} />,
  args: {
    initialTime: createDateTime(2025, 1, 27, 10, 30, 0),
    hasError: false,
    focusOnRender: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A 24-hour picker preset to 10:30 (`initialTime`); type `9` in the hours field and watch it become `09` and jump to minutes; change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<TimePicker
  initialTime={createDateTime(2025, 1, 27, 10, 30, 0)}
  onChange={(time) => console.log(time)}
/>`,
      },
    },
  },
};

const WrappedTemplate = (args: Story["args"]) => (
  <Wrapper>
    <TimePicker {...(args as TimePickerProps)} />
  </Wrapper>
);

export const WithError: Story = {
  render: (args) => <WrappedTemplate {...args} />,
  args: {
    initialTime: createDateTime(2025, 1, 27, 10, 30, 0),
    hasError: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The border turns red to flag a time the form rejected (`hasError`); the fields stay editable so it can be corrected in place.",
      },
      source: {
        code: `<TimePicker initialTime={createDateTime(2025, 1, 27, 10, 30, 0)} hasError onChange={(time) => console.log(time)} />`,
      },
    },
  },
};

const TwelveHourFormatTemplate = ({
  onChange,
}: Pick<TimePickerProps, "onChange">) => {
  return (
    <Wrapper>
      <TimePicker
        initialTime={createDateTime(2025, 1, 27, 10, 30, 0)}
        isTwelveHourFormat
        meridiem="AM"
        onChange={onChange}
      />
      <TimePicker
        initialTime={createDateTime(2025, 1, 27, 14, 30, 0)}
        isTwelveHourFormat
        meridiem="PM"
        onChange={onChange}
      />
    </Wrapper>
  );
};

export const TwelveHourFormat: Story = {
  render: (args) => <TwelveHourFormatTemplate onChange={args.onChange} />,
  parameters: {
    docs: {
      description: {
        story:
          "Hours stop at 12 (`isTwelveHourFormat`); nothing on screen tells AM from PM, only the `meridiem` behind each box decides what `onChange` receives: the first reports 10:30, the second, showing 02:30, reports 14:30.",
      },
      source: {
        code: `<TimePicker initialTime={time} isTwelveHourFormat meridiem="AM" onChange={(time) => console.log(time)} />
<TimePicker initialTime={time} isTwelveHourFormat meridiem="PM" onChange={(time) => console.log(time)} />`,
      },
    },
  },
};

export const FocusOnRender: Story = {
  render: (args) => <WrappedTemplate {...args} />,
  args: {
    initialTime: createDateTime(2025, 1, 27, 10, 30, 0),
    focusOnRender: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The picker opens with the hours field selected (`focusOnRender`), so a form that asks for a time first takes the digits without a click; type `14` and the caret moves on to minutes.",
      },
      source: {
        code: `<TimePicker initialTime={time} focusOnRender onChange={(time) => console.log(time)} />`,
      },
    },
  },
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
| \`--time-input-error-border\` | Border color with \`hasError\`, kept while the field is focused | theme-based |
| \`--time-input-width\` | Input box width | \`60px\` |
| \`--time-input-height\` | Input box height | \`32px\` |
| \`--time-input-radius\` | Border radius | \`3px\` |
| \`--time-input-padding\` | Padding inside the box, shorthand: top and bottom, then sides | \`0px 6px\` |

**TextInput (inner number inputs)**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--text-input-color\` | Text color | theme-based |
| \`--text-input-bg\` | Background color | theme-based |

The first box shows the border, background, size and radius variables and the inner fields' text colour; click into it to see \`--time-input-focus-border\`. The second adds \`hasError\`, the only state in which \`--time-input-error-border\` has anything to colour. \`--text-input-bg\` is set to the same value as \`--time-input-bg\` so the fields blend into the box.`,
      },
      source: {
        code: `<div
  style={{
    "--time-input-border": "#0082c9",
    "--time-input-bg": "#f0f8ff",
    "--time-input-focus-border": "#004f82",
    "--time-input-error-border": "#c0392b",
    "--time-input-radius": "8px",
    "--time-input-height": "36px",
    "--time-input-width": "68px",
    "--time-input-padding": "0px 10px",
    "--text-input-color": "#004f82",
    "--text-input-bg": "#f0f8ff",
  }}
>
  <TimePicker initialTime={time} />
  <TimePicker initialTime={time} hasError />
</div>`,
      },
    },
  },
};
