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
        component: `GroupMenuItem is one action button of a TableGroupMenu, the toolbar that replaces the table header while rows are selected.

### Features

- **Icon and Label**: Draws the icon fetched from \`iconUrl\` before the label, with \`title\` as the hover tooltip and the label as the tooltip when \`title\` is empty
- **Action Menu**: With \`withDropDown\`, opens its \`options\` in a menu under the button on click, after calling \`onClick\`
- **Menu Sizing**: Widens the menu to 354 pixels when its options carry descriptions, or with \`fixedDropdownStyles\` makes it 161 pixels wide and five rows high at most
- **Left Out When Disabled**: Renders nothing at all while the item's \`disabled\` is set, so an action that does not apply to the selection disappears from the toolbar
- **Blocked State**: With \`isBlocked\`, greys the button and its icon out and ignores clicks, while an operation on the selection is still running
- **Narrow Layouts**: Puts the icon above the label on a tablet and hides the label on a phone, leaving the icon alone

### Accessibility

The item renders a native \`<button>\` through Button, which supplies what keyboard and screen-reader users get:

- Focusable with Tab and activated with Enter and Space
- The label is the button's accessible name, even on a phone where it is not drawn
- \`isBlocked\` sets the native \`disabled\`, which takes the button out of the tab order

### Usage

\`\`\`tsx
// GroupMenuItem is not exported on its own: TableGroupMenu renders one per headerMenu entry
import { TableGroupMenu } from "@onlyoffice/apps-ui-kit/components/table";

<TableGroupMenu
  headerMenu={[
    { id: "move", label: "Move", title: "Move", iconUrl: moveIconUrl, disabled: false, onClick: handleMove },
    {
      id: "share", label: "Share", title: "Share", iconUrl: shareIconUrl, disabled: false, onClick: () => {},
      withDropDown: true,
      options: [{ key: "link", label: "Copy link", onClick: copyLink }],
    },
  ]}
  {...groupMenuProps}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    isBlocked: {
      control: "boolean",
      description: "Greys the button out and ignores clicks on it",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    item: {
      control: false,
      description:
        "The action: its label, icon URL, tooltip, click handler, and the options of its menu when it has one",
    },
    dataTestId: {
      control: "text",
      description: "Value of the item's `data-testid` attribute",
      table: {
        defaultValue: { summary: "group-menu-item" },
      },
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
          "A single action applied to every selected row with one click, the most common entry of a group menu; change any other prop live in the Controls panel below.",
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
          "An action with variants: click the button and pick one of its options from the menu under it (`withDropDown`, `options`).",
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
          "The same button greyed out and ignoring clicks, while an operation on the selection is still running (`isBlocked`).",
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
