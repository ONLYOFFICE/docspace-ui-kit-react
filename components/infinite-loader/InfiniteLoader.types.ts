import { IndexRange } from "react-virtualized";
import { TViewAs } from "../../types";

/** The one `aria-*` attribute react-virtualized forwards to its grid. */
export type InfiniteLoaderAriaProps = Pick<React.AriaAttributes, "aria-label">;

export type InfiniteLoaderProps = InfiniteLoaderAriaProps & {
  /**
   * Which layout to render: `tile` is a grid of tile rows, every other value a
   * list. It also picks the skeleton: `row` and `table` have one, the rest none.
   */
  viewAs: TViewAs;
  /** Whether there is another page to ask for. While false, every row counts as loaded. */
  hasMoreFiles: boolean;
  /** How many items are loaded so far. */
  filesLength: number;
  /** How many items there are in total, loaded or not. */
  itemCount: number;
  /** Called with the start and stop index to load when the user scrolls near the end. */
  loadMoreItems: (params: IndexRange) => Promise<void>;
  /**
   * Height of every row in pixels, in the list layouts. The `tile` layout
   * ignores it and sizes each row from the tile it holds.
   */
  itemSize: number;
  /** The items, as an array: one entry per list row, table row or row of tiles. */
  children: React.ReactNode[];
  /** Called as the list scrolls. */
  onScroll?: () => void;
  /** Renders nothing at all while it is true, so the region collapses. */
  isLoading?: boolean;
  /** `localStorage` key of the table's column widths. The `table` layout throws without it. */
  columnStorageName?: string;
  /** The key read instead while `infoPanelVisible` is set. The `table` layout throws without it. */
  columnInfoPanelStorageName?: string;
  /** Applied to the list element. */
  className?: string;
  /** Reads the table's column widths from `columnInfoPanelStorageName` instead. */
  infoPanelVisible?: boolean;
  /**
   * How many tiles one row of the `tile` layout holds. It decides which rows
   * count as loaded, and how many skeleton tiles a row shows.
   * @default 1
   */
  countTilesInRow?: number;
  /** Ignored: the loader sets it itself after a scroll jump of more than 800px. */
  showSkeleton?: boolean;
  /**
   * The element that scrolls the list. Without it the loader looks for the
   * portal's scroller, then falls back to the window.
   */
  scrollElement?: Element | null;
  /** Identifier of the folder shown. When it changes, the `tile` layout measures its rows again. */
  currentFolderId?: string | number;
  /** Declared, but no layout reads it. */
  smallPreview?: boolean;
  /** Declared, but no layout reads it. */
  isOneTile?: boolean;
};

export type ListComponentProps = InfiniteLoaderProps & {
  /** The element the list watches for scrolling, resolved by the loader. */
  scroll: Element | (Window & typeof globalThis);
};
