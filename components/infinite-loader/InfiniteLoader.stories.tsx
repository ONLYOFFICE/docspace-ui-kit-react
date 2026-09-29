import type { CSSProperties, ComponentProps, ReactNode } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { fn } from "storybook/test";

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
      {/* The loader measures its width from these portal container ids */}
      <div id="tileContainer" style={{ width: "100%" }}>
        <div id="rowContainer">
          <div id="table-container">{children}</div>
        </div>
      </div>
    </Scrollbar>
  </div>
);

type InfiniteLoaderDemoProps = {
  viewAs?: TViewAs;
  itemCount?: number;
  itemSize?: number;
  countTilesInRow?: number;
  isLoading?: boolean;
  infoPanelVisible?: boolean;
  hasMoreFiles?: boolean;
  columnStorageName?: string;
  columnInfoPanelStorageName?: string;
  loadMoreItems?: (range: IndexRange) => Promise<void>;
  onScroll?: () => void;
  renderItem?: (index: number) => ReactNode;
};

const InfiniteLoaderDemo = ({
  viewAs = "tile" as TViewAs,
  itemCount: itemCountProp = 100,
  itemSize = 20,
  countTilesInRow = 4,
  isLoading = false,
  infoPanelVisible,
  hasMoreFiles: hasMoreFilesProp,
  columnStorageName,
  columnInfoPanelStorageName,
  loadMoreItems: onLoadMore,
  onScroll,
  renderItem,
}: InfiniteLoaderDemoProps = {}) => {
  const makeItems = (count: number, startIndex: number) =>
    renderItem
      ? Array.from({ length: count }, (_, i) => renderItem(startIndex + i))
      : generateItems(count, startIndex);
  const [items, setItems] = useState<React.ReactNode[]>(makeItems(20, 0));
  const [itemCount] = useState(itemCountProp);
  const [loadedCount, setLoadedCount] = useState(20);
  const [isInitialized, setIsInitialized] = useState(false);

  const loadMoreItems = async ({
    startIndex,
    stopIndex,
  }: IndexRange): Promise<void> => {
    onLoadMore?.({ startIndex, stopIndex });

    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });

    const newItemsCount = stopIndex - startIndex + 1;
    const newItems = makeItems(newItemsCount, loadedCount);

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
      viewAs={viewAs}
      itemCount={itemCount}
      filesLength={loadedCount}
      hasMoreFiles={hasMoreFilesProp ?? loadedCount < itemCount}
      loadMoreItems={loadMoreItems}
      itemSize={itemSize}
      countTilesInRow={countTilesInRow}
      isLoading={isLoading}
      infoPanelVisible={infoPanelVisible}
      columnStorageName={columnStorageName}
      columnInfoPanelStorageName={columnInfoPanelStorageName}
      onScroll={onScroll}
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
        component: `Virtualised list or grid for long file lists that asks the host for the next page as the user scrolls towards the end of what is loaded.

### Features

- **Virtualized Rendering**: Efficiently renders large lists by only mounting visible items
- **Infinite Scrolling**: Asks the host for the range of items still missing as the user scrolls near the end of the loaded ones
- **Tile, Row & Table Layouts**: Lays each child out as one row of a tile grid, one list row or one table row whose columns come from saved widths
- **Loading Placeholders**: Shows a skeleton row in place of every row or table row not loaded yet, and skeleton rows or tiles while a long scroll jump settles
- **Fixed Row Height**: Gives every list and table row the same height in pixels, while a tile row takes its height from the kind of tile it holds
- **Info Panel Awareness**: Reads the table's column widths from a separate saved entry while the info panel is open
- **Hidden While Loading**: Renders nothing at all while the whole list is still loading
- **Page Scroll Container**: Follows the scroll of the page section found by its id, not a scroller of its own, and falls back to the window

### Usage

\`\`\`tsx
import { InfiniteLoaderComponent } from "@onlyoffice/apps-ui-kit/components/infinite-loader";

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

// A table: column widths are read from localStorage under these keys
<InfiniteLoaderComponent
  viewAs="table"
  itemCount={totalItems}
  filesLength={loadedItems.length}
  hasMoreFiles={hasMore}
  loadMoreItems={handleLoadMore}
  itemSize={48}
  columnStorageName="filesColumns"
  columnInfoPanelStorageName="filesColumnsInfoPanel"
>
  {rows}
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
      description:
        "Which layout to render: `tile` lays the children out as rows of a grid, `row` and `table` as a list; it also picks the placeholder shown for rows not loaded yet",
    },
    hasMoreFiles: {
      control: "boolean",
      description:
        "Whether there is another page to ask for; while false, every row counts as loaded and no placeholder is shown",
    },
    filesLength: {
      control: "number",
      description: "How many items are loaded so far",
    },
    itemCount: {
      control: "number",
      description: "How many items there are in total, loaded or not",
    },
    loadMoreItems: {
      control: false,
      description:
        "Called with the start and stop index of the items to load when the user scrolls near the end of the loaded ones; it returns a promise",
    },
    itemSize: {
      control: "number",
      description:
        "Height of every row in pixels in the `row` and `table` layouts; the `tile` layout ignores it and sizes each row from the tile it holds",
    },
    children: {
      control: false,
      description:
        "The items, as an array with one entry per list row, table row or row of tiles",
    },
    onScroll: {
      control: false,
      description: "Called as the list scrolls",
    },
    isLoading: {
      control: "boolean",
      description: "Renders nothing at all while true",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    countTilesInRow: {
      control: "number",
      description:
        "How many tiles one row of the `tile` layout holds; it decides which rows count as loaded and how many skeleton tiles a row shows during a long scroll jump",
      table: {
        defaultValue: { summary: "1" },
      },
    },
    columnStorageName: {
      control: "text",
      description:
        "`localStorage` key holding the table's column widths; required in the `table` layout, which throws without it",
    },
    columnInfoPanelStorageName: {
      control: "text",
      description:
        "`localStorage` key holding the table's column widths while the info panel is open; required in the `table` layout",
    },
    infoPanelVisible: {
      control: "boolean",
      description:
        "Reads the table's column widths from the info-panel key instead of the regular one",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    className: {
      control: "text",
      description: "Class added to the list element",
    },
    currentFolderId: {
      control: "text",
      description:
        "Identifier of the folder being shown; when it changes, the `tile` layout measures its row heights again",
    },
    showSkeleton: {
      control: false,
      description:
        "Ignored; the loader sets it itself after a scroll jump of more than 800px",
    },
    smallPreview: {
      control: false,
      description: "Declared, but no layout reads it",
    },
    isOneTile: {
      control: false,
      description: "Declared, but no layout reads it",
    },
  },
} satisfies Meta<typeof InfiniteLoaderComponent>;

type Story = StoryObj<ComponentProps<typeof InfiniteLoaderComponent>>;

export default meta;

export const Default: Story = {
  args: {
    viewAs: "tile" as TViewAs,
    itemCount: 100,
    itemSize: 20,
    countTilesInRow: 4,
    isLoading: false,
    infoPanelVisible: false,
    hasMoreFiles: true,
    loadMoreItems: fn(),
    onScroll: fn(),
  },
  render: (args) => <InfiniteLoaderDemo {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "Scroll the box: when the end of the loaded items comes near, the loader asks for the next range, and the new items arrive half a second later (`loadMoreItems`, logged in the Actions panel). In the `tile` layout each child is one row of the grid; here a plain box stands in for a row of tiles. Change any other prop live in the Controls panel below.",
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

const renderTableRow = (index: number) => (
  <>
    <div style={{ padding: "12px 8px" }}>Document {index + 1}</div>
    <div style={{ padding: "12px 8px" }}>Today</div>
    <div style={{ padding: "12px 8px" }}>{(index % 9) + 1} KB</div>
  </>
);

const TABLE_COLUMNS_KEY = "storybook-infinite-loader-columns";

const saveTableColumns = () => {
  try {
    localStorage.setItem(TABLE_COLUMNS_KEY, "2fr 1fr 1fr");
  } catch {
    // Without storage the rows fall back to a single column
  }
};

export const RowLayout: Story = {
  args: {
    viewAs: "row" as TViewAs,
    itemCount: 100,
    itemSize: 48,
    hasMoreFiles: true,
    loadMoreItems: fn(),
  },
  render: (args) => <InfiniteLoaderDemo {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          'A list of rows of one height (`viewAs="row"`, `itemSize`). Scroll to the end: the rows after the last loaded item are skeleton rows until the next page arrives, and a jump of more than 800px, such as dragging the scrollbar, turns every row in view into a skeleton while the scrolling lasts.',
      },
      source: {
        code: `<InfiniteLoaderComponent
  viewAs="row"
  itemCount={100}
  filesLength={loadedItems.length}
  hasMoreFiles={hasMore}
  loadMoreItems={handleLoadMore}
  itemSize={48}
