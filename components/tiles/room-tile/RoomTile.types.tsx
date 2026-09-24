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
  /** Whether the tile is selected. */
  checked?: boolean;
  /** Whether the tile is the one being acted on, which keeps its hover background. */
  isActive?: boolean;
  /** Dims the tile while an operation is running over it. */
  isBlockingOperation?: boolean;
  /** The room this tile stands for. Its `tags`, `providerType` and `isAIAgent` decide what the bottom row shows, and its `contextOptions` key decides whether the three-dot button appears. */
  item: RoomItem;
  /** Called with the new checked state and the `item` when the checkbox changes, or when the logo is tapped on a screen narrower than 600px. */
  onSelect?: (checked: boolean, item: RoomItem) => void;
  /** Called with the event on a click anywhere on the tile except the checkbox, the tags, the badges, an open dialog, the three-dot button and the menu. It is the tile's open handler, not a thumbnail's. */
  thumbnailClick?: (e: React.MouseEvent) => void;
  /** Builds the menu shown on right-click. Without it the right-click menu never opens. */
  getContextModel?: () => ContextMenuModel[];
  /** The tile's content. Only the first element is rendered, above the tags. */
  children?: React.ReactNode;
  /** Draws the checkbox in its indeterminate state. */
  indeterminate?: boolean;
  /** The room logo beside the checkbox. Without it neither the logo nor the checkbox is rendered at all. */
  element?: React.ReactNode;
  /** The menu's entries. Required — but see `item`. */
  contextOptions: ContextMenuModel[];
  /** How many columns the tag row is laid out in. Required. */
  columnCount: number;
  /** Called with a clicked tag, but only one that carries both a label and a room type — a plain string tag never reaches it, and neither does any tag on an AI agent that has none of its own. */
  selectTag: (tag: TagClickEvent) => void;
  /** Called when the generated third-party or room-type tag is clicked, with which of the two it was. Required. */
  selectOption: (option: SelectOption) => void;
  /** Turns a room type into the label of the tag shown when the room has no tags of its own. It is handed the kit's own translation function. Required. */
  getRoomTypeName: (
    type: string,
    t:
      | TFunction
      | ((
          key: string,
          interpolation?: Record<string, string | number>,
        ) => string),
  ) => string;
  /** Badges drawn beside the content, in the upper half. */
  badges?: React.ReactNode;
  /** Replaces the logo and the checkbox with the kit's track loader. */
  inProgress?: boolean;
  /** Draws the accent outline that marks the tile the keyboard is on. */
  showHotkeyBorder?: boolean;
  /** Renaming state: it removes the logo and the checkbox. */
  isEdit?: boolean;
  /** Value of `data-testid` on the outer element.
   * @default "tile" */
  dataTestId?: string;

  /** Replaces the whole tag row. It is called on every render with the hover state and the tags the component worked out. */
  customBottomContent?: (
    isHovered: boolean,
    tags: Array<TagType | string>,
  ) => React.ReactNode;
};
