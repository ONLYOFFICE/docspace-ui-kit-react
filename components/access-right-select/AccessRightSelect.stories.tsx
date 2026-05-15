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

import type { ComponentProps, CSSProperties, ReactNode } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { ComboBoxSize } from "../combobox";

import { AccessRightSelect } from "./AccessRightSelect";

import { data } from "./data";

const Wrapper = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      height: "420px",
    }}
  >
    {children}
  </div>
);

const meta = {
  title: "UI/Interactive elements/AccessRightSelect",
  component: AccessRightSelect,
  parameters: {
    docs: {
      description: {
        component: `A dropdown component for selecting access rights with various display options.

### Features

- **Access Options**: Displays a list of access rights with labels, descriptions, and optional quota/color indicators
- **Multiple Display Types**: Supports badge, onlyIcon, and descriptive display variants
- **Responsive Layout**: Scales to container width and supports mobile view with aside panel
- **Directional Control**: Configurable dropdown direction (top/bottom, left/right)
- **Modern View**: Optional modern styling variant with fill icon support

### Usage

\`\`\`tsx
import { AccessRightSelect } from "@docspace/ui-kit/components/access-right-select";

<AccessRightSelect
  accessOptions={options}
  selectedOption={options[0]}
  onSelect={(option) => console.log(option)}
  size="content"
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    accessOptions: {
      control: "object",
      description: "Array of access right options to display in the dropdown",
    },
    selectedOption: {
      control: "object",
      description: "Currently selected access right option",
    },
    scaledOptions: {
      control: "boolean",
      description:
        "Whether dropdown options scale to the width of the container",
      table: { defaultValue: { summary: "false" } },
    },
    scaled: {
      control: "boolean",
      description: "Whether the select element scales to fill its container",
      table: { defaultValue: { summary: "false" } },
    },
    directionX: {
      control: { type: "select" },
      options: ["right", "left"],
      description: "Horizontal direction in which the dropdown opens",
      table: { defaultValue: { summary: "right" } },
    },
    size: {
      control: { type: "select" },
      options: Object.values(ComboBoxSize),
      description: "Size of the select element",
      table: { defaultValue: { summary: "content" } },
    },
    manualWidth: {
      control: "text",
      description: "Manually set width of the select element",
      table: { defaultValue: { summary: "fit-content" } },
    },
    isDisabled: {
      control: "boolean",
      description: "Whether the select element is disabled",
      table: { defaultValue: { summary: "false" } },
    },
    withoutBackground: {
      control: "boolean",
      description: "Removes background styling from the dropdown",
      table: { defaultValue: { summary: "false" } },
    },
    withBlur: {
      control: "boolean",
      description: "Applies a blur effect to the dropdown backdrop",
      table: { defaultValue: { summary: "false" } },
    },
    directionY: {
      control: { type: "select" },
      options: ["top", "bottom", "both"],
      description: "Vertical direction in which the dropdown opens",
      table: { defaultValue: { summary: "bottom" } },
    },
    isAside: {
      control: "boolean",
      description: "Whether to display the dropdown as a side panel",
      table: { defaultValue: { summary: "false" } },
    },
    isMobileView: {
      control: "boolean",
      description:
        "Whether to render the dropdown in mobile-optimized layout",
      table: { defaultValue: { summary: "false" } },
    },
    manualY: {
      control: "text",
      description: "Manually set vertical offset of the dropdown",
    },
    fixedDirection: {
      control: "boolean",
      description:
        "Prevents the dropdown from flipping direction when near viewport edges",
      table: { defaultValue: { summary: "false" } },
    },
    withBackground: {
      control: "boolean",
      description: "Adds background styling to the dropdown overlay",
      table: { defaultValue: { summary: "false" } },
    },
    shouldShowBackdrop: {
      control: "boolean",
      description: "Whether to show a backdrop behind the dropdown",
      table: { defaultValue: { summary: "false" } },
    },
    noBorder: {
      control: "boolean",
      description: "Removes the border from the select element",
      table: { defaultValue: { summary: "false" } },
    },
    isSelectionDisabled: {
      control: "boolean",
      description:
        "Disables selection and shows an error text when clicked",
      table: { defaultValue: { summary: "false" } },
    },
    topSpace: {
      control: "number",
      description: "Additional top spacing in pixels for the dropdown",
    },
    modernView: {
      control: "boolean",
      description: "Enables modern styling variant for the select element",
      table: { defaultValue: { summary: "false" } },
    },
    fillIcon: {
      control: "boolean",
      description:
        "Whether to use filled icon style in modern view mode",
      table: { defaultValue: { summary: "false" } },
    },
    isDefaultMode: {
      control: "boolean",
      description:
        "Whether to use default positioning mode instead of portal-based dropdown",
      table: { defaultValue: { summary: "true" } },
    },
    comboIcon: {
      control: "text",
      description: "Custom icon to display in the combobox toggle",
    },
    usePortalBackdrop: {
      control: "boolean",
      description: "Whether to render the backdrop using a React portal",
      table: { defaultValue: { summary: "true" } },
    },
    type: {
      control: { type: "select" },
      options: [undefined, "badge", "onlyIcon", "descriptive"],
      description:
        "Display type variant for the selected option rendering",
    },

    className: { table: { disable: true } },
    onSelect: { table: { disable: true } },
    advancedOptions: { table: { disable: true } },
  },
  args: {
    usePortalBackdrop: true,
  },
} satisfies Meta<typeof AccessRightSelect>;

type Story = StoryObj<ComponentProps<typeof AccessRightSelect>>;

export default meta;

const CssCustomizationTemplate = () => {
  return (
    <div
      style={
        {
          // === AccessRightSelect — item icon and text ===
          "--access-right-select-text": "#0082c9",
          "--access-right-select-icon": "#0082c9",
          "--access-right-select-description": "#5aa9d0",
          "--access-right-select-description-size": "12px",
          "--access-right-select-gap": "12px",
          "--access-right-select-item-padding": "10px 0",
          // === Combobox (trigger button) ===
          "--combobox-radius": "8px",
          "--combobox-open-bg": "#e6f3fb",
          // === DropDown (options panel) ===
          "--dropdown-bg": "#e6f3fb",
          "--dropdown-border-style": "1px solid #0082c9",
          "--dropdown-shadow": "0 4px 16px rgba(0, 130, 201, 0.25)",
          "--dropdown-radius": "12px",
          "--dropdown-text-size": "13px",
        } as CSSProperties
      }
    >
      <div style={{ height: "420px" }}>
        <AccessRightSelect
          accessOptions={data}
          selectedOption={data[0]}
          scaledOptions={false}
          scaled={false}
          directionX="right"
          size={ComboBoxSize.content}
          manualWidth="fit-content"
        />
      </div>
    </div>
  );
};

export const CssCustomization: Story = {
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

**AccessRightSelect — items**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--access-right-select-text\` | Icon fill color in onlyIcon mode | theme-based |
| \`--access-right-select-disabled-icon\` | Disabled icon color | theme-based |
| \`--access-right-select-icon\` | Item icon color | theme-based |
| \`--access-right-select-description\` | Item description text color | theme-based |
| \`--access-right-select-description-size\` | Description font size | \`13px\` |
| \`--access-right-select-gap\` | Gap between icon and text | \`8px\` |
| \`--access-right-select-item-padding\` | Item vertical padding | \`7px 0\` |

**Combobox (trigger button)**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--combobox-radius\` | Combobox border radius | \`3px\` |
| \`--combobox-open-bg\` | Background when open | theme-based |

**DropDown (options panel)**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--dropdown-bg\` | Panel background | theme-based |
| \`--dropdown-border-style\` | Panel border | theme-based |
| \`--dropdown-shadow\` | Panel shadow | theme-based |
| \`--dropdown-radius\` | Panel border radius | \`6px\` |
| \`--dropdown-text-size\` | Item font size | \`13px\` |`,
      },
    },
  },
};

export const Default: Story = {
  args: {
    accessOptions: data,
    selectedOption: data[0],
    scaledOptions: false,
    scaled: false,
    directionX: "right",
    size: ComboBoxSize.content,
    manualWidth: "fit-content",
  },
  render: (args) => (
    <Wrapper>
      <AccessRightSelect {...args} />
    </Wrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Default AccessRightSelect with a list of access rights including room administrator, full access, editing, review, comment, read only, and deny access options.",
      },
      source: {
        code: `<AccessRightSelect
  accessOptions={options}
  selectedOption={options[0]}
  scaledOptions={false}
  scaled={false}
  directionX="right"
  size="content"
  manualWidth="fit-content"
/>`,
      },
    },
  },
};
