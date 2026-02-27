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
import type { TGroupMenuItem } from "../../Table.types";

import { GroupMenuItem } from "./GroupMenuItem";

const meta = {
  title: "UI/Table/GroupMenuItem",
  component: GroupMenuItem,
  parameters: {
    docs: {
      description: {
        component: `GroupMenuItem renders an individual action button within the TableGroupMenu toolbar.

### Features

- **Icon Support**: Displays an icon alongside the action label
- **Dropdown Options**: Can expand into a dropdown with sub-options
- **Blocked State**: Disables the item when bulk operations are in progress
- **Disabled State**: Individual items can be disabled independently

### Usage

\`\`\`tsx
import { GroupMenuItem } from "@docspace/ui-kit/components/table/sub-components/group-menu-item";

<GroupMenuItem
  item={{
    id: "action-1",
    label: "Move",
    title: "Move selected items",
    iconUrl: moveIconUrl,
    onClick: handleMove,
    disabled: false,
  }}
  isBlocked={false}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    isBlocked: {
      control: "boolean",
      description:
        "Block the menu item while a bulk operation is in progress",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    item: {
      control: false,
      description: "Menu item configuration object with label, icon, and click handler",
    },
  },
} satisfies Meta<typeof GroupMenuItem>;

type Story = StoryObj<ComponentProps<typeof GroupMenuItem>>;

export default meta;

const createMenuItem = (
  overrides: Partial<TGroupMenuItem> = {},
): TGroupMenuItem => {
  return {
    label: "Menu Item",
    disabled: false,
    onClick: () => {},
    iconUrl: "",
    title: "Menu Item Title",
    withDropDown: false,
    options: [],
    id: "group-menu-item",
    ...overrides,
  };
};

export const Default: Story = {
  render: (args) => <GroupMenuItem {...args} />,
  args: {
    item: createMenuItem(),
    isBlocked: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default group menu item with a label and click handler. Renders as a simple action button.",
      },
      source: {
        code: `<GroupMenuItem
  item={{
    id: "group-menu-item",
    label: "Menu Item",
    title: "Menu Item Title",
    iconUrl: "",
    onClick: handleClick,
    disabled: false,
  }}
  isBlocked={false}
/>`,
      },
    },
  },
};

export const WithDropdown: Story = {
  render: (args) => <GroupMenuItem {...args} />,
  args: {
    item: createMenuItem({
      withDropDown: true,
      options: [
        {
          key: "option-1",
          label: "Option 1",
          onClick: () => {},
        },
        {
          key: "option-2",
          label: "Option 2",
          onClick: () => {},
        },
      ],
    }),
    isBlocked: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Group menu item with a dropdown containing sub-options. Click to expand the dropdown list.",
      },
      source: {
        code: `<GroupMenuItem
  item={{
    id: "group-menu-item",
    label: "Menu Item",
    title: "Menu Item Title",
    iconUrl: "",
    onClick: handleClick,
    disabled: false,
    withDropDown: true,
    options: [
      { key: "option-1", label: "Option 1", onClick: handleOption1 },
      { key: "option-2", label: "Option 2", onClick: handleOption2 },
    ],
  }}
  isBlocked={false}
/>`,
      },
    },
  },
};

export const Blocked: Story = {
  render: (args) => <GroupMenuItem {...args} />,
  args: {
    item: createMenuItem(),
    isBlocked: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Group menu item in a blocked state. The item is disabled and cannot be interacted with.",
      },
      source: {
        code: `<GroupMenuItem
  item={{
    id: "group-menu-item",
    label: "Menu Item",
    title: "Menu Item Title",
    iconUrl: "",
    onClick: handleClick,
    disabled: false,
  }}
  isBlocked
/>`,
      },
    },
  },
};
