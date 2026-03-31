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

import type {
  ColumnSizingState,
  VisibilityState,
} from "@tanstack/react-table";

/**
 * Column persistence configuration passed to useColumnPersistence.
 */
export interface ColumnPersistenceConfig {
  /** localStorage key for column sizes (e.g. "groupsColumnsSize_ver-6=userId") */
  columnStorageName: string;
  /** localStorage key for column sizes when info panel is open */
  columnInfoPanelStorageName?: string;
  /** Whether the info panel is currently visible */
  infoPanelVisible?: boolean;
}

/**
 * State shape stored in localStorage for column sizes.
 */
export interface PersistedColumnState {
  sizing: ColumnSizingState;
  visibility: VisibilityState;
}

/**
 * Return type of useColumnPersistence hook.
 */
export interface ColumnPersistenceResult {
  /** Initial column sizing loaded from localStorage */
  initialSizing: ColumnSizingState;
  /** Save current sizing state to localStorage */
  saveSizing: (sizing: ColumnSizingState) => void;
  /** Initial column visibility loaded from localStorage */
  initialVisibility: VisibilityState;
  /** Save current visibility state to localStorage */
  saveVisibility: (visibility: VisibilityState) => void;
}

/**
 * Configuration for the infinite scroll hook.
 */
export interface InfiniteScrollConfig {
  /** Whether there are more items to load */
  hasMore: boolean;
  /** Whether a fetch is currently in progress */
  isLoading: boolean;
  /** Callback to load more items */
  loadMore: () => void;
  /** Distance from bottom (in px) to trigger loading. Default: 300 */
  threshold?: number;
}

/**
 * Default column sizing constants matching the legacy table.
 */
export const TABLE_DEFAULTS = {
  MIN_COLUMN_SIZE: 110,
  MIN_NAME_COLUMN_SIZE: 210,
  SETTINGS_COLUMN_SIZE: 24,
  HEADER_HEIGHT: 40,
  NAME_COLUMN_PERCENT: 40,
  OTHER_COLUMNS_PERCENT: 60,
} as const;
