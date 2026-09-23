import type { CSSProperties } from "react";
import { useRef, useState } from "react";

import type { ComponentProps } from "react";

import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";

import DefaultUserPhotoUrl from "../../assets/default_user_photo_size_82-82.png";
import CatalogFolderIcon from "../../assets/icons/16/catalog.folder.react.svg";
import CatalogFolderReactSvgUrl from "../../assets/icons/16/catalog.folder.react.svg?url";
import { globalColors } from "../../providers/theme";

import { ContextMenu } from ".";
import type {
  ContextMenuModel,
  ContextMenuProps,
  ContextMenuRefType,
  HeaderType,
} from "./ContextMenu.types";

const meta = {
  title: "UI/Overlays/ContextMenu",
  component: ContextMenu,
  parameters: {
    docs: {
      description: {
        component: `ContextMenu displays a right-click context menu for page or item-level actions.

### Features

- **Right-Click Trigger**: Opens at the pointer where the host calls \`show\`, usually from its right-click handler
- **Nested Submenus**: Support for multi-level menu items
- **Separators**: Visual dividers between action groups
- **Icons**: Each menu item can have its own icon
- **Disabled Items**: Dropped from the list unless \`showDisabledItems\` is set, then shown greyed out with an optional explaining tooltip
- **Backdrop**: Optional overlay behind the mobile sheet; \`ignoreChangeView\` brings it to the desktop menu as well
- **Rich Items**: A menu item can also carry a description line, a toggle switch, a badge or an external link
- **Keyboard Navigation**: Arrow Up/Down move the highlight, Arrow Right/Left enter and leave a submenu, Enter activates the item and Escape closes the menu
- **Mobile Layout**: Below 600px the menu opens as a bottom sheet with an optional header, and submenus replace the list in place with a back button

### Accessibility

The ContextMenu component includes the following for improved accessibility:

- \`role="menuitem"\` on every item and \`role="separator"\` on dividers, so assistive technologies announce them as menu items and separators
- Keyboard control while the menu is open: arrow keys move the highlight, Enter activates the highlighted item, Escape closes the menu

### Usage

\`\`\`tsx
import { ContextMenu } from "@onlyoffice/apps-ui-kit/components/context-menu";

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
    getContextModel: {
      control: false,
      description: "Builds the items on every open instead of the static model",
    },
    className: {
      control: "text",
      description: "Additional CSS class for the component",
    },
    withBackdrop: {
      control: "boolean",
      description:
        "Dims the page behind the open menu while it is a bottom sheet (viewports up to 600px), or on any viewport together with ignoreChangeView",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    header: {
      control: false,
      description:
        "Mobile-only header above the items: a title with an optional visual — the title's initials on a color, an icon, an avatar, a logo or a cover image",
    },
    headerOnlyMobile: {
      control: false,
      description:
        "Mobile header only: shows the header for an opened submenu (its label and a back button) even when no header is passed",
    },
    withoutBackHeaderButton: {
      control: false,
      description:
        "Mobile header only: removes the back button of an opened submenu and the icon block of the root header",
    },
    isRoom: {
      control: false,
      description:
        "Mobile header only: a 32px icon block instead of the default size",
    },
    isArchive: {
      control: false,
      description:
        "Mobile header only: draws the header icon in its archived state",
    },
    badgeUrl: {
      control: false,
      description: "Mobile header only: badge icon on the header's icon block",
    },
    badgeIconColor: {
      control: false,
      description: "Mobile header only: color of that badge icon",
    },
    showDisabledItems: {
      control: "boolean",
      description: "Keeps disabled items in the list instead of dropping them",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withHotkeys: {
      control: "boolean",
      description: "Keyboard navigation with the arrows, Enter and Escape",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    fillIcon: {
      control: "boolean",
      description: "Fills item icons with the theme text color",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    maxHeight: {
      control: "number",
      description: "Maximum height of the root list in px; the rest scrolls",
    },
    global: {
      control: "boolean",
      description:
        "Opens on right-click anywhere in the document instead of through the ref",
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
    onShow: {
      action: "onShow",
      description: "Callback when the menu opens",
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

const MenuTemplate = (props: ContextMenuProps) => {
  const cm = useRef<ContextMenuRefType>(null);

  return (
    <div>
      <ContextMenu {...props} ref={cm} />
      <button
        type="button"
        data-testid="trigger"
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
  render: (args) => <MenuTemplate {...args} />,
  args: {
    model: fullMenuItems,
    showDisabledItems: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Full-featured context menu with icons, separators, nested submenus and a disabled item. Disabled items are dropped from the list by default; `showDisabledItems` keeps them greyed out. Right-click the colored area to open.",
      },
      source: {
        code: `const cm = useRef<ContextMenuRefType>(null);

<ContextMenu ref={cm} model={menuItems} showDisabledItems />
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
      <ContextMenu ref={cm} model={items} withBackdrop ignoreChangeView />
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
          "Context menu with a backdrop overlay. `withBackdrop` shows the backdrop only while the menu is a bottom sheet (viewports up to 600px), so on a desktop viewport it also needs `ignoreChangeView`, which this story passes. The mobile stories below are a bottom sheet already and show it with `withBackdrop` alone.",
      },
      source: {
        code: `<ContextMenu ref={cm} model={items} withBackdrop ignoreChangeView />`,
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
        story: `CSS Custom Properties for external customization, passed through the \`style\` prop (the menu renders outside its parent, so a wrapper element's variables do not reach it):

| Variable | Description | Default |
|----------|-------------|---------|
| \`--context-menu-bg\` | Menu background | theme-based |
| \`--context-menu-border-style\` | Menu border | none (light), \`1px solid\` (dark) |
| \`--context-menu-header-border-style\` | Separator border; also the mobile header's bottom border | theme-based |
| \`--context-menu-shadow\` | Menu box-shadow | theme-based |
| \`--context-menu-text\` | Item text and icon color | theme-based |
| \`--context-menu-item-hover-bg\` | Item hover background | theme-based |
| \`--context-menu-item-disabled-text\` | Disabled item text color | theme-based |
| \`--context-menu-item-disabled-bg\` | Disabled item hover background | theme-based |
| \`--context-menu-active-item-bg\` | Keyboard-highlighted item background | theme-based |
| \`--context-menu-radius\` | Menu border radius | \`6px\` |
| \`--context-menu-menu-item-padding\` | Item padding | \`0 16px\` |
| \`--context-menu-divider-margin\` | Separator margin; keep the vertical 6px, the list height is computed for it | \`6px 16px\` |
| \`--context-menu-item-text-size\` | Item font size | \`13px\` |
| \`--context-menu-item-text-weight\` | Item font weight | \`600\` |
| \`--context-menu-header-row-height\` | Mobile header only: height | \`55px\` |
| \`--context-menu-header-inner-padding\` | Mobile header only: padding | \`6px 16px\` |
| \`--context-menu-header-text-size\` | Mobile header only: font size | \`15px\` |`,
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

const accessItems: ContextMenuModel[] = [
  {
    key: "link",
    label: "Anyone with the link",
    icon: CatalogFolderReactSvgUrl,
    description:
      "Everyone who has the link can open the file, no sign-in needed.",
  },
  {
    key: "workspace",
    label: "People in the workspace",
    icon: CatalogFolderReactSvgUrl,
    description: "Only signed-in members of the workspace can open it.",
  },
  {
    key: "invited",
    label: "Invited people only",
    icon: CatalogFolderReactSvgUrl,
    description: "Only the people you invite by e-mail get access.",
  },
];

export const WithItemDescriptions: Story = {
  render: (args) => <MenuTemplate {...args} />,
  args: {
    model: accessItems,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Items carrying `description` are laid out as two lines: the label row and an always-visible description under it. The menu grows to the width of its longest description.",
      },
      source: {
        code: `<ContextMenu
  ref={cm}
  model={[
    {
      key: "link",
      label: "Anyone with the link",
      icon: FolderIcon,
      description:
        "Everyone who has the link can open the file, no sign-in needed.",
    },
    {
      key: "invited",
      label: "Invited people only",
      icon: FolderIcon,
      description: "Only the people you invite by e-mail get access.",
    },
  ]}
/>`,
      },
    },
  },
};

const ItemVariantsTemplate = () => {
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(false);

  const model: ContextMenuModel[] = [
    {
      key: "notifications",
      label: "Notifications",
      withToggle: true,
      checked: notifications,
      onClick: () => setNotifications((value) => !value),
    },
    {
      key: "auto-save",
      label: "Auto-save",
      withToggle: true,
      checked: autoSave,
      onClick: () => setAutoSave((value) => !value),
      disabled: true,
      disabledStylesType: "toggle",
      tooltipTarget: "toggle",
      getTooltipContent: () => "Available on the paid plan",
    },
    { key: "sep-1", isSeparator: true },
    {
      key: "share",
      label: "Share with people",
      iconNode: <CatalogFolderIcon />,
    },
    {
      key: "mcp",
      label: "Ask the MCP server",
      withMCPIcon: true,
    },
    { key: "sep-2", isSeparator: true },
    {
      key: "export",
      label: "Export to PDF",
      icon: CatalogFolderReactSvgUrl,
      badgeLabel: "New",
    },
    {
      key: "history",
      label: "Version history",
      icon: CatalogFolderReactSvgUrl,
      badgeLabel: "Paid",
      isPaidBadge: true,
    },
    {
      key: "help",
      label: "Help Center",
      url: "https://example.com/help",
      target: "_blank",
      isOutsideLink: true,
    },
    { key: "sep-3", isSeparator: true },
    {
      key: "delete",
      label: "Delete",
      icon: CatalogFolderReactSvgUrl,
      disabled: true,
      getTooltipContent: () => "Files shared with you can't be deleted",
    },
  ];

  return <MenuTemplate model={model} showDisabledItems />;
};

export const ItemVariants: Story = {
  render: () => <ItemVariantsTemplate />,
  parameters: {
    docs: {
      description: {
        story: `Every kind of item the model supports, in one menu. From top to bottom:

- **Notifications** — a switch inside the item (\`withToggle\`, \`checked\`). Clicking it flips the switch and keeps the menu open.
- **Auto-save** — the same switch, disabled. The label keeps its color and only the switch is greyed (\`disabledStylesType: "toggle"\`); hover the switch to read why it is off (\`getTooltipContent\` anchored with \`tooltipTarget: "toggle"\`).
- **Share with people** — the icon is a React element (\`iconNode\`) instead of an image URL.
- **Ask the MCP server** — the MCP server icon (\`withMCPIcon\`): the server logo when \`icon\` is given, the first letter of the label otherwise.
- **Export to PDF** — a text badge after the label (\`badgeLabel\`).
- **Version history** — the same badge in the paid-feature color (\`badgeLabel\` + \`isPaidBadge\`).
- **Help Center** — an external link that opens in a new tab (\`url\`, \`target\`); \`isOutsideLink\` adds the arrow.
- **Delete** — a disabled item. It stays in the list only because of \`showDisabledItems\`; hover it to read the reason (\`getTooltipContent\`).`,
      },
      source: {
        code: `<ContextMenu
  ref={cm}
  showDisabledItems
  model={[
    { key: "notifications", label: "Notifications", withToggle: true, checked, onClick: toggle },
    {
      key: "auto-save",
      label: "Auto-save",
      withToggle: true,
      disabled: true,
      disabledStylesType: "toggle",
      tooltipTarget: "toggle",
      getTooltipContent: () => "Available on the paid plan",
    },
    { key: "share", label: "Share with people", iconNode: <CatalogFolderIcon /> },
    { key: "mcp", label: "Ask the MCP server", withMCPIcon: true },
    { key: "export", label: "Export to PDF", icon: FolderIcon, badgeLabel: "New" },
    { key: "history", label: "Version history", icon: FolderIcon, badgeLabel: "Paid", isPaidBadge: true },
    { key: "help", label: "Help Center", url: "https://example.com/help", target: "_blank", isOutsideLink: true },
    { key: "delete", label: "Delete", icon: FolderIcon, disabled: true, getTooltipContent: () => "..." },
  ]}
/>`,
      },
    },
  },
};

const DynamicModelTemplate = () => {
  const [isFavorite, setIsFavorite] = useState(false);

  const getContextModel = (): ContextMenuModel[] => [
    {
      key: "built",
      label: `Model built at ${new Date().toLocaleTimeString()}`,
      icon: CatalogFolderReactSvgUrl,
    },
    { key: "sep", isSeparator: true },
    {
      key: "favorite",
      label: isFavorite ? "Remove from favorites" : "Add to favorites",
      icon: CatalogFolderReactSvgUrl,
      onClick: () => setIsFavorite((value) => !value),
    },
  ];

  return <MenuTemplate model={[]} getContextModel={getContextModel} />;
};

export const DynamicModel: Story = {
  render: () => <DynamicModelTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          "`getContextModel` replaces a static `model`: the getter runs each time the menu opens, so the first item shows the time of that open and the favorite item reads the state changed by its own click. Leading and trailing separators in the result are trimmed.",
      },
      source: {
        code: `<ContextMenu
  ref={cm}
  model={[]}
  getContextModel={() => [
    { key: "built", label: \`Model built at \${new Date().toLocaleTimeString()}\` },
    { key: "sep", isSeparator: true },
    {
      key: "favorite",
      label: isFavorite ? "Remove from favorites" : "Add to favorites",
      onClick: toggleFavorite,
    },
  ]}
/>`,
      },
    },
  },
};

