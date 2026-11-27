import React from "react";
import { IndexRange } from "react-virtualized";

import { ContextMenuModel } from "../context-menu";

export interface TableContainerProps extends React.AriaAttributes {
  /** Ref of the container element; pass the same ref to the header as `containerRef`. */
  forwardedRef: React.Ref<HTMLDivElement>;
  /** Stops the user selecting text anywhere inside the table. */
  noSelect?: boolean;
  /** Whether the body inside is virtualised. The container then becomes a full-height block instead of the grid. */
  useReactWindow: boolean;
  /** The header, the group menu and the body. */
  children?: React.ReactNode;
  /** Applied to the container. */
  className?: string;
}

export type TTableColumn = {
  /** Identifier of the column: its React key, and part of its test ids. */
  key: string;
  /** Text in the header cell and in the settings menu. The header cell shows it only while `enable` is set. */
  title: string;
  /** Whether the column is shown. A hidden column keeps its slot in the grid at zero width. */
  enable?: boolean;
  /** Keeps the sort arrow shown without sorting by the column. */
  active?: boolean;
  /** Narrowest a drag leaves the column, in pixels. Without it a drag stops at 110. */
  minWidth?: number;
  /** Hands the header's `tagRef` to this column's cell. */
  withTagRef?: boolean;
  /** Field this column sorts by; the header compares it with its own `sortBy`. */
  sortBy?: string;
  /** Called with `sortBy` and the event when the title is clicked. Without it the column does not sort. */
  onClick?: (sortBy: string, e: React.MouseEvent) => void;
  /** Called instead of `onClick` when the sort arrow is clicked. */
  onIconClick?: () => void;
  /**
   * Called with the column's key when it is ticked in the settings menu.
   * A column without this callback is not offered in that menu at all.
   */
  onChange?: (key: string, e?: React.ChangeEvent<HTMLInputElement>) => void;
  /** Keeps the column out of the settings menu, so it cannot be hidden. */
  isDisabled?: boolean;
  /** Fixed width of the column, in pixels. Dragging the edge before it does nothing. */
  defaultSize?: number;
  /** Marks the wide column: 40% of the width on a fresh layout, and never less than its `minWidth` or 210px there. */
  default?: boolean;
  /** Draws a resize handle on the edge between this column and the enabled column before it. */
  resizable?: boolean;
  /** Gives the column exactly its `minWidth` and a smaller gap before the resize handle. */
  isShort?: boolean;
  /** Renders a checkbox before the title, shown only while it is ticked or indeterminate. */
  checkbox?: {
    value: boolean;
    isIndeterminate: boolean;
    onChange: (e?: React.ChangeEvent<HTMLInputElement>) => void;
  };
};

export interface TableHeaderProps extends React.AriaAttributes {
  /** Ref of the `TableContainer`, whose grid columns the header writes. */
  containerRef: { current: HTMLDivElement | null };
  /**
   * The columns, in order. The header also calls a column's `onChange` itself
   * when the table is sorted by a column that is not enabled.
   */
  columns: TTableColumn[];
  /** Field the table is sorted by. The column with the same `sortBy` keeps its arrow shown. */
  sortBy?: string;
  /** Direction of the sort; turning it off turns the arrow over. */
  sorted?: boolean;
  /**
   * `localStorage` key the column widths are saved under. Give each table its
   * own, or two tables overwrite each other's layout.
   */
  columnStorageName: string;
  /** Ignores the saved widths and lays the columns out from scratch. */
  resetColumnsSize?: boolean;
  /** Draws the line under the header edge to edge instead of stopping 20px short of each end. */
  isLengthenHeader?: boolean;
  /** Shows the sort arrows and lets a click on a title sort the table.
   * @default true */
  sortingVisible?: boolean;
  /** Saves and restores the widths under `columnInfoPanelStorageName`, for the narrower table beside an open info panel. */
  infoPanelVisible?: boolean;
  /** Set when the body is virtualised, so the header rewrites the widths of the rows it renders.
   * @default false */
  useReactWindow: boolean;
  /** Shows the cog at the end of the header that lists the columns to hide.
   * @default true */
  showSettings: boolean;
  /** Called with `true` when the columns stop fitting, and with `false` when they fit again. */
  setHideColumns?: (value: boolean) => void;
  /** `localStorage` key used instead of `columnStorageName` while the info panel is open. Without it the header writes no widths on mount or on a resize. */
  columnInfoPanelStorageName?: string;
  /** Hover tooltip and accessible name of the cog. Without it the cog is named "Settings". */
  settingsTitle?: string;
  /** Ref attached to the header cell of the column that asks for it with `withTagRef`. */
  tagRef?:
    React.ForwardedRef<HTMLDivElement> | ((node: HTMLDivElement) => void);
  /** Stops columns being resized and greys the cog out while rows are reordered. */
  isIndexEditingMode?: boolean;
  /** Shares the width equally between the columns instead of widening the `default` one. */
  withoutWideColumn?: boolean;
  /** Inline style of the header element. */
  style?: React.CSSProperties;
}

