import { useRef, useState } from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, waitFor, within } from "storybook/test";

import CatalogFolderReactSvgUrl from "../../assets/icons/16/catalog.folder.react.svg?url";
import CatalogSharedSvgUrl from "../../assets/icons/16/catalog.shared.outline.svg?url";
import CatalogFavoritesSvgUrl from "../../assets/icons/16/catalog.favorites.react.svg?url";
import CatalogArchiveSvgUrl from "../../assets/icons/16/catalog.archive.react.svg?url";
import CatalogTrashSvgUrl from "../../assets/icons/16/catalog.trash.react.svg?url";
import CatalogRoomsSvgUrl from "../../assets/icons/16/catalog.rooms.react.svg?url";
import CatalogDocumentsSvgUrl from "../../assets/icons/16/catalog.documents.react.svg?url";
import CatalogAiAgentsSvgUrl from "../../assets/icons/16/catalog.ai-agents.react.svg?url";
import VerticalDotsSvgUrl from "../../assets/icons/16/vertical-dots.react.svg?url";
import { ArticleHideMenuIcon as ArticleHideMenuIconReactSvg } from "./icons";

import { Avatar, AvatarRole, AvatarSize } from "../avatar";
import { Badge } from "../badge";
import { ContextMenu } from "../context-menu";
import type { ContextMenuRefType } from "../context-menu";
import { IconButton } from "../icon-button";
import { RootTooltip } from "../tooltip";

import { NavMenu } from "./NavMenu";
import { NavMenuGroup, NavMenuLinkData, NavMenuProps } from "./NavMenu.types";
import storyStyles from "./NavMenu.stories.module.scss";

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
      { id: "rooms", label: "Rooms", icon: CatalogFolderReactSvgUrl },
      { id: "agents", label: "Agents", icon: CatalogFolderReactSvgUrl },
    ],
  },
];

