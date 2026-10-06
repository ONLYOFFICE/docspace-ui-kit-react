import React from "react";
import type { ComponentProps } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor, within } from "storybook/test";

import { DeviceType } from "../../enums";
import Navigation from "./Navigation";

import "./Navigation.stories.scss";

const meta = {
  title: "UI/Navigation/Navigation",
  component: Navigation,
  parameters: {
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
  },
  argTypes: {
    title: {
      control: "text",
      description: "Current folder title",
    },
    showText: {
      control: "boolean",
      description: "Not read by the component; changing it changes nothing",
    },
    isRootFolder: {
      control: "boolean",
      description: "Whether the current folder is the root",
    },
    canCreate: {
      control: "boolean",
      description:
        "Whether the person may create anything here. The plus button needs this and `isPlusButtonVisible` both",
    },
    isPlusButtonVisible: {
      control: "boolean",
      description:
        "Shows the plus button, together with `canCreate`. Without it no plus button is rendered",
      table: { defaultValue: { summary: "undefined" } },
    },
    isContextButtonVisible: {
      control: "boolean",
      description:
        "Shows the folder's context button. Without it the folder menu is never rendered, whatever `getContextOptionsFolder` returns",
      table: { defaultValue: { summary: "undefined" } },
    },
    withMenu: {
      control: "boolean",
      description:
        "Whether the plus and folder buttons open their menus themselves. With `false` they only call `onPlusClick` or `onContextOptionsClick`",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isTrashFolder: {
      control: "boolean",
      description:
        "Opens the folder menu shifted to the side of its button; nothing else in the header changes",
      table: { defaultValue: { summary: "undefined" } },
    },
    isRoom: {
      control: "boolean",
      description: "Not read by the component; changing it changes nothing",
    },
    isDesktop: {
      control: "boolean",
      description:
        "Whether the host is the desktop application; it only limits the height of the open drop box. The layout follows `currentDeviceType`",
    },
    currentDeviceType: {
      control: "select",
      options: [DeviceType.desktop, DeviceType.tablet, DeviceType.mobile],
      description:
        "Which layout to render. Below desktop the info panel toggle and the AI chat button move into the button row and the plus button is dropped; on a phone the parent title is hidden too",
    },
    isInfoPanelVisible: {
      control: "boolean",
      description: "Whether the info panel is currently visible",
    },
    hideInfoPanel: {
      control: false,
      description:
        "Hides the info panel toggle whenever it is set, because it is read as a flag and never called",
      table: { defaultValue: { summary: "undefined" } },
    },
    navigationButtonLabel: {
      control: "text",
      description:
        "Label of an extra button at the end of the row. Without it the button is not rendered; it is also hidden in the root folder",
      table: { defaultValue: { summary: "undefined" } },
    },
    showNavigationButton: {
      control: "boolean",
      description:
        "Widens the header's last column to at least 186px for the extra button; the button itself appears with `navigationButtonLabel`",
    },
    showRootFolderTitle: {
      control: "boolean",
      description:
        "Shows the second, clickable title before the folder's name. It is ignored in the root folder, on a phone, and with one folder in the trail and no `rootRoomTitle`",
    },
    rootRoomTitle: {
      control: "text",
      description:
        "Text of the second title. Without it the parent folder's name from the trail is used",
    },
    badgeLabel: {
      control: "text",
      description:
        "Text of a small badge next to the title; it follows the second title when one is shown",
      table: { defaultValue: { summary: "undefined" } },
    },
    titleTooltip: {
      control: "text",
      description:
        "Native tooltip of the folder's name, in place of the name itself. It is dropped while the second title is shown",
      table: { defaultValue: { summary: "undefined" } },
    },
    showTitle: {
      control: "boolean",
      description:
        "Shows the folder's name and the second title; without it only the arrow and the buttons remain",
      table: { defaultValue: { summary: "undefined" } },
    },
    showBackButton: {
      control: "boolean",
      description:
        "Shows the back arrow even in the root folder, where it is otherwise hidden",
      table: { defaultValue: { summary: "undefined" } },
    },
    isFrame: {
      control: "boolean",
      description:
        "Whether the header is rendered inside an embedding frame. It hides the folder button, the extra button and the tariff notice",
      table: { defaultValue: { summary: "undefined" } },
    },
    isPublicRoom: {
      control: "boolean",
      description:
        "Replaces the folder button with one that appears only when at least one of its options is enabled",
      table: { defaultValue: { summary: "undefined" } },
    },
    withLogo: {
      control: false,
      description:
        "Shows a logo at the start of the header. A string is used as the logo image's URL; `true` shows only `burgerLogo`",
    },
    burgerLogo: {
      control: false,
      description: "URL of the logo image shown while `withLogo` is set",
    },
    titleIcon: {
      control: false,
      description:
        "URL of a small SVG icon before the title; it is hidden in the root folder",
    },
    titleIconTooltip: {
      control: "text",
      description: "Tooltip text of the title icon",
      table: { defaultValue: { summary: "undefined" } },
    },
    titles: {
      control: "object",
      description:
        "Native tooltips of the info panel, AI chat, plus and folder buttons, the label of the AI chat button, and the text and icon of the notice chip",
      table: { defaultValue: { summary: "undefined" } },
    },
    navigationItems: {
      control: "object",
      description:
        "The folder trail, outermost folder first; the last entry is the current folder. An empty list makes the title unclickable",
    },
    toggleChatPanel: {
      control: false,
      description:
        "Called when the AI chat button is clicked. Without it the button is not rendered",
      table: { defaultValue: { summary: "undefined" } },
    },
    isChatPanelVisible: {
      control: "boolean",
      description:
        "Whether the AI chat panel is open; the AI chat button shows its pressed look while it is",
      table: { defaultValue: { summary: "undefined" } },
    },
    hideChatButton: {
      control: "boolean",
      description:
        "Hides the AI chat button even when `toggleChatPanel` is set",
      table: { defaultValue: { summary: "undefined" } },
    },
    getContextOptionsFolder: {
      control: false,
      description:
        "Returns the items of the folder menu. It is called on every render, so it has to be cheap",
    },
    getContextOptionsPlus: {
      control: false,
      description: "Returns the items of the plus button's menu",
    },
    onClickFolder: {
      control: false,
      description:
        "Called with a folder's id when it is chosen in the drop box or when the second title is clicked",
    },
    onBackToParentFolder: {
      control: false,
      description: "Called when the back arrow is clicked",
    },
    toggleInfoPanel: {
      control: false,
      description: "Called when the info panel toggle is clicked",
    },
    onPlusClick: {
      control: false,
      description:
        "Called when the plus button is clicked while `withMenu` is `false`",
      table: { defaultValue: { summary: "undefined" } },
    },
    onContextOptionsClick: {
      control: false,
      description:
        "Called when the folder button is clicked, before its menu opens",
      table: { defaultValue: { summary: "undefined" } },
    },
    onNavigationButtonClick: {
      control: false,
      description: "Called when the extra labelled button is clicked",
      table: { defaultValue: { summary: "undefined" } },
    },
    onLogoClick: {
      control: false,
      description: "Called when the logo is clicked",
      table: { defaultValue: { summary: "undefined" } },
    },
    tariffBar: {
      control: false,
      description:
        "Element shown after the buttons, cloned with the folder's `title` added as a prop. Hidden inside a frame",
      table: { defaultValue: { summary: "undefined" } },
    },
    analyzeResponsesButton: {
      control: false,
      description: "Any node, rendered as it is after the tariff notice",
      table: { defaultValue: { summary: "undefined" } },
    },
    contextMenuHeader: {
      control: false,
      description:
        "Header of the folder menu where it opens as a sheet below the desktop layout",
      table: { defaultValue: { summary: "undefined" } },
    },
    showTitleInDropBox: {
      control: "boolean",
      description: "Shows the title block at the top of the open drop box",
      table: { defaultValue: { summary: "true" } },
    },
  },
} satisfies Meta<typeof Navigation>;

type Story = StoryObj<ComponentProps<typeof Navigation>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => (
  <div style={{ height: "240px" }}>{props.children}</div>
);

// The header and its right-hand button row are sibling elements; this row lays them out side by side
const HeaderRow = (props: { children: React.ReactNode }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr auto",
      alignItems: "center",
    }}
  >
    {props.children}
  </div>
);

