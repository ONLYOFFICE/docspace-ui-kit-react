import type { CSSProperties, ComponentProps } from "react";
import { useEffect, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { ToggleButton } from ".";

import type { ToggleButtonProps } from "./ToggleButton.types";

const meta = {
  title: "UI/Form controls/ToggleButton",
  component: ToggleButton,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    isChecked: {
      control: "boolean",
      description:
        "Whether the switch is on. It is fully controlled: without `onChange` the switch shows `isChecked` and never moves on its own.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDisabled: {
      control: "boolean",
      description:
        "Disables the underlying input and stops pointer events on the whole control, and dims the switch and the label.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isLoading: {
      control: "boolean",
      description:
        "Pulses the knob to show work in progress. It does **not** disable the control — a click during it still reaches `onChange`.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    label: {
      control: "text",
      description:
        "Text rendered beside the switch, in a `Text` span. Omit it and the component is the 28×16 switch alone.",
    },
    noAnimation: {
      control: "boolean",
      description:
        "Runs the state transitions with a duration of zero instead of animating them. The animation is otherwise always on.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    fontSize: {
      control: "text",
      description: "Font size of the label text, such as `15px`",
    },
    fontWeight: {
      control: "text",
      description: "Font weight of the label text, such as `600`",
    },
    onChange: {
      action: "onChange",
      description:
        "Called with the checkbox's change event; the new state is `event.target.checked`. Required in practice, since `isChecked` makes the input controlled.",
    },
    name: {
      control: "text",
      description:
        "Name of the hidden checkbox input, for a form that reads the control by name rather than by state.",
    },
    id: {
      control: "text",
      description:
        "Applied to the outer element **and** to the inner `<label>`, so it appears twice in the document.",
    },
    inputId: {
      control: "text",
      description:
        "Id of the hidden checkbox input, for a `<label htmlFor>` caption laid out apart from the switch",
    },
    className: {
      control: "text",
      description:
        "Applied to the outer element **and** to the inner `<label>`.",
    },
    style: {
      control: "object",
      description:
        "Applied to the outer element **and** to the inner `<label>`, so a margin or a padding set here takes effect at both levels.",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the outer element.",
      table: {
        defaultValue: { summary: "toggle-button" },
      },
    },
    dataTooltipId: {
      control: "text",
      description:
        "Value of `data-tooltip-id` on the outer element, which is how a `Tooltip` elsewhere in the tree anchors itself to this control.",
    },
  },
} satisfies Meta<typeof ToggleButton>;

type Story = StoryObj<ComponentProps<typeof ToggleButton>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gridGap: "16px",
        alignItems: "center",
      }}
    >
      {props.children}
    </div>
  );
};

// The switch is an SVG beside its label: the track (rect) and the knob
// (circle).
const switchOf = (
  canvas: { getAllByText: (text: string) => HTMLElement[] },
  label: string,
  index = 0,
) =>
  canvas
    .getAllByText(label)
    [index].closest("label")
    ?.querySelector("svg") as SVGSVGElement;

const frame = () => new Promise((resolve) => requestAnimationFrame(resolve));

const Template = ({ isChecked, onChange, ...args }: ToggleButtonProps) => {
  const [checked, setChecked] = useState(isChecked);

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
    onChange?.(e);
  };

  return <ToggleButton {...args} isChecked={checked} onChange={handleChange} />;
};

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    label: "Toggle me",
    isChecked: false,
    onChange: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const toggle = canvas.getByRole("checkbox", { name: "Toggle me" });

    // The visually hidden input is the tab stop; Space toggles it natively.
    await userEvent.tab();
    await expect(toggle).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(toggle).toBeChecked();

    await userEvent.click(canvas.getByText("Toggle me"));
    await expect(toggle).not.toBeChecked();
    await userEvent.click(canvas.getByText("Toggle me"));
    await expect(toggle).toBeChecked();
    await expect(args.onChange).toHaveBeenCalledTimes(3);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A single switch with a label, for one setting that takes effect at once.",
      },
      source: {
        code: `<ToggleButton label="Toggle me" isChecked={isOn} onChange={handleChange} />`,
      },
    },
  },
};

const ExternalCaptionTemplate = (args: ToggleButtonProps) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
    <label htmlFor="daily-feed-toggle" style={{ cursor: "pointer" }}>
      Daily feed
    </label>
    <div style={{ height: 16, width: 28 }}>
      <Template {...args} inputId="daily-feed-toggle" />
    </div>
  </div>
);

