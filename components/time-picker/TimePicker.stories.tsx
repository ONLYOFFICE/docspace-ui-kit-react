import type { CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import type { DateTime } from "luxon";
import { expect, fn, waitFor, within } from "storybook/test";

import { WhenVisible } from "../../.storybook/utils/WhenVisible";
import { createDateTime } from "../../utils/date";

import { TimePicker, type TimePickerProps } from ".";

const meta = {
  title: "UI/Form controls/TimePicker",
  component: TimePicker,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    initialTime: {
      control: false,
      description:
        "Time the fields start on, read once on mount; midnight today without it. Its day, seconds and time zone are carried into every value `onChange` reports.",
      table: {
        defaultValue: { summary: "00:00 of the current day" },
      },
    },
    hasError: {
      control: "boolean",
      description:
        "Whether the group is drawn in its error colours; they stay while a field is focused.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    tabIndex: {
      control: "number",
      description:
        "Position of both fields in the tab order. Left out, both take their natural place in it.",
    },
    focusOnRender: {
      control: "boolean",
      description: "Whether the hours field is selected on mount.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isTwelveHourFormat: {
      control: "boolean",
      description:
        "Whether hours run 1 to 12 rather than 0 to 23; requires `meridiem`.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    meridiem: {
      control: "text",
      description: "Ignored in the 24-hour mode.",
    },
    className: {
      control: "text",
      description: "Applied to the outermost element.",
    },
    classNameInput: {
      control: "text",
      description:
        "Prefix for the two fields' class names: they become `<classNameInput>-hours-input` and `-minutes-input`. Left out, the fields get no extra class.",
    },
    onChange: {
      action: "onChange",
      description:
        "Called on every accepted keystroke, and on a change of `meridiem`, with `initialTime` carrying the typed time.",
    },
    onBlur: {
      action: "onBlur",
      description:
        "Called when typing completes the minutes field, not when it loses focus. Two digits, one digit above 5, a third digit or a value above 59 complete it.",
    },
    ariaLabel: {
      control: "text",
      description:
        "Accessible name of the group that holds the two fields. Pass a translated string.",
      table: {
        defaultValue: { summary: '"Time picker"' },
      },
    },
    hoursLabel: {
      control: "text",
      description:
        "Accessible name of the hours field. Pass a translated string.",
      table: {
        defaultValue: { summary: '"Hours"' },
      },
    },
    minutesLabel: {
      control: "text",
      description:
        "Accessible name of the minutes field. Pass a translated string.",
      table: {
        defaultValue: { summary: '"Minutes"' },
      },
    },
    autoAdvance: {
      control: "boolean",
      description:
        "Whether typing moves the focus for you: a complete hour jumps to minutes, and a complete minute blurs the field and calls `onBlur`. Turn it off to keep the focus where the user put it; `onBlur` is then never called.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    forwardedRef: {
      control: false,
      description: "Ref to the outermost element.",
    },
    testId: {
      control: false,
      description: "`data-testid` of the outermost element.",
      table: {
        defaultValue: { summary: "time-picker" },
      },
    },
  },
  args: {
    onChange: fn(),
    onBlur: fn(),
  },
} satisfies Meta<typeof TimePicker>;

type Story = StoryObj<typeof meta>;

export default meta;

// The last time reported through onChange, as HH:mm.
const lastReported = (onChange: unknown) => {
  const calls = (onChange as ReturnType<typeof fn>).mock.calls;
  const time = calls[calls.length - 1]?.[0] as DateTime | undefined;
  return time?.toFormat("HH:mm");
};

type PlayContext = Parameters<NonNullable<Story["play"]>>[0];

