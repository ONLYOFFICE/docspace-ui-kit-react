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

import type { Meta, StoryObj } from "@storybook/react";

import SettingsReactSvgUrl from "../../assets/settings.react.svg?url";

import { DropDownItem } from ".";

const meta = {
  title: "Base UI Components/DropDownItem",
  component: DropDownItem,
  parameters: {
    docs: {
      description: {
        component:
          "A versatile dropdown item component used for menus, lists, and selection interfaces. Supports various display modes including separator, header, submenu, and interactive states.",
      },
    },
  },
  argTypes: {
    onClick: { action: "clicked" },
    onMouseDown: { action: "mouseDown" },
    onClickSelectedItem: { action: "clickedSelectedItem" },
    headerArrowAction: { action: "headerArrowClicked" },
    icon: {
      control: "text",
      description: "URL or path to the icon",
    },
    label: {
      control: "text",
      description: "Primary text content",
    },
    disabled: {
      control: "boolean",
      description: "Disables the item",
    },
    isSeparator: {
      control: "boolean",
      description: "Renders as a separator line",
    },
    isHeader: {
      control: "boolean",
      description: "Renders as a header item",
    },
    isSelected: {
      control: "boolean",
      description: "Shows selected state",
    },
    isSubMenu: {
      control: "boolean",
      description: "Shows submenu arrow",
    },
    isModern: {
      control: "boolean",
      description: "Uses modern compact styling",
    },
    noHover: {
      control: "boolean",
      description: "Disables hover effect",
    },
    noActive: {
      control: "boolean",
      description: "Disables active state",
    },
    withToggle: {
      control: "boolean",
      description: "Shows toggle switch",
    },
    checked: {
      control: "boolean",
      description: "Toggle checked state",
    },
    isBeta: {
      control: "boolean",
      description: "Shows beta badge",
    },
    isPaidBadge: {
      control: "boolean",
      description: "Shows paid badge",
    },
    textOverflow: {
      control: "boolean",
      description: "Truncates text with ellipsis",
    },
    fillIcon: {
      control: "boolean",
      description: "Fills icon with text color",
    },
    withoutIcon: {
      control: "boolean",
      description: "Hides icon even when provided",
    },
    isActiveDescendant: {
      control: "boolean",
      description: "Keyboard navigation active state",
    },
    minWidth: {
      control: "text",
      description: "Minimum width of the item",
    },
  },
} satisfies Meta<typeof DropDownItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Default Item",
  },
};

export const WithIcon: Story = {
  args: {
    label: "Settings",
    icon: SettingsReactSvgUrl,
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Item",
    icon: SettingsReactSvgUrl,
    disabled: true,
  },
};

export const Selected: Story = {
  args: {
    label: "Selected Item",
    isSelected: true,
  },
};

export const Separator: Story = {
  args: {
    isSeparator: true,
  },
};

export const Header: Story = {
  args: {
    label: "Header Item",
    isHeader: true,
  },
};

export const HeaderWithArrow: Story = {
  args: {
    label: "Header with Back",
    isHeader: true,
    withHeaderArrow: true,
  },
};

export const Submenu: Story = {
  args: {
    label: "Open Submenu",
    icon: SettingsReactSvgUrl,
    isSubMenu: true,
  },
};

export const SubmenuActive: Story = {
  args: {
    label: "Active Submenu",
    icon: SettingsReactSvgUrl,
    isSubMenu: true,
    isActive: true,
  },
};

export const WithToggle: Story = {
  args: {
    label: "Toggle Feature",
    withToggle: true,
    checked: false,
  },
};

export const WithToggleChecked: Story = {
  args: {
    label: "Feature Enabled",
    withToggle: true,
    checked: true,
  },
};

export const WithBetaBadge: Story = {
  args: {
    label: "New Feature",
    icon: SettingsReactSvgUrl,
    isBeta: true,
    betaLabel: "Beta",
  },
};

export const WithPaidBadge: Story = {
  args: {
    label: "Premium Feature",
    icon: SettingsReactSvgUrl,
    isPaidBadge: true,
    paidLabel: "Pro",
  },
};

export const Modern: Story = {
  args: {
    label: "Modern Style",
    icon: SettingsReactSvgUrl,
    isModern: true,
  },
};

export const WithTextOverflow: Story = {
  args: {
    label:
      "This is a very long item label that should trigger text overflow ellipsis when the container is too small",
    textOverflow: true,
    minWidth: "200px",
  },
};

export const ActiveDescendant: Story = {
  args: {
    label: "Keyboard Focused",
    isActiveDescendant: true,
  },
};

export const NoHover: Story = {
  args: {
    label: "No Hover Effect",
    noHover: true,
  },
};

export const WithAdditionalElement: Story = {
  args: {
    label: "With Extra Content",
    icon: SettingsReactSvgUrl,
    additionalElement: <span style={{ color: "#999" }}>Ctrl+S</span>,
  },
};

export const IconNotFilled: Story = {
  args: {
    label: "Original Icon Colors",
    icon: SettingsReactSvgUrl,
    fillIcon: false,
  },
};

export const DisabledWithTooltip: Story = {
  args: {
    label: "Disabled with Tooltip",
    disabled: true,
    tooltip: "This feature is not available",
  },
};