const noop = () => {};

const part = (root: HTMLElement, selector: string) =>
  root.querySelector<HTMLElement>(selector);

// The trail of folders opened from the title; items carry their id.
const dropBoxItem = (id: string) => document.getElementById(id);

const menuItem = async (name: string) => {
  const item = await screen.findByRole("menuitem", { name });
  await waitFor(() => expect(item).toBeVisible());
  return item;
};

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
  onClickFolder: fn(),
  onBackToParentFolder: fn(),
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
  toggleInfoPanel: fn(),
  isInfoPanelVisible: false,
  titles: {
    infoPanel: "Info Panel",
    actions: "Actions",
    contextMenu: "Context Menu",
    warningText: "Warning",
  },
  withMenu: true,
  onPlusClick: fn(),
  isEmptyPage: false,
  isDesktop: true,
  isRoom: false,
  isFrame: false,
  // Truthy, so the info panel toggle stays hidden; WithInfoPanel clears it
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
  onNavigationButtonClick: fn(),
  showNavigationButton: false,
  onContextOptionsClick: fn(),
  onLogoClick: fn(),
};

export const Default: Story = {
  render: (args) => (
    <Wrapper>
      <Navigation {...args} />
    </Wrapper>
  ),
  args: defaultArgs,
  play: async ({ args, canvasElement, userEvent }) => {
    const title = part(canvasElement, ".title-block-text") as HTMLElement;
    await expect(title).toHaveTextContent("My Documents");
    // The parent folder's name sits before the current one.
    const parent = part(canvasElement, ".room-title") as HTMLElement;
    await expect(parent).toHaveTextContent("Shared with me");
    await expect(within(canvasElement).getByText("Warning")).toBeVisible();

    await userEvent.click(part(canvasElement, ".arrow-button") as HTMLElement);
    await expect(args.onBackToParentFolder).toHaveBeenCalledTimes(1);

    await userEvent.click(parent);
    await expect(args.onClickFolder).toHaveBeenLastCalledWith(
      "2",
      false,
      false,
    );

    // The title opens the whole trail; picking a folder closes it.
    await userEvent.click(title);
    await waitFor(() => expect(dropBoxItem("1")).toBeVisible());
    await expect(dropBoxItem("1")).toHaveTextContent("Documents");
    await userEvent.click(dropBoxItem("1") as HTMLElement);
    await expect(args.onClickFolder).toHaveBeenLastCalledWith(
      "1",
      false,
      undefined,
    );
    await waitFor(() => expect(dropBoxItem("1")).toBeNull());
  },
  parameters: {
    docs: {
      description: {
        story:
          "The header of a nested folder: the back arrow, the parent folder's name, the current folder's name and a notice chip. Click the folder's name to open the drop box with the whole trail; change any other prop live in the Controls panel below.",
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
  play: async ({ canvasElement, userEvent }) => {
    // No way back, no parent name, and the title opens nothing.
    await expect(part(canvasElement, ".arrow-button")).toBeNull();
    await expect(part(canvasElement, ".room-title")).toBeNull();
    await userEvent.click(
      part(canvasElement, ".title-block-text") as HTMLElement,
    );
    await new Promise((resolve) => setTimeout(resolve, 200));
    await expect(dropBoxItem("1")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The header of a root folder: with no parent to go back to, the back arrow, the parent folder's name and the drop-down arrow are gone, and clicking the name opens nothing (`isRootFolder`).",
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
    isContextButtonVisible: true,
    titles: {
      ...defaultArgs.titles,
      warningText: "Items here can be deleted permanently",
    },
  },
  play: async ({ canvasElement, userEvent }) => {
    await expect(
      within(canvasElement).getByText("Items here can be deleted permanently"),
    ).toBeVisible();
    await expect(part(canvasElement, "#header_add-button")).toBeNull();
    // The folder button opens the folder's menu.
    await userEvent.click(
      part(canvasElement, "#header_optional-button") as HTMLElement,
    );
    await expect(await menuItem("Delete")).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "A folder that holds deleted items, where the person needs the rule spelled out and has nothing to create: the chip shows the notice (`titles.warningText`), there is no plus button, and the folder button's menu opens shifted to the side (`isTrashFolder`).",
      },
      source: {
        code: `<Navigation
  title="Trash"
  isTrashFolder
  canCreate={false}
  isContextButtonVisible
  titles={{ warningText: "Items here can be deleted permanently" }}
/>`,
      },
    },
  },
};

export const WithInfoPanel: Story = {
  render: (args) => (
    <Wrapper>
      <HeaderRow>
        <Navigation {...args} />
      </HeaderRow>
    </Wrapper>
  ),
  args: {
    ...defaultArgs,
    isInfoPanelVisible: true,
    hideInfoPanel: undefined,
  },
  play: async ({ args, canvasElement, userEvent }) => {
    const toggle = part(canvasElement, ".info-panel-toggle") as HTMLElement;
    // Drawn pressed while the panel is open.
    await expect(
      toggle.closest("[data-visible]") as HTMLElement,
    ).toHaveAttribute("data-visible", "true");
    await userEvent.click(toggle);
    await expect(args.toggleInfoPanel).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "The info panel toggle at the end of the header, in its pressed look, so the person can tell the panel is open and click to close it (`isInfoPanelVisible`, `toggleInfoPanel`). The toggle appears only without `hideInfoPanel`.",
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
    navigationButtonLabel: "Open location",
  },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByTestId("navigation_button");
    await expect(button).toHaveTextContent("Open location");
    await userEvent.click(button);
    await expect(args.onNavigationButtonClick).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "A labelled button after the other controls, for the one action a folder needs at hand, such as opening its location (`navigationButtonLabel`, `onNavigationButtonClick`). It is not shown in the root folder.",
      },
      source: {
        code: `<Navigation
  title="My Documents"
  showNavigationButton
  navigationButtonLabel="Open location"
  onNavigationButtonClick={handleClick}
/>`,
      },
    },
  },
};

