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

import type { CSSProperties, ChangeEvent, ComponentProps } from "react";
import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Slider } from ".";
import type { SliderProps } from "./Slider.types";

const meta = {
  title: "UI/Interactive elements/Slider",
  component: Slider,
  parameters: {
    docs: {
      description: {
        component: `Slider is a range input for selecting numeric values within a defined range.

### Features

- **Min/Max Range**: Configurable minimum and maximum values
- **Custom Step Size**: Control the increment/decrement granularity
- **Pouring Effect**: Visual fill indicator showing the selected portion of the track
- **Disabled State**: Prevents interaction when disabled
- **Custom Sizing**: Adjustable thumb and track dimensions
- **RTL Support**: Works correctly in right-to-left layouts

### Accessibility

- Keyboard navigation with arrow keys
- \`aria-valuemin\`, \`aria-valuemax\`, \`aria-valuenow\` attributes

### Usage

\`\`\`tsx
import { Slider } from "@docspace/ui-kit/components/slider";

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
      description: "Disables the slider input",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withPouring: {
      control: "boolean",
      description: "Shows the filled portion of the track",
      table: {
        defaultValue: { summary: "true" },
      },
    },
  },
} satisfies Meta<typeof Slider>;

type Story = StoryObj<ComponentProps<typeof Slider>>;

export default meta;

const SliderWithState = (props: SliderProps) => {
  const { value: initialValue, onChange } = props;
  const [value, setValue] = useState<number>(initialValue || 50);

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
          "Default slider with a range of 0-100 and the pouring effect enabled.",
      },
      source: {
        code: `<Slider min={0} max={100} value={50} onChange={handleChange} />`,
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
          "Disabled slider that cannot be interacted with. The thumb and track appear muted.",
      },
      source: {
        code: `<Slider min={0} max={100} value={50} isDisabled />`,
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
        code: `<Slider min={0} max={10} step={5} value={5} onChange={handleChange} />`,
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
    thumbWidth: "24px",
    thumbHeight: "24px",
    thumbBorderWidth: "2px",
    runnableTrackHeight: "8px",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Slider with larger custom thumb and track dimensions for improved touch targets.",
      },
      source: {
        code: `<Slider
  min={0} max={100} value={50}
  thumbWidth="24px"
  thumbHeight="24px"
  thumbBorderWidth="2px"
  runnableTrackHeight="8px"
/>`,
      },
    },
  },
};

export const RTL: Story = {
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
  parameters: {
    docs: {
      description: {
        story:
          "Slider in a right-to-left layout. The track fills from right to left.",
      },
      source: {
        code: `<div dir="rtl">
  <Slider min={0} max={100} value={50} onChange={handleChange} />
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
            "--slider-fill-color": "#e9d5ff",
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
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--slider-handle-color\` | Thumb background color | theme token |
| \`--slider-pouring-image\` | Fill image for the poured portion (must be a \`linear-gradient\` or other \`<image>\`) | theme token |
| \`--slider-fill-color\` | Filled track color (Firefox / moz range) | theme token |
| \`--slider-background-color\` | Track (unfilled) background color | theme token |
| \`--slider-size\` | Track height | \`8px\` |
| \`--slider-handle-size\` | Thumb width and height | \`24px\` |
| \`--slider-track-radius\` | Border radius of track and thumb | \`5.6px\` |`,
      },
    },
  },
};

