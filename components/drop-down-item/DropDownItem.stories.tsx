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

import SettingsReactSvgUrl from "../../assets/settings.react.svg?url";

import { DropDownItem } from ".";

const meta = {
  title: "UI/Overlays/DropDownItem",
  component: DropDownItem,
  parameters: {
    docs: {
      description: {
        component: `A versatile dropdown item component used inside DropDown menus.

### Features

- **Multiple Modes**: Regular item, header, separator, and submenu
- **Icon Support**: Display icons alongside text labels
- **Toggle Switch**: Built-in toggle switch for boolean options
- **Badges**: Beta and paid/pro badge indicators
- **Selected State**: Visual indicator for the active selection
- **Disabled State**: Non-interactive state with optional tooltip
- **Text Overflow**: Automatic ellipsis for long labels
- **Keyboard Navigation**: Active descendant highlighting

### Usage

\`\`\`tsx
import { DropDownItem } from "@docspace/ui-kit/components/drop-down-item";

// Regular item with icon
<DropDownItem label="Settings" icon={SettingsIcon} onClick={handleClick} />

// Header
<DropDownItem isHeader label="Section Title" />

// Separator
<DropDownItem isSeparator />

// With toggle
<DropDownItem label="Enable Feature" withToggle checked={isEnabled} />
\`\`\``,
      },
    },
  },
  argTypes: {
    label: {
      control: "text",
      description: "Primary text content",
    },
    icon: {
      control: "text",
      description: "URL or path to the icon",
    },
    disabled: {
      control: "boolean",
      description: "Disables the item",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isSeparator: {
      control: "boolean",
      description: "Renders as a separator line",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isHeader: {
      control: "boolean",
      description: "Renders as a header item",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isSelected: {
      control: "boolean",
      description: "Shows selected state",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isSubMenu: {
      control: "boolean",
      description: "Shows submenu arrow",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isModern: {
      control: "boolean",
      description: "Uses modern compact styling",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    noHover: {
      control: "boolean",
      description: "Disables hover effect",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    noActive: {
      control: "boolean",
      description: "Disables active state",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withToggle: {
      control: "boolean",
      description: "Shows toggle switch",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    checked: {
      control: "boolean",
      description: "Toggle checked state (used with withToggle)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isBeta: {
      control: "boolean",
      description: "Shows beta badge",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isPaidBadge: {
      control: "boolean",
      description: "Shows paid badge",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    textOverflow: {
      control: "boolean",
      description: "Truncates text with ellipsis",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    fillIcon: {
      control: "boolean",
      description: "Fills icon with text color",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isActiveDescendant: {
      control: "boolean",
      description: "Keyboard navigation active state",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    minWidth: {
      control: "text",
      description: "Minimum width of the item",
    },
    onClick: {
      action: "clicked",
      description: "Callback when the item is clicked",
    },
  },
} satisfies Meta<typeof DropDownItem>;

type Story = StoryObj<ComponentProps<typeof DropDownItem>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        width: "250px",
      }}
    >
      {props.children}
    </div>
  );
};

export const Default: Story = {
  render: (args) => <DropDownItem {...args} />,
  args: {
    label: "Default Item",
  },
};

const ItemTypesTemplate = () => {
  return (
    <Wrapper>
      <DropDownItem isHeader label="Header Item" />
      <DropDownItem label="Regular Item" />
      <DropDownItem label="With Icon" icon={SettingsReactSvgUrl} />
      <DropDownItem isSeparator />
      <DropDownItem label="Selected Item" isSelected />
      <DropDownItem label="Disabled Item" disabled />
    </Wrapper>
  );
};

export const ItemTypes: Story = {
  render: () => <ItemTypesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "All available item types: header, regular, with icon, separator, selected, and disabled.",
      },
      source: {
        code: `<DropDownItem isHeader label="Header Item" />
<DropDownItem label="Regular Item" />
<DropDownItem label="With Icon" icon={SettingsIcon} />
<DropDownItem isSeparator />
<DropDownItem label="Selected Item" isSelected />
<DropDownItem label="Disabled Item" disabled />`,
      },
    },
  },
};

const WithToggleTemplate = () => {
  return (
    <Wrapper>
      <DropDownItem label="Toggle Off" withToggle checked={false} />
      <DropDownItem label="Toggle On" withToggle checked />
    </Wrapper>
  );
};

export const WithToggle: Story = {
  render: () => <WithToggleTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Items with built-in toggle switches for boolean options. Shows both unchecked and checked states.",
      },
      source: {
        code: `<DropDownItem label="Toggle Off" withToggle checked={false} />
<DropDownItem label="Toggle On" withToggle checked />`,
      },
    },
  },
};

const WithBadgesTemplate = () => {
  return (
    <Wrapper>
      <DropDownItem
        label="New Feature"
        icon={SettingsReactSvgUrl}
        isBeta
        betaLabel="Beta"
      />
      <DropDownItem
        label="Premium Feature"
        icon={SettingsReactSvgUrl}
        isPaidBadge
        paidLabel="Pro"
      />
    </Wrapper>
  );
};

export const WithBadges: Story = {
  render: () => <WithBadgesTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Items with beta and paid/pro badges to indicate feature availability.",
      },
      source: {
        code: `<DropDownItem label="New Feature" icon={SettingsIcon} isBeta betaLabel="Beta" />
<DropDownItem label="Premium Feature" icon={SettingsIcon} isPaidBadge paidLabel="Pro" />`,
      },
    },
  },
};

const SubmenuTemplate = () => {
  return (
    <Wrapper>
      <DropDownItem
        label="Open Submenu"
        icon={SettingsReactSvgUrl}
        isSubMenu
      />
      <DropDownItem
        label="Active Submenu"
        icon={SettingsReactSvgUrl}
        isSubMenu
        isActive
      />
    </Wrapper>
  );
};

export const Submenu: Story = {
  render: () => <SubmenuTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Items with submenu arrows. Shows both default and active submenu states.",
      },
      source: {
        code: `<DropDownItem label="Open Submenu" icon={SettingsIcon} isSubMenu />
<DropDownItem label="Active Submenu" icon={SettingsIcon} isSubMenu isActive />`,
      },
    },
  },
};

