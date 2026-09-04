import type { TViewAs } from "../../types";

export type TOnMove = {
  added: Element[];
  removed: Element[];
  clear?: boolean;
};

export type TArrayTypes = {
  type: string;
  rowGap?: number;
  itemHeight: number;
  countOfMissingTiles?: number;
  rowCount?: number;
};

export type SelectionAreaProps = {
  /** Class name for the container element */
  containerClass: string;
  /** Class name for selectable elements */
  selectableClass: string;
  /** Callback function when selection changes */
  onMove?: ({ added, removed, clear }: TOnMove) => void;
  /** Class name for scrollable container */
  scrollClass: string;
  /** View type */
  viewAs: TViewAs;
  /** Class name for items container */
  itemsContainerClass: string;
  /** Flag indicating if this is for rooms */
  isRooms?: boolean;
  /** Height of folder header */
  folderHeaderHeight?: number;
  /** Array type configuration */
  arrayTypes?: TArrayTypes[];
  /** Class name for item elements */
  itemClass: string;
  /** Number of tiles in a row */
  countTilesInRow?: number;
  /** Default height of header */
  defaultHeaderHeight?: number;
  /** Callback function for mouse down event */
  onMouseDown?: (event: MouseEvent) => void;
};