const globalItems: ContextMenuModel[] = [
  { key: 0, label: "Cut", icon: CatalogFolderReactSvgUrl },
  { key: 1, label: "Copy", icon: CatalogFolderReactSvgUrl },
  { key: 2, label: "Paste", icon: CatalogFolderReactSvgUrl },
  { key: 3, isSeparator: true, disabled: false },
  { key: 4, label: "Delete", icon: CatalogFolderReactSvgUrl },
];

const GlobalTemplate = (props: ContextMenuProps) => (
  <div
    style={{
      height: "300px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "24px",
      border: `2px dashed ${globalColors.lightSecondMain}`,
      borderRadius: "6px",
      fontSize: "18px",
    }}
  >
    <ContextMenu {...props} />
    <div
      data-testid="trigger"
      style={{
        width: "200px",
        height: "200px",
        backgroundColor: globalColors.lightSecondMain,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: globalColors.white,
        cursor: "context-menu",
      }}
    >
      Right click on me…
    </div>
    <span>…or anywhere around: the whole page listens</span>
  </div>
);

export const AttachedToDocument: Story = {
  render: (args) => <GlobalTemplate {...args} />,
  args: {
    model: globalItems,
    global: true,
  },
  parameters: {
    docs: {
      // Its document listener would hijack the other stories on the Docs page.
      story: { inline: false, iframeHeight: 340 },
      description: {
        story:
          "The blue square has no handler of its own and nothing calls `show`: with `global` the menu attaches itself to the whole document, so a right-click on the square and one on the empty space around it open the same menu. Use it for a page-level menu that is not tied to one element.",
      },
      source: {
        code: `<ContextMenu model={items} global />`,
      },
    },
  },
};

