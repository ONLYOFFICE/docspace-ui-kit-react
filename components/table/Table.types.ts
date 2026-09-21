import React from "react";
import { IndexRange } from "react-virtualized";

import { ContextMenuModel } from "../context-menu";

export interface TableContainerProps {
  /** Ref of the container element, which the header needs to set the grid on. */
  forwardedRef: React.Ref<HTMLDivElement>;
  /** Disables text selection inside the table. */
  noSelect?: boolean;
  /** Whether the body inside is virtualised. It only switches a class here. */
  useReactWindow: boolean;
  /** The header, the group menu and the body. */
  children?: React.ReactNode;
  /** Applied to the container. */
  className?: string;
}

export type TTableColumn = {
  /** Identifier of the column, used as its React key and in the settings menu. */
  key: string;
  /** Text in the header cell. It is rendered only while `enable` is true. */
  title: string;
  /** Whether the column is shown. A hidden column keeps its place in the grid. */
  enable?: boolean;
  /** Highlights the header cell without sorting by it. */
  active?: boolean;
  /** Narrowest the column may be dragged, in pixels. The default is 110, or 210 for the first column. */
  minWidth?: number;
  /** Hands the header's `tagRef` to this column's cell. */
  withTagRef?: boolean;
  /** Field this column sorts by; the header compares it with its own `sortBy`. */
  sortBy?: string;
  /** Called when the header cell is clicked, with `sortBy` and the event. */
  onClick?: (sortBy: string, e: React.MouseEvent) => void;
  /** Called when the sort arrow is clicked, instead of `onClick`. */
  onIconClick?: () => void;
  /**
   * Called with the column's key when it is ticked in the settings menu.
   * A column without this callback is not offered in that menu at all.
   */
  onChange?: (key: string, e?: React.ChangeEvent<HTMLInputElement>) => void;
  /** Keeps the column out of the settings menu. */
  isDisabled?: boolean;
  /** Width the column is reset to, in pixels. */
  defaultSize?: number;
  /** Marks the column as one of the set restored on a reset. */
  default?: boolean;
  /** Whether the *next* column may be dragged by this one's right edge. */
  resizable?: boolean;
  /** Renders the cell in its narrow form. */
  isShort?: boolean;
  /** Renders a checkbox before the title, shown only while it is ticked or indeterminate. */
  checkbox?: {
    value: boolean;
    isIndeterminate: boolean;
    onChange: (e?: React.ChangeEvent<HTMLInputElement>) => void;
  };
};

export interface TableHeaderProps {
  /** Ref of the `TableContainer`, whose `grid-template-columns` this component writes. */
  containerRef: { current: HTMLDivElement | null };
  /**
   * The columns, in order. The header also calls a column's `onChange` itself
   * when the table is sorted by a column that is not enabled.
   */
  columns: TTableColumn[];
  /** Field the table is sorted by; the matching column is highlighted. */
  sortBy?: string;
  /** Whether the sort is descending, which turns the arrow. */
  sorted?: boolean;
  /**
   * `localStorage` key the column widths are saved under. It is required and
   * has to be unique per table, or two tables overwrite each other's layout.
   */
  columnStorageName: string;
  /** Width of the section around the table, in pixels. */
  sectionWidth: number;
  /** Called on a click on the header. */
  onClick?: () => void;
  /** Discards the saved widths and measures the columns again. */
  resetColumnsSize?: boolean;
  /** Lets the header run past the table's width. */
  isLengthenHeader?: boolean;
  /** Whether the sort arrows are rendered and the cells react to a click.
   * @default true */
  sortingVisible?: boolean;
  /** Tells the header to use the info-panel storage key and its narrower layout. */
  infoPanelVisible?: boolean;
  /** Whether the body is virtualised, which changes how the rows are re-laid out.
   * @default false */
  useReactWindow: boolean;
  /** Whether the settings cog is rendered at the end of the header.
   * @default true */
  showSettings: boolean;
  /** Called when the header runs out of room and hides its columns. */
  setHideColumns?: (value: boolean) => void;
  /** `localStorage` key used instead of `columnStorageName` while the info panel is open. */
  columnInfoPanelStorageName?: string;
  /** Hover tooltip of the settings cog. */
  settingsTitle?: string;
  /** Ref handed to the cell of the column that asks for it with `withTagRef`. */
  tagRef?:
    React.ForwardedRef<HTMLDivElement> | ((node: HTMLDivElement) => void);
  /** Disables the settings cog while the rows are being reordered. */
  isIndexEditingMode?: boolean;
  /** Stops the last column being stretched to fill the leftover width. */
  withoutWideColumn?: boolean;
  /** Ignored. Nothing reads this prop. */
  style?: React.CSSProperties;
}

