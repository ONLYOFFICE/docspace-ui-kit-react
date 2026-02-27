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

import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { LinkWithDropdown } from ".";

const meta = {
  title: "UI/Interactive elements/LinkWithDropdown",
  component: LinkWithDropdown,
  parameters: {
    docs: {
      description: {
        component: `A link component that expands to show a dropdown menu of options.

### Features

- **Dashed Underline**: Configurable underline style (always or on hover)
- **Custom Text Styles**: Configurable font size, weight, and color
- **Expander Icon**: Optional arrow icon indicator
- **Disabled State**: Non-interactive state with dimmed appearance
- **Semitransparent Mode**: Reduced opacity style variant
- **Custom Width**: Manual dropdown width control
- **Direction Control**: Vertical dropdown direction (top/bottom)

### Accessibility

- \`aria-expanded\`: Indicates dropdown open state
- \`aria-haspopup\`: Indicates popup menu presence
- Keyboard navigation support

### Usage

\`\`\`tsx
import { LinkWithDropdown } from "@docspace/ui-kit/components/link-with-dropdown";

<LinkWithDropdown
  data={[
    { key: "1", label: "Option 1", onClick: handleClick },
    { key: "2", label: "Option 2", onClick: handleClick },
  ]}
>
  Click me
</LinkWithDropdown>
\`\`\``,
      },
    },
  },
  argTypes: {
    children: {
      control: "text",
      description: "Content displayed as the link text",
    },
    data: {
      control: "object",
      description: "Array of dropdown items with key, label, onClick, and optional isSeparator",
    },
    fontSize: {
      control: "text",
      description: "Font size of the link text",
      table: {
        defaultValue: { summary: "13px" },
      },
    },
    fontWeight: {
      control: "text",
      description: "CSS font-weight value (number or string)",
    },
    isBold: {
      control: "boolean",
      description: "Quick way to make text bold",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    color: {
      control: "color",
      description: "Text color of the link",
    },
    isDisabled: {
      control: "boolean",
      description: "Disables the dropdown functionality",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withExpander: {
      control: "boolean",
      description: "Shows/hides the expander arrow icon",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isSemitransparent: {
      control: "boolean",
      description: "Makes the link semi-transparent",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isTextOverflow: {
      control: "boolean",
      description: "Truncates long text with ellipsis",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    dropdownType: {
      control: "select",
      options: ["alwaysDashed", "appearDashedAfterHover"],
      description: "Determines when the dashed underline appears",
      table: {
        defaultValue: { summary: "alwaysDashed" },
      },
    },
    manualWidth: {
      control: "text",
      description: "Sets a custom width for the dropdown menu",
    },
    directionY: {
      control: "select",
      options: ["top", "bottom"],
      description: "Sets the vertical direction of the dropdown",
      table: {
        defaultValue: { summary: "bottom" },
      },
    },
    fixedDirection: {
      control: "boolean",
      description: "Fixes the direction of the dropdown menu",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "20px", marginBottom: "200px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LinkWithDropdown>;

type Story = StoryObj<ComponentProps<typeof LinkWithDropdown>>;

export default meta;

const dropdownItems = [
  {
    key: "key1",
    label: "Button 1",
    onClick: () => console.log("Button 1 clicked"),
  },
  {
    key: "key2",
    label: "Button 2",
    onClick: () => console.log("Button 2 clicked"),
  },
  {
    key: "key3",
    isSeparator: true,
  },
  {
    key: "key4",
    label: "Button 3",
    onClick: () => console.log("Button 3 clicked"),
  },
];

export const Default: Story = {
  render: (args) => <LinkWithDropdown {...args} />,
  args: {
    children: "Default Link",
    data: dropdownItems,
    fontSize: "13px",
    fontWeight: 400,
    isBold: false,
    isTextOverflow: false,
    isSemitransparent: false,
    directionY: "bottom",
    fixedDirection: true,
    isDefaultMode: false,
  },
};

const WithExpanderTemplate = () => {
  return (
    <LinkWithDropdown
      data={dropdownItems}
      fontSize="13px"
      withExpander
      directionY="bottom"
      fixedDirection
      isDefaultMode={false}
    >
      Link with Expander
    </LinkWithDropdown>
  );
};

export const WithExpander: Story = {
  render: () => <WithExpanderTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Link with an expander arrow icon that indicates the presence of a dropdown menu.",
      },
      source: {
        code: `<LinkWithDropdown data={items} withExpander>Link with Expander</LinkWithDropdown>`,
      },
    },
  },
};

const CustomStylingTemplate = () => {
  return (
    <LinkWithDropdown
      data={dropdownItems}
      fontSize="16px"
      fontWeight={600}
      isBold
      color="#4781d1"
      directionY="bottom"
      fixedDirection
      isDefaultMode={false}
    >
      Custom Styled Link
    </LinkWithDropdown>
  );
};

export const CustomStyling: Story = {
  render: () => <CustomStylingTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Link with custom font size, weight, and color for styled appearance.",
      },
      source: {
        code: `<LinkWithDropdown data={items} fontSize="16px" fontWeight={600} isBold color="#4781d1">
  Custom Styled Link
</LinkWithDropdown>`,
      },
    },
  },
};

const DisabledTemplate = () => {
  return (
    <LinkWithDropdown data={dropdownItems} fontSize="13px" isDisabled>
      Disabled Link
    </LinkWithDropdown>
  );
};

export const Disabled: Story = {
  render: () => <DisabledTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Disabled link that cannot open the dropdown. Appears dimmed to indicate non-interactive state.",
      },
      source: {
        code: `<LinkWithDropdown data={items} isDisabled>Disabled Link</LinkWithDropdown>`,
      },
    },
  },
};

const SemiTransparentTemplate = () => {
  return (
    <LinkWithDropdown
      data={dropdownItems}
      fontSize="13px"
      isSemitransparent
      directionY="bottom"
      fixedDirection
      isDefaultMode={false}
    >
      Semi-transparent Link
    </LinkWithDropdown>
  );
};

export const SemiTransparent: Story = {
  render: () => <SemiTransparentTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Link with reduced opacity for a subtle, secondary appearance.",
      },
      source: {
        code: `<LinkWithDropdown data={items} isSemitransparent>Semi-transparent Link</LinkWithDropdown>`,
      },
    },
  },
};

const WithCustomWidthTemplate = () => {
  return (
    <LinkWithDropdown
      data={dropdownItems}
      fontSize="13px"
      manualWidth="300px"
      directionY="bottom"
      fixedDirection
      isDefaultMode={false}
    >
      Custom Width Link
    </LinkWithDropdown>
  );
};

export const WithCustomWidth: Story = {
  render: () => <WithCustomWidthTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Link with a manually set dropdown width for controlling the menu size.",
      },
      source: {
        code: `<LinkWithDropdown data={items} manualWidth="300px">Custom Width Link</LinkWithDropdown>`,
      },
    },
  },
};
