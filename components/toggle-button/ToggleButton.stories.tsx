import type { CSSProperties, ComponentProps } from "react";
import { useEffect, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { ToggleButton } from ".";

import type { ToggleButtonProps } from "./ToggleButton.types";

const meta = {
  title: "UI/Form controls/ToggleButton",
  component: ToggleButton,
  parameters: {
    docs: {
      description: {
        component: `ToggleButton is a switch control for toggling between on and off states.

### Features

- **Animated Toggle**: Slides the knob from one end of the track to the other when the state changes
- **Loading State**: Pulses the knob while an operation is in progress, without blocking clicks
- **Disabled State**: Dims the switch and the label and ignores clicks
- **Optional Label**: Text label with configurable font size and weight
- **No Animation Mode**: Moves the knob instantly instead of sliding it, while the loading pulse still runs
- **Custom Colours**: Takes the track colour of each state and the gap before the label from CSS variables
- **Right-to-Left**: Mirrors the switch in a right-to-left interface, so the off knob sits on the right and the label comes before it
- **Tooltip Anchor**: Carries the id a \`Tooltip\` elsewhere in the tree uses to open over the control

### Accessibility

The ToggleButton renders a visually hidden native \`<input type="checkbox">\` inside a \`<label>\`, so its support comes from the platform:

- Screen readers announce a checkbox with its checked state, named by the label text; without \`label\` the control has no accessible name, and no prop supplies one
- Tab moves focus to the hidden input and Space toggles it; the switch draws no focus ring while focused
- \`isDisabled\` sets the native \`disabled\` on the input, which takes it out of the tab order and is announced as unavailable

### Usage

\`\`\`tsx
import { ToggleButton } from "@onlyoffice/apps-ui-kit/components/toggle-button";

// Basic toggle
<ToggleButton label="Enable notifications" isChecked={isEnabled} onChange={handleChange} />

// Loading state
<ToggleButton label="Auto-save" isChecked={isOn} isLoading={isSaving} onChange={handleChange} />

// Without label
<ToggleButton isChecked={isOn} onChange={handleChange} />
\`\`\``,
      },
    },
  },
  argTypes: {
    isChecked: {
      control: "boolean",
      description:
        "Whether the switch is on; the control is fully controlled, so without `onChange` updating it the switch never moves",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDisabled: {
      control: "boolean",
      description:
        "Disables the input, dims the switch and the label, and ignores clicks",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isLoading: {
      control: "boolean",
      description:
        "Pulses the knob to show work in progress; it does not disable the control, so a click still reaches `onChange`",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    label: {
      control: "text",
      description:
        "Text beside the switch; without it the component is the 28 by 16 pixel switch alone",
    },
    noAnimation: {
      control: "boolean",
      description:
        "Moves the knob to its new end instantly instead of sliding it; the loading pulse still animates",
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
        "Called with the checkbox's change event when the switch is clicked; the new state is `event.target.checked`",
    },
    name: {
      control: "text",
      description:
        "Name of the hidden checkbox input, for a form that reads the control by name",
    },
    id: {
      control: "text",
      description:
        "Id put on the outer element and on the inner `<label>`, so it appears twice in the document",
    },
    className: {
      control: "text",
      description:
        "Class name added to the outer element and to the inner `<label>`",
    },
    style: {
      control: "object",
      description:
        "Inline style of the outer element and of the inner `<label>`, so a margin or a padding takes effect at both levels",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the outer element",
      table: {
        defaultValue: { summary: "toggle-button" },
      },
    },
    dataTooltipId: {
      control: "text",
      description:
        "Value of `data-tooltip-id` on the outer element, which a `Tooltip` with the same id uses to open over the control",
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
  },
  parameters: {
    docs: {
      description: {
        story:
          "A single switch with a label, for one setting that takes effect at once; click it to turn it on, and change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<ToggleButton label="Toggle me" isChecked={isOn} onChange={handleChange} />`,
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
  render: () => <StatesTemplate />,
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
  render: () => <DisabledTemplate />,
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
  render: () => <LoadingTemplate />,
  parameters: {
    docs: {
      description: {
        story: `A setting whose change is still being saved: the knob pulses until the work is done (\`isLoading\`). The switch still takes clicks, so the caller decides whether to ignore them.

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
  render: () => <NoAnimationTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "For a list of many switches or a reduced-motion setting: click either switch and the knob jumps to the other end instead of sliding there (`noAnimation`).",
      },
      source: {
        code: `<ToggleButton label="No animation off" isChecked={false} noAnimation onChange={handleChange} />
<ToggleButton label="No animation on" isChecked noAnimation onChange={handleChange} />`,
      },
    },
  },
};

export const RightToLeft: Story = {
  render: () => (
    <div dir="rtl">
      <Wrapper>
        <Template label="تفعيل" />
        <Template label="تفعيل" isChecked />
      </Wrapper>
    </div>
  ),
  globals: { direction: "rtl" },
  parameters: {
    noPadding: true,
    docs: {
      // Framed: an inline RTL story would flip the whole Docs page.
      story: { inline: false, height: "44px" },
      description: {
        story: `The same switches in a right-to-left interface: the label moves to the left of the switch, and the track is mirrored, so the knob of the off switch sits at the right end and the knob of the on switch at the left. The wrapper carries \`dir="rtl"\` for the label's side; the mirrored track comes from the theme's \`interfaceDirection\` (the Direction toolbar).`,
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
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--toggle-button-spacing\` | Gap between the switch and the label | \`8px\` |
| \`--toggle-button-checked-color\` | Track colour when checked, disabled or not | theme-based |
| \`--toggle-button-off-color\` | Track colour when unchecked; the dark theme ignores it and keeps its own | \`#d0d5da\` |
| \`--toggle-button-off-hover-color\` | Track colour of an unchecked switch under the pointer; the dark theme ignores it and keeps its own | \`#a3a9ae\` |

- **Off** is there for \`--toggle-button-off-color\`; hover it to see \`--toggle-button-off-hover-color\`
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