const WithAdditionalElementTemplate = () => {
  return (
    <Wrapper>
      <DropDownItem
        label="Save"
        icon={SettingsReactSvgUrl}
        additionalElement={<span style={{ color: "#999" }}>Ctrl+S</span>}
      />
      <DropDownItem
        label="Copy"
        icon={SettingsReactSvgUrl}
        additionalElement={<span style={{ color: "#999" }}>Ctrl+C</span>}
      />
    </Wrapper>
  );
};

export const WithAdditionalElement: Story = {
  render: () => <WithAdditionalElementTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Items with additional elements such as keyboard shortcuts displayed alongside the label.",
      },
      source: {
        code: `<DropDownItem label="Save" icon={SettingsIcon} additionalElement={<span>Ctrl+S</span>} />
<DropDownItem label="Copy" icon={SettingsIcon} additionalElement={<span>Ctrl+C</span>} />`,
      },
    },
  },
};

const HeaderWithArrowTemplate = () => {
  return (
    <Wrapper>
      <DropDownItem
        label="Header with Back"
        isHeader
        withHeaderArrow
      />
      <DropDownItem label="Option 1" />
      <DropDownItem label="Option 2" />
    </Wrapper>
  );
};

export const HeaderWithArrow: Story = {
  render: () => <HeaderWithArrowTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Header item with a back arrow for navigating submenu levels.",
      },
      source: {
        code: `<DropDownItem label="Header with Back" isHeader withHeaderArrow />`,
      },
    },
  },
};

const TextOverflowTemplate = () => {
  return (
    <Wrapper>
      <DropDownItem
        label="This is a very long item label that should trigger text overflow ellipsis when the container is too small"
        textOverflow
        minWidth="200px"
      />
    </Wrapper>
  );
};

export const WithTextOverflow: Story = {
  render: () => <TextOverflowTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Long labels are automatically truncated with ellipsis when `textOverflow` is enabled.",
      },
      source: {
        code: `<DropDownItem label="Very long text..." textOverflow minWidth="200px" />`,
      },
    },
  },
};
