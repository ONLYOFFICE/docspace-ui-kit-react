import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor, within } from "storybook/test";

import { SortByFieldName } from "../../../../enums";

import { TableSettings } from "./TableSettings";

const meta = {
  title: "UI/Table/TableSettings",
  component: TableSettings,
  parameters: {
    docs: {
      description: {
        component: `TableSettings is the cog at the end of a TableHeader that opens a list of the columns, each with a checkbox that shows or hides it.

The Table README describes it in full.`,
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

const onColumnToggle = fn();

// The list is portalled; a column's row carries its key in the test id.
const columnRow = (key: string) =>
  screen.queryByTestId(`table_settings_${key}`);

const listOpen = () => waitFor(() => expect(columnRow("type")).toBeVisible());

export const Default: Story = {
  render: (args) => <TableSettings {...args} />,
  args: {
    columns: [
      {
        key: "name",
        title: "Name",
        enable: true,
        sortBy: SortByFieldName.Name,
        onChange: onColumnToggle,
      },
      {
        key: "type",
        title: "Type",
        enable: true,
        sortBy: SortByFieldName.Type,
        onChange: onColumnToggle,
      },
      {
        key: "modified",
        title: "Modified",
        enable: false,
        sortBy: SortByFieldName.ModifiedDate,
        onChange: onColumnToggle,
      },
      {
        key: "owner",
        title: "Owner",
        enable: true,
        sortBy: SortByFieldName.Author,
        onChange: onColumnToggle,
      },
    ],
    disableSettings: false,
  },
  beforeEach: () => {
    onColumnToggle.mockClear();
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByTestId("table-settings-button"));
    await listOpen();
    const checkbox = (key: string) =>
      within(columnRow(key) as HTMLElement).getByRole("checkbox");
    await expect(checkbox("name")).toBeChecked();
    // The hidden column is unticked.
    await expect(checkbox("modified")).not.toBeChecked();

    await userEvent.click(
      within(columnRow("modified") as HTMLElement).getByText("Modified"),
    );
    await expect(onColumnToggle).toHaveBeenCalledWith("modified");

    // A click elsewhere closes the list.
    await userEvent.click(document.body);
    await waitFor(() => expect(columnRow("type")).not.toBeVisible());
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
  play: async ({ canvas }) => {
    const cog = canvas.getByTestId("table-settings-button");
    await expect(cog).toHaveAttribute("aria-disabled", "true");
    await expect(columnRow("type")).not.toBeVisible();
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
        onChange: onColumnToggle,
      },
      {
        key: "type",
        title: "Type",
        enable: true,
        sortBy: SortByFieldName.Type,
        onChange: onColumnToggle,
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
        onChange: onColumnToggle,
      },
    ],
    disableSettings: false,
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByTestId("table-settings-button"));
    await listOpen();
    await expect(columnRow("modified")).toBeVisible();
    // A locked column and one without onChange are not listed.
    await expect(columnRow("name")).toBeNull();
    await expect(columnRow("size")).toBeNull();
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