const fullSectionsData: NavMenuGroup[] = [
  {
    id: "workspace",
    label: "Workspace",
    items: [
      {
        id: "documents",
        label: "Documents",
        icon: CatalogFolderReactSvgUrl,
        children: [
          {
            id: "documents-shared",
            label: "Shared with me",
            icon: CatalogFolderReactSvgUrl,
          },
          {
            id: "documents-favorites",
            label: "Favorites",
            icon: CatalogFolderReactSvgUrl,
          },
          {
            id: "documents-recent",
            label: "Recent",
            icon: CatalogFolderReactSvgUrl,
          },
          {
            id: "documents-trash",
            label: "Trash",
            icon: CatalogFolderReactSvgUrl,
          },
        ],
      },
      {
        id: "rooms",
        label: "Rooms",
        icon: CatalogFolderReactSvgUrl,
        children: [
          {
            id: "rooms-favorites",
            label: "Favorites",
            icon: CatalogFolderReactSvgUrl,
          },
          {
            id: "rooms-recent",
            label: "Recent",
            icon: CatalogFolderReactSvgUrl,
          },
          {
            id: "rooms-templates",
            label: "Templates",
            icon: CatalogFolderReactSvgUrl,
          },
          {
            id: "rooms-archive",
            label: "Archive",
            icon: CatalogFolderReactSvgUrl,
          },
        ],
      },
      {
        id: "forms",
        label: "Forms",
        icon: CatalogFolderReactSvgUrl,
        children: [
          {
            id: "forms-in-progress",
            label: "In progress",
            icon: CatalogFolderReactSvgUrl,
          },
          {
            id: "forms-complete",
            label: "Complete",
            icon: CatalogFolderReactSvgUrl,
          },
        ],
      },
      {
        id: "agents",
        label: "Agents",
        icon: CatalogFolderReactSvgUrl,
        children: [
          {
            id: "agents-favorites",
            label: "Favorites",
            icon: CatalogFolderReactSvgUrl,
          },
          {
            id: "agents-recent",
            label: "Recent",
            icon: CatalogFolderReactSvgUrl,
          },
          {
            id: "agents-trash",
            label: "Trash",
            icon: CatalogFolderReactSvgUrl,
          },
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
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    groups: {
      // The icons are data URIs too long to edit, and they stretch the table.
      control: false,
      description:
        "The sections of the menu, in order. Each group has an id, an optional caption and its items; an item may carry an icon, a badge, a link target and a list of sub-items",
    },
    activeItemId: {
      control: "text",
      description:
        "Id of the item or sub-item that is currently open. It is highlighted, and the section it belongs to opens",
    },
    defaultExpandedId: {
      control: "text",
      description:
        "Id of the section that is open on the first render. After that the menu opens and shuts sections itself",
    },
    withAnimation: {
      control: "boolean",
      description:
        "Fills the highlight across an entry from its start to its end when the entry is clicked",
      table: { defaultValue: { summary: "false" } },
    },
    className: {
      control: "text",
      description: "Extra class added to the `nav` element",
    },
    LinkRouter: {
      control: false,
      description:
        "The host's link component. With it, leaf entries that carry `linkData` render as links; without it every entry is a button and `linkData` is ignored",
    },
    iconOnly: {
      control: "boolean",
      description:
        "Collapses the menu to a narrow rail of icons: labels, captions and sub-menus are hidden, each label becomes a tooltip, and the active section's sub-items are listed as entries of their own",
      table: { defaultValue: { summary: "false" } },
    },
    withExpandControl: {
      control: "boolean",
      description:
        "Adds a chevron at the end of every section that opens and shuts it; clicking the item itself then selects it and never shuts it, and several sections can be open at once",
      table: { defaultValue: { summary: "false" } },
    },
  },
  decorators: [
    (Story) => (
      <div
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

// An entry, a button or a link, by the id it was given.
const entry = (root: HTMLElement, id: string) =>
  root.querySelector<HTMLElement>(`[data-item-id="${id}"]`) as HTMLElement;

const isActive = (root: HTMLElement, id: string) =>
  /active/.test(entry(root, id).className);

// A section's sub-menu is open when its wrapper carries `expanded`.
const isExpanded = (root: HTMLElement, id: string) => {
  const subItems = (entry(root, id).closest("li") as HTMLElement).querySelector(
    ':scope > [class*="subItems"]',
  );
  return !!subItems && /expanded/.test(subItems.className);
};

const nav = (root: HTMLElement) => root.querySelector("nav") as HTMLElement;

export const Default: Story = {
  play: async ({ canvasElement, userEvent }) => {
    await expect(within(canvasElement).getByText("Enabled Apps")).toBeVisible();
    await expect(
      within(canvasElement).getByText("Available Apps"),
    ).toBeVisible();
    await expect(isActive(canvasElement, "ai-files")).toBe(true);
    await expect(entry(canvasElement, "ai-files")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await expect(entry(canvasElement, "shared")).toBeVisible();
    // A click on the active section does not shut it.
    await userEvent.click(entry(canvasElement, "ai-files"));
    await expect(isExpanded(canvasElement, "ai-files")).toBe(true);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The starting point: two captioned groups, the first section open and active. Change the active entry, collapse the menu to a rail or try any other prop live in the Controls panel below.",
      },
      source: {
        code: `<NavMenu
  groups={groups}
  activeItemId="ai-files"
  defaultExpandedId="ai-files"
/>`,
      },
    },
  },
};

export const NoSubItems: Story = {
  args: {
    groups: noChildrenData,
    activeItemId: "files",
    defaultExpandedId: undefined,
  },
  play: async ({ canvasElement }) => {
    await expect(isActive(canvasElement, "files")).toBe(true);
    await expect(isActive(canvasElement, "rooms")).toBe(false);
    // Plain destinations: buttons with nothing to expand.
    await expect(entry(canvasElement, "rooms").tagName).toBe("BUTTON");
    await expect(entry(canvasElement, "rooms")).not.toHaveAttribute(
      "aria-expanded",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a short menu of plain destinations: one group whose items have no sub-menus, so each entry is a single row with its icon and label.",
      },
      source: {
        code: `<NavMenu
  groups={[
    {
      id: "apps",
      label: "Apps",
      items: [
        { id: "files", label: "Files", icon: folderIcon },
        { id: "rooms", label: "Rooms", icon: folderIcon },
        { id: "agents", label: "Agents", icon: folderIcon },
      ],
    },
  ]}
  activeItemId="files"
/>`,
      },
    },
  },
};

export const ControlledActive: Story = {
  render: (args) => {
    const [activeId, setActiveId] = useState("ai-files");

    return (
      <NavMenu
        {...args}
        groups={withHandlers(twoGroupsData, setActiveId)}
        activeItemId={activeId}
        defaultExpandedId="ai-files"
      />
    );
  },
  play: async ({ canvasElement, userEvent }) => {
    // The highlight follows the click.
    await userEvent.click(entry(canvasElement, "favorites"));
    await expect(isActive(canvasElement, "favorites")).toBe(true);
    await expect(isActive(canvasElement, "ai-files")).toBe(false);
    await expect(isExpanded(canvasElement, "ai-files")).toBe(true);

    // A section without a sub-menu shuts the open one.
    await userEvent.click(entry(canvasElement, "ai-rooms"));
    await expect(isActive(canvasElement, "ai-rooms")).toBe(true);
    await waitFor(() =>
      expect(isExpanded(canvasElement, "ai-files")).toBe(false),
    );
    await expect(entry(canvasElement, "ai-files")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "How a host wires selection: every entry's `onClick` stores its id, and the stored id goes back as `activeItemId`. Click the entries — the highlight follows, and clicking a section without a sub-menu shuts the open one.",
      },
      source: {
        code: `const [activeId, setActiveId] = useState("ai-files");

const groupsWithHandlers = groups.map((group) => ({
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

<NavMenu
  groups={groupsWithHandlers}
  activeItemId={activeId}
  defaultExpandedId="ai-files"
/>`,
      },
    },
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
  play: async ({ canvasElement }) => {
    // The labels switch to a light colour on the dark surface.
    const label = within(canvasElement).getByText("AI Rooms");
    const [r, g, b] = (getComputedStyle(label).color.match(/\d+/g) ?? []).map(
      Number,
    );
    await expect(Math.min(r, g, b)).toBeGreaterThan(150);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The same menu on a dark surface: inside an element with the `dark` class the captions, labels, icons and highlights switch to the dark palette.",
      },
      source: {
        code: `<div className="dark">
  <NavMenu
    groups={groups}
    activeItemId="ai-files"
    defaultExpandedId="ai-files"
  />
</div>`,
      },
    },
  },
};

export const WithBadge: Story = {
  render: () => {
    const [activeId, setActiveId] = useState("rooms");
    const [iconOnly, setIconOnly] = useState(false);

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

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <NavMenu groups={groups} activeItemId={activeId} iconOnly={iconOnly} />
        <button
          type="button"
          style={{ alignSelf: "flex-start", fontSize: 12 }}
          onClick={() => setIconOnly((v) => !v)}
        >
          Toggle iconOnly (signal dot)
        </button>
      </div>
    );
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByText("5")).toBeVisible();
    await expect(canvas.getByText("new")).toBeVisible();
    // On the rail the badges give way to a dot on each icon.
    await userEvent.click(
      canvas.getByRole("button", { name: "Toggle iconOnly (signal dot)" }),
    );
    await expect(nav(canvasElement).className).toMatch(/iconOnly/);
    await expect(canvas.getByText("5")).not.toBeVisible();
    const dots = Array.from(
      canvasElement.querySelectorAll<HTMLElement>('[class*="itemSignalDot"]'),
    ).filter((dot) => dot.checkVisibility());
    await expect(dots).toHaveLength(2);
  },
  parameters: {
    docs: {
      description: {
        story: `To draw attention to an entry with new content:

- **Rooms** — the kit's counter badge with the number 5 (\`showBadge\`, \`labelBadge\`)
- **Agents** — a badge of the host's own in place of the counter (\`badgeComponent\`)

Press the button below the menu to collapse it to a rail: the badges give way to a dot on each icon.`,
      },
      source: {
        code: `<NavMenu
  groups={[
    {
      id: "apps",
      label: "Apps",
      items: [
        { id: "files", label: "Files", icon: folderIcon },
        { id: "rooms", label: "Rooms", icon: roomsIcon, showBadge: true, labelBadge: 5 },
        {
          id: "agents",
          label: "Agents",
          icon: agentsIcon,
          showBadge: true,
          badgeComponent: <Badge label="new" />,
        },
      ],
    },
  ]}
  activeItemId={activeId}
  iconOnly={iconOnly}
/>`,
      },
    },
  },
};

