import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

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
        "Shows the child marked `table-container_row-checkbox` in place of the child marked `table-container_element` while the pointer is over the cell",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    checked: {
      control: "boolean",
      description:
        "Shows the child marked `table-container_row-checkbox` in place of the child marked `table-container_element` all the time",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    className: {
      control: "text",
      description: "Class applied to the cell after the component's own",
    },
    style: {
      control: "object",
      description: "Inline styles applied to the cell",
    },
    children: {
      control: false,
      description: "Content of the cell: text or elements",
    },
    value: {
      control: "text",
      description:
        "Written onto the cell as a `value` attribute, which drag and drop reads to identify the item",
    },
    documentTitle: {
      control: "text",
      description: "Written onto the cell as a `data-document-title` attribute",
    },
    dataTestId: {
      control: "text",
      description: "Value of the cell's `data-testid` attribute",
      table: {
        defaultValue: { summary: "table-cell" },
      },
    },
    forwardedRef: {
      control: false,
      description: "Ref of the cell element",
    },
  },
} satisfies Meta<typeof TableCell>;

type Story = StoryObj<ComponentProps<typeof TableCell>>;

export default meta;

export const Default: Story = {
  render: (args) => <TableCell {...args} />,
  args: {
    className: "custom-cell",
    children: "Cell Content",
    hasAccess: false,
    checked: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A cell holding plain text, the most common case; change any other prop live in the Controls panel below.",
      },
      source: {
        code: `<TableCell className="custom-cell">Cell Content</TableCell>`,
      },
    },
  },
};

export const WithElement: Story = {
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
  parameters: {
    docs: {
      description: {
        story:
          "An avatar that turns into a checkbox when the pointer is over the cell, so a row can be picked without a separate checkbox column (`hasAccess`). Hover the cell to see the swap.",
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
  parameters: {
    docs: {
      description: {
        story:
          "Without `hasAccess` the cell keeps the avatar on hover and never shows the checkbox, for a row the user may not select.",
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
