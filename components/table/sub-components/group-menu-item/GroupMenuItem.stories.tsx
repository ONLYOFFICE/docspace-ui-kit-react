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
import { GroupMenuItem } from "@onlyoffice/apps-ui-kit/components/table/sub-components/group-menu-item";

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
