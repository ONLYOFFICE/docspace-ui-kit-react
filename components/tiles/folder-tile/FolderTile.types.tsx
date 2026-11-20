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

export type FolderTileProps = React.AriaAttributes & {
  /** The folder this tile stands for. Its `contextOptions` key — present or absent — is what decides whether the three-dot button appears. */
  item: FolderItem;
  /** Ticks the checkbox, shows it in place of the icon and tints the whole tile. The tile holds no state; pass back what `onSelect` reports. */
  checked?: boolean;
  /** Draws the accent outline that marks the tile the keyboard is on. */
  showHotkeyBorder?: boolean;
  /** Replaces the icon and the checkbox with the kit's track loader. */
  inProgress?: boolean;
  /** Called with the new checked state and the `item`, from the checkbox or a plain click. A tap on the icon calls it too, in a window 600px wide or narrower. */
  onSelect?: (checked: boolean, item: FolderItem) => void;
  /** Ignored. Nothing reads it, and the component forwards no unknown props, so it never reaches the DOM either. */
  thumbnailClick?: (e: React.MouseEvent) => void;
  /** Builds the menu that the three-dot button and a right-click open. Without it neither opens a menu, whatever `contextOptions` holds. */
  getContextModel?: () => ContextMenuModel[];
  /** Called with an empty array before a plain click selects the tile, unless the click landed on an image, an input or an SVG shape. */
  setSelection?: (items: FolderItem[]) => void;
  /** Called with the `item` on a Ctrl- or Cmd-click, instead of selecting. */
  withCtrlSelect?: (item: FolderItem) => void;
  /** Called with the `item` on a Shift-click, instead of selecting. */
  withShiftSelect?: (item: FolderItem) => void;
  /** The icon beside the checkbox. Without it neither the icon nor the checkbox is rendered at all. */
  element?: React.ReactNode;
  /** The tile's content. Only the first element is rendered; the rest are dropped. */
  children?: React.ReactNode;
  /** Called when the menu closes. */
  hideContextMenu?: () => void;
  /** Ignored. The header is built from the first child's `item`; nothing reads this prop. */
  contextMenuHeader?: React.ReactNode;
  /** Called before the menu opens, with `true` when the trigger was a right-click. */
  tileContextClick?: (isRightClick?: boolean) => void;
  /** Badges after the name, or in the picture's top end corner in the tall card. Give their wrapper the class `badges`, so a click on them does not select. */
  badges?: React.ReactNode;
  /** Draws the three-dot button when non-empty and `item` carries a `contextOptions` key. The menu lists `getContextModel`'s entries, not these. */
  contextOptions: ContextMenuModel[];
  /** Draws the checkbox in its indeterminate state. */
  indeterminate?: boolean;
  /** Marks the tile as being dragged: hovering it does not tint it, underline the name or swap the icon for the checkbox. It does not dim the tile. */
  isDragging?: boolean;
  /** Ignored. `isDragging` is the one that is read. */
  dragging?: boolean;
  /** Keeps the hover tint and the underlined name on the tile being acted on, after the pointer leaves it. */
  isActive?: boolean;
  /** Renaming state: removes the icon, the checkbox and the hover tint, so the content gets the name row. */
  isEdit?: boolean;
  /** Attached to the outer element, and clicked by the component itself on a right-click before the menu is mounted. */
  forwardRef?: React.RefObject<HTMLDivElement | null>;
  /** The folder's picture, drawn only in the tall card: a URL is fetched as an SVG, an element is rendered as given. */
  temporaryIcon?: string | React.ReactElement;
  /** Switches from the single row to a tall card, with a picture on top and the name row below it. */
  isBigFolder?: boolean;
  /** Value of `data-testid` on the outer element.
   * @default "tile" */
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