export const WithAnimation: Story = {
  render: () => {
    const [activeId, setActiveId] = useState("documents-shared");

    return (
      <NavMenu
        groups={withHandlers(fullSectionsData, setActiveId)}
        activeItemId={activeId}
        defaultExpandedId="documents"
        withAnimation
      />
    );
  },
  play: async ({ canvasElement, userEvent }) => {
    // Opening another section shuts the one that was open.
    await userEvent.click(entry(canvasElement, "rooms"));
    await expect(isActive(canvasElement, "rooms")).toBe(true);
    await expect(isExpanded(canvasElement, "rooms")).toBe(true);
    await expect(isExpanded(canvasElement, "documents")).toBe(false);
    // The highlight of the clicked entry fills across it.
    const highlight = (
      entry(canvasElement, "rooms").parentElement as HTMLElement
    ).firstElementChild as HTMLElement;
    await waitFor(() =>
      expect(highlight.className).toMatch(/animatedProgress|animatedFinish/),
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "To give a click visible feedback while the next page loads: click any entry and its highlight fills from the start of the row to the end (`withAnimation`). Opening another section also shuts the one that was open.",
      },
      source: {
        code: `<NavMenu
  groups={groupsWithHandlers}
  activeItemId={activeId}
  defaultExpandedId="documents"
  withAnimation
/>`,
      },
    },
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
  play: async ({ canvas, canvasElement, userEvent }) => {
    // Leaf entries become the router's links; Rooms stays a button.
    await expect(canvas.getByRole("link", { name: "Files" })).toHaveAttribute(
      "href",
      "/files",
    );
    await expect(entry(canvasElement, "rooms").tagName).toBe("BUTTON");
    const archive = canvas.getByRole("link", { name: "Archive" });
    await expect(archive).toHaveAttribute("href", "/rooms/archive");
    await userEvent.click(archive);
    await expect(canvas.getByText("/rooms/archive")).toBeVisible();
    await expect(archive.className).toMatch(/active/);
  },
  parameters: {
    docs: {
      description: {
        story:
          "For an application with a client-side router: Files, Agents and the two Rooms sub-items render as the router's links to their paths (`LinkRouter`, `linkData`), while Rooms itself stays a button because it opens a sub-menu. Click a link — the path it leads to appears below the menu.",
      },
      source: {
        code: `const RouterLink = ({ to, state, className, onClick, children }) => (
  <Link to={to} state={state} className={className} onClick={onClick}>
    {children}
  </Link>
);

<NavMenu
  groups={[
    {
      id: "apps",
      items: [
        { id: "files", label: "Files", linkData: { path: "/files" } },
        {
          id: "rooms",
          label: "Rooms",
          children: [
            { id: "rooms-favorites", label: "Favorites", linkData: { path: "/rooms/favorites" } },
            { id: "rooms-archive", label: "Archive", linkData: { path: "/rooms/archive" } },
          ],
        },
      ],
    },
  ]}
  activeItemId={activeId}
  LinkRouter={RouterLink}
/>`,
      },
    },
  },
};

