import type { ComponentProps, CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor, within } from "storybook/test";
import type { TGroupMenuItem } from "../Table.types";

import ChangeToEmployeeReactSvgUrl from "../../../assets/change.to.employee.react.svg?url";
import InfoReactSvgUrl from "../../../assets/info.outline.react.svg?url";
import InviteAgainReactSvgUrl from "../../../assets/invite.again.react.svg?url";

import { TableGroupMenu } from "./TableGroupMenu";
import { DropDownItem } from "../../drop-down-item";

const meta = {
  title: "UI/Table/TableGroupMenu",
  component: TableGroupMenu,
  parameters: {
    docs: {
      description: {
        component: `TableGroupMenu is the toolbar that takes the place of the table header while rows are selected, with a select-all checkbox and the actions that apply to the selection.

The Table README describes it in full.`,
      },
    },
  },
  argTypes: {
    isChecked: {
      control: "boolean",
      description: "Ticks the select-all checkbox.",
    },
    isIndeterminate: {
      control: "boolean",
      description:
        "Draws the select-all checkbox partly ticked, for a selection that covers some rows but not all.",
    },
    headerMenu: {
      control: false,
      description:
        "The action buttons, in order. An entry whose `disabled` is set is left out.",
    },
    checkboxOptions: {
      control: false,
      description:
        "Element whose children become the options of the menu the arrow after the checkbox opens.",
    },
    withComboBox: {
      control: "boolean",
      description:
        "Shows the arrow after the checkbox that opens `checkboxOptions`.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    headerLabel: {
      control: "text",
      description: "Text shown in place of the select-all checkbox.",
    },
    checkboxMargin: {
      control: "text",
      description:
        "Space before the checkbox or the label as a CSS length, such as `12px`. Tablets and phones always use 24px.",
      table: {
        defaultValue: { summary: "28px" },
      },
    },
    isBlocked: {
      control: "boolean",
      description: "Greys every action button out and ignores clicks on them.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isMobileView: {
      control: "boolean",
      description:
        "Opens the selection menu and the action menus in their phone form.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withoutInfoPanelToggler: {
      control: "boolean",
      description: "Leaves out the info panel button at the end.",
    },
    isInfoPanelVisible: {
      control: "boolean",
      description:
        "Draws the info panel button in the accent colour on a round background.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isCloseable: {
      control: "boolean",
      description:
        "Adds a cross before the info panel button. It comes together with `onCloseClick`.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onChange: {
      action: "onChange",
      description:
        "Called with the new state when the select-all checkbox is clicked.",
    },
    onClick: {
      action: "onClick",
      description: "Called on a click anywhere in the toolbar.",
    },
    toggleInfoPanel: {
      action: "toggleInfoPanel",
      description: "Called when the info panel button is clicked.",
    },
    onCloseClick: {
      action: "onCloseClick",
      description: "Called when the cross is clicked.",
    },
  },
  decorators: [
    (Story) => {
      return (
        <div style={{ height: "68px" }}>
          <Story />
        </div>
      );
    },
  ],
} satisfies Meta<typeof TableGroupMenu>;

type TableGroupMenuProps = ComponentProps<typeof TableGroupMenu>;
type Story = StoryObj<TableGroupMenuProps>;

export default meta;

// The typed `render` parameter costs `play` its context type.
type PlayContext = Parameters<NonNullable<Story["play"]>>[0];

const onChangeType = fn();
const onInfoItem = fn();
const onInviteItem = fn();
const onActiveOption = fn();

const menu = (canvas: { getByTestId: (id: string) => HTMLElement }) =>
  canvas.getByTestId("table-group-menu");

// A toolbar action's button.
const action = (root: HTMLElement, id: string) =>
  within(within(root).getByTestId(`table_group_menu_item_${id}`)).getByTestId(
    "group-menu-item-button",
  );

const createMenuItems = (): TGroupMenuItem[] => [
  {
    id: "menu-change-type",
    disabled: false,
    label: "Change type",
    title: "Change type",
    iconUrl: ChangeToEmployeeReactSvgUrl,
    onClick: onChangeType,
    withDropDown: true,
    options: [
      {
        key: "option-1",
        label: "Option 1",
        onClick: fn(),
      },
      {
        key: "option-2",
        label: "Option 2",
        onClick: fn(),
      },
    ],
  },
  {
    id: "menu-info",
    label: "Info",
    title: "Info",
    disabled: false,
    onClick: onInfoItem,
    iconUrl: InfoReactSvgUrl,
  },
  {
    id: "menu-invite",
    label: "Invite",
    title: "Invite",
    disabled: false,
    onClick: onInviteItem,
    iconUrl: InviteAgainReactSvgUrl,
  },
];