>
  {items}
</InfiniteLoaderComponent>`,
      },
    },
  },
};

export const TableLayout: Story = {
  args: {
    viewAs: "table" as TViewAs,
    itemCount: 100,
    itemSize: 48,
    hasMoreFiles: true,
    columnStorageName: TABLE_COLUMNS_KEY,
    columnInfoPanelStorageName: TABLE_COLUMNS_KEY,
    loadMoreItems: fn(),
  },
  render: (args) => {
    saveTableColumns();
    return <InfiniteLoaderDemo {...args} renderItem={renderTableRow} />;
  },
  parameters: {
    docs: {
      description: {
        story:
          'A table whose rows share one column layout (`viewAs="table"`). The layout is not passed as a prop: the loader reads it from `localStorage` under the key it is given (`columnStorageName`, or `columnInfoPanelStorageName` while `infoPanelVisible` is set), which lets the table header that saves the widths and the rows below stay in step. The rows not loaded yet show the table skeleton.',
      },
      source: {
        code: `localStorage.setItem("filesColumns", "2fr 1fr 1fr");

<InfiniteLoaderComponent
  viewAs="table"
  itemCount={100}
  filesLength={loadedItems.length}
  hasMoreFiles={hasMore}
  loadMoreItems={handleLoadMore}
  itemSize={48}
  columnStorageName="filesColumns"
  columnInfoPanelStorageName="filesColumnsInfoPanel"
