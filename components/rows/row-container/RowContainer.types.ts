import { IndexRange } from "react-virtualized";

export type RowContainerProps = {
  /**
   * Height of one row in pixels, which the virtualised list uses for every row
   * alike. A row that is taller is clipped.
   * @default 50
   */
  itemHeight?: number;
  /**
   * Height of the container as a CSS length. Without it the container is 100%
   * of its parent, which has to have a height of its own.
   */
  manualHeight?: string;
  /** The rows. It must be an array, one entry per row. */
  children: React.ReactNode[];
  /**
   * Whether the rows are virtualised and paged in as the user scrolls. Turn it
   * off for a short list: the virtual list needs the portal's own scroll
   * container and measures its width by a literal element id.
   * @default true
   */
  useReactWindow?: boolean;
  /** Applied to the container. */
  className?: string;
  /**
   * Id of the container. The virtual list finds the container by the literal id
   * `rowContainer` to measure its width, so changing this — or rendering two
   * containers — leaves the rows with a width of zero.
   * @default "rowContainer"
   */
  id?: string;
  /** Applied to the container. */
  style?: React.CSSProperties;
  /** Sets a callback function that is called when the list scroll positions change */
  onScroll?: () => void;
  /** How many rows are loaded so far. Read by the virtual list only. */
  filesLength?: number;
  /** How many rows there are in total. Read by the virtual list only. */
  itemCount?: number;
  /** Called with the range to load when the user scrolls near the end. */
  fetchMoreFiles?: (params: IndexRange) => Promise<void>;
  /** Whether there is another page to ask for. */
  hasMoreFiles?: boolean;
  /** Disables text selection, which is on by default inside the container. */
  noSelect?: boolean;
};