const checkboxOptions = (
  <>
    <DropDownItem key="all" label="All" data-index={0} onClick={fn()} />
    <DropDownItem
      key="active"
      label="Active"
      data-index={1}
      onClick={onActiveOption}
    />
  </>
);

export const Default: Story = {
  name: "Rows selected",
  render: (args: TableGroupMenuProps) => <TableGroupMenu {...args} />,
  args: {
    isChecked: false,
    isIndeterminate: false,
    headerMenu: createMenuItems(),
    checkboxOptions,
    onClick: fn(),
    onChange: fn(),
    withoutInfoPanelToggler: false,
    isInfoPanelVisible: false,
    toggleInfoPanel: fn(),
    isBlocked: false,
    withComboBox: true,
  },
  beforeEach: () => {
    onInfoItem.mockClear();
    onActiveOption.mockClear();
  },
  play: async ({ args, canvas, userEvent }: PlayContext) => {
    const toolbar = menu(canvas);
    // The select-all checkbox asks for the opposite of its state.
    const checkbox = within(toolbar).getByRole("checkbox");
    await expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    await expect(args.onChange).toHaveBeenCalledWith(true);

    await userEvent.click(action(toolbar, "menu-info"));
    await expect(onInfoItem).toHaveBeenCalledTimes(1);
    await expect(args.onClick).toHaveBeenCalled();

    // The arrow beside the checkbox offers what to select.
    await userEvent.click(
      within(
        within(toolbar).getByTestId("table_group_menu_combobox"),
      ).getByRole("button"),
    );
    const active = await waitFor(() => {
      const option = screen
        .getAllByRole("option", { name: "Active" })
        .find((item) => item.checkVisibility());
      expect(option).toBeDefined();
      return option as HTMLElement;
    });
    await userEvent.click(active);
    await expect(onActiveOption).toHaveBeenCalledTimes(1);

    await userEvent.click(
      within(toolbar).getByTestId("info-panel-toggle-button"),
    );
    await expect(args.toggleInfoPanel).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The toolbar a user sees after selecting rows, with the actions that apply to them.",
      },
      source: {
        code: `<TableGroupMenu
  isChecked={false}
  isIndeterminate={false}
  headerMenu={menuItems}
  checkboxOptions={checkboxDropdown}
  onChange={handleChange}
  onClick={handleClick}
  withComboBox
/>`,
      },
    },
  },
};

export const Checked: Story = {
  name: "All selected",
  render: (args: TableGroupMenuProps) => <TableGroupMenu {...args} />,
  args: {
    ...Default.args,
    isChecked: true,
  },
  play: async ({ args, canvas, userEvent }: PlayContext) => {
    const checkbox = within(menu(canvas)).getByRole("checkbox");
    await expect(checkbox).toBeChecked();
    await userEvent.click(checkbox);
    await expect(args.onChange).toHaveBeenCalledWith(false);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Every row is selected, so the checkbox is ticked and a click on it clears the selection (`isChecked`).",
      },
      source: {
        code: `<TableGroupMenu
  isChecked
  headerMenu={menuItems}
  checkboxOptions={checkboxDropdown}
  onChange={handleChange}
  onClick={handleClick}
  withComboBox
/>`,
      },
    },
  },
};

export const Indeterminate: Story = {
  name: "Some selected",
  render: (args: TableGroupMenuProps) => <TableGroupMenu {...args} />,
  args: {
    ...Default.args,
    isIndeterminate: true,
  },
  play: async ({ canvas }: PlayContext) => {
    await expect(
      within(menu(canvas)).getByRole("checkbox"),
    ).toBePartiallyChecked();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Some rows but not all are selected, so the checkbox is partly ticked and a click on it selects the rest (`isIndeterminate`).",
      },
      source: {
        code: `<TableGroupMenu
  isIndeterminate
  headerMenu={menuItems}
  checkboxOptions={checkboxDropdown}
  onChange={handleChange}
  onClick={handleClick}
  withComboBox
/>`,
      },
    },
  },
};

export const WithHeaderLabel: Story = {
  name: "Label instead of checkbox",
  render: (args: TableGroupMenuProps) => <TableGroupMenu {...args} />,
  args: {
    ...Default.args,
    headerLabel: "Custom header label",
  },
  play: async ({ canvas }: PlayContext) => {
    const toolbar = menu(canvas);
    await expect(
      within(toolbar).getByText("Custom header label"),
    ).toBeVisible();
    await expect(within(toolbar).queryByRole("checkbox")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A text in place of the checkbox (`headerLabel`). It suits a toolbar acting on something other than rows the user can select all of.",
      },
      source: {
        code: `<TableGroupMenu
  headerLabel="Custom header label"
  headerMenu={menuItems}
  checkboxOptions={checkboxDropdown}
  onChange={handleChange}
  onClick={handleClick}
  withComboBox
/>`,
      },
    },
  },
};