export interface TableHeaderCellProps {
  /** The column this cell renders. */
  column: TTableColumn;
  /** Position of the column, which becomes the cell's `column_<index>` id. */
  index: number;
  /** Called when the resize handle is pressed. */
  onMouseDown: (event: React.MouseEvent) => void;
  /** Whether a resize handle is drawn on this cell's edge. */
  resizable?: boolean;
  /** Whether the sort is descending. */
  sorted: boolean;
  /** Field the table is sorted by. */
  sortBy: string;
  /** Width the column is reset to, in pixels. */
  defaultSize?: number;
  /** Whether the sort arrow is rendered and clicks are acted on. */
  sortingVisible: boolean;
  /** Ref handed to this cell when the column asks for it. */
  tagRef?:
    React.ForwardedRef<HTMLDivElement> | ((node: HTMLDivElement) => void);
  /** Value of `data-testid` on the cell.
   * @default "table-header-cell" */
  testId?: string;
}

export interface TableSettingsProps {
  /** The columns. Only those with an `onChange` and without `isDisabled` are offered. */
  columns: TTableColumn[];
  /** Greys the cog out and stops the menu opening. */
  disableSettings?: boolean;
}

export interface TableBodyProps {
  /**
   * `localStorage` key of the column widths. The body renders **nothing but an
   * empty element** unless this and `columnInfoPanelStorageName` are both set.
   */
  columnStorageName: string;
  /** The info-panel variant of that key. It is as required as the other one. */
  columnInfoPanelStorageName?: string;
  /** Called with the range to load when the user scrolls near the end. */
  fetchMoreFiles: (params: IndexRange) => Promise<void>;
  /** The rows. It must be an array, one entry per row. */
  children: React.ReactNode[];
  /** How many rows are loaded so far. */
  filesLength: number;
  /** Whether there is another page to ask for. */
  hasMoreFiles: boolean;
  /** How many rows there are in total. */
  itemCount: number;
  /** Height of one row in pixels, the same for every row.
   * @default 41 */
  itemHeight: number;
  /** Whether the rows are virtualised.
   * @default true */
  useReactWindow: boolean;
  /** Called as the list scrolls. Only with virtualisation on. */
  onScroll?: () => void;
  /** Narrows the body for an open info panel.
   * @default false */
  infoPanelVisible?: boolean;
  /** Passed through while the rows are being reordered. */
  isIndexEditingMode?: boolean;
}

export interface TableRowProps {
  /** Called when the context menu is asked for, with `true` for a right-click. */
  fileContextClick?: (value?: boolean) => void;
  /** The row's cells, normally `TableCell`s, one per column. */
  children: React.ReactNode;
  /**
   * Items of the context menu. Its **presence** is what renders the context
   * button — an empty array renders a spacer instead.
   */
  contextOptions?: ContextMenuModel[];
  /** Called when the context menu closes. */
  onHideContextMenu?: () => void;
  /** Class and value spread onto the cell that holds the context button. */
  selectionProp?: { className?: string; value?: string };
  /** Applied to the row. */
  className?: string;
  /** Applied to the row. The header overwrites the grid columns of every row. */
  style?: React.CSSProperties;
  /** Applied to the cell that holds the context button. */
  contextMenuCellStyle?: React.CSSProperties;
  /** Hover tooltip of the context button. */
  title?: string;
  /** Builds the context menu's items when it opens. */
  getContextModel?: () => ContextMenuModel[];
  /** URL of the badge image shown in the context menu's header. */
  badgeUrl?: string;
  /** Hides the context button while the rows are being reordered. */
  isIndexEditingMode?: boolean;
  /** Called on a click anywhere in the row. */
  onClick?: (e: React.MouseEvent) => void;
  /** Called on a double click anywhere in the row. */
  onDoubleClick?: (e: React.MouseEvent) => void;
  /** Ref of the row element. */
  forwardedRef?: React.ForwardedRef<HTMLDivElement>;
  /** Applies the narrow layout the header asks for when it runs out of room. */
  hideColumns?: boolean;
  /** Highlights the row as the one the context menu belongs to. */
  isActive?: boolean;
  /** Highlights the row as selected. There is no checkbox here — put one in a cell. */
  checked?: boolean;
  /** Dims the row while it is being dragged. */
  dragging?: boolean;
  /** Value of `data-testid` on the row.
   * @default "table-row" */
  dataTestId?: string;
  /** Value of `data-testid` on the context menu. */
  contextMenuTestId?: string;

