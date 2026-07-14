/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { CSSProperties, ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import CatalogFolderReactSvgUrl from "../../assets/icons/16/catalog.folder.react.svg?url";

import { MainButton } from ".";

const itemsModel = [
  {
    key: 0,
    label: "New document",
    icon: CatalogFolderReactSvgUrl,
  },
  {
    key: 1,
    label: "New spreadsheet",
    icon: CatalogFolderReactSvgUrl,
  },
  {
    key: 2,
    label: "New presentation",
    icon: CatalogFolderReactSvgUrl,
  },
  {
    key: 3,
    label: "Master form",
    icon: CatalogFolderReactSvgUrl,
    items: [
      {
        key: 4,
        label: "From blank",
      },
      {
        key: 5,
        label: "From an existing text file",
      },
    ],
  },
  {
    key: 6,
    label: "New folder",
    icon: CatalogFolderReactSvgUrl,
  },
  {
    key: 7,
    isSeparator: true,
  },
  {
    key: 8,
    label: "Upload",
    icon: CatalogFolderReactSvgUrl,
  },
];

const meta = {
  title: "UI/Interactive elements/MainButton",
  component: MainButton,
  parameters: {
    docs: {
      description: {
        component: `Main action button with an optional dropdown menu. Typically used as the primary call-to-action in a sidebar or toolbar.

### Features

- **Dropdown Menu**: Built-in dropdown with configurable menu items
- **Nested Items**: Support for sub-menus within dropdown items
- **Separators**: Visual dividers between menu item groups
- **Icon Support**: Each menu item can have its own icon
- **Disabled State**: Full disabled state for button and dropdown
- **Action Callback**: Direct click handler when used without dropdown

### Usage

\`\`\`tsx
import { MainButton } from "@docspace/ui-kit/components/main-button";

// With dropdown menu
<MainButton
  text="Create new"
  model={[
    { key: 0, label: "New document", icon: FolderIcon },
    { key: 1, label: "New folder", icon: FolderIcon },
    { key: 2, isSeparator: true },
    { key: 3, label: "Upload", icon: FolderIcon },
  ]}
/>

// As a simple action button
<MainButton text="Click Me" isDropdown={false} onAction={handleClick} />
\`\`\``,
      },
    },
  },
  argTypes: {
    text: {
      control: "text",
      description: "Button text label",
    },
    isDisabled: {
      control: "boolean",
      description: "Sets the button to present a disabled state",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDropdown: {
      control: "boolean",
      description: "Activates a drop-down list for MainButton",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    opened: {
      control: "boolean",
      description: "Controls whether the dropdown is open",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onAction: {
      action: "onAction",
      description:
        "Callback function triggered when the button is clicked (non-dropdown mode)",
    },
  },
} satisfies Meta<typeof MainButton>;

type Story = StoryObj<ComponentProps<typeof MainButton>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div style={{ maxWidth: "210px" }}>{props.children}</div>
  );
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--main-button-bg": "#0082c9",
          "--main-button-color": "#ffffff",
          "--main-button-icon-color": "#ffffff",
          "--main-button-radius": "50px",
          "--main-button-text-size": "14px",
          "--main-button-inner-padding": "6px 20px",
        } as CSSProperties
      }
    >
      <Wrapper>
        <MainButton text="New" model={itemsModel} />
      </Wrapper>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--main-button-bg\` | Button background color | accent |
| \`--main-button-color\` | Button text color | white |
| \`--main-button-icon-color\` | Icon fill color | white |
| \`--main-button-radius\` | Border radius | \`3px\` |
| \`--main-button-inner-padding\` | Button padding | \`5px 14px 5px 12px\` |
| \`--main-button-text-size\` | Font size | \`16px\` |
| \`--main-button-text-weight\` | Font weight | \`700\` |
| \`--main-button-text-line-height\` | Line height | \`22px\` |`,
      },
    },
  },
};

export const Default: Story = {
  render: (args) => (
    <Wrapper>
      <MainButton {...args} />
    </Wrapper>
  ),
  args: {
    text: "Main Button",
    model: itemsModel,
  },
};

const DisabledTemplate = () => {
  return (
    <Wrapper>
      <MainButton
        text="Disabled Button"
        isDisabled
        isDropdown={false}
        model={[]}
      />
    </Wrapper>
  );
};

export const Disabled: Story = {
  render: () => <DisabledTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "MainButton in a disabled state. The button cannot be interacted with and appears with reduced opacity.",
      },
      source: {
        code: `<MainButton text="Disabled Button" isDisabled isDropdown={false} model={[]} />`,
      },
    },
  },
};

const DisabledWithDropdownTemplate = () => {
  return (
    <div style={{ maxWidth: "310px" }}>
      <MainButton
        text="Disabled with Dropdown"
        isDropdown
        isDisabled
        model={itemsModel}
      />
    </div>
  );
};

export const DisabledWithDropdown: Story = {
  render: () => <DisabledWithDropdownTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "MainButton with a dropdown menu in a disabled state. Both the button and dropdown are non-interactive.",
      },
      source: {
        code: `<MainButton text="Disabled with Dropdown" isDropdown isDisabled model={itemsModel} />`,
      },
    },
  },
};

const WithActionTemplate = () => {
  return (
    <Wrapper>
      <MainButton
        text="Click Me"
        isDropdown={false}
        model={[]}
        onAction={() => alert("Button clicked")}
      />
    </Wrapper>
  );
};

export const WithAction: Story = {
  render: () => <WithActionTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "MainButton as a simple action button without dropdown. Clicking triggers the onAction callback.",
      },
      source: {
        code: `<MainButton text="Click Me" isDropdown={false} onAction={() => alert("Button clicked")} />`,
      },
    },
  },
};

const WithDropdownTemplate = () => {
  return (
    <Wrapper>
      <MainButton text="Create new" model={itemsModel} />
    </Wrapper>
  );
};

export const WithDropdown: Story = {
  render: () => <WithDropdownTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "MainButton with a full dropdown menu including icons, nested sub-menus, and separators. Click the button to see the dropdown.",
      },
      source: {
        code: `<MainButton
  text="Create new"
  model={[
    { key: 0, label: "New document", icon: FolderIcon },
    { key: 1, label: "New spreadsheet", icon: FolderIcon },
    { key: 2, label: "New presentation", icon: FolderIcon },
    { key: 3, label: "Master form", icon: FolderIcon, items: [
      { key: 4, label: "From blank" },
      { key: 5, label: "From an existing text file" },
    ]},
    { key: 6, label: "New folder", icon: FolderIcon },
    { key: 7, isSeparator: true },
    { key: 8, label: "Upload", icon: FolderIcon },
  ]}
/>`,
      },
    },
  },
};
