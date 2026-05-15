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

import type { CSSProperties, ComponentProps, ReactNode } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { useEffect, useState } from "react";

import type { IndexRange } from "react-virtualized";

import type { TViewAs } from "../../types";

import { Scrollbar } from "../scrollbar";
import { InfiniteLoaderComponent } from "./InfiniteLoader";

const generateItems = (
  count: number,
  startIndex: number = 0,
): React.ReactNode[] =>
  Array(count)
    .fill(null)
    .map((_, index) => (
      <div
        key={`item-${startIndex + index}`}
        style={{
          padding: "8px",
          border: "1px solid #eee",
          margin: "4px",
          borderRadius: "4px",
        }}
      >
        Item {startIndex + index + 1}
      </div>
    ));

const ScrollStructureWrapper = ({ children }: { children: ReactNode }) => (
  <div style={{ height: "300px", position: "relative" }} id="sectionScroll">
    <Scrollbar>
      <div id="tileContainer" style={{ width: "100%" }}>
        {children}
      </div>
    </Scrollbar>
  </div>
);

const InfiniteLoaderDemo = () => {
  const [items, setItems] = useState<React.ReactNode[]>(generateItems(20, 0));
  const [itemCount] = useState(100);
  const [loadedCount, setLoadedCount] = useState(20);
  const [isInitialized, setIsInitialized] = useState(false);

  const loadMoreItems = async ({
    startIndex,
    stopIndex,
  }: IndexRange): Promise<void> => {
    console.log("loadMoreItems", { startIndex, stopIndex });

    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });

    const newItemsCount = stopIndex - startIndex + 1;
    const newItems = generateItems(newItemsCount, loadedCount);

    setItems((prev) => [...prev, ...newItems]);
    setLoadedCount((prev) => prev + newItemsCount);
  };

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);

      const scrollElement = document.querySelector(
        "#sectionScroll .scroll-wrapper > .scroller",
      ) as HTMLElement | null;

      if (scrollElement) {
        const scrollEvent = new Event("scroll", { bubbles: true });
        scrollElement.dispatchEvent(scrollEvent);
      }
    }
  }, [isInitialized]);

  return (
    <InfiniteLoaderComponent
      viewAs={"tile" as TViewAs}
      itemCount={itemCount}
      filesLength={loadedCount}
      hasMoreFiles={loadedCount < itemCount}
      loadMoreItems={loadMoreItems}
      itemSize={20}
      countTilesInRow={4}
      isLoading={false}
    >
      {items}
    </InfiniteLoaderComponent>
  );
};

const meta = {
  title: "UI/Status components/InfiniteLoader",
  component: InfiniteLoaderComponent,
  parameters: {
    docs: {
      description: {
        component: `InfiniteLoader component for handling large lists of items with virtualization support.

### Features

- **Virtualized Rendering**: Efficiently renders large lists by only mounting visible items
- **Infinite Scrolling**: Automatically loads more items as the user scrolls
- **Tile & Row Views**: Supports both tile and row layout modes via the \`viewAs\` prop
- **Loading State**: Displays skeleton placeholders while content is loading
- **Configurable Item Size**: Customize item height for precise scroll calculations
- **Info Panel Awareness**: Adjusts layout when the info panel is visible

### Usage

\`\`\`tsx
import { InfiniteLoaderComponent } from "@docspace/ui-kit/components/infinite-loader";

<InfiniteLoaderComponent
  viewAs="tile"
  itemCount={totalItems}
  filesLength={loadedItems.length}
  hasMoreFiles={hasMore}
  loadMoreItems={handleLoadMore}
  itemSize={48}
  countTilesInRow={4}
  isLoading={false}
>
  {items}
</InfiniteLoaderComponent>
\`\`\``,
      },
    },
  },
  decorators: [
    (Story) => (
      <ScrollStructureWrapper>
        <Story />
      </ScrollStructureWrapper>
    ),
  ],
  argTypes: {
    viewAs: {
      control: "select",
      options: ["row", "tile", "table"],
      description: "Layout mode for rendering items",
      table: {
        defaultValue: { summary: "row" },
      },
    },
    hasMoreFiles: {
      control: "boolean",
      description: "Whether there are more items to load",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    filesLength: {
      control: "number",
      description: "Number of currently loaded files/items",
    },
    itemCount: {
      control: "number",
      description: "Total number of items available",
    },
    itemSize: {
      control: "number",
      description: "Height of each item in pixels (used for scroll calculations)",
    },
    isLoading: {
      control: "boolean",
      description: "Whether content is currently loading",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    countTilesInRow: {
      control: "number",
      description: "Number of tiles per row in tile view mode",
    },
    infoPanelVisible: {
      control: "boolean",
      description: "Whether the info panel is currently visible",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<typeof InfiniteLoaderComponent>;

type Story = StoryObj<ComponentProps<typeof InfiniteLoaderComponent>>;

export default meta;

export const CssCustomization: Story = {
  render: () => (
    <div
      style={
        {
          "--infinite-loader-tile-gap": "20px 24px",
          "--infinite-loader-tile-min-size": "180px",
          "--infinite-loader-tile-max-size": "280px",
        } as CSSProperties
      }
    >
      <InfiniteLoaderDemo />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `CSS Custom Properties for external customization:

| Variable | Description | Default |
|----------|-------------|---------|
| \`--infinite-loader-tile-gap\` | Gap between tiles in tile view | \`14px 16px\` |
| \`--infinite-loader-tile-min-size\` | Minimum tile width in grid | \`216px\` |
| \`--infinite-loader-tile-max-size\` | Maximum tile width in grid | \`360px\` |
| \`--infinite-loader-list-width\` | Override row/table layout width (dev override) | — |
| \`--infinite-loader-table-width\` | Width basis for row/table layouts (set by parent) | \`100%\` |`,
      },
    },
  },
};

export const Default: Story = {
  args: {},
  render: () => <InfiniteLoaderDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Default infinite loader displaying a virtualized list of tile items that loads more content on scroll.",
      },
      source: {
        code: `<InfiniteLoaderComponent
  viewAs="tile"
  itemCount={100}
  filesLength={20}
  hasMoreFiles={true}
  loadMoreItems={handleLoadMore}
  itemSize={20}
  countTilesInRow={4}
  isLoading={false}
>
  {items}
</InfiniteLoaderComponent>`,
      },
    },
  },
};