const bottomGroups: NavMenuGroup[] = [
  {
    id: "bottom",
    items: [
      { id: "contacts", label: "Contacts", icon: CatalogFolderReactSvgUrl },
      { id: "billing", label: "Billing", icon: CatalogFolderReactSvgUrl },
      { id: "settings", label: "Settings", icon: CatalogFolderReactSvgUrl },
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

  const mainGroups = withHandlers(fullSectionsData, setActiveId);
  const bottomGroupsWithHandlers = withHandlers(bottomGroups, setActiveId);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: iconOnly ? "60px" : "252px",
        overflow: "hidden",
        height: "100vh",
        borderInlineEnd: "1px solid var(--border-color, rgba(0, 0, 0, 0.08))",
        padding: iconOnly ? 0 : "0 16px",
      }}
    >
      <RootTooltip />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <NavMenu
          groups={mainGroups}
          activeItemId={activeId}
          defaultExpandedId="agents"
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
          height: 48,
          margin: "0 -16px",
          fontSize: "13px",
          fontWeight: 600,
        }}
      >
        <Avatar
          size={AvatarSize.min}
          role={AvatarRole.user}
          userName="Team member"
          onClick={(e: React.MouseEvent) => menuRef.current?.show(e)}
        />
        {!iconOnly && (
          <span style={{ flex: 1, fontSize: "14px" }}>Team member</span>
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
  play: async ({ canvas, canvasElement, userEvent }) => {
    const [main, bottom] = Array.from(canvasElement.querySelectorAll("nav"));
    await expect(within(main).getByText("Workspace")).toBeVisible();
    // The collapse button switches both menus to the rail.
    await userEvent.click(canvas.getAllByTestId("icon-button")[0]);
    await expect(main.className).toMatch(/iconOnly/);
    await expect(bottom.className).toMatch(/iconOnly/);
    await expect(within(main).getByText("Workspace")).not.toBeVisible();
    await expect(within(bottom).getByText("Settings")).not.toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Two menus assembled into a whole sidebar: the sections at the top scroll, a second menu of settings entries sits at the bottom, followed by a collapse button and the signed-in user. Press the collapse button — both menus switch to the rail together (`iconOnly`), and hovering an icon shows its label.",
      },
      source: {
        code: `<aside style={{ display: "flex", flexDirection: "column", width: iconOnly ? 60 : 252 }}>
  <RootTooltip />
  <div style={{ flex: 1, overflowY: "auto" }}>
    <NavMenu groups={mainGroups} activeItemId={activeId} withAnimation iconOnly={iconOnly} />
  </div>
  <NavMenu groups={bottomGroups} activeItemId={activeId} withAnimation iconOnly={iconOnly} />
  <IconButton iconNode={<ArticleHideMenuIcon />} onClick={() => setIconOnly((v) => !v)} />
</aside>`,
      },
    },
  },
};

