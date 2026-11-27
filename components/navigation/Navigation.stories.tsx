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
      description:
        "Name of the current folder, shown as the heading. It is also the hover tooltip of the folder button, and is added to `tariffBar` as a prop.",
    },
    isRootFolder: {
      control: "boolean",
      description:
        "Whether the current folder is the root of its tree. It hides the back arrow, keeps the drop box shut and drops the title icon.",
    },
    canCreate: {
      control: "boolean",
      description:
        "Whether the person may create anything here. It is one of two conditions for the plus button; `isPlusButtonVisible` is the other, and both must hold.",
    },
    isPlusButtonVisible: {
      control: "boolean",
      description:
        "**Required for the plus button to appear at all.** Without it no plus button is rendered, even with `canCreate`.",
      table: { defaultValue: { summary: "undefined" } },
    },
    isContextButtonVisible: {
      control: "boolean",
      description:
        "**Required for the folder button to appear at all.** Without it the folder menu is never rendered, whatever `getContextOptionsFolder` returns.",
      table: { defaultValue: { summary: "undefined" } },
    },
    withMenu: {
      control: "boolean",
      description:
        "Whether the plus and folder buttons open their menus. With `false` a click only calls `onPlusClick` or `onContextOptionsClick`.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    isTrashFolder: {
      control: "boolean",
      description:
        "Shifts the folder menu further to the side of its button. Nothing else in the header changes.",
      table: { defaultValue: { summary: "undefined" } },
    },
    isDesktop: {
      control: "boolean",
      description:
        "Whether the host is the desktop application. It only caps the drop box's title row at 32px; the layout follows `currentDeviceType`.",
    },
    currentDeviceType: {
      control: "select",
      options: [DeviceType.desktop, DeviceType.tablet, DeviceType.mobile],
      description:
        "Which layout to render. It decides which buttons appear in place of a media query, so a wrong value shows the wrong buttons.",
    },
    isInfoPanelVisible: {
      control: "boolean",
      description:
        "Whether the info panel is open, which draws its toggle pressed.",
    },
    hideInfoPanel: {
      control: "boolean",
      description: "Hides the info panel toggle on a desktop.",
      table: { defaultValue: { summary: "undefined" } },
    },
    navigationButtonLabel: {
      control: "text",
      description:
        "Label of the extra button at the end of the row. Without it the button is not rendered, and it is also hidden inside a frame and in the root folder.",
      table: { defaultValue: { summary: "undefined" } },
    },
    showNavigationButton: {
      control: "boolean",
      description:
        "Widens the header's last column to at least 186px for the extra button. The button itself appears with `navigationButtonLabel`.",
    },
    showRootFolderTitle: {
      control: "boolean",
      description:
        "Shows the room's title before the folder's own, as a second clickable title. It is ignored in the root folder, on a phone, and when there is neither a `rootRoomTitle` nor more than one crumb.",
    },
    rootRoomTitle: {
      control: "text",
      description:
        "Text of the room title before the folder name. Without it the second-to-last crumb's title is used.",
    },
    badgeLabel: {
      control: "text",
      description:
        "Text of the small badge after the title. It follows the room title when one is shown, and the folder name otherwise.",
      table: { defaultValue: { summary: "undefined" } },
    },
    titleTooltip: {
      control: "text",
      description:
        "Replaces the folder name's hover tooltip, which is otherwise the name itself. It is dropped while the room title is shown.",
      table: { defaultValue: { summary: "undefined" } },
    },
    showTitle: {
      control: "boolean",
      description:
        "Shows the folder name and the room title. Without it only the arrow and the buttons remain.",
      table: { defaultValue: { summary: "undefined" } },
    },
    showBackButton: {
      control: "boolean",
      description:
        "Shows the back arrow even in the root folder, where it is otherwise hidden.",
      table: { defaultValue: { summary: "undefined" } },
    },
    isFrame: {
      control: "boolean",
      description:
        "Whether the header is inside an embedding frame. It hides the folder button, the extra button and the tariff notice, and keeps the plus button below desktop.",
      table: { defaultValue: { summary: "undefined" } },
    },
    isPublicRoom: {
      control: "boolean",
      description:
        "Replaces the folder button with one that appears only when at least one of its options is enabled.",
      table: { defaultValue: { summary: "undefined" } },
    },
    withLogo: {
      control: false,
      description:
        "Shows the logo block at the start of the header. A string is the desktop image's URL; `true` shows only `burgerLogo`.",
    },
    burgerLogo: {
      control: false,
      description:
        "URL of the logo shown below the desktop breakpoint while `withLogo` is set. It is an `<img src>`, not an icon name.",
    },
    titleIcon: {
      control: false,
      description:
        "URL of the small icon before the title. It is hidden in the root folder.",
    },
    titleIconTooltip: {
      control: "text",
      description:
        "Text of the tooltip on the title icon. Without it no tooltip element is rendered.",
      table: { defaultValue: { summary: "undefined" } },
    },
    titles: {
      control: "object",
      description:
        "Texts of the header buttons. `infoPanel` and `actions` name the info panel toggle and the plus, and are their hover tooltips; `contextMenu` names the folder button. `aiChat` labels the AI chat button, and `warningText` and `warningIcon` fill the warning chip.",
      table: { defaultValue: { summary: "undefined" } },
    },
    navigationItems: {
      control: "object",
      description:
        "The breadcrumb trail, outermost folder first. The last entry is the current folder; an empty list makes the title unclickable.",
    },
    toggleChatPanel: {
      control: false,
      description:
        "Called when the AI chat button is clicked. Without it the button is not rendered.",
      table: { defaultValue: { summary: "undefined" } },
    },
    isChatPanelVisible: {
      control: "boolean",
      description:
        "Whether the AI chat panel is open, which draws its button pressed.",
      table: { defaultValue: { summary: "undefined" } },
    },
    hideChatButton: {
      control: "boolean",
      description:
        "Hides the AI chat button even when `toggleChatPanel` is set.",
      table: { defaultValue: { summary: "undefined" } },
    },
    getContextOptionsFolder: {
      control: false,
      description:
        "Returns the model of the folder menu. **It is called on every render**, whether or not the button is shown, so keep it cheap.",
    },
    getContextOptionsPlus: {
      control: false,
      description:
        "Returns the model of the plus button's menu. It is called on every render of that button.",
    },
    onClickFolder: {
      control: false,
      description:
        "Called with a crumb's id when one is chosen from the drop box, and when the room title is clicked.",
    },
    onBackToParentFolder: {
      control: false,
      description:
        "Called when the back arrow is clicked. In the open drop box it also closes the box.",
    },
    toggleInfoPanel: {
      control: false,
      description: "Called when the info panel toggle is clicked.",
    },
    onPlusClick: {
      control: false,
      description:
        "Called on click instead of opening the menu, and only while `withMenu` is `false`.",
      table: { defaultValue: { summary: "undefined" } },
    },
    onContextOptionsClick: {
      control: false,
      description:
        "Called when the folder button is clicked, before its menu opens.",
      table: { defaultValue: { summary: "undefined" } },
    },
    onNavigationButtonClick: {
      control: false,
      description: "Called when that extra button is clicked.",
      table: { defaultValue: { summary: "undefined" } },
    },
    onLogoClick: {
      control: false,
      description:
        "Called when the logo is clicked. Only reachable while `withLogo` is set.",
      table: { defaultValue: { summary: "undefined" } },
    },
    tariffBar: {
      control: false,
      description:
        "Portal element for the tariff notice. It is cloned with the folder's `title` added as a prop, so the element has to tolerate one. Hidden inside a frame.",
      table: { defaultValue: { summary: "undefined" } },
    },
    analyzeResponsesButton: {
      control: false,
      description:
        "Rendered as-is at the end of the button row, after the tariff notice.",
      table: { defaultValue: { summary: "undefined" } },
    },
    beforeContextButton: {
      control: false,
      description:
        "Host controls drawn right before the context button; with them, the controls, the context button and the navigation button stay together in that order right after the title at every width",
      table: { defaultValue: { summary: "undefined" } },
    },
    contextMenuHeader: {
      control: false,
      description:
        "Header of the folder's context menu, used where the menu opens as a mobile sheet.",
      table: { defaultValue: { summary: "undefined" } },
    },
    showTitleInDropBox: {
      control: "boolean",
      description:
        "Shows the title block at the top of the open drop box. Only `false` hides it and frees the height it reserves.",
      table: { defaultValue: { summary: "true" } },
    },
  },
} satisfies Meta<typeof Navigation>;

