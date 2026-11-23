import { VDRIndexingAction } from "../../../enums";
import { ContextMenuModel } from "../../context-menu";

export type RowItemType = {
  icon?: string;
  avatar?: string;
  title?: string;
  displayName?: string;
  logo?: {
    color?: string;
    medium?: string;
    cover?: string;
    small?: string;
    large?: string;
  };
};

export type TData = {
  contextOptions: ContextMenuModel[];
};

export type TMode = "modern" | "default";

export type RowProps = React.AriaAttributes & {
  /**
   * Whether the row's checkbox is ticked. Its **presence** is what renders the
   * checkbox at all — passing `checked={false}` gives an unticked box, omitting
   * the prop gives none.
   */
  checked?: boolean;
  /**
   * The row's content, normally a `RowContent`. The row reads `item` off this
   * element's props to build the header of its context menu.
   */
  children?: React.ReactElement<{ item: RowItemType }>;
  /** Applied to the row element. */
  className?: string;
  /** Element placed before the context button, after the badges. */
  contentElement?: React.ReactNode;
  /**
   * Items of the context menu. They may be given here or as
   * `data.contextOptions`, which wins; an empty list renders no button.
   */
  contextOptions?: ContextMenuModel[];
  /**
   * Arbitrary payload handed back to `onSelect`. Its `contextOptions`, if it
   * has any, are the ones the menu uses.
   */
  data?: TData;
  /**
   * Element at the start of the row — an avatar or a file icon. Like `checked`,
   * its presence is what reserves the space.
   */
  element?: React.ReactElement;
  /** Id of the row element. */
  id?: string;
  /** Draws the checkbox as partly ticked, for a group that is half-selected. */
  indeterminate?: boolean;
  /**
   * Called with the new checked state and whatever `data` holds. In the modern
   * mode on a touch device, a tap on the start element calls it with `true`.
   */
  onSelect?: (checked: boolean, data?: unknown) => void;
  /**
   * Called by a click on the content, and in the default mode on the start
   * element. The checkbox and the context button do not call it.
   */
  onRowClick?: (e: React.MouseEvent) => void;
  /** Called when the context menu is asked for, with `true` for a right-click. */
  onContextClick?: (value?: boolean) => void;
  /** Inline style of the row element. */
  style?: React.CSSProperties;
  /** Replaces the checkbox and the start element with a spinner. */
  inProgress?: boolean;
  /** Builds the context menu's items when it opens, instead of `contextOptions`. */
  getContextModel?: () => ContextMenuModel[];
  /**
   * `modern` moves the checkbox on top of the start element, so it needs both
   * `checked` and `element` to render either.
   * @default "default"
   */
  mode?: TMode;
  /** Removes the row's bottom border. */
  withoutBorder?: boolean;
  /** Replaces the context button with the up and down arrows of index editing. */
  isIndexEditingMode?: boolean;
  /** Tells the context menu that this row is a room, which changes its header. */
  isRoom?: boolean;
  /** Hover tooltip and accessible name of the context button. */
  contextTitle?: string;
  /** Element placed before `contentElement`, for badges of your own. */
  badgesComponent?: React.ReactNode;
  /** Tells the context menu that the room is archived. */
  isArchive?: boolean;
  /** Called when the context menu closes. */
  rowContextClose?: () => void;
  /** URL of the badge image shown in the context menu's header. */
  badgeUrl?: string;
  /** Disables the checkbox, and nothing else about the row. */
  isDisabled?: boolean;
  /** Called with the direction when an index arrow is clicked. */
  onChangeIndex?: (action: VDRIndexingAction) => void;
  /** Value of `data-testid` on the row.
   * @default "row" */
  dataTestId?: string;
};