  /** Called when the pointer enters the row. */
  onMouseEnter?: (e: React.MouseEvent) => void;
  /** Called when the pointer leaves the row. */
  onMouseLeave?: (e: React.MouseEvent) => void;
}

export interface TableCellProps {
  /** Applied to the cell. */
  className?: string;
  /** Applies the styling of a cell whose row the user may act on. */
  hasAccess?: boolean;
  /** Applies the selected styling. */
  checked?: boolean;
  /** Ref of the cell element. */
  forwardedRef?: React.ForwardedRef<HTMLDivElement>;
  /** Applied to the cell. */
  style?: React.CSSProperties;
  /** Content of the cell. */
  children?: React.ReactNode;
  /** Written to the element as a `value` attribute, which drag and drop reads. */
  value?: string;
  /** Value of `data-testid` on the cell.
   * @default "table-cell" */
  dataTestId?: string;
  /** Written to the element as `data-document-title`. */
  documentTitle?: string;
}

export type TGroupMenuItem = {
  /** Text of the button. */
  label: string;
  /** Greys the button out. */
  disabled: boolean;
  /** Called when the button is clicked. */
  onClick: (e: React.MouseEvent) => void;
  /** URL of the button's icon, fetched at runtime. */
  iconUrl: string;
  /** Hover tooltip of the button. */
  title: string;
  /** Whether the button opens `options` as a menu. */
  withDropDown?: boolean;
  /** Items of that menu. */
  options?: ContextMenuModel[];
  /** Identifier, used as the React key and in the test id. */
  id: string;
  /** Lays the button out for a phone. */
  isMobileView?: boolean;
  /** When true, applies fixed width (161px) and responsive height for the dropdown */
  fixedDropdownStyles?: boolean;
};

interface TableGroupMenuBased {
  /** Whether the select-all checkbox is ticked. */
  isChecked: boolean;
  /** Whether it is drawn as partly ticked. */
  isIndeterminate: boolean;
  /** The buttons of the menu, in order. */
  headerMenu: TGroupMenuItem[];
  /** Element whose children become the options of the selection combo box. */
  checkboxOptions?: React.ReactElement<{ children?: React.ReactNode }>;
  /** Called on a click anywhere in the menu. */
  onClick?: () => void;
  /** Called with the new state when the select-all checkbox changes. */
  onChange: (isChecked: boolean) => void;
  /** Margin around that checkbox, as a CSS length. */
  checkboxMargin?: string;
  /** Whether the info-panel button at the end is left out. */
  withoutInfoPanelToggler: boolean;
  /** Colours that button as active. */
  isInfoPanelVisible?: boolean;
  /** Lays the buttons out for a phone. */
  isMobileView?: boolean;
  /** Greys every button out. */
  isBlocked?: boolean;
  /** Called when the info-panel button is clicked. */
  toggleInfoPanel?: () => void;
  /** Whether the selection combo box is rendered next to the checkbox.
   * @default true */
  withComboBox?: boolean;
  /** Text shown instead of the select-all checkbox. */
  headerLabel?: string;
}

export type TGroupMenuProps = Pick<
  TableGroupMenuBased,
  "headerMenu" | "isBlocked" | "isMobileView"
>;

export type TableGroupMenuProps =
  | (TableGroupMenuBased & {
      /** Whether a close cross is rendered. It comes with `onCloseClick` or not at all. */
      isCloseable?: undefined;
      /** Called by that cross. */
      onCloseClick?: undefined;
    })
  | (TableGroupMenuBased & {
      /** Whether a close cross is rendered. It comes with `onCloseClick` or not at all. */
      isCloseable: boolean;
      /** Called by that cross. */
      onCloseClick: () => void;
    });
