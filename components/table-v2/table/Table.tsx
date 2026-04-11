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

import React from "react";

import type {
  SortingState,
  OnChangeFn,
  VisibilityState,
  ColumnSizingState,
} from "@tanstack/react-table";

import { TableContainer } from "../table-container";
import { TableHeader, type TableHeaderProps } from "../table-header";
import { TableBody } from "../table-body";
import type { TTableColumnDef } from "../Table.types";
import type { TableBodyProps } from "../table-body";

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

/**
 * Single-entry-point table component.
 *
 * Wraps TableContainer + TableHeader + TableBody and exposes their combined
 * API as a flat props object so consumers never need to import or compose the
 * sub-components directly.
 */
export function Table<TData>({
  // data & columns
  data,
  columns,

  // container
  columnStorageName,
  columnInfoPanelStorageName,
  infoPanelVisible,
  isIndexEditingMode,
  columnResizeDirection,
  className,
  forwardedRef,
  setHideColumns,
  sorting,
  onSortingChange,
  onColumnVisibilityChange,
  onColumnSizingChange,

  // header
  activeSortBy,
  activeSortOrder,
  showSettings,
  settingsTitle,
  renderSettings,
  tagRef,
  headerClassName,

  // body
  itemCount,
  hasMore,
  isLoading,
  fetchMore,
  itemHeight,
  overscan,
  scrollElementRef,
  scrollContainerSelector,
  bodyClassName,
  onRow,
  rowActions,
}: TableProps<TData>) {
  return (
    <TableContainer
      columns={columns}
      columnStorageName={columnStorageName}
      columnInfoPanelStorageName={columnInfoPanelStorageName}
      infoPanelVisible={infoPanelVisible}
      isIndexEditingMode={isIndexEditingMode}
      columnResizeDirection={columnResizeDirection}
      className={className}
      forwardedRef={forwardedRef}
      setHideColumns={setHideColumns}
      sorting={sorting}
      onSortingChange={onSortingChange}
      onColumnVisibilityChange={onColumnVisibilityChange}
      onColumnSizingChange={onColumnSizingChange}
    >
      <TableHeader
        activeSortBy={activeSortBy}
        activeSortOrder={activeSortOrder}
        showSettings={showSettings}
        settingsTitle={settingsTitle}
        renderSettings={renderSettings}
        tagRef={tagRef}
        className={headerClassName}
      />
      <TableBody
        data={data}
        columns={columns}
        itemCount={itemCount}
        hasMore={hasMore}
        isLoading={isLoading}
        fetchMore={fetchMore}
        itemHeight={itemHeight}
        overscan={overscan}
        scrollElementRef={scrollElementRef}
        scrollContainerSelector={scrollContainerSelector}
        className={bodyClassName}
        onRow={onRow}
        rowActions={rowActions}
      />
    </TableContainer>
  );
}
