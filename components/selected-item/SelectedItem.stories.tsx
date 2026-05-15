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

import type { Meta, StoryObj } from "@storybook/react-vite";

import { SelectedItem } from ".";
import styles from "./SelectedItem.stories.module.scss";

const meta = {
  title: "UI/Data display/SelectedItem",
  component: SelectedItem,
  parameters: {
    docs: {
      description: {
        component: `SelectedItem displays a selected value with an optional close button for removal.

### Features

- **Inline & Block Modes**: Display as inline (fit-content width) or block element
- **Close Button**: Built-in close button with callback for item removal
- **Disabled State**: Prevents interaction when disabled
- **Group Support**: Optional group key for categorized selections
- **Custom Icons**: Support for SVG icons alongside the label

### Usage

\`\`\`tsx
import { SelectedItem } from "@docspace/ui-kit/components/selected-item";

// Inline selected item
<SelectedItem label="Finance" propKey="finance" isInline onClose={handleRemove} />

// Block selected item
<SelectedItem label="Full width item" propKey="item-1" isInline={false} onClose={handleRemove} />

// Disabled
<SelectedItem label="Locked" propKey="locked" isDisabled onClose={handleRemove} />
\`\`\``,
      },
    },
  },
  argTypes: {
    label: {
      control: "text",
      description: "Text content for the selected item",
    },
    isInline: {
      control: "boolean",
      description: "Display as inline (fit-content) or block element",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isDisabled: {
      control: "boolean",
      description: "Disables the item and prevents interaction",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    propKey: {
      control: "text",
      description: "Unique identifier for the selected item",
    },
    group: {
      control: "text",
      description: "Optional group key for categorized selections",
    },
    hideCross: {
      control: "boolean",
      description: "Hides the close/remove button",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<typeof SelectedItem>;

type Story = StoryObj<ComponentProps<typeof SelectedItem>>;

export default meta;

const noop = () => {};

export const Default: Story = {
  render: (args) => <SelectedItem {...args} />,
  args: {
    label: "Selected item",
    isInline: true,
    isDisabled: false,
    onClose: noop,
    propKey: "item-1",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default inline selected item with a close button. Click the close button to trigger the onClose callback.",
      },
      source: {
        code: `<SelectedItem label="Selected item" propKey="item-1" isInline onClose={handleRemove} />`,
      },
    },
  },
};

export const DisabledState: Story = {
  render: (args) => <SelectedItem {...args} />,
  args: {
    label: "Disabled item",
    isInline: true,
    isDisabled: true,
    onClose: noop,
    propKey: "item-disabled",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Disabled selected item that cannot be interacted with or removed.",
      },
      source: {
        code: `<SelectedItem label="Disabled item" propKey="item-1" isInline isDisabled onClose={handleRemove} />`,
      },
    },
  },
};

export const BlockDisplay: Story = {
  render: (args) => <SelectedItem {...args} />,
  args: {
    label: "Block display item",
    isInline: false,
    isDisabled: false,
    onClose: noop,
    propKey: "item-block",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Selected item in block display mode, taking the full width of its container.",
      },
      source: {
        code: `<SelectedItem label="Block item" propKey="item-1" isInline={false} onClose={handleRemove} />`,
      },
    },
  },
};

const AllVariantsTemplate = () => {
  return (
    <>
      <div className={styles.containerInline}>
        <SelectedItem label="Inline enabled" propKey="1" isInline onClose={noop} />
        <SelectedItem label="Inline disabled" propKey="2" isInline isDisabled onClose={noop} />
        <SelectedItem label="Another item" propKey="3" isInline onClose={noop} />
      </div>

      <div className={styles.container}>
        <SelectedItem label="Block display item" propKey="4" isInline={false} onClose={noop} />
      </div>
    </>
  );
};

export const AllVariants: Story = {
  render: () => <AllVariantsTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "All selected item variants: multiple inline items (enabled and disabled) and a block display item.",
      },
      source: {
        code: `<SelectedItem label="Inline enabled" propKey="1" isInline onClose={handleRemove} />
<SelectedItem label="Inline disabled" propKey="2" isInline isDisabled onClose={handleRemove} />
<SelectedItem label="Block item" propKey="3" isInline={false} onClose={handleRemove} />`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          "--selected-item-bg": "#ede9fe",
          "--selected-item-bg-hover": "#ddd6fe",
          "--selected-item-text": "#4c1d95",
          "--selected-item-disabled-text": "#a78bfa",
          "--selected-item-radius": "16px",
          "--selected-item-padding": "6px 12px",
          "--selected-item-height": "28px",
        } as CSSProperties
      }
    >
      <SelectedItem label="Custom item" propKey="1" isInline onClose={() => {}} />
      <SelectedItem label="Disabled" propKey="2" isInline isDisabled onClose={() => {}} />
      <SelectedItem label="Another tag" propKey="3" isInline onClose={() => {}} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--selected-item-bg\` | Background color | theme token |
| \`--selected-item-bg-hover\` | Hover background | theme token |
| \`--selected-item-text\` | Label text color | theme token |
| \`--selected-item-disabled-text\` | Disabled label color | theme token |
| \`--selected-item-active-bg\` | Active state background | theme token |
| \`--selected-item-active-text\` | Active state text color | theme token |
| \`--selected-item-radius\` | Border radius | \`3px\` |
| \`--selected-item-padding\` | Inner padding | \`6px 8px\` |
| \`--selected-item-height\` | Item height | \`32px\` |
| \`--selected-item-margin-inline\` | Inline-end margin | \`4px\` |
| \`--selected-item-margin-bottom\` | Bottom margin | \`4px\` |
| \`--selected-item-label-margin\` | Label inline-end margin | \`10px\` |`,
      },
    },
  },
};
