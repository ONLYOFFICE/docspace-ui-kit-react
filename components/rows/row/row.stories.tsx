// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

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
import { Row } from "@docspace/ui-kit/components/rows/row";

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
  const { checked } = args;
  const getElementProps = (element: string) =>
    element === "Avatar"
      ? { element: elementAvatar }
      : element === "Icon"
        ? { element: elementIcon }
        : element === "ComboBox"
          ? { element: renderElementComboBox() }
          : {};

  const elementProps = getElementProps("Avatar");
  const checkedProps = { checked };
  return (
    <Row
      {...args}
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
