import React from "react";
import { Meta, StoryObj } from "@storybook/react-vite";

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
          "Display catalog item. Can show only icon. If is it end of block - adding margin bottom.",
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
};

export const IconOnly: Story = {
  args: {
    showText: false,
    showBadge: false,
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
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--article-item-border-radius\` | Background pill border radius | \`3px\` |
| \`--article-item-text\` | Item text color (normal) | theme-based |
| \`--article-item-text-active\` | Item text color (active/selected) | theme-based |
| \`--article-item-text-weight\` | Item text font weight | \`600\` |
| \`--article-item-icon\` | Icon fill color (normal) | theme-based |
| \`--article-item-icon-active\` | Icon fill color (active/selected) | theme-based |
| \`--article-item-active-bg\` | Background when item is active | theme-based |
| \`--article-item-active-hover-bg\` | Background when hovering an active item | theme-based |
| \`--article-item-hover-bg\` | Background on hover | theme-based |
| \`--sidebar-item-gap\` | Gap between items (set on parent container) | \`0\` |`,
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
