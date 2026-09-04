import { ContextMenuModel } from "../../context-menu";
import { TileItem } from "../tile-container/TileContainer.types";

export interface TemplateItem extends TileItem {
  title: string;
  createdBy?: {
    displayName: string;
    id: string;
  };
  security?: {
    EditRoom?: boolean;
    [key: string]: boolean | undefined;
  };
  logo?: {
    small?: string;
    color?: string;
    cover?: string;
  };
}

export type SpaceQuotaProps = {
  item: TemplateItem;
  type: string;
  isReadOnly?: boolean;
  className?: string;
};

export type TemplateTileProps = {
  /** Indicates if the room is selected */
  checked?: boolean;
  /** Indicates if the room is in active state */
  isActive?: boolean;
  /** Indicates if the room is in a blocking operation state */
  isBlockingOperation?: boolean;
  /** Template data object */
  item: TemplateItem;
  /** Callback when template is selected */
  onSelect?: (checked: boolean, item: TemplateItem) => void;
  /** Callback when thumbnail is clicked */
  thumbnailClick?: (e: React.MouseEvent) => void;
  /** Function to get context menu model */
  getContextModel?: () => ContextMenuModel[];
  /** Child elements */
  children?: React.ReactNode;
  /** Checkbox indeterminate state flag */
  indeterminate?: boolean;
  /** Additional React element */
  element?: React.ReactNode;
  /** Context menu options */
  contextOptions: ContextMenuModel[];
  /** Callback when context menu is clicked */
  tileContextClick?: () => void;
  /** Callback to hide context menu */
  hideContextMenu?: () => void;
  /** Number of columns in the grid */
  columnCount: number;
  /** Room badges */
  badges?: React.ReactNode;
  /** Indicates if room is in progress state */
  inProgress?: boolean;
  /** Flag to show hotkey border */
  showHotkeyBorder?: boolean;
  /** Flag for edit mode */
  isEdit?: boolean;
  showStorageInfo?: boolean;
  openUser: () => void;
  SpaceQuotaComponent?: React.ComponentType<SpaceQuotaProps>;
};
