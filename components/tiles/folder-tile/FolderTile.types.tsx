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
  /** Folder data object */
  item: FolderItem;
  /** Indicates if the folder is selected */
  checked?: boolean;
  /** Flag to show hotkey border */
  showHotkeyBorder?: boolean;
  /** Indicates if folder is in progress state */
  inProgress?: boolean;
  /** Callback when folder is selected */
  onSelect?: (checked: boolean, item: FolderItem) => void;
  /** Callback when thumbnail is clicked */
  thumbnailClick?: (e: React.MouseEvent) => void;
  /** Function to get context menu model */
  getContextModel?: () => ContextMenuModel[];
  /** Function to set selected items */
  setSelection?: (items: FolderItem[]) => void;
  /** Handler for Ctrl + Click selection */
  withCtrlSelect?: (item: FolderItem) => void;
  /** Handler for Shift + Click selection */
  withShiftSelect?: (item: FolderItem) => void;
  /** Additional React element */
  element?: React.ReactNode;
  /** Child elements */
  children?: React.ReactNode;
  /** Callback to hide context menu */
  hideContextMenu?: () => void;
  /** Custom header for context menu */
  contextMenuHeader?: React.ReactNode;
  /** Callback when context menu is clicked */
  tileContextClick?: (isRightClick?: boolean) => void;
  /** Folder badges */
  badges?: React.ReactNode;
  /** Context menu options */
  contextOptions: ContextMenuModel[];
  /** Checkbox indeterminate state flag */
  indeterminate?: boolean;
  /** Indicates if folder is being dragged */
  isDragging?: boolean;
  /** Alternative flag for drag state */
  dragging?: boolean;
  /** Indicates if folder is in active state */
  isActive?: boolean;
  /** Flag for edit mode */
  isEdit?: boolean;
  forwardRef?: React.RefObject<HTMLDivElement | null>;
  /** The temporary icon to display when thumbnail is not available */
  temporaryIcon?: string | React.ReactElement;
  isBigFolder?: boolean;
  /** Data test id for the tile */
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
