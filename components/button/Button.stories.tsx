/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type React from "react";
import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import Icon from "../../assets/button.alert.react.svg";

import { Button, ButtonSize } from ".";

const meta = {
  title: "UI/Interactive elements/Button",
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

export const Default: Story = {
  render: (args) => (
    <Button {...args} onClick={() => alert("Button clicked")} />
  ),
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
      source: {
        code: `<Button primary size={ButtonSize.extraSmall} label="Primary ExtraSmall" />
<Button primary size={ButtonSize.small} label="Primary Small" />
<Button primary size={ButtonSize.normal} label="Primary Normal" />
<Button primary size={ButtonSize.medium} label="Primary Medium" />`,
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
      source: {
        code: `<Button size={ButtonSize.extraSmall} label="Secondary ExtraSmall" />
<Button size={ButtonSize.small} label="Secondary Small" />
<Button size={ButtonSize.normal} label="Secondary Normal" />
<Button size={ButtonSize.medium} label="Secondary Medium" />`,
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
      source: {
        code: `<Button primary size={ButtonSize.small} icon={<Icon />} label="With Icon Small" />
<Button primary size={ButtonSize.normal} icon={<Icon />} label="With Icon Normal" />
<Button size={ButtonSize.small} icon={<Icon />} label="With Icon Small" />
<Button size={ButtonSize.normal} icon={<Icon />} label="With Icon Normal" />`,
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
      source: {
        code: `<Button primary size={ButtonSize.small} isLoading label="Loading Small" />
<Button primary size={ButtonSize.normal} isLoading label="Loading Normal" />
<Button size={ButtonSize.small} isLoading label="Loading Small" />
<Button size={ButtonSize.normal} isLoading label="Loading Normal" />`,
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
      source: {
        code: `<Button primary size={ButtonSize.small} scale label="Scale Small" />
<Button primary size={ButtonSize.normal} scale label="Scale Normal" />
<Button size={ButtonSize.small} scale label="Scale Small" />
<Button size={ButtonSize.normal} scale label="Scale Normal" />`,
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
      source: {
        code: `<Button primary size={ButtonSize.small} isDisabled label="Disabled Small" />
<Button primary size={ButtonSize.normal} isDisabled label="Disabled Normal" />
<Button size={ButtonSize.small} isDisabled label="Disabled Small" />
<Button size={ButtonSize.normal} isDisabled label="Disabled Normal" />`,
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
      source: {
        code: `<Button primary size={ButtonSize.small} isClicked label="Clicked Small" />
<Button primary size={ButtonSize.normal} isClicked label="Clicked Normal" />
<Button size={ButtonSize.small} isClicked label="Clicked Small" />
<Button size={ButtonSize.normal} isClicked label="Clicked Normal" />`,
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
      source: {
        code: `<Button primary size={ButtonSize.small} isHovered label="Hovered Small" />
<Button primary size={ButtonSize.normal} isHovered label="Hovered Normal" />
<Button size={ButtonSize.small} isHovered label="Hovered Small" />
<Button size={ButtonSize.normal} isHovered label="Hovered Normal" />`,
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
      source: {
        code: `<Button primary size={ButtonSize.small} filled label="Filled Small" />
<Button primary size={ButtonSize.normal} filled label="Filled Normal" />
<Button size={ButtonSize.small} filled label="Filled Small" />
<Button size={ButtonSize.normal} filled label="Filled Normal" />`,
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
      source: {
        code: `<Button primary size={ButtonSize.small} filledStroke label="FilledStroke Small" />
<Button primary size={ButtonSize.normal} filledStroke label="FilledStroke Normal" />
<Button size={ButtonSize.small} filledStroke label="FilledStroke Small" />
<Button size={ButtonSize.normal} filledStroke label="FilledStroke Normal" />`,
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
      source: {
        code: `<Button primary size={ButtonSize.small} label="Hover me" tooltipText="This is a primary button with a tooltip" />
<Button size={ButtonSize.normal} label="Hover me too" tooltipText="This is a secondary button with a tooltip" />
<Button primary size={ButtonSize.medium} icon={<Icon />} label="With icon" tooltipText="Button with icon and tooltip" />`,
      },
    },
  },
};

const CustomizationTemplate = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px" }}>Default theme (no overrides)</h4>
        <div style={{ display: "flex", gap: "8px" }}>
          <Button size={ButtonSize.normal} label="Secondary" />
          <Button size={ButtonSize.normal} label="Primary" primary />
        </div>
      </div>

      <div
        style={
          {
            "--button-root-bg": "#e91e63",
            "--button-root-color": "#fff",
            "--button-root-border": "1px solid #e91e63",
            "--button-root-border-radius": "24px",
            "--button-root-bg-hover": "#c2185b",
            "--button-root-color-hover": "#fff",
            "--button-root-border-hover": "1px solid #c2185b",
          } as React.CSSProperties
        }
      >
        <h4 style={{ margin: "0 0 8px" }}>Custom secondary (pink, rounded)</h4>
        <div style={{ display: "flex", gap: "8px" }}>
          <Button size={ButtonSize.normal} label="Custom" />
          <Button size={ButtonSize.small} label="Small" />
          <Button size={ButtonSize.normal} label="Disabled" isDisabled />
        </div>
      </div>

      <div
        style={
          {
            "--button-primary-bg": "#7c3aed",
            "--button-primary-color": "#fff",
            "--button-primary-border": "1px solid #7c3aed",
            "--button-primary-bg-hover": "#6d28d9",
            "--button-primary-bg-active": "#5b21b6",
            "--button-primary-border-active": "1px solid #5b21b6",
            "--button-root-border-radius": "8px",
          } as React.CSSProperties
        }
      >
        <h4 style={{ margin: "0 0 8px" }}>Custom primary (purple)</h4>
        <div style={{ display: "flex", gap: "8px" }}>
          <Button size={ButtonSize.normal} label="Save" primary />
          <Button size={ButtonSize.small} label="Submit" primary />
          <Button size={ButtonSize.normal} label="Cancel" />
        </div>
      </div>

      <div
        style={
          {
            "--button-root-bg": "#065f46",
            "--button-root-color": "#d1fae5",
            "--button-root-border": "1px solid #065f46",
            "--button-root-bg-hover": "#047857",
            "--button-root-color-hover": "#fff",
            "--button-root-border-hover": "1px solid #047857",
            "--button-primary-bg": "#f59e0b",
            "--button-primary-color": "#000",
            "--button-primary-border": "1px solid #f59e0b",
            "--button-primary-bg-hover": "#d97706",
            "--button-primary-bg-active": "#b45309",
            "--button-primary-border-active": "1px solid #b45309",
            "--button-root-border-radius": "0",
          } as React.CSSProperties
        }
      >
        <h4 style={{ margin: "0 0 8px" }}>
          Full rebrand (green + amber, no radius)
        </h4>
        <div style={{ display: "flex", gap: "8px" }}>
          <Button size={ButtonSize.normal} label="Secondary" />
          <Button size={ButtonSize.normal} label="Primary" primary />
          <Button size={ButtonSize.normal} label="Disabled" isDisabled />
        </div>
      </div>
    </div>
  );
};

export const CssCustomization: Story = {
  render: () => <CustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: `Buttons can be customized via CSS Custom Properties on a parent element.
No JavaScript needed — just set variables on any wrapper.

**Available variables:**

| Variable | Description |
|----------|-------------|
| \`--button-root-bg\` | Secondary background |
| \`--button-root-color\` | Secondary text color |
| \`--button-root-border\` | Secondary border |
| \`--button-root-border-radius\` | Border radius (all variants) |
| \`--button-root-bg-hover\` | Secondary hover background |
| \`--button-root-bg-disabled\` | Secondary disabled background |
| \`--button-primary-bg\` | Primary background |
| \`--button-primary-color\` | Primary text color |
| \`--button-primary-border\` | Primary border |
| \`--button-primary-bg-hover\` | Primary hover background |
| \`--button-text-weight\` | Font weight (default: 600) |
| \`--button-height-xs/sm/md/lg\` | Height per size variant |
| \`--button-font-size-xs/sm/md/lg\` | Font size per size variant |

All color variables support \`-hover\`, \`-active\`, \`-disabled\` suffixes.`,
      },
      source: {
        code: `// Wrap buttons in a div with CSS variables
<div style={{
  "--button-root-bg": "#e91e63",
  "--button-root-color": "#fff",
  "--button-root-border": "1px solid #e91e63",
  "--button-root-border-radius": "24px",
}}>
  <Button label="Custom" />
  <Button label="Primary" primary />
</div>`,
      },
    },
  },
};

