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

import { useRef, useState } from "react";
import { Meta, StoryObj } from "@storybook/react-vite";

import CatalogFolderReactSvgUrl from "../../assets/icons/16/catalog.folder.react.svg?url";
import CatalogSharedSvgUrl from "../../assets/icons/16/catalog.shared.outline.svg?url";
import CatalogFavoritesSvgUrl from "../../assets/icons/16/catalog.favorites.react.svg?url";
import CatalogArchiveSvgUrl from "../../assets/icons/16/catalog.archive.react.svg?url";
import CatalogTrashSvgUrl from "../../assets/icons/16/catalog.trash.react.svg?url";
import CatalogRoomsSvgUrl from "../../assets/icons/16/catalog.rooms.react.svg?url";
import CatalogDocumentsSvgUrl from "../../assets/icons/16/catalog.documents.react.svg?url";
import CatalogAiAgentsSvgUrl from "../../assets/icons/16/catalog.ai-agents.react.svg?url";
import CatalogPortfolioSvgUrl from "../../assets/icons/16/catalog.portfolio.react.svg?url";
import CatalogDeveloperSvgUrl from "../../assets/icons/16/catalog.developer.react.svg?url";
import CatalogSettingsSvgUrl from "../../assets/icons/16/catalog-settings-common.svg?url";
import PeopleReactSvgUrl from "../../assets/icons/16/people.react.svg?url";
import VerticalDotsSvgUrl from "../../assets/icons/16/vertical-dots.react.svg?url";
import PaymentReactSvgUrl from "../../assets/icons/16/catalog-settings-payment.svg?url";
import { ArticleHideMenuIcon as ArticleHideMenuIconReactSvg } from "./icons";
import DarkLeftMenuLogo from "../../assets/logo/dark_leftmenu.svg";

import { Avatar, AvatarRole, AvatarSize } from "../avatar";
import { Badge } from "../badge";
import { ContextMenu } from "../context-menu";
import type { ContextMenuRefType } from "../context-menu";
import { IconButton } from "../icon-button";

import { NavMenu } from "./NavMenu";
import { NavMenuGroup, NavMenuLinkData, NavMenuProps } from "./NavMenu.types";
import styles from "./NavMenu.module.scss";
import storyStyles from "./NavMenu.stories.module.scss";
import PortalLogo from "../portal-logo/PortalLogo";

const twoGroupsData: NavMenuGroup[] = [
  {
    id: "enabled",
    label: "Enabled Apps",
    items: [
      {
        id: "ai-files",
        label: "AI Files",
        icon: CatalogFolderReactSvgUrl,
        children: [
          {
            id: "shared",
            label: "Shared with me",
            icon: CatalogSharedSvgUrl,
          },
          {
            id: "favorites",
            label: "Favorites",
            icon: CatalogFavoritesSvgUrl,
          },
          {
            id: "recent",
            label: "Recent",
            icon: CatalogArchiveSvgUrl,
          },
          {
            id: "trash",
            label: "Trash",
            icon: CatalogTrashSvgUrl,
          },
        ],
      },
    ],
  },
  {
    id: "available",
    label: "Available Apps",
    items: [
      {
        id: "ai-rooms",
        label: "AI Rooms",
        icon: CatalogRoomsSvgUrl,
      },
      {
        id: "ai-forms",
        label: "AI Forms",
        icon: CatalogDocumentsSvgUrl,
      },
      {
        id: "ai-agents",
        label: "AI Agents",
        icon: CatalogAiAgentsSvgUrl,
      },
    ],
  },
];

const noChildrenData: NavMenuGroup[] = [
  {
    id: "apps",
    label: "Apps",
    items: [
      { id: "files", label: "Files", icon: CatalogFolderReactSvgUrl },
      { id: "rooms", label: "Rooms", icon: CatalogRoomsSvgUrl },
      { id: "agents", label: "Agents", icon: CatalogAiAgentsSvgUrl },
    ],
  },
];

