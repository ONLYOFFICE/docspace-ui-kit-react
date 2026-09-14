import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import React from "react";

import CatalogFolderReactSvg from "../../../assets/icons/16/catalog.folder.react.svg";
import CheckReactSvgUrl from "../../../assets/check.react.svg?url";
import { IconSizeType } from "../../../utils";

import { Avatar, AvatarRole, AvatarSize } from "../../avatar";
import { ComboBox, ComboBoxSize, type TOption } from "../../combobox";
import { Text } from "../../text";

import { Row } from ".";
import type { RowProps } from "./Row.types";
import styles from "./row.stories.module.scss";

const meta = {
  title: "UI/Rows/Row",
  component: Row,
  parameters: {
    docs: {
      description: {
        component: `Displays content as a row with support for selection, context menus, and custom elements.

### Features

- **Checkbox**: Built-in checkbox for row selection
- **Element Slot**: Supports Avatar, Icon, or ComboBox as a leading element
- **Context Menu**: Right-click or button-triggered context actions
- **Modes**: Standard and index editing modes

### Usage

\`\`\`tsx
import { Row } from "@onlyoffice/apps-ui-kit/components/rows/row";

// Basic row with checkbox
<Row checked={false} contextOptions={[{ key: "edit", label: "Edit" }]}>
  <Text>Row content</Text>
</Row>

// Row with avatar element
<Row element={<Avatar size={AvatarSize.min} userName="John" />}>
  <Text>John Doe</Text>
</Row>
\`\`\``,
      },
    },
  },
  argTypes: {
    checked: {
      control: "boolean",
      description: "Whether the row checkbox is checked",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isIndexEditingMode: {
      control: "boolean",
      description: "Enable index editing mode for reordering",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    mode: {
      control: "text",
      description: "Display mode of the row",
    },
    withoutBorder: {
      control: "boolean",
      description: "Remove the bottom border from the row",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    inProgress: {
      control: "boolean",
      description: "Show the row in a loading/progress state",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDisabled: {
      control: "boolean",
      description: "Disable interactions with the row",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    element: {
      control: {
        type: "select",
        options: ["", "Avatar", "Icon", "ComboBox"],
      },
      description: "Leading element displayed before the row content",
    },
  },
} satisfies Meta<typeof Row>;

type Story = StoryObj<ComponentProps<typeof Row>>;

export default meta;

const elementAvatar = (
  <Avatar
    size={AvatarSize.min}
    role={AvatarRole.user}
    source=""
    userName="Demo Avatar"
  />
);
const elementIcon = (
  <CatalogFolderReactSvg
    className={styles.catalogFolderIcon}
    data-size={IconSizeType.big}
  />
);

const renderElementComboBox = (onSelect?: (option?: TOption) => void) => (
  <ComboBox
    options={[
      {
        key: 1,
        label: "Open",
      },
      { key: 2, icon: CheckReactSvgUrl, label: "Closed" },
    ]}
    onSelect={(option?: TOption) => {
      onSelect?.(option);
    }}
    selectedOption={{
      key: 0,
      label: "",
    }}
    scaled={false}
    size={ComboBoxSize.content}
    isDisabled={false}
  />
);

const Template = ({ ...args }: RowProps) => {
  const { checked, element } = args;
  const getElementProps = (elementName?: string) =>
    elementName === "Avatar"
      ? { element: elementAvatar }
      : elementName === "Icon"
        ? { element: elementIcon }
        : elementName === "ComboBox"
          ? { element: renderElementComboBox() }
          : {};

  // The Controls-panel `element` argType is a select of option names, not a
  // real ReactElement -- Storybook injects the raw string control value at
  // runtime, overriding the RowProps.element (ReactElement) static type.
  const elementProps = getElementProps(element as unknown as string);
  const checkedProps = { checked };
  // Exclude the raw select-control string from the spread below -- only the
  // resolved ReactElement in `elementProps` should reach <Row>.
  const { element: _elementArg, ...restArgs } = args;
  return (
    <Row
      {...restArgs}
      key="1"
      style={{ width: "20%" }}
      {...checkedProps}
      {...elementProps}
      contextOptions={[
        {
          key: "key1",
          label: "Edit",
        },
        {
          key: "key2",
          label: "Delete",
        },
      ]}
    >
      <Text truncate>Sample text</Text>
    </Row>
  );
};

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    checked: true,
    isIndexEditingMode: false,
    // Cast: the `element` argType is a Controls-panel select of option
    // names ("Avatar" | "Icon" | "ComboBox"), not a ReactElement -- see
    // Template, which resolves the selected name to the actual element.
    element: "Avatar" as unknown as RowProps["element"],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default row with a checkbox, avatar element, and context menu actions.",
      },
      source: {
        code: `<Row
  checked={true}
  isIndexEditingMode={false}
  element={<Avatar size={AvatarSize.min} role={AvatarRole.user} userName="Demo Avatar" />}
  contextOptions={[
    { key: "key1", label: "Edit" },
    { key: "key2", label: "Delete" },
  ]}
>
  <Text truncate>Sample text</Text>
</Row>`,
      },
    },
  },
};