type Story = StoryObj<ComponentProps<typeof Navigation>>;

export default meta;

const Wrapper = (props: { children: React.ReactNode }) => (
  <div style={{ height: "240px" }}>
    <div style={{ height: "69px" }}>{props.children}</div>
  </div>
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
  toggleInfoPanel: fn(),
  isInfoPanelVisible: false,
  titles: {
    infoPanel: "Info Panel",
    actions: "Actions",
    contextMenu: "Context Menu",
  },
  withMenu: true,
  onPlusClick: fn(),
  isDesktop: true,
  isFrame: false,
  // The info panel toggle stays hidden; WithInfoPanel clears it
  hideInfoPanel: true,
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
  name: "Nested folder",
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
          "The header of a nested folder: the back arrow, the parent folder's name and the current folder's name. A click on the folder's name opens the drop box with the whole trail.",
      },
      source: {
        code: `<Navigation
  title="My Documents"
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
  name: "Root folder",
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
          "The header of a root folder, with no parent to go back to (`isRootFolder`). The back arrow, the parent's name and the drop-down arrow are gone, and the name opens nothing.",
      },
      source: {
        code: `<Navigation title="Documents" isRootFolder canCreate />`,
      },
    },
  },
};

export const TrashFolder: Story = {
  name: "Trash folder",
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
          "A folder of deleted items, with the rule spelled out in a chip (`titles.warningText`) and nothing to create. The folder button's menu opens shifted to the side (`isTrashFolder`).",
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
  name: "Info panel open",
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
          "The info panel toggle at the end of the header, drawn pressed while the panel is open (`isInfoPanelVisible`, `toggleInfoPanel`). The toggle appears only without `hideInfoPanel`.",
      },
      source: {
        code: `<Navigation title="My Documents" isInfoPanelVisible isDesktop toggleInfoPanel={handleToggle} />`,
      },
    },
  },
};

export const WithNavigationButton: Story = {
  name: "With extra button",
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
  name: "Plus and folder buttons",
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
          "The plus button and the folder button, each opening its own menu: one creates something here, the other acts on the folder. Each needs its flag (`isPlusButtonVisible`, `isContextButtonVisible`).",
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
  name: "With AI chat button",
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
          "An **AI chat** button at the end of the header, for a host with a chat panel to open (`toggleChatPanel`). Its label is `titles.aiChat`, and it shrinks to the icon when the header runs out of room.",
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
  name: "Right to left",
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
          "The header in a right-to-left interface. The back arrow sits at the right edge and points right, and the parent folder's name comes right of the current one.",
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
  name: "CSS variables",
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
        <Navigation
          {...defaultArgs}
          titles={{ ...defaultArgs.titles, warningText: "Warning" }}
        />
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
        story: `Every overridable variable set on one wrapper, in two headers.

- **First header** — the heading, the room title, both arrows, the separator and the warning chip.
- **Second header** — the badge (\`badgeLabel\`), the pressed info panel toggle (\`isInfoPanelVisible\`) and the AI chat button (\`toggleChatPanel\`).`,
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