const fullEnabledAppsData: NavMenuGroup[] = [
  {
    id: "enabled",
    label: "Enabled Apps",
    items: [
      {
        id: "ai-files",
        label: "AI Files",
        icon: CatalogFolderReactSvgUrl,
        children: [
          {
            id: "files-shared",
            label: "Shared with me",
            icon: CatalogSharedSvgUrl,
          },
          {
            id: "files-favorites",
            label: "Favorites",
            icon: CatalogFavoritesSvgUrl,
          },
          { id: "files-recent", label: "Recent", icon: CatalogArchiveSvgUrl },
          { id: "files-trash", label: "Trash", icon: CatalogTrashSvgUrl },
        ],
      },
      {
        id: "ai-rooms",
        label: "AI Rooms",
        icon: CatalogRoomsSvgUrl,
        children: [
          {
            id: "rooms-favorites",
            label: "Favorites",
            icon: CatalogFavoritesSvgUrl,
          },
          { id: "rooms-recent", label: "Recent", icon: CatalogArchiveSvgUrl },
          {
            id: "rooms-templates",
            label: "Templates",
            icon: CatalogPortfolioSvgUrl,
          },
          {
            id: "rooms-archive",
            label: "Archive",
            icon: CatalogDocumentsSvgUrl,
          },
        ],
      },
      {
        id: "ai-forms",
        label: "AI Forms",
        icon: CatalogDocumentsSvgUrl,
        children: [
          {
            id: "forms-in-progress",
            label: "In Progress",
            icon: CatalogDeveloperSvgUrl,
          },
          {
            id: "forms-complete",
            label: "Complete",
            icon: CatalogFavoritesSvgUrl,
          },
        ],
      },
      {
        id: "ai-agents",
        label: "AI Agents",
        icon: CatalogAiAgentsSvgUrl,
        children: [
          {
            id: "agents-favorites",
            label: "Favorites",
            icon: CatalogFavoritesSvgUrl,
          },
          { id: "agents-recent", label: "Recent", icon: CatalogArchiveSvgUrl },
          { id: "agents-trash", label: "Trash", icon: CatalogTrashSvgUrl },
        ],
      },
    ],
  },
];

function withHandlers(
  groups: NavMenuGroup[],
  onSelect: (id: string) => void,
): NavMenuGroup[] {
  return groups.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      onClick: () => onSelect(item.id),
      children: item.children?.map((sub) => ({
        ...sub,
        onClick: () => onSelect(sub.id),
      })),
    })),
  }));
}