const railGroups: NavMenuGroup[] = [
  {
    id: "workspace",
    label: "Workspace",
    items: [
      { id: "overview", label: "Overview", icon: CatalogFolderReactSvgUrl },
      {
        id: "documents",
        label: "Documents",
        icon: CatalogFolderReactSvgUrl,
        children: [
          { id: "recent", label: "Recent", icon: CatalogFolderReactSvgUrl },
          {
            id: "favorites",
            label: "Favorites",
            icon: CatalogFolderReactSvgUrl,
          },
        ],
      },
      {
        id: "rooms",
        label: "Rooms",
        icon: CatalogFolderReactSvgUrl,
        collapsedBadgeComponent: <Badge label={3} />,
        children: [
          {
            id: "rooms-shared",
            label: "Shared",
            icon: CatalogFolderReactSvgUrl,
          },
        ],
      },
    ],
  },
];

export const CollapsedRail: Story = {
  render: () => {
    const [activeId, setActiveId] = useState("recent");

    return (
      <div style={{ width: 56 }}>
        <RootTooltip />
        <NavMenu
          groups={withHandlers(railGroups, setActiveId)}
          activeItemId={activeId}
          iconOnly
        />
      </div>
    );
  },
  play: async ({ canvasElement, userEvent }) => {
    // The active section's sub-items are entries of their own; they are
    // revealed with an animation.
    await waitFor(() => expect(entry(canvasElement, "recent")).toBeVisible());
    await waitFor(() =>
      expect(entry(canvasElement, "favorites")).toBeVisible(),
    );
    await expect(entry(canvasElement, "rooms-shared")).toBeNull();
    // The shut Rooms section shows its badge as a dot.
    const dot = entry(canvasElement, "rooms").querySelector(
      '[class*="itemSignalDot"]',
    ) as HTMLElement;
    await expect(dot).toBeVisible();

    // Hovering an icon shows its label.
    await userEvent.hover(entry(canvasElement, "overview"));
    await waitFor(() =>
      expect(screen.getByRole("tooltip")).toHaveTextContent("Overview"),
    );

    // Selecting Rooms lists its sub-items instead.
    await userEvent.click(entry(canvasElement, "rooms"));
    await waitFor(() =>
      expect(entry(canvasElement, "rooms-shared")).toBeVisible(),
    );
    await expect(entry(canvasElement, "recent")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story: `For a sidebar the user has collapsed to save room (\`iconOnly\`):

- **Recent** and **Favorites** — the sub-items of Documents, the active section, listed as entries of their own under it, with a gap after the last one
- **Rooms** — a shut section with a badge, shown as a dot on its icon
- Hover any icon to read its label; the tooltip is the kit's shared one, so the app mounts \`RootTooltip\` once, as this story does`,
      },
      source: {
        code: `<RootTooltip />
<NavMenu groups={groups} activeItemId="recent" iconOnly />`,
      },
    },
  },
};

const expandControlGroups: NavMenuGroup[] = [
  {
    id: "workspace",
    label: "Workspace",
    items: [
      {
        id: "documents",
        label: "Documents",
        icon: CatalogFolderReactSvgUrl,
        children: [
          { id: "recent", label: "Recent", icon: CatalogFolderReactSvgUrl },
          {
            id: "favorites",
            label: "Favorites",
            icon: CatalogFolderReactSvgUrl,
          },
        ],
      },
      {
        id: "rooms",
        label: "Rooms",
        icon: CatalogFolderReactSvgUrl,
        children: [
          {
            id: "rooms-shared",
            label: "Shared",
            icon: CatalogFolderReactSvgUrl,
          },
          {
            id: "rooms-archive",
            label: "Archive",
            icon: CatalogFolderReactSvgUrl,
          },
        ],
      },
    ],
  },
];

