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

import { AddButton, type AddButtonProps } from ".";

const meta: Meta<typeof AddButton> = {
  title: "components/Interactive elements/AddButton",
  component: AddButton,
  parameters: {
    docs: {
      description: {
        component:
          "Button component for adding items in selectors with optional label, loading state, and accent styling.",
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "Tooltip text",
    },
    label: {
      control: "text",
      description: "Text label next to the button",
    },
    onClick: {
      action: "clicked",
      description: "Click handler",
    },
    isDisabled: {
      control: "boolean",
      description: "Disabled state",
    },
    isAction: {
      control: "boolean",
      description: "Use accent colors",
    },
    isLoading: {
      control: "boolean",
      description: "Show loading spinner",
    },
    iconName: {
      control: "text",
      description: "Custom icon URL",
    },
    iconSize: {
      control: "number",
      description: "Icon size in pixels",
    },
    size: {
      control: "text",
      description: "Button container size",
    },
    fontSize: {
      control: "text",
      description: "Label font size",
    },
    truncate: {
      control: "boolean",
      description: "Truncate label text",
    },
    className: {
      control: "text",
      description: "Additional CSS class",
    },
    id: {
      control: "text",
      description: "HTML id attribute",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AddButton>;

export const Default: Story = {
  args: {
    title: "Add item",
  },
};

export const WithLabel: Story = {
  args: {
    title: "Add new user",
    label: "Add user",
  },
};

export const Disabled: Story = {
  args: {
    title: "Add item",
    isDisabled: true,
  },
};

export const DisabledWithLabel: Story = {
  args: {
    title: "Add item",
    label: "Add user",
    isDisabled: true,
  },
};

export const AccentStyle: Story = {
  args: {
    title: "Create new",
    isAction: true,
  },
};

export const Loading: Story = {
  args: {
    title: "Adding...",
    isLoading: true,
  },
};

export const CustomIconSize: Story = {
  args: {
    title: "Add item",
    iconSize: 16,
  },
};

export const TruncatedLabel: Story = {
  render: (args: AddButtonProps) => (
    <div style={{ width: "150px" }}>
      <AddButton {...args} />
    </div>
  ),
  args: {
    title: "Add item",
    label: "This is a very long label that should be truncated",
    truncate: true,
  },
};
