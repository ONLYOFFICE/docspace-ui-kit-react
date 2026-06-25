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

import type { CSSProperties } from "react";
import { useRef } from "react";

import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import CatalogFolderReactSvgUrl from "../../assets/icons/16/catalog.folder.react.svg?url";
import { globalColors } from "../../providers/theme";

import { ContextMenu } from ".";
import type { ContextMenuModel, ContextMenuRefType } from "./ContextMenu.types";

const meta = {
  title: "UI/Overlays/ContextMenu",
  component: ContextMenu,
  parameters: {
    docs: {
      description: {
        component: `ContextMenu displays a right-click context menu for page or item-level actions.

### Features

- **Right-Click Trigger**: Shows on right-click within the target area
- **Nested Submenus**: Support for multi-level menu items
- **Separators**: Visual dividers between action groups
- **Icons**: Each menu item can have its own icon
- **Disabled Items**: Non-interactive items for unavailable actions
- **Backdrop**: Optional backdrop when menu is open

### Usage

\`\`\`tsx
import { ContextMenu } from "@docspace/ui-kit/components/context-menu";

const menuRef = useRef<ContextMenuRefType>(null);

const model = [
  { key: 0, label: "Edit", icon: EditIcon },
  { key: 1, label: "Delete", icon: DeleteIcon },
];

<div onContextMenu={(e) => menuRef.current?.show(e)}>
  Right click here
</div>
<ContextMenu ref={menuRef} model={model} />
\`\`\``,
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=52-2358&mode=design&t=TBNCKMQKQMxr44IZ-0",
    },
  },
  argTypes: {
    model: {
      control: "object",
      description: "Menu items model array",
    },
    className: {
      control: "text",
      description: "Additional CSS class for the component",
    },
    withBackdrop: {
      control: "boolean",
      description: "Whether to show backdrop when menu is open",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    id: {
      control: "text",
      description: "ID attribute for the component",
    },
    onHide: {
      action: "onHide",
      description: "Callback when menu is hidden",
    },
  },
} satisfies Meta<typeof ContextMenu>;

type Story = StoryObj<ComponentProps<typeof ContextMenu>>;

export default meta;

const fullMenuItems: ContextMenuModel[] = [
  { key: 0, label: "Edit", icon: CatalogFolderReactSvgUrl },
  { key: 1, label: "Preview", icon: CatalogFolderReactSvgUrl },
  { key: 2, isSeparator: true, disabled: false },
  { key: 3, label: "Sharing settings", icon: CatalogFolderReactSvgUrl },
  { key: 4, label: "Link for portal users", icon: CatalogFolderReactSvgUrl },
  { key: 5, label: "Copy external link", icon: CatalogFolderReactSvgUrl },
  { key: 6, label: "Send by e-mail", icon: CatalogFolderReactSvgUrl },
  {
    key: 7,
    label: "Version history",
    icon: CatalogFolderReactSvgUrl,
    items: [
      { key: 8, label: "Show version history" },
      { key: 9, label: "Finalize version" },
      { key: 10, label: "Unblock / Check-in" },
    ],
  },
  { key: 11, isSeparator: true, disabled: false },
  { key: 12, label: "Make as favorite", icon: CatalogFolderReactSvgUrl },
  { key: 13, label: "Download", icon: CatalogFolderReactSvgUrl },
  { key: 14, label: "Download as", icon: CatalogFolderReactSvgUrl },
  {
    key: 15,
    label: "Move or copy",
    icon: CatalogFolderReactSvgUrl,
    items: [
      { key: 16, label: "Move to" },
      { key: 17, label: "Copy" },
      { key: 18, label: "Duplicate" },
    ],
  },
  {
    key: 19,
    label: "Rename",
    icon: CatalogFolderReactSvgUrl,
    disabled: true,
  },
  { key: 20, isSeparator: true, disabled: false },
  { key: 21, label: "Quit", icon: CatalogFolderReactSvgUrl },
];

const DefaultTemplate = () => {
  const cm = useRef<ContextMenuRefType>(null);

  return (
    <div>
      <ContextMenu ref={cm} model={fullMenuItems} />
      <button
        type="button"
        style={{
          width: "200px",
          height: "200px",
          backgroundColor: globalColors.lightSecondMain,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: globalColors.white,
          fontSize: "18px",
          border: "none",
          cursor: "context-menu",
        }}
        onContextMenu={(e) => {
          cm.current?.show(e);
        }}
      >
        Right click on me
      </button>
    </div>
  );
};

export const Default: Story = {
  render: () => <DefaultTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Full-featured context menu with icons, separators, disabled items, and nested submenus. Right-click the colored area to open.",
      },
      source: {
        code: `const cm = useRef<ContextMenuRefType>(null);

<ContextMenu ref={cm} model={menuItems} />
<div onContextMenu={(e) => cm.current?.show(e)}>
  Right click on me
</div>`,
      },
    },
  },
};

const SimpleMenuTemplate = () => {
  const cm = useRef<ContextMenuRefType>(null);
  const simpleItems: ContextMenuModel[] = [
    { key: 0, label: "Cut", icon: CatalogFolderReactSvgUrl },
    { key: 1, label: "Copy", icon: CatalogFolderReactSvgUrl },
    { key: 2, label: "Paste", icon: CatalogFolderReactSvgUrl },
    { key: 3, isSeparator: true, disabled: false },
    { key: 4, label: "Delete", icon: CatalogFolderReactSvgUrl },
  ];

  return (
    <div>
      <ContextMenu ref={cm} model={simpleItems} />
      <button
        type="button"
        style={{
          width: "200px",
          height: "200px",
          backgroundColor: globalColors.lightSecondMain,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: globalColors.white,
          fontSize: "18px",
          border: "none",
          cursor: "context-menu",
        }}
        onContextMenu={(e) => {
          cm.current?.show(e);
        }}
      >
        Right click on me
      </button>
    </div>
  );
};

