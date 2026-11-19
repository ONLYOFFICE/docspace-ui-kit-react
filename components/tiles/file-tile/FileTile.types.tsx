import { ReactElement } from "react";

import { ContextMenuModel } from "../../context-menu/ContextMenu.types";

import type { FileType } from "../../../enums";
import { TileItem } from "../tile-container/TileContainer.types";

export interface FileItem extends TileItem {
  title: string;
  contextOptions?: string[];
  logo?: {
    small?: string;
    color?: string;
    cover?: string;
  };
}

export type FileItemType = {
  /** Unique identifier for the file, used as the React key by `TileContainer`. */
  id: string | number;
  /** Name of the file. */
  title: string;
  /** Extension, with the dot. `TileContainer` reads it to keep the tile out of the folders group. */
  fileExst?: string;
  /** Kind of file. Nothing in the tile reads it; it is here for the caller's own logic. */
  fileType?: FileType;
  /** Marks the file as coming from a plugin, which makes `fileTileIcon` win over `temporaryIcon`. A thumbnail still wins over both. */
  isPlugin?: boolean;
  /** URL of an icon drawn in place of `temporaryIcon`, for a plugin file. */
  fileTileIcon?: string;
  /** Logo of the file, passed to the context menu's header. */
  logo?: {
    original?: string;
    large?: string;
    medium?: string;
    small?: string;
    color?: string;
    cover?: string;
  };
  /** Whether the file can be previewed. Only the fact that either flag is on is read, to widen the thumbnail area. */
  viewAccessibility?: {
    ImageView: boolean;
    MediaView: boolean;
  };
  /** Its presence — not its contents — is what makes the three-dot button appear. */
  contextOptions?: string[];
};

export type FileTileProps = {
  /** Ticks the checkbox, shows it in place of the icon and tints the whole tile. The tile holds no state; pass back what `onSelect` reports. */
  checked?: boolean;
  /** The tile's content. Only the first element is rendered, in the row beside the icon; the rest are dropped. */
  children?: ReactElement | ReactElement[];
  /** Ignored. Nothing reads it. */
  contextButtonSpacerWidth?: number;
  /** Draws the three-dot button when non-empty and `item` carries a `contextOptions` key. The menu lists `getContextModel`'s entries, not these. */
  contextOptions: ContextMenuModel[];
  /** Replaces the icon and the checkbox with the kit's track loader. */
  inProgress?: boolean;
  /** The file the tile stands for, passed back through the callbacks. A `contextOptions` key on it is what draws the three-dot button. */
  item: FileItemType;
  /** Called with the new checked state and the `item`, from the checkbox or a plain click. A tap on the icon calls it too, in a window 600px wide or narrower. */
  onSelect?: (checked: boolean, item: FileItemType) => void;
  /** Called with the event when the thumbnail area is clicked. The tile's own click handler runs as well. */
  thumbnailClick?: (e: React.MouseEvent) => void;
  /** Address of the preview image. When it fails to load, the tile draws a plugin's `fileTileIcon` or `temporaryIcon` instead. */
  thumbnail?: string;
  /** Drawn when there is no `thumbnail`: a URL is fetched as an SVG, an element is rendered as given. */
  temporaryIcon?: string | ReactElement;
  /** Called with the `item` on a Ctrl- or Cmd-click, instead of selecting. */
  withCtrlSelect?: (item: FileItemType) => void;
  /** Called with the `item` on a Shift-click, instead of selecting. */
  withShiftSelect?: (item: FileItemType) => void;
  /** The icon beside the checkbox. Without it neither the icon nor the checkbox is rendered at all. */
  element?: ReactElement;
  /** Called before the menu opens, with `true` when the trigger was a right-click. */
  tileContextClick?: (isRightClick?: boolean) => void;
  /** Builds the menu that the three-dot button and a right-click open. Without it neither opens a menu, whatever `contextOptions` holds. */
  getContextModel?: () => ContextMenuModel[];
  /** Called when the menu closes. */
  hideContextMenu?: () => void;
  /** Ignored. Nothing reads it. */
  sideColor?: string;
  /** Called with an empty array before a plain click selects the tile, unless the click landed on an image, an input or an SVG shape. */
  setSelection?: (items: FileItem[]) => void;
  /** Quick-action buttons, stacked in a column in the thumbnail's top start corner. */
  contentElement?: ReactElement;
  /** Badges drawn in a row in the thumbnail's top end corner. Give them the class `badges` so a click on them does not select the tile. */
  badges?: ReactElement;
  /** Fades `--highlightColor` out of the name row once, on mount, to point at a matched file. The kit sets no such colour, so nothing shows until you set one. */
  isHighlight?: boolean;
  /** Stops hover, clicks and right-clicks reaching the tile while an operation runs over it. The tile looks the same. */
  isBlockingOperation?: boolean;
  /** Draws the accent outline that marks the tile the keyboard is on. */
  showHotkeyBorder?: boolean;
  /** Marks the tile as being dragged: hovering the icon does not swap it for the checkbox. It does not dim the tile. */
  isDragging?: boolean;
  /** Ignored. Only its difference from `null` is tested, which a `number | undefined` always satisfies, so the branch it guards is unreachable. */
  thumbSize?: number;
  /** Keeps the hover tint and the underlined name on the tile being acted on, after the pointer leaves it. */
  isActive?: boolean;
  /** Renaming state: removes the icon and the checkbox, so the content gets the name row. */
  isEdit?: boolean;
  /** Attached to the outer element, and clicked by the component itself on a right-click before the menu is mounted. */
  forwardRef?: React.RefObject<HTMLDivElement | null>;
  /** Value of `data-testid` on the outer element.
   * @default "tile" */
  dataTestId?: string;
};

export type FileChildProps = {
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
