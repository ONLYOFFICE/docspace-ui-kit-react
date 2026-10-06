import React from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import CatalogFolderReactSvgUrl from "../../../assets/icons/16/catalog.folder.react.svg?url";
import CatalogTrashReactSvgUrl from "../../../assets/icons/16/catalog.trash.react.svg?url";

import { ArticleItemPure } from "./ArticleItem";
import styles from "./ArticleItem.module.scss";

const defaultLinkData = {
  path: "",
  state: {},
};

const meta = {
  title: "UI/Layout components/ArticleItem",
  component: ArticleItemPure,
  parameters: {
    docs: {
      description: {
        component:
          "One catalog entry of the Article panel's body: an icon, a label and an optional badge. The Article page describes it in full.",
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/file/ZiW5KSwb4t7Tj6Nz5TducC/UI-Kit-DocSpace-1.0.0?type=design&node-id=474-2027&mode=design&t=TBNCKMQKQMxr44IZ-0",
    },
  },
  decorators: [
    (Story) => (
      <div className={styles.storyCatalogWrapper} style={{ width: "250px" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    icon: CatalogFolderReactSvgUrl,
    text: "Documents",
    showText: true,
    linkData: defaultLinkData,
    id: "documents",
    onClick: fn(),
    onClickBadge: fn(),
  },
  argTypes: {
    showText: { control: "boolean" },
    showBadge: { control: "boolean" },
    isActive: { control: "boolean" },
    isDragging: { control: "boolean" },
    isDragActive: { control: "boolean" },
    isHeader: { control: "boolean" },
    isFirstHeader: { control: "boolean", if: { arg: "isHeader" } },
    isEndOfBlock: { control: "boolean" },
    showInitial: { control: "boolean" },
    labelBadge: { control: "text" },
    text: { control: "text" },
  },
} satisfies Meta<typeof ArticleItemPure>;

type Story = StoryObj<typeof ArticleItemPure>;

export default meta;

export const Default: Story = {
  args: {},
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByText("Documents")).toBeVisible();
    // The click lands on the overlay behind the label, which takes no
    // pointer events of its own; onClick gets the row's id.
    await userEvent.click(canvas.getByTestId("article-item-sibling"));
    await expect(args.onClick).toHaveBeenCalledWith(
      expect.anything(),
      "documents",
    );
  },
};

export const IconOnly: Story = {
  args: {
    showText: false,
    showBadge: false,
  },
  play: async ({ canvas }) => {
    // Icon only: no label is rendered.
    await expect(canvas.queryByText("Documents")).toBeNull();
    await expect(canvas.getByTestId("article-item")).toBeVisible();
  },
  decorators: [
    (Story) => (
      <div className={styles.storyCatalogWrapper} style={{ width: "52px" }}>
        <Story />
      </div>
    ),
  ],
};

export const WithBadge: Story = {
  args: {
    showBadge: true,
    labelBadge: "42",
  },
  play: async ({ args, canvas, userEvent }) => {
    // A badge click reports the badge, not the row.
    await userEvent.click(canvas.getByText("42"));
    await expect(args.onClickBadge).toHaveBeenCalledWith("documents");
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const WithCustomBadge: Story = {
  args: {
    showBadge: true,
    iconBadge: CatalogTrashReactSvgUrl,
  },
};

export const Active: Story = {
  args: {
    isActive: true,
    showBadge: true,
    labelBadge: "New",
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId("article-item").className).toMatch(
      /active/,
    );
    await expect(canvas.getByText("New")).toBeVisible();
  },
};

export const Dragging: Story = {
  args: {
    isDragging: true,
  },
};

export const DragTarget: Story = {
  args: {
    isDragActive: true,
  },
};

export const Header: Story = {
  args: {
    text: "RECENT",
    isHeader: true,
    showText: true,
  },
  play: async ({ canvas }) => {
    // A header is a plain caption, not a clickable row.
    await expect(canvas.getByTestId("article-item-header")).toHaveTextContent(
      "RECENT",
    );
    await expect(canvas.queryByTestId("article-item-sibling")).toBeNull();
  },
};

export const EndOfBlock: Story = {
  render: () => (
    <>
      <ArticleItemPure
        icon={CatalogFolderReactSvgUrl}
        text="First Item"
        showText
        showBadge
        isEndOfBlock
        labelBadge="3"
        linkData={defaultLinkData}
      />
      <ArticleItemPure
        icon={CatalogFolderReactSvgUrl}
        text="Second Item"
        showText
        showBadge
        iconBadge={CatalogTrashReactSvgUrl}
        linkData={defaultLinkData}
      />
    </>
  ),
  play: async ({ canvas }) => {
    // isEndOfBlock closes a group with a bottom margin.
    const [first, second] = canvas.getAllByTestId("article-item");
    await expect(
      parseFloat(getComputedStyle(first).marginBottom),
    ).toBeGreaterThan(parseFloat(getComputedStyle(second).marginBottom));
  },
};

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--article-item-border-radius": "8px",
          "--article-item-text": "#222222",
          "--article-item-text-active": "#ffffff",
          "--article-item-text-weight": "400",
          "--article-item-icon": "#222222",
          "--article-item-icon-active": "#ffffff",
          "--article-item-active-bg": "#00679e",
          "--article-item-active-hover-bg": "#00507a",
          "--article-item-hover-bg": "#f5f5f5",
          "--sidebar-item-gap": "4px",
        } as React.CSSProperties
      }
    >
      <ArticleItemPure
        icon={CatalogFolderReactSvgUrl}
        text="Documents"
        showText
        linkData={defaultLinkData}
      />
      <ArticleItemPure
        icon={CatalogFolderReactSvgUrl}
        text="Active Item"
        showText
        isActive
        linkData={defaultLinkData}
      />
      <ArticleItemPure
        icon={CatalogTrashReactSvgUrl}
        text="Trash"
        showText
        linkData={defaultLinkData}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The row's variables set on one wrapper -- they are listed under CSS variables on the Article page.",
      },
      source: {
        code: `// Sidebar with Nextcloud-style active state and gaps
<div style={{
  "--article-item-border-radius": "8px",
  "--article-item-text": "#222222",
  "--article-item-text-active": "#ffffff",
  "--article-item-text-weight": "400",
  "--article-item-active-bg": "#00679e",
  "--article-item-hover-bg": "#f5f5f5",
  "--sidebar-item-gap": "4px",
}}>
  <ArticleItemPure icon={folderIcon} text="Documents" showText linkData={linkData} />
  <ArticleItemPure icon={folderIcon} text="Active" showText isActive linkData={linkData} />
</div>`,
      },
    },
  },
};