export const SimpleMenu: Story = {
  render: () => <SimpleMenuTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "A simple context menu with basic editing actions. Right-click the colored area to open.",
      },
      source: {
        code: `<ContextMenu
  ref={cm}
  model={[
    { key: 0, label: "Cut", icon: FolderIcon },
    { key: 1, label: "Copy", icon: FolderIcon },
    { key: 2, label: "Paste", icon: FolderIcon },
    { key: 3, isSeparator: true },
    { key: 4, label: "Delete", icon: FolderIcon },
  ]}
/>`,
      },
    },
  },
};

const WithBackdropTemplate = () => {
  const cm = useRef<ContextMenuRefType>(null);
  const items: ContextMenuModel[] = [
    { key: 0, label: "Option 1", icon: CatalogFolderReactSvgUrl },
    { key: 1, label: "Option 2", icon: CatalogFolderReactSvgUrl },
    { key: 2, label: "Option 3", icon: CatalogFolderReactSvgUrl },
  ];

  return (
    <div>
      <ContextMenu ref={cm} model={items} withBackdrop />
      <button
        type="button"
        style={{
          width: "200px",
          height: "200px",
          backgroundColor: globalColors.lightSecondMain,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: globalColors.white,
          fontSize: "18px",
          border: "none",
          cursor: "context-menu",
        }}
        onContextMenu={(e) => {
          cm.current?.show(e);
        }}
      >
        Right click on me
      </button>
    </div>
  );
};

export const WithBackdrop: Story = {
  render: () => <WithBackdropTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "Context menu with a backdrop overlay. The backdrop dims the background when the menu is open.",
      },
      source: {
        code: `<ContextMenu ref={cm} model={items} withBackdrop />`,
      },
    },
  },
};

const CssCustomizationTemplate = () => {
  const cm = useRef<ContextMenuRefType>(null);

  const items: ContextMenuModel[] = [
    { key: 0, label: "Cut", icon: CatalogFolderReactSvgUrl },
    { key: 1, label: "Copy", icon: CatalogFolderReactSvgUrl },
    { key: 2, label: "Paste", icon: CatalogFolderReactSvgUrl },
    { key: 3, isSeparator: true, disabled: false },
    { key: 4, label: "Delete", icon: CatalogFolderReactSvgUrl },
  ];

  return (
    <div style={{ height: "260px" }}>
      <ContextMenu
        ref={cm}
        model={items}
        style={
          {
            "--context-menu-radius": "12px",
            "--context-menu-bg": "#1e1b4b",
            "--context-menu-border-style": "1px solid #4338ca",
            "--context-menu-text": "#e0e7ff",
            "--context-menu-item-hover-bg": "rgba(255,255,255,0.1)",
            "--context-menu-header-border-style": "1px solid #4338ca",
            "--context-menu-item-text-size": "14px",
          } as CSSProperties
        }
      />
      <button
        type="button"
        data-testid="trigger"
        style={{
          width: "200px",
          height: "100px",
          backgroundColor: globalColors.lightSecondMain,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: globalColors.white,
          border: "none",
          cursor: "context-menu",
        }}
        onContextMenu={(e) => cm.current?.show(e)}
      >
        Right click to open
      </button>
    </div>
  );
};

export const CssCustomization: Story = {
  render: () => <CssCustomizationTemplate />,
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization. Pass via the \`style\` prop on \`<ContextMenu>\`:

\`\`\`css
--context-menu-bg                  /* background color */
--context-menu-border-style        /* border (default: none in light, 1px solid in dark) */
--context-menu-header-border-style /* header/separator border */
--context-menu-shadow              /* box-shadow */
--context-menu-text                /* text/icon color */
--context-menu-item-hover-bg       /* item hover background */
--context-menu-item-disabled-text  /* disabled item text */
--context-menu-item-disabled-bg    /* disabled item hover background */
--context-menu-active-item-bg      /* keyboard-active item background */
--context-menu-radius              /* border-radius (default: 6px) */
--context-menu-menu-item-padding   /* item padding (default: 0 16px) */
--context-menu-header-row-height   /* header height (default: 55px) */
--context-menu-header-inner-padding /* header padding (default: 6px 16px) */
--context-menu-divider-margin      /* separator margin (default: 6px 16px) */
--context-menu-item-text-size      /* item font-size (default: 13px) */
--context-menu-item-text-weight    /* item font-weight (default: 600) */
--context-menu-header-text-size    /* header font-size (default: 15px) */
--context-menu-item-height         /* item line-height (default: 36px) */
\`\`\``,
      },
      source: {
        code: `<ContextMenu
  ref={cm}
  model={items}
  style={{
    "--context-menu-radius": "12px",
    "--context-menu-bg": "#1e1b4b",
    "--context-menu-text": "#e0e7ff",
    "--context-menu-item-hover-bg": "rgba(255,255,255,0.1)",
  }}
/>`,
      },
    },
  },
};