export const Closeable: Story = {
  name: "With close cross",
  render: (args: TableGroupMenuProps) => <TableGroupMenu {...args} />,
  args: {
    ...Default.args,
    isCloseable: true,
    onCloseClick: fn(),
  },
  play: async ({ args, canvas, userEvent }: PlayContext) => {
    await userEvent.click(within(menu(canvas)).getByTestId("close-button"));
    await expect(args.onCloseClick).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A cross before the info panel button, for a toolbar the user can dismiss without clearing the selection by hand (`isCloseable`, `onCloseClick`).",
      },
      source: {
        code: `<TableGroupMenu
  isCloseable
  onCloseClick={handleClose}
  headerMenu={menuItems}
  checkboxOptions={checkboxDropdown}
  onChange={handleChange}
  onClick={handleClick}
  withComboBox
/>`,
      },
    },
  },
};

export const Blocked: Story = {
  name: "Blocked",
  render: (args: TableGroupMenuProps) => <TableGroupMenu {...args} />,
  args: {
    ...Default.args,
    isBlocked: true,
  },
  play: async ({ canvas }: PlayContext) => {
    const toolbar = menu(canvas);
    for (const id of ["menu-change-type", "menu-info", "menu-invite"]) {
      await expect(action(toolbar, id)).toBeDisabled();
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Every action greyed out and ignoring clicks while an operation on the selection is still running (`isBlocked`); the checkbox stays usable.",
      },
      source: {
        code: `<TableGroupMenu
  isBlocked
  headerMenu={menuItems}
  checkboxOptions={checkboxDropdown}
  onChange={handleChange}
  onClick={handleClick}
  withComboBox
/>`,
      },
    },
  },
};

export const InfoPanelOpen: Story = {
  name: "Info panel open",
  render: (args: TableGroupMenuProps) => <TableGroupMenu {...args} />,
  args: {
    ...Default.args,
    isInfoPanelVisible: true,
  },
  play: async ({ canvas }: PlayContext) => {
    const toggle = within(menu(canvas)).getByTestId("info-panel-toggle-button");
    await expect(
      (toggle.closest('[class*="infoPanelToggleWrapper"]') as HTMLElement)
        .className,
    ).toMatch(/isInfoPanelVisible/);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The info panel button in the accent colour on a round background, while the panel is open (`isInfoPanelVisible`). It tells the user a click closes the panel.",
      },
      source: {
        code: `<TableGroupMenu
  isInfoPanelVisible
  toggleInfoPanel={handleToggle}
  headerMenu={menuItems}
  checkboxOptions={checkboxDropdown}
  onChange={handleChange}
/>`,
      },
    },
  },
};

export const RightToLeft: Story = {
  name: "Right to left",
  render: (args: TableGroupMenuProps) => (
    <div dir="rtl" style={{ height: "100%" }}>
      <TableGroupMenu {...args} />
    </div>
  ),
  args: {
    ...Default.args,
    headerMenu: createMenuItems().map((item) => ({
      ...item,
      label: item.id === "menu-info" ? "\u05DE\u05D9\u05D3\u05E2" : item.label,
    })),
  },
  globals: { direction: "rtl" },
  play: async ({ canvas }: PlayContext) => {
    // The checkbox starts at the right edge, before the actions.
    const toolbar = menu(canvas);
    const checkbox = within(toolbar)
      .getByTestId("table_group_menu_checkbox")
      .getBoundingClientRect();
    const info = action(toolbar, "menu-info").getBoundingClientRect();
    await expect(checkbox.left).toBeGreaterThan(info.right);
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed, because the RTL provider would flip the whole Docs page
      story: { inline: false, height: "94px" },
      description: {
        story:
          "In a right-to-left interface the checkbox sits at the right edge and the actions follow it leftwards. The info panel button is at the left edge, its icon mirrored.",
      },
      source: {
        code: `<div dir="rtl">
  <TableGroupMenu headerMenu={menuItems} onChange={handleChange} />
</div>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  name: "CSS variables",
  render: (args: TableGroupMenuProps) => (
    <div
      style={
        {
          "--table-group-menu-checkbox-margin": "12px",
        } as CSSProperties
      }
    >
      <TableGroupMenu {...args} />
    </div>
  ),
  args: {
    ...Default.args,
  },
  play: async ({ canvas }: PlayContext) => {
    const checkbox = within(menu(canvas)).getByTestId(
      "table_group_menu_checkbox",
    );
    await expect(getComputedStyle(checkbox).marginInlineStart).toBe("12px");
  },
  parameters: {
    docs: {
      description: {
        story: `The variable set on a wrapper -- it is listed under CSS variables in the Table README.`,
      },
      source: {
        code: `<div style={{ "--table-group-menu-checkbox-margin": "12px" }}>
  <TableGroupMenu headerMenu={menuItems} onChange={handleChange} />
</div>`,
      },
    },
  },
};