const moveTargets: ContextMenuModel[] = Array.from(
  { length: 12 },
  (_, index) => ({
    key: `folder-${index + 1}`,
    label: `Folder ${index + 1}`,
  }),
);

const manyItems: ContextMenuModel[] = [
  {
    key: "move",
    label: "Move to",
    icon: CatalogFolderReactSvgUrl,
    items: moveTargets,
  },
  ...Array.from({ length: 15 }, (_, index) => ({
    key: `option-${index + 1}`,
    label: `Option ${index + 1}`,
    icon: CatalogFolderReactSvgUrl,
  })),
];

export const MaxHeight: Story = {
  render: (args) => <MenuTemplate {...args} />,
  args: {
    model: manyItems,
    maxHeight: 240,
    maxHeightLowerSubmenu: 160,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The model has sixteen items, but the menu is only 240px tall — about six and a half rows — and the rest scrolls inside it (`maxHeight`). Hover **Move to**: its submenu has twelve folders and is limited the same way, to 160px (`maxHeightLowerSubmenu`).",
      },
      source: {
        code: `<ContextMenu
  ref={cm}
  model={[{ key: "move", label: "Move to", items: twelveFolders }, ...fifteenOptions]}
  maxHeight={240}
  maxHeightLowerSubmenu={160}
/>`,
      },
    },
  },
};