export const WithExpandControl: Story = {
  render: () => {
    const [activeId, setActiveId] = useState("documents");

    return (
      <NavMenu
        groups={withHandlers(expandControlGroups, setActiveId)}
        activeItemId={activeId}
        withExpandControl
      />
    );
  },
  play: async ({ canvasElement, userEvent }) => {
    const chevron = (id: string) =>
      (entry(canvasElement, id).parentElement as HTMLElement).querySelector(
        '[class*="expandButton"]',
      ) as HTMLElement;
    await expect(isExpanded(canvasElement, "documents")).toBe(true);
    await expect(chevron("rooms")).toHaveAttribute("aria-expanded", "false");

    // Several sections may be open at once.
    await userEvent.click(chevron("rooms"));
    await expect(isExpanded(canvasElement, "rooms")).toBe(true);
    await expect(isExpanded(canvasElement, "documents")).toBe(true);
    await userEvent.click(chevron("rooms"));
    await expect(isExpanded(canvasElement, "rooms")).toBe(false);

    // The label selects and never shuts a section.
    await userEvent.click(entry(canvasElement, "documents"));
    await expect(isExpanded(canvasElement, "documents")).toBe(true);
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a touch layout where a section is itself a page: each section gets a chevron at its end (`withExpandControl`). Press the chevron of Rooms — Rooms opens and Documents stays open next to it; press it again to shut Rooms. Clicking a label selects the entry and never shuts a section.",
      },
      source: {
        code: `<NavMenu
  groups={groups}
  activeItemId={activeId}
  withExpandControl
/>`,
      },
    },
  },
};

export const SectionBadges: Story = {
  render: () => {
    const [activeId, setActiveId] = useState("overview");
    const [clickedBadge, setClickedBadge] = useState<string | null>(null);

    const groups: NavMenuGroup[] = [
      {
        id: "workspace",
        label: "Workspace",
        items: [
          {
            id: "overview",
            label: "Overview",
            icon: CatalogFolderReactSvgUrl,
          },
          {
            id: "documents",
            label: "Documents",
            icon: CatalogFolderReactSvgUrl,
            collapsedBadgeComponent: <Badge label={12} />,
            children: [
              {
                id: "recent",
                label: "Recent",
                icon: CatalogFolderReactSvgUrl,
                showBadge: true,
                labelBadge: 9,
                onClickBadge: setClickedBadge,
              },
              {
                id: "shared",
                label: "Shared",
                icon: CatalogFolderReactSvgUrl,
                showBadge: true,
                labelBadge: 3,
                onClickBadge: setClickedBadge,
              },
            ],
          },
        ],
      },
    ];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <NavMenu
          groups={withHandlers(groups, setActiveId)}
          activeItemId={activeId}
        />
        {clickedBadge && (
          <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            Badge clicked: <code>{clickedBadge}</code>
          </div>
        )}
      </div>
    );
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    // The shut section shows its total; open, the counts inside.
    await expect(canvas.getByText("12")).toBeVisible();
    await userEvent.click(entry(canvasElement, "documents"));
    await waitFor(() => expect(canvas.getByText("9")).toBeVisible());
    await expect(canvas.queryByText("12")).toBeNull();

    // A counter reports its sub-item without selecting it.
    await userEvent.click(canvas.getByText("9"));
    await expect(canvas.getByText("recent")).toBeVisible();
    await expect(isActive(canvasElement, "recent")).toBe(false);
  },
  parameters: {
    docs: {
      description: {
        story: `For counts that live on sub-items:

- **Documents** — while the section is shut it shows the total, 12, in a badge of its own (\`collapsedBadgeComponent\`); click it to open the section and the total gives way to the counts inside
- **Recent** and **Shared** — a counter on each sub-item (\`showBadge\`, \`labelBadge\`); click a counter and the sub-item it belongs to is reported below the menu, without selecting it (\`onClickBadge\`)`,
      },
      source: {
        code: `<NavMenu
  groups={[
    {
      id: "workspace",
      items: [
        { id: "overview", label: "Overview" },
        {
          id: "documents",
          label: "Documents",
          collapsedBadgeComponent: <Badge label={12} />,
          children: [
            { id: "recent", label: "Recent", showBadge: true, labelBadge: 9, onClickBadge },
            { id: "shared", label: "Shared", showBadge: true, labelBadge: 3, onClickBadge },
          ],
        },
      ],
    },
  ]}
  activeItemId={activeId}
/>`,
      },
    },
  },
};

