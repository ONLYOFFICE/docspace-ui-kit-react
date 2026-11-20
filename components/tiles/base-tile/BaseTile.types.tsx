import type { TileItem } from "../tile-container/TileContainer.types";
import { ContextMenuModel } from "../../context-menu/ContextMenu.types";

export type BaseTileProps = React.AriaAttributes & {
  /** Ticks the checkbox, shows it in place of the icon and tints the tile. The tile holds no state; pass back what `onSelect` reports. */
  checked?: boolean;
  /** Keeps the hover tint on the tile being acted on, after the pointer leaves it. */
  isActive?: boolean;
  /** Stops hover, clicks and right-clicks reaching the tile while an operation runs over it. The tile looks the same. */
  isBlockingOperation?: boolean;
  /** The item this tile stands for. It is also what `onSelect` is called with, and the fallback source of the context menu's header. */
  item: TileItem;
  /** Called with the new checked state and the `item`, from the checkbox. A tap on the icon calls it too, in a window 600px wide or narrower. */
  onSelect?: (checked: boolean, item: TileItem) => void;
  /** Ignored. Nothing in this component reads it; put the handler on `onRoomClick` or on your own `topContent`. */
  thumbnailClick?: (e: React.MouseEvent) => void;
  /** Builds the menu that the three-dot button and a right-click open. Without it neither opens a menu, whatever `contextOptions` holds. */
  getContextModel?: () => ContextMenuModel[];
  /** Draws the checkbox in its indeterminate state. */
  indeterminate?: boolean;
  /** The icon in the corner. Without it neither the icon nor the checkbox is rendered at all. */
  element?: React.ReactNode;
  /** Draws the three-dot button when non-empty and `item` carries a `contextOptions` key. The menu lists `getContextModel`'s entries, not these. */
  contextOptions: ContextMenuModel[];
  /** Called before the menu opens, with `true` when the trigger was a right-click. */
  tileContextClick?: (isRightClick?: boolean) => void;
  /** Called when the menu closes. */
  hideContextMenu?: () => void;
  /** Replaces the icon and the checkbox with the kit's track loader. */
  inProgress?: boolean;
  /** Draws the accent outline that marks the tile the keyboard is on. */
  showHotkeyBorder?: boolean;
  /** Renaming state: removes the icon, the checkbox and the hover tint, so `topContent` gets the whole row. */
  isEdit?: boolean;
  /** The upper half of the tile. Its first child is read for a nested `item`, which then takes over the context menu's header. */
  topContent?: React.ReactNode;
  /** The lower half of the tile — where the room tile puts its tags. */
  bottomContent?: React.ReactNode;
  /** Called when the pointer enters the tile. */
  onHover?: () => void;
  /** Called when the pointer leaves the tile. */
  onLeave?: () => void;
  /** Added after the component's own classes on the outer element. */
  className?: string;
  /** Called with the event on any click on the tile. It is the tile's `onClick`, not a room-specific one. */
  onRoomClick?: (e: React.MouseEvent) => void;
  /** Attached to the element holding the icon and the checkbox, so a wrapper can tell clicks on it apart. */
  checkboxContainerRef?: React.RefObject<HTMLDivElement | null>;
  /** A ref the component clicks on a right-click, before the menu is mounted. It is not attached to anything here. */
  forwardRef?: React.RefObject<HTMLDivElement | null>;
  /** Value of `data-testid` on the outer element.
   * @default "tile" */
  dataTestId?: string;
  /** Passed to the context menu, for the badge it draws in its header. */
  badgeUrl?: string;
};

/** The subset of an item the context menu's header is built from. */
export type BaseTileItemProps = {
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

/** What the tile looks for on the first child of `topContent`. */
export type TileChildProps = {
  item: BaseTileItemProps;
};
