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
  /** Marks the file as coming from a plugin, which makes `fileTileIcon` win over the thumbnail. */
  isPlugin?: boolean;
  /** Icon to draw instead of the thumbnail, for a plugin file. */
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
  /** Whether the tile is selected. */
  checked?: boolean;
  /** The tile's content. Only the first element is rendered, in the row beside the icon; the rest are dropped. */
  children?: ReactElement | ReactElement[];
  /** Ignored. Nothing reads it, and it is spread onto the outer element as an unknown attribute. */
  contextButtonSpacerWidth?: number;
  /** The menu's entries. Required — but the three-dot button appears only when `item` also carries a `contextOptions` key of its own. */
  contextOptions: ContextMenuModel[];
  /** Replaces the icon and the checkbox with the kit's track loader. */
  inProgress?: boolean;
  /** The file this tile stands for. */
  item: FileItemType;
  /** Called with the new checked state and the `item` — from the checkbox, from a plain click on the tile, and from a tap on the icon below 600px. */
  onSelect?: (checked: boolean, item: FileItemType) => void;
  /** Called with the event when the thumbnail area is clicked. The tile's own click handler runs as well. */
  thumbnailClick?: (e: React.MouseEvent) => void;
  /** Preview image for the file. It falls back to `temporaryIcon` when the image fails to load. */
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
  /** Builds the menu shown on right-click. Without it the right-click menu never opens. */
  getContextModel?: () => ContextMenuModel[];
  /** Called when the menu closes. */
  hideContextMenu?: () => void;
  /** Ignored. Nothing reads it, and it is spread onto the outer element as an unknown attribute. */
  sideColor?: string;
  /** Called with an empty array before a plain click selects the tile, unless the click landed on an image, an input or an SVG shape. */
  setSelection?: (items: FileItem[]) => void;
  /** Row of quick-action buttons over the thumbnail, above the badges. */
  contentElement?: ReactElement;
  /** Badges drawn over the thumbnail. Give them the class `badges` so a click on them does not select the tile. */
  badges?: ReactElement;
  /** Tints the lower half, for a file that a search or a filter has just matched. */
  isHighlight?: boolean;
  /** Dims the tile while an operation is running over it. */
  isBlockingOperation?: boolean;
  /** Draws the accent outline that marks the tile the keyboard is on. */
  showHotkeyBorder?: boolean;
  /** Dims the tile while it is being dragged. */
  isDragging?: boolean;
  /** Ignored. Only its difference from `null` is tested, which a `number | undefined` always satisfies, so the branch it guards is unreachable. */
  thumbSize?: number;
  /** Whether the tile is the one being acted on, which keeps its hover state. */
  isActive?: boolean;
  /** Renaming state: it removes the icon and the checkbox. */
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
