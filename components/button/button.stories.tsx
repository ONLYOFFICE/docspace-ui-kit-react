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

import type React from "react";
import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import Icon from "../../assets/button.alert.react.svg";

import { Button, ButtonSize } from ".";
import type { ButtonProps } from "./Button.types";

const meta = {
  title: "Components/Interactive Elements/Button",
  component: Button,
  parameters: {
    docs: {
      description: {
        component: `Button is used for actions on a page.

### Features

- **Two Variants**: Primary and Secondary styles
- **Four Sizes**: extraSmall, small, normal, and medium
- **Icon Support**: Display icons alongside text
- **Loading State**: Show loading indicator during async operations
- **Tooltip Support**: Display helpful text on hover
- **Filled Variants**: Additional styling options with filled and filledStroke
- **Full Width**: Scale to 100% width when needed

### Accessibility

The Button component includes the following ARIA attributes for improved accessibility:

- \`aria-label\`: Provides a text description of the button's action
- \`aria-disabled\`: Indicates when the button is disabled
- \`aria-busy\`: Indicates when the button is in a loading state

These attributes help users of assistive technologies better understand the button's state and purpose.

### Usage

\`\`\`tsx
import { Button, ButtonSize } from "@docspace/ui-kit/components/button";

// Primary button
<Button primary size={ButtonSize.normal} label="Save" onClick={handleSave} />

// Secondary button with icon
<Button size={ButtonSize.small} icon={<Icon />} label="Cancel" />

// Loading state
<Button primary isLoading label="Saving..." />

// With tooltip
<Button label="Help" tooltipText="Click for help" />
\`\`\``,
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=62-3582&mode=design&t=TBNCKMQKQMxr44IZ-0",
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: Object.values(ButtonSize),
      description: "Button size",
      table: {
        defaultValue: { summary: "normal" },
      },
    },
    primary: {
      control: "boolean",
      description: "Primary button style",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    scale: {
      control: "boolean",
      description: "Scale button to 100% width",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    filled: {
      control: "boolean",
      description: "Filled button variant",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    filledStroke: {
      control: "boolean",
      description: "Filled button with stroke variant",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDisabled: {
      control: "boolean",
      description: "Disable the button",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isLoading: {
      control: "boolean",
      description: "Show loading state",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isHovered: {
      control: "boolean",
      description: "Force hover state (for demo purposes)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isClicked: {
      control: "boolean",
      description: "Force clicked state (for demo purposes)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    label: {
      control: "text",
      description: "Button text label",
    },
    tooltipText: {
      control: "text",
      description: "Tooltip text shown on hover",
    },
  },
} satisfies Meta<typeof Button>;

type Story = StoryObj<ComponentProps<typeof Button>>;

export default meta;

const Wrapper = (props: { isScale: boolean; children: React.ReactNode }) => {
  const { isScale, children } = props;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isScale
          ? "1fr"
          : "repeat( auto-fill, minmax(180px, 1fr) )",
        gridGap: "16px",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  );
};

const Template = (args: ButtonProps) => (
  <Button {...args} onClick={() => alert("Button clicked")} />
);

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: { size: ButtonSize.small, label: "Button" },
};

const PrimaryTemplate = () => {
  return (
    <Wrapper isScale={false}>
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-primary-${size}`}
          primary
          scale={false}
          size={size}
          label={`Primary ${size[0].toUpperCase()}${size.slice(1)}`}
          onClick={() => {}}
        />
      ))}
    </Wrapper>
  );
};

const SecondaryTemplate = () => {
  return (
    <Wrapper isScale={false}>
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-secondary-${size}`}
          scale={false}
          size={size}
          label={`Secondary ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
    </Wrapper>
  );
};

const WithIconTemplate = () => {
  return (
    <Wrapper isScale={false}>
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-icon-prim-${size}`}
          primary
          size={size}
          icon={<Icon />}
          label={`With Icon ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-icon-sec-${size}`}
          size={size}
          icon={<Icon />}
          label={`With Icon ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
    </Wrapper>
  );
};

const IsLoadingTemplate = () => {
  return (
    <Wrapper isScale={false}>
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-load-prim-${size}`}
          primary
          size={size}
          isLoading
          label={`Loading ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-load-sec-${size}`}
          size={size}
          isLoading
          label={`Loading ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
    </Wrapper>
  );
};

const ScaleTemplate = () => {
  return (
    <Wrapper isScale>
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-scale-prim-${size}`}
          primary
          size={size}
          label={`Scale ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-scale-sec-${size}`}
          size={size}
          label={`Scale ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
    </Wrapper>
  );
};

const DisabledTemplate = () => {
  return (
    <Wrapper isScale={false}>
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-disabled-prim-${size}`}
          primary
          size={size}
          isDisabled
          label={`Disabled ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-disabled-sec-${size}`}
          size={size}
          isDisabled
          label={`Disabled ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
    </Wrapper>
  );
};

const ClickedTemplate = () => {
  return (
    <Wrapper isScale={false}>
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-clicked-prim-${size}`}
          primary
          size={size}
          isClicked
          label={`Clicked ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-clicked-sec-${size}`}
          size={size}
          isClicked
          label={`Clicked ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
    </Wrapper>
  );
};

const HoveredTemplate = () => {
  return (
    <Wrapper isScale={false}>
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-hovered-prim-${size}`}
          primary
          size={size}
          isHovered
          label={`Hovered ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-hovered-sec-${size}`}
          size={size}
          isHovered
          label={`Hovered ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
    </Wrapper>
  );
};

const FilledTemplate = () => {
  return (
    <Wrapper isScale={false}>
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-filled-prim-${size}`}
          primary
          size={size}
          filled
          label={`Filled ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-filled-sec-${size}`}
          size={size}
          filled
          label={`Filled ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
    </Wrapper>
  );
};

const FilledStrokeTemplate = () => {
  return (
    <Wrapper isScale={false}>
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-filled-stroke-prim-${size}`}
          primary
          size={size}
          filledStroke
          label={`FilledStroke ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
      {(Object.keys(ButtonSize) as Array<ButtonSize>).map((size) => (
        <Button
          key={`all-filled-stroke-sec-${size}`}
          size={size}
          filledStroke
          label={`FilledStroke ${size[0].toUpperCase()}${size.slice(1)}`}
        />
      ))}
    </Wrapper>
  );
};

const TooltipTemplate = () => {
  return (
    <Wrapper isScale={false}>
      <Button
        primary
        size={ButtonSize.small}
        label="Hover me"
        tooltipText="This is a primary button with a tooltip"
      />
      <Button
        size={ButtonSize.normal}
        label="Hover me too"
        tooltipText="This is a secondary button with a tooltip"
      />
      <Button
        primary
        size={ButtonSize.medium}
        icon={<Icon />}
        label="With icon"
        tooltipText="Button with icon and tooltip"
      />
    </Wrapper>
  );
};

export const PrimaryButtons: Story = {
  render: () => <PrimaryTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Primary buttons are used for main actions. They have a solid background color.",
      },
    },
  },
};

export const SecondaryButtons: Story = {
  render: () => <SecondaryTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Secondary buttons are used for secondary actions. They have a transparent background with a border.",
      },
    },
  },
};

export const WithIconButtons: Story = {
  render: () => <WithIconTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Buttons can include icons alongside text. Icons are displayed before the label.",
      },
    },
  },
};

export const IsLoadingButtons: Story = {
  render: () => <IsLoadingTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Loading state displays a spinner and disables interaction. Use for async operations.",
      },
    },
  },
};

export const ScaleButtons: Story = {
  render: () => <ScaleTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Scale prop makes buttons expand to 100% of their container width. Useful for mobile layouts.",
      },
    },
  },
};

export const DisabledButtons: Story = {
  render: () => <DisabledTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Disabled buttons cannot be interacted with and have reduced opacity.",
      },
    },
  },
};

export const ClickedButtons: Story = {
  render: () => <ClickedTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Shows the visual state when a button is clicked/pressed. For demonstration purposes.",
      },
    },
  },
};

export const HoveredButtons: Story = {
  render: () => <HoveredTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Shows the visual state when a button is hovered. For demonstration purposes.",
      },
    },
  },
};

export const FilledButtons: Story = {
  render: () => <FilledTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Filled variant provides an alternative solid background style for buttons.",
      },
    },
  },
};

export const FilledStrokeButtons: Story = {
  render: () => <FilledStrokeTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "FilledStroke variant combines filled background with a stroke/border for emphasis.",
      },
    },
  },
};

export const WithTooltip: Story = {
  render: () => <TooltipTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Buttons can display tooltips on hover. Hover over the buttons to see the tooltip text.",
      },
    },
  },
};
