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

export type TemplateTileProps = React.AriaAttributes & {
  /** Ticks the checkbox and keeps it in place of the icon, and tints the
   * tile. */
  checked?: boolean;
  /** Keeps the hover background on the tile being acted on. */
  isActive?: boolean;
  /** Stops the tile answering hover, clicks and right-clicks while an
   * operation runs over it. The tile looks the same as an idle one. */
  isBlockingOperation?: boolean;
  /** The template the tile stands for. Its `createdBy` fills the owner line,
   * and `security.EditRoom` decides whether the storage figure is editable. */
  item: TemplateItem;
  /** Called with the new checked state and the `item` when the checkbox
   * changes, or when the icon is tapped at 600px or narrower. */
  onSelect?: (checked: boolean, item: TemplateItem) => void;
  /** Returns the menu's entries. Without it neither the three-dot button nor a
   * right-click opens anything. */
  getContextModel?: () => ContextMenuModel[];
  /** The name beside the icon, usually a `TileContent`. Only the first element
   * is rendered. */
  children?: React.ReactNode;
  /** Draws the checkbox half-filled. It shows while the checkbox does: on
   * hover, or when the tile is checked. */
  indeterminate?: boolean;
  /** The template icon beside the name. Without it the tile has neither the
   * icon nor the checkbox. */
  element?: React.ReactNode;
  /** Draws the three-dot button when non-empty and `item` has a
   * `contextOptions` key. The menu lists `getContextModel`'s entries, not
   * these. */
  contextOptions: ContextMenuModel[];
  /** Called before the menu opens, from the three-dot button or a
   * right-click. */
  tileContextClick?: () => void;
  /** Called when the menu closes. */
  hideContextMenu?: () => void;
  /** Action buttons after the name. */
  badges?: React.ReactNode;
  /** Replaces the icon and the checkbox with a small loader, and sets
   * `aria-busy` on the tile. */
  inProgress?: boolean;
  /** Draws the accent border that marks the tile the keyboard is on. */
  showHotkeyBorder?: boolean;
  /** Renaming state: removes the icon and the checkbox, and stops hover from
   * tinting the tile. */
  isEdit?: boolean;
  /** Adds a storage line under the owner. Its figure appears only when
   * `SpaceQuotaComponent` is given too. */
  showStorageInfo?: boolean;
  /** Called when the owner's name is clicked, or activated with Enter.
   * Required even for a template without `createdBy`, which shows no name. */
  openUser: () => void;
  /** Draws the storage figure. It receives the `item`, the type `"room"` and
   * whether the figure is read-only. */
  SpaceQuotaComponent?: React.ComponentType<SpaceQuotaProps>;
};
