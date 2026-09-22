import { ContextMenuModel } from "../../context-menu/ContextMenu.types";
import { TileItem } from "../tile-container/TileContainer.types";

export interface FolderItem extends TileItem {
  title: string;
  contextOptions?: string[];
  logo?: {
    small?: string;
    color?: string;
    cover?: string;
  };
}

export type FolderTileProps = {
  /** The folder this tile stands for. Its `contextOptions` key — present or absent — is what decides whether the three-dot button appears. */
  item: FolderItem;
  /** Whether the tile is selected. */
  checked?: boolean;
  /** Draws the accent outline that marks the tile the keyboard is on. */
  showHotkeyBorder?: boolean;
  /** Replaces the icon and the checkbox with the kit's track loader. */
  inProgress?: boolean;
  /** Called with the new checked state and the `item` — from the checkbox, from a plain click on the tile, and from a tap on the icon below 600px. */
  onSelect?: (checked: boolean, item: FolderItem) => void;
  /** Ignored. Nothing reads it, and the component forwards no unknown props, so it never reaches the DOM either. */
  thumbnailClick?: (e: React.MouseEvent) => void;
  /** Builds the menu shown on right-click. Without it the right-click menu never opens. */
  getContextModel?: () => ContextMenuModel[];
  /** Called with an empty array before a plain click selects the tile, unless the click landed on an image, an input or an SVG shape. */
  setSelection?: (items: FolderItem[]) => void;
  /** Called with the `item` on a Ctrl- or Cmd-click, instead of selecting. */
  withCtrlSelect?: (item: FolderItem) => void;
  /** Called with the `item` on a Shift-click, instead of selecting. */
  withShiftSelect?: (item: FolderItem) => void;
  /** The icon beside the checkbox. Without it neither the icon nor the checkbox is rendered at all. */
  element?: React.ReactNode;
  /** The tile's content. Only the first element is rendered; the rest are dropped. */
  children?: React.ReactNode;
  /** Called when the menu closes. */
  hideContextMenu?: () => void;
  /** Ignored. The header is built from the first child's `item`; nothing reads this prop. */
  contextMenuHeader?: React.ReactNode;
  /** Called before the menu opens, with `true` when the trigger was a right-click. */
  tileContextClick?: (isRightClick?: boolean) => void;
  /** Badges for the folder. In the tall layout they sit over the thumbnail; in the short one they follow the content. */
  badges?: React.ReactNode;
  /** The menu's entries. Required — but see `item`. */
  contextOptions: ContextMenuModel[];
  /** Draws the checkbox in its indeterminate state. */
  indeterminate?: boolean;
  /** Dims the tile while it is being dragged. */
  isDragging?: boolean;
  /** Ignored. `isDragging` is the one that is read. */
  dragging?: boolean;
  /** Whether the tile is the one being acted on, which keeps its hover state. */
  isActive?: boolean;
  /** Renaming state: it removes the icon and the checkbox. */
  isEdit?: boolean;
  /** Attached to the outer element, and clicked by the component itself on a right-click before the menu is mounted. */
  forwardRef?: React.RefObject<HTMLDivElement | null>;
  /** The folder's picture, drawn only in the tall layout: a URL is fetched as an SVG, an element is rendered as given. */
  temporaryIcon?: string | React.ReactElement;
  /** Switches to the tall layout — a picture on top and the row below it — instead of the single row. */
  isBigFolder?: boolean;
  /** Value of `data-testid` on the outer element.
   * @default "tile" */
  dataTestId?: string;
};

export type FolderChildProps = {
  item: {
    title?: string;
    icon?: string;
    logo?: {
      original?: string;
      large?: string;
      medium?: string;
      small?: string;
      color?: string;
      cover?: string | { data: string; id: string };
    };
    displayName?: string;
  };
};
