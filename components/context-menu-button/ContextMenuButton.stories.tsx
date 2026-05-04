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

import type { ComponentProps, CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import VerticalDotsReactSvgUrl from "../../assets/icons/16/vertical-dots.react.svg?url";

import { ContextMenuButton } from ".";
import { ContextMenuButtonDisplayType } from "./ContextMenuButton.enums";

const menuData = [
  { key: "key1", label: "Option 1" },
  { key: "key2", label: "Option 2" },
  { key: "key3", label: "Option 3" },
  { key: "key4", isSeparator: true },
  { key: "key5", label: "Delete", isDisabled: false },
];

function getMenuData() {
  return menuData;
}

const meta = {
  title: "UI/Interactive elements/ContextMenuButton",
  component: ContextMenuButton,
  parameters: {
    docs: {
      description: {
        component: `ContextMenuButton displays a button that opens a context menu with action items. Commonly used for item-level actions in lists and tables.

### Features

- **Dropdown Menu**: Opens a context menu with configurable items
- **Icon Customization**: Configurable icon with hover and click states
- **Direction Control**: Dropdown direction can be set to any corner
- **Display Types**: Supports dropdown, toggle, and auto display modes
- **Disabled State**: Full disabled state for the button
- **Icon Border**: Optional visible border around the icon
- **Portal Support**: Can render dropdown in a portal for z-index management

### Usage

\`\`\`tsx
import { ContextMenuButton, ContextMenuButtonDisplayType } from "@docspace/ui-kit/components/context-menu-button";

// Basic context menu button
<ContextMenuButton
  title="Actions"
  iconName={VerticalDotsIcon}
  getData={() => [
    { key: "edit", label: "Edit" },
    { key: "delete", label: "Delete" },
  ]}
/>

// With fixed direction
<ContextMenuButton
  title="Actions"
  iconName={VerticalDotsIcon}
  directionX="right"
  directionY="bottom"
  fixedDirection
  getData={() => menuData}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "Specifies the icon title / tooltip text",
    },
    size: {
      control: { type: "number", min: 12, max: 32 },
      description: "Specifies the icon size",
      table: {
        defaultValue: { summary: "16" },
      },
    },
    isDisabled: {
      control: "boolean",
      description: "Sets the button to a disabled state",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    displayType: {
      control: "select",
      options: Object.values(ContextMenuButtonDisplayType),
      description: "Sets the display type (dropdown, toggle, auto)",
      table: {
        defaultValue: { summary: "dropdown" },
      },
    },
    directionX: {
      control: "select",
      options: ["left", "right"],
      description: "Horizontal direction for the dropdown",
      table: {
        defaultValue: { summary: "right" },
      },
    },
    directionY: {
      control: "select",
      options: ["top", "bottom", "both"],
      description: "Vertical direction for the dropdown",
      table: {
        defaultValue: { summary: "bottom" },
      },
    },
    fixedDirection: {
      control: "boolean",
      description: "Fixes the direction of the dropdown (disables auto-flip)",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    displayIconBorder: {
      control: "boolean",
      description: "Enables displaying a visible border around the icon",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isFill: {
      control: "boolean",
      description: "Whether to fill the icon",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    usePortal: {
      control: "boolean",
      description: "Renders the dropdown in a portal",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    color: {
      control: "color",
      description: "Icon color",
    },
    hoverColor: {
      control: "color",
      description: "Icon hover color",
    },
    clickColor: {
      control: "color",
      description: "Icon click color",
    },
    onClick: {
      action: "onClick",
      description: "Callback when the button is clicked",
    },
    onClose: {
      action: "onClose",
      description: "Callback when the dropdown closes",
    },
  },
} satisfies Meta<typeof ContextMenuButton>;

type Story = StoryObj<ComponentProps<typeof ContextMenuButton>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => {
  return <div style={{ height: "200px" }}>{props.children}</div>;
};

// DropDown is portaled to body — inject its vars there so they're inherited
const CssCustomizationTemplate = () => {
  return (
    <div
      style={
        {
          "--dropdown-bg": "#e6f3fb",
          "--dropdown-border-style": "1px solid #0082c9",
          "--dropdown-shadow": "0 4px 16px rgba(0, 130, 201, 0.25)",
          "--dropdown-radius": "12px",
          "--dropdown-text-size": "13px",
          "--dropdown-text-weight": "600",
          // === ContextMenuButton own vars ===
          "--cmb-border": "1px solid #0082c9",
          "--cmb-hover-border": "#006ba6",
          "--cmb-size": "36px",
          "--cmb-radius": "8px",
          "--cmb-icon-padding": "8px 9px",
          // === IconButton (trigger icon) ===
          "--icon-button-color": "#0082c9",
          "--icon-button-hover-color": "#006ba6",
        } as CSSProperties
      }
    >
      <Wrapper>
        {/* opened + data pre-loaded so the dropdown panel is visible */}
        <ContextMenuButton
          title="Actions"
          iconName={VerticalDotsReactSvgUrl}
          getData={getMenuData}
          data={menuData}
          opened
          displayIconBorder
          usePortal={false}
        />
      </Wrapper>
    </div>
  );
};

export const CssCustomization: Story = {
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: `CSS vars grouped by the internal part they target:

**ContextMenuButton — button border wrapper**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--cmb-border\` | Border shorthand | theme-based |
| \`--cmb-hover-border\` | Hover border color | theme-based |
| \`--cmb-size\` | Button width and height | \`32px\` |
| \`--cmb-radius\` | Border radius | \`3px\` |
| \`--cmb-icon-padding\` | SVG icon padding | \`6px 7px\` |

**IconButton (trigger icon)**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--icon-button-color\` | Icon fill/stroke color | theme-based |
| \`--icon-button-hover-color\` | Icon hover color | theme-based |
| \`--icon-button-size\` | Icon element size | \`20px\` |

**DropDown (dropdown panel) — set on a parent or \`document.body\` since it renders via portal**

| Variable | Description | Default |
|----------|-------------|---------|
| \`--dropdown-bg\` | Panel background | theme-based |
| \`--dropdown-border-style\` | Panel border | theme-based |
| \`--dropdown-shadow\` | Panel shadow | theme-based |
| \`--dropdown-radius\` | Panel border radius | \`6px\` |
| \`--dropdown-text-size\` | Item font size | \`13px\` |
| \`--dropdown-text-weight\` | Item font weight | \`600\` |
| \`--dropdown-inner-padding\` | Panel inner padding | \`8px 0\` |`,
      },
    },
  },
};

export const Default: Story = {
  render: (args) => (
    <Wrapper>
      <ContextMenuButton {...args} />
    </Wrapper>
  ),
  args: {
    title: "Actions",
    displayType: ContextMenuButtonDisplayType.dropdown,
    iconName: VerticalDotsReactSvgUrl,
    size: 16,
    directionX: "right",
    directionY: "bottom",
    fixedDirection: true,
    isDisabled: false,
    data: menuData,
    usePortal: false,
    getData: getMenuData,
  },
};

const DisabledTemplate = () => {
  return (
    <Wrapper>
      <ContextMenuButton
        title="Actions"
        displayType={ContextMenuButtonDisplayType.dropdown}
        iconName={VerticalDotsReactSvgUrl}
        size={16}
        isDisabled
        data={menuData}
        getData={getMenuData}
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
          "ContextMenuButton in a disabled state. The button cannot be clicked and the dropdown will not open.",
      },
      source: {
        code: `<ContextMenuButton
  title="Actions"
  iconName={VerticalDotsIcon}
  isDisabled
  getData={() => menuData}
/>`,
      },
    },
  },
};

