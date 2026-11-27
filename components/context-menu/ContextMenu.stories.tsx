import type { CSSProperties } from "react";
import { useRef, useState } from "react";

import type { ComponentProps } from "react";

import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, fireEvent, fn, screen, waitFor, within } from "storybook/test";

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
import { LATIN_NUMBERING_SYSTEM } from "../../utils/latin-digits";

const meta = {
  title: "UI/Overlays/ContextMenu",
  component: ContextMenu,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=52-2358&mode=design&t=TBNCKMQKQMxr44IZ-0",
    },
  },
  argTypes: {
    model: {
      // The icons are data URIs too long to edit, and they stretch the table.
      control: false,
      description:
        "The items. The desktop list reads them on every render; `getContextModel`, when given, replaces them.",
    },
    getContextModel: {
      control: false,
      description:
        "Builds the items each time the menu opens, replacing `model`. This is the one to use for a menu whose entries depend on the current selection.",
    },
    className: {
      control: "text",
      description: "Applied to the menu element.",
    },
    withBackdrop: {
      control: "boolean",
      description:
        "Whether a backdrop is rendered behind the menu. It is only visible when the menu is in its mobile sheet form, so on a desktop it shows nothing.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    header: {
      control: false,
      description:
        "Title, icon and badge of the bar above the items, on the mobile sheet.",
    },
    headerOnlyMobile: {
      control: "boolean",
      description: "Renders the header only in the mobile sheet form.",
    },
    withoutBackHeaderButton: {
      control: "boolean",
      description:
        "Removes the back arrow from a submenu's header on the mobile sheet.",
    },
    isRoom: {
      control: "boolean",
      description:
        "Renders the header in its room form, with a logo and a cover.",
    },
    isArchive: {
      control: "boolean",
      description: "Renders that header in its archived form.",
    },
    badgeUrl: {
      control: false,
      description: "URL of the badge image in the header.",
    },
    badgeIconColor: {
      control: false,
      description:
        "Colour of the header badge's icon, as a CSS colour. A header with a logo or a cover ignores it.",
    },
    ignoreChangeView: {
      control: "boolean",
      description:
        "Forces that mobile sheet form, and with it the backdrop, at any width.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    showDisabledItems: {
      control: "boolean",
      description: "Keeps disabled items in the menu instead of dropping them.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    withHotkeys: {
      control: "boolean",
      description:
        "Whether the arrow keys, Enter and Escape work while the menu is open. This is the one menu in the kit that can be used from the keyboard.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    fillIcon: {
      control: "boolean",
      description: "Recolours the items' icons to the text colour.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    maxHeight: {
      control: "number",
      description:
        "Height cap of the item list, in pixels; past it the list scrolls.",
    },
    maxHeightLowerSubmenu: {
      control: "number",
      description: "Height cap of a second-level submenu, in pixels.",
    },
    containerRef: {
      control: false,
      description:
        "Element to position the menu against instead of the pointer. The menu opens 4px under it, at its left edge, at least 210px wide.",
    },
    scaled: {
      control: "boolean",
      description: "Matches the menu's width to that container's.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    leftOffset: {
      control: "number",
      description:
        "Shifts the menu left by this many pixels, when positioned against a container.",
    },
    rightOffset: {
      control: "number",
      description: "Shifts it further left again; both offsets are subtracted.",
    },
    appendTo: {
      control: false,
      description:
        "Element the menu is rendered into, instead of `document.body`.",
    },
    autoZIndex: {
      control: "boolean",
      description:
        "Sets the menu's stacking order on each open: `baseZIndex` plus a counter the kit shares, from 1001.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    baseZIndex: {
      control: "number",
      description:
        "Stacking order of the backdrop, and the base of the menu's under `autoZIndex`.",
      table: {
        defaultValue: { summary: "0" },
      },
    },
    style: {
      control: "object",
      description: "Applied to the menu element.",
    },
    dataTestId: {
      control: "text",
      description: "Value of `data-testid` on the menu.",
      table: {
        defaultValue: { summary: "context-menu" },
      },
    },
    ref: {
      control: false,
      description:
        "Handle the menu is opened through: `show(event)`, `hide(event)` and `toggle(event)`. There is no visibility prop — this is the only way.",
    },
    global: {
      control: "boolean",
      description:
        "Opens the menu on a right-click anywhere in the document, with no `show` call of yours.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    id: {
      control: "text",
      description: "Applied to the menu element.",
    },
    onHide: {
      action: "onHide",
      description:
        "Called when the menu closes, with the event that closed it.",
    },
    onShow: {
      action: "onShow",
      description:
        "Called when a closed menu opens, with the event passed to `show`.",
    },
  },
} satisfies Meta<typeof ContextMenu>;

