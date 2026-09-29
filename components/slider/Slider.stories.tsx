import type { CSSProperties, ChangeEvent, ComponentProps } from "react";
import { useEffect, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Slider } from ".";
import type { SliderProps } from "./Slider.types";

const meta = {
  title: "UI/Form controls/Slider",
  component: Slider,
  parameters: {
    docs: {
      description: {
        component: `Slider is a range input for selecting numeric values within a defined range.

### Features

- **Min/Max Range**: Configurable minimum and maximum values
- **Custom Step Size**: Control the increment/decrement granularity
- **Pouring Effect**: Visual fill indicator showing the selected portion of the track
- **Disabled State**: Dims the control, blocks pointer and keyboard input and drops it out of the tab order
- **Custom Sizing**: Adjustable thumb and track dimensions
- **RTL Support**: Pours the track from the right edge when the page or a surrounding element is right-to-left at the moment the slider mounts
- **Controlled Value**: Renders exactly the \`value\` it is given and reports every move through \`onChange\`

### Accessibility

The slider is a native \`<input type="range">\`, so keyboard and screen reader support comes from the platform rather than from attributes the component adds:

- Arrow keys move the thumb one \`step\`, PageUp and PageDown move it in larger jumps, Home and End go to \`min\` and \`max\`
- The current, minimum and maximum values reach assistive technology through the input's own \`value\`, \`min\` and \`max\`
- Keyboard focus draws a ring around the thumb (\`:focus-visible\`), so a tabbing user can see which control is live
- \`isDisabled\` sets the input's \`disabled\` attribute, which also takes the slider out of the tab order
- The input carries no name of its own — give it an \`id\` and point a \`<label for>\` at it

### Usage

\`\`\`tsx
import { Slider } from "@onlyoffice/apps-ui-kit/components/slider";

<Slider min={0} max={100} value={50} onChange={handleChange} />

// With custom step
<Slider min={0} max={10} step={2} value={4} onChange={handleChange} />

// Disabled
<Slider min={0} max={100} value={30} isDisabled />
\`\`\``,
      },
    },
  },
  argTypes: {
    min: {
      control: "number",
      description: "Minimum range value",
    },
    max: {
      control: "number",
      description: "Maximum range value",
    },
    step: {
      control: "number",
      description: "Increment/decrement step size",
      table: {
        defaultValue: { summary: "1" },
      },
    },
    value: {
      control: "number",
      description: "Current slider value",
    },
    isDisabled: {
      control: "boolean",
      description:
        "Greys the handle and the filled part of the track, blocks dragging and arrow keys, and takes the slider out of the tab order",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withPouring: {
      control: "boolean",
      description: "Shows the filled portion of the track",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    thumbWidth: {
      control: "text",
      description: "Width of the input thumb",
      table: {
        defaultValue: { summary: "24px" },
      },
    },
    thumbHeight: {
      control: "text",
      description: "Height of the input thumb",
      table: {
        defaultValue: { summary: "24px" },
      },
    },
    thumbBorderWidth: {
      control: "text",
      description: "Border width of the input thumb",
      table: {
        defaultValue: { summary: "6px" },
      },
    },
    runnableTrackHeight: {
      control: "text",
      description: "Height of the runnable track the thumb slides along",
      table: {
        defaultValue: { summary: "8px" },
      },
    },
    onChange: {
      action: "onChange",
      description:
        "Called on every move of the handle with the input's change event, whose `target.value` is a string; the handle cannot move without it",
    },
    id: {
      control: "text",
      description:
        "`id` of the input, for a `<label for>` that gives the slider its name",
    },
    className: {
      control: "text",
      description: "Extra class names added to the input",
    },
    style: {
      control: "object",
      description: "Inline styles applied to the input",
    },
    dataTestId: {
      control: "text",
      description: "`data-testid` of the input",
      table: {
        defaultValue: { summary: "slider" },
      },
    },
  },
} satisfies Meta<typeof Slider>;

type Story = StoryObj<ComponentProps<typeof Slider>>;

export default meta;

const SliderWithState = (props: SliderProps) => {
  const { value: initialValue, onChange } = props;
  const [value, setValue] = useState<number>(initialValue ?? 50);

  // Follows the value control in the Controls panel after the first render.
  useEffect(() => setValue(initialValue ?? 50), [initialValue]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseFloat(e.target.value);
    setValue(newValue);
    onChange?.(e);
  };

  return <Slider {...props} value={value} onChange={handleChange} />;
};

export const Default: Story = {
  render: (args) => <SliderWithState {...args} />,
  args: {
    min: 0,
    max: 100,
    step: 1,
    value: 50,
    isDisabled: false,
    withPouring: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A 0–100 slider with the track filled up to the handle (`withPouring`), the usual choice for a setting such as volume or zoom; drag the handle or change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<Slider min={0} max={100} value={50} withPouring onChange={handleChange} />`,
      },
    },
  },
};

export const DisabledState: Story = {
  render: (args) => <SliderWithState {...args} />,
  args: {
    min: 0,
    max: 100,
    step: 1,
    value: 50,
    isDisabled: true,
    withPouring: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a setting that cannot be changed right now: the handle and the filled part of the track turn paler, the unfilled track stays as it is, and the handle no longer moves by mouse or keyboard (`isDisabled`).",
      },
      source: {
        code: `<Slider min={0} max={100} value={50} withPouring isDisabled />`,
      },
    },
  },
};

export const WithCustomSteps: Story = {
  render: (args) => <SliderWithState {...args} />,
  args: {
    min: 0,
    max: 10,
    step: 5,
    value: 5,
    isDisabled: false,
    withPouring: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Slider with a custom step size of 5, allowing values of 0, 5, and 10 only.",
      },
      source: {
        code: `<Slider min={0} max={10} step={5} value={5} withPouring onChange={handleChange} />`,
      },
    },
  },
};

export const WithoutPouring: Story = {
  render: (args) => <SliderWithState {...args} />,
  args: {
    min: 0,
    max: 100,
    step: 1,
    value: 50,
    isDisabled: false,
    withPouring: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Slider without the pouring (filled track) effect. The track remains a single color.",
      },
      source: {
        code: `<Slider min={0} max={100} value={50} withPouring={false} onChange={handleChange} />`,
      },
    },
  },
};

const CustomSizeTemplate = (args: SliderProps) => {
  return (
    <div style={{ width: "300px", padding: "20px" }}>
      <SliderWithState {...args} />
    </div>
  );
};

export const WithCustomSize: Story = {
  render: (args) => <CustomSizeTemplate {...args} />,
  args: {
    min: 0,
    max: 100,
    step: 1,
    value: 50,
    isDisabled: false,
    withPouring: true,
    thumbWidth: "32px",
    thumbHeight: "32px",
    thumbBorderWidth: "8px",
    runnableTrackHeight: "14px",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Slider with larger custom thumb and track dimensions for improved touch targets.",
      },
      source: {
        code: `<Slider
  min={0} max={100} value={50} withPouring
  thumbWidth="32px"
  thumbHeight="32px"
  thumbBorderWidth="8px"
  runnableTrackHeight="14px"
/>`,
      },
    },
  },
};

// Framed on Docs: the theme provider stamps data-dir on <html>, which would flip the whole page.
export const RightToLeft: Story = {
  render: (args) => (
    <div dir="rtl" style={{ width: "300px", padding: "20px" }}>
      <SliderWithState {...args} />
    </div>
  ),
  args: {
    min: 0,
    max: 100,
    step: 1,
    value: 50,
    isDisabled: false,
    withPouring: true,
  },
  globals: { direction: "rtl" },
  parameters: {
    noPadding: true,
    docs: {
      story: { inline: false, height: "122px" },
      description: {
        story:
          "In a right-to-left interface the minimum sits at the right edge: the fill starts there and grows to the left as the handle is dragged left.",
      },
      source: {
        code: `<div dir="rtl">
  <Slider min={0} max={100} value={50} withPouring onChange={handleChange} />
</div>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => {
    const [value, setValue] = useState(60);
    return (
      <div
        style={
          {
            width: "300px",
            padding: "20px",
            "--slider-handle-color": "#7c3aed",
            "--slider-pouring-image": "linear-gradient(#7c3aed, #7c3aed)",
            "--slider-background-color": "#ede9fe",
            "--slider-size": "12px",
            "--slider-handle-size": "28px",
            "--slider-track-radius": "6px",
          } as CSSProperties
        }
      >
        <Slider
          min={0}
          max={100}
          value={value}
          withPouring
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue(Number(e.target.value))
          }
        />
        <Slider min={0} max={100} value={40} withPouring isDisabled />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--slider-handle-color\` | Thumb background color; the disabled thumb and fill are mixed from it | theme-based |
| \`--slider-pouring-image\` | Fill image for the poured portion, applied only with \`withPouring\` and while enabled (must be a \`linear-gradient\` or other \`<image>\`) | theme-based |
| \`--slider-background-color\` | Track (unfilled) background color | theme-based |
| \`--slider-size\` | Track height | \`8px\` |
| \`--slider-handle-size\` | Thumb width and height | \`24px\` |
| \`--slider-track-radius\` | Border radius of the track; the thumb keeps a fixed radius | \`5.6px\` |

The first slider shows every variable. The second is disabled, to show that the theme does not swap in its own colors there: it mixes the disabled thumb and fill from \`--slider-handle-color\`, so a custom accent survives as a paler version of itself.`,
      },
      source: {
        code: `<div
  style={{
    "--slider-handle-color": "#7c3aed",
    "--slider-pouring-image": "linear-gradient(#7c3aed, #7c3aed)",
    "--slider-background-color": "#ede9fe",
    "--slider-size": "12px",
    "--slider-handle-size": "28px",
    "--slider-track-radius": "6px",
  }}
>
  <Slider min={0} max={100} value={value} withPouring onChange={handleChange} />
  <Slider min={0} max={100} value={40} withPouring isDisabled />
</div>`,
      },
    },
  },
};
