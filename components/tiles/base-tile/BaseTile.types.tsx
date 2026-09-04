import type { TileItem } from "../tile-container/TileContainer.types";
import { ContextMenuModel } from "../../context-menu/ContextMenu.types";

export type BaseTileProps = {
  /** Indicates if the room is selected */
  checked?: boolean;
  /** Indicates if the room is in active state */
  isActive?: boolean;
  /** Indicates if the room is in a blocking operation state */
  isBlockingOperation?: boolean;
  /** Room data object */
  item: TileItem;
  /** Callback when room is selected */
  onSelect?: (checked: boolean, item: TileItem) => void;
  /** Callback when thumbnail is clicked */
  thumbnailClick?: (e: React.MouseEvent) => void;
  /** Function to get context menu model */
  getContextModel?: () => ContextMenuModel[];
  /** Checkbox indeterminate state flag */
  indeterminate?: boolean;
  /** Additional React element */
  element?: React.ReactNode;
  /** Context menu options */
  contextOptions: ContextMenuModel[];
  /** Callback when context menu is clicked */
  tileContextClick?: (isRightClick?: boolean) => void;
  /** Callback to hide context menu */
  hideContextMenu?: () => void;
  /** Indicates if room is in progress state */
  inProgress?: boolean;
  /** Flag to show hotkey border */
  showHotkeyBorder?: boolean;
  /** Flag for edit mode */
  isEdit?: boolean;
  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  onHover?: () => void;
  onLeave?: () => void;
  className?: string;
  onRoomClick?: (e: React.MouseEvent) => void;
  checkboxContainerRef?: React.RefObject<HTMLDivElement | null>;
  forwardRef?: React.RefObject<HTMLDivElement | null>;
  /** Data test id for the tile */
  dataTestId?: string;
  badgeUrl?: string;
};

export type ItemProps = {
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

export type TileChildProps = {
  item: ItemProps;
};
