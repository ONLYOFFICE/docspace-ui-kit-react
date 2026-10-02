import { IndexRange } from "react-virtualized";
import { TViewAs } from "../../types";

export type InfiniteLoaderProps = {
  /**
   * Which layout to render: `tile` lays the children out in a grid, anything
   * else in a list. It also picks the skeleton shown while a page loads —
   * `table` and `row` have one, the rest show nothing.
   */
  viewAs: TViewAs;
  /** Whether there is another page to ask for. */
  hasMoreFiles: boolean;
  /** How many items are loaded so far. */
  filesLength: number;
  /** How many items there are in total, loaded or not. */
  itemCount: number;
  /** Called with the range to load when the user scrolls near the end. */
  loadMoreItems: (params: IndexRange) => Promise<void>;
  /** Height of one row, or of one tile, in pixels. It is the same for all of them. */
  itemSize: number;
  /** The items. It must be an array, one entry per row or tile. */
  children: React.ReactNode[];
  /** Called as the list scrolls. */
  onScroll?: () => void;
  /** Renders nothing at all while it is true. */
  isLoading?: boolean;
  /** `localStorage` key of the table's column widths, for the table skeleton. */
  columnStorageName?: string;
  /** The info-panel variant of that key. */
  columnInfoPanelStorageName?: string;
  /** Applied to the list element. */
  className?: string;
  /** Narrows the layout for an open info panel. */
  infoPanelVisible?: boolean;
  /** How many tiles fit on a row, in the `tile` layout. */
  countTilesInRow?: number;
  /** Ignored by the list; the loader sets it itself after a long jump. */
  showSkeleton?: boolean;
  /** Identifier of the folder being shown, which resets the grid when it changes. */
  currentFolderId?: string | number;
  /** Renders the tiles in their small form. */
  smallPreview?: boolean;
  /** Lays a single tile out on its own row. */
  isOneTile?: boolean;
};

export type ListComponentProps = InfiniteLoaderProps & {
  /** The element the list watches for scrolling, resolved by the loader. */
  scroll: Element | (Window & typeof globalThis);
};