const separatorGroups: NavMenuGroup[] = [
  {
    id: "workspace",
    items: [
      {
        id: "documents",
        label: "Documents",
        icon: CatalogFolderReactSvgUrl,
        children: [
          { id: "recent", label: "Recent", icon: CatalogFolderReactSvgUrl },
          {
            id: "favorites",
            label: "Favorites",
            icon: CatalogFolderReactSvgUrl,
          },
          {
            id: "trash",
            label: "Trash",
            icon: CatalogFolderReactSvgUrl,
            withTopSeparator: true,
          },
        ],
      },
    ],
  },
];

export const WithSeparator: Story = {
  args: {
    groups: separatorGroups,
    activeItemId: "recent",
    defaultExpandedId: "documents",
  },
  play: async ({ canvasElement }) => {
    // A gap above Trash; the theme draws no line in it.
    const trash = entry(canvasElement, "trash").closest("li") as HTMLElement;
    await expect(getComputedStyle(trash).marginTop).toBe("8px");
    await expect(getComputedStyle(trash).paddingTop).toBe("8px");
    await expect(getComputedStyle(trash).borderTopWidth).toBe("0px");
    const favorites = entry(canvasElement, "favorites").closest(
      "li",
    ) as HTMLElement;
    await expect(getComputedStyle(favorites).marginTop).toBe("0px");
  },
  parameters: {
    docs: {
      description: {
        story:
          "To set one sub-item apart from the rest without a second section: Trash sits below a gap (`withTopSeparator`). A line is drawn in that gap only once `--nav-menu-separator-color` gives it a colour — the theme sets none, as the CSS Customization story shows.",
      },
      source: {
        code: `<NavMenu
  groups={[
    {
      id: "workspace",
      items: [
        {
          id: "documents",
          label: "Documents",
          children: [
            { id: "recent", label: "Recent" },
            { id: "favorites", label: "Favorites" },
            { id: "trash", label: "Trash", withTopSeparator: true },
          ],
        },
      ],
    },
  ]}
  activeItemId="recent"
  defaultExpandedId="documents"
/>`,
      },
    },
  },
};

export const ClickWithoutExpanding: Story = {
  render: () => {
    const [activeId, setActiveId] = useState("overview");
    const [message, setMessage] = useState<string | null>(null);

    const groups: NavMenuGroup[] = [
      {
        id: "workspace",
        items: [
          {
            id: "overview",
            label: "Overview",
            icon: CatalogFolderReactSvgUrl,
            onClick: (item) => setActiveId(item.id),
          },
          {
            id: "invite",
            label: "Invite people",
            icon: CatalogFolderReactSvgUrl,
            onClick: () => {
              setMessage("A dialog would open here");
              return false;
            },
            children: [
              {
                id: "invite-link",
                label: "Copy link",
                icon: CatalogFolderReactSvgUrl,
              },
            ],
          },
        ],
      },
    ];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <NavMenu groups={groups} activeItemId={activeId} />
        {message && (
          <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            {message}
          </div>
        )}
      </div>
    );
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    // onClick returning false keeps the sub-menu shut.
    await userEvent.click(entry(canvasElement, "invite"));
    await expect(canvas.getByText("A dialog would open here")).toBeVisible();
    await expect(isExpanded(canvasElement, "invite")).toBe(false);
    await expect(entry(canvasElement, "invite")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "For a section whose click opens a dialog rather than a page: click Invite people — its sub-menu stays shut, because its `onClick` returns `false`, and the message below the menu stands in for the dialog.",
      },
      source: {
        code: `{
  id: "invite",
  label: "Invite people",
  onClick: () => {
    openDialog();
    return false;
  },
  children: [{ id: "invite-link", label: "Copy link" }],
}`,
      },
    },
  },
};

const rtlGroups: NavMenuGroup[] = [
  {
    id: "workspace",
    label: "\u0645\u0633\u0627\u062d\u0629 \u0627\u0644\u0639\u0645\u0644",
    items: [
      {
        id: "documents",
        label: "\u0645\u0644\u0641\u0627\u062a",
        icon: CatalogFolderReactSvgUrl,
        children: [
          {
            id: "recent",
            label: "\u0627\u0644\u0623\u062e\u064a\u0631\u0629",
            icon: CatalogFolderReactSvgUrl,
            showBadge: true,
            labelBadge: 4,
          },
          {
            id: "favorites",
            label: "\u0627\u0644\u0645\u0641\u0636\u0644\u0629",
            icon: CatalogFolderReactSvgUrl,
          },
        ],
      },
      {
        id: "rooms",
        label: "\u0627\u0644\u063a\u0631\u0641",
        icon: CatalogFolderReactSvgUrl,
      },
    ],
  },
];

