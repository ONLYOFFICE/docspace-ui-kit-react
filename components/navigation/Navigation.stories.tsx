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

import React from "react";
import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { DeviceType } from "../../enums";
import Navigation from "./Navigation";

import "./Navigation.stories.scss";

const meta = {
  title: "UI/Navigation/Navigation",
  component: Navigation,
  parameters: {
    docs: {
      description: {
        component: `Navigation provides breadcrumb-style folder navigation with context menus and action buttons.

### Features

- **Breadcrumb Trail**: Displays folder hierarchy with clickable navigation items
- **Context Menus**: Folder options and create actions via dropdown menus
- **Info Panel Toggle**: Built-in button to show/hide the info panel
- **Trash Folder Support**: Special handling for trash folder with clear action
- **Responsive**: Adapts to desktop, tablet, and mobile device types
- **Room Support**: Special display for room-based navigation

### Usage

\`\`\`tsx
import Navigation from "@docspace/ui-kit/components/navigation/Navigation";

<Navigation
  title="My Documents"
  navigationItems={[{ id: "1", title: "Documents", isRootRoom: false }]}
  onClickFolder={(id) => console.log(id)}
  onBackToParentFolder={() => console.log("back")}
  getContextOptionsFolder={() => []}
  getContextOptionsPlus={() => []}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "Current folder title",
    },
    showText: {
      control: "boolean",
      description: "Controls title text visibility",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isRootFolder: {
      control: "boolean",
      description: "Whether the current folder is the root",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    canCreate: {
      control: "boolean",
      description: "Shows the plus/create button",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isTrashFolder: {
      control: "boolean",
      description: "Enables trash folder mode with clear action",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isRoom: {
      control: "boolean",
      description: "Enables room-based navigation display",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    isDesktop: {
      control: "boolean",
      description: "Desktop mode (shows info panel toggle)",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isInfoPanelVisible: {
      control: "boolean",
      description: "Whether the info panel is currently visible",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withMenu: {
      control: "boolean",
      description: "Shows the context menu button",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    showNavigationButton: {
      control: "boolean",
      description: "Shows the navigation action button",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    showRootFolderTitle: {
      control: "boolean",
      description: "Displays the root folder title",
      table: {
        defaultValue: { summary: "true" },
      },
    },
  },
} satisfies Meta<typeof Navigation>;

type Story = StoryObj<ComponentProps<typeof Navigation>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => (
  <div style={{ height: "240px" }}>{props.children}</div>
);

const noop = () => {};

const defaultArgs = {
  showText: true,
  isRootFolder: false,
  title: "My Documents",
  canCreate: true,
  navigationItems: [
    { id: "1", title: "Documents", isRootRoom: false },
    { id: "2", title: "Shared with me", isRootRoom: false },
    { id: "3", title: "Project files", isRootRoom: true },
  ],
  onClickFolder: noop,
  onBackToParentFolder: noop,
  getContextOptionsFolder: () => [
    { key: "rename", label: "Rename" },
    { key: "delete", label: "Delete" },
  ],
  getContextOptionsPlus: () => [
    { key: "upload", label: "Upload file" },
    { key: "create", label: "Create folder" },
  ],
  isTrashFolder: false,
  isEmptyFilesList: false,
  clearTrash: noop,
  showFolderInfo: noop,
  isCurrentFolderInfo: false,
  toggleInfoPanel: noop,
  isInfoPanelVisible: false,
  titles: {
    infoPanel: "Info Panel",
    actions: "Actions",
    contextMenu: "Context Menu",
    warningText: "Warning",
  },
  withMenu: true,
  onPlusClick: noop,
  isEmptyPage: false,
  isDesktop: true,
  isRoom: false,
  isFrame: false,
  hideInfoPanel: noop,
  withLogo: false,
  burgerLogo: "",
  showRootFolderTitle: true,
  isPublicRoom: false,
  titleIcon: "",
  currentDeviceType: DeviceType.desktop,
  rootRoomTitle: "",
  showTitle: true,
  showTitleInDropBox: false,
  navigationButtonLabel: "",
  onNavigationButtonClick: noop,
  showNavigationButton: false,
  onContextOptionsClick: noop,
  onLogoClick: noop,
};

export const Default: Story = {
  render: (args) => (
    <Wrapper>
      <Navigation {...args} />
    </Wrapper>
  ),
  args: defaultArgs,
  parameters: {
    docs: {
      description: {
        story:
          "Default navigation bar showing folder title with breadcrumb items, context menu, and create button.",
      },
      source: {
        code: `<Navigation
  title="My Documents"
  showText
  canCreate
  isDesktop
  navigationItems={[
    { id: "1", title: "Documents", isRootRoom: false },
    { id: "2", title: "Shared with me", isRootRoom: false },
  ]}
  onClickFolder={handleClick}
  onBackToParentFolder={handleBack}
  getContextOptionsFolder={() => [...]}
  getContextOptionsPlus={() => [...]}
/>`,
      },
    },
  },
};

export const RootFolder: Story = {
  render: (args) => (
    <Wrapper>
      <Navigation {...args} />
    </Wrapper>
  ),
  args: {
    ...defaultArgs,
    isRootFolder: true,
    title: "Documents",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Navigation at the root folder level. The back button is hidden since there is no parent folder.",
      },
      source: {
        code: `<Navigation title="Documents" isRootFolder showText canCreate />`,
      },
    },
  },
};

export const TrashFolder: Story = {
  render: (args) => (
    <Wrapper>
      <Navigation {...args} />
    </Wrapper>
  ),
  args: {
    ...defaultArgs,
    isTrashFolder: true,
    title: "Trash",
    canCreate: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Navigation in trash folder mode. Shows a warning and clear trash action instead of create options.",
      },
      source: {
        code: `<Navigation title="Trash" isTrashFolder canCreate={false} clearTrash={handleClear} />`,
      },
    },
  },
};

export const WithInfoPanel: Story = {
  render: (args) => (
    <Wrapper>
      <Navigation {...args} />
    </Wrapper>
  ),
  args: {
    ...defaultArgs,
    isInfoPanelVisible: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Navigation with the info panel toggle active, indicating the info panel is currently visible.",
      },
      source: {
        code: `<Navigation title="My Documents" isInfoPanelVisible isDesktop toggleInfoPanel={handleToggle} />`,
      },
    },
  },
};

export const WithNavigationButton: Story = {
  render: (args) => (
    <Wrapper>
      <Navigation {...args} />
    </Wrapper>
  ),
  args: {
    ...defaultArgs,
    showNavigationButton: true,
    navigationButtonLabel: "Go to Room",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Navigation with an additional action button displayed alongside the standard controls.",
      },
      source: {
        code: `<Navigation
  title="My Documents"
  showNavigationButton
  navigationButtonLabel="Go to Room"
  onNavigationButtonClick={handleClick}
/>`,
      },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          height: "240px",
          // Navigation heading
          "--navigation-heading-size": "20px",
          "--navigation-heading-weight": "700",
          "--navigation-title-color": "#0082c9",
          // Expander / arrow icons
          "--navigation-expander-fill": "#0082c9",
          "--navigation-arrow-fill": "#0082c9",
          // Badge
          "--navigation-badge-fill": "#0082c9",
          // Dropdown box
          "--navigation-dropdown-bg": "#e6f3fb",
          "--navigation-dropdown-shadow": "0 4px 16px rgba(0,130,201,0.25)",
          "--navigation-dropdown-radius": "8px",
          // Separator between logo and title
          "--navigation-separator": "#0082c9",
          // Info-panel toggle active background
          "--navigation-info-panel-bg": "#cce5f6",
          // Chat button open state
          "--navigation-chat-open-bg": "#cce5f6",
          "--navigation-chat-radius": "8px",
          // Warning / trash label
          "--navigation-warning-bg": "#e6f3fb",
          "--navigation-warning-text": "#0082c9",
          "--navigation-warning-radius": "8px",
          // IconButton (context menu, info panel toggle)
          "--icon-button-color": "#0082c9",
          "--icon-button-hover-color": "#006fa6",
        } as React.CSSProperties
      }
    >
      <Navigation {...defaultArgs} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "CSS custom property overrides for the navigation heading, dropdown box, icons, separator, and sub-components (IconButton).",
      },
    },
  },
};