const mobileTriggerStyle: CSSProperties = {
  width: "100%",
  height: "56px",
  backgroundColor: globalColors.lightSecondMain,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: globalColors.white,
  fontSize: "16px",
  border: "none",
  cursor: "pointer",
};

const MobileMenuTemplate = (props: ContextMenuProps) => {
  const cm = useRef<ContextMenuRefType>(null);

  return (
    <div>
      <ContextMenu {...props} ref={cm} />
      <button
        type="button"
        data-testid="trigger"
        style={mobileTriggerStyle}
        onClick={(e) => {
          cm.current?.show(e);
        }}
      >
        Tap to open the menu
      </button>
    </div>
  );
};

const mobileViewport = { viewport: { value: "mobile1", isRotated: false } };

// Docs ignores the viewport preset; give the story its own 320px frame there.
const withPhoneFrame: Decorator = (Story, context) => {
  if (context.viewMode !== "docs") return <Story />;

  return (
    <iframe
      title={context.name}
      src={`iframe.html?viewMode=story&id=${context.id}`}
      style={{ width: 320, height: 568, border: 0 }}
    />
  );
};

const roomHeader: HeaderType = {
  title: "Contracts 2026",
  icon: CatalogFolderReactSvgUrl,
  color: "5C6EFF",
  original: "",
  large: "",
  medium: "",
  small: "",
};