export const WithActionButtons: Story = {
  render: (args) => (
    <Wrapper>
      <Navigation {...args} />
    </Wrapper>
  ),
  args: {
    ...defaultArgs,
    isPlusButtonVisible: true,
    isContextButtonVisible: true,
  },
  play: async ({ canvasElement, userEvent }) => {
    // Each button opens its own menu.
    await userEvent.click(
      part(canvasElement, "#header_add-button") as HTMLElement,
    );
    await expect(await menuItem("Upload file")).toBeVisible();
    await expect(screen.queryByRole("menuitem", { name: "Rename" })).toBeNull();
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(
        screen.queryByRole("menuitem", { name: "Upload file" }),
      ).toBeNull(),
    );

    await userEvent.click(
      part(canvasElement, "#header_optional-button") as HTMLElement,
    );
    await expect(await menuItem("Rename")).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          "The plus button and the folder button, each opening its own menu, so the person can create something here or act on the folder: click either one. `canCreate` alone shows no plus button and the menu getter alone shows no folder button; each needs its flag (`isPlusButtonVisible`, `isContextButtonVisible`).",
      },
      source: {
        code: `<Navigation
  title="My Documents"
  canCreate
  isPlusButtonVisible
  isContextButtonVisible
  getContextOptionsPlus={() => [
    { key: "upload", label: "Upload file" },
    { key: "create", label: "Create folder" },
  ]}
  getContextOptionsFolder={() => [
    { key: "rename", label: "Rename" },
    { key: "delete", label: "Delete" },
  ]}
/>`,
      },
    },
  },
};

