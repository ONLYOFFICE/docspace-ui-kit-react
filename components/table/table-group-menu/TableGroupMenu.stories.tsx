import type { ComponentProps, CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
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
      description: "Ticks the select-all checkbox",
    },
    isIndeterminate: {
      control: "boolean",
      description:
        "Draws the select-all checkbox partly ticked, for a selection that covers some rows but not all",
    },
    headerMenu: {
      control: false,
      description:
        "The action buttons, in order; an entry whose `disabled` is set is left out",
    },
    checkboxOptions: {
      control: false,
      description:
        "Element whose children become the options of the menu the arrow after the checkbox opens",
    },
    withComboBox: {
      control: "boolean",
      description:
        "Shows the arrow after the checkbox that opens `checkboxOptions`",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    headerLabel: {
      control: "text",
      description: "Text shown in place of the select-all checkbox",
    },
    checkboxMargin: {
      control: "text",
      description:
        "Space before the checkbox or the label as a CSS length, such as `12px`; tablets and phones always use 24px",
      table: {
        defaultValue: { summary: "28px" },
      },
    },
    isBlocked: {
      control: "boolean",
      description: "Greys every action button out and ignores clicks on them",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isMobileView: {
      control: "boolean",
      description:
        "Opens the selection menu and the action menus in their phone form",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withoutInfoPanelToggler: {
      control: "boolean",
      description: "Leaves out the info panel button at the end",
    },
    isInfoPanelVisible: {
      control: "boolean",
      description:
        "Draws the info panel button in the accent colour on a round background",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isCloseable: {
      control: "boolean",
      description:
        "Adds a cross before the info panel button; it comes together with `onCloseClick`",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onChange: {
      action: "onChange",
      description:
        "Called with the new state when the select-all checkbox is clicked",
    },
    onClick: {
      action: "onClick",
      description: "Called on a click anywhere in the toolbar",
    },
    toggleInfoPanel: {
      action: "toggleInfoPanel",
      description: "Called when the info panel button is clicked",
    },
    onCloseClick: {
      action: "onCloseClick",
      description: "Called when the cross is clicked",
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

const createMenuItems = (): TGroupMenuItem[] => [
  {
    id: "menu-change-type",
    disabled: false,
    label: "Change type",
    title: "Change type",
    iconUrl: ChangeToEmployeeReactSvgUrl,
    onClick: () => {},
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
  },
  {
    id: "menu-info",
    label: "Info",
    title: "Info",
    disabled: false,
    onClick: () => {},
    iconUrl: InfoReactSvgUrl,
  },
  {
    id: "menu-invite",
    label: "Invite",
    title: "Invite",
    disabled: false,
    onClick: () => {},
    iconUrl: InviteAgainReactSvgUrl,
  },
];

const checkboxOptions = (
  <>
    <DropDownItem key="all" label="All" data-index={0} onClick={() => {}} />
    <DropDownItem
      key="active"
      label="Active"
      data-index={1}
      onClick={() => {}}
    />
  </>
);

export const Default: Story = {
  render: (args: TableGroupMenuProps) => <TableGroupMenu {...args} />,
  args: {
    isChecked: false,
    isIndeterminate: false,
    headerMenu: createMenuItems(),
    checkboxOptions,
    onClick: () => {},
    onChange: () => {},
    withoutInfoPanelToggler: false,
    isInfoPanelVisible: false,
    toggleInfoPanel: () => {},
    isBlocked: false,
    withComboBox: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The toolbar a user sees after selecting rows, with the actions that apply to them; change any other prop live in the Controls panel below.",
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
  render: (args: TableGroupMenuProps) => <TableGroupMenu {...args} />,
  args: {
    ...Default.args,
    isChecked: true,
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
  render: (args: TableGroupMenuProps) => <TableGroupMenu {...args} />,
  args: {
    ...Default.args,
    isIndeterminate: true,
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
  render: (args: TableGroupMenuProps) => <TableGroupMenu {...args} />,
  args: {
    ...Default.args,
    headerLabel: "Custom header label",
  },
  parameters: {
    docs: {
      description: {
        story:
          "A text in place of the checkbox, for a toolbar that acts on something other than a list of rows the user can select all of (`headerLabel`).",
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
  render: (args: TableGroupMenuProps) => <TableGroupMenu {...args} />,
  args: {
    ...Default.args,
    isCloseable: true,
    onCloseClick: () => {},
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
  render: (args: TableGroupMenuProps) => <TableGroupMenu {...args} />,
  args: {
    ...Default.args,
    isBlocked: true,
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
  render: (args: TableGroupMenuProps) => <TableGroupMenu {...args} />,
  args: {
    ...Default.args,
    isInfoPanelVisible: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "While the info panel is open, its button at the end is drawn in the accent colour on a round background, so the user sees that a click closes the panel (`isInfoPanelVisible`).",
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
  parameters: {
    noPadding: true,
    docs: {
      // Framed, because the RTL provider would flip the whole Docs page
      story: { inline: false, height: "94px" },
      description: {
        story:
          "In a right-to-left interface the checkbox moves to the right edge, the actions follow it leftwards and the info panel button sits at the left edge with its icon mirrored.",
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