const roomItems: ContextMenuModel[] = [
  { key: "edit", label: "Edit room", icon: CatalogFolderReactSvgUrl },
  { key: "invite", label: "Invite users", icon: CatalogFolderReactSvgUrl },
  {
    key: "copy-link",
    label: "Copy shared link",
    icon: CatalogFolderReactSvgUrl,
  },
  {
    key: "move",
    label: "Move or copy",
    icon: CatalogFolderReactSvgUrl,
    items: [
      { key: "move-to", label: "Move to" },
      { key: "copy", label: "Copy" },
      { key: "duplicate", label: "Duplicate" },
    ],
  },
  { key: "download", label: "Download", icon: CatalogFolderReactSvgUrl },
  { key: "sep", isSeparator: true },
  { key: "archive", label: "Move to archive", icon: CatalogFolderReactSvgUrl },
];

export const MobileWithHeader: Story = {
  globals: mobileViewport,
  decorators: [withPhoneFrame],
  render: (args) => <MobileMenuTemplate {...args} />,
  args: {
    model: roomItems,
    header: roomHeader,
    isRoom: true,
    withBackdrop: true,
    ignoreChangeView: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shown at 320px, where the menu is a bottom sheet with the `header` on top: the title and, in the 32px block that `isRoom` gives it, the title's initials on the header `color` (the block renders only when `icon` is set; `color` then replaces the icon). Tap **Move or copy**: the submenu replaces the list in place and the header turns into a back button. `ignoreChangeView` forces the sheet layout regardless of the menu height.",
      },
      source: {
        code: `<ContextMenu
  ref={cm}
  model={roomItems}
  header={{ title: "Contracts 2026", icon: FolderIcon, color: "5C6EFF", original: "", large: "", medium: "", small: "" }}
  isRoom
  withBackdrop
  ignoreChangeView
/>`,
      },
    },
  },
};

const userHeader: HeaderType = {
  title: "Team member",
  avatar: DefaultUserPhotoUrl,
  original: "",
  large: "",
  medium: "",
  small: "",
};

const userItems: ContextMenuModel[] = [
  { key: "profile", label: "Open profile", icon: CatalogFolderReactSvgUrl },
  { key: "message", label: "Send message", icon: CatalogFolderReactSvgUrl },
  { key: "sep", isSeparator: true },
  { key: "remove", label: "Remove from room", icon: CatalogFolderReactSvgUrl },
];

export const MobileWithAvatarHeader: Story = {
  globals: mobileViewport,
  decorators: [withPhoneFrame],
  render: (args) => <MobileMenuTemplate {...args} />,
  args: {
    model: userItems,
    header: userHeader,
    withBackdrop: true,
    ignoreChangeView: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The same bottom sheet with a person as the subject: `header.avatar` renders an avatar instead of the initials block.",
      },
      source: {
        code: `<ContextMenu
  ref={cm}
  model={userItems}
  header={{ title: user.displayName, avatar: user.avatarSmall, original: "", large: "", medium: "", small: "" }}
  withBackdrop
  ignoreChangeView
/>`,
      },
    },
  },
};
