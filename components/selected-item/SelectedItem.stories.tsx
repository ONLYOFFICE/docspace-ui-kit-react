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

import { Meta, StoryObj } from "@storybook/react-vite";

import { SelectedItem } from ".";
import styles from "./SelectedItem.stories.module.scss";

const meta = {
  title: "Components/UI/SelectedItem",
  component: SelectedItem,
  parameters: {
    docs: {
      description: {
        component: `
A component that displays a selected item with an optional close button.

## Features
- Inline and block display modes
- Disableable state
- Removable with close button
- Customizable label

## Usage
Typically used to display selected items in filters, tags, or multi-select inputs.
`,
      },
    },
  },
  argTypes: {
    label: {
      control: "text",
      description: "Text content to display for the selected item",
    },
    isInline: {
      control: "boolean",
      description: "When true, displays the item inline; when false, as a block element",
    },
    isDisabled: {
      control: "boolean",
      description: "When true, disables the item and prevents interaction",
    },
    propKey: {
      control: "text",
      description: "Unique identifier for the selected item",
    },
    onClose: {
      action: "onClose",
      description: "Callback function triggered when close button is clicked",
    },
  },
} satisfies Meta<typeof SelectedItem>;
type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {
    label: "Selected item",
    isInline: true,
    isDisabled: false,
    onClose: () => {},
    propKey: "",
  },
  parameters: {
    docs: {
      description: {
        story: "Default inline selected item with close button. Click the close button to trigger the onClose callback.",
      },
    },
  },
};

const AllTemplate = () => {
  const onCloseHandler = () => {};
  return (
    <>
      <div className={styles.containerInline}>
        <SelectedItem
          label="Selected item"
          propKey=""
          isInline
          onClose={onCloseHandler}
        />
        <SelectedItem
          label="Selected item"
          propKey=""
          isInline
          isDisabled
          onClose={onCloseHandler}
        />
      </div>

      <div className={styles.container}>
        <SelectedItem
          label="Selected item"
          propKey=""
          isInline={false}
          onClose={onCloseHandler}
        />
      </div>
    </>
  );
};

export const All: Story = {
  render: () => <AllTemplate />,
  args: {
    label: "Selected item",
    isInline: true,
    isDisabled: false,
    onClose: () => {},
    propKey: "",
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates different variations: inline enabled, inline disabled, and block display modes. Shows how the component adapts to different layout requirements.",
      },
    },
  },
};
