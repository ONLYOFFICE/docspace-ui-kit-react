// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import type React from "react";

import type {
  Table,
  SortingState,
  OnChangeFn,
  VisibilityState,
  ColumnSizingState,
} from "@tanstack/react-table";
import type { TableHeaderProps } from "./table-header";
import type { TableBodyProps } from "./table-body";

// ─── Context types ────────────────────────────────────────────────────────────

export interface TableContextValue {
  // biome-ignore lint: Table<any> is the correct generic here
  table: Table<any>;
  /** Measured container width in pixels */
  containerWidth: number;
  /**
   * Current column sizing state — included so consumers re-render when sizing
   * changes (e.g. after mouseUp). TanStack v8 mutates `table` in place; without
   * this field the context object never changes and header/body never re-render.
   */
  columnSizing: ColumnSizingState;
  /** True when container is narrower than the minimum required width */
  hideColumns: boolean;
  /** True when table is in inline-editing mode (hides resize handles) */
  isIndexEditingMode: boolean;
  /**
   * Returns the mousedown handler for the resize handle at visual column index
   * `colIndex`. Called by TableHeader for each non-last, resizable column.
   */
  onResizeMouseDown: (colIndex: number) => (e: React.MouseEvent) => void;
}

// ─── Hook types ───────────────────────────────────────────────────────────────

export interface UseColumnDistributionResult {
  columnSizing: ColumnSizingState;
  setColumnSizing: React.Dispatch<React.SetStateAction<ColumnSizingState>>;
  containerWidth: number;
  hideColumns: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export interface ColumnPersistenceConfig {
  columnStorageName: string;
  columnInfoPanelStorageName?: string;
  infoPanelVisible?: boolean;
}

export interface UseColumnResizeOptions {
  /** Outer container ref (used for scroll-container identification) */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Current column sizing state — used to initialize accurate px widths on drag start */
  columnSizing: ColumnSizingState;
  /** Current container width in pixels — used to compute last column size exactly */
  containerWidth: number;
  /** Persist final sizing to localStorage */
  saveSizing: (sizing: ColumnSizingState) => void;
  /** Update React column sizing state (one call per drag, on mouseUp) */
  setColumnSizing: React.Dispatch<React.SetStateAction<ColumnSizingState>>;
  /**
   * Visible column keys in visual order.
   * Must match positions in gridTemplateColumns (0…n-1; position n = settings).
   */
  columnKeys: string[];
  /** Whether the interface direction is RTL */
  isRTL?: boolean;
}

export interface TTableColumn {
  /** Unique column key (used as id and localStorage key) */
  key: string;
  /** Column header label */
  title: string;
  /** Whether column is visible (default: true) */
  enable?: boolean;
  /** "Name" column — gets NAME_COLUMN_PERCENT width; only one per table */
  default?: boolean;
  /** Fixed px size (e.g. checkbox column); disables resize when set */
  defaultSize?: number;
  /** Pinned at minWidth; not redistributed during column distribution */
  isShort?: boolean;
  /** Minimum column width in pixels */
  minWidth?: number;
  /** Whether column is resizable (default: true when defaultSize is absent) */
  resizable?: boolean;
  /** Column cannot be toggled in settings panel */
  isDisabled?: boolean;
  /** Sort key passed to onClick handler */
  sortBy?: string;
  /** Called when sort header is clicked */
  onClick?: (sortBy: string, e: React.MouseEvent) => void;
  /** Called when the column header icon is clicked */
  onIconClick?: () => void;
  /** Called when column visibility is toggled in settings */
  onChange?: (key: string) => void;
  /** Header checkbox configuration */
  checkbox?: {
    value: boolean;
    isIndeterminate: boolean;
    onChange: (e?: React.ChangeEvent<HTMLInputElement>) => void;
  };
  /** Attach ref to this column header for dynamic width measurement */
  withTagRef?: boolean;
}

/**
 * Typed column definition for consumers.
 *
 * Extends TTableColumn by ADDING render/cellClassName/dataIndex (not overriding
 * anything), so TTableColumnDef<TData>[] is assignable to TTableColumn[] and
 * there is no function-parameter variance conflict.
 */
export interface TTableColumnDef<TData> extends TTableColumn {
  /** Type-safe field name — limits dataIndex to actual keys of TData. */
  dataIndex?: keyof TData & string;

