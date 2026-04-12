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
  ColumnSizingState,
  VisibilityState,
  SortingState,
  OnChangeFn,
} from "@tanstack/react-table";

import type { TTableColumn } from "../Table.types";

// React.CSSProperties doesn't include custom properties by default.
export interface TableContainerStyle extends React.CSSProperties {
  "--table-gtc": string;
}

export interface TableContainerProps<TData = unknown> {
  /** Column definitions (TTableColumn shape) */
  columns: TTableColumn[];
  /** Row data (optional — body uses children-as-function for actual rendering) */
  data?: TData[];
  /** localStorage key for column sizing */
  columnStorageName: string;
  /** localStorage key used when info panel is open */
  columnInfoPanelStorageName?: string;
  /** Whether the info panel is currently visible */
  infoPanelVisible?: boolean;
  /** Inline editing mode — hides resize handles */
  isIndexEditingMode?: boolean;
  /** Controlled sorting state */
  sorting?: SortingState;
  /** Sorting change handler */
  onSortingChange?: OnChangeFn<SortingState>;
  /** Called when column visibility changes */
  onColumnVisibilityChange?: (visibility: VisibilityState) => void;
  /** Called when a resize gesture ends */
  onColumnSizingChange?: (sizing: ColumnSizingState) => void;
  /** Notifies parent when hideColumns state changes */
  setHideColumns?: (hide: boolean) => void;
  /** RTL resize direction */
  columnResizeDirection?: "ltr" | "rtl";
  /** Additional CSS class for the container div */
  className?: string;
  /** Forwarded ref for the container div */
  forwardedRef?: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}
