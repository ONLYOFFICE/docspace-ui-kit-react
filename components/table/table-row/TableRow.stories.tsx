import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor } from "storybook/test";

import { ContextMenuModel } from "../../context-menu";
import FileCells, { storyFiles } from "../../../.storybook/utils/FileCells";
import { TableRow } from "./TableRow";

const meta = {
  title: "UI/Table/TableRow",
  component: TableRow,
  parameters: {
    docs: {
      description: {
        component: `TableRow is one row of a table: its cells followed by a last cell with the row's context menu button.

The Table README describes it in full.`,
      },
    },
  },
  argTypes: {
    checked: {
      control: "boolean",
      description:
        "Adds a `checked` class for your own highlight, and keeps children marked `create-share-link` shown.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isActive: {
      control: "boolean",
      description:
        "Marks the row whose context menu is open: children marked `create-share-link` stay shown and the drop fill is off.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    dragging: {
      control: "boolean",
      description:
        "Fills children marked `droppable-hover` with the drop colour while something is dragged over the table.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isIndexEditingMode: {
      control: "boolean",
      description:
        "Leaves out the last cell with the context button, for rows being reordered.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    contextOptions: {
      control: false,
      description:
        "Items of the context menu. The context button is drawn only while the list has an item; otherwise a blank space takes its place.",
    },
    getContextModel: {
      control: false,
      description: "Builds the context menu's items at the moment it opens.",
    },
    title: {
      control: "text",
      description: "Hover tooltip and accessible name of the context button.",
    },
    badgeUrl: {
      control: "text",
      description: "URL of the badge image shown in the context menu's header.",
    },
    selectionProp: {
      control: "object",
      description:
        "Class and `value` spread onto the last cell, which holds the context button.",
    },
    contextMenuCellStyle: {
      control: "object",
      description: "Applied to the last cell, which holds the context button.",
    },
    className: {
      control: "text",
      description: "Applied to the row.",
    },
    style: {
      control: "object",
      description: "Applied to the row element.",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the row.",
      table: {
        defaultValue: { summary: "table-row" },
      },
    },
    contextMenuTestId: {
      control: "text",
      description:
        "Test id of the row's context menu, which opens outside the row in a portal.",
    },
    fileContextClick: {
      action: "fileContextClick",
      description:
        "Called when the context menu is asked for, with `true` for a right-click.",
    },
    onHideContextMenu: {
      action: "onHideContextMenu",
      description: "Called when the context menu closes.",
    },
    onClick: {
      action: "onClick",
      description: "Called on a click anywhere in the row.",
    },
    onDoubleClick: {
      action: "onDoubleClick",
      description: "Called on a double click anywhere in the row.",
    },
    onMouseEnter: {
      action: "onMouseEnter",
      description: "Called when the pointer enters the row.",
    },
    onMouseLeave: {
      action: "onMouseLeave",
      description: "Called when the pointer leaves the row.",
    },
    forwardedRef: {
      control: false,
      description: "Ref of the row element.",
    },
    children: {
      control: false,
      description: "The row's cells, normally one `TableCell` per column.",
    },
  },
  args: {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr) 24px",
    },
    fileContextClick: fn(),
    onHideContextMenu: fn(),
    onClick: fn(),
    onDoubleClick: fn(),
    onMouseEnter: fn(),
    onMouseLeave: fn(),
  },
} satisfies Meta<typeof TableRow>;

type Story = StoryObj<ComponentProps<typeof TableRow>>;

export default meta;

const onEditOption = fn();
const onDeleteOption = fn();

const contextOptions: ContextMenuModel[] = [
  {
    key: "edit",
    label: "Edit",
    onClick: onEditOption,
  },
  {
    key: "delete",
    label: "Delete",
    onClick: onDeleteOption,
  },
];

// The menu is portalled and fades in.
const menuItem = async (name: string) => {
  const item = await screen.findByRole("menuitem", { name });
  await waitFor(() => expect(item).toBeVisible());
  return item;
};

const RowContent = <FileCells file={storyFiles[0]} />;

export const Default: Story = {
  name: "With context menu",
  render: (args) => <TableRow {...args} />,
  args: {
    children: RowContent,
    className: "custom-row-class",
    selectionProp: { className: "selection-class" },
    title: "Context menu",
    contextOptions,
  },
  beforeEach: () => {
    onDeleteOption.mockClear();
  },
  play: async ({ args, canvas, userEvent }) => {
    const row = canvas.getByTestId("table-row");
    await expect(row).toHaveClass("custom-row-class", "table-container_row");
    // No class named "undefined" lands on the row.
    await expect(row).not.toHaveClass("undefined");

    await userEvent.click(canvas.getByText("Annual Report 2025"));
    await expect(args.onClick).toHaveBeenCalled();
    await userEvent.dblClick(canvas.getByText("Document"));
    await expect(args.onDoubleClick).toHaveBeenCalled();

    // The menu button opens the row's menu beside it.
    await userEvent.click(canvas.getByTestId("context-menu-button"));
    await expect(args.fileContextClick).toHaveBeenCalledWith(false);
    await userEvent.click(await menuItem("Delete"));
    await expect(onDeleteOption).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(args.onHideContextMenu).toHaveBeenCalled());
  },
  parameters: {
    docs: {
      description: {
        story:
          "A file row with its context menu. A right-click anywhere in the row opens the menu, and so does the three-dot button at its end.",
      },
      source: {
        code: `<TableRow
  contextOptions={contextOptions}
  style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr) 24px" }}
>
  <TableCell>{nameCell}</TableCell>
  <TableCell><Text fontSize="12px" fontWeight={600} color="#A3A9AE">Document</Text></TableCell>
  <TableCell><Text fontSize="12px" fontWeight={600} color="#A3A9AE">Finance</Text></TableCell>
</TableRow>`,
      },
    },
  },
};

export const IndexEditingMode: Story = {
  name: "Reordering rows",
  render: (args) => <TableRow {...args} />,
  args: {
    children: RowContent,
    className: "custom-row-class",
    selectionProp: { className: "selection-class" },
    isIndexEditingMode: true,
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText("Finance")).toBeVisible();
    // No last cell with a menu while the index is edited.
    await expect(
      canvasElement.querySelector(".context-menu-container"),
    ).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A row being reordered, without the last cell and its context button (`isIndexEditingMode`). A drag cannot open a menu by accident.",
      },
      source: {
        code: `<TableRow
  isIndexEditingMode
  style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr) 24px" }}
>
  <TableCell>{nameCell}</TableCell>
  <TableCell><Text fontSize="12px" fontWeight={600} color="#A3A9AE">Document</Text></TableCell>
  <TableCell><Text fontSize="12px" fontWeight={600} color="#A3A9AE">Finance</Text></TableCell>
</TableRow>`,
      },
    },
  },
};