export const WithAiChatButton: Story = {
  render: (args) => (
    <Wrapper>
      <HeaderRow>
        <Navigation {...args} />
      </HeaderRow>
    </Wrapper>
  ),
  args: {
    ...defaultArgs,
    toggleChatPanel: fn(),
    isChatPanelVisible: false,
    titles: { ...defaultArgs.titles, aiChat: "AI chat" },
  },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByTestId("ai-chat-button");
    await expect(button).toHaveTextContent("AI chat");
    await userEvent.click(button);
    await expect(args.toggleChatPanel).toHaveBeenCalledTimes(1);
  },
  parameters: {
    docs: {
      description: {
        story:
          "An **AI chat** button at the end of the header, for a host that has a chat panel to open (`toggleChatPanel`). Its text comes from `titles.aiChat` and gives way to the bare icon when the header runs out of room; turn on `isChatPanelVisible` in the Controls panel below to see its pressed look.",
      },
      source: {
        code: `<Navigation
  title="My Documents"
  titles={{ aiChat: "AI chat" }}
  toggleChatPanel={handleToggleChat}
  isChatPanelVisible={isChatOpen}
/>`,
      },
    },
  },
};

export const RightToLeft: Story = {
  render: (args) => (
    <div dir="rtl">
      <Navigation {...args} />
    </div>
  ),
  globals: { direction: "rtl" },
  play: async ({ canvasElement }) => {
    // The back arrow at the right edge; the parent name right of the title.
    const arrow = (
      part(canvasElement, ".arrow-button") as HTMLElement
    ).getBoundingClientRect();
    const parent = (
      part(canvasElement, ".room-title") as HTMLElement
    ).getBoundingClientRect();
    const title = (
      part(canvasElement, ".title-block-text") as HTMLElement
    ).getBoundingClientRect();
    await expect(arrow.left).toBeGreaterThan(parent.right);
    await expect(parent.left).toBeGreaterThanOrEqual(title.right - 1);
  },
  args: {
    ...defaultArgs,
    title: "مستنداتي",
    navigationItems: [
      { id: "1", title: "المستندات", isRootRoom: false },
      { id: "2", title: "الملفات", isRootRoom: false },
      { id: "3", title: "مستنداتي", isRootRoom: true },
    ],
    titles: { ...defaultArgs.titles, warningText: undefined },
  },
  parameters: {
    noPadding: true,
    docs: {
      // Framed, because an inline RTL story flips the whole Docs page.
      story: { inline: false, height: "58px" },
      description: {
        story:
          "The header in a right-to-left interface: the back arrow sits at the right edge and points right, the parent folder's name comes to the right of the current one and the drop-down arrow follows the name on its left.",
      },
      source: {
        code: `<div dir="rtl">
  <Navigation
    title="مستنداتي"
    navigationItems={trail}
  />
</div>`,
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
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          "--navigation-heading-size": "20px",
          "--navigation-heading-weight": "700",
          "--navigation-title-color": "#0082c9",
          "--navigation-expander-fill": "#0082c9",
          "--navigation-arrow-fill": "#0082c9",
          "--navigation-separator": "#0082c9",
          "--navigation-badge-fill": "#0082c9",
          "--navigation-dropdown-bg": "#e6f3fb",
          "--navigation-dropdown-shadow": "0 4px 16px rgba(0,130,201,0.25)",
          "--navigation-dropdown-radius": "8px",
          "--navigation-info-panel-bg": "#cce5f6",
          "--navigation-chat-radius": "16px",
          "--navigation-warning-bg": "#e6f3fb",
          "--navigation-warning-text": "#0082c9",
          "--navigation-warning-radius": "8px",
        } as React.CSSProperties
      }
    >
      <HeaderRow>
        <Navigation {...defaultArgs} />
      </HeaderRow>
      <HeaderRow>
        <Navigation
          {...defaultArgs}
          showRootFolderTitle={false}
          badgeLabel="New"
          isInfoPanelVisible
          hideInfoPanel={undefined}
          toggleChatPanel={fn()}
          titles={{ ...defaultArgs.titles, aiChat: "AI chat" }}
        />
      </HeaderRow>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const heading = (part(canvasElement, ".title-block-text") as HTMLElement)
      .firstElementChild as HTMLElement;
    await expect(getComputedStyle(heading).fontSize).toBe("20px");
    await expect(getComputedStyle(heading).fontWeight).toBe("700");
    const warning = within(canvasElement).getAllByText("Warning")[0]
      .parentElement as HTMLElement;
    await expect(getComputedStyle(warning).backgroundColor).toBe(
      "rgb(230, 243, 251)",
    );
    await expect(getComputedStyle(warning).borderTopLeftRadius).toBe("8px");
  },
  parameters: {
    docs: {
      description: {
        story: `Every overridable variable set on one wrapper -- the variables are listed under CSS variables on this page.

- **First header** — the heading, the second title, both arrows, the separator and the notice chip; click the folder's name to see the drop box variables.
- **Second header** — the variables its props switch on: the badge next to the folder's name (\`badgeLabel\`), the pressed info panel toggle (\`isInfoPanelVisible\`) and the AI chat button (\`toggleChatPanel\`).`,
      },
      source: {
        code: `<div
  style={{
    "--navigation-heading-size": "20px",
    "--navigation-title-color": "#0082c9",
    "--navigation-expander-fill": "#0082c9",
    "--navigation-dropdown-bg": "#e6f3fb",
    "--navigation-info-panel-bg": "#cce5f6",
    "--navigation-warning-bg": "#e6f3fb",
    "--navigation-warning-text": "#0082c9",
  }}
>
  <Navigation {...headerProps} />
</div>`,
      },
    },
  },
};
