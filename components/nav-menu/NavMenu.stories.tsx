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

import { useState } from "react";
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

import { Badge } from "../badge";

import { NavMenu } from "./NavMenu";
import { NavMenuGroup, NavMenuLinkData, NavMenuProps } from "./NavMenu.types";
import styles from "./NavMenu.module.scss";

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
      <div className={styles.storyWrapper} style={{ width: "250px" }}>
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

    const groups: NavMenuGroup[] = [
      {
        id: "enabled",
        label: "Enabled Apps",
        items: [
          {
            id: "ai-files",
            label: "AI Files",
            icon: CatalogFolderReactSvgUrl,
            onClick: (item) => setActiveId(item.id),
            children: [
              {
                id: "files-shared",
                label: "Shared with me",
                icon: CatalogSharedSvgUrl,
                onClick: (sub) => setActiveId(sub.id),
              },
              {
                id: "files-favorites",
                label: "Favorites",
                icon: CatalogFavoritesSvgUrl,
                onClick: (sub) => setActiveId(sub.id),
              },
              {
                id: "files-recent",
                label: "Recent",
                icon: CatalogArchiveSvgUrl,
                onClick: (sub) => setActiveId(sub.id),
              },
              {
                id: "files-trash",
                label: "Trash",
                icon: CatalogTrashSvgUrl,
                onClick: (sub) => setActiveId(sub.id),
              },
            ],
          },
          {
            id: "ai-rooms",
            label: "AI Rooms",
            icon: CatalogRoomsSvgUrl,
            onClick: (item) => setActiveId(item.id),
            children: [
              {
                id: "rooms-favorites",
                label: "Favorites",
                icon: CatalogFavoritesSvgUrl,
                onClick: (sub) => setActiveId(sub.id),
              },
              {
                id: "rooms-recent",
                label: "Recent",
                icon: CatalogArchiveSvgUrl,
                onClick: (sub) => setActiveId(sub.id),
              },
              {
                id: "rooms-templates",
                label: "Templates",
                icon: CatalogPortfolioSvgUrl,
                onClick: (sub) => setActiveId(sub.id),
              },
              {
                id: "rooms-archive",
                label: "Archive",
                icon: CatalogDocumentsSvgUrl,
                onClick: (sub) => setActiveId(sub.id),
              },
            ],
          },
          {
            id: "ai-forms",
            label: "AI Forms",
            icon: CatalogDocumentsSvgUrl,
            onClick: (item) => setActiveId(item.id),
            children: [
              {
                id: "forms-in-progress",
                label: "In Progress",
                icon: CatalogDeveloperSvgUrl,
                onClick: (sub) => setActiveId(sub.id),
              },
              {
                id: "forms-complete",
                label: "Complete",
                icon: CatalogFavoritesSvgUrl,
                onClick: (sub) => setActiveId(sub.id),
              },
            ],
          },
          {
            id: "ai-agents",
            label: "AI Agents",
            icon: CatalogAiAgentsSvgUrl,
            onClick: (item) => setActiveId(item.id),
            children: [
              {
                id: "agents-favorites",
                label: "Favorites",
                icon: CatalogFavoritesSvgUrl,
                onClick: (sub) => setActiveId(sub.id),
              },
              {
                id: "agents-recent",
                label: "Recent",
                icon: CatalogArchiveSvgUrl,
                onClick: (sub) => setActiveId(sub.id),
              },
              {
                id: "agents-trash",
                label: "Trash",
                icon: CatalogTrashSvgUrl,
                onClick: (sub) => setActiveId(sub.id),
              },
            ],
          },
        ],
      },
    ];

    return (
      <NavMenu
        groups={groups}
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
    const [navigatedTo, setNavigatedTo] = useState<NavMenuLinkData | null>(null);

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
                linkData: { path: "/rooms/favorites", state: { title: "Favorites" } },
              },
              {
                id: "rooms-archive",
                label: "Archive",
                icon: CatalogArchiveSvgUrl,
                onClick: (sub) => {
                  setActiveId(sub.id);
                  setNavigatedTo(sub.linkData ?? null);
                },
                linkData: { path: "/rooms/archive", state: { title: "Archive" } },
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