const meta = {
  title: "UI/Navigation/NavMenu",
  component: NavMenu,
  parameters: {
    docs: {
      description: {
        component:
          "Sidebar navigation menu with collapsible groups and sub-items. " +
          "Clicking an item with children expands it; clicking another collapses the previous one. " +
          "Supports light/dark themes via CSS custom properties.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        className={styles.storyWrapper}
        style={{
          width: "250px",
          padding: 15,
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    groups: twoGroupsData,
    activeItemId: "ai-files",
    defaultExpandedId: "ai-files",
  },
} satisfies Meta<typeof NavMenu>;

type Story = StoryObj<typeof NavMenu>;

export default meta;

export const Default: Story = {};

export const NoSubItems: Story = {
  args: {
    groups: noChildrenData,
    activeItemId: "files",
    defaultExpandedId: undefined,
  },
};

export const ControlledActive: Story = {
  render: (args) => {
    const [activeId, setActiveId] = useState("ai-files");

    const groupsWithHandlers: NavMenuGroup[] = twoGroupsData.map((group) => ({
      ...group,
      items: group.items.map((item) => ({
        ...item,
        onClick: () => setActiveId(item.id),
        children: item.children?.map((sub) => ({
          ...sub,
          onClick: () => setActiveId(sub.id),
        })),
      })),
    }));

    return (
      <NavMenu
        {...args}
        groups={groupsWithHandlers}
        activeItemId={activeId}
        defaultExpandedId="ai-files"
      />
    );
  },
};

export const DarkTheme: Story = {
  decorators: [
    (Story) => (
      <div
        className="dark"
        style={{ background: "#1f1f1f", padding: "15px", width: "250px" }}
      >
        <Story />
      </div>
    ),
  ],
};

export const WithBadge: Story = {
  render: () => {
    const [activeId, setActiveId] = useState("rooms");

    const groups: NavMenuGroup[] = [
      {
        id: "apps",
        label: "Apps",
        items: [
          {
            id: "files",
            label: "Files",
            icon: CatalogFolderReactSvgUrl,
            onClick: (item) => setActiveId(item.id),
          },
          {
            id: "rooms",
            label: "Rooms",
            icon: CatalogRoomsSvgUrl,
            onClick: (item) => setActiveId(item.id),
            showBadge: true,
            labelBadge: 5,
          },
          {
            id: "agents",
            label: "Agents",
            icon: CatalogAiAgentsSvgUrl,
            onClick: (item) => setActiveId(item.id),
            showBadge: true,
            badgeComponent: <Badge label="new" />,
          },
        ],
      },
    ];

    return <NavMenu groups={groups} activeItemId={activeId} />;
  },
};

export const FullEnabledApps: Story = {
  render: () => {
    const [activeId, setActiveId] = useState("files-shared");

    return (
      <NavMenu
        groups={withHandlers(fullEnabledAppsData, setActiveId)}
        activeItemId={activeId}
        defaultExpandedId="ai-files"
        withAnimation
      />
    );
  },
};

type MockLinkRouterProps = React.ComponentProps<
  NonNullable<NavMenuProps["LinkRouter"]>
>;

const MockLinkRouter = ({
  to,
  state,
  className,
  onClick,
  children,
}: MockLinkRouterProps) => (
  <a
    href={typeof to === "string" ? to : "#"}
    className={className}
    data-state={JSON.stringify(state)}
    onClick={(e) => {
      e.preventDefault();
      onClick?.(e);
    }}
  >
    {children}
  </a>
);

export const WithLinkData: Story = {
  render: () => {
    const [activeId, setActiveId] = useState("rooms");
    const [navigatedTo, setNavigatedTo] = useState<NavMenuLinkData | null>(
      null,
    );

    const groups: NavMenuGroup[] = [
      {
        id: "apps",
        label: "Apps",
        items: [
          {
            id: "files",
            label: "Files",
            icon: CatalogFolderReactSvgUrl,
            onClick: (item) => {
              setActiveId(item.id);
              setNavigatedTo(item.linkData ?? null);
            },
            linkData: { path: "/files", state: { title: "Files" } },
          },
          {
            id: "rooms",
            label: "Rooms",
            icon: CatalogRoomsSvgUrl,
            onClick: (item) => setActiveId(item.id),
            children: [
              {
                id: "rooms-favorites",
                label: "Favorites",
                icon: CatalogFavoritesSvgUrl,
                onClick: (sub) => {
                  setActiveId(sub.id);
                  setNavigatedTo(sub.linkData ?? null);
                },
                linkData: {
                  path: "/rooms/favorites",
                  state: { title: "Favorites" },
                },
              },
              {
                id: "rooms-archive",
                label: "Archive",
                icon: CatalogArchiveSvgUrl,
                onClick: (sub) => {
                  setActiveId(sub.id);
                  setNavigatedTo(sub.linkData ?? null);
                },
                linkData: {
                  path: "/rooms/archive",
                  state: { title: "Archive" },
                },
              },
            ],
          },
          {
            id: "agents",
            label: "Agents",
            icon: CatalogAiAgentsSvgUrl,
            onClick: (item) => {
              setActiveId(item.id);
              setNavigatedTo(item.linkData ?? null);
            },
            linkData: { path: "/agents", state: { title: "Agents" } },
          },
        ],
      },
    ];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <NavMenu
          groups={groups}
          activeItemId={activeId}
          defaultExpandedId="rooms"
          LinkRouter={MockLinkRouter}
        />
        {navigatedTo && (
          <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            Navigated to: <code>{navigatedTo.path}</code>
          </div>
        )}
      </div>
    );
  },
};

const bottomGroups: NavMenuGroup[] = [
  {
    id: "bottom",
    items: [
      { id: "contacts", label: "Contacts", icon: PeopleReactSvgUrl },
      { id: "billing", label: "Billing", icon: PaymentReactSvgUrl },
      { id: "settings", label: "Settings", icon: CatalogSettingsSvgUrl },
    ],
  },
];

const profileMenu = [
  { key: "profile", label: "Profile" },
  { key: "settings-item", label: "Settings" },
  { key: "sep", isSeparator: true },
  { key: "signout", label: "Sign out" },
];

const SidebarDemo = () => {
  const [activeId, setActiveId] = useState("agents-favorites");
  const [iconOnly, setIconOnly] = useState(false);
  const menuRef = useRef<ContextMenuRefType>(null);

  const mainGroups = withHandlers(fullEnabledAppsData, setActiveId);
  const bottomGroupsWithHandlers = withHandlers(bottomGroups, setActiveId);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: iconOnly ? "60px" : "252px",
        overflow: "hidden",
        height: "100vh",
        backgroundColor: "var(--nav-menu-story-bg)",
        borderInlineEnd: "1px solid var(--border-color, rgba(0, 0, 0, 0.08))",
        padding: iconOnly ? 0 : "0 16px",
      }}
    >
      <div
        style={{
          height: 24,
          marginBottom: 15,
          padding: "0 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: iconOnly ? "center" : "flex-start",
        }}
      >
        {iconOnly ? (
          <DarkLeftMenuLogo width={24} height={24} />
        ) : (
          <PortalLogo className={storyStyles.logo} />
        )}
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        <NavMenu
          groups={mainGroups}
          activeItemId={activeId}
          defaultExpandedId="ai-agents"
          withAnimation
          iconOnly={iconOnly}
        />
      </div>
      <NavMenu
        groups={bottomGroupsWithHandlers}
        activeItemId={activeId}
        withAnimation
        iconOnly={iconOnly}
      />
      <div
        style={{
          paddingInline: "12px",
          paddingBlock: "4px",
          margin: "28px 0 12px",
        }}
      >
        <IconButton
          size={20}
          isFill={false}
          iconNode={
            <div style={{ transform: iconOnly ? "scaleX(-1)" : "none" }}>
              <ArticleHideMenuIconReactSvg />
            </div>
          }
          onClick={() => setIconOnly((v) => !v)}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          paddingBlock: "12px",
          paddingInline: iconOnly ? "0" : "16px",
          justifyContent: iconOnly ? "center" : "flex-start",
          borderBlockStart:
            "1px solid var(--border-color, rgba(0, 0, 0, 0.08))",
          background: "#F3F4F4",
          height: 48,
          margin: "0 -16px",
          fontSize: "13px",
          fontWeight: 600,
        }}
      >
        <Avatar
          size={AvatarSize.min}
          role={AvatarRole.user}
          userName="Paula Miller"
          onClick={(e: React.MouseEvent) => menuRef.current?.show(e)}
        />
        {!iconOnly && (
          <span style={{ flex: 1, fontSize: "14px" }}>Paula Miller</span>
        )}
        {!iconOnly && (
          <IconButton
            size={16}
            iconName={VerticalDotsSvgUrl}
            onClick={(e) => menuRef.current?.show(e)}
          />
        )}
        <ContextMenu ref={menuRef} model={profileMenu} />
      </div>
    </div>
  );
};

export const FullSidebar: Story = {
  decorators: [
    (Story) => (
      <div style={{ height: "100vh", display: "flex" }}>
        <Story />
      </div>
    ),
  ],
  render: () => <SidebarDemo />,
};
