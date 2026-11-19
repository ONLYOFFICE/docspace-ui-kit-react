import type { CSSProperties, ComponentProps, ReactNode } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, fn, waitFor } from "storybook/test";

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
    // The Docs page is README.md, rendered by .storybook/blocks/DocsPage.tsx;
    // there is no second description to keep in step with it.
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
        "Which layout to render: `tile` is a grid of tile rows, every other value a list. It also picks the skeleton: `row` and `table` have one, the rest none.",
    },
    hasMoreFiles: {
      control: "boolean",
      description:
        "Whether there is another page to ask for. While false, every row counts as loaded.",
    },
    filesLength: {
      control: "number",
      description: "How many items are loaded so far.",
    },
    itemCount: {
      control: "number",
      description: "How many items there are in total, loaded or not.",
    },
    loadMoreItems: {
      control: false,
      description:
        "Called with the start and stop index to load when the user scrolls near the end.",
    },
    itemSize: {
      control: "number",
      description:
        "Height of every row in pixels, in the list layouts. The `tile` layout ignores it and sizes each row from the tile it holds.",
    },
    children: {
      control: false,
      description:
        "The items, as an array: one entry per list row, table row or row of tiles.",
    },
    onScroll: {
      control: false,
      description: "Called as the list scrolls.",
    },
    isLoading: {
      control: "boolean",
      description:
        "Renders nothing at all while it is true, so the region collapses.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    countTilesInRow: {
      control: "number",
      description:
        "How many tiles one row of the `tile` layout holds. It decides which rows count as loaded, and how many skeleton tiles a row shows.",
      table: {
        defaultValue: { summary: "1" },
      },
    },
    columnStorageName: {
      control: "text",
      description:
        "`localStorage` key of the table's column widths. The `table` layout throws without it.",
    },
    columnInfoPanelStorageName: {
      control: "text",
      description:
        "The key read instead while `infoPanelVisible` is set. The `table` layout throws without it.",
    },
    infoPanelVisible: {
      control: "boolean",
      description:
        "Reads the table's column widths from `columnInfoPanelStorageName` instead.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    className: {
      control: "text",
      description: "Applied to the list element.",
    },
    currentFolderId: {
      control: "text",
      description:
        "Identifier of the folder shown. When it changes, the `tile` layout measures its rows again.",
    },
    showSkeleton: {
      control: false,
      description:
        "Ignored: the loader sets it itself after a scroll jump of more than 800px.",
    },
    scrollElement: {
      control: false,
      description:
        "The element that scrolls the list. Without it the loader looks for the portal's scroller, then falls back to the window.",
    },
    smallPreview: {
      control: false,
      description: "Declared, but no layout reads it.",
    },
    isOneTile: {
      control: false,
      description: "Declared, but no layout reads it.",
    },
  },
} satisfies Meta<typeof InfiniteLoaderComponent>;

type Story = StoryObj<ComponentProps<typeof InfiniteLoaderComponent>>;

export default meta;

// The loader listens to this element, found by the portal's own ids.
const getScroller = () =>
  document.querySelector(
    "#sectionScroll .scroll-wrapper > .scroller",
  ) as HTMLElement;

// Scrolls to the end of what is loaded and waits for the next page to be
// asked for, then for its first item to arrive.
const expectLoadsMore = async (
  loadMoreItems: unknown,
  findText: (text: string) => Promise<HTMLElement>,
  nextItem: string,
) => {
  const scroller = getScroller();
  await waitFor(() => {
    scroller.scrollTop = scroller.scrollHeight;
    scroller.dispatchEvent(new Event("scroll"));
    expect(loadMoreItems).toHaveBeenCalled();
  });
  await expect(await findText(nextItem)).toBeInTheDocument();
};

export const Default: Story = {
  name: "Loads the next page",
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
  play: async ({ args, canvas }) => {
    await expect(await canvas.findByText("Item 1")).toBeVisible();
    // Near the end of the loaded rows the next range is asked for.
    await expectLoadsMore(
      args.loadMoreItems,
      (text) => canvas.findByText(text, {}, { timeout: 3000 }),
      "Item 21",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "A scrolling box with the first page of a 100-item list. Near the end of the loaded items the loader asks for the next range (`loadMoreItems`), which arrives half a second later. Each plain box stands in for a row of tiles.",
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
  name: "Rows",
  args: {
    viewAs: "row" as TViewAs,
    itemCount: 100,
    itemSize: 48,
    hasMoreFiles: true,
    loadMoreItems: fn(),
  },
  render: (args) => <InfiniteLoaderDemo {...args} />,
  play: async ({ args, canvas }) => {
    // Every row has the height given by itemSize.
    const first = await canvas.findByText("Item 1");
    const row = first.closest('[style*="height: 48px"]');
    await expect(row).not.toBeNull();

    await expectLoadsMore(
      args.loadMoreItems,
      (text) => canvas.findByText(text, {}, { timeout: 3000 }),
      "Item 21",
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'A list of rows of one height (`viewAs="row"`, `itemSize`). Past the last loaded item the rows are skeletons until the next page arrives. A jump of more than 800px turns the rows in view into skeletons briefly.',
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
  name: "Table rows",
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
  play: async ({ canvas }) => {
    // The rows take their column layout from localStorage.
    const cell = await canvas.findByText("Document 1");
    const row = cell.parentElement as HTMLElement;
    await expect(
      getComputedStyle(row).gridTemplateColumns.split(" "),
    ).toHaveLength(3);
  },
  parameters: {
    docs: {
      description: {
        story:
          'A table whose rows share one three-column layout (`viewAs="table"`). The loader reads that layout from `localStorage` under `columnStorageName`, where the table header saves its widths. Rows not loaded yet show the table skeleton.',
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
  name: "Right to left",
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
  play: async ({ canvas, canvasElement }) => {
    const item = await canvas.findByText("ملف 1");
    await expect(getComputedStyle(item).direction).toBe("rtl");

    // The skeletons of the next page line up with the right edge too.
    const scroller = getScroller();
    scroller.scrollTop = scroller.scrollHeight;
    scroller.dispatchEvent(new Event("scroll"));
    const skeleton = await waitFor(() => {
      const found = canvasElement.querySelector<HTMLElement>(".row-loader");
      if (!found) throw new Error("No row skeleton yet");
      return found;
    });
    const list = skeleton.parentElement as HTMLElement;
    await expect(Math.round(skeleton.getBoundingClientRect().right)).toBe(
      Math.round(list.getBoundingClientRect().right),
    );
  },
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
  name: "CSS variables",
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
  play: async ({ canvas }) => {
    await expect(await canvas.findByText("Item 1")).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story: `The tile layout under a wrapper that sets the three tile variables. They size only the skeleton tiles, which appear for a moment after a scroll jump of more than 800px.`,
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
