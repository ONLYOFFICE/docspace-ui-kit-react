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

import React, { createContext, use } from "react";

import type { Table, ColumnSizingState } from "@tanstack/react-table";

interface TableContextValue {
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
  /** Ref attached to the header div — used by useColumnResize for DOM mutations */
  headerRef: React.RefObject<HTMLDivElement | null>;
  /**
   * Returns the mousedown handler for the resize handle at visual column index
   * `colIndex`. Called by TableHeader for each non-last, resizable column.
   */
  onResizeMouseDown: (colIndex: number) => (e: React.MouseEvent) => void;
}

const TableContext = createContext<TableContextValue | null>(null);

export const TableProvider = TableContext.Provider;

/**
 * Hook to access the table context. Must be used inside a TableContainer.
 */
export function useTableCtx(): TableContextValue {
  const ctx = use(TableContext);
  if (!ctx) {
    throw new Error("useTableCtx must be used inside a TableContainer");
  }
  return ctx;
}