export const RightToLeft: Story = {
  globals: { direction: "rtl" },
  play: async ({ canvasElement }) => {
    const [menu] = Array.from(canvasElement.querySelectorAll("nav"));
    // The icon starts at the right edge, before the label.
    const rooms = entry(menu, "rooms");
    const icon = (
      rooms.querySelector('[class*="itemIconWrapper"]') as HTMLElement
    ).getBoundingClientRect();
    const label = (
      rooms.querySelector('[class*="itemText"]') as HTMLElement
    ).getBoundingClientRect();
    await expect(icon.left).toBeGreaterThanOrEqual(label.right);
    // The counter sits at the left end of its row.
    const recent = entry(menu, "recent").getBoundingClientRect();
    const counter = within(menu).getByText("4").getBoundingClientRect();
    await expect(counter.right).toBeLessThanOrEqual(recent.left + 1);
  },
  render: () => (
    <div
      dir="rtl"
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
    >
      <RootTooltip />
      <NavMenu
        groups={rtlGroups}
        activeItemId="recent"
        defaultExpandedId="documents"
      />
      <div style={{ width: 56 }}>
        <NavMenu groups={rtlGroups} activeItemId="recent" iconOnly />
      </div>
    </div>
  ),
  parameters: {
    noPadding: true,
    docs: {
      description: {
        story:
          "The menu in a right-to-left interface: icons and captions start at the right edge, sub-items are indented from the right, and the counter sits at the left end of its row. Below it, the collapsed rail keeps its highlight tile centred on the active icon.",
      },
      source: {
        code: `<div dir="rtl">
  <NavMenu groups={groups} activeItemId="recent" defaultExpandedId="documents" />
  <NavMenu groups={groups} activeItemId="recent" iconOnly />
</div>`,
      },
      // Framed so the RTL direction it stamps on <html> stays out of the Docs page
      story: { inline: false, height: "476px" },
    },
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <NavMenu
        className={storyStyles.customNav}
        groups={separatorGroups.map((group) => ({
          ...group,
          label: "Workspace",
        }))}
        activeItemId="recent"
        defaultExpandedId="documents"
      />
      <div style={{ width: 56 }}>
        <NavMenu
          className={storyStyles.customNav}
          groups={railGroups}
          activeItemId="overview"
          iconOnly
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [menu, rail] = Array.from(canvasElement.querySelectorAll("nav"));
    await expect(
      getComputedStyle(within(menu).getByText("Workspace")).color,
    ).toBe("rgb(124, 58, 237)");
    // The active sub-item's highlight.
    const highlight = (entry(menu, "recent").parentElement as HTMLElement)
      .firstElementChild as HTMLElement;
    await expect(getComputedStyle(highlight).backgroundColor).toBe(
      "rgb(109, 40, 217)",
    );
    const trash = entry(menu, "trash").closest("li") as HTMLElement;
    await expect(getComputedStyle(trash).borderTopColor).toBe(
      "rgb(167, 139, 250)",
    );
    const dot = entry(rail, "rooms").querySelector(
      '[class*="itemSignalDot"]',
    ) as HTMLElement;
    await expect(getComputedStyle(dot).backgroundColor).toBe(
      "rgb(219, 39, 119)",
    );
  },
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set through \`className\` -- the variables, and why a wrapper cannot set them, are listed under CSS variables on this page.

- **The open menu** — every variable but the dot: the caption, the labels, the icons, the active highlight and the line above Trash; hover an entry for the hover colour, and press Tab for the focus outline
- **The rail** — the dot on the Rooms icon (\`--nav-menu-signal-dot-color\`), which only the collapsed form shows`,
      },
      source: {
        code: `/* A rule more specific than the theme's own .light .root */
.light nav.custom-nav,
.dark nav.custom-nav {
  --nav-menu-group-label-color: #7c3aed;
  --nav-menu-item-text-color: #4c1d95;
  --nav-menu-item-text-active-color: #ffffff;
  --nav-menu-item-icon-color: #7c3aed;
  --nav-menu-item-icon-active-color: #ffffff;
  --nav-menu-item-bg-hover: #ede9fe;
  --nav-menu-item-bg-active: #6d28d9;
  --nav-menu-signal-dot-color: #db2777;
  --nav-menu-separator-color: #a78bfa;
}

<NavMenu className="custom-nav" groups={groups} activeItemId="recent" defaultExpandedId="documents" />
<NavMenu className="custom-nav" groups={groups} activeItemId="overview" iconOnly />`,
      },
    },
  },
};
