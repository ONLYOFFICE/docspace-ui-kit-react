import type { CSSProperties, ChangeEvent, ComponentProps } from "react";
import { useEffect, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fireEvent, fn } from "storybook/test";

import { Slider } from ".";
import type { SliderProps } from "./Slider.types";

const meta = {
  title: "UI/Form controls/Slider",
  component: Slider,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
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

// A range input moves on its own default action, which the browser does not
// run for synthetic key events -- so the play functions set the value through
// a change event and check that the handle and onChange follow it.
const moveTo = (slider: HTMLElement, value: string) =>
  fireEvent.change(slider, { target: { value } });

// The handle is a pseudo-element whose computed style the browser does not
// report, so it is checked through the variables its rule reads.
const variable = (slider: HTMLElement, name: string) =>
  getComputedStyle(slider).getPropertyValue(name).trim();

export const Default: Story = {
  render: (args) => <SliderWithState {...args} />,
  args: {
    min: 0,
    max: 100,
    step: 1,
    value: 50,
    isDisabled: false,
    withPouring: true,
    onChange: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const slider = canvas.getByRole("slider");
    await expect(slider).toHaveValue("50");

    await userEvent.tab();
    await expect(slider).toHaveFocus();

    moveTo(slider, "75");
    await expect(slider).toHaveValue("75");
    await expect(args.onChange).toHaveBeenCalledTimes(1);
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
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole("slider")).toBeDisabled();
    await userEvent.tab();
    await expect(document.activeElement).toBe(document.body);
  },
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
  play: async ({ canvas }) => {
    const slider = canvas.getByRole("slider");
    await expect(slider).toHaveAttribute("step", "5");
    // The input snaps a value between steps to the nearest one.
    moveTo(slider, "7");
    await expect(slider).toHaveValue("5");
    moveTo(slider, "8");
    await expect(slider).toHaveValue("10");
  },
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
  play: async ({ canvas }) => {
    // No fill: the track keeps one colour whatever the value.
    const slider = canvas.getByRole("slider");
    await expect(slider.style.backgroundSize).toBe("auto");
    moveTo(slider, "80");
    await expect(slider.style.backgroundSize).toBe("auto");
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
  play: async ({ canvas }) => {
    const slider = canvas.getByRole("slider");
    await expect(variable(slider, "--thumb-width")).toBe("32px");
    await expect(variable(slider, "--thumb-height")).toBe("32px");
    await expect(variable(slider, "--thumb-border-width")).toBe("8px");
    // The track height is the input's own height too.
    await expect(slider).toHaveStyle({ height: "14px" });
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
  play: async ({ canvas }) => {
    // The fill grows from the right edge and follows the value.
    const slider = canvas.getByRole("slider");
    await expect(getComputedStyle(slider).direction).toBe("rtl");
    await expect(slider.style.backgroundSize).toMatch(/^50%/);
    moveTo(slider, "20");
    await expect(slider.style.backgroundSize).toMatch(/^20%/);
    await expect(getComputedStyle(slider).backgroundPositionX).toMatch(
      /100%|right/,
    );
  },
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
  play: async ({ canvas }) => {
    const [active] = canvas.getAllByRole("slider");
    await expect(active).toHaveStyle({
      backgroundColor: "rgb(237, 233, 254)",
      height: "12px",
      borderRadius: "6px",
    });
    await expect(variable(active, "--slider-thumb-s")).toBe("28px");
    await expect(variable(active, "--slider-thumb-bg")).toBe("#7c3aed");
  },
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
        story: `Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page.

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
