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
  /** Whether the tile is selected. */
  checked?: boolean;
  /** Whether the tile is the one being acted on, which keeps its hover background. */
  isActive?: boolean;
  /** Dims the tile while an operation is running over it. */
  isBlockingOperation?: boolean;
  /** The template this tile stands for. Its `createdBy` fills the owner line and its `security.EditRoom` decides whether the quota control is read-only. */
  item: TemplateItem;
  /** Called with the new checked state and the `item`. A checked item that has no string `title` is dropped before it reaches you. */
  onSelect?: (checked: boolean, item: TemplateItem) => void;
  /** Ignored. It reaches the base tile, which does not read it either. */
  thumbnailClick?: (e: React.MouseEvent) => void;
  /** Builds the menu shown on right-click. Without it the right-click menu never opens. */
  getContextModel?: () => ContextMenuModel[];
  /** The tile's content. Only the first element is rendered, above the badges. */
  children?: React.ReactNode;
  /** Draws the checkbox in its indeterminate state. */
  indeterminate?: boolean;
  /** The icon beside the checkbox. Without it neither the icon nor the checkbox is rendered at all. */
  element?: React.ReactNode;
  /** The menu's entries. Required — but the three-dot button appears only when `item` also carries a `contextOptions` key of its own. */
  contextOptions: ContextMenuModel[];
  /** Called before the menu opens. */
  tileContextClick?: () => void;
  /** Called when the menu closes. */
  hideContextMenu?: () => void;
  /** Ignored. It is required by the type and read by nothing — the lower half is a two-column list, not a grid. */
  columnCount: number;
  /** Badges beside the content, in the upper half. */
  badges?: React.ReactNode;
  /** Replaces the icon and the checkbox with the kit's track loader. */
  inProgress?: boolean;
  /** Draws the accent outline that marks the tile the keyboard is on. */
  showHotkeyBorder?: boolean;
  /** Renaming state: it removes the icon and the checkbox. */
  isEdit?: boolean;
  /** Adds the storage line to the lower half. The value beside it appears only when `SpaceQuotaComponent` is given as well. */
  showStorageInfo?: boolean;
  /** Called when the owner's name is clicked. Required, even when the template has no `createdBy` and the name is never rendered. */
  openUser: () => void;
  /** Renders the storage figure. It is handed the `item`, the literal type `"room"` and whether editing is allowed. */
  SpaceQuotaComponent?: React.ComponentType<SpaceQuotaProps>;
};
