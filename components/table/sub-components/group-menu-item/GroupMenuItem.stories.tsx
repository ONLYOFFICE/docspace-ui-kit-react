import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor } from "storybook/test";
import type { TGroupMenuItem } from "../../Table.types";

import { GroupMenuItem } from "./GroupMenuItem";

const meta = {
  title: "UI/Table/GroupMenuItem",
  component: GroupMenuItem,
  parameters: {
    docs: {
      description: {
        component: `GroupMenuItem is one action button of a TableGroupMenu, the toolbar that replaces the table header while rows are selected.

The Table README describes it in full.`,
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
  beforeEach: () => {
    onItemClick.mockClear();
    onFirstOption.mockClear();
    onSecondOption.mockClear();
  },
} satisfies Meta<typeof GroupMenuItem>;

type Story = StoryObj<ComponentProps<typeof GroupMenuItem>>;

export default meta;

const onItemClick = fn();
const onFirstOption = fn();
const onSecondOption = fn();

// The menu of options is portalled and stays mounted while closed.
const shownOption = (name: string) =>
  screen
    .queryAllByRole("option", { name })
    .find((option) => option.checkVisibility());

const createMenuItem = (
  overrides: Partial<TGroupMenuItem> = {},
): TGroupMenuItem => {
  return {
    label: "Menu Item",
    disabled: false,
    onClick: onItemClick,
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
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByTestId("group-menu-item-button");
    await expect(button).toHaveTextContent("Menu Item");
    await userEvent.click(button);
    await expect(onItemClick).toHaveBeenCalledTimes(1);
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
          onClick: onFirstOption,
        },
        {
          key: "option-2",
          label: "Option 2",
          onClick: onSecondOption,
        },
      ],
    }),
    isBlocked: false,
  },
  play: async ({ canvas, userEvent }) => {
    await expect(shownOption("Option 1")).toBeUndefined();
    // The button opens its options; picking one closes them.
    await userEvent.click(canvas.getByTestId("group-menu-item-button"));
    await expect(onItemClick).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(shownOption("Option 2")).toBeDefined());
    await userEvent.click(shownOption("Option 2") as HTMLElement);
    await expect(onSecondOption).toHaveBeenCalledTimes(1);
    await expect(onFirstOption).not.toHaveBeenCalled();
    await waitFor(() => expect(shownOption("Option 2")).toBeUndefined());
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
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId("group-menu-item-button")).toBeDisabled();
    await expect(onItemClick).not.toHaveBeenCalled();
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