>
  {rows.map((file) => (
    <>
      <div>{file.title}</div>
      <div>{file.modified}</div>
      <div>{file.size}</div>
    </>
  ))}
</InfiniteLoaderComponent>`,
      },
    },
  },
};

const renderRtlItem = (index: number) => (
  <div
    style={{
      padding: "8px",
      border: "1px solid #eee",
      margin: "4px",
      borderRadius: "4px",
    }}
  >
    {`\u0645\u0644\u0641 ${index + 1}`}
  </div>
);

export const RightToLeft: Story = {
  args: {
    viewAs: "row" as TViewAs,
    itemCount: 100,
    itemSize: 48,
    hasMoreFiles: true,
    loadMoreItems: fn(),
  },
  globals: { direction: "rtl" },
  render: (args) => (
    <div dir="rtl">
      <InfiniteLoaderDemo {...args} renderItem={renderRtlItem} />
    </div>
  ),
  parameters: {
    noPadding: true,
    docs: {
      description: {
        story:
          "The row layout in a right-to-left interface: the text of each row starts at the right edge of the row instead of the left.",
      },
      source: {
        code: `<div dir="rtl">
  <InfiniteLoaderComponent viewAs="row" itemSize={48} {...props}>
    {items}
  </InfiniteLoaderComponent>
</div>`,
      },
      // Framed so the RTL direction it stamps on <html> stays out of the Docs page
      story: { inline: false, height: "326px" },
    },
  },
};

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
| \`--infinite-loader-tile-gap\` | Gap between the skeleton tiles a tile row shows while a scroll jump of more than 800px settles; on tablet and smaller screens the gap is fixed at 14px | \`14px 16px\` |
| \`--infinite-loader-tile-min-size\` | Smallest width of those skeleton tiles | \`216px\` |
| \`--infinite-loader-tile-max-size\` | Largest width of those skeleton tiles | \`360px\` |
| \`--infinite-loader-list-width\` | Width of the list in the \`row\` and \`table\` layouts, in place of the measured container width (row and table layouts only, not shown here) | — |
| \`--infinite-loader-table-width\` | Set by the list itself to the measured container width in the \`row\` and \`table\` layouts; a value set from outside is overwritten, so use \`--infinite-loader-list-width\` | measured width |

The tile demo below sets the three tile variables. They size only the skeleton tiles, which appear for a moment when the box is scrolled by more than 800px at once — drag the scrollbar quickly to see them.`,
      },
      source: {
        code: `<div
  style={{
    "--infinite-loader-tile-gap": "20px 24px",
    "--infinite-loader-tile-min-size": "180px",
    "--infinite-loader-tile-max-size": "280px",
  }}
>
  <InfiniteLoaderComponent viewAs="tile" countTilesInRow={4} {...props}>
    {items}
  </InfiniteLoaderComponent>
</div>`,
      },
    },
  },
};