export interface TableHeaderCellProps {
  /** The column this cell renders. */
  column: TTableColumn;
  /** Position of the column, which becomes the cell's `column_<index>` id. */
  index: number;
  /** Called when the resize handle is pressed. */
  onMouseDown: (event: React.MouseEvent) => void;
  /** Draws the resize handle at the end of the cell. */
  resizable?: boolean;
  /** Direction of the sort; turning it off turns the arrow over. */
  sorted: boolean;
  /** Field the table is sorted by. The column with the same `sortBy` keeps its arrow shown. */
  sortBy: string;
  /** Fixed width of the column, written to the cell for the header to read. */
  defaultSize?: number;
  /** Shows the sort arrow and lets the title and the arrow sort the table. */
  sortingVisible: boolean;
  /** Ref attached to this cell when the column asks for it with `withTagRef`. */
  tagRef?:
    React.ForwardedRef<HTMLDivElement> | ((node: HTMLDivElement) => void);
  /** Value of `data-testid` on the cell.
   * @default "table-header-cell" */
  testId?: string;
}

export interface TableSettingsProps {
  /** The table's columns. Only those with an `onChange` and without `isDisabled` get a checkbox. */
  columns: TTableColumn[];
  /** Greys the cog out and stops the list of columns opening. */
  disableSettings?: boolean;
  /** Accessible name of the cog. Without it the cog is named "Settings". */
  label?: string;
}

export interface TableBodyProps extends React.AriaAttributes {
  /**
   * `localStorage` key the header saved the column widths under. Without it,
   * or without `columnInfoPanelStorageName`, the body renders an empty element.
   */
  columnStorageName: string;
  /** `localStorage` key of the widths used while an info panel is open. Without it the body renders an empty element. */
  columnInfoPanelStorageName?: string;
  /** Called with the start and stop index of the rows to load when placeholder rows scroll into view. */
  fetchMoreFiles: (params: IndexRange) => Promise<void>;
  /** The rows, as an array with one element per row. */
  children: React.ReactNode[];
  /** How many rows are loaded. Past this index the virtualised body draws placeholders while `hasMoreFiles` is set. */
  filesLength: number;
  /** Adds two placeholder rows after the loaded ones and asks `fetchMoreFiles` for more as they come into view. */
  hasMoreFiles: boolean;
  /** How many rows there are in total, loaded or not. */
  itemCount: number;
  /** Height of every row in pixels while the rows are virtualised.
   * @default 41 */
  itemHeight: number;
  /** Mounts only the rows near the view and loads more on scroll. Off, every row is rendered at once.
   * @default true */
  useReactWindow: boolean;
  /** Called as the page scrolls, only while the rows are virtualised. */
  onScroll?: () => void;
  /** Lays the virtualised rows out with the widths saved under `columnInfoPanelStorageName` instead.
   * @default false */
  infoPanelVisible?: boolean;
}

export interface TableRowProps extends React.AriaAttributes {
  /** Called when the context menu is asked for, with `true` for a right-click. */
  fileContextClick?: (value?: boolean) => void;
  /** The row's cells, normally one `TableCell` per column. */
  children: React.ReactNode;
  /**
   * Items of the context menu. The context button is drawn only while the
   * list has an item; otherwise a blank space takes its place.
   */
  contextOptions?: ContextMenuModel[];
  /** Called when the context menu closes. */
  onHideContextMenu?: () => void;
  /** Class and `value` spread onto the last cell, which holds the context button. */
  selectionProp?: { className?: string; value?: string };
  /** Applied to the row. */
  className?: string;
  /** Applied to the row element. */
  style?: React.CSSProperties;
  /** Applied to the last cell, which holds the context button. */
  contextMenuCellStyle?: React.CSSProperties;
  /** Hover tooltip and accessible name of the context button. */
  title?: string;
  /** Builds the context menu's items at the moment it opens. */
  getContextModel?: () => ContextMenuModel[];
  /** URL of the badge image shown in the context menu's header. */
  badgeUrl?: string;
  /** Leaves out the last cell with the context button, for rows being reordered. */
  isIndexEditingMode?: boolean;
  /** Called on a click anywhere in the row. */
  onClick?: (e: React.MouseEvent) => void;
  /** Called on a double click anywhere in the row. */
  onDoubleClick?: (e: React.MouseEvent) => void;
  /** Ref of the row element. */
  forwardedRef?: React.ForwardedRef<HTMLDivElement>;
  /** Marks the row whose context menu is open: children marked `create-share-link` stay shown and the drop fill is off. */
  isActive?: boolean;
  /** Adds a `checked` class for your own highlight, and keeps children marked `create-share-link` shown. */
  checked?: boolean;
  /** Fills children marked `droppable-hover` with the drop colour while something is dragged over the table. */
  dragging?: boolean;
  /** Value of `data-testid` on the row.
   * @default "table-row" */
  dataTestId?: string;
  /** Test id of the row's context menu, which opens outside the row in a portal. */
  contextMenuTestId?: string;