export const ExternalCaption: Story = {
  render: (args) => <ExternalCaptionTemplate {...args} />,
  args: {
    isChecked: false,
    onChange: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const toggle = canvas.getByRole("checkbox", { name: "Daily feed" });

    await userEvent.click(canvas.getByText("Daily feed"));
    await expect(toggle).toBeChecked();
    await expect(args.onChange).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A caption laid out apart from the switch, tied to it with `inputId` and a `<label htmlFor>`: clicking the caption toggles the switch, and the caption is the switch's accessible name.",
      },
      source: {
        code: `<label htmlFor="daily-feed-toggle">Daily feed</label>
<ToggleButton inputId="daily-feed-toggle" isChecked={isOn} onChange={handleChange} />`,
      },
    },
  },
};

const StatesTemplate = () => {
  return (
    <Wrapper>
      <Template label="Unchecked" />
      <Template label="Checked" isChecked />
      <Template />
    </Wrapper>
  );
};

export const CheckedStates: Story = {
  name: "Off and on",
  render: () => <StatesTemplate />,
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("checkbox", { name: "Checked" }),
    ).toBeChecked();
    await expect(
      canvas.getByRole("checkbox", { name: "Unchecked" }),
    ).not.toBeChecked();
  },
  parameters: {
    docs: {
      description: {
        story: `The two positions side by side, so the track colours can be compared; each switch here can be clicked.

- **Unchecked** — grey track, knob at the start
- **Checked** — accent-coloured track, knob at the end (\`isChecked\`)
- The third switch has no \`label\` and takes only the width of the track`,
      },
      source: {
        code: `<ToggleButton label="Unchecked" isChecked={false} onChange={handleChange} />
<ToggleButton label="Checked" isChecked onChange={handleChange} />
<ToggleButton isChecked={false} onChange={handleChange} />`,
      },
    },
  },
};

const DisabledTemplate = () => {
  return (
    <Wrapper>
      <Template label="Disabled off" isDisabled />
      <Template label="Disabled on" isDisabled isChecked />
    </Wrapper>
  );
};

export const DisabledStates: Story = {
  name: "Disabled",
  render: () => <DisabledTemplate />,
  play: async ({ canvas, userEvent }) => {
    const off = canvas.getByRole("checkbox", { name: "Disabled off" });
    const on = canvas.getByRole("checkbox", { name: "Disabled on" });
    await expect(off).toBeDisabled();
    await expect(on).toBeDisabled();

    await expect(off).not.toBeChecked();
    await expect(on).toBeChecked();

    // A disabled input is no tab stop, so Tab passes both switches.
    await userEvent.tab();
    await expect(document.activeElement).toBe(document.body);
  },
  parameters: {
    docs: {
      description: {
        story: `A setting that cannot be changed right now, shown in both positions so the reader still sees its value (\`isDisabled\`):

- **Disabled off** — faded grey track, greyed label
- **Disabled on** — faded accent track, greyed label; neither responds to a click`,
      },
      source: {
        code: `<ToggleButton label="Disabled off" isDisabled />
<ToggleButton label="Disabled on" isDisabled isChecked />`,
      },
    },
  },
};

const LoadingTemplate = () => {
  return (
    <Wrapper>
      <Template label="Loading unchecked" isLoading />
      <Template label="Loading checked" isLoading isChecked />
    </Wrapper>
  );
};

export const LoadingState: Story = {
  name: "Loading",
  render: () => <LoadingTemplate />,
  play: async ({ canvas, userEvent }) => {
    // Loading only pulses the knob: the switch still takes a click.
    const toggle = canvas.getByRole("checkbox", { name: "Loading unchecked" });
    await expect(toggle).toBeEnabled();
    await userEvent.click(canvas.getByText("Loading unchecked"));
    await expect(toggle).toBeChecked();
  },
  parameters: {
    docs: {
      description: {
        story: `Settings whose change is still being saved: the knob pulses (\`isLoading\`). The switch still takes clicks.

- **Loading unchecked** — the knob pulses at the start of the grey track
- **Loading checked** — the knob pulses at the end of the accent track`,
      },
      source: {
        code: `<ToggleButton label="Loading unchecked" isChecked={false} isLoading onChange={handleChange} />
<ToggleButton label="Loading checked" isChecked isLoading onChange={handleChange} />`,
      },
    },
  },
};

