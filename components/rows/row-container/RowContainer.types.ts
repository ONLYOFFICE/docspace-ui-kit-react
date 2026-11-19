import { IndexRange } from "react-virtualized";

export type RowContainerProps = {
  /**
   * Height of one row in pixels, which the virtualised list uses for every row
   * alike. A taller row gets no more room.
   * @default 50
   */
  itemHeight?: number;
  /**
   * Height of the container as a CSS length while `useReactWindow` is on.
   * Without it the container takes its parent's full height. With
   * virtualisation off it does nothing.
   */
  manualHeight?: string;
  /** The rows. It must be an array, one entry per row. */
  children: React.ReactNode[];
  /**
   * Whether the rows are virtualised and paged in as the user scrolls. Turn it
   * off outside the portal, whose scroll element the virtual list follows.
   * @default true
   */
  useReactWindow?: boolean;
  /** Applied to the container. */
  className?: string;
  /**
   * Id of the container element.
   * @default "rowContainer"
   */
  id?: string;
  /** Applied to the container. */
  style?: React.CSSProperties;
  /** Called as the virtual list scrolls. Never called with virtualisation off. */
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
