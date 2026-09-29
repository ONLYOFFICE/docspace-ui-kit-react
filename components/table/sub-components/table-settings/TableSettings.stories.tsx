import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { SortByFieldName } from "../../../../enums";

import { TableSettings } from "./TableSettings";

const meta = {
  title: "UI/Table/TableSettings",
  component: TableSettings,
  parameters: {
    docs: {
      description: {
        component: `TableSettings is the cog at the end of a TableHeader that opens a list of the columns, each with a checkbox that shows or hides it.

### Features

- **Column Checkboxes**: Lists one checkbox per column, ticked while the column's \`enable\` is set, and labelled with its \`title\`
- **Consumer-Owned State**: Calls the column's \`onChange\` with its key when its checkbox is clicked and changes nothing itself, so the consumer flips \`enable\` and stores the choice
- **Locked Columns**: Leaves out a column marked \`isDisabled\` or one without an \`onChange\`, so a column that must always show cannot be unticked
- **Disabled Cog**: With \`disableSettings\`, greys the cog out and stops the list opening; the header sets it while it has hidden columns for lack of room or while rows are reordered
- **Stays Open While Ticking**: Keeps the list open across clicks on its checkboxes and closes it on a click anywhere else or on the cog again

### Usage

\`\`\`tsx
// TableSettings is not exported on its own: TableHeader renders it from its columns
import { TableHeader } from "@onlyoffice/apps-ui-kit/components/table";

<TableHeader showSettings settingsTitle="Columns" columns={columns} {...headerProps} />

// A column the user may hide has an onChange that flips its enable
const columns = [
  { key: "name", title: "Name", enable: true, isDisabled: true },
  { key: "type", title: "Type", enable: showType, onChange: () => setShowType((v) => !v) },
];
\`\`\``,
      },
    },
  },
  argTypes: {
    columns: {
      control: false,
      description:
        "The table's columns; only those with an `onChange` and without `isDisabled` get a checkbox",
    },
    disableSettings: {
      control: "boolean",
      description: "Greys the cog out and stops the list of columns opening",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<typeof TableSettings>;

type Story = StoryObj<ComponentProps<typeof TableSettings>>;

export default meta;

export const Default: Story = {
  render: (args) => <TableSettings {...args} />,
  args: {
    columns: [
      {
        key: "name",
        title: "Name",
        enable: true,
        sortBy: SortByFieldName.Name,
        onChange: () => {},
      },
      {
        key: "type",
        title: "Type",
        enable: true,
        sortBy: SortByFieldName.Type,
        onChange: () => {},
      },
      {
        key: "modified",
        title: "Modified",
        enable: false,
        sortBy: SortByFieldName.ModifiedDate,
        onChange: () => {},
      },
      {
        key: "owner",
        title: "Owner",
        enable: true,
        sortBy: SortByFieldName.Author,
        onChange: () => {},
      },
    ],
    disableSettings: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The cog that lets a user choose which columns to see; click it to open the list, where Modified is unticked because that column is hidden.",
      },
      source: {
        code: `<TableSettings
  columns={[
    { key: "name", title: "Name", enable: true, sortBy: SortByFieldName.Name, onChange: handleToggle },
    { key: "type", title: "Type", enable: true, sortBy: SortByFieldName.Type, onChange: handleToggle },
    { key: "modified", title: "Modified", enable: false, sortBy: SortByFieldName.ModifiedDate, onChange: handleToggle },
    { key: "owner", title: "Owner", enable: true, sortBy: SortByFieldName.Author, onChange: handleToggle },
  ]}
  disableSettings={false}
/>`,
      },
    },
  },
};

export const Disabled: Story = {
  render: (args) => <TableSettings {...args} />,
  args: {
    ...Default.args,
    disableSettings: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A greyed-out cog that does not open, for the moments the column set must not change, such as while rows are reordered (`disableSettings`).",
      },
      source: {
        code: `<TableSettings
  columns={columns}
  disableSettings
/>`,
      },
    },
  },
};

export const WithLockedColumns: Story = {
  render: (args) => <TableSettings {...args} />,
  args: {
    columns: [
      {
        key: "name",
        title: "Name",
        enable: true,
        sortBy: SortByFieldName.Name,
        isDisabled: true,
        onChange: () => {},
      },
      {
        key: "type",
        title: "Type",
        enable: true,
        sortBy: SortByFieldName.Type,
        onChange: () => {},
      },
      {
        key: "size",
        title: "Size",
        enable: true,
        sortBy: SortByFieldName.Size,
      },
      {
        key: "modified",
        title: "Modified",
        enable: false,
        sortBy: SortByFieldName.ModifiedDate,
        onChange: () => {},
      },
    ],
    disableSettings: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Click the cog: only Type and Modified are listed. Name is marked `isDisabled` and Size has no `onChange`, so neither can be hidden, which keeps the column that identifies a row always on screen.",
      },
      source: {
        code: `<TableSettings
  columns={[
    { key: "name", title: "Name", enable: true, isDisabled: true, onChange: handleToggle },
    { key: "type", title: "Type", enable: true, onChange: handleToggle },
    { key: "size", title: "Size", enable: true },
    { key: "modified", title: "Modified", enable: false, onChange: handleToggle },
  ]}
/>`,
      },
    },
  },
};