const NoAnimationTemplate = () => {
  return (
    <Wrapper>
      <Template label="No animation off" noAnimation />
      <Template label="No animation on" noAnimation isChecked />
    </Wrapper>
  );
};

export const WithoutAnimation: Story = {
  name: "Without animation",
  render: () => <NoAnimationTemplate />,
  play: async ({ canvas, userEvent }) => {
    // The knob lands in place at once: a frame after the click it is where
    // the checked switch keeps it.
    const knob = (label: string) =>
      switchOf(canvas, label).querySelector("circle") as SVGCircleElement;
    const onPosition =
      knob("No animation on").getBoundingClientRect().left -
      switchOf(canvas, "No animation on").getBoundingClientRect().left;
    await userEvent.click(canvas.getByText("No animation off"));
    await frame();
    await frame();
    await expect(
      knob("No animation off").getBoundingClientRect().left -
        switchOf(canvas, "No animation off").getBoundingClientRect().left,
    ).toBeCloseTo(onPosition, 0);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Switches whose knob jumps to the other end instead of sliding (`noAnimation`), for a long list of switches or a reduced-motion setting.",
      },
      source: {
        code: `<ToggleButton label="No animation off" isChecked={false} noAnimation onChange={handleChange} />
<ToggleButton label="No animation on" isChecked noAnimation onChange={handleChange} />`,
      },
    },
  },
};

export const RightToLeft: Story = {
  name: "Right to left",
  render: () => (
    <div dir="rtl">
      <Wrapper>
        <Template label="تفعيل" />
        <Template label="تفعيل" isChecked />
      </Wrapper>
    </div>
  ),
  globals: { direction: "rtl" },
  play: async ({ canvas }) => {
    // The switch moves to the right of its label.
    const [label] = canvas.getAllByText(/./, { selector: "label *" });
    const toggle = switchOf(canvas, label.textContent as string);
    await expect(toggle.getBoundingClientRect().left).toBeGreaterThan(
      label.getBoundingClientRect().left,
    );
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed: an inline RTL story would flip the whole Docs page.
      story: { inline: false, height: "44px" },
      description: {
        story: `Two switches in a right-to-left interface, with the label to the left of the switch and the track mirrored. The wrapper's \`dir="rtl"\` moves the label; the theme's \`interfaceDirection\` mirrors the track.`,
      },
      source: {
        code: `<div dir="rtl">
  <ToggleButton label="تفعيل" isChecked={false} onChange={handleChange} />
  <ToggleButton label="تفعيل" isChecked onChange={handleChange} />
</div>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  name: "CSS customization",
  play: async ({ canvas }) => {
    const track = (label: string) =>
      getComputedStyle(switchOf(canvas, label).querySelector("rect") as Element)
        .fill;
    await expect(track("On")).toBe("rgb(0, 103, 158)");
    await expect(track("Off")).toBe("rgb(125, 125, 125)");
    // --toggle-button-spacing: the room between the switch and the label.
    const toggle = switchOf(canvas, "Off");
    await expect(
      Math.round(
        canvas.getByText("Off").getBoundingClientRect().left -
          toggle.getBoundingClientRect().right,
      ),
    ).toBe(16);
  },
  render: () => (
    <div
      style={
        {
          "--toggle-button-spacing": "16px",
          "--toggle-button-checked-color": "#00679e",
          "--toggle-button-off-color": "#7d7d7d",
          "--toggle-button-off-hover-color": "#3d3d3d",
        } as CSSProperties
      }
    >
      <Wrapper>
        <Template label="Off" />
        <Template label="On" isChecked />
      </Wrapper>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable, set on one wrapper, with a wider gap before the labels.

- **Off** is there for \`--toggle-button-off-color\`, and for \`--toggle-button-off-hover-color\` under the pointer
- **On** is there for \`--toggle-button-checked-color\`
- Both labels sit 16px from their switch (\`--toggle-button-spacing\`)`,
      },
      source: {
        code: `<div style={{
  "--toggle-button-spacing": "16px",
  "--toggle-button-checked-color": "#00679e",
  "--toggle-button-off-color": "#7d7d7d",
  "--toggle-button-off-hover-color": "#3d3d3d",
}}>
  <ToggleButton label="Off" isChecked={false} onChange={handleChange} />
  <ToggleButton label="On" isChecked onChange={handleChange} />
</div>`,
      },
    },
  },
};
