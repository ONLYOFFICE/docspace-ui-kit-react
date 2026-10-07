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
  play: async ({ canvas }) => {
    const group = canvas.getByTestId("time-picker");
    await expect(group.className).toMatch(/hasError/);
    // The fields stay editable.
    await expect(within(group).getByLabelText("Hours")).toBeEnabled();
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
        story: `The TimePicker and inner TextInput variables set on one wrapper -- the variables are listed under CSS variables on this page. The first box shows the border, background, size and radius variables and the inner fields' text colour; click into it to see \`--time-input-focus-border\`. The second adds \`hasError\`, the only state in which \`--time-input-error-border\` has anything to colour. \`--text-input-bg\` is set to the same value as \`--time-input-bg\` so the fields blend into the box.`,
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
