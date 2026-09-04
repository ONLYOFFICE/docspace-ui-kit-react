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
        component: `TableSettings provides a dropdown for managing column visibility in tables.

### Features

- **Column Toggles**: Enable or disable individual columns via checkboxes
- **Disabled State**: Entire settings panel can be disabled during operations
- **Persistent Configuration**: Works with column storage for saving user preferences

### Usage

\`\`\`tsx
import { TableSettings } from "@docspace/ui-kit/components/table/sub-components/table-settings";

<TableSettings
  columns={[
    { key: "name", title: "Name", enable: true, sortBy: SortByFieldName.Name, onChange: handleToggle },
    { key: "type", title: "Type", enable: true, sortBy: SortByFieldName.Type, onChange: handleToggle },
    { key: "modified", title: "Modified", enable: false, sortBy: SortByFieldName.ModifiedDate, onChange: handleToggle },
  ]}
  disableSettings={false}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    columns: {
      control: false,
      description:
        "Array of column configuration objects with visibility toggles",
    },
    disableSettings: {
      control: "boolean",
      description: "Disable the entire settings panel",
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
          "Default table settings dropdown with four columns. The Modified column is disabled by default.",
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
          "Table settings in a disabled state. The settings dropdown cannot be opened or interacted with.",
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
