import type { TileItem } from "../tile-container/TileContainer.types";
import { ContextMenuModel } from "../../context-menu/ContextMenu.types";

export type BaseTileProps = {
  /** Whether the tile is selected. It ticks the checkbox and keeps it visible when the pointer leaves. */
  checked?: boolean;
  /** Whether the tile is the one being acted on, which keeps its hover background. */
  isActive?: boolean;
  /** Dims the tile while an operation is running over it. It blocks nothing by itself. */
  isBlockingOperation?: boolean;
  /** The item this tile stands for. It is also what `onSelect` is called with, and the fallback source of the context menu's header. */
  item: TileItem;
  /** Called with the new checked state and the `item` when the checkbox changes, or when the icon is tapped on a screen narrower than 600px. */
  onSelect?: (checked: boolean, item: TileItem) => void;
  /** Ignored. Nothing in this component reads it; put the handler on `onRoomClick` or on your own `topContent`. */
  thumbnailClick?: (e: React.MouseEvent) => void;
  /** Builds the menu shown on right-click. Without it the right-click menu never opens, whatever `contextOptions` holds. */
  getContextModel?: () => ContextMenuModel[];
  /** Draws the checkbox in its indeterminate state. */
  indeterminate?: boolean;
  /** The icon in the corner. Without it neither the icon nor the checkbox is rendered at all. */
  element?: React.ReactNode;
  /** The menu's entries. Required — but the three-dot button appears only when `item` also carries a `contextOptions` key of its own. */
  contextOptions: ContextMenuModel[];
  /** Called before the menu opens, with `true` when the trigger was a right-click. It is the hook for building the options lazily. */
  tileContextClick?: (isRightClick?: boolean) => void;
  /** Called when the menu closes. */
  hideContextMenu?: () => void;
  /** Replaces the icon and the checkbox with the kit's track loader. */
  inProgress?: boolean;
  /** Draws the accent outline that marks the tile the keyboard is on. */
  showHotkeyBorder?: boolean;
  /** Renaming state: it removes the icon and the checkbox and leaves `topContent` the whole row. */
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
  /** A ref the component clicks on a right-click when the menu is not mounted yet. It is not attached to anything here. */
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