  /**
   * Cell renderer — mirrors antd Table column.render.
   * @param value   record[dataIndex] when dataIndex is set; otherwise the full record
   * @param record  full row data object (typed as TData)
   * @param index   row index in the data array
   */
  render?: (value: unknown, record: TData, index: number) => React.ReactNode;

  /** Extra CSS class for the cell wrapper div. */
  cellClassName?:
    | string
    | ((record: TData, index: number) => string | undefined);
}

export interface TGroupMenuItem {
  label: string;
  disabled: boolean;
  onClick: (e: React.MouseEvent) => void;
  iconUrl: string;
  title: string;
  id: string;
  withDropDown?: boolean;
  options?: unknown[];
  isMobileView?: boolean;
  fixedDropdownStyles?: boolean;
}

export interface TableProps<TData> {
  // ── Data & columns ──────────────────────────────────────────────────────────
  /** Row data array */
  data: TData[];
  /** Column definitions with typed render functions */
  columns: TTableColumnDef<TData>[];

  // ── Storage ─────────────────────────────────────────────────────────────────
  /** localStorage key for column sizing */
  columnStorageName: string;
  /** localStorage key used when info panel is open */
  columnInfoPanelStorageName?: string;

  // ── Layout ──────────────────────────────────────────────────────────────────
  /** Whether the info panel is currently visible */
  infoPanelVisible?: boolean;
  /** Inline editing mode — hides resize handles */
  isIndexEditingMode?: boolean;
  /** RTL resize direction */
  columnResizeDirection?: "ltr" | "rtl";
  /** Additional CSS class for the container div */
  className?: string;
  /** Forwarded ref for the container div */
  forwardedRef?: React.RefObject<HTMLDivElement | null>;
  /** Notifies parent when hideColumns state changes */
  setHideColumns?: (hide: boolean) => void;

  // ── Sorting ─────────────────────────────────────────────────────────────────
  /** Controlled sorting state */
  sorting?: SortingState;
  /** Sorting change handler */
  onSortingChange?: OnChangeFn<SortingState>;

  // ── Column events ───────────────────────────────────────────────────────────
  /** Called when column visibility changes */
  onColumnVisibilityChange?: (visibility: VisibilityState) => void;
  /** Called when a resize gesture ends */
  onColumnSizingChange?: (sizing: ColumnSizingState) => void;

  // ── Header ──────────────────────────────────────────────────────────────────
  /** External sort key (e.g. "title", "membersCount") */
  activeSortBy?: string;
  /** External sort direction */
  activeSortOrder?: string;
  /** Whether to render the settings gear button (default: true) */
  showSettings?: boolean;
  /** Title attribute for the settings icon button */
  settingsTitle?: string;
  /** Custom render prop for the settings dropdown content */
  renderSettings?: TableHeaderProps["renderSettings"];
  /** Forwarded ref for header width measurement */
  tagRef?: React.Ref<HTMLDivElement>;
  /** Additional CSS class for the header */
  headerClassName?: string;

  // ── Body ────────────────────────────────────────────────────────────────────
  /**
   * Total number of rows for the virtualizer.
   * Defaults to data.length.
   */
  itemCount?: number;
  /** Whether there are more rows to load */
  hasMore?: boolean;
  /** Whether a load is currently in progress */
  isLoading?: boolean;
  /** Called when the user scrolls near the end of loaded rows */
  fetchMore?: () => void;
  /** Row height in pixels (default: 48) */
  itemHeight?: number;
  /** Virtualizer overscan count (default: 20) */
  overscan?: number;
  /** Ref to the scroll container (takes priority over scrollContainerSelector) */
  scrollElementRef?: React.RefObject<HTMLElement | null>;
  /** CSS selector for the scroll container element */
  scrollContainerSelector?: string;
  /** Additional CSS class for the body wrapper */
  bodyClassName?: string;
  /**
   * antd-style row event handler.
   * Returns HTML attributes applied to the virtual row div.
   */
  onRow?: TableBodyProps<TData>["onRow"];
  /**
   * Renders content inside the last (settings/actions) column for each row.
   */
  rowActions?: TableBodyProps<TData>["rowActions"];
}