const WithIconBorderTemplate = () => {
  return (
    <Wrapper>
      <ContextMenuButton
        title="Actions"
        displayType={ContextMenuButtonDisplayType.dropdown}
        iconName={VerticalDotsReactSvgUrl}
        size={16}
        displayIconBorder
        directionX="right"
        directionY="bottom"
        fixedDirection
        data={menuData}
        getData={getMenuData}
      />
    </Wrapper>
  );
};

export const WithIconBorder: Story = {
  render: () => <WithIconBorderTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "ContextMenuButton with a visible border around the icon. Provides a clearer visual target for clicking.",
      },
      source: {
        code: `<ContextMenuButton
  title="Actions"
  iconName={VerticalDotsIcon}
  displayIconBorder
  getData={() => menuData}
/>`,
      },
    },
  },
};

const CustomColorsTemplate = () => {
  return (
    <Wrapper>
      <div style={{ display: "flex", gap: "24px" }}>
        <ContextMenuButton
          title="Blue"
          displayType={ContextMenuButtonDisplayType.dropdown}
          iconName={VerticalDotsReactSvgUrl}
          size={16}
          color="#2DA7DB"
          hoverColor="#1a8abf"
          directionX="right"
          directionY="bottom"
          fixedDirection
          data={menuData}
          getData={getMenuData}
        />
        <ContextMenuButton
          title="Green"
          displayType={ContextMenuButtonDisplayType.dropdown}
          iconName={VerticalDotsReactSvgUrl}
          size={16}
          color="#4CAF50"
          hoverColor="#388E3C"
          directionX="right"
          directionY="bottom"
          fixedDirection
          data={menuData}
          getData={getMenuData}
        />
        <ContextMenuButton
          title="Red"
          displayType={ContextMenuButtonDisplayType.dropdown}
          iconName={VerticalDotsReactSvgUrl}
          size={16}
          color="#FF5722"
          hoverColor="#D84315"
          directionX="right"
          directionY="bottom"
          fixedDirection
          data={menuData}
          getData={getMenuData}
        />
      </div>
    </Wrapper>
  );
};

export const CustomColors: Story = {
  render: () => <CustomColorsTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "ContextMenuButtons with custom icon and hover colors. Click any to open the dropdown menu.",
      },
      source: {
        code: `<ContextMenuButton title="Blue" iconName={Icon} color="#2DA7DB" hoverColor="#1a8abf" getData={() => menuData} />
<ContextMenuButton title="Green" iconName={Icon} color="#4CAF50" hoverColor="#388E3C" getData={() => menuData} />
<ContextMenuButton title="Red" iconName={Icon} color="#FF5722" hoverColor="#D84315" getData={() => menuData} />`,
      },
    },
  },
};