  /** Called when the pointer enters the row. */
  onMouseEnter?: (e: React.MouseEvent) => void;
  /** Called when the pointer leaves the row. */
  onMouseLeave?: (e: React.MouseEvent) => void;
}

export interface TableCellProps extends React.AriaAttributes {
  /** Applied to the cell. */
  className?: string;
  /** On hover, shows the child marked `table-container_row-checkbox` in place of the one marked `table-container_element`. */
  hasAccess?: boolean;
  /** Shows the child marked `table-container_row-checkbox` in place of the one marked `table-container_element`, hovered or not. */
  checked?: boolean;
  /** Ref of the cell element. */
  forwardedRef?: React.ForwardedRef<HTMLDivElement>;
  /** Applied to the cell. */
  style?: React.CSSProperties;
  /** Content of the cell: text or elements. */
  children?: React.ReactNode;
  /** Written onto the cell as a `value` attribute, which drag and drop reads to identify the item. */
  value?: string;
  /** Value of `data-testid` on the cell.
   * @default "table-cell" */
  dataTestId?: string;
  /** Kept on the cell as `data-document-title` for your own scripts and tests; the kit never reads it. */
  documentTitle?: string;
}

export type TGroupMenuItem = {
  /** Text of the button and its accessible name. A phone draws the icon only. */
  label: string;
  /** Leaves the button out of the menu, rather than greying it. */
  disabled: boolean;
  /** Called when the button is clicked, before its menu opens. */
  onClick: (e: React.MouseEvent) => void;
  /** URL of the button's icon, fetched at runtime. */
  iconUrl: string;
  /** Hover tooltip of the button. Empty, the label is used. */
  title: string;
  /** Makes a click open `options` in a menu under the button. */
  withDropDown?: boolean;
  /** Items of the menu `withDropDown` opens. */
  options?: ContextMenuModel[];
  /** Identifier: the React key, the button's `id` and part of its test id. */
  id: string;
  /** Opens the button's menu in its phone form. Unset, the group menu's `isMobileView` applies. */
  isMobileView?: boolean;
  /** Gives the menu a fixed width and a height of five rows at most. */
  fixedDropdownStyles?: boolean;
};

interface TableGroupMenuBased extends React.AriaAttributes {
  /** Ticks the select-all checkbox. */
  isChecked: boolean;
  /** Draws the select-all checkbox partly ticked, for a selection that covers some rows but not all. */
  isIndeterminate: boolean;
  /** The action buttons, in order. An entry whose `disabled` is set is left out. */
  headerMenu: TGroupMenuItem[];
  /** Element whose children become the options of the menu the arrow after the checkbox opens. */
  checkboxOptions?: React.ReactElement<{ children?: React.ReactNode }>;
  /** Called on a click anywhere in the toolbar. */
  onClick?: () => void;
  /** Called with the new state when the select-all checkbox is clicked. */
  onChange: (isChecked: boolean) => void;
  /** Space before the checkbox or the label as a CSS length, such as `12px`. Tablets and phones always use 24px. */
  checkboxMargin?: string;
  /** Leaves out the info panel button at the end. */
  withoutInfoPanelToggler: boolean;
  /** Draws the info panel button in the accent colour on a round background. */
  isInfoPanelVisible?: boolean;
  /** Opens the selection menu and the action menus in their phone form. */
  isMobileView?: boolean;
  /** Greys every action button out and ignores clicks on them. */
  isBlocked?: boolean;
  /** Called when the info panel button is clicked. */
  toggleInfoPanel?: () => void;
  /** Shows the arrow after the checkbox that opens `checkboxOptions`.
   * @default true */
  withComboBox?: boolean;
  /** Text shown in place of the select-all checkbox. */
  headerLabel?: string;
}

export type TGroupMenuProps = Pick<
  TableGroupMenuBased,
  "headerMenu" | "isBlocked" | "isMobileView"
>;

export type TableGroupMenuProps =
  | (TableGroupMenuBased & {
      /** Adds a cross before the info panel button. It comes together with `onCloseClick`. */
      isCloseable?: undefined;
      /** Called when the cross is clicked. */
      onCloseClick?: undefined;
    })
  | (TableGroupMenuBased & {
      /** Adds a cross before the info panel button. It comes together with `onCloseClick`. */
      isCloseable: boolean;
      /** Called when the cross is clicked. */
      onCloseClick: () => void;
    });
