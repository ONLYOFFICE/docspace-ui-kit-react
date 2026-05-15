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

- **Animated Toggle**: Smooth Framer Motion animation between states
- **Loading State**: Animated loading indicator during async operations
- **Disabled State**: Prevents user interaction
- **Optional Label**: Text label with configurable font size and weight
- **No Animation Mode**: Disable animations when needed

### Usage

\`\`\`tsx
import { ToggleButton } from "@docspace/ui-kit/components/toggle-button";

// Basic toggle
<ToggleButton label="Enable notifications" isChecked={isEnabled} onChange={handleChange} />

// Loading state
<ToggleButton label="Saving..." isLoading />

// Without label
<ToggleButton isChecked={isOn} onChange={handleChange} />
\`\`\``,
      },
    },
  },
  argTypes: {
    isChecked: {
      control: "boolean",
      description: "Controls the checked state of the toggle",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDisabled: {
      control: "boolean",
      description: "Disables the toggle button",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isLoading: {
      control: "boolean",
      description: "Shows loading animation",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    label: {
      control: "text",
      description: "Text label for the toggle",
    },
    noAnimation: {
      control: "boolean",
      description: "Disables animation effects",
      table: {
        defaultValue: { summary: "false" },
      },
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

const Template = ({ isChecked, ...args }: ToggleButtonProps) => {
  const [checked, setChecked] = useState(isChecked);

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  return <ToggleButton {...args} isChecked={checked} onChange={handleChange} />;
};

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    label: "Toggle me",
    isChecked: false,
  },
};

const StatesTemplate = () => {
  return (
    <Wrapper>
      <ToggleButton label="Unchecked" />
      <ToggleButton label="Checked" isChecked />
      <ToggleButton label="Without label" />
    </Wrapper>
  );
};

export const CheckedStates: Story = {
  render: () => <StatesTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Comparison of unchecked and checked toggle states.",
      },
      source: {
        code: `<ToggleButton label="Unchecked" />
<ToggleButton label="Checked" isChecked />
<ToggleButton />`,
      },
    },
  },
};

const DisabledTemplate = () => {
  return (
    <Wrapper>
      <ToggleButton label="Disabled off" isDisabled />
      <ToggleButton label="Disabled on" isDisabled isChecked />
    </Wrapper>
  );
};

export const DisabledStates: Story = {
  render: () => <DisabledTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Disabled toggles cannot be interacted with and have reduced opacity.",
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
      <ToggleButton label="Loading unchecked" isLoading />
      <ToggleButton label="Loading checked" isLoading isChecked />
    </Wrapper>
  );
};

export const LoadingState: Story = {
  render: () => <LoadingTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Loading state shows an animated indicator. Use during async operations like saving settings.",
      },
      source: {
        code: `<ToggleButton label="Loading unchecked" isLoading />
<ToggleButton label="Loading checked" isLoading isChecked />`,
      },
    },
  },
};

const NoAnimationTemplate = () => {
  return (
    <Wrapper>
      <ToggleButton label="No animation off" noAnimation />
      <ToggleButton label="No animation on" noAnimation isChecked />
    </Wrapper>
  );
};

export const WithoutAnimation: Story = {
  render: () => <NoAnimationTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Animations can be disabled with the noAnimation prop. The toggle switches instantly between states.",
      },
      source: {
        code: `<ToggleButton label="No animation" noAnimation />
<ToggleButton label="No animation on" noAnimation isChecked />`,
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
        } as CSSProperties
      }
    >
      <ToggleButton label="Increased gap" isChecked />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--toggle-button-spacing\` | Gap between toggle and label | \`8px\` |
| \`--toggle-button-checked-color\` | Track color when checked | theme accent |
| \`--toggle-button-off-color\` | Track color when unchecked | theme gray |
| \`--toggle-button-off-hover-color\` | Track color on hover when unchecked | theme gray |`,
      },
      source: {
        code: `<div style={{
  "--toggle-button-checked-color": "#00679e",
  "--toggle-button-off-color": "#7d7d7d",
  "--toggle-button-off-hover-color": "#7d7d7d",
}}>
  <ToggleButton label="Off" isChecked={false} />
  <ToggleButton label="On" isChecked />
</div>`,
      },
    },
  },
};
