import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fireEvent, fn, screen, waitFor } from "storybook/test";

import { ContextMenuModel } from "../../context-menu";
import { TableCell } from "../sub-components/table-cell";
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
        "Adds a `checked` class to the row for the consumer's highlight and reveals children marked `create-share-link`",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isActive: {
      control: "boolean",
      description:
        "Marks the row whose context menu is open: reveals children marked `create-share-link` and turns off the drop highlight",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    dragging: {
      control: "boolean",
      description:
        "Fills children marked `droppable-hover` with the drop colour while something is dragged over the table",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isIndexEditingMode: {
      control: "boolean",
      description:
        "Leaves out the last cell with the context menu button, for rows being reordered",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    hideColumns: {
      control: "boolean",
      description:
        "Adds a class for the narrow layout the header asks for when it runs out of room; the kit styles nothing with it",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    contextOptions: {
      control: false,
      description:
        "Items of the context menu; a non-empty list renders the three-dot button, an empty one leaves a blank space instead",
    },
    getContextModel: {
      control: false,
      description: "Builds the context menu items at the moment the menu opens",
    },
    title: {
      control: "text",
      description: "Hover tooltip of the three-dot button",
    },
    badgeUrl: {
      control: "text",
      description: "URL of a badge image shown in the context menu's header",
    },
    selectionProp: {
      control: "object",
      description:
        "Class and `value` spread onto the last cell, which holds the context menu button",
    },
    contextMenuCellStyle: {
      control: "object",
      description: "Inline styles of the last cell",
    },
    className: {
      control: "text",
      description: "Class applied to the row after the component's own",
    },
    style: {
      control: "object",
      description:
        "Inline styles of the row; inside a table the header overwrites its grid columns",
    },
    dataTestId: {
      control: "text",
      description: "Value of the row's `data-testid` attribute",
      table: {
        defaultValue: { summary: "table-row" },
      },
    },
    contextMenuTestId: {
      control: "text",
      description: "Value of the context menu's `data-testid` attribute",
    },
    fileContextClick: {
      action: "fileContextClick",
      description:
        "Called when the context menu is asked for, with `true` for a right-click",
    },
    onHideContextMenu: {
      action: "onHideContextMenu",
      description: "Called when the context menu closes",
    },
    onClick: {
      action: "onClick",
      description: "Called with the mouse event on a click anywhere in the row",
    },
    onDoubleClick: {
      action: "onDoubleClick",
      description:
        "Called with the mouse event on a double click anywhere in the row",
    },
    onMouseEnter: {
      action: "onMouseEnter",
      description: "Called when the pointer enters the row",
    },
    onMouseLeave: {
      action: "onMouseLeave",
      description: "Called when the pointer leaves the row",
    },
    forwardedRef: {
      control: false,
      description: "Ref of the row element",
    },
    children: {
      control: false,
      description: "The row's cells, normally one `TableCell` per column",
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

const RowContent = (
  <>
    <TableCell>
      <span>Cell 1</span>
    </TableCell>
    <TableCell>
      <span>Cell 2</span>
    </TableCell>
    <TableCell>
      <span>Cell 3</span>
    </TableCell>
  </>
);

export const Default: Story = {
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

    await userEvent.click(canvas.getByText("Cell 1"));
    await expect(args.onClick).toHaveBeenCalled();
    await userEvent.dblClick(canvas.getByText("Cell 2"));
    await expect(args.onDoubleClick).toHaveBeenCalled();

    // A right click anywhere in the row opens its menu.
    fireEvent.contextMenu(canvas.getByText("Cell 3"), { button: 2 });
    await expect(args.fileContextClick).toHaveBeenCalledWith(true);
    await userEvent.click(await menuItem("Delete"));
    await expect(onDeleteOption).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(args.onHideContextMenu).toHaveBeenCalled());
  },
  parameters: {
    docs: {
      description: {
        story:
          "A row with a context menu, the way rows in a file list offer their actions: right-click anywhere in the row, or click the three-dot button at its end.",
      },
      source: {
        code: `<TableRow
  contextOptions={contextOptions}
  style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr) 24px" }}
>
  <TableCell><span>Cell 1</span></TableCell>
  <TableCell><span>Cell 2</span></TableCell>
  <TableCell><span>Cell 3</span></TableCell>
</TableRow>`,
      },
    },
  },
};

export const IndexEditingMode: Story = {
  render: (args) => <TableRow {...args} />,
  args: {
    children: RowContent,
    className: "custom-row-class",
    selectionProp: { className: "selection-class" },
    isIndexEditingMode: true,
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText("Cell 3")).toBeVisible();
    // No last cell with a menu while the index is edited.
    await expect(
      canvasElement.querySelector(".context-menu-container"),
    ).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "While rows are being reordered the last cell with the context menu button is left out, so a drag cannot open a menu by accident (`isIndexEditingMode`).",
      },
      source: {
        code: `<TableRow
  isIndexEditingMode
  style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr) 24px" }}
>
  <TableCell><span>Cell 1</span></TableCell>
  <TableCell><span>Cell 2</span></TableCell>
  <TableCell><span>Cell 3</span></TableCell>
</TableRow>`,
      },
    },
  },
};