// Typing over a field's whole value, as a user who selected it would.
const typeOver = (
  userEvent: PlayContext["userEvent"],
  input: HTMLElement,
  text: string,
) =>
  userEvent.type(input, text, {
    initialSelectionStart: 0,
    initialSelectionEnd: (input as HTMLInputElement).value.length,
  });

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
  play: async ({ args, canvas, userEvent }) => {
    const group = canvas.getByRole("group", { name: "Time picker" });
    const hours = within(group).getByLabelText("Hours");
    const minutes = within(group).getByLabelText("Minutes");
    // Plain text fields, not search fields.
    await expect(hours).toHaveAttribute("type", "text");
    await expect(minutes).toHaveAttribute("type", "text");
    await expect(hours).not.toHaveAttribute("aria-invalid");
    await expect(hours).toHaveValue("10");
    await expect(minutes).toHaveValue("30");

    // A first digit above 2 is padded and the caret jumps to minutes.
    await typeOver(userEvent, hours, "9");
    await expect(hours).toHaveValue("09");
    await expect(minutes).toHaveFocus();
    await expect(lastReported(args.onChange)).toBe("09:30");

    // Two minute digits complete the time and call onBlur.
    await typeOver(userEvent, minutes, "45");
    await expect(minutes).toHaveValue("45");
    await expect(lastReported(args.onChange)).toBe("09:45");
    await expect(args.onBlur).toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A 24-hour picker preset to 10:30 (`initialTime`). A typed `9` in the hours becomes `09`, and the caret moves on to minutes.",
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
  name: "Error",
  render: (args) => <WrappedTemplate {...args} />,
  args: {
    initialTime: createDateTime(2025, 1, 27, 10, 30, 0),
    hasError: true,
  },
  play: async ({ canvas }) => {
    const group = canvas.getByTestId("time-picker");
    await expect(group.className).toMatch(/hasError/);
    // The error reaches assistive technology, not only the border colour.
    await expect(within(group).getByLabelText("Hours")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(within(group).getByLabelText("Minutes")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    // The fields stay editable.
    await expect(within(group).getByLabelText("Hours")).toBeEnabled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A red border that flags a time the form rejected (`hasError`). Both fields are marked `aria-invalid` and stay editable.",
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
  name: "12-hour format",
  render: (args) => <TwelveHourFormatTemplate onChange={args.onChange} />,
  play: async ({ args, canvas, userEvent }) => {
    const [am, pm] = canvas.getAllByRole("group", { name: "Time picker" });
    // 14:30 shows as 02 on a 12-hour clock.
    await expect(within(am).getByLabelText("Hours")).toHaveValue("10");
    await expect(within(pm).getByLabelText("Hours")).toHaveValue("02");

    // The same digits report a morning or an afternoon time, by meridiem.
    await typeOver(userEvent, within(pm).getByLabelText("Hours"), "3");
    await expect(lastReported(args.onChange)).toBe("15:30");
    await typeOver(userEvent, within(am).getByLabelText("Hours"), "3");
    await expect(lastReported(args.onChange)).toBe("03:30");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Two 12-hour pickers (`isTwelveHourFormat`); nothing on screen tells AM from PM. The `meridiem` behind each decides the value: the second, showing 02:30, reports 14:30.",
      },
      source: {
        code: `<TimePicker initialTime={time} isTwelveHourFormat meridiem="AM" onChange={(time) => console.log(time)} />
<TimePicker initialTime={time} isTwelveHourFormat meridiem="PM" onChange={(time) => console.log(time)} />`,
      },
    },
  },
};

export const FocusOnRender: Story = {
  name: "Focused on mount",
  // Mounted once on screen: a hidden field cannot take the focus.
  render: (args) => (
    <WhenVisible>
      <WrappedTemplate {...args} />
    </WhenVisible>
  ),
  args: {
    initialTime: createDateTime(2025, 1, 27, 10, 30, 0),
    focusOnRender: true,
  },
  play: async ({ canvas, userEvent }) => {
    // The hours field takes the digits without a click.
    const hours = await canvas.findByLabelText("Hours");
    await waitFor(() => expect(hours).toHaveFocus());
    await userEvent.keyboard("14");
    await expect(hours).toHaveValue("14");
    await expect(canvas.getByLabelText("Minutes")).toHaveFocus();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A picker that opens with the hours field selected (`focusOnRender`), so it takes digits without a click.",
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
          onChange={fn()}
        />
        <TimePicker
          initialTime={createDateTime(2025, 1, 27, 10, 30, 0)}
          hasError
          onChange={fn()}
        />
      </div>
    </div>
  );
};

export const CssCustomization: Story = {
  name: "CSS variables",
  render: () => <CssCustomizationTemplate />,
  play: async ({ canvas }) => {
    const [plain, error] = canvas.getAllByTestId("time-picker");
    await expect(getComputedStyle(plain).borderTopColor).toBe(
      "rgb(0, 130, 201)",
    );
    await expect(getComputedStyle(plain).width).toBe("68px");
    await expect(getComputedStyle(error).borderTopColor).toBe(
      "rgb(192, 57, 43)",
    );
  },
  parameters: {
    docs: {
      description: {
        story: `Two pickers under a wrapper that sets the TimePicker and inner TextInput variables. The second adds \`hasError\`, the only state that shows \`--time-input-error-border\`.`,
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