type Story = StoryObj<ComponentProps<typeof ContextMenu>>;

export default meta;

// The menu is portalled, fades in, and unmounts when it closes.
const menuItem = async (name: string | RegExp) => {
  const item = await screen.findByRole("menuitem", { name });
  await waitFor(() => expect(item).toBeVisible());
  return item;
};

const menuPanel = () =>
  document.querySelector<HTMLElement>(".p-contextmenu") as HTMLElement;

const menuClosed = () =>
  waitFor(() => expect(document.querySelector(".p-contextmenu")).toBeNull());

const rightClick = (target: HTMLElement) => {
  const box = target.getBoundingClientRect();
  fireEvent.contextMenu(target, {
    clientX: box.left + box.width / 2,
    clientY: box.top + box.height / 2,
  });
};

const onSimpleItemClick = fn();

const fullMenuItems: ContextMenuModel[] = [
  { key: 0, label: "Edit", icon: CatalogFolderReactSvgUrl },
  { key: 1, label: "Preview", icon: CatalogFolderReactSvgUrl },
  { key: 2, isSeparator: true, disabled: false },
  { key: 3, label: "Sharing settings", icon: CatalogFolderReactSvgUrl },
  { key: 4, label: "Copy internal link", icon: CatalogFolderReactSvgUrl },
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
  { key: 12, label: "Add to favorites", icon: CatalogFolderReactSvgUrl },
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
    onShow: fn(),
    onHide: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    rightClick(canvas.getByTestId("trigger"));
    await menuItem("Edit");
    await expect(args.onShow).toHaveBeenCalled();
    await expect(screen.getAllByRole("separator").length).toBeGreaterThan(0);
    // The disabled item stays, greyed out.
    const rename = await menuItem("Rename");
    await expect(rename.className).toMatch(/p-disabled/);

    // A submenu opens on hover.
    await userEvent.hover(await menuItem("Move or copy"));
    await expect(await menuItem("Duplicate")).toBeVisible();

    await userEvent.keyboard("{Escape}");
    await menuClosed();
    await expect(args.onHide).toHaveBeenCalled();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Full-featured context menu with icons, separators, nested submenus and a disabled item. Disabled items are dropped by default; `showDisabledItems` keeps them greyed out. The coloured area opens it on a right-click.",
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
    {
      key: 0,
      label: "Cut",
      icon: CatalogFolderReactSvgUrl,
      onClick: onSimpleItemClick,
    },
    {
      key: 1,
      label: "Copy",
      icon: CatalogFolderReactSvgUrl,
      onClick: onSimpleItemClick,
    },
    {
      key: 2,
      label: "Paste",
      icon: CatalogFolderReactSvgUrl,
      onClick: onSimpleItemClick,
    },
    { key: 3, isSeparator: true, disabled: false },
    {
      key: 4,
      label: "Delete",
      icon: CatalogFolderReactSvgUrl,
      onClick: onSimpleItemClick,
    },
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
  name: "Simple menu",
  render: () => <SimpleMenuTemplate />,
  beforeEach: () => {
    onSimpleItemClick.mockClear();
  },
  play: async ({ canvas, userEvent }) => {
    rightClick(canvas.getByRole("button", { name: "Right click on me" }));
    await expect(screen.getAllByRole("menuitem")).toHaveLength(4);
    // Picking an item calls its onClick with the item and closes the menu.
    await userEvent.click(await menuItem("Copy"));
    await expect(onSimpleItemClick).toHaveBeenCalledTimes(1);
    await expect(onSimpleItemClick.mock.calls[0][0].item.key).toBe(1);
    await menuClosed();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A flat list of actions with one separator and no submenus, with only `ref` and `model` set. Most row and card menus need this shape.",
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
  name: "With a backdrop",
  render: () => <WithBackdropTemplate />,
  play: async ({ canvas, userEvent }) => {
    rightClick(canvas.getByRole("button", { name: "Right click on me" }));
    await menuItem("Option 1");
    const backdrop = screen
      .getAllByTestId("backdrop")
      .find((element) => element.checkVisibility()) as HTMLElement;
    await expect(backdrop).toBeDefined();
    await userEvent.click(backdrop);
    await menuClosed();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A context menu with a backdrop. `withBackdrop` shows it only while the menu is a bottom sheet, up to 600px, so a desktop also needs `ignoreChangeView`. This story and the mobile ones below pass both.",
      },
      source: {
        code: `<ContextMenu ref={cm} model={items} withBackdrop ignoreChangeView />`,
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
  name: "Items with descriptions",
  render: (args) => <MenuTemplate {...args} />,
  args: {
    model: accessItems,
  },
  play: async ({ canvas }) => {
    rightClick(canvas.getByTestId("trigger"));
    const item = await menuItem(/^Invited people only/);
    // The description sits under the label, always visible.
    const label = within(item).getByText("Invited people only");
    const description = within(item).getByText(
      "Only the people you invite by e-mail get access.",
    );
    await expect(description).toBeVisible();
    await expect(
      description.getBoundingClientRect().top,
    ).toBeGreaterThanOrEqual(label.getBoundingClientRect().bottom - 1);
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
  name: "Item kinds",
  render: () => <ItemVariantsTemplate />,
  play: async ({ canvas, userEvent }) => {
    rightClick(canvas.getByTestId("trigger"));
    const notifications = (await menuItem("Notifications")).closest(
      "li",
    ) as HTMLElement;
    const toggle = within(notifications).getByRole("checkbox");
    await expect(toggle).toBeChecked();
    // A switch flips and keeps the menu open.
    await userEvent.click(within(notifications).getByText("Notifications"));
    await waitFor(() =>
      expect(
        within(
          screen.getByText("Notifications").closest("li") as HTMLElement,
        ).getByRole("checkbox"),
      ).not.toBeChecked(),
    );
    await expect(menuPanel()).toBeVisible();

    const autoSave = screen.getByText("Auto-save").closest("li") as HTMLElement;
    await expect(within(autoSave).getByRole("checkbox")).toBeDisabled();
    await expect(screen.getByText("New")).toBeVisible();
    await expect(screen.getByText("Paid")).toBeVisible();
    const help = await menuItem("Help Center");
    await expect(help).toHaveAttribute("href", "https://example.com/help");
    await expect(help).toHaveAttribute("target", "_blank");
    await expect((await menuItem("Delete")).className).toMatch(/p-disabled/);
  },
  parameters: {
    docs: {
      description: {
        story: `Every item kind:

- **Notifications** — a switch (\`withToggle\`, \`checked\`).
- **Auto-save** — that switch, disabled (\`disabledStylesType\`).
- **Share with people** — a JSX icon (\`iconNode\`).
- **Ask the MCP server** — \`withMCPIcon\`.
- **Export to PDF** — a text badge (\`badgeLabel\`).
- **Version history** — a paid badge (\`isPaidBadge\`).
- **Help Center** — an outside link (\`url\`, \`isOutsideLink\`).
- **Delete** — disabled (\`showDisabledItems\`).`,
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
      label: `Model built at ${new Date().toLocaleTimeString("en-US", { numberingSystem: LATIN_NUMBERING_SYSTEM })}`,
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
  name: "Items built on open",
  render: () => <DynamicModelTemplate />,
  play: async ({ canvas, userEvent }) => {
    // The model is built on every open.
    rightClick(canvas.getByTestId("trigger"));
    await expect(await menuItem(/^Model built at /)).toBeVisible();
    await userEvent.click(await menuItem("Add to favorites"));
    await menuClosed();
    rightClick(canvas.getByTestId("trigger"));
    await expect(await menuItem("Remove from favorites")).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "`getContextModel` replaces a static `model` and runs on each open. The first item shows the time of that open, and the favourite item reads the state its own click changed. Leading and trailing separators are trimmed.",
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
  name: "Whole-page menu",
  render: (args) => <GlobalTemplate {...args} />,
  args: {
    model: globalItems,
    global: true,
  },
  play: async ({ canvas }) => {
    // The whole document listens, not only the square.
    rightClick(canvas.getByText("…or anywhere around: the whole page listens"));
    await expect(await menuItem("Paste")).toBeVisible();
  },
  parameters: {
    docs: {
      // Its document listener would hijack the other stories on the Docs page.
      story: { inline: false, iframeHeight: 340 },
      description: {
        story:
          "The blue square has no handler, and nothing calls `show`. With `global` the menu listens to the whole document, so a right-click anywhere opens it. It suits a page-level menu.",
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
  name: "Capped height",
  render: (args) => <MenuTemplate {...args} />,
  args: {
    model: manyItems,
    maxHeight: 240,
    maxHeightLowerSubmenu: 160,
  },
  play: async ({ canvas, userEvent }) => {
    rightClick(canvas.getByTestId("trigger"));
    await menuItem("Option 1");
    // Sixteen items in a 240px list.
    const scroller = within(menuPanel()).getAllByTestId("scroller")[0];
    await expect(scroller.clientHeight).toBeLessThanOrEqual(240);
    await expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight);

    await userEvent.hover(await menuItem("Move to"));
    // The submenu's own list scrolls within 160px.
    let subList = (await menuItem("Folder 1")).parentElement;
    while (subList && subList.scrollHeight <= subList.clientHeight) {
      subList = subList.parentElement;
    }
    await expect(subList).not.toBeNull();
    await expect((subList as HTMLElement).clientHeight).toBeLessThanOrEqual(
      160,
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Sixteen items in a menu 240px tall, about six and a half rows; the rest scroll (`maxHeight`). The **Move to** submenu holds twelve folders, capped the same way at 160px (`maxHeightLowerSubmenu`).",
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
  name: "Phone sheet with a header",
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
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByTestId("trigger"));
    await menuItem("Edit room");
    // The sheet carries the header above the list.
    const header = menuPanel().querySelector(
      ".contextmenu-header",
    ) as HTMLElement;
    await expect(within(header).getByText("Contracts 2026")).toBeVisible();
    await expect(
      screen.getAllByTestId("backdrop").some((b) => b.checkVisibility()),
    ).toBe(true);
  },
  parameters: {
    docs: {
      description: {
        story:
          "At 320px the menu is a bottom sheet with the `header` on top (`ignoreChangeView`). With `isRoom` the title gets a 32px block of its initials on the header `color`; it needs `icon`. **Move or copy** opens its submenu in place, and the header becomes a back button.",
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
  name: "Phone sheet with an avatar",
  globals: mobileViewport,
  decorators: [withPhoneFrame],
  render: (args) => <MobileMenuTemplate {...args} />,
  args: {
    model: userItems,
    header: userHeader,
    withBackdrop: true,
    ignoreChangeView: true,
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByTestId("trigger"));
    await menuItem("Open profile");
    const header = menuPanel().querySelector(
      ".contextmenu-header",
    ) as HTMLElement;
    await expect(within(header).getByText("Team member")).toBeVisible();
    await expect(within(header).getByTestId("avatar")).toBeVisible();
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

const AnchoredToElementTemplate = (props: ContextMenuProps) => {
  const cm = useRef<ContextMenuRefType>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{ height: "280px" }}>
      <div ref={anchorRef} style={{ width: "240px" }}>
        <button
          type="button"
          data-testid="trigger"
          style={{
            width: "100%",
            height: "40px",
            backgroundColor: globalColors.lightSecondMain,
            color: globalColors.white,
            fontSize: "15px",
            border: "none",
            cursor: "pointer",
          }}
          onClick={(e) => cm.current?.show(e)}
        >
          Actions
        </button>
      </div>
      <ContextMenu {...props} ref={cm} containerRef={anchorRef} />
    </div>
  );
};

export const AnchoredToElement: Story = {
  name: "Anchored to a button",
  render: (args) => <AnchoredToElementTemplate {...args} />,
  args: {
    model: [
      { key: 0, label: "Rename", icon: CatalogFolderReactSvgUrl },
      { key: 1, label: "Duplicate", icon: CatalogFolderReactSvgUrl },
      { key: 2, label: "Download", icon: CatalogFolderReactSvgUrl },
      { key: 3, isSeparator: true },
      { key: 4, label: "Delete", icon: CatalogFolderReactSvgUrl },
    ],
  },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByTestId("trigger");
    await userEvent.click(button);
    await menuItem("Rename");
    // Under the button, at its left edge, wherever the pointer was.
    const menu = menuPanel().getBoundingClientRect();
    const anchor = button.getBoundingClientRect();
    await expect(menu.top).toBeGreaterThanOrEqual(anchor.bottom - 1);
    await expect(Math.abs(menu.left - anchor.left)).toBeLessThanOrEqual(2);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The menu under **Actions**, at the button's left edge wherever the pointer was (`containerRef`). It suits a toolbar or row action button rather than a right-click. `leftOffset` and `rightOffset` move it left from that edge.",
      },
      source: {
        code: `const anchorRef = useRef<HTMLDivElement>(null);

<div ref={anchorRef}>
  <button onClick={(e) => cm.current?.show(e)}>Actions</button>
</div>
<ContextMenu ref={cm} model={items} containerRef={anchorRef} />`,
      },
    },
  },
};

const RightToLeftTemplate = (props: ContextMenuProps) => {
  const cm = useRef<ContextMenuRefType>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div dir="rtl" ref={setContainer} style={{ height: "300px" }}>
      {container ? (
        <ContextMenu {...props} ref={cm} appendTo={container} />
      ) : null}
      <button
        type="button"
        data-testid="trigger"
        style={{
          width: "200px",
          height: "200px",
          marginInlineStart: "260px",
          backgroundColor: globalColors.lightSecondMain,
          color: globalColors.white,
          fontSize: "18px",
          border: "none",
          cursor: "context-menu",
        }}
        onContextMenu={(e) => cm.current?.show(e)}
      >
        انقر بزر الفأرة الأيمن
      </button>
    </div>
  );
};

export const RightToLeft: Story = {
  name: "Right to left",
  render: (args) => <RightToLeftTemplate {...args} />,
  globals: { direction: "rtl" },
  play: async ({ canvas }) => {
    const trigger = canvas.getByTestId("trigger");
    rightClick(trigger);
    const item = await menuItem("نسخ");
    // Opened to the left of the pointer.
    const box = trigger.getBoundingClientRect();
    const pointerX = box.left + box.width / 2;
    await expect(menuPanel().getBoundingClientRect().right).toBeLessThanOrEqual(
      pointerX + 1,
    );
    // The icon sits on the right of the label.
    const icon = (
      item.querySelector("svg, img") as Element
    ).getBoundingClientRect();
    const label = within(item).getByText("نسخ").getBoundingClientRect();
    await expect(icon.left).toBeGreaterThanOrEqual(label.right - 1);
  },
  args: {
    model: [
      { key: 0, label: "تحرير", icon: CatalogFolderReactSvgUrl },
      { key: 1, label: "نسخ", icon: CatalogFolderReactSvgUrl },
      {
        key: 2,
        label: "نقل إلى",
        icon: CatalogFolderReactSvgUrl,
        items: [
          { key: 3, label: "المستندات" },
          { key: 4, label: "الأرشيف" },
        ],
      },
      { key: 5, isSeparator: true },
      { key: 6, label: "حذف", icon: CatalogFolderReactSvgUrl },
    ],
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed, because an inline RTL story flips the whole Docs page.
      story: { inline: false, height: "326px" },
      description: {
        story:
          "The menu in a right-to-left interface opens left of the pointer, with icons right of the labels. The third item's submenu opens to the left. It renders into the right-to-left container (`appendTo`), since the page body is outside any `dir` wrapper.",
      },
      source: {
        code: `<div dir="rtl" ref={setContainer}>
  <ContextMenu ref={cm} model={items} appendTo={container} />
  <div onContextMenu={(e) => cm.current?.show(e)}>انقر بزر الفأرة الأيمن</div>
</div>`,
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
    {
      key: 3,
      label: "Rename",
      icon: CatalogFolderReactSvgUrl,
      disabled: true,
    },
    { key: 4, isSeparator: true, disabled: false },
    {
      key: 5,
      label: "Delete",
      icon: CatalogFolderReactSvgUrl,
      description: "Moves the selection to the trash",
    },
  ];

  return (
    <div style={{ height: "320px" }}>
      <ContextMenu
        ref={cm}
        model={items}
        showDisabledItems
        style={
          {
            "--context-menu-radius": "12px",
            "--context-menu-bg": "#1e1b4b",
            "--context-menu-border-style": "1px solid #4338ca",
            "--context-menu-shadow": "0 12px 24px rgba(30, 27, 75, 0.45)",
            "--context-menu-text": "#e0e7ff",
            "--context-menu-item-hover-bg": "rgba(255,255,255,0.1)",
            "--context-menu-item-disabled-text": "#6366f1",
            "--context-menu-item-disabled-bg": "#312e81",
            "--context-menu-active-item-bg": "rgba(255,255,255,0.2)",
            "--context-menu-header-border-style": "1px solid #4338ca",
            "--context-menu-menu-item-padding": "0 20px",
            "--context-menu-divider-margin": "6px 20px",
            "--context-menu-item-text-size": "14px",
            "--context-menu-item-text-weight": "400",
            "--context-menu-item-with-description-padding": "8px 20px",
            "--context-menu-item-description-width": "220px",
            "--context-menu-item-description": "#a5b4fc",
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
  name: "CSS variables",
  render: () => <CssCustomizationTemplate />,
  play: async ({ canvas }) => {
    rightClick(canvas.getByTestId("trigger"));
    await menuItem("Cut");
    const panel = getComputedStyle(menuPanel());
    await expect(panel.backgroundColor).toBe("rgb(30, 27, 75)");
    await expect(panel.borderTopLeftRadius).toBe("12px");
    await expect(panel.borderTopColor).toBe("rgb(67, 56, 202)");
    await expect(
      getComputedStyle(screen.getByText("Moves the selection to the trash"))
        .color,
    ).toBe("rgb(165, 180, 252)");
  },
  parameters: {
    docs: {
      description: {
        story: `Every variable a desktop menu can show, passed through the menu's own \`style\`, since the menu is portalled out of any wrapper. **Rename** is disabled; the hover and keyboard-highlight colours show on interaction. The mobile header rows apply only to the bottom sheet.`,
      },
      source: {
        code: `<ContextMenu
  ref={cm}
  model={items}
  showDisabledItems
  style={{
    "--context-menu-radius": "12px",
    "--context-menu-bg": "#1e1b4b",
    "--context-menu-border-style": "1px solid #4338ca",
    "--context-menu-shadow": "0 12px 24px rgba(30, 27, 75, 0.45)",
    "--context-menu-text": "#e0e7ff",
    "--context-menu-item-hover-bg": "rgba(255,255,255,0.1)",
    "--context-menu-item-disabled-text": "#6366f1",
    "--context-menu-item-disabled-bg": "#312e81",
    "--context-menu-active-item-bg": "rgba(255,255,255,0.2)",
    "--context-menu-header-border-style": "1px solid #4338ca",
    "--context-menu-menu-item-padding": "0 20px",
    "--context-menu-divider-margin": "6px 20px",
    "--context-menu-item-text-size": "14px",
    "--context-menu-item-text-weight": "400",
    "--context-menu-item-with-description-padding": "8px 20px",
    "--context-menu-item-description-width": "220px",
    "--context-menu-item-description": "#a5b4fc",
  }}
/>`,
      },
    },
  },
};
