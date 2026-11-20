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

export type RoomTileProps = React.AriaAttributes & {
  /** Ticks the checkbox and keeps it in place of the logo, and tints the tile
   * and its tags. */
  checked?: boolean;
  /** Keeps the hover background and the tag tint on the tile being acted on. */
  isActive?: boolean;
  /** Stops the tile answering hover, clicks and right-clicks while an
   * operation runs over it. The tile looks the same as an idle one. */
  isBlockingOperation?: boolean;
  /** The room the tile stands for, passed back through the callbacks. Its
   * `tags`, `providerType` and `isAIAgent` decide the tag row. */
  item: RoomItem;
  /** Called with the new checked state and the `item` when the checkbox
   * changes, or when the logo is tapped at 600px or narrower. */
  onSelect?: (checked: boolean, item: RoomItem) => void;
  /** The room's open handler, called with the event on a click on the tile.
   * Clicks on the checkbox, the tags, the badges and the menu do not reach it. */
  thumbnailClick?: (e: React.MouseEvent) => void;
  /** Returns the menu's entries. Without it neither the three-dot button nor a
   * right-click opens anything. */
  getContextModel?: () => ContextMenuModel[];
  /** The name beside the logo, usually a `TileContent`. Only the first element
   * is rendered. */
  children?: React.ReactNode;
  /** Draws the checkbox half-filled. It shows while the checkbox does: on
   * hover, or when the tile is checked. */
  indeterminate?: boolean;
  /** The room logo beside the name. Without it the tile has neither the logo
   * nor the checkbox. */
  element?: React.ReactNode;
  /** Draws the three-dot button when non-empty and `item` has a
   * `contextOptions` key. The menu lists `getContextModel`'s entries, not
   * these. */
  contextOptions: ContextMenuModel[];
  /** How many columns the tag row fits into. The row shows as many tags as
   * the width allows and folds the rest into a menu. */
  columnCount: number;
  /** Called with `{ label, roomType, providerType }` when one of the room's
   * own tags is clicked. The generated tags go to `selectOption`. */
  selectTag: (tag: TagClickEvent) => void;
  /** Called when a generated tag is clicked: `typeProvider` for the storage
   * tag, `defaultTypeRoom` for the room-type tag. */
  selectOption: (option: SelectOption) => void;
  /** Turns a room type into the label of the tag a room without tags of its
   * own gets. It receives the kit's translation function. */
  getRoomTypeName: (
    type: string,
    t:
      | TFunction
      | ((
          key: string,
          interpolation?: Record<string, string | number>,
        ) => string),
  ) => string;
  /** Badges after the name. Give their wrapper the class `badges`, so a click
   * on them does not open the room. */
  badges?: React.ReactNode;
  /** Replaces the logo and the checkbox with a small loader, and sets
   * `aria-busy` on the tile. */
  inProgress?: boolean;
  /** Draws the accent border that marks the tile the keyboard is on. */
  showHotkeyBorder?: boolean;
  /** Renaming state: removes the logo and the checkbox, and stops hover from
   * tinting the tile and its tags. */
  isEdit?: boolean;
  /** Value of `data-testid` on the outer element.
   * @default "tile" */
  dataTestId?: string;

  /** Draws the bottom row instead of the tags. It is called on every render
   * with the hover state and the tags the tile worked out. */
  customBottomContent?: (
    isHovered: boolean,
    tags: Array<TagType | string>,
  ) => React.ReactNode;
};
