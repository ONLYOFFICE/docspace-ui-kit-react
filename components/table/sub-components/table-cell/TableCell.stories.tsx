import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { TableCell } from "./TableCell";
import { Avatar, AvatarRole, AvatarSize } from "../../../avatar";
import { Checkbox } from "../../../checkbox";

const meta = {
  title: "UI/Table/TableCell",
  component: TableCell,
  parameters: {
    docs: {
      description: {
        component: `TableCell is one cell of a TableRow: a fixed-height box that sits in the column the table's grid gives it.

The Table README describes it in full.`,
      },
    },
  },
  argTypes: {
    hasAccess: {
      control: "boolean",
      description:
        "On hover, shows the child marked `table-container_row-checkbox` in place of the one marked `table-container_element`.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    checked: {
      control: "boolean",
      description:
        "Shows the child marked `table-container_row-checkbox` in place of the one marked `table-container_element`, hovered or not.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    className: {
      control: "text",
      description: "Applied to the cell.",
    },
    style: {
      control: "object",
      description: "Applied to the cell.",
    },
    children: {
      control: false,
      description: "Content of the cell: text or elements.",
    },
    value: {
      control: "text",
      description:
        "Written onto the cell as a `value` attribute, which drag and drop reads to identify the item.",
    },
    documentTitle: {
      control: "text",
      description:
        "Kept on the cell as `data-document-title` for your own scripts and tests; the kit never reads it.",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the cell.",
      table: {
        defaultValue: { summary: "table-cell" },
      },
    },
    forwardedRef: {
      control: false,
      description: "Ref of the cell element.",
    },
  },
} satisfies Meta<typeof TableCell>;

type Story = StoryObj<ComponentProps<typeof TableCell>>;

export default meta;

// The swap on hover is CSS :hover, which a synthetic pointer does not set;
// the plays check the cell at rest and with `checked`.
const parts = (cell: HTMLElement) => ({
  element: cell.querySelector(".table-container_element") as HTMLElement,
  checkbox: cell.querySelector(".table-container_row-checkbox") as HTMLElement,
});

export const Default: Story = {
  name: "Text",
  render: (args) => <TableCell {...args} />,
  args: {
    className: "custom-cell",
    children: "Cell Content",
    hasAccess: false,
    checked: false,
  },
  play: async ({ canvas }) => {
    const cell = canvas.getByTestId("table-cell");
    await expect(cell).toHaveTextContent("Cell Content");
    await expect(cell).toHaveClass("custom-cell", "table-container_cell");
  },
  parameters: {
    docs: {
      description: {
        story: "A cell holding plain text, the most common case.",
      },
      source: {
        code: `<TableCell className="custom-cell">Cell Content</TableCell>`,
      },
    },
  },
};

export const WithElement: Story = {
  name: "Avatar swapped on hover",
  render: (args) => (
    <TableCell {...args}>
      <div className="table-container_element">
        <Avatar
          role={AvatarRole.none}
          size={AvatarSize.min}
          source=""
          noClick={!args.hasAccess}
        />
      </div>
      <Checkbox
        className="table-container_row-checkbox"
        isChecked={args.checked}
      />
    </TableCell>
  ),
  args: {
    className: "custom-cell",
    hasAccess: true,
    checked: false,
  },
  play: async ({ canvas }) => {
    const { element, checkbox } = parts(canvas.getByTestId("table-cell"));
    await expect(element).toBeVisible();
    await expect(checkbox).not.toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "An avatar that a hover swaps for a checkbox (`hasAccess`). A row can then be picked without a separate checkbox column.",
      },
      source: {
        code: `<TableCell hasAccess>
  <div className="table-container_element">
    <Avatar role={AvatarRole.none} size={AvatarSize.min} source="" />
  </div>
  <Checkbox className="table-container_row-checkbox" isChecked={false} />
</TableCell>`,
      },
    },
  },
};

export const WithElementChecked: Story = {
  name: "Selected",
  render: (args) => (
    <TableCell {...args}>
      <div className="table-container_element">
        <Avatar
          role={AvatarRole.none}
          size={AvatarSize.min}
          source=""
          noClick={!args.hasAccess}
        />
      </div>
      <Checkbox
        className="table-container_row-checkbox"
        isChecked={args.checked}
      />
    </TableCell>
  ),
  args: {
    className: "custom-cell",
    hasAccess: true,
    checked: true,
  },
  play: async ({ canvas }) => {
    // Selected: the checkbox stays in place of the avatar.
    const { element, checkbox } = parts(canvas.getByTestId("table-cell"));
    await expect(checkbox).toBeVisible();
    await expect(element).not.toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Once the row is selected the checkbox stays in place of the avatar even without the pointer over it (`checked`).",
      },
      source: {
        code: `<TableCell hasAccess checked>
  <div className="table-container_element">
    <Avatar role={AvatarRole.none} size={AvatarSize.min} source="" />
  </div>
  <Checkbox className="table-container_row-checkbox" isChecked />
</TableCell>`,
      },
    },
  },
};

export const WithElementNoAccess: Story = {
  name: "Not selectable",
  render: (args) => (
    <TableCell {...args}>
      <div className="table-container_element">
        <Avatar
          role={AvatarRole.none}
          size={AvatarSize.min}
          source=""
          noClick={!args.hasAccess}
        />
      </div>
      <Checkbox
        className="table-container_row-checkbox"
        isChecked={args.checked}
      />
    </TableCell>
  ),
  args: {
    className: "custom-cell",
    hasAccess: false,
    checked: false,
  },
  play: async ({ canvas }) => {
    const { element, checkbox } = parts(canvas.getByTestId("table-cell"));
    await expect(element).toBeVisible();
    await expect(checkbox).not.toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Without `hasAccess` the cell keeps the avatar on hover, for a row the user may not select.",
      },
      source: {
        code: `<TableCell hasAccess={false}>
  <div className="table-container_element">
    <Avatar role={AvatarRole.none} size={AvatarSize.min} source="" noClick />
  </div>
  <Checkbox className="table-container_row-checkbox" isChecked={false} />
</TableCell>`,
      },
    },
  },
};
