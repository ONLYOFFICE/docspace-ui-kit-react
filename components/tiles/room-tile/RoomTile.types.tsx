import type { TFunction } from "i18next";
import { ContextMenuModel } from "../../context-menu/ContextMenu.types";
import type { TagClickEvent, TagType } from "../../tag";
import { TileItem } from "../tile-container/TileContainer.types";

export interface RoomItem extends TileItem {
  title: string;
  roomType: string;
  providerType?: string;
  providerKey?: string;
  thirdPartyIcon?: string;
  tags?: Array<TagType | string>;
  contextOptions?: ContextMenuModel[];
  logo?: {
    small?: string;
    color?: string;
    cover?: string;
  };
  isAIAgent?: boolean;
}

export interface SelectOption {
  option: "typeProvider" | "defaultTypeRoom";
  value: string;
}

export type RoomTileProps = {
  /** Indicates if the room is selected */
  checked?: boolean;
  /** Indicates if the room is in active state */
  isActive?: boolean;
  /** Indicates if the room is in a blocking operation state */
  isBlockingOperation?: boolean;
  /** Room data object */
  item: RoomItem;
  /** Callback when room is selected */
  onSelect?: (checked: boolean, item: RoomItem) => void;
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
  /** Column count for tags layout */
  columnCount: number;
  /** Callback for tag selection */
  selectTag: (tag: TagClickEvent) => void;
  /** Callback for option selection */
  selectOption: (option: SelectOption) => void;
  /** Function to get room type name */
  getRoomTypeName: (
    type: string,
    t:
      | TFunction
      | ((
          key: string,
          interpolation?: Record<string, string | number>,
        ) => string),
  ) => string;
  /** Room badges */
  badges?: React.ReactNode;
  /** Indicates if room is in progress state */
  inProgress?: boolean;
  /** Flag to show hotkey border */
  showHotkeyBorder?: boolean;
  /** Flag for edit mode */
  isEdit?: boolean;
  /** Data test id for the tile */
  dataTestId?: string;

  customBottomContent?: (
    isHovered: boolean,
    tags: Array<TagType | string>,
  ) => React.ReactNode;
};
